export type InterpretationLanguage = 'vi' | 'en';

type Dictionary = Record<string, string>;

const VI: Dictionary = {
  'character.headline.friend': 'Thiên hướng độc lập và coi trọng bản sắc cá nhân',
  'character.headline.robWealth': 'Năng lượng cạnh tranh, kết nối và hành động nhanh',
  'character.headline.eatingGod': 'Thiên hướng sáng tạo, trải nghiệm và nuôi dưỡng giá trị',
  'character.headline.hurtingOfficer': 'Tư duy biểu đạt mạnh, thích cải tiến và chất vấn khuôn mẫu',
  'character.headline.indirectWealth': 'Nhạy bén với cơ hội và môi trường thay đổi',
  'character.headline.directWealth': 'Thực tế, có trách nhiệm và chú trọng kết quả bền vững',
  'character.headline.sevenKillings': 'Quyết đoán, chịu áp lực và thích thử thách',
  'character.headline.directOfficer': 'Kỷ luật, coi trọng chuẩn mực và trách nhiệm',
  'character.headline.indirectResource': 'Trực giác, học nhanh và thích góc nhìn khác biệt',
  'character.headline.directResource': 'Ham học, thận trọng và coi trọng nền tảng',

  'character.strength.friend': 'Có ý thức rõ về bản thân và khả năng tự chủ.',
  'character.strength.robWealth': 'Giỏi tạo động lực và kết nối với người cùng mục tiêu.',
  'character.strength.eatingGod': 'Có khả năng sáng tạo và biến trải nghiệm thành giá trị.',
  'character.strength.hurtingOfficer': 'Biểu đạt rõ và thường nhìn ra điểm cần cải tiến.',
  'character.strength.indirectWealth': 'Nhạy với cơ hội mới và thích nghi nhanh.',
  'character.strength.directWealth': 'Có xu hướng quản lý nguồn lực thực tế và đều đặn.',
  'character.strength.sevenKillings': 'Có sức chịu áp lực và phản ứng nhanh trong thử thách.',
  'character.strength.directOfficer': 'Có tinh thần trách nhiệm và khả năng làm việc theo hệ thống.',
  'character.strength.indirectResource': 'Trực giác tốt và tiếp thu từ nhiều nguồn.',
  'character.strength.directResource': 'Có năng lực học sâu và xây nền kiến thức.',

  'character.caution.veryStrong': 'Năng lượng bản thân mạnh có thể dẫn đến cố chấp hoặc ôm quyền kiểm soát.',
  'character.caution.veryWeak': 'Dễ phân tán năng lượng khi phải gánh quá nhiều áp lực cùng lúc.',
  'character.caution.balanceBlindSpots': 'Hãy để ý những điểm mù đến từ thói quen và môi trường quen thuộc.',
  'character.advice.veryWeak': 'Ưu tiên phục hồi, học hỏi và xây mạng lưới hỗ trợ trước khi mở rộng.',
  'character.advice.weak': 'Tăng nền tảng và nguồn lực trước khi nhận thêm trách nhiệm.',
  'character.advice.balanced': 'Duy trì nhịp ổn định và linh hoạt theo từng chu kỳ.',
  'character.advice.strong': 'Dùng năng lượng mạnh để tạo giá trị, chia sẻ và trao quyền.',
  'character.advice.veryStrong': 'Chủ động tiết chế, lắng nghe và tạo không gian cho người khác.',
  'character.advice.useFavorableElementsAsContext': 'Dùng ngũ hành thuận lợi như một gợi ý cân bằng, không phải quy tắc cứng.',

  'love.headline.connectionOriented': 'Thiên hướng xây dựng kết nối và sự hòa hợp',
  'love.headline.boundaryAndCommunication': 'Bài học chính nằm ở ranh giới và giao tiếp',
  'love.headline.steadyDevelopment': 'Tình cảm phát triển tốt qua thời gian và sự rõ ràng',
  'love.strength.harmonyPresent': 'Lá số có dấu hiệu hỗ trợ khả năng tìm điểm chung.',
  'love.strength.selfAwarenessNeeded': 'Tự nhận biết nhu cầu tình cảm sẽ giúp mối quan hệ ổn định hơn.',
  'love.strength.relationshipStarVisible': 'Năng lượng liên quan đến quan hệ hiện diện tương đối rõ.',
  'love.strength.slowTrustCanBeStable': 'Niềm tin xây chậm có thể tạo nền tảng bền.',
  'love.caution.manageConflictPatterns': 'Cần nhận diện sớm cách phản ứng khi căng thẳng hoặc bất đồng.',
  'love.caution.avoidAssumptions': 'Tránh tự đoán ý đối phương khi thông tin chưa rõ.',
  'love.caution.doNotTreatScoreAsPrediction': 'Điểm số không phải dự đoán chắc chắn về tình duyên.',
  'love.advice.communicateNeedsClearly': 'Nói rõ nhu cầu, giới hạn và kỳ vọng bằng ngôn ngữ bình tĩnh.',
  'love.advice.buildSharedRituals': 'Duy trì những thói quen chung nhỏ nhưng đều đặn.',
  'love.advice.createEmotionalSafety': 'Xây cảm giác an toàn trước khi đòi hỏi sự gần gũi sâu.',

  'career.headline.balancedContributor': 'Phù hợp phát triển theo hướng cân bằng và đa kỹ năng',
  'career.headline.structureAndLeadership': 'Thiên hướng hệ thống, trách nhiệm và lãnh đạo',
  'career.headline.creationAndCommunication': 'Thiên hướng sáng tạo, biểu đạt và đổi mới',
  'career.headline.learningAndAnalysis': 'Thiên hướng học sâu, phân tích và cố vấn',
  'career.headline.executionAndCommerce': 'Thiên hướng thực thi, nguồn lực và thương mại',
  'career.strength.responsibility': 'Có khả năng nhận trách nhiệm và giữ chuẩn công việc.',
  'career.strength.flexibility': 'Linh hoạt khi vai trò hoặc bối cảnh thay đổi.',
  'career.strength.learning': 'Có năng lực học sâu và xây chuyên môn.',
  'career.strength.practicalLearning': 'Học tốt nhất thông qua trải nghiệm thực tế.',
  'career.strength.expression': 'Có tiềm năng truyền đạt, sáng tạo hoặc tạo sản phẩm.',
  'career.strength.focusedDelivery': 'Có thể phát triển bằng cách tập trung vào đầu ra cụ thể.',
  'career.caution.overControl': 'Tránh ôm việc hoặc kiểm soát quá sâu.',
  'career.caution.energyManagement': 'Cần quản lý sức lực trước khi mở rộng khối lượng công việc.',
  'career.caution.avoidScatteredPriorities': 'Không nên chia nguồn lực cho quá nhiều ưu tiên cùng lúc.',
  'career.advice.buildVisibleEvidence': 'Xây sản phẩm, hồ sơ hoặc kết quả có thể kiểm chứng.',
  'career.advice.useLuckCyclesAsPlanningContextOnly': 'Dùng đại vận và lưu niên như bối cảnh lập kế hoạch, không phải bảo đảm kết quả.',

  'wealth.headline.resourceManagementVisible': 'Khả năng nhận biết và quản lý nguồn lực hiện diện rõ',
  'wealth.headline.buildThroughConsistency': 'Tài chính phù hợp với chiến lược tích lũy đều đặn',
  'wealth.strength.commercialAwareness': 'Có độ nhạy nhất định với giá trị và cơ hội thương mại.',
  'wealth.strength.longTermBuilding': 'Có thể phát triển tài chính bằng kỷ luật dài hạn.',
  'wealth.strength.createValue': 'Khả năng tạo đầu ra có thể chuyển thành giá trị.',
  'wealth.strength.conservativePacing': 'Nhịp thận trọng giúp hạn chế quyết định vội.',
  'wealth.caution.doNotOverextend': 'Tránh vay, đầu tư hoặc mở rộng vượt quá nguồn lực hiện có.',
  'wealth.caution.avoidOverconfidence': 'Tránh đánh giá thấp rủi ro khi đang thuận lợi.',
  'wealth.advice.budgetAndDiversify': 'Ưu tiên ngân sách, dự phòng và phân tán rủi ro hợp lý.',
  'wealth.advice.noGuaranteedFinancialPrediction': 'Phần này không phải tư vấn hay dự đoán tài chính chắc chắn.',

  'wellbeing.headline.elementBalance': 'Ngũ hành tương đối cân bằng về mặt cấu trúc',
  'wellbeing.headline.rhythmAndRecovery': 'Nên chú trọng nhịp sinh hoạt và khả năng phục hồi',
  'wellbeing.advice.notMedicalAdvice': 'Đây không phải chẩn đoán hoặc tư vấn y khoa.',
};

