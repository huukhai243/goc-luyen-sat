// Góc Luyện SAT — Luyện tập theo chủ đề, tạo câu hỏi bằng AI, Ôn câu sai.
(function () {
  "use strict";
  var App = window.App, $ = App.$, $$ = App.$$, esc = App.esc;

  var P = { mode: "setup", sec: "all", dom: "all", diff: 0, count: 10, onlyNew: false, queue: [], idx: 0, sel: null, revealed: false, results: [], ai: false, gen: null, genMsg: "" };

  function matching() {
    var ans = App.state().answers;
    return App.bank().filter(function (q) {
      if (P.sec !== "all" && q.sec !== P.sec) return false;
      if (P.dom !== "all" && q.dom !== P.dom) return false;
      if (P.diff && q.diff !== P.diff) return false;
      if (P.onlyNew && ans[q.id]) return false;
      return true;
    });
  }
  function start(list, ai) {
    P.queue = list; P.idx = 0; P.sel = null; P.revealed = false; P.results = []; P.ai = !!ai; P.mode = "run";
    App.views.practice.render();
  }
  function chip(group, value, label, on) {
    return '<button type="button" class="chip" data-' + group + '="' + value + '" aria-pressed="' + on + '">' + label + "</button>";
  }

  // ---------- Thiết lập ----------
  function renderSetup(root) {
    var list = matching();
    var n = P.count ? Math.min(P.count, list.length) : list.length;
    var doms = Object.keys(App.DOMAINS).filter(function (k) { return P.sec === "all" || App.DOMAINS[k].sec === P.sec; });
    root.innerHTML =
      '<div class="view-head"><div><div class="eyebrow">Luyện tập</div><h1>Luyện theo từng mảng kiến thức</h1>' +
      "<p>Chọn phần thi, mảng và độ khó. Mỗi câu có lời giải tiếng Việt ngay sau khi bạn kiểm tra đáp án.</p></div></div>" +
      '<div class="grid-2"><div class="card setup">' +
      '<div class="setup-group"><span class="eyebrow">Phần thi</span><div class="row">' +
      chip("sec", "all", "Cả hai", P.sec === "all") + chip("sec", "rw", "Reading &amp; Writing", P.sec === "rw") + chip("sec", "math", "Math", P.sec === "math") + "</div></div>" +
      '<div class="setup-group"><span class="eyebrow">Mảng kiến thức</span><div class="row">' + chip("dom", "all", "Tất cả", P.dom === "all") +
      doms.map(function (k) { return chip("dom", k, esc(App.DOMAINS[k].vi), P.dom === k); }).join("") + "</div></div>" +
      '<div class="setup-group"><span class="eyebrow">Độ khó</span><div class="row">' +
      chip("diff", 0, "Tất cả", P.diff === 0) + chip("diff", 1, "Dễ", P.diff === 1) + chip("diff", 2, "Vừa", P.diff === 2) + chip("diff", 3, "Khó", P.diff === 3) + "</div></div>" +
      '<div class="setup-group"><span class="eyebrow">Số câu mỗi lượt</span><div class="row">' +
      chip("count", 5, "5", P.count === 5) + chip("count", 10, "10", P.count === 10) + chip("count", 0, "Tất cả", P.count === 0) + "</div></div>" +
      '<label class="check"><input type="checkbox" id="only-new"' + (P.onlyNew ? " checked" : "") + "> Chỉ lấy câu chưa làm</label>" +
      '<div class="row" style="justify-content:space-between"><span class="muted">' + list.length + " câu phù hợp</span>" +
      '<button class="btn btn-primary" id="p-start"' + (n ? "" : " disabled") + ">Bắt đầu " + (n ? n + " câu" : "") + "</button></div></div>" +
      aiCard() + "</div>";

    $$("[data-sec]", root).forEach(function (b) { b.onclick = function () { P.sec = b.dataset.sec; P.dom = "all"; renderSetup(root); }; });
    $$("[data-dom]", root).forEach(function (b) { b.onclick = function () { P.dom = b.dataset.dom; renderSetup(root); }; });
    $$("[data-diff]", root).forEach(function (b) { b.onclick = function () { P.diff = +b.dataset.diff; renderSetup(root); }; });
    $$("[data-count]", root).forEach(function (b) { b.onclick = function () { P.count = +b.dataset.count; renderSetup(root); }; });
    $("#only-new", root).onchange = function (e) { P.onlyNew = e.target.checked; renderSetup(root); };
    $("#p-start", root).onclick = function () {
      var picked = App.shuffle(matching());
      start(P.count ? picked.slice(0, P.count) : picked, false);
    };
    bindAiCard(root);
  }

  // ---------- Tạo câu hỏi bằng AI ----------
  function aiCard() {
    if (!App.sample) {
      return '<div class="card stack"><h2>Hết câu trong ngân hàng?</h2><p class="muted">Khi mở trang này trong Claude, bạn có thể nhờ AI tạo thêm câu hỏi mới theo đúng mảng và độ khó đã chọn, kèm lời giải tiếng Việt. ' +
        "Ngoài ra, phần Thi thử và Ôn câu sai giúp bạn quay lại những câu đã làm.</p></div>";
    }
    return '<div class="card stack" data-ai><h2>Tạo câu hỏi mới bằng AI</h2>' +
      '<p class="muted">Claude soạn một câu mới theo phần thi, mảng và độ khó bạn chọn bên trái, có lời giải tiếng Việt. Câu do AI tạo có thể chứa sai sót — hãy đọc kỹ lời giải.</p>' +
      '<div class="row"><button class="btn btn-pencil" id="ai-gen"' + (P.gen ? " disabled" : "") + ">" + (P.gen ? "Đang tạo…" : "Tạo câu mới") + "</button>" +
      '<button class="btn btn-ghost btn-sm" id="ai-stop"' + (P.gen ? "" : " hidden") + ">Dừng</button></div>" +
      '<p class="muted" id="ai-msg" style="font-size:13px">' + esc(P.genMsg) + "</p></div>";
  }
  function bindAiCard(root) {
    var g = $("#ai-gen", root), s = $("#ai-stop", root);
    if (g) g.onclick = function () { generate(); };
    if (s) s.onclick = function () { if (P.gen) P.gen.abort(); };
  }

  var HINT = {
    craft: "words in context, text structure and purpose, or cross-text connections",
    info: "central ideas and details, command of evidence (textual or quantitative with a small table), or inferences",
    conv: "boundaries (punctuation between clauses) or form, structure, and sense (verb agreement, tense, pronouns, modifiers)",
    expr: "transitions or rhetorical synthesis based on a student's bulleted notes",
    alg: "linear equations, linear inequalities, systems of linear equations, or linear functions",
    adv: "quadratic, exponential, polynomial, or rational equations and functions, or equivalent expressions",
    psda: "ratios, rates, percentages, units, one-variable statistics, probability, or reading a small data table",
    geo: "area and volume, lines and angles, triangles, right-triangle trigonometry, or circles"
  };
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function generate() {
    if (P.gen || !App.sample) return;
    var sec = P.sec === "all" ? pick(["rw", "math"]) : P.sec;
    var dom = P.dom !== "all" && App.DOMAINS[P.dom].sec === sec ? P.dom
      : pick(Object.keys(App.DOMAINS).filter(function (k) { return App.DOMAINS[k].sec === sec; }));
    var diff = P.diff || pick([1, 2, 3]);
    var level = { 1: "easy", 2: "medium", 3: "hard" }[diff];
    var prompt =
      "Write ONE original practice question in the style of the digital SAT " + App.SECTIONS[sec] + " section.\n" +
      "Content domain: " + App.DOMAINS[dom].name + " (" + HINT[dom] + "). Difficulty: " + level + ".\n" +
      (sec === "rw"
        ? "The passage must be original English prose of 40-130 words (never copy a real SAT item). Use ______ for a blank when the question needs one. Ask the question exactly the way the SAT words it.\n"
        : "Put any setup in \"question\" and leave \"passage\" empty unless a short data table is needed (then write the table as plain text lines). Write math in plain text: x^2 for powers, sqrt(x), a/b for fractions. Solve it yourself and check that exactly one choice is correct.\n") +
      "Four answer choices, exactly one correct, with plausible distractors based on common student mistakes.\n" +
      "Reply with only a JSON object: {\"passage\": string, \"question\": string, \"choices\": [string, string, string, string], \"answer\": 0-3 (index of the correct choice), " +
      "\"explanation\": string}. The explanation is in Vietnamese, 2-4 sentences, explaining why the answer is right and why the most tempting wrong choice is wrong. Plain text only, no HTML, no Markdown.";

    P.gen = new AbortController();
    P.genMsg = "Claude đang soạn câu hỏi… thường mất 10–40 giây.";
    refreshAi();
    App.sample.json(prompt, { signal: P.gen.signal, cache: false }).then(function (r) {
      var ok = r && typeof r.question === "string" && r.question.trim() && Array.isArray(r.choices) && r.choices.length === 4 &&
        r.choices.every(function (c) { return typeof c === "string" && c.trim(); }) && [0, 1, 2, 3].indexOf(r.answer) >= 0 && typeof r.explanation === "string";
      if (!ok) { P.genMsg = "Câu hỏi tạo ra thiếu thông tin. Bấm “Tạo câu mới” để thử lại."; return; }
      var q = {
        id: "ai-" + Date.now().toString(36), sec: sec, dom: dom, diff: diff, type: "mc", ai: true,
        p: typeof r.passage === "string" ? r.passage.trim().slice(0, 2000) : "",
        q: r.question.trim().slice(0, 1200), ch: r.choices.map(function (c) { return c.trim().slice(0, 400); }),
        a: r.answer, ex: r.explanation.trim().slice(0, 1500)
      };
      App.addAiQ(q);
      P.genMsg = "";
      if (P.mode === "run" && P.ai) { P.queue.push(q); P.idx = P.queue.length - 1; P.sel = null; P.revealed = false; }
      else { P.queue = [q]; P.idx = 0; P.sel = null; P.revealed = false; P.results = []; P.ai = true; P.mode = "run"; }
    }, function (e) {
      P.genMsg = App.aiError(e);
    }).then(function () {
      P.gen = null;
      if (App.current === "practice") App.views.practice.render();
    });
  }
  function refreshAi() {
    if (App.current !== "practice") return;
    if (P.mode === "setup") App.views.practice.render();
    var b = $("#ai-next");
    if (b) { b.disabled = true; b.textContent = "Đang tạo…"; }
    var m = $("#ai-msg");
    if (m) m.textContent = P.genMsg;
  }

  // ---------- Làm bài ----------
  function renderRun(root) {
    var q = P.queue[P.idx];
    var last = P.idx === P.queue.length - 1;
    var pct = ((P.idx + (P.revealed ? 1 : 0)) / P.queue.length) * 100;
    var st = { sel: P.sel, reveal: P.revealed, struck: null, elim: false };
    var next = "";
    if (P.revealed) {
      if (P.ai && last) next = (App.sample ? '<button class="btn btn-pencil" id="ai-next"' + (P.gen ? " disabled" : "") + ">" + (P.gen ? "Đang tạo…" : "Tạo câu tiếp theo") + "</button>" : "") +
        '<button class="btn" id="p-finish">Kết thúc</button>';
      else next = '<button class="btn btn-primary" id="p-next">' + (last ? "Xem kết quả" : "Câu tiếp theo") + "</button>";
    }
    root.innerHTML =
      '<div class="runner-head"><div class="row"><span class="eyebrow">' + (P.ai ? "Câu do AI tạo" : "Luyện tập") + '</span><span class="num">Câu ' + (P.idx + 1) + " / " + P.queue.length + "</span></div>" +
      '<button class="btn btn-sm btn-ghost" id="p-exit">Thoát</button></div>' +
      '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
      '<div class="card qcard" id="p-card">' + App.metaHTML(q) +
      (q.p ? '<div class="passage">' + App.html(q, "p") + "</div>" : "") +
      '<div class="qtext' + (q.sec === "math" ? " math" : "") + '">' + App.html(q, "q") + "</div>" +
      App.choicesHTML(q, st) +
      (P.revealed ? App.explainHTML(q, P.sel) + App.tutorHTML() : "") +
      '<div class="q-actions"><span class="kbd">' + (q.type === "spr" ? "Enter để kiểm tra" : "Phím A–D để chọn · Enter để kiểm tra") + "</span>" +
      '<div class="row">' + (P.revealed ? next : '<button class="btn btn-primary" id="p-check"' + (P.sel == null || P.sel === "" ? " disabled" : "") + ">Kiểm tra</button>") + "</div></div>" +
      (P.genMsg && P.ai ? '<p class="muted" id="ai-msg" style="font-size:13px">' + esc(P.genMsg) + "</p>" : "") + "</div>";

    $("#p-exit", root).onclick = function () { if (P.gen) P.gen.abort(); P.mode = P.results.length ? "done" : "setup"; App.views.practice.render(); };
    $$("[data-choice]", root).forEach(function (b) {
      b.onclick = function () { P.sel = +b.dataset.choice; renderRun(root); };
    });
    var inp = $("#spr-" + q.id, root);
    if (inp && !P.revealed) {
      inp.oninput = function () { P.sel = inp.value; $("#p-check", root).disabled = !inp.value.trim(); };
      inp.onkeydown = function (e) { if (e.key === "Enter" && inp.value.trim()) { e.preventDefault(); check(); } };
      inp.focus();
    }
    var c = $("#p-check", root); if (c) c.onclick = check;
    var n = $("#p-next", root); if (n) n.onclick = advance;
    var f = $("#p-finish", root); if (f) f.onclick = function () { P.mode = "done"; App.views.practice.render(); };
    var a = $("#ai-next", root); if (a) a.onclick = generate;
    if (P.revealed) App.bindTutor($("#p-card", root), q, P.sel);
  }
  function check() {
    var q = P.queue[P.idx];
    if (P.revealed || P.sel == null || P.sel === "") return;
    var ok = App.isCorrect(q, P.sel);
    App.record(q, ok);
    P.results.push({ id: q.id, ok: ok });
    P.revealed = true;
    App.views.practice.render();
  }
  function advance() {
    if (P.idx < P.queue.length - 1) { P.idx += 1; P.sel = null; P.revealed = false; }
    else P.mode = "done";
    App.views.practice.render();
    window.scrollTo(0, 0);
  }

  function renderDone(root) {
    var ok = P.results.filter(function (r) { return r.ok; }).length;
    var wrong = P.results.filter(function (r) { return !r.ok; }).map(function (r) { return App.getQ(r.id); }).filter(Boolean);
    root.innerHTML =
      '<div class="view-head"><div><div class="eyebrow">Kết quả lượt luyện</div><h1>Đúng ' + ok + " / " + P.results.length + " câu</h1>" +
      "<p>" + (P.results.length && ok === P.results.length ? "Không sai câu nào. Thử tăng độ khó hoặc làm một module thi thử." : "Các câu sai đã được lưu vào mục Ôn câu sai.") + "</p></div></div>" +
      '<div class="card stack"><ul class="review-list">' + P.results.map(function (r, i) {
        var q = App.getQ(r.id); if (!q) return "";
        return '<li class="review-item"><div class="stack" style="gap:4px;min-width:0"><span class="badge" style="justify-self:start;color:' + (r.ok ? "var(--ok)" : "var(--bad)") + '">Câu ' + (i + 1) + " · " + (r.ok ? "Đúng" : "Sai") + "</span>" +
          '<span class="snip">' + esc(App.plain(q, q.p ? "p" : "q").slice(0, 180)) + "</span></div>" + "</li>";
      }).join("") + "</ul>" +
      '<div class="row"><button class="btn btn-primary" id="d-again">Luyện lượt mới</button>' +
      (wrong.length ? '<button class="btn" id="d-wrong">Làm lại ' + wrong.length + " câu sai</button>" : "") + "</div></div>";
    $("#d-again", root).onclick = function () { P.mode = "setup"; App.views.practice.render(); };
    var w = $("#d-wrong", root); if (w) w.onclick = function () { start(wrong, false); };
  }

  App.views.practice = {
    render: function () {
      var root = $("#v-practice");
      if (P.mode === "run" && P.queue.length) renderRun(root);
      else if (P.mode === "done") renderDone(root);
      else { P.mode = "setup"; renderSetup(root); }
    },
    startQuick: function () {
      var ans = App.state().answers;
      var fresh = App.shuffle(App.bank().filter(function (q) { return !ans[q.id]; }));
      var seen = App.shuffle(App.bank().filter(function (q) { return ans[q.id]; }));
      start(fresh.concat(seen).slice(0, 10), false);
    },
    startWith: function (list) { start(list, false); }
  };

  // Phím tắt khi đang luyện tập
  document.addEventListener("keydown", function (e) {
    if (App.current !== "practice" || P.mode !== "run" || !$("#overlay").hidden) return;
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var q = P.queue[P.idx];
    var k = e.key.toLowerCase();
    if (!P.revealed && q.type !== "spr" && "abcd1234".indexOf(k) >= 0 && k.length === 1) {
      P.sel = "abcd".indexOf(k) >= 0 ? "abcd".indexOf(k) : +k - 1;
      App.views.practice.render();
    } else if (e.key === "Enter" && (!t || t.tagName !== "BUTTON")) {
      e.preventDefault();
      if (!P.revealed) check();
      else if ($("#p-next")) advance();
    }
  });

  // ---------- Ôn câu sai ----------
  App.views.review = {
    render: function () {
      var root = $("#v-review");
      var list = App.mistakes();
      var head = '<div class="view-head"><div><div class="eyebrow">Ôn câu sai</div><h1>' + (list.length ? list.length + " câu cần làm lại" : "Chưa có câu sai nào") + "</h1>" +
        "<p>Câu bạn làm sai ở phần Luyện tập hoặc Thi thử sẽ nằm ở đây. Làm lại đúng thì câu đó tự rời danh sách.</p></div>" +
        (list.length ? '<button class="btn btn-primary" id="r-all">Làm lại tất cả</button>' : "") + "</div>";
      if (!list.length) {
        root.innerHTML = head + '<div class="card stack"><p class="empty">Bắt đầu với 10 câu luyện nhanh để hệ thống ghi nhận điểm mạnh và điểm yếu của bạn.</p>' +
          '<div><button class="btn btn-primary" id="r-go">Luyện nhanh 10 câu</button></div></div>';
        $("#r-go", root).onclick = function () { App.show("practice"); App.views.practice.startQuick(); };
        return;
      }
      var ans = App.state().answers;
      root.innerHTML = head + '<ul class="review-list">' + list.map(function (q) {
        var a = ans[q.id];
        return '<li class="review-item"><div class="stack" style="gap:6px;min-width:0">' + App.metaHTML(q, '<span class="badge">Sai ' + (a.n - a.c) + "/" + a.n + " lần</span>") +
          '<span class="snip">' + esc(App.plain(q, q.p ? "p" : "q").slice(0, 200)) + "</span></div>" +
          '<button class="btn btn-sm" data-redo="' + esc(q.id) + '">Làm lại</button></li>';
      }).join("") + "</ul>";
      $("#r-all", root).onclick = function () { App.show("practice"); App.views.practice.startWith(list); };
      $$("[data-redo]", root).forEach(function (b) {
        b.onclick = function () { App.show("practice"); App.views.practice.startWith([App.getQ(b.dataset.redo)]); };
      });
    }
  };
})();
