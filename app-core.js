// Góc Luyện SAT — phần lõi: dữ liệu, lưu tiến độ, hiển thị câu hỏi, gia sư AI, trang Tổng quan.
(function () {
  "use strict";

  var App = (window.App = {});

  // ---------- Hằng số ----------
  App.DOMAINS = {
    craft: { sec: "rw", name: "Craft and Structure", vi: "Kỹ năng & Cấu trúc" },
    info: { sec: "rw", name: "Information and Ideas", vi: "Thông tin & Ý tưởng" },
    conv: { sec: "rw", name: "Standard English Conventions", vi: "Quy tắc tiếng Anh chuẩn" },
    expr: { sec: "rw", name: "Expression of Ideas", vi: "Diễn đạt ý tưởng" },
    alg: { sec: "math", name: "Algebra", vi: "Đại số" },
    adv: { sec: "math", name: "Advanced Math", vi: "Toán nâng cao" },
    psda: { sec: "math", name: "Problem-Solving and Data Analysis", vi: "Giải quyết vấn đề & Dữ liệu" },
    geo: { sec: "math", name: "Geometry and Trigonometry", vi: "Hình học & Lượng giác" }
  };
  App.SECTIONS = { rw: "Reading and Writing", math: "Math" };
  App.DIFF = { 1: "Dễ", 2: "Vừa", 3: "Khó" };
  App.LETTERS = "ABCD";

  var BANK = window.SAT_BANK || [];
  var BYID = {};
  BANK.forEach(function (q) { BYID[q.id] = q; });
  App.bank = function () { return BANK; };

  // ---------- Tiện ích ----------
  App.$ = function (sel, root) { return (root || document).querySelector(sel); };
  App.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  App.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  App.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  App.dayKey = function (d) {
    d = d || new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  };
  App.fmtTime = function (sec) {
    sec = Math.max(0, Math.round(sec));
    return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
  };
  App.fmtDate = function (ts) {
    var d = new Date(ts);
    return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
  };
  App.toast = function (msg) {
    var t = App.$("#toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(App._toastTimer);
    App._toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  };
  App.openModal = function (html, onBind) {
    var m = App.$("#modal");
    m.innerHTML = html;
    App.$("#overlay").hidden = false;
    App.$$("[data-close]", m).forEach(function (b) { b.addEventListener("click", App.closeModal); });
    if (onBind) onBind(m);
    var first = App.$("button, input", m);
    if (first) first.focus();
  };
  App.closeModal = function () { App.$("#overlay").hidden = true; App.$("#modal").innerHTML = ""; };
  App.$("#overlay").addEventListener("click", function (e) { if (e.target.id === "overlay") App.closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !App.$("#overlay").hidden) App.closeModal(); });

  // ---------- Tiến độ: lưu trên trình duyệt, đồng bộ tài khoản khi có ----------
  var KEY = "gls-progress-v1";
  function blank() { return { v: 1, updatedAt: 0, answers: {}, days: [], tests: [], vocab: {}, aiq: [] }; }
  function normalize(s) {
    var b = blank();
    if (!s || typeof s !== "object") return b;
    if (typeof s.updatedAt === "number") b.updatedAt = s.updatedAt;
    ["answers", "vocab"].forEach(function (k) { if (s[k] && typeof s[k] === "object" && !Array.isArray(s[k])) b[k] = s[k]; });
    ["days", "tests", "aiq"].forEach(function (k) { if (Array.isArray(s[k])) b[k] = s[k]; });
    return b;
  }
  function loadLocal() {
    try { var raw = localStorage.getItem(KEY); if (raw) return normalize(JSON.parse(raw)); } catch (e) { /* trình duyệt chặn lưu trữ */ }
    return blank();
  }
  function persistLocal() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* bỏ qua */ } }

  var state = loadLocal();
  App.state = function () { return state; };
  App.save = function () { state.updatedAt = Date.now(); persistLocal(); scheduleCloud(); };
  App.resetProgress = function () { state = blank(); App.save(); };

  App.getQ = function (id) {
    if (BYID[id]) return BYID[id];
    for (var i = 0; i < state.aiq.length; i++) if (state.aiq[i].id === id) return state.aiq[i];
    return null;
  };
  App.addAiQ = function (q) {
    state.aiq.push(q);
    while (state.aiq.length > 40) state.aiq.shift();
    App.save();
  };
  App.record = function (q, correct) {
    var a = state.answers[q.id] || { n: 0, c: 0 };
    a.n += 1;
    if (correct) a.c += 1;
    a.last = !!correct;
    a.t = Date.now();
    a.d = q.dom;
    a.s = q.sec;
    state.answers[q.id] = a;
    var d = App.dayKey();
    if (state.days.indexOf(d) < 0) { state.days.push(d); while (state.days.length > 400) state.days.shift(); }
    App.save();
  };
  App.addTest = function (t) {
    state.tests.unshift(t);
    while (state.tests.length > 30) state.tests.pop();
    App.save();
  };

  // Thống kê
  App.stats = function () {
    var out = { unique: 0, attempts: 0, correct: 0, sec: { rw: { n: 0, c: 0 }, math: { n: 0, c: 0 } }, dom: {} };
    Object.keys(App.DOMAINS).forEach(function (k) { out.dom[k] = { n: 0, c: 0 }; });
    Object.keys(state.answers).forEach(function (id) {
      var a = state.answers[id];
      out.unique += 1; out.attempts += a.n; out.correct += a.c;
      if (out.sec[a.s]) { out.sec[a.s].n += a.n; out.sec[a.s].c += a.c; }
      if (out.dom[a.d]) { out.dom[a.d].n += a.n; out.dom[a.d].c += a.c; }
    });
    return out;
  };
  App.sectionScore = function (correct, total) {
    if (!total) return null;
    return Math.round((200 + 600 * (correct / total)) / 10) * 10;
  };
  App.streak = function () {
    var set = {};
    state.days.forEach(function (d) { set[d] = true; });
    var d = new Date();
    if (!set[App.dayKey(d)]) d.setDate(d.getDate() - 1);
    var n = 0;
    while (set[App.dayKey(d)]) { n += 1; d.setDate(d.getDate() - 1); }
    return n;
  };
  App.mistakes = function () {
    return Object.keys(state.answers)
      .filter(function (id) { return state.answers[id].last === false && App.getQ(id); })
      .sort(function (x, y) { return state.answers[y].t - state.answers[x].t; })
      .map(App.getQ);
  };

  // Đồng bộ tài khoản (chỉ khi trang chạy trong trình xem của Claude và người xem đã đăng nhập)
  var cloud = { ref: null, writing: false, again: false, timer: null };
  function setSync(mode) {
    var el = App.$("#sync-status");
    el.dataset.state = mode;
    el.textContent = mode === "cloud" ? "Đã đồng bộ với tài khoản" : "Lưu trên trình duyệt này";
  }
  function scheduleCloud() {
    if (!cloud.ref) return;
    clearTimeout(cloud.timer);
    cloud.timer = setTimeout(flushCloud, 1500);
  }
  function flushCloud() {
    if (!cloud.ref) return;
    if (cloud.writing) { cloud.again = true; return; }
    cloud.writing = true;
    cloud.ref.set(JSON.parse(JSON.stringify(state))).then(function () {
      setSync("cloud");
    }, function (e) {
      var code = e && e.code;
      if (code === "quota_exceeded") App.toast("Kho lưu trữ đã đầy, tiến độ mới chỉ được lưu trên trình duyệt.");
      if (code !== "unavailable" && code !== "resource_exhausted") { cloud.ref = null; setSync("local"); }
    }).then(function () {
      cloud.writing = false;
      if (cloud.again) { cloud.again = false; scheduleCloud(); }
    });
  }
  function initCloud() {
    if (!window.claude || typeof window.claude.use !== "function") return;
    Promise.all([window.claude.use("db"), window.claude.use("user")]).then(function (r) {
      var db = r[0], user = r[1];
      if (!db || !user) return null;
      return user.id().then(function (uid) {
        if (!uid) return null;
        var ref = db.doc("data/users/" + uid + "/progress");
        return ref.get().then(function (snap) {
          cloud.ref = ref;
          setSync("cloud");
          if (snap.exists) {
            var remote = normalize(JSON.parse(JSON.stringify(snap.data())));
            if (remote.updatedAt > state.updatedAt) { state = remote; persistLocal(); App.refresh(); }
            else if (state.updatedAt > remote.updatedAt) scheduleCloud();
          } else if (state.updatedAt > 0) {
            scheduleCloud();
          }
        });
      });
    }).catch(function () { cloud.ref = null; setSync("local"); });
  }

  // ---------- Gia sư AI (chỉ khi trình xem cho phép hỏi Claude) ----------
  App.sample = null;
  function initSample() {
    if (!window.claude || typeof window.claude.use !== "function") return;
    window.claude.use("sample").then(function (s) {
      if (!s) return;
      App.sample = s;
      App.refresh();
    }, function () { /* không có */ });
  }
  App.disableAI = function () { App.sample = null; App.$$("[data-ai]").forEach(function (n) { n.hidden = true; }); };
  App.aiError = function (e) {
    var code = e && e.code;
    if (["not_granted", "sampling_disabled", "not_declared", "capability_disabled", "capability_removed"].indexOf(code) >= 0) {
      App.disableAI();
      return "Gia sư AI không dùng được trong phiên này.";
    }
    if (code === "cancelled") return "";
    if (code === "rate_limited") return "Bạn đã hỏi nhiều trong thời gian ngắn. Đợi một lát rồi thử lại.";
    if (code === "session_expired") return "Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại rồi thử lại.";
    if (code === "refused") return "Claude không trả lời yêu cầu này. Hãy thử hỏi theo cách khác.";
    if (code === "invalid_json") return "Câu hỏi tạo ra bị lỗi định dạng. Bấm thử lại.";
    return "Kết nối bị gián đoạn. Bấm thử lại.";
  };

  // ---------- Hiển thị câu hỏi ----------
  function fmtAI(s) {
    return App.esc(s).replace(/\n/g, "<br>").replace(/\^(\d+|\([^)]{1,12}\))/g, function (m, g) {
      return "<sup>" + g.replace(/^\(|\)$/g, "") + "</sup>";
    });
  }
  App.html = function (q, field) { return q.ai ? fmtAI(q[field] || "") : (q[field] || ""); };
  App.choiceHTML = function (q, i) { return q.ai ? fmtAI(q.ch[i]) : q.ch[i]; };

  App.plain = function (q, field) {
    var src = field === "ch" ? null : q[field];
    if (q.ai) return src || "";
    var d = document.createElement("div");
    d.innerHTML = src || "";
    App.$$("svg", d).forEach(function (s) { s.replaceWith("[Hình: " + (s.getAttribute("aria-label") || "") + "]\n"); });
    App.$$(".frac", d).forEach(function (f) {
      f.replaceWith("(" + f.children[0].textContent + ")/(" + f.children[1].textContent + ")");
    });
    App.$$("sup", d).forEach(function (s) { s.replaceWith("^(" + s.textContent + ")"); });
    App.$$("br", d).forEach(function (b) { b.replaceWith("\n"); });
    App.$$("li", d).forEach(function (li) { li.prepend("• "); li.append("\n"); });
    App.$$("caption", d).forEach(function (c) { c.append("\n"); });
    App.$$("tr", d).forEach(function (tr) {
      var cells = App.$$("th, td", tr).map(function (c) { return c.textContent.trim(); });
      tr.replaceWith(cells.join(" | ") + "\n");
    });
    return d.textContent.replace(/[ \t]+/g, " ").trim();
  };
  App.plainChoice = function (q, i) {
    if (q.ai) return q.ch[i];
    return App.plain({ x: q.ch[i] }, "x");
  };

  App.metaHTML = function (q, extra) {
    var dom = App.DOMAINS[q.dom];
    var dots = "";
    for (var i = 1; i <= 3; i++) dots += '<i class="' + (i <= q.diff ? "on" : "") + '"></i>';
    return '<div class="qmeta">' +
      '<span class="badge">' + (q.sec === "rw" ? "Reading & Writing" : "Math") + "</span>" +
      '<span class="badge" title="' + App.esc(dom.name) + '">' + App.esc(dom.vi) + "</span>" +
      '<span class="badge"><span class="diff" aria-hidden="true">' + dots + "</span> " + App.DIFF[q.diff] + "</span>" +
      (q.ai ? '<span class="badge badge-ai">Câu do AI tạo</span>' : "") +
      (extra || "") + "</div>";
  };

  // st: { sel, struck: {i:true}, reveal: bool, elim: bool }
  App.choicesHTML = function (q, st) {
    if (q.type === "spr") {
      var cls = "";
      if (st.reveal) cls = App.isCorrect(q, st.sel) ? "ok" : "bad";
      return '<div class="spr"><label class="field"><span>Nhập đáp án của bạn</span>' +
        '<input type="text" id="spr-' + q.id + '" class="' + cls + '" inputmode="decimal" autocomplete="off" maxlength="9" value="' +
        App.esc(st.sel == null ? "" : st.sel) + '"' + (st.reveal ? " disabled" : "") + "></label>" +
        "<small>Có thể nhập số nguyên, số thập phân (3.5) hoặc phân số (7/2). Dùng dấu trừ cho số âm.</small></div>";
    }
    var math = q.sec === "math" ? " math" : "";
    var html = '<div class="choices" role="radiogroup" aria-label="Các lựa chọn">';
    q.ch.forEach(function (c, i) {
      var cls = "choice";
      if (st.reveal) {
        if (i === q.a) cls += " is-correct";
        else if (i === st.sel) cls += " is-wrong";
      } else if (i === st.sel) cls += " is-selected";
      if (st.struck && st.struck[i] && !st.reveal) cls += " is-struck";
      html += '<div class="choice-row"><button type="button" class="' + cls + '" data-choice="' + i + '" role="radio" aria-checked="' + (i === st.sel) + '"' +
        (st.reveal ? " disabled" : "") + '><span class="bubble">' + App.LETTERS[i] + '</span><span class="ctext' + math + '">' +
        App.choiceHTML(q, i) + "</span></button>" +
        (st.elim && !st.reveal ? '<button type="button" class="elim" data-elim="' + i + '" aria-pressed="' + !!(st.struck && st.struck[i]) +
          '" title="Gạch bỏ lựa chọn ' + App.LETTERS[i] + '" aria-label="Gạch bỏ lựa chọn ' + App.LETTERS[i] + '">' + App.LETTERS[i] + "</button>" : "") +
        "</div>";
    });
    return html + "</div>";
  };

  App.parseNum = function (s) {
    if (s == null) return NaN;
    s = String(s).replace(/\s+/g, "").replace(/[−–]/g, "-").replace(",", ".");
    if (!s) return NaN;
    var m = s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
    if (m) { var den = parseFloat(m[2]); return den === 0 ? NaN : parseFloat(m[1]) / den; }
    return /^-?(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s) : NaN;
  };
  App.isCorrect = function (q, resp) {
    if (resp == null || resp === "") return false;
    if (q.type === "spr") {
      var v = App.parseNum(resp);
      return !isNaN(v) && Math.abs(v - q.a) < 1e-4;
    }
    return resp === q.a;
  };
  App.answerLabel = function (q) {
    return q.type === "spr" ? String(q.a) : App.LETTERS[q.a];
  };
  App.explainHTML = function (q, resp) {
    var ok = App.isCorrect(q, resp);
    var head = resp == null || resp === ""
      ? "Chưa trả lời — đáp án đúng: " + App.answerLabel(q)
      : ok ? "Chính xác!" : "Chưa đúng — đáp án đúng: " + App.answerLabel(q);
    return '<div class="explain ' + (ok ? "ok" : "bad") + '"><h3>' + App.esc(head) + '</h3><div class="body">' + App.html(q, "ex") + "</div></div>";
  };

  // Khung gia sư AI, gắn dưới phần giải thích
  App.tutorHTML = function () {
    if (!App.sample) return "";
    return '<div class="tutor" data-ai><div class="row" style="justify-content:space-between">' +
      '<h3>Gia sư AI</h3><button type="button" class="btn btn-sm btn-pencil" data-tutor-ask>Giải thích chi tiết hơn</button></div>' +
      '<div class="tutor-out" data-tutor-out hidden></div>' +
      '<form class="tutor-form" data-tutor-form hidden><input type="text" id="tutor-follow" placeholder="Hỏi thêm, ví dụ: vì sao không chọn C?" autocomplete="off">' +
      '<button class="btn btn-sm" type="submit">Gửi</button><button class="btn btn-sm btn-ghost" type="button" data-tutor-stop hidden>Dừng</button></form></div>';
  };
  App.bindTutor = function (root, q, resp) {
    var box = App.$("[data-ai]", root);
    if (!box || !App.sample) return;
    var out = App.$("[data-tutor-out]", box), form = App.$("[data-tutor-form]", box), ask = App.$("[data-tutor-ask]", box);
    var stop = App.$("[data-tutor-stop]", box);
    var turns = [], log = [], ctl = null;

    function choicesText() {
      if (q.type === "spr") return "(Câu tự điền đáp án)";
      return q.ch.map(function (c, i) { return App.LETTERS[i] + ") " + App.plainChoice(q, i); }).join("\n");
    }
    function studentText() {
      if (resp == null || resp === "") return "Học sinh bỏ trống.";
      return q.type === "spr" ? "Học sinh điền: " + resp : "Học sinh chọn: " + App.LETTERS[resp];
    }
    var base = "Bạn là gia sư luyện thi SAT, nói tiếng Việt, giải thích cho học sinh THPT người Việt.\n\n" +
      "Phần thi: " + App.SECTIONS[q.sec] + " — " + App.DOMAINS[q.dom].name + "\n" +
      (q.p ? "Đoạn văn:\n" + App.plain(q, "p") + "\n\n" : "") +
      "Câu hỏi:\n" + App.plain(q, "q") + "\n\nLựa chọn:\n" + choicesText() + "\n\n" +
      "Đáp án đúng: " + App.answerLabel(q) + "\n" + studentText() + "\n" +
      "Lời giải ngắn có sẵn: " + (q.ai ? q.ex : App.plain(q, "ex")) + "\n\n" +
      "Yêu cầu: (1) giải thích từng bước vì sao đáp án đúng; (2) nếu học sinh sai, chỉ ra vì sao lựa chọn đó sai; " +
      "(3) cho một mẹo nhận diện dạng câu này trong đề thật. Viết ngắn gọn, dưới 200 từ, văn bản thuần, " +
      "không dùng Markdown (không dùng **, # hay bảng). Giữ thuật ngữ tiếng Anh trong ngoặc khi hữu ích.";

    function paint(live) {
      out.hidden = false;
      out.innerHTML = "";
      log.concat(live ? [live] : []).forEach(function (m) {
        var who = document.createElement("span");
        who.className = "who";
        who.textContent = m.role === "user" ? "Bạn hỏi" : "Gia sư";
        var p = document.createElement("div");
        p.textContent = m.text;
        out.append(who, p);
      });
      out.scrollTop = out.scrollHeight;
    }
    function run(userText) {
      if (ctl) return;
      ctl = new AbortController();
      if (userText) { turns.push({ role: "user", content: userText }); log.push({ role: "user", text: userText }); }
      else turns = [{ role: "user", content: base }];
      var live = { role: "assistant", text: "Đang suy nghĩ…" };
      paint(live);
      ask.disabled = true; stop.hidden = false; form.hidden = false;
      var opts = { signal: ctl.signal, onText: function (u) { live.text = u.text; paint(live); } };
      if (userText) opts.cache = false;
      App.sample(turns.length === 1 ? base : turns, opts).then(function (r) {
        turns.push({ role: "assistant", content: r.text });
        log.push({ role: "assistant", text: r.text + (r.truncated ? "\n(Câu trả lời bị cắt ngắn.)" : "") });
        paint();
      }, function (e) {
        var msg = App.aiError(e);
        if (e && e.text) { turns.push({ role: "assistant", content: e.text }); log.push({ role: "assistant", text: e.text + (msg ? "\n(" + msg + ")" : "") }); }
        else if (msg) log.push({ role: "assistant", text: msg });
        if (userText && !(e && e.text)) turns.pop();
        paint();
      }).then(function () {
        ctl = null; ask.disabled = false; ask.textContent = "Giải thích lại"; stop.hidden = true;
      });
    }
    ask.addEventListener("click", function () { log = []; run(); });
    stop.addEventListener("click", function () { if (ctl) ctl.abort(); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var inp = App.$("input", form), v = inp.value.trim();
      if (!v || ctl || !turns.length) return;
      inp.value = "";
      run(v);
    });
  };

  // ---------- Điều hướng ----------
  App.views = {};
  App.current = "home";
  App.show = function (name) {
    if (!App.views[name]) name = "home";
    App.current = name;
    App.$$(".tab").forEach(function (t) {
      if (t.dataset.view === name) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current");
    });
    App.$$(".view").forEach(function (v) { v.hidden = v.id !== "v-" + name; });
    App.views[name].render();
    try { sessionStorage.setItem("gls-tab", name); } catch (e) { /* bỏ qua */ }
  };
  App.refresh = function () { if (App.views[App.current] && App.views[App.current].refresh) App.views[App.current].refresh(); else if (App.views[App.current]) App.views[App.current].render(); };
  App.$$(".tab").forEach(function (t) {
    t.addEventListener("click", function () { App.show(t.dataset.view); window.scrollTo(0, 0); });
  });

  // ---------- Trang Tổng quan ----------
  function domRows(sec, st) {
    return Object.keys(App.DOMAINS).filter(function (k) { return App.DOMAINS[k].sec === sec; }).map(function (k) {
      var d = st.dom[k], pct = d.n ? Math.round((100 * d.c) / d.n) : null;
      var lvl = pct == null ? "" : pct < 50 ? "low" : pct < 75 ? "mid" : "high";
      var count = BANK.filter(function (q) { return q.dom === k; }).length;
      return '<div class="dom-row"><div class="dom-name">' + App.esc(App.DOMAINS[k].vi) + "<small>" + App.esc(App.DOMAINS[k].name) + " · " + count + " câu</small></div>" +
        '<div class="dom-bar" role="img" aria-label="' + (pct == null ? "Chưa làm" : pct + "% đúng") + '"><span class="' + lvl + '" style="width:' + (pct || 0) + '%"></span></div>' +
        '<div class="dom-val">' + (pct == null ? "chưa làm" : pct + "% · " + d.c + "/" + d.n) + "</div></div>";
    }).join("");
  }
  App.views.home = {
    render: function () {
      var st = App.stats(), s = App.state();
      var rw = st.sec.rw.n >= 5 ? App.sectionScore(st.sec.rw.c, st.sec.rw.n) : null;
      var ma = st.sec.math.n >= 5 ? App.sectionScore(st.sec.math.c, st.sec.math.n) : null;
      var total = rw != null && ma != null ? rw + ma : null;
      var fill = total == null ? 0 : ((total - 400) / 1200) * 100;
      var acc = st.attempts ? Math.round((100 * st.correct) / st.attempts) + "%" : "—";
      var mistakes = App.mistakes().length;
      var nRW = BANK.filter(function (q) { return q.sec === "rw"; }).length, nM = BANK.length - nRW;
      var today = new Date();
      var tests = s.tests.length
        ? '<div class="tbl-wrap"><table class="hist"><thead><tr><th>Ngày</th><th>Phần thi</th><th>Đúng</th><th>Điểm ước tính</th><th>Thời gian</th></tr></thead><tbody>' +
          s.tests.slice(0, 8).map(function (t) {
            return "<tr><td>" + App.fmtDate(t.date) + "</td><td>" + App.SECTIONS[t.sec] + (t.short ? " (rút gọn)" : "") + '</td><td class="num">' + t.correct + "/" + t.total +
              '</td><td class="num">' + t.score + '</td><td class="num">' + App.fmtTime(t.secs) + "</td></tr>";
          }).join("") + "</tbody></table></div>"
        : '<p class="empty">Chưa có bài thi thử nào. Làm một module để xem điểm ước tính theo thang 200–800.</p>';

      App.$("#v-home").innerHTML =
        '<div class="view-head"><div><div class="eyebrow">' + ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"][today.getDay()] + ", " + App.fmtDate(today) + "</div>" +
        "<h1>Hôm nay luyện phần nào?</h1><p>Ngân hàng gồm " + nRW + " câu Reading &amp; Writing và " + nM + " câu Math theo đúng 8 mảng kiến thức của Digital SAT, kèm lời giải tiếng Việt.</p></div></div>" +
        '<div class="hero"><div class="card score-card">' +
        '<div class="eyebrow">Điểm ước tính từ phần luyện tập</div>' +
        '<div class="score-line"><span class="score-big">' + (total == null ? "—" : total) + '</span><span class="muted">/ 1600</span></div>' +
        '<div class="score-split"><span>Reading &amp; Writing <b>' + (rw == null ? "—" : rw) + "</b></span><span>Math <b>" + (ma == null ? "—" : ma) + "</b></span></div>" +
        '<div class="meter" role="img" aria-label="Thang điểm 400 đến 1600"><div class="meter-track"><div class="meter-fill" style="width:' + fill + '%"></div></div>' +
        '<div class="meter-ticks"><span>400</span><span>800</span><span>1200</span><span>1600</span></div></div>' +
        '<p class="muted" style="font-size:13px">' + (total == null ? "Làm ít nhất 5 câu ở mỗi phần để có điểm ước tính. " : "") + "Điểm quy đổi tuyến tính từ tỉ lệ đúng, chỉ để tham khảo.</p>" +
        '<div class="stats"><div class="stat"><b>' + st.unique + "</b><span>câu đã làm</span></div>" +
        '<div class="stat"><b>' + acc + "</b><span>tỉ lệ đúng</span></div>" +
        '<div class="stat"><b>' + App.streak() + "</b><span>ngày liên tiếp</span></div></div></div>" +
        '<div class="quick">' +
        '<button class="quick-item" data-go="practice-quick"><div><h3>Luyện nhanh 10 câu</h3><p>Trộn cả hai phần, xem lời giải ngay sau mỗi câu</p></div><span class="arrow">→</span></button>' +
        '<button class="quick-item" data-go="test-rw"><div><h3>Thi thử Reading &amp; Writing</h3><p>27 câu · 32 phút · bấm giờ như đề thật</p></div><span class="arrow">→</span></button>' +
        '<button class="quick-item" data-go="test-math"><div><h3>Thi thử Math</h3><p>22 câu · 35 phút · có bảng công thức</p></div><span class="arrow">→</span></button>' +
        '<button class="quick-item" data-go="review"><div><h3>Ôn câu sai</h3><p>' + (mistakes ? mistakes + " câu đang chờ bạn làm lại" : "Chưa có câu sai nào") + '</p></div><span class="arrow">→</span></button>' +
        "</div></div>" +
        '<div class="grid-2"><div class="card stack"><h2>Reading &amp; Writing</h2><div class="dom-group">' + domRows("rw", st) + "</div></div>" +
        '<div class="card stack"><h2>Math</h2><div class="dom-group">' + domRows("math", st) + "</div></div></div>" +
        '<div class="card stack"><h2>Lịch sử thi thử</h2>' + tests + "</div>" +
        '<div class="row" style="justify-content:flex-end"><button class="btn btn-sm btn-ghost" id="reset-btn">Xóa toàn bộ tiến độ</button>' +
        '<span id="reset-confirm" class="row" hidden><span class="muted" style="font-size:13px">Xóa hết câu đã làm, lịch sử thi và từ vựng?</span>' +
        '<button class="btn btn-sm" id="reset-yes">Xóa</button><button class="btn btn-sm btn-ghost" id="reset-no">Giữ lại</button></span></div>';

      App.$$("[data-go]", App.$("#v-home")).forEach(function (b) {
        b.addEventListener("click", function () {
          var g = b.dataset.go;
          if (g === "practice-quick") { App.show("practice"); App.views.practice.startQuick(); }
          else if (g === "test-rw" || g === "test-math") { App.show("test"); App.views.test.openIntro(g === "test-rw" ? "rw" : "math", false); }
          else App.show(g);
          window.scrollTo(0, 0);
        });
      });
      App.$("#reset-btn").addEventListener("click", function () { App.$("#reset-confirm").hidden = false; App.$("#reset-btn").hidden = true; });
      App.$("#reset-no").addEventListener("click", function () { App.$("#reset-confirm").hidden = true; App.$("#reset-btn").hidden = false; });
      App.$("#reset-yes").addEventListener("click", function () { App.resetProgress(); App.toast("Đã xóa tiến độ."); App.views.home.render(); });
    }
  };

  // Khởi động sau khi app-modes.js đã đăng ký các trang còn lại
  App.boot = function () {
    var tab = "home";
    try { tab = sessionStorage.getItem("gls-tab") || "home"; } catch (e) { /* bỏ qua */ }
    if (tab === "test") tab = "home";
    App.show(tab);
    initCloud();
    initSample();
  };
})();