const EN: Dictionary = {
  'character.headline.friend': 'Independent identity and self-direction',
  'character.headline.robWealth': 'Competitive, social, and action-oriented energy',
  'character.headline.eatingGod': 'Creative, experiential, and value-nurturing tendencies',
  'character.headline.hurtingOfficer': 'Strong expression and a drive to improve systems',
  'character.headline.indirectWealth': 'Opportunity awareness and adaptability',
  'character.headline.directWealth': 'Practical responsibility and sustainable results',
  'character.headline.sevenKillings': 'Decisiveness and resilience under pressure',
  'character.headline.directOfficer': 'Discipline, standards, and responsibility',
  'character.headline.indirectResource': 'Intuition and unconventional learning',
  'character.headline.directResource': 'Deep learning and careful foundations',

  'love.headline.connectionOriented': 'Connection and harmony oriented',
  'love.headline.boundaryAndCommunication': 'Boundaries and communication are central lessons',
  'love.headline.steadyDevelopment': 'Love develops through time and clarity',
  'love.caution.doNotTreatScoreAsPrediction': 'The score is not a certain prediction of relationship outcomes.',
  'love.advice.communicateNeedsClearly': 'Communicate needs, boundaries, and expectations calmly.',
  'love.advice.buildSharedRituals': 'Maintain small and consistent shared routines.',
  'love.advice.createEmotionalSafety': 'Build emotional safety before demanding deeper closeness.',

  'career.headline.balancedContributor': 'Balanced, multi-skilled contribution',
  'career.headline.structureAndLeadership': 'Structure, responsibility, and leadership',
  'career.headline.creationAndCommunication': 'Creation, communication, and innovation',
  'career.headline.learningAndAnalysis': 'Learning, analysis, and advisory work',
  'career.headline.executionAndCommerce': 'Execution, resources, and commerce',
  'career.advice.buildVisibleEvidence': 'Build visible and verifiable work products.',
  'career.advice.useLuckCyclesAsPlanningContextOnly': 'Use luck cycles as planning context, not guaranteed outcomes.',

  'wealth.headline.resourceManagementVisible': 'Resource management is relatively visible',
  'wealth.headline.buildThroughConsistency': 'Wealth grows best through consistency',
  'wealth.advice.budgetAndDiversify': 'Prioritize budgeting, reserves, and sensible diversification.',
  'wealth.advice.noGuaranteedFinancialPrediction': 'This section is not financial advice or a guaranteed forecast.',

  'wellbeing.headline.elementBalance': 'The five elements are structurally balanced',
  'wellbeing.headline.rhythmAndRecovery': 'Rhythm and recovery deserve attention',
  'wellbeing.advice.notMedicalAdvice': 'This is not medical diagnosis or advice.',
};

