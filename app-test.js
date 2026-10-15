// Góc Luyện SAT — Thi thử có bấm giờ (mô phỏng một module Digital SAT) và thẻ từ vựng.
(function () {
  "use strict";
  var App = window.App, $ = App.$, $$ = App.$$, esc = App.esc;

  var SPEC = {
    rw: { full: { n: 27, min: 32 }, short: { n: 10, min: 12, mix: { craft: 3, info: 3, conv: 2, expr: 2 } }, order: ["craft", "info", "conv", "expr"] },
    math: { full: { n: 22, min: 35 }, short: { n: 10, min: 16, mix: { alg: 4, adv: 3, psda: 2, geo: 1 } }, order: null }
  };
  var T = { phase: "pick", sec: "rw", short: false, qs: [], resp: [], flags: [], struck: [], idx: 0, startAt: 0, endAt: 0, timer: null, hideTime: false, elim: false, result: null, view: null };

  function buildModule(sec, short) {
    var all = App.bank().filter(function (q) { return q.sec === sec; });
    var list = all;
    if (short) {
      var mix = SPEC[sec].short.mix;
      list = [];
      Object.keys(mix).forEach(function (d) {
        list = list.concat(App.shuffle(all.filter(function (q) { return q.dom === d; })).slice(0, mix[d]));
      });
    }
    var order = SPEC[sec].order;
    var rand = {};
    list.forEach(function (q) { rand[q.id] = Math.random(); });
    return list.slice().sort(function (a, b) {
      if (order) { var d = order.indexOf(a.dom) - order.indexOf(b.dom); if (d) return d; }
      return a.diff - b.diff || rand[a.id] - rand[b.id];
    });
  }

  // ---------- Chọn đề ----------
  function renderPick(root) {
    function opt(sec, title, doms, tools) {
      var f = SPEC[sec].full, s = SPEC[sec].short;
      return '<div class="card test-option"><div class="eyebrow">Module 1</div><h2>' + title + "</h2>" +
        "<dl><dt>Bản đầy đủ</dt><dd>" + f.n + " câu · " + f.min + " phút</dd><dt>Bản rút gọn</dt><dd>" + s.n + " câu · " + s.min + " phút</dd>" +
        "<dt>Mảng kiến thức</dt><dd>" + doms + "</dd><dt>Công cụ</dt><dd>" + tools + "</dd></dl>" +
        '<div class="row"><button class="btn btn-primary" data-start="' + sec + '">Làm bản đầy đủ</button><button class="btn" data-start-short="' + sec + '">Bản rút gọn</button></div></div>';
    }
    root.innerHTML =
      '<div class="view-head"><div><div class="eyebrow">Thi thử</div><h1>Làm một module như phòng thi thật</h1>' +
      "<p>Đồng hồ đếm ngược, đánh dấu câu để xem lại, gạch bỏ đáp án, bảng công thức cho phần Math. Hết giờ bài sẽ tự nộp. Điểm quy về thang 200–800 chỉ mang tính ước lượng.</p></div></div>" +
      '<div class="test-pick">' + opt("rw", "Reading and Writing", "4", "Gạch bỏ, đánh dấu") + opt("math", "Math", "4", "Bảng công thức, Desmos") + "</div>";
    $$("[data-start]", root).forEach(function (b) { b.onclick = function () { App.views.test.openIntro(b.dataset.start, false); }; });
    $$("[data-start-short]", root).forEach(function (b) { b.onclick = function () { App.views.test.openIntro(b.dataset.startShort, true); }; });
  }

  function renderIntro(root) {
    var sp = SPEC[T.sec][T.short ? "short" : "full"];
    root.innerHTML =
      '<div class="card stack" style="max-width:680px">' +
      '<div class="eyebrow">' + App.SECTIONS[T.sec] + (T.short ? " · bản rút gọn" : " · Module 1") + "</div>" +
      "<h1>" + sp.n + " câu trong " + sp.min + " phút</h1>" +
      '<ul style="margin:0;padding-left:20px;color:var(--ink-2)">' +
      "<li>Đồng hồ bắt đầu chạy khi bạn bấm “Bắt đầu”. Có thể ẩn đồng hồ nếu thấy áp lực.</li>" +
      "<li>Bấm <b>Đánh dấu</b> để quay lại câu chưa chắc. Bấm số câu ở thanh dưới để xem toàn bộ đề.</li>" +
      (T.sec === "math"
        ? "<li>Câu tự điền: nhập số nguyên, thập phân hoặc phân số. Được dùng máy tính cầm tay hoặc Desmos.</li>"
        : "<li>Bật <b>Gạch bỏ</b> để loại trừ các đáp án chắc chắn sai.</li>") +
      "<li>Không có điểm trừ khi sai, nên đừng bỏ trống câu nào.</li></ul>" +
      '<div class="row"><button class="btn btn-primary" id="t-begin">Bắt đầu</button><button class="btn btn-ghost" id="t-back">Chọn đề khác</button></div></div>';
    $("#t-begin", root).onclick = begin;
    $("#t-back", root).onclick = function () { T.phase = "pick"; App.views.test.render(); };
  }

  function begin() {
    var sp = SPEC[T.sec][T.short ? "short" : "full"];
    T.qs = buildModule(T.sec, T.short);
    T.resp = T.qs.map(function () { return null; });
    T.flags = T.qs.map(function () { return false; });
    T.struck = T.qs.map(function () { return {}; });
    T.idx = 0; T.elim = false; T.hideTime = false; T.result = null; T.view = null;
    T.startAt = Date.now();
    T.endAt = T.startAt + sp.min * 60 * 1000;
    T.phase = "run";
    clearInterval(T.timer);
    T.timer = setInterval(tick, 1000);
    App.views.test.render();
    window.scrollTo(0, 0);
  }
  function tick() {
    var left = (T.endAt - Date.now()) / 1000;
    if (left <= 0) { finish(true); return; }
    var el = $("#t-timer");
    if (el) { el.textContent = T.hideTime ? "··:··" : App.fmtTime(left); el.classList.toggle("warn", left < 300 && !T.hideTime); }
    if (Math.round(left) === 300) App.toast("Còn 5 phút.");
  }

  // ---------- Làm bài ----------
  function renderRun(root) {
    var q = T.qs[T.idx], n = T.qs.length;
    var left = (T.endAt - Date.now()) / 1000;
    var st = { sel: T.resp[T.idx], struck: T.struck[T.idx], reveal: false, elim: T.elim && q.type !== "spr" };
    var flag = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1v10M2 1h7l-2 2.5L9 6H2" fill="' + (T.flags[T.idx] ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="1.4"/></svg>';
    var top = '<div class="q-top"><div class="row"><span class="q-num">' + (T.idx + 1) + "</span>" +
      '<button type="button" class="flag-btn" id="t-flag" aria-pressed="' + T.flags[T.idx] + '">' + flag + (T.flags[T.idx] ? "Đã đánh dấu" : "Đánh dấu") + "</button></div>" +
      (q.type !== "spr" ? '<button type="button" class="flag-btn" id="t-elim" aria-pressed="' + T.elim + '" title="Gạch bỏ đáp án"><s>ABC</s> Gạch bỏ</button>' : "") + "</div>";
    var qhtml = top + '<div class="stack"><div class="qtext' + (q.sec === "math" ? " math" : "") + '">' + App.html(q, "q") + "</div>" + App.choicesHTML(q, st) + "</div>";
    var body = q.sec === "rw"
      ? '<div class="split"><div class="pane"><div class="passage">' + App.html(q, "p") + '</div></div><div class="pane">' + qhtml + "</div></div>"
      : '<div style="max-width:760px;margin:0 auto">' + qhtml + "</div>";

    root.innerHTML =
      '<div class="test-shell">' +
      '<div class="test-bar"><div class="test-title">' + App.SECTIONS[T.sec] + (T.short ? " · rút gọn" : " · Module 1") + "</div>" +
      '<div class="row" style="gap:6px"><span class="timer' + (left < 300 && !T.hideTime ? " warn" : "") + '" id="t-timer" aria-live="off">' + (T.hideTime ? "··:··" : App.fmtTime(left)) + "</span>" +
      '<button class="btn btn-sm btn-ghost" id="t-hide">' + (T.hideTime ? "Hiện giờ" : "Ẩn giờ") + "</button></div>" +
      '<div class="test-tools">' + (T.sec === "math"
        ? '<button class="btn btn-sm" id="t-ref">Bảng công thức</button><a class="btn btn-sm" href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Desmos ↗</a>'
        : "") + '<button class="btn btn-sm btn-primary" id="t-submit">Nộp bài</button></div></div>' +
      '<div class="test-body">' + body + "</div>" +
      '<div class="test-foot"><button class="btn btn-sm" id="t-nav">Câu ' + (T.idx + 1) + " / " + n + " ▴</button>" +
      '<div class="row"><button class="btn btn-sm" id="t-prev"' + (T.idx === 0 ? " disabled" : "") + ">Câu trước</button>" +
      '<button class="btn btn-sm btn-primary" id="t-next">' + (T.idx === n - 1 ? "Xem lại &amp; nộp" : "Câu sau") + "</button></div></div></div>";

    $$("[data-choice]", root).forEach(function (b) {
      b.onclick = function () {
        var i = +b.dataset.choice;
        if (T.struck[T.idx][i]) delete T.struck[T.idx][i];
        T.resp[T.idx] = T.resp[T.idx] === i ? null : i;
        renderRun(root);
      };
    });
    $$("[data-elim]", root).forEach(function (b) {
      b.onclick = function () {
        var i = +b.dataset.elim, s = T.struck[T.idx];
        if (s[i]) delete s[i]; else { s[i] = true; if (T.resp[T.idx] === i) T.resp[T.idx] = null; }
        renderRun(root);
      };
    });
    var inp = $("#spr-" + q.id, root);
    if (inp) inp.oninput = function () { T.resp[T.idx] = inp.value.trim() ? inp.value : null; };
    $("#t-flag", root).onclick = function () { T.flags[T.idx] = !T.flags[T.idx]; renderRun(root); };
    var el = $("#t-elim", root); if (el) el.onclick = function () { T.elim = !T.elim; renderRun(root); };
    $("#t-hide", root).onclick = function () { T.hideTime = !T.hideTime; renderRun(root); };
    var ref = $("#t-ref", root); if (ref) ref.onclick = openReference;
    $("#t-submit", root).onclick = openNavigator;
    $("#t-nav", root).onclick = openNavigator;
    $("#t-prev", root).onclick = function () { go(T.idx - 1); };
    $("#t-next", root).onclick = function () { if (T.idx === T.qs.length - 1) openNavigator(); else go(T.idx + 1); };
  }
  function go(i) {
    if (i < 0 || i >= T.qs.length) return;
    T.idx = i;
    App.views.test.render();
    var shell = $(".test-shell");
    if (shell && shell.getBoundingClientRect().top < 0) shell.scrollIntoView();
  }

  function openNavigator() {
    var answered = T.resp.filter(function (r) { return r != null && r !== ""; }).length;
    var flagged = T.flags.filter(Boolean).length;
    App.openModal(
      '<div class="modal-head"><h2 id="modal-title">Xem lại bài làm</h2><button class="btn btn-sm btn-ghost" data-close>Đóng</button></div>' +
      '<p class="muted">Đã trả lời ' + answered + "/" + T.qs.length + " câu" + (flagged ? " · " + flagged + " câu đã đánh dấu" : "") + ". Bấm vào số câu để chuyển tới câu đó.</p>" +
      '<div class="navgrid">' + T.qs.map(function (q, i) {
        var c = (T.resp[i] != null && T.resp[i] !== "" ? " is-answered" : "") + (T.flags[i] ? " is-flagged" : "") + (i === T.idx ? " is-current" : "");
        return '<button type="button" class="' + c.trim() + '" data-jump="' + i + '" aria-label="Câu ' + (i + 1) + '">' + (i + 1) + "</button>";
      }).join("") + "</div>" +
      '<div class="legend"><span>■ Đã trả lời</span><span>□ Chưa trả lời</span><span style="color:var(--flag)">● Đã đánh dấu</span></div>' +
      '<div class="row" style="justify-content:flex-end">' +
      (answered < T.qs.length ? '<span class="muted" style="font-size:13px">Còn ' + (T.qs.length - answered) + " câu bỏ trống.</span>" : "") +
      '<button class="btn btn-primary" id="t-final">Nộp bài</button></div>',
      function (m) {
        $$("[data-jump]", m).forEach(function (b) { b.onclick = function () { App.closeModal(); go(+b.dataset.jump); }; });
        $("#t-final", m).onclick = function () { App.closeModal(); finish(false); };
      }
    );
  }

  function openReference() {
    var items = [
      ["Hình tròn", "A = πr², C = 2πr"], ["Hình chữ nhật", "A = ℓw"], ["Tam giác", "A = ½bh"],
      ["Định lý Pythagoras", "c² = a² + b²"], ["Tam giác 30°-60°-90°", "x, x√3, 2x"], ["Tam giác 45°-45°-90°", "s, s, s√2"],
      ["Hình hộp chữ nhật", "V = ℓwh"], ["Hình trụ", "V = πr²h"], ["Hình cầu", "V = ⁴⁄₃πr³"],
      ["Hình nón", "V = ⅓πr²h"], ["Hình chóp", "V = ⅓ℓwh"], ["Đường tròn", "360° = 2π radian"]
    ];
    App.openModal(
      '<div class="modal-head"><h2 id="modal-title">Bảng công thức</h2><button class="btn btn-sm btn-ghost" data-close>Đóng</button></div>' +
      '<div class="ref-grid">' + items.map(function (it) { return "<div><b>" + it[0] + "</b><span>" + it[1] + "</span></div>"; }).join("") + "</div>" +
      '<p class="muted" style="font-size:13px">Tổng ba góc trong một tam giác bằng 180°.</p>'
    );
  }

  function finish(auto) {
    if (T.phase !== "run") return;
    clearInterval(T.timer);
    var secs = Math.min((Date.now() - T.startAt) / 1000, (T.endAt - T.startAt) / 1000);
    var correct = 0, dom = {};
    T.qs.forEach(function (q, i) {
      var ok = App.isCorrect(q, T.resp[i]);
      if (ok) correct += 1;
      dom[q.dom] = dom[q.dom] || { n: 0, c: 0 };
      dom[q.dom].n += 1; if (ok) dom[q.dom].c += 1;
      App.record(q, ok);
    });
    var score = App.sectionScore(correct, T.qs.length);
    T.result = { correct: correct, total: T.qs.length, score: score, secs: secs, dom: dom, auto: auto };
    App.addTest({ sec: T.sec, short: T.short, date: Date.now(), correct: correct, total: T.qs.length, score: score, secs: Math.round(secs) });
    T.phase = "result"; T.view = null;
    App.views.test.render();
    window.scrollTo(0, 0);
    if (auto) App.toast("Hết giờ, bài đã được nộp.");
  }

  // ---------- Kết quả ----------
  function renderResult(root) {
    var r = T.result;
    var doms = Object.keys(r.dom).map(function (k) {
      var d = r.dom[k], pct = Math.round((100 * d.c) / d.n);
      return '<div class="dom-row"><div class="dom-name">' + esc(App.DOMAINS[k].vi) + "<small>" + esc(App.DOMAINS[k].name) + "</small></div>" +
        '<div class="dom-bar"><span class="' + (pct < 50 ? "low" : pct < 75 ? "mid" : "high") + '" style="width:' + pct + '%"></span></div>' +
        '<div class="dom-val">' + d.c + "/" + d.n + "</div></div>";
    }).join("");
    var grid = T.qs.map(function (q, i) {
      var ok = App.isCorrect(q, T.resp[i]);
      return '<button type="button" class="' + (ok ? "r-ok" : "r-bad") + (T.view === i ? " is-current" : "") + '" data-see="' + i + '" aria-label="Câu ' + (i + 1) + (ok ? " đúng" : " sai") + '">' + (i + 1) + "</button>";
    }).join("");
    var detail = "";
    if (T.view != null) {
      var q = T.qs[T.view];
      detail = '<div class="card qcard" id="t-detail"><div class="row" style="justify-content:space-between"><span class="q-num">' + (T.view + 1) + "</span>" + App.metaHTML(q) + "</div>" +
        (q.p ? '<div class="passage">' + App.html(q, "p") + "</div>" : "") +
        '<div class="qtext' + (q.sec === "math" ? " math" : "") + '">' + App.html(q, "q") + "</div>" +
        App.choicesHTML(q, { sel: T.resp[T.view], reveal: true }) + App.explainHTML(q, T.resp[T.view]) + App.tutorHTML() + "</div>";
    }
    root.innerHTML =
      '<div class="card result-hero"><div class="result-score"><small>Điểm ước tính</small><div class="score-big">' + r.score + "</div><small>trên thang 200–800</small></div>" +
      '<div class="stack"><div class="eyebrow">' + App.SECTIONS[T.sec] + (T.short ? " · rút gọn" : " · Module 1") + "</div>" +
      "<h1>Đúng " + r.correct + " / " + r.total + " câu</h1>" +
      '<p class="muted">Thời gian làm bài ' + App.fmtTime(r.secs) + (r.auto ? " (hết giờ, tự nộp)" : "") + ". Bấm vào từng câu bên dưới để xem lời giải.</p>" +
      '<div class="row"><button class="btn btn-primary" id="t-again">Làm đề khác</button><button class="btn" id="t-home">Về tổng quan</button></div></div></div>' +
      '<div class="grid-2"><div class="card stack"><h2>Theo mảng kiến thức</h2><div class="dom-group">' + doms + "</div></div>" +
      '<div class="card stack"><h2>Từng câu</h2><div class="navgrid">' + grid + '</div><div class="legend"><span style="color:var(--ok)">■ Đúng</span><span style="color:var(--bad)">■ Sai hoặc bỏ trống</span></div></div></div>' +
      detail;
    $("#t-again", root).onclick = function () { T.phase = "pick"; App.views.test.render(); };
    $("#t-home", root).onclick = function () { T.phase = "pick"; App.show("home"); };
    $$("[data-see]", root).forEach(function (b) {
      b.onclick = function () {
        T.view = +b.dataset.see;
        renderResult(root);
        var d = $("#t-detail", root);
        if (d) { App.bindTutor(d, T.qs[T.view], T.resp[T.view]); d.scrollIntoView({ block: "start" }); }
      };
    });
    if (T.view != null) App.bindTutor($("#t-detail", root), T.qs[T.view], T.resp[T.view]);
  }

  App.views.test = {
    render: function () {
      var root = $("#v-test");
      if (T.phase === "run") renderRun(root);
      else if (T.phase === "intro") renderIntro(root);
      else if (T.phase === "result" && T.result) renderResult(root);
      else { T.phase = "pick"; renderPick(root); }
    },
    refresh: function () { if (T.phase !== "run") App.views.test.render(); },
    openIntro: function (sec, short) { T.sec = sec; T.short = !!short; T.phase = "intro"; App.views.test.render(); }
  };

  // ---------- Từ vựng ----------
  var V = { idx: 0, flipped: false, filter: "all" };
  function deck() {
    var known = App.state().vocab;
    var all = window.SAT_VOCAB || [];
    return V.filter === "learning" ? all.filter(function (w) { return !known[w.w]; }) : all;
  }
  App.views.vocab = {
    render: function () {
      var root = $("#v-vocab");
      var all = window.SAT_VOCAB || [], known = App.state().vocab;
      var nKnown = all.filter(function (w) { return known[w.w]; }).length;
      var d = deck();
      if (V.idx >= d.length) V.idx = 0;
      var w = d[V.idx];
      var card = w
        ? '<button type="button" class="flash" id="f-card" aria-label="Lật thẻ">' +
          (V.flipped
            ? '<div class="flash-back"><div class="flash-type">' + esc(w.w) + " · " + esc(w.t) + '</div><div class="mean">' + esc(w.m) + '</div><div class="ex">' + esc(w.e) + "</div></div>"
            : '<div class="stack" style="justify-items:center"><div class="flash-word">' + esc(w.w) + '</div><div class="flash-type">' + esc(w.t) + " · bấm để xem nghĩa</div></div>") +
          "</button>"
        : '<div class="card"><p class="empty">Bạn đã thuộc hết các từ trong bộ này. Chuyển sang “Tất cả” để ôn lại.</p></div>';
      root.innerHTML =
        '<div class="view-head"><div><div class="eyebrow">Từ vựng</div><h1>Từ học thuật hay gặp</h1>' +
        "<p>Digital SAT kiểm tra từ trong ngữ cảnh. Học nghĩa kèm câu ví dụ, rồi áp dụng ở dạng Words in Context của phần Luyện tập.</p></div>" +
        '<div class="row"><button class="chip" data-vf="all" aria-pressed="' + (V.filter === "all") + '">Tất cả (' + all.length + ")</button>" +
        '<button class="chip" data-vf="learning" aria-pressed="' + (V.filter === "learning") + '">Chưa thuộc (' + (all.length - nKnown) + ")</button></div></div>" +
        '<div class="flash-wrap">' + card +
        (w ? '<div class="flash-count">' + (V.idx + 1) + " / " + d.length + " · đã thuộc " + nKnown + "/" + all.length + "</div>" +
          '<div class="row" style="justify-content:center"><button class="btn btn-ghost" id="f-prev" aria-label="Từ trước">←</button>' +
          '<button class="btn" id="f-no">Chưa thuộc</button><button class="btn btn-primary" id="f-yes">Đã thuộc</button>' +
          '<button class="btn btn-ghost" id="f-next" aria-label="Từ sau">→</button></div>' +
          '<span class="kbd">Phím cách để lật thẻ · ← → để chuyển từ</span>' : "") + "</div>";

      $$("[data-vf]", root).forEach(function (b) { b.onclick = function () { V.filter = b.dataset.vf; V.idx = 0; V.flipped = false; App.views.vocab.render(); }; });
      if (!w) return;
      $("#f-card", root).onclick = function () { V.flipped = !V.flipped; App.views.vocab.render(); };
      $("#f-prev", root).onclick = function () { move(-1); };
      $("#f-next", root).onclick = function () { move(1); };
      $("#f-yes", root).onclick = function () { mark(w, true); };
      $("#f-no", root).onclick = function () { mark(w, false); };
    }
  };
  function move(step) {
    var n = deck().length;
    if (!n) return;
    V.idx = (V.idx + step + n) % n;
    V.flipped = false;
    App.views.vocab.render();
  }
  function mark(w, yes) {
    var known = App.state().vocab;
    if (yes) known[w.w] = 1; else delete known[w.w];
    App.save();
    V.flipped = false;
    if (V.filter === "learning" && yes) { if (V.idx >= deck().length) V.idx = 0; App.views.vocab.render(); }
    else move(1);
  }
  document.addEventListener("keydown", function (e) {
    if (App.current !== "vocab" || !$("#overlay").hidden) return;
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    if (e.key === "ArrowRight") move(1);
    else if (e.key === "ArrowLeft") move(-1);
    else if (e.key === " " && (!t || t.tagName !== "BUTTON")) { e.preventDefault(); V.flipped = !V.flipped; App.views.vocab.render(); }
  });

  App.boot();
})();
