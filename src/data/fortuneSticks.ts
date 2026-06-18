export type LocalizedText = {
  vi: string;
  en: string;
};

export type FortuneStickLevel =
  | 'great'
  | 'good'
  | 'neutral'
  | 'caution';

export type FortuneStick = {
  number: number;
  level: FortuneStickLevel;
  title: LocalizedText;
  verse: LocalizedText;
  interpretation: LocalizedText;
  advice: LocalizedText;
};

export const FORTUNE_STICKS: FortuneStick[] = [
  {
    number: 1,
    level: 'great',
    title: {
      vi: 'Mây tan trăng sáng',
      en: 'Clouds Part, Moon Shines',
    },
    verse: {
      vi: 'Mây tan trăng sáng giữa trời,\nTâm an đường mở, người người thuận duyên.',
      en: 'Clouds fade and the moon shines bright,\nA peaceful heart reveals the path ahead.',
    },
    interpretation: {
      vi: 'Vận khí đang dần hanh thông. Những việc đã trì hoãn có cơ hội tiến triển nếu bạn giữ bình tĩnh và làm từng bước chắc chắn.',
      en: 'Conditions are becoming more favorable. Delayed matters may move forward if you remain calm and proceed steadily.',
    },
    advice: {
      vi: 'Hãy chủ động nắm cơ hội nhưng đừng nóng vội.',
      en: 'Act on opportunities, but avoid rushing.',
    },
  },
  {
    number: 2,
    level: 'good',
    title: {
      vi: 'Gieo hạt đúng mùa',
      en: 'Seeds in the Right Season',
    },
    verse: {
      vi: 'Đất lành gieo hạt đúng mùa,\nChăm bền ngày tháng, quả vừa tay nâng.',
      en: 'Seeds planted in fertile ground,\nPatient care brings a worthy harvest.',
    },
    interpretation: {
      vi: 'Kết quả tốt đến từ sự đều đặn. Đây là lúc xây nền tảng, học hỏi hoặc vun bồi một mối quan hệ quan trọng.',
      en: 'Good results come from consistency. This is a time to build foundations, learn, or nurture an important relationship.',
    },
    advice: {
      vi: 'Kiên trì với việc nhỏ mỗi ngày.',
      en: 'Stay consistent with small daily actions.',
    },
  },
  {
    number: 3,
    level: 'neutral',
    title: {
      vi: 'Thuyền chờ nước lớn',
      en: 'Boat Awaiting the Tide',
    },
    verse: {
      vi: 'Thuyền neo bến vắng lặng im,\nNước lên đúng lúc, hành trình lại xuôi.',
      en: 'A boat rests quietly at shore,\nWhen the tide rises, the journey resumes.',
    },
    interpretation: {
      vi: 'Chưa phải thời điểm thích hợp để ép mọi việc tiến nhanh. Sự chờ đợi có chủ đích sẽ giúp bạn tránh quyết định thiếu sáng suốt.',
      en: 'This is not the time to force rapid progress. Purposeful patience can prevent an unwise decision.',
    },
    advice: {
      vi: 'Quan sát thêm trước khi quyết định.',
      en: 'Observe a little longer before deciding.',
    },
  },
  {
    number: 4,
    level: 'caution',
    title: {
      vi: 'Đường trơn bước chậm',
      en: 'Walk Slowly on Slippery Ground',
    },
    verse: {
      vi: 'Mưa qua đường vẫn còn trơn,\nBước chậm giữ vững, tránh cơn vội vàng.',
      en: 'Though rain has passed, the road stays slick,\nMove slowly and avoid haste.',
    },
    interpretation: {
      vi: 'Có thể xuất hiện hiểu lầm, sai sót nhỏ hoặc chi phí ngoài dự kiến. Cẩn thận giấy tờ, lời nói và cam kết.',
      en: 'Misunderstandings, small mistakes, or unexpected costs may arise. Be careful with documents, words, and commitments.',
    },
    advice: {
      vi: 'Kiểm tra kỹ trước khi ký, gửi hoặc hứa.',
      en: 'Double-check before signing, sending, or promising.',
    },
  },
  {
    number: 5,
    level: 'great',
    title: {
      vi: 'Hoa nở trước hiên',
      en: 'Blossoms by the Door',
    },
    verse: {
      vi: 'Hoa khai trước ngõ đón xuân,\nTin vui ghé đến, người thân thuận hòa.',
      en: 'Spring blossoms open by the gate,\nGood news arrives and harmony grows.',
    },
    interpretation: {
      vi: 'Một giai đoạn thuận lợi cho gia đình, tình cảm và những cuộc gặp gỡ. Bạn dễ nhận được sự hỗ trợ chân thành.',
      en: 'A favorable period for family, relationships, and meaningful meetings. Sincere support is likely.',
    },
    advice: {
      vi: 'Hãy mở lòng đón nhận và biết ơn.',
      en: 'Stay open and receive with gratitude.',
    },
  },
  {
    number: 6,
    level: 'good',
    title: {
      vi: 'Người tốt đồng hành',
      en: 'A Kind Companion',
    },
    verse: {
      vi: 'Đường xa có bạn chung vai,\nKhó khăn chia nửa, ngày mai nhẹ nhàng.',
      en: 'A long road feels lighter with a friend,\nShared burdens make tomorrow easier.',
    },
    interpretation: {
      vi: 'Quý nhân có thể xuất hiện dưới dạng một người góp ý, cộng sự hoặc người thân. Hãy lắng nghe thay vì tự gánh mọi việc.',
      en: 'Helpful support may come from an adviser, colleague, or loved one. Listen instead of carrying everything alone.',
    },
    advice: {
      vi: 'Chủ động nhờ giúp đỡ khi cần.',
      en: 'Ask for help when needed.',
    },
  },
  {
    number: 7,
    level: 'neutral',
    title: {
      vi: 'Gió đổi hướng',
      en: 'The Wind Changes',
    },
    verse: {
      vi: 'Gió chiều đổi hướng bất ngờ,\nGiữ tâm linh hoạt, đừng chờ lối quen.',
      en: 'The evening wind suddenly shifts,\nStay flexible and release old routes.',
    },
    interpretation: {
      vi: 'Kế hoạch có thể thay đổi. Sự linh hoạt sẽ quan trọng hơn việc cố bám vào cách làm cũ.',
      en: 'Plans may change. Flexibility matters more than holding onto an old approach.',
    },
    advice: {
      vi: 'Chuẩn bị phương án thứ hai.',
      en: 'Prepare a second option.',
    },
  },
  {
    number: 8,
    level: 'caution',
    title: {
      vi: 'Lời nói như tên',
      en: 'Words Like Arrows',
    },
    verse: {
      vi: 'Một lời nóng giận buông ra,\nKhó thu như nước đã qua chân cầu.',
      en: 'A harsh word once released,\nCannot be gathered like water downstream.',
    },
    interpretation: {
      vi: 'Xung đột dễ bắt nguồn từ cảm xúc nhất thời. Điều quan trọng là trì hoãn phản ứng khi đang tức giận.',
      en: 'Conflict may come from temporary emotion. Delay your response when angry.',
    },
    advice: {
      vi: 'Im lặng một nhịp trước khi trả lời.',
      en: 'Pause before responding.',
    },
  },
  {
    number: 9,
    level: 'great',
    title: {
      vi: 'Cửa sáng mở ra',
      en: 'A Bright Door Opens',
    },
    verse: {
      vi: 'Cửa son hé ánh bình minh,\nCông danh tiến bước, tâm tình sáng trong.',
      en: 'A bright door opens at dawn,\nProgress comes with a clear heart.',
    },
    interpretation: {
      vi: 'Cơ hội mới trong công việc, học tập hoặc dự án cá nhân đang đến gần. Sự chuẩn bị trước đây bắt đầu phát huy giá trị.',
      en: 'A new opportunity in work, study, or a personal project is approaching. Past preparation begins to pay off.',
    },
    advice: {
      vi: 'Tự tin trình bày năng lực của bạn.',
      en: 'Confidently present your abilities.',
    },
  },
  {
    number: 10,
    level: 'good',
    title: {
      vi: 'Nước chảy đá mòn',
      en: 'Water Wears the Stone',
    },
    verse: {
      vi: 'Nước mềm mà đá cũng mòn,\nBền tâm tiến bước, đường còn sẽ thông.',
      en: 'Soft water slowly shapes the stone,\nSteady effort clears the road.',
    },
    interpretation: {
      vi: 'Không cần thay đổi quá lớn. Những tiến bộ nhỏ nhưng liên tục sẽ đưa bạn đến kết quả mong muốn.',
      en: 'A dramatic change is unnecessary. Small, consistent progress will lead to the desired result.',
    },
    advice: {
      vi: 'Đừng bỏ cuộc chỉ vì tiến triển chậm.',
      en: 'Do not quit because progress feels slow.',
    },
  },
  {
    number: 11,
    level: 'neutral',
    title: {
      vi: 'Gương cần lau sáng',
      en: 'A Mirror Needs Polishing',
    },
    verse: {
      vi: 'Gương mờ chẳng phải mất trong,\nLau đi bụi cũ, soi lòng thấy ngay.',
      en: 'A clouded mirror has not lost its light,\nClear the dust and truth appears.',
    },
    interpretation: {
      vi: 'Bạn cần nhìn lại động cơ, thói quen hoặc thông tin đang có. Khi thấy rõ vấn đề, hướng đi sẽ tự nhiên sáng hơn.',
      en: 'Review your motives, habits, or current information. Clarity will reveal the next step.',
    },
    advice: {
      vi: 'Dành thời gian tự nhìn lại trước khi hành động.',
      en: 'Reflect before taking action.',
    },
  },
  {
    number: 12,
    level: 'caution',
    title: {
      vi: 'Mây che đỉnh núi',
      en: 'Clouds Cover the Peak',
    },
    verse: {
      vi: 'Núi cao mây phủ chưa tường,\nĐừng đi quá vội kẻo đường lạc xa.',
      en: 'Clouds hide the mountain peak,\nDo not hurry into an unclear path.',
    },
    interpretation: {
      vi: 'Thông tin còn thiếu hoặc có điều chưa được nói rõ. Chưa nên đầu tư lớn, cam kết dài hạn hoặc tin hoàn toàn vào lời hứa.',
      en: 'Important information may be missing. Avoid major investment, long commitments, or relying fully on promises.',
    },
    advice: {
      vi: 'Tìm thêm bằng chứng và hỏi người có kinh nghiệm.',
      en: 'Seek more evidence and experienced advice.',
    },
  },
  {
    number: 13,
    level: 'great',
    title: {
      vi: 'Phúc đến từ tâm',
      en: 'Blessings Follow the Heart',
    },
    verse: {
      vi: 'Tâm lành gieo hạt từ bi,\nPhúc theo chân bước, việc gì cũng an.',
      en: 'A kind heart plants compassion,\nPeace follows every step.',
    },
    interpretation: {
      vi: 'Việc thiện, sự chân thành và thái độ tử tế đang tạo ra kết quả tích cực. Đây là quẻ tốt cho hòa giải và giúp đỡ người khác.',
      en: 'Kindness and sincerity are creating positive results. This is favorable for reconciliation and helping others.',
    },
    advice: {
      vi: 'Làm một việc tốt mà không mong đáp lại.',
      en: 'Do one kind act without expecting return.',
    },
  },
  {
    number: 14,
    level: 'good',
    title: {
      vi: 'Đèn sáng trong đêm',
      en: 'A Lamp in the Night',
    },
    verse: {
      vi: 'Đêm sâu còn một ngọn đèn,\nGiữ niềm tin sáng, lối quen hiện dần.',
      en: 'A single lamp remains in the night,\nKeep faith and the path appears.',
    },
    interpretation: {
      vi: 'Dù hiện tại chưa hoàn toàn thuận lợi, bạn vẫn có một điểm tựa đáng tin cậy. Tập trung vào điều đang hoạt động tốt.',
      en: 'Even if conditions are imperfect, you have a reliable source of support. Focus on what is working.',
    },
    advice: {
      vi: 'Bảo vệ năng lượng và ưu tiên điều quan trọng nhất.',
      en: 'Protect your energy and prioritize what matters most.',
    },
  },
  {
    number: 15,
    level: 'neutral',
    title: {
      vi: 'Khách đến rồi đi',
      en: 'A Passing Guest',
    },
    verse: {
      vi: 'Người qua để lại đôi lời,\nDuyên còn thì gặp, duyên vơi nhẹ lòng.',
      en: 'A traveler leaves a few words behind,\nWhat belongs will stay, what passes can go.',
    },
    interpretation: {
      vi: 'Một mối quan hệ hoặc cơ hội có tính tạm thời. Đừng cố giữ điều không phù hợp chỉ vì tiếc nuối.',
      en: 'A relationship or opportunity may be temporary. Do not hold onto what no longer fits out of regret.',
    },
    advice: {
      vi: 'Trân trọng nhưng không bám chấp.',
      en: 'Appreciate without clinging.',
    },
  },
  {
    number: 16,
    level: 'caution',
    title: {
      vi: 'Chớ nghe một phía',
      en: 'Do Not Hear Only One Side',
    },
    verse: {
      vi: 'Chuyện đời hai mặt đôi bên,\nNghe cho đủ lẽ mới nên phân tường.',
      en: 'Every matter has more than one side,\nHear fully before making judgment.',
    },
    interpretation: {
      vi: 'Bạn có nguy cơ đánh giá vội dựa trên thông tin một chiều. Điều này đặc biệt quan trọng trong chuyện tiền bạc và quan hệ.',
      en: 'You may judge too quickly from one-sided information, especially in money and relationships.',
    },
    advice: {
      vi: 'Xác minh từ ít nhất hai nguồn.',
      en: 'Verify through at least two sources.',
    },
  },
  {
    number: 17,
    level: 'great',
    title: {
      vi: 'Rồng gặp mây',
      en: 'Dragon Meets the Clouds',
    },
    verse: {
      vi: 'Rồng thiêng gặp hội mây trời,\nTài năng đúng chỗ, thời thời vươn cao.',
      en: 'The dragon meets gathering clouds,\nTalent finds its place and rises.',
    },
    interpretation: {
      vi: 'Năng lực của bạn có cơ hội được nhìn nhận đúng mức. Phù hợp cho thi cử, phỏng vấn, thăng tiến hoặc khởi động dự án.',
      en: 'Your ability may finally be recognized. Favorable for exams, interviews, advancement, or launching a project.',
    },
    advice: {
      vi: 'Chuẩn bị kỹ và bước ra đúng lúc.',
      en: 'Prepare well and step forward at the right time.',
    },
  },
  {
    number: 18,
    level: 'good',
    title: {
      vi: 'Nhà ấm bếp hồng',
      en: 'Warm Home, Bright Hearth',
    },
    verse: {
      vi: 'Bếp hồng giữ ấm mái hiên,\nGia đình thuận ý, bình yên trong nhà.',
      en: 'A warm hearth protects the home,\nHarmony brings peace within.',
    },
    interpretation: {
      vi: 'Gia đạo và những vấn đề liên quan đến nhà cửa có xu hướng ổn định. Thích hợp hàn gắn, sắp xếp hoặc chăm sóc người thân.',
      en: 'Family and home matters tend toward stability. Good for reconciliation, organization, and caring for loved ones.',
    },
    advice: {
      vi: 'Dành thời gian cho gia đình và không gian sống.',
      en: 'Make time for family and your living space.',
    },
  },
  {
    number: 19,
    level: 'neutral',
    title: {
      vi: 'Một bước nghỉ chân',
      en: 'Pause for One Step',
    },
    verse: {
      vi: 'Đường dài xin tạm nghỉ chân,\nSức hồi tâm sáng, bước gần hóa xa.',
      en: 'On a long road, pause to rest,\nRenewed strength makes distance lighter.',
    },
    interpretation: {
      vi: 'Bạn đang cần phục hồi hơn là cố gắng thêm. Nghỉ ngơi hợp lý sẽ giúp tránh kiệt sức và quyết định sai.',
      en: 'You need recovery more than additional effort. Proper rest can prevent burnout and poor decisions.',
    },
    advice: {
      vi: 'Cho phép bản thân nghỉ mà không cảm thấy tội lỗi.',
      en: 'Allow yourself to rest without guilt.',
    },
  },
  {
    number: 20,
    level: 'caution',
    title: {
      vi: 'Giữ tiền như giữ nước',
      en: 'Guard Money Like Water',
    },
    verse: {
      vi: 'Bình nghiêng nước dễ tràn ra,\nChi tiêu có độ, cửa nhà mới yên.',
      en: 'A tilted vessel easily spills,\nMeasured spending protects peace.',
    },
    interpretation: {
      vi: 'Cần thận trọng với chi tiêu, vay mượn hoặc đầu tư rủi ro. Tránh quyết định tài chính vì cảm xúc.',
      en: 'Be cautious with spending, borrowing, and risky investment. Avoid emotional financial decisions.',
    },
    advice: {
      vi: 'Hoãn khoản chi lớn và xem lại ngân sách.',
      en: 'Delay major spending and review your budget.',
    },
  },
  {
    number: 21,
    level: 'great',
    title: {
      vi: 'Sen nở giữa hồ',
      en: 'Lotus Blooms on the Lake',
    },
    verse: {
      vi: 'Bùn sâu sen vẫn ngát hương,\nQua cơn thử thách, con đường đẹp thêm.',
      en: 'The lotus blooms above deep mud,\nTrials make the path more beautiful.',
    },
    interpretation: {
      vi: 'Bạn có khả năng vượt qua hoàn cảnh khó khăn bằng sự sáng suốt và phẩm chất tốt. Một kết quả đáng tự hào đang hình thành.',
      en: 'You can rise above difficulty through wisdom and character. A result worth being proud of is forming.',
    },
    advice: {
      vi: 'Giữ nguyên giá trị tốt đẹp của mình.',
      en: 'Remain true to your values.',
    },
  },
  {
    number: 22,
    level: 'good',
    title: {
      vi: 'Tin vui từ xa',
      en: 'Good News from Afar',
    },
    verse: {
      vi: 'Chim bay mang tín phương xa,\nTin lành ghé cửa, lòng ta nhẹ nhàng.',
      en: 'A bird carries news from afar,\nGood tidings arrive and ease the heart.',
    },
    interpretation: {
      vi: 'Có thể nhận được tin nhắn, kết quả hoặc cơ hội từ một nơi xa, nền tảng trực tuyến hoặc người lâu ngày chưa gặp.',
      en: 'News, results, or opportunity may come from afar, online, or from someone not seen for some time.',
    },
    advice: {
      vi: 'Kiểm tra lại các kênh liên lạc và phản hồi kịp thời.',
      en: 'Check your messages and respond promptly.',
    },
  },
  {
    number: 23,
    level: 'neutral',
    title: {
      vi: 'Hai đường trước mặt',
      en: 'Two Roads Ahead',
    },
    verse: {
      vi: 'Hai đường cùng hiện trước chân,\nChọn theo giá trị, chẳng cần theo đông.',
      en: 'Two roads appear before your feet,\nChoose by values, not by the crowd.',
    },
    interpretation: {
      vi: 'Bạn đang đứng trước một lựa chọn có hai hướng tương đối cân bằng. Câu trả lời nằm ở điều phù hợp với giá trị lâu dài.',
      en: 'You face two fairly balanced choices. The answer lies in what best fits your long-term values.',
    },
    advice: {
      vi: 'Viết rõ lợi ích, rủi ro và điều bạn thực sự muốn.',
      en: 'Write down benefits, risks, and what you truly want.',
    },
  },
  {
    number: 24,
    level: 'caution',
    title: {
      vi: 'Lửa gần rơm khô',
      en: 'Fire Near Dry Straw',
    },
    verse: {
      vi: 'Lửa gần rơm dễ bén nhanh,\nGiữ mình tỉnh thức, tránh tranh hơn thua.',
      en: 'Fire spreads quickly near dry straw,\nStay aware and avoid needless conflict.',
    },
    interpretation: {
      vi: 'Tình huống nhạy cảm có thể bùng lên nếu bị kích động. Không phù hợp để tranh cãi, khiêu khích hoặc đưa quyết định trong áp lực.',
      en: 'A sensitive situation may flare up under pressure. Avoid provocation, argument, or pressured decisions.',
    },
    advice: {
      vi: 'Rời khỏi cuộc tranh luận và quay lại khi bình tĩnh.',
      en: 'Step away and return when calm.',
    },
  },
];
