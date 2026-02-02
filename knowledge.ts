interface KnowledgeChunk {
  topic: string;
  keywords: string[];
  content: string;
}

export const KNOWLEDGE_BASE_STRUCTURED: KnowledgeChunk[] = [
  {
    topic: 'Tự đánh giá mức độ ái kỷ',
    keywords: ['trắc nghiệm', 'bài test', 'bảng tự đánh giá', 'đánh giá ái kỷ', 'kiểm tra', 'câu hỏi', 'làm bài test', '30 mệnh đề', 'chẩn đoán ái kỷ'],
    content: `
**THANG ĐO CHẨN ĐOÁN, ĐÁNH GIÁ MỨC ĐỘ ÁI KỶ Ở HỌC SINH THPT**

Thang đo này giúp bạn tự đánh giá mức độ ái kỷ của mình một cách khoa học. Hãy trả lời 30 mệnh đề dưới đây dựa trên thang điểm Likert 5 mức độ.

**Bảng quy ước điểm:**
- Hoàn toàn không đúng: 1 điểm
- Không đúng: 2 điểm
- Đang phân vân: 3 điểm
- Đúng: 4 điểm
- Hoàn toàn đúng: 5 điểm

**Bộ 30 mệnh đề:**
1/ Tôi rất tự tin về khả năng của bản thân.
2/ Tôi thích được chú ý khi tham gia hoạt động lớp.
3/ Tôi tin rằng chỉ có người “ở đẳng cấp như tôi” mới hiểu được tôi.
4/ Tôi vui vì thành công của người khác ngay cả khi mình không được công nhận.
5/ Tôi thường hay so sánh bản thân với người khác để biết ai giỏi hơn.
6/ Tôi thường lợi dụng mối quan hệ để đạt mục tiêu cá nhân.
7/ Tôi chấp nhận góp ý và xem đó là cơ hội học hỏi.
8/ Tôi thấy “thiếu thiếu” nếu không được mọi người chú ý.
9/ Tôi khó chấp nhận khi người khác không cư xử theo ý tôi.
10/ Tôi đánh giá bản thân dựa trên nỗ lực hơn là sự chú ý của mọi người.
11/ Tôi cảm thấy xứng đáng được đối xử ưu tiên hơn người khác.
12/ Tôi thường muốn đáp trả khi bị phê bình.
13/ Tôi luôn giữ bình tĩnh dù không phải là người nổi bật.
14/ Tôi cảm thấy khó chịu khi người khác được khen nhiều hơn tôi.
15/ Tôi không cần quan tâm cảm xúc người khác nếu điều đó làm tôi khó chịu.
16/ Tôi biết lắng nghe cảm xúc người khác.
17/ Tôi cảm thấy mình đặc biệt và thường không được hiểu hết.
18/ Tôi tin nhiều người ghen tị với mình.
19/ Tôi thấy khó công nhận điểm mạnh của người khác.
20/ Tôi nghĩ mình xứng đáng được đặc quyền hơn người khác.
21/ Tôi có khả năng tự điều chỉnh khi mắc sai lầm.
22/ Tôi hay kể về thành tích để mọi người biết mình giỏi.
23/ Tôi không cần nổi bật vẫn cảm thấy hài lòng.
24/ Tôi nghĩ thành công của người khác chủ yếu do may mắn.
25/ Tôi sẵn sàng xin lỗi và sửa nếu làm sai.
26/ Tôi thường muốn ra quyết định trong nhóm vì nghĩ mình biết rõ hơn.
27/ Tôi khó đặt mình vào vị trí người khác để thông cảm.
28/ Tôi hài lòng về bản thân mà không cần khoe khoang.
29/ Tôi cảm thấy tự tin hơn khi được khen ngợi.
30/ Tôi nghĩ có một số quy định chung “không áp dụng cho tôi”.

**Cách tính điểm:**
- **Điểm HN (Ái kỷ Lành mạnh):** Tổng điểm các câu 1, 4, 7, 10, 13, 16, 21, 23, 25, 28.
- **Điểm SN (Ái kỷ dưới Lâm sàng):** Tổng điểm các câu 2, 5, 8, 11, 14, 17, 19, 22, 26, 29.
- **Điểm NPD (Rối loạn Nhân cách Ái kỷ):** Tổng điểm các câu 3, 9, 12, 15, 18, 20, 24, 27, 30.

**Phân nhóm và ý nghĩa:**
- **Nhóm A (Lành mạnh vượt trội):** HN >= 40; SN và NPD <= 26.
- **Nhóm B (Lành mạnh pha nhẹ ái kỷ):** HN >= 40; SN và NPD từ 28-30.
- **Nhóm C (Pha trộn phức tạp):** HN >= 38; SN và NPD từ 28-34.
- **Nhóm D (Ái kỷ chưa lành mạnh rõ rệt):** HN <= 36; SN >= 32 hoặc NPD >= 32.
- **Nhóm E (Tự trọng thấp – bất an):** HN, SN, NPD <= 26 hoặc HN <= 24 và thấp hơn SN, NPD >= 6 điểm.
- **Nhóm F (Trung hoà ổn định):** HN từ 28-36; SN và NPD từ 24-28.`
  },
  {
    topic: 'healthy_narcissism_scenario',
    keywords: ['tình huống 1', 'ái kỷ lành mạnh', 'tự tin', 'góp ý', 'học hỏi', 'tự hào', 'không so sánh', 'healthy narcissism'],
    content: `**Tình huống 1: Biểu hiện của Ái kỷ Lành mạnh**
*Mô tả:* Bạn tự tin phát biểu, vui khi được khen nhưng cũng sẵn sàng tiếp thu góp ý. Bạn tự hào về thành tích nhưng cũng mừng cho thành công của người khác và xem đó là cơ hội học hỏi.
*Chẩn đoán:* Xin chúc mừng bạn! Bạn có những biểu hiện của ái kỷ lành mạnh (Healthy Narcissism). Bạn cảm thấy tự hào về thành tích và tự tin vào bản thân một cách cân bằng.
*Tham vấn:* Tiếp tục phát huy nhé! Sự tự tin lành mạnh này sẽ tạo động lực học tập và giúp bạn phát triển bản thân thông qua những đóng góp tích cực từ mọi người.`
  },
  {
    topic: 'grandiose_narcissism_scenario',
    keywords: ['tình huống 2', 'ái kỷ phô trương', 'vĩ đại', 'linh hồn của lớp', 'cần công nhận', 'siêu sao', 'hả hê', 'ghen tị', 'thích khoe', 'grandiose narcissism'],
    content: `**Tình huống 2: Biểu hiện của Ái kỷ Phô trương (Grandiose Narcissism)**
*Mô tả:* Bạn cực kỳ tự tin, luôn muốn là "linh hồn" của lớp và cần được tung hô. Bạn khó chịu khi người khác thành công, dễ cáu gắt khi không được đề cao, và có cảm giác hả hê khi người khác thất bại.
*Chẩn đoán:* Bạn đang có biểu hiện của ái kỷ dưới lâm sàng, kiểu ái kỷ phô trương. Bạn có cảm giác vượt trội phi thực tế, đánh giá quá cao năng lực của mình và ám ảnh bởi nhu cầu được ngưỡng mộ.
*Tham vấn:* Đừng lo lắng, bạn có thể thay đổi. Hãy để ý tần suất của cảm giác này. Tập chuyển hướng suy nghĩ: nhìn vào nỗ lực của người khác, nhớ rằng ai cũng muốn được khẳng định.
*Câu chuyện chữa lành (Nhà bác học qua sông):* Mỗi người đều có giá trị riêng ở đúng vị trí của mình. Người giỏi thật sự thường khiêm tốn. Tự cao sẽ khiến bạn chỉ thấy điểm yếu của người khác và có thể phải trả giá đắt.`
  },
  {
    topic: 'cerebral_narcissism_scenario',
    keywords: ['tình huống 3', 'ái kỷ trí tuệ', 'thông minh hơn người', 'sáng suốt', 'khinh thường người khác', 'dốt', 'ngu ngốc', 'cerebral narcissism'],
    content: `**Tình huống 3: Biểu hiện của Ái kỷ Trí tuệ (Cerebral Narcissism)**
*Mô tả:* Bạn luôn muốn chứng tỏ mình thông minh hơn người khác. Bạn xem ý kiến của mình là sáng suốt, còn của người khác là "dốt". Bạn không quan tâm nếu người khác không hiểu, chỉ cần họ thấy bạn vượt trội.
*Chẩn đoán:* Bạn có biểu hiện của ái kỷ trí tuệ. Bạn tìm thấy giá trị bản thân qua việc tin rằng mình thông minh và sáng suốt hơn người khác, và luôn cố gắng phô trương điều đó.
*Tham vấn:* Nếu cảm giác này lặp lại thường xuyên, cần can thiệp. Hãy nhớ "Vắng mợ chợ vẫn đông", mỗi người đều có thế mạnh riêng. Hãy quý trọng người khác thay vì xem họ kém thông minh hơn. Dành thời gian cho các hoạt động lành mạnh khác.
*Câu chuyện chữa lành (Tiều phu và học giả):* Chẳng ai là hoàn hảo và biết tất cả mọi thứ. Càng tỏ ra thông minh, coi thường người khác thì càng dễ bị chính sự thông minh đó làm hại. Đừng khinh thường người khác vì bạn có thể nhận lại kết quả không mong muốn.`
  },
  {
    topic: 'communal_narcissism_scenario',
    keywords: ['tình huống 4', 'ái kỷ cộng đồng', 'giúp đỡ để được ghi ơn', 'tử tế hời hợt', 'sống ảo', 'làm việc tốt để khoe', 'tốt bụng giả tạo', 'communal narcissism'],
    content: `**Tình huống 4: Biểu hiện của Ái kỷ Cộng đồng (Communal Narcissism)**
*Mô tả:* Bạn thích giúp đỡ người khác để họ phải biết ơn và "dưới cơ" mình. Bạn làm việc tốt (như nhặt rác, lao động) chỉ khi có người nhìn thấy để được khen là tử tế. Bạn tỏ ra hào phóng nhưng lại nói xấu sau lưng.
*Chẩn đoán:* Bạn có biểu hiện của ái kỷ cộng đồng. Bạn xây dựng hình ảnh tốt bụng, nhân hậu một cách hời hợt để duy trì cái nhìn tự cao về bản thân. Sâu bên trong, bạn vẫn muốn có sự chú ý và quyền lực.
*Tham vấn:* Hãy tự hỏi: "Mình làm việc tốt vì ai?". Học cách làm điều tốt vì nó mang lại niềm vui và sự bình yên cho chính mình, chứ không phải vì sự công nhận.
*Câu chuyện chữa lành (Cây cổ thụ):* Lòng tốt thực sự là khi bạn làm điều gì đó vì nó mang lại hạnh phúc và sự an lành cho chính tâm hồn mình, không phải để được người khác ghi nhận hay đền đáp. Hãy tử tế một cách vô điều kiện.`
  },
  {
    topic: 'covert_narcissism_scenario',
    keywords: ['tình huống 5', 'ái kỷ thầm kín', 'trống rỗng', 'ganh tỵ', 'nhạy cảm', 'nạn nhân', 'thiệt thòi', 'tự hạ thấp bản thân', 'than vãn', 'covert narcissism'],
    content: `**Tình huống 5: Biểu hiện của Ái kỷ Thầm kín (Covert Narcissism)**
*Mô tả:* Bạn luôn cảm thấy trống rỗng, ganh tỵ với thành công của người khác. Bạn rất nhạy cảm với lời góp ý, thường né tránh hoặc nguỵ biện. Bạn luôn cảm thấy mình là nạn nhân, thiệt thòi, và cả thế giới không công bằng với mình.
*Chẩn đoán:* Bạn có biểu hiện của ái kỷ thầm kín. Bạn cần sự công nhận nhưng lại thể hiện qua sự yếu đuối, tự hạ thấp bản thân để gợi lòng thương cảm và lời khen. Bề ngoài khiêm tốn nhưng bên trong lại ghen tị.
*Tham vấn:* Cần phân biệt ái kỷ này với tính cách hướng nội hoặc nhạy cảm. Hãy thực hành viết nhật ký cảm xúc để nhận diện và thay thế những suy nghĩ tiêu cực.
*Câu chuyện chữa lành (Tái ông thất mã):* Trong họa có phúc, trong phúc có họa. Cuộc sống luôn có được và mất. Đừng buồn bã vì những gì mình chưa có, mà hãy học cách trân trọng những gì mình đang có.`
  },
  {
    topic: 'antagonistic_narcissism_scenario',
    keywords: ['tình huống 6', 'ái kỷ hiếu chiến', 'đối kháng', 'thích tranh cãi', 'phản bác', 'hơn thua', 'không nhận sai', 'cãi lý', 'antagonistic narcissism'],
    content: `**Tình huống 6: Biểu hiện của Ái kỷ Hiếu chiến (Antagonistic Narcissism)**
*Mô tả:* Bạn xem mọi tương tác là một cuộc chiến. Bạn thích tranh cãi, phản bác ý kiến người khác chỉ để giành phần thắng, dù điều đó không giúp ích cho công việc chung. Bạn không bao giờ thừa nhận mình sai.
*Chẩn đoán:* Bạn có biểu hiện của ái kỷ hiếu chiến (đối kháng). Bạn có tính cạnh tranh cực đoan và không ngại khơi mào xung đột để đạt được vị trí đứng đầu, dù là trong những việc nhỏ nhặt.
*Tham vấn:* Tâm lý hơn thua sẽ khiến bạn luôn cảm thấy tiêu cực. Hãy nhớ rằng không ai đang tranh giành với bạn cả. Nhân vô thập toàn, ai cũng có thể sai. Học cách giao tiếp tích cực và bao dung hơn.
*Câu chuyện chữa lành (Vận động viên Ivan Fernandez):* Chiến thắng thực sự không phải là về nhất bằng mọi giá, mà là giữ được đạo đức và lựa chọn đúng đắn. Sự tử tế không làm bạn thua thiệt, mà khiến bạn trở thành người chiến thắng trong lòng người khác.`
  },
  {
    topic: 'malignant_narcissism_scenario',
    keywords: ['tình huống 7', 'ái kỷ ác tính', 'nguy hiểm', 'lợi dụng', 'tàn nhẫn', 'trả thù', 'thao túng', 'nói dối', 'độc ác', 'malignant narcissism', 'rối loạn nhân cách'],
    content: `**Tình huống 7: Biểu hiện của Ái kỷ Ác tính (Malignant Narcissism)**
*Mô tả:* Bạn xem việc lợi dụng, bỏ rơi người khác là bình thường. Bạn bất chấp mọi thứ để có quyền lực, kể cả làm tổn hại người khác. Bạn có thể nói dối, thao túng, và thù ghét bất kỳ ai không làm theo ý mình.
*Chẩn đoán:* Rất nguy hiểm! Bạn có những biểu hiện của rối loạn nhân cách ái kỷ, kiểu ái kỷ ác tính. Các hành vi này có thể trở nên tàn nhẫn và gây nguy hiểm, ảnh hưởng trực tiếp đến người khác.
*Tham vấn:* Bạn cần tìm đến chuyên gia tâm lý. Các liệu pháp như CBT hoặc tâm lý động lực có thể giúp. Đừng vội quy chụp, điều quan trọng là tìm kiếm sự hỗ trợ chuyên môn để cải thiện chất lượng sống.
*Câu chuyện chữa lành (Ba cụ già Tình Thương, Giàu Sang, Thành Đạt):* Nơi nào có Tình Thương, nơi đó sẽ có Giàu Sang và Thành Đạt. Sự thành công của mỗi người đều nhờ vào sự hỗ trợ của rất nhiều người khác. Chúng ta cần trân trọng, đồng cảm và sống yêu thương.`
  },
  {
    topic: 'general_advice',
    keywords: ['lời khuyên chung', 'làm gì', 'giúp đỡ', 'giáo viên', 'bạn bè', 'gia đình', 'phụ huynh', 'cha mẹ', 'ứng xử'],
    content: `**LỜI KHUYÊN CHUNG DÀNH CHO MỌI NGƯỜI**

*1. Với bản thân:*
- Nếu bạn lành mạnh (Nhóm HN): Hãy phát huy sự tự tin và khiêm tốn.
- Nếu bạn có xu hướng thể hiện (Nhóm SN): Giảm so sánh, tập trung vào tiến bộ cá nhân.
- Nếu bạn có xu hướng rối loạn (Nhóm NPD): Tập "đặt mình vào vị trí người khác".

*2. Khi giáo viên nhận thấy học sinh có biểu hiện:*
- Với Nhóm HN: Khuyến khích làm nhóm trưởng, phát huy điểm mạnh.
- Với Nhóm SN: Giao nhiệm vụ hợp tác để nhấn mạnh tinh thần tập thể.
- Với Nhóm NPD: Tránh đối đầu, gặp riêng và đặt ra giới hạn. Nếu nghiêm trọng, phối hợp với phụ huynh và tư vấn học đường.

*3. Khi bạn bè thấy bạn mình có biểu hiện:*
- Với Nhóm HN: Hợp tác và cùng học tập.
- Với Nhóm SN: Nhẹ nhàng nhắc nhở nếu bạn khoe khoang quá nhiều.
- Với Nhóm NPD: Không để bị thao túng, báo với giáo viên nếu cần. Hạn chế tranh cãi.

*4. Khi gia đình phát hiện con em có biểu hiện:*
- Với Nhóm HN: Ghi nhận thành tích, dạy con cách tôn trọng người khác.
- Với Nhóm SN: Khuyến khích con tham gia hoạt động tập thể, cộng đồng.
- Với Nhóm NPD: Nếu hành vi kéo dài, nên tìm sự hỗ trợ từ chuyên gia tâm lý.`
  },
  {
    topic: 'important_notes',
    keywords: ['nên nhớ', 'lưu ý', 'ghi nhớ', 'quan trọng', 'đừng nhầm lẫn', 'đừng hoang mang', 'không phải bệnh'],
    content: `**NHỮNG ĐIỀU CẦN NHỚ**
- Đừng nhầm lẫn ái kỷ với sự nhạy cảm, lòng tự trọng hay cá tính mạnh.
- Đừng hoang mang nếu phát hiện mình có triệu chứng. Đây là một phổ liên tục và bạn hoàn toàn có thể kiểm soát được.
- Không phải lúc nào ái kỷ cũng là bệnh lý. Đừng xem người có xu hướng ái kỷ là người xấu, bản thân họ cũng rất khổ sở.
- Việc ngăn chặn xu hướng ái kỷ tiêu cực sẽ giúp bạn có đời sống tinh thần thoải mái, năng lượng tích cực và các mối quan hệ lành mạnh.`
  }
];
