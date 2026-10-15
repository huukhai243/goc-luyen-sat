// Ngân hàng câu hỏi Reading & Writing (tự biên soạn theo định dạng Digital SAT).
// Trường: id, sec, dom (info|craft|expr|conv), diff (1 dễ – 3 khó), p (đoạn văn, HTML),
// q (câu hỏi), ch (4 lựa chọn), a (chỉ số đáp án đúng), ex (giải thích tiếng Việt).
window.SAT_BANK = window.SAT_BANK || [];

(function () {
  var Q_WORD = "Which choice completes the text with the most logical and precise word or phrase?";
  var Q_CONV = "Which choice completes the text so that it conforms to the conventions of Standard English?";
  var Q_TRANS = "Which choice completes the text with the most logical transition?";

  window.SAT_BANK.push(
    // ---------- Craft and Structure ----------
    {
      id: "rw01", sec: "rw", dom: "craft", diff: 1,
      p: "Although the first trials of the new battery design were ______, the engineers were not discouraged; each failure revealed a specific weakness that they could address in the next prototype.",
      q: Q_WORD,
      ch: ["unsuccessful", "celebrated", "unanimous", "premature"], a: 0,
      ex: "“Although … not discouraged” và “each failure” cho thấy các lần thử đầu tiên đã thất bại. <b>Unsuccessful</b> (không thành công) khớp nghĩa. “Celebrated” (được ca ngợi) mâu thuẫn với “failure”."
    },
    {
      id: "rw02", sec: "rw", dom: "craft", diff: 2,
      p: "Marine biologist Sylvia Earle has spent decades arguing that the ocean's health is ______ to human survival: the ocean produces much of the oxygen we breathe and regulates the climate on which agriculture depends.",
      q: Q_WORD,
      ch: ["incidental", "integral", "antithetical", "supplementary"], a: 1,
      ex: "Phần sau dấu hai chấm giải thích đại dương tạo oxy và điều hòa khí hậu, tức là <b>thiết yếu</b> cho sự sống. <b>Integral</b> = không thể thiếu. “Incidental” (phụ, ngẫu nhiên) và “supplementary” (bổ sung) quá nhẹ; “antithetical” (đối nghịch) sai nghĩa."
    },
    {
      id: "rw03", sec: "rw", dom: "craft", diff: 3,
      p: "Critics who expected the novelist's later work to repeat the lush, ornate style of her debut were surprised by its ______ prose: sentences are short, adjectives are rare, and whole chapters pass without a single metaphor.",
      q: Q_WORD,
      ch: ["florid", "austere", "erratic", "derivative"], a: 1,
      ex: "Câu ngắn, ít tính từ, không ẩn dụ → văn phong <b>giản dị, khắc khổ</b>: <b>austere</b>. “Florid” (hoa mỹ) chính là kiểu “lush, ornate” mà giới phê bình mong đợi nhưng không thấy."
    },
    {
      id: "rw04", sec: "rw", dom: "craft", diff: 2,
      p: "For years, astronomers assumed that the dim, reddish objects known as brown dwarfs were too cool to have weather. In a recent study, however, a team tracked tiny brightness changes in one brown dwarf over many hours and found patterns consistent with bands of wind and large storms, similar to those on Jupiter. The finding suggests that atmospheric activity may be common even on objects that never become true stars.",
      q: "Which choice best describes the overall structure of the text?",
      ch: [
        "It presents an assumption, describes evidence that challenges it, and states an implication of that evidence.",
        "It describes a telescope, explains its limitations, and proposes an improvement.",
        "It compares two planets and argues that one is more likely to support life.",
        "It summarizes a debate between astronomers and concludes that neither side is correct."
      ], a: 0,
      ex: "Câu 1: giả định cũ (sao lùn nâu không có thời tiết). Câu 2: “however” + bằng chứng mới thách thức giả định. Câu 3: “suggests” → hệ quả. Đúng thứ tự của đáp án A."
    },
    {
      id: "rw05", sec: "rw", dom: "craft", diff: 2,
      p: "Mai had rehearsed the speech so many times that she could recite it in her sleep. Yet when she stepped onto the stage and saw the rows of faces turned toward her, the first sentence vanished. She looked down at her note cards, found the opening line, and—after a breath that felt like it lasted a minute—began.",
      q: "Which choice best states the main purpose of the text?",
      ch: [
        "To describe a moment in which a character briefly loses and then regains her composure",
        "To explain why Mai chose to write her speech on note cards",
        "To contrast Mai's careful preparation with the audience's lack of interest",
        "To suggest that Mai regrets agreeing to give the speech"
      ], a: 0,
      ex: "Mai quên câu mở đầu (mất bình tĩnh), rồi nhìn thẻ ghi chú, hít thở và bắt đầu (lấy lại bình tĩnh). Đoạn văn không nói khán giả thờ ơ hay Mai hối hận."
    },
    {
      id: "rw06", sec: "rw", dom: "craft", diff: 3,
      p: "<b>Text 1</b><br>Some economists argue that raising the minimum wage inevitably reduces employment. Businesses facing higher labor costs, they reason, will respond by hiring fewer workers or by automating tasks.<br><br><b>Text 2</b><br>Studies comparing neighboring regions with different minimum wages have often found little or no difference in employment after modest increases. One explanation is that higher wages reduce employee turnover, which lowers businesses' hiring and training costs.",
      q: "Based on the texts, how would the researchers in Text 2 most likely respond to the claim in Text 1?",
      ch: [
        "By agreeing that automation is the main reason employment falls after wage increases",
        "By arguing that the claim overlooks ways higher wages can offset businesses' costs, at least for modest increases",
        "By asserting that minimum wage increases always raise employment",
        "By questioning whether businesses ever respond to changes in labor costs"
      ], a: 1,
      ex: "Text 2 đưa ra cơ chế bù đắp chi phí (giảm nghỉ việc → giảm chi phí tuyển dụng, đào tạo) và chỉ nói về mức tăng “modest”. Vậy họ sẽ cho rằng lập luận “inevitably” ở Text 1 đã bỏ sót yếu tố này. C quá tuyệt đối (“always”)."
    },
    {
      id: "rw07", sec: "rw", dom: "craft", diff: 1,
      p: "The museum's new exhibit is designed to be ______: visitors are encouraged to touch the fossils, operate the working models, and even try excavating replica bones in a large sandbox.",
      q: Q_WORD,
      ch: ["interactive", "fragile", "temporary", "exclusive"], a: 0,
      ex: "Khách được chạm, vận hành mô hình, tự khai quật → triển lãm mang tính <b>tương tác</b>: interactive."
    },

    // ---------- Information and Ideas ----------
    {
      id: "rw08", sec: "rw", dom: "info", diff: 1,
      p: "Honeybees communicate the location of food through a behavior called the waggle dance. A forager returning to the hive moves in a figure-eight pattern. The angle of the dance relative to vertical indicates the direction of the food relative to the sun, and the length of the “waggle” portion indicates its distance. Other bees follow the dancer and then fly directly to the source.",
      q: "Which choice best states the main idea of the text?",
      ch: [
        "Honeybees use a structured dance to convey both the direction and the distance of food sources.",
        "Honeybees prefer food sources that are close to the hive.",
        "The waggle dance is performed only when the sun is visible.",
        "Forager bees rarely return to the hive after finding food."
      ], a: 0,
      ex: "Toàn bộ đoạn văn mô tả điệu nhảy truyền đạt <b>hướng</b> (góc) và <b>khoảng cách</b> (độ dài phần lắc). Các lựa chọn khác không được đoạn văn nêu."
    },
    {
      id: "rw09", sec: "rw", dom: "info", diff: 2,
      p: "In the poem “Low Tide,” the speaker reflects on a parent who has moved to a city far across the ocean. A student claims that the speaker associates the sea with distance and separation.",
      q: "Which quotation from the poem most effectively illustrates the student's claim?",
      ch: [
        "“The gulls argue over scraps of bread / left on the warm stones of the pier.”",
        "“Each wave that leaves the shore / carries a little more of you away from me.”",
        "“In the morning, the fishing boats / come home heavy with silver.”",
        "“I collect shells in a paper cup / and line them up along the windowsill.”"
      ], a: 1,
      ex: "Cần trích dẫn gắn <b>biển</b> với <b>sự xa cách</b>. Chỉ B có cả hai: sóng rút ra xa “carries … you away from me”. Các câu khác chỉ tả cảnh biển."
    },
    {
      id: "rw10", sec: "rw", dom: "info", diff: 2,
      p: "<div class=\"tbl-wrap\"><table class=\"data\"><caption>Average daily screen time among surveyed teenagers (hours)</caption><thead><tr><th>Year</th><th>Weekday</th><th>Weekend</th></tr></thead><tbody><tr><td>2018</td><td>4.1</td><td>5.6</td></tr><tr><td>2020</td><td>6.3</td><td>7.4</td></tr><tr><td>2022</td><td>5.2</td><td>6.9</td></tr></tbody></table></div>A researcher studying teenage screen use notes that average screen time rose sharply between 2018 and 2020, likely because of remote schooling, and then ______",
      q: "Which choice most effectively uses data from the table to complete the statement?",
      ch: [
        "declined somewhat by 2022 but remained above 2018 levels on both weekdays and weekends.",
        "continued to increase on weekdays through 2022.",
        "fell below 2018 levels on weekends by 2022.",
        "remained unchanged between 2020 and 2022."
      ], a: 0,
      ex: "Năm 2022: ngày thường 5.2 (&lt; 6.3 nhưng &gt; 4.1), cuối tuần 6.9 (&lt; 7.4 nhưng &gt; 5.6). Vậy giảm nhẹ nhưng vẫn cao hơn 2018 → A."
    },
    {
      id: "rw11", sec: "rw", dom: "info", diff: 3,
      p: "Paleontologists have long debated whether certain small, feathered dinosaurs could fly. Feathers alone are not proof of flight: ostriches, for example, have feathers but cannot fly. Researchers studying one dinosaur species found that its feathers were symmetrical, with each side of the central shaft the same width. In contrast, the flight feathers of modern flying birds are typically asymmetrical, a shape that helps generate lift. The researchers therefore concluded that ______",
      q: "Which choice most logically completes the text?",
      ch: [
        "the species was probably not capable of powered flight.",
        "ostriches are direct descendants of this species.",
        "all feathered dinosaurs were capable of flight.",
        "feather shape has no relationship to an animal's ability to fly."
      ], a: 0,
      ex: "Lông vũ bay của chim hiện đại thường bất đối xứng để tạo lực nâng; loài này có lông đối xứng → nhiều khả năng <b>không bay chủ động được</b>. D mâu thuẫn trực tiếp với lập luận."
    },
    {
      id: "rw12", sec: "rw", dom: "info", diff: 2,
      p: "Urban planners in a mid-sized city hypothesized that converting one lane of a busy downtown street into a protected bike lane would increase the number of people cycling downtown without significantly slowing car traffic.",
      q: "Which finding, if true, would most directly support the planners' hypothesis?",
      ch: [
        "After the conversion, the number of cyclists counted downtown doubled, while average car travel times on the street rose by less than one minute.",
        "After the conversion, several drivers wrote letters to the city complaining about the change.",
        "Before the conversion, most cyclists in the city rode only on weekends.",
        "After the conversion, average car travel times on the street increased by fifteen minutes."
      ], a: 0,
      ex: "Giả thuyết có hai vế: (1) người đi xe đạp tăng, (2) ô tô không chậm đáng kể. Chỉ A xác nhận cả hai vế. D đi ngược vế (2)."
    },
    {
      id: "rw13", sec: "rw", dom: "info", diff: 2,
      p: "Researchers in Kenya tested an unusual way to protect farms from elephants: fences hung with beehives. Elephants tend to avoid bees, which can sting the sensitive skin around their eyes and trunks. Over several years, farms protected by beehive fences experienced far fewer elephant raids than unprotected farms, and farmers earned extra income by selling the honey.",
      q: "Which choice best states the main idea of the text?",
      ch: [
        "Beehive fences can reduce elephant damage to farms while also providing farmers with an additional source of income.",
        "Elephants pose a greater threat to bees than bees pose to elephants.",
        "Farmers in Kenya prefer selling honey to growing crops.",
        "Beehive fences are more expensive to build than traditional fences."
      ], a: 0,
      ex: "Ý chính gồm hai kết quả: ít bị voi phá hơn và có thêm thu nhập từ mật ong. B, C, D không được đề cập."
    },
    {
      id: "rw14", sec: "rw", dom: "info", diff: 3,
      p: "<div class=\"tbl-wrap\"><table class=\"data\"><caption>Percentage of seeds that germinated</caption><thead><tr><th>Temperature</th><th>Species X</th><th>Species Y</th></tr></thead><tbody><tr><td>10°C</td><td>12%</td><td>45%</td></tr><tr><td>20°C</td><td>58%</td><td>61%</td></tr><tr><td>30°C</td><td>83%</td><td>40%</td></tr></tbody></table></div>A botanist hypothesized that Species X is better adapted than Species Y to warm conditions.",
      q: "Which choice best describes data from the table that support the botanist's hypothesis?",
      ch: [
        "At 30°C, 83% of Species X seeds germinated, compared with 40% of Species Y seeds.",
        "At 10°C, Species Y had a higher germination rate than Species X did.",
        "At 20°C, the two species had similar germination rates.",
        "Species Y's germination rate was highest at 20°C."
      ], a: 0,
      ex: "Giả thuyết nói về điều kiện <b>ấm</b>, nên cần dữ liệu ở nhiệt độ cao nhất (30°C), nơi X vượt trội Y (83% so với 40%). B nói về điều kiện lạnh, không trực tiếp hỗ trợ."
    },

    // ---------- Standard English Conventions ----------
    {
      id: "rw15", sec: "rw", dom: "conv", diff: 1,
      p: "The Great Barrier Reef, which stretches more than 2,300 kilometers along the northeastern coast of Australia, ______ large enough to be seen from space.",
      q: Q_CONV,
      ch: ["are", "is", "were", "have been"], a: 1,
      ex: "Chủ ngữ là “The Great Barrier Reef” (số ít); mệnh đề “which …” chỉ là phần chen giữa. Động từ số ít, thì hiện tại: <b>is</b>."
    },
    {
      id: "rw16", sec: "rw", dom: "conv", diff: 2,
      p: "In the mid-1950s, chemist Dorothy Hodgkin determined the molecular structure of vitamin ______ her work, which relied on X-ray crystallography, later earned her the Nobel Prize in Chemistry.",
      q: Q_CONV,
      ch: ["B12,", "B12;", "B12", "B12 that"], a: 1,
      ex: "Hai vế đều là mệnh đề độc lập. Nối hai mệnh đề độc lập cần dấu chấm phẩy (<b>;</b>). Dấu phẩy đơn (A) tạo lỗi comma splice; không dấu (C) tạo câu chạy (run-on)."
    },
    {
      id: "rw17", sec: "rw", dom: "conv", diff: 2,
      p: "Each spring, thousands of storks arrive in the wetlands to breed; the ______ nests, built from reeds and mud, can reach a meter across.",
      q: Q_CONV,
      ch: ["storks'", "storks", "stork's", "storks's"], a: 0,
      ex: "Tổ thuộc về <b>nhiều</b> con cò (thousands of storks) → sở hữu cách số nhiều: <b>storks'</b>. “Stork's” là số ít; “storks's” sai chính tả."
    },
    {
      id: "rw18", sec: "rw", dom: "conv", diff: 1,
      p: "When the archaeologists finally opened the sealed chamber in 1922, they ______ objects that had remained undisturbed for more than three thousand years.",
      q: Q_CONV,
      ch: ["find", "will find", "found", "have found"], a: 2,
      ex: "Sự việc xảy ra năm 1922 và động từ cùng câu (“opened”) ở quá khứ đơn → dùng quá khứ đơn: <b>found</b>."
    },
    {
      id: "rw19", sec: "rw", dom: "conv", diff: 3,
      p: "Having studied the migration of monarch butterflies for more than a decade, ______",
      q: Q_CONV,
      ch: [
        "the data collected by entomologist Ana Reyes showed that the butterflies navigate using the sun.",
        "entomologist Ana Reyes showed that the butterflies navigate using the sun.",
        "the butterflies, according to entomologist Ana Reyes, navigate using the sun.",
        "it was shown by entomologist Ana Reyes that the butterflies navigate using the sun."
      ], a: 1,
      ex: "Cụm “Having studied …” phải bổ nghĩa cho <b>người</b> đã nghiên cứu, nên ngay sau dấu phẩy phải là “entomologist Ana Reyes”. Các lựa chọn khác tạo lỗi dangling modifier (dữ liệu hay con bướm không thể “nghiên cứu”)."
    },
    {
      id: "rw20", sec: "rw", dom: "conv", diff: 3,
      p: "The Vietnamese poet ______ is best known for <i>The Tale of Kiều</i>, an epic poem of more than three thousand lines written in the early nineteenth century.",
      q: Q_CONV,
      ch: ["Nguyễn Du,", ", Nguyễn Du", "Nguyễn Du", ", Nguyễn Du,"], a: 2,
      ex: "Có rất nhiều nhà thơ Việt Nam, nên tên “Nguyễn Du” là thông tin <b>cần thiết</b> để xác định nhà thơ nào (restrictive appositive) → không dùng dấu phẩy."
    },
    {
      id: "rw21", sec: "rw", dom: "conv", diff: 1,
      p: "The students in the robotics club spent months building a solar-powered car, and in May ______ entered it in a regional competition.",
      q: Q_CONV,
      ch: ["they", "it", "he", "one"], a: 0,
      ex: "Đại từ thay cho “The students” (số nhiều, chủ ngữ) → <b>they</b>. “It” đã được dùng cho chiếc xe."
    },

    // ---------- Expression of Ideas ----------
    {
      id: "rw22", sec: "rw", dom: "expr", diff: 1,
      p: "Coffee plants grow best in cool, high-altitude regions with steady rainfall. ______ rising global temperatures are pushing suitable growing areas farther uphill, leaving many farmers with less usable land.",
      q: Q_TRANS,
      ch: ["Similarly,", "However,", "For example,", "Therefore,"], a: 1,
      ex: "Câu 1 nêu điều kiện lý tưởng; câu 2 nêu một trở ngại đi ngược lại → quan hệ <b>tương phản</b>: However."
    },
    {
      id: "rw23", sec: "rw", dom: "expr", diff: 2,
      p: "From the fifteenth to the nineteenth century, Hội An in central Vietnam was a busy trading port that attracted merchants from China, Japan, and Europe. ______ its old town preserves a striking mix of architectural styles, including Chinese assembly halls and a Japanese-style covered bridge.",
      q: Q_TRANS,
      ch: ["As a result,", "Nevertheless,", "In contrast,", "Previously,"], a: 0,
      ex: "Việc thương nhân nhiều nước đến buôn bán là <b>nguyên nhân</b> dẫn đến kiến trúc pha trộn → quan hệ nhân quả: As a result."
    },
    {
      id: "rw24", sec: "rw", dom: "expr", diff: 2,
      p: "Early electric cars of the 1900s were quiet and easy to start, unlike gasoline cars, which had to be cranked by hand. ______ electric cars could travel only short distances on a charge, and once cheap gasoline and electric starters became widely available, gasoline cars came to dominate the market.",
      q: Q_TRANS,
      ch: ["Likewise,", "Still,", "For instance,", "In other words,"], a: 1,
      ex: "Câu 1 nêu ưu điểm của xe điện; câu 2 nêu nhược điểm khiến chúng thất thế → nhượng bộ/tương phản: <b>Still</b> (dù vậy)."
    },
    {
      id: "rw25", sec: "rw", dom: "expr", diff: 2,
      p: "While researching a topic, a student has taken the following notes:<ul><li>The Mekong River flows through six countries: China, Myanmar, Laos, Thailand, Cambodia, and Vietnam.</li><li>It is roughly 4,900 kilometers long.</li><li>Its delta in southern Vietnam is one of the world's most productive rice-growing regions.</li><li>Dams built upstream have reduced the amount of sediment that reaches the delta.</li></ul>",
      q: "The student wants to emphasize a challenge facing the Mekong Delta. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      ch: [
        "The Mekong River, roughly 4,900 kilometers long, flows through six countries.",
        "Dams built upstream on the Mekong have reduced the sediment reaching its delta, one of the world's most productive rice-growing regions.",
        "The Mekong flows through China, Myanmar, Laos, Thailand, Cambodia, and Vietnam.",
        "The Mekong Delta in southern Vietnam is a region where rice is grown."
      ], a: 1,
      ex: "Mục tiêu là nhấn mạnh <b>thách thức</b>. Chỉ B nêu vấn đề (đập thượng nguồn làm giảm phù sa) và cho thấy vì sao nó quan trọng (vùng lúa năng suất cao)."
    },
    {
      id: "rw26", sec: "rw", dom: "expr", diff: 3,
      p: "While researching a topic, a student has taken the following notes:<ul><li>Ada Lovelace was a nineteenth-century English mathematician.</li><li>She wrote extensive notes on Charles Babbage's proposed Analytical Engine.</li><li>Her notes included an algorithm for calculating Bernoulli numbers.</li><li>Many historians consider this algorithm the first published computer program.</li></ul>",
      q: "The student wants to explain Lovelace's significance to the history of computing to an audience unfamiliar with her. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      ch: [
        "Ada Lovelace, a nineteenth-century English mathematician, wrote an algorithm for Charles Babbage's proposed Analytical Engine that many historians consider the first published computer program.",
        "Lovelace's notes were about the Analytical Engine.",
        "Charles Babbage proposed a machine called the Analytical Engine in the nineteenth century.",
        "Bernoulli numbers can be calculated with an algorithm."
      ], a: 0,
      ex: "Khán giả chưa biết Lovelace → cần giới thiệu bà là ai <b>và</b> nêu đóng góp (chương trình máy tính đầu tiên được công bố). Chỉ A làm được cả hai."
    },
    {
      id: "rw27", sec: "rw", dom: "expr", diff: 3,
      p: "Many people picture deserts as nearly lifeless places. ______ the Sonoran Desert of North America is home to more than 2,000 species of plants, along with hundreds of species of birds, reptiles, and mammals.",
      q: Q_TRANS,
      ch: ["In fact,", "Consequently,", "Similarly,", "Moreover,"], a: 0,
      ex: "Câu 2 <b>bác bỏ</b> hình dung phổ biến ở câu 1 bằng dữ kiện cụ thể → In fact (thực ra). “Consequently” và “Moreover” coi câu 2 là hệ quả hoặc bổ sung, không đúng logic."
    }
  );
})();
