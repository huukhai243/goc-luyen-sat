// Ngân hàng câu hỏi Math (tự biên soạn theo định dạng Digital SAT).
// type "mc": 4 lựa chọn, a = chỉ số đáp án đúng.
// type "spr": học sinh tự điền đáp án, a = giá trị số đúng (chấp nhận phân số hoặc số thập phân).
window.SAT_BANK = window.SAT_BANK || [];

(function () {
  function F(n, d) { return '<span class="frac"><span>' + n + '</span><span>' + d + '</span></span>'; }

  var TRIANGLE =
    '<figure class="fig"><svg viewBox="0 0 220 160" role="img" aria-label="Tam giác vuông ABC, góc vuông tại C, AC = 6, BC = 8">' +
    '<polygon points="40,130 40,40 160,130" fill="none" stroke="currentColor" stroke-width="2"/>' +
    '<polyline points="40,116 54,116 54,130" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
    '<text x="26" y="36" fill="currentColor" font-size="14">A</text>' +
    '<text x="166" y="140" fill="currentColor" font-size="14">B</text>' +
    '<text x="24" y="146" fill="currentColor" font-size="14">C</text>' +
    '<text x="22" y="90" fill="currentColor" font-size="13">6</text>' +
    '<text x="96" y="150" fill="currentColor" font-size="13">8</text>' +
    '</svg></figure>';

  window.SAT_BANK.push(
    // ---------- Algebra ----------
    {
      id: "m01", sec: "math", dom: "alg", diff: 1, type: "mc",
      q: "If 3<i>x</i> + 7 = 22, what is the value of <i>x</i>?",
      ch: ["3", "5", "7", F(29, 3)], a: 1,
      ex: "3<i>x</i> = 22 − 7 = 15, nên <i>x</i> = 5."
    },
    {
      id: "m02", sec: "math", dom: "alg", diff: 1, type: "spr",
      q: "A taxi charges a $3.50 base fee plus $2.25 per mile. If a ride cost a total of $21.50, how many miles long was the ride?",
      a: 8,
      ex: "3.50 + 2.25<i>m</i> = 21.50 → 2.25<i>m</i> = 18 → <i>m</i> = 8 dặm."
    },
    {
      id: "m03", sec: "math", dom: "alg", diff: 2, type: "mc",
      q: "Which equation represents the line in the <i>xy</i>-plane that passes through the points (0, −4) and (2, 2)?",
      ch: ["<i>y</i> = 3<i>x</i> − 4", "<i>y</i> = −3<i>x</i> − 4", "<i>y</i> = 3<i>x</i> + 4", "<i>y</i> = " + F(1, 3) + "<i>x</i> − 4"], a: 0,
      ex: "Hệ số góc = (2 − (−4)) ÷ (2 − 0) = 3. Đường thẳng cắt trục <i>y</i> tại −4, nên <i>y</i> = 3<i>x</i> − 4."
    },
    {
      id: "m04", sec: "math", dom: "alg", diff: 2, type: "mc",
      q: "2<i>x</i> + <i>y</i> = 11<br><i>x</i> − <i>y</i> = 1<br>If (<i>x</i>, <i>y</i>) is the solution to the system of equations above, what is the value of <i>xy</i>?",
      ch: ["7", "12", "4", "3"], a: 1,
      ex: "Cộng hai phương trình: 3<i>x</i> = 12 → <i>x</i> = 4, suy ra <i>y</i> = 3. Vậy <i>xy</i> = 12."
    },
    {
      id: "m05", sec: "math", dom: "alg", diff: 2, type: "spr",
      q: "In the equation 5(<i>x</i> + 3) − 2<i>x</i> = <i>kx</i> + 15, <i>k</i> is a constant. If the equation has infinitely many solutions, what is the value of <i>k</i>?",
      a: 3,
      ex: "Vế trái rút gọn thành 3<i>x</i> + 15. Phương trình có vô số nghiệm khi hai vế giống hệt nhau: 3<i>x</i> + 15 = <i>kx</i> + 15, nên <i>k</i> = 3."
    },
    {
      id: "m06", sec: "math", dom: "alg", diff: 2, type: "mc",
      q: "A school club has at most $300 to spend on a field trip. Renting a bus costs $120, and each student ticket costs $15. Which inequality represents the possible numbers of students, <i>s</i>, who can go on the trip?",
      ch: ["120 + 15<i>s</i> ≤ 300", "15 + 120<i>s</i> ≤ 300", "120 + 15<i>s</i> ≥ 300", "135<i>s</i> ≤ 300"], a: 0,
      ex: "Tổng chi phí = 120 (xe, cố định) + 15<i>s</i> (vé). “At most $300” nghĩa là ≤ 300."
    },
    {
      id: "m07", sec: "math", dom: "alg", diff: 3, type: "mc",
      q: "3<i>x</i> − 2<i>y</i> = 5<br>6<i>x</i> + <i>cy</i> = 8<br>In the system of equations above, <i>c</i> is a constant. For what value of <i>c</i> does the system have no solution?",
      ch: ["−4", "4", "−2", "2"], a: 0,
      ex: "Hệ vô nghiệm khi hai đường thẳng song song (hệ số tỉ lệ, hằng số không tỉ lệ). Nhân phương trình 1 với 2: 6<i>x</i> − 4<i>y</i> = 10. Cần <i>c</i> = −4, và vì 8 ≠ 10 nên hệ vô nghiệm."
    },
    {
      id: "m08", sec: "math", dom: "alg", diff: 3, type: "spr",
      q: "Line <i>ℓ</i> in the <i>xy</i>-plane is perpendicular to the line <i>y</i> = −" + F(2, 5) + "<i>x</i> + 1 and passes through the point (4, 3). What is the <i>y</i>-coordinate of the <i>y</i>-intercept of line <i>ℓ</i>?",
      a: -7,
      ex: "Hệ số góc vuông góc là nghịch đảo đổi dấu: " + F(5, 2) + ". <i>y</i> − 3 = " + F(5, 2) + "(<i>x</i> − 4) → <i>y</i> = " + F(5, 2) + "<i>x</i> − 7. Giao điểm với trục <i>y</i> là −7."
    },

    // ---------- Advanced Math ----------
    {
      id: "m09", sec: "math", dom: "adv", diff: 1, type: "mc",
      q: "Which expression is equivalent to (<i>x</i> + 4)(<i>x</i> − 4)?",
      ch: ["<i>x</i><sup>2</sup> − 16", "<i>x</i><sup>2</sup> + 16", "<i>x</i><sup>2</sup> − 8<i>x</i> − 16", "<i>x</i><sup>2</sup> − 8"], a: 0,
      ex: "Hằng đẳng thức (<i>a</i> + <i>b</i>)(<i>a</i> − <i>b</i>) = <i>a</i><sup>2</sup> − <i>b</i><sup>2</sup>, nên kết quả là <i>x</i><sup>2</sup> − 16."
    },
    {
      id: "m10", sec: "math", dom: "adv", diff: 1, type: "mc",
      q: "The function <i>f</i> is defined by <i>f</i>(<i>x</i>) = 2<i>x</i><sup>2</sup> − 3<i>x</i> + 1. What is the value of <i>f</i>(−2)?",
      ch: ["3", "15", "11", "−1"], a: 1,
      ex: "<i>f</i>(−2) = 2(4) − 3(−2) + 1 = 8 + 6 + 1 = 15."
    },
    {
      id: "m11", sec: "math", dom: "adv", diff: 2, type: "spr",
      q: "What is the positive solution to the equation <i>x</i><sup>2</sup> − 2<i>x</i> − 24 = 0?",
      a: 6,
      ex: "Phân tích: (<i>x</i> − 6)(<i>x</i> + 4) = 0, nên <i>x</i> = 6 hoặc <i>x</i> = −4. Nghiệm dương là 6."
    },
    {
      id: "m12", sec: "math", dom: "adv", diff: 2, type: "mc",
      q: "A population of bacteria doubles every 3 hours. There are currently 500 bacteria. Which function <i>P</i> gives the number of bacteria <i>t</i> hours from now?",
      ch: ["<i>P</i>(<i>t</i>) = 500(2)<sup><i>t</i>/3</sup>", "<i>P</i>(<i>t</i>) = 500(2)<sup>3<i>t</i></sup>", "<i>P</i>(<i>t</i>) = 500(3)<sup><i>t</i>/2</sup>", "<i>P</i>(<i>t</i>) = 500 + 2<sup><i>t</i>/3</sup>"], a: 0,
      ex: "Tăng gấp đôi (cơ số 2) sau mỗi 3 giờ → số lần nhân đôi sau <i>t</i> giờ là <i>t</i>/3. Kiểm tra: <i>t</i> = 3 cho 500 · 2 = 1000. ✔"
    },
    {
      id: "m13", sec: "math", dom: "adv", diff: 2, type: "mc",
      q: "<i>y</i> = <i>x</i><sup>2</sup> − 6<i>x</i> + 4<br>Which equation is equivalent to the equation above and displays the minimum value of <i>y</i> as a constant or coefficient?",
      ch: ["<i>y</i> = (<i>x</i> − 3)<sup>2</sup> − 5", "<i>y</i> = (<i>x</i> − 3)<sup>2</sup> + 4", "<i>y</i> = (<i>x</i> + 3)<sup>2</sup> − 5", "<i>y</i> = <i>x</i>(<i>x</i> − 6) + 4"], a: 0,
      ex: "Hoàn thành bình phương: <i>x</i><sup>2</sup> − 6<i>x</i> + 9 − 9 + 4 = (<i>x</i> − 3)<sup>2</sup> − 5. Dạng đỉnh cho thấy giá trị nhỏ nhất là −5 (tại <i>x</i> = 3)."
    },
    {
      id: "m14", sec: "math", dom: "adv", diff: 3, type: "spr",
      q: "If <i>x</i> &gt; 0 and <i>x</i><sup>5/2</sup> = 32, what is the value of <i>x</i>?",
      a: 4,
      ex: "Nâng hai vế lên lũy thừa 2/5: <i>x</i> = 32<sup>2/5</sup> = (32<sup>1/5</sup>)<sup>2</sup> = 2<sup>2</sup> = 4."
    },
    {
      id: "m15", sec: "math", dom: "adv", diff: 3, type: "mc",
      q: F("<i>x</i><sup>2</sup> − 9", "<i>x</i> − 3") + " = 2<i>x</i> − 1<br>What is the solution to the equation above?",
      ch: ["4", "3", "−2", "3 and 4"], a: 0,
      ex: "Với <i>x</i> ≠ 3: " + F("<i>x</i><sup>2</sup> − 9", "<i>x</i> − 3") + " = <i>x</i> + 3. Giải <i>x</i> + 3 = 2<i>x</i> − 1 → <i>x</i> = 4. Lưu ý <i>x</i> = 3 làm mẫu bằng 0 nên bị loại."
    },

    // ---------- Problem-Solving and Data Analysis ----------
    {
      id: "m16", sec: "math", dom: "psda", diff: 1, type: "mc",
      q: "A recipe uses 3 cups of flour for every 2 cups of sugar. How many cups of flour are needed if 8 cups of sugar are used?",
      ch: ["10", "12", "16", "5.3"], a: 1,
      ex: "Tỉ lệ bột : đường = 3 : 2. 8 cốc đường gấp 4 lần 2, nên bột = 3 × 4 = 12 cốc."
    },
    {
      id: "m17", sec: "math", dom: "psda", diff: 2, type: "mc",
      q: "The price of a jacket was reduced by 20%. Later, the reduced price was increased by 25%. The final price is what percent of the original price?",
      ch: ["95%", "100%", "105%", "80%"], a: 1,
      ex: "Nhân hệ số: 0.80 × 1.25 = 1.00. Giá cuối bằng đúng 100% giá ban đầu. Bẫy thường gặp: lấy −20% + 25% = +5%."
    },
    {
      id: "m18", sec: "math", dom: "psda", diff: 2, type: "spr",
      q: "The mean of five numbers is 14. When a sixth number is added to the list, the mean of the six numbers is 15. What is the sixth number?",
      a: 20,
      ex: "Tổng 5 số = 5 × 14 = 70. Tổng 6 số = 6 × 15 = 90. Số thứ sáu = 90 − 70 = 20."
    },
    {
      id: "m19", sec: "math", dom: "psda", diff: 3, type: "mc",
      q: "<div class=\"tbl-wrap\"><table class=\"data\"><caption>Preferred class format, by grade</caption><thead><tr><th></th><th>Online</th><th>In person</th><th>Total</th></tr></thead><tbody><tr><td>Grade 10</td><td>36</td><td>64</td><td>100</td></tr><tr><td>Grade 11</td><td>54</td><td>46</td><td>100</td></tr><tr><td>Total</td><td>90</td><td>110</td><td>200</td></tr></tbody></table></div>The table summarizes a survey of 200 students. If one of the students who prefer online classes is selected at random, what is the probability that the student is in grade 11?",
      ch: ["0.27", "0.54", "0.6", "0.45"], a: 2,
      ex: "Không gian mẫu chỉ gồm học sinh thích học online: 90 em. Trong đó lớp 11 có 54 em. Xác suất = 54 ÷ 90 = 0.6."
    },

    // ---------- Geometry and Trigonometry ----------
    {
      id: "m20", sec: "math", dom: "geo", diff: 1, type: "mc",
      q: TRIANGLE + "In right triangle <i>ABC</i> above, angle <i>C</i> is a right angle, <i>AC</i> = 6, and <i>BC</i> = 8. What is the length of <i>AB</i>?",
      ch: ["10", "14", "12", "√28"], a: 0,
      ex: "Định lý Pythagoras: <i>AB</i><sup>2</sup> = 6<sup>2</sup> + 8<sup>2</sup> = 100, nên <i>AB</i> = 10 (bộ ba 6-8-10)."
    },
    {
      id: "m21", sec: "math", dom: "geo", diff: 2, type: "spr",
      q: "A circle in the <i>xy</i>-plane has the equation <i>x</i><sup>2</sup> + <i>y</i><sup>2</sup> − 6<i>x</i> + 8<i>y</i> = 0. What is the radius of the circle?",
      a: 5,
      ex: "Hoàn thành bình phương: (<i>x</i> − 3)<sup>2</sup> + (<i>y</i> + 4)<sup>2</sup> = 9 + 16 = 25. Bán kính = √25 = 5."
    },
    {
      id: "m22", sec: "math", dom: "geo", diff: 3, type: "mc",
      q: "In right triangle <i>PQR</i>, angle <i>R</i> is a right angle and sin <i>P</i> = " + F(5, 13) + ". What is the value of tan <i>P</i>?",
      ch: [F(5, 12), F(12, 13), F(12, 5), F(13, 5)], a: 0,
      ex: "sin <i>P</i> = đối/huyền = 5/13 → cạnh kề = √(13<sup>2</sup> − 5<sup>2</sup>) = 12. tan <i>P</i> = đối/kề = " + F(5, 12) + "."
    }
  );
})();