const ELEMENT_VI: Record<string, string> = {
  wood: 'Mộc',
  fire: 'Hỏa',
  earth: 'Thổ',
  metal: 'Kim',
  water: 'Thủy',
};

const ELEMENT_EN: Record<string, string> = {
  wood: 'Wood',
  fire: 'Fire',
  earth: 'Earth',
  metal: 'Metal',
  water: 'Water',
};

export function translateInterpretationCode(
  code: string,
  language: InterpretationLanguage,
): string {
  const dictionary = language === 'vi' ? VI : EN;

  if (dictionary[code]) {
    return dictionary[code];
  }

  const dominantMatch = code.match(/^wellbeing\.strength\.dominant\.(.+)$/);
  if (dominantMatch) {
    const label = language === 'vi'
      ? ELEMENT_VI[dominantMatch[1]]
      : ELEMENT_EN[dominantMatch[1]];

    return language === 'vi'
      ? `Ngũ hành ${label ?? dominantMatch[1]} đang nổi bật.`
      : `${label ?? dominantMatch[1]} is a dominant element.`;
  }

  const lowMatch = code.match(/^wellbeing\.caution\.low\.(.+)$/);
  if (lowMatch) {
    const label = language === 'vi'
      ? ELEMENT_VI[lowMatch[1]]
      : ELEMENT_EN[lowMatch[1]];

    return language === 'vi'
      ? `Ngũ hành ${label ?? lowMatch[1]} tương đối thiếu trong cấu trúc.`
      : `${label ?? lowMatch[1]} is relatively underrepresented.`;
  }

  const supportMatch = code.match(/^wellbeing\.advice\.support\.(.+)$/);
  if (supportMatch) {
    const label = language === 'vi'
      ? ELEMENT_VI[supportMatch[1]]
      : ELEMENT_EN[supportMatch[1]];

    return language === 'vi'
      ? `Có thể dùng yếu tố ${label ?? supportMatch[1]} như một gợi ý cân bằng lối sống.`
      : `Use ${label ?? supportMatch[1]} as a lifestyle-balancing theme.`;
  }

  return code;
}
