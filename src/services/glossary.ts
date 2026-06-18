export type GlossaryLanguage = 'vi' | 'en' | 'zh' | 'ko' | 'ja';

export type GlossaryCategory =
  | 'foundation'
  | 'calendar'
  | 'bazi'
  | 'ziwei'
  | 'compatibility'
  | 'practice';

export type GlossaryLocalizedContent = {
  title: string;
  subtitle: string;
  definition: string;
  whyItMatters: string;
  example: string;
  caution: string;
};

export type GlossaryTerm = {
  id: string;
  category: GlossaryCategory;
  aliases: string[];
  relatedIds: string[];
  content: Record<GlossaryLanguage, GlossaryLocalizedContent>;
};

export type GlossarySearchResult = GlossaryTerm & {
  score: number;
};

const LANGUAGE_FALLBACK: GlossaryLanguage = 'en';

const TERMS: GlossaryTerm[] = [
  {
    id: "heavenly-stems",
    category: "foundation",
    aliases: [
      "thiên can",
      "thien can",
      "can",
      "heavenly stems",
      "天干",
      "천간",
    ],
    relatedIds: [
      "earthly-branches",
      "five-elements",
      "sexagenary-cycle",
    ],
    content: {
      vi: {
        title: "Thiên Can",
        subtitle: "Mười ký hiệu nền tảng của hệ Can Chi.",
        definition: "Thiên Can gồm Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý. Mỗi Can gắn với một hành và tính âm/dương.",
        whyItMatters: "Dùng để xác định Nhật chủ, Thập thần và lớp tương tác bề mặt trong Bát Tự.",
        example: "Trụ ngày Giáp Tý có Nhật chủ là Giáp, thường gắn với Mộc dương.",
        caution: "Không nên đọc riêng một Can để kết luận. Cần xem cùng Địa Chi, mùa sinh và toàn bộ lá số.",
      },
      en: {
        title: "Heavenly Stems",
        subtitle: "The ten stem symbols of the sexagenary system.",
        definition: "The Heavenly Stems are Jia, Yi, Bing, Ding, Wu, Ji, Geng, Xin, Ren, and Gui. Each stem has an element and yin/yang polarity.",
        whyItMatters: "They identify the Day Master, Ten Gods, and visible interactions in BaZi.",
        example: "A Jia Zi day has Jia as the Day Master, usually associated with yang Wood.",
        caution: "Do not use one stem alone as a conclusion. Read it with branches, season, and the full chart.",
      },
      zh: {
        title: "天干",
        subtitle: "干支系统中的十个基础符号。",
        definition: "天干包括甲、乙、丙、丁、戊、己、庚、辛、壬、癸，每个天干对应五行和阴阳。",
        whyItMatters: "用于判断日主、十神以及八字表层互动。",
        example: "甲子日的日主是甲，通常对应阳木。",
        caution: "不要只凭一个天干下结论，应结合地支、季节和全局。",
      },
      ko: {
        title: "천간",
        subtitle: "간지 체계의 열 가지 기본 기호입니다.",
        definition: "천간은 갑, 을, 병, 정, 무, 기, 경, 신, 임, 계이며 각각 오행과 음양을 가집니다.",
        whyItMatters: "일간, 십신, 사주의 표면 상호작용을 판단하는 데 사용됩니다.",
        example: "갑자일은 갑을 일간으로 보며 보통 양목과 연결됩니다.",
        caution: "천간 하나만으로 결론을 내리지 말고 지지, 계절, 전체 명식과 함께 보세요.",
      },
      ja: {
        title: "天干",
        subtitle: "干支体系の十個の基本記号です。",
        definition: "天干は甲、乙、丙、丁、戊、己、庚、辛、壬、癸で、それぞれ五行と陰陽に対応します。",
        whyItMatters: "日主、通変星、八字の表層的な相互作用を見るために使われます。",
        example: "甲子日は甲を日主とし、一般に陽の木と関連します。",
        caution: "一つの天干だけで判断せず、地支、季節、全体命式と合わせて読んでください。",
      },
    },
  },
  {
    id: "earthly-branches",
    category: "foundation",
    aliases: [
      "địa chi",
      "dia chi",
      "earthly branches",
      "zodiac",
      "地支",
      "十二支",
      "지지",
    ],
    relatedIds: [
      "heavenly-stems",
      "zodiac-clash",
      "six-harmony",
    ],
    content: {
      vi: {
        title: "Địa Chi",
        subtitle: "Mười hai nhánh gắn với con giáp, tháng, giờ và phương vị.",
        definition: "Địa Chi gồm Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi. Mỗi Chi có hành, mùa, hướng và quan hệ với Chi khác.",
        whyItMatters: "Dùng để đọc tàng can, xung hợp, tam hợp, lục hợp và chu kỳ thời gian.",
        example: "Mão gặp Dậu thường được đọc là quan hệ xung.",
        caution: "Xung không phải xấu tuyệt đối; đó là tín hiệu cần quản lý khác biệt.",
      },
      en: {
        title: "Earthly Branches",
        subtitle: "Twelve branches linked with zodiac animals, months, hours, and directions.",
        definition: "The branches are Zi, Chou, Yin, Mao, Chen, Si, Wu, Wei, Shen, You, Xu, and Hai. Each has element, season, direction, and relationships.",
        whyItMatters: "They reveal hidden stems, clashes, harmonies, combinations, and time cycles.",
        example: "Mao meeting You is often read as a clash.",
        caution: "A clash is not automatically bad; it signals differences that need management.",
      },
      zh: {
        title: "地支",
        subtitle: "与生肖、月份、时辰和方位相关的十二个符号。",
        definition: "地支为子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥。每支有五行、季节、方位和关系。",
        whyItMatters: "用于读取藏干、冲合、三合、六合和时间周期。",
        example: "卯遇酉常被视为相冲。",
        caution: "相冲不等于一定不好，通常表示需要管理的差异。",
      },
      ko: {
        title: "지지",
        subtitle: "띠, 월, 시간, 방향과 연결되는 열두 기호입니다.",
        definition: "지지는 자, 축, 인, 묘, 진, 사, 오, 미, 신, 유, 술, 해입니다. 각각 오행, 계절, 방향, 관계를 가집니다.",
        whyItMatters: "지장간, 충합, 삼합, 육합, 시간 주기를 읽는 데 사용됩니다.",
        example: "묘와 유는 보통 충으로 읽힙니다.",
        caution: "충은 반드시 나쁜 것이 아니라 관리할 차이를 나타냅니다.",
      },
      ja: {
        title: "地支",
        subtitle: "生肖、月、時刻、方位と関わる十二の記号です。",
        definition: "地支は子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥で、五行、季節、方位、関係を持ちます。",
        whyItMatters: "蔵干、冲合、三合、六合、時間周期を読むために使われます。",
        example: "卯と酉は冲として読まれることがあります。",
        caution: "冲は必ず悪いわけではなく、管理すべき違いを示します。",
      },
    },
  },
  {
    id: "five-elements",
    category: "foundation",
    aliases: [
      "ngũ hành",
      "ngu hanh",
      "five elements",
      "wuxing",
      "五行",
      "오행",
    ],
    relatedIds: [
      "generating-cycle",
      "controlling-cycle",
      "day-master",
    ],
    content: {
      vi: {
        title: "Ngũ Hành",
        subtitle: "Mộc, Hỏa, Thổ, Kim, Thủy.",
        definition: "Ngũ Hành là năm nhóm biểu tượng mô tả sự vận động và tương tác: Mộc, Hỏa, Thổ, Kim, Thủy.",
        whyItMatters: "Là nền tảng cho Bát Tự, Tử Vi, chọn ngày, Timeline và Compatibility.",
        example: "Nhật chủ Mộc sinh vào mùa xuân thường được xem là Mộc có lực hơn.",
        caution: "Ngũ Hành là mô hình biểu tượng, không phải nguyên tố vật lý hiện đại.",
      },
      en: {
        title: "Five Elements",
        subtitle: "Wood, Fire, Earth, Metal, and Water.",
        definition: "The Five Elements are symbolic categories for movement and interaction: Wood, Fire, Earth, Metal, and Water.",
        whyItMatters: "They support BaZi, Zi Wei, date selection, Timeline, and Compatibility.",
        example: "A Wood Day Master born in spring may be read as stronger Wood.",
        caution: "The Five Elements are symbolic, not physical elements in modern science.",
      },
      zh: {
        title: "五行",
        subtitle: "木、火、土、金、水。",
        definition: "五行是描述运动与互动的象征分类：木、火、土、金、水。",
        whyItMatters: "它是八字、紫微、择日、时间轴和合盘的基础。",
        example: "木日主生于春季时，木可能被视为较有力。",
        caution: "五行是象征模型，不是现代科学的物理元素。",
      },
      ko: {
        title: "오행",
        subtitle: "목, 화, 토, 금, 수.",
        definition: "오행은 움직임과 상호작용을 설명하는 상징 범주입니다: 목, 화, 토, 금, 수.",
        whyItMatters: "사주, 자미, 날짜 선택, 타임라인, 궁합의 기반입니다.",
        example: "목 일간이 봄에 태어나면 목이 더 강하게 읽힐 수 있습니다.",
        caution: "오행은 상징 모델이며 현대 과학의 물리 원소가 아닙니다.",
      },
      ja: {
        title: "五行",
        subtitle: "木、火、土、金、水。",
        definition: "五行は動きと相互作用を説明する象徴分類です。木・火・土・金・水があります。",
        whyItMatters: "八字、紫微、日選び、タイムライン、相性の基盤です。",
        example: "木の日主が春に生まれると木が強いと読まれる場合があります。",
        caution: "五行は象徴モデルであり、現代科学の物理元素ではありません。",
      },
    },
  },
  {
    id: "generating-cycle",
    category: "foundation",
    aliases: [
      "tương sinh",
      "tuong sinh",
      "generating cycle",
      "相生",
      "상생",
    ],
    relatedIds: [
      "five-elements",
      "controlling-cycle",
      "compatibility-score",
    ],
    content: {
      vi: {
        title: "Tương Sinh",
        subtitle: "Vòng hỗ trợ giữa các hành.",
        definition: "Tương Sinh là Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim, Kim sinh Thủy, Thủy sinh Mộc.",
        whyItMatters: "Dùng để đọc sự hỗ trợ trong Bát Tự và Compatibility.",
        example: "Thủy có thể hỗ trợ Mộc vì Thủy sinh Mộc.",
        caution: "Sinh thêm không luôn tốt nếu hành đó đã quá mạnh.",
      },
      en: {
        title: "Generating Cycle",
        subtitle: "The supportive cycle among elements.",
        definition: "The cycle is Wood → Fire → Earth → Metal → Water → Wood.",
        whyItMatters: "It helps read support in BaZi and Compatibility.",
        example: "Water may support Wood because Water generates Wood.",
        caution: "More support is not always good if the element is already excessive.",
      },
      zh: {
        title: "相生",
        subtitle: "五行之间的支持循环。",
        definition: "相生为木生火、火生土、土生金、金生水、水生木。",
        whyItMatters: "用于读取八字与合盘中的支持关系。",
        example: "水可生木，因此水能支持木。",
        caution: "若某行已过强，再被生扶未必有利。",
      },
      ko: {
        title: "상생",
        subtitle: "오행 사이의 지원 순환입니다.",
        definition: "상생은 목→화→토→금→수→목입니다.",
        whyItMatters: "사주와 궁합에서 지원 관계를 읽는 데 사용됩니다.",
        example: "수는 목을 생하므로 목을 지원할 수 있습니다.",
        caution: "이미 과한 오행에 더 많은 지원이 항상 좋은 것은 아닙니다.",
      },
      ja: {
        title: "相生",
        subtitle: "五行の支援循環です。",
        definition: "相生は木→火→土→金→水→木です。",
        whyItMatters: "八字や相性の支援関係を読むために使われます。",
        example: "水は木を生じるため木を支援できます。",
        caution: "すでに強すぎる五行をさらに支えることが常に良いとは限りません。",
      },
    },
  },
  {
    id: "controlling-cycle",
    category: "foundation",
    aliases: [
      "tương khắc",
      "tuong khac",
      "controlling cycle",
      "相克",
      "상극",
    ],
    relatedIds: [
      "five-elements",
      "generating-cycle",
      "compatibility-score",
    ],
    content: {
      vi: {
        title: "Tương Khắc",
        subtitle: "Vòng kiểm soát giữa các hành.",
        definition: "Tương Khắc là Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc.",
        whyItMatters: "Giúp đọc áp lực, kỷ luật, kiểm soát và xung đột.",
        example: "Hỏa khắc Kim có thể là áp lực lên hành Kim.",
        caution: "Khắc không đồng nghĩa xấu; kiểm soát hợp lý có thể tạo cân bằng.",
      },
      en: {
        title: "Controlling Cycle",
        subtitle: "The regulating cycle among elements.",
        definition: "Wood controls Earth, Earth controls Water, Water controls Fire, Fire controls Metal, and Metal controls Wood.",
        whyItMatters: "It helps read pressure, discipline, regulation, and conflict.",
        example: "Fire controlling Metal can be read as pressure on Metal.",
        caution: "Control is not automatically bad; proper regulation can create balance.",
      },
      zh: {
        title: "相克",
        subtitle: "五行之间的制约循环。",
        definition: "木克土、土克水、水克火、火克金、金克木。",
        whyItMatters: "用于读取压力、纪律、制约与冲突。",
        example: "火克金可视为对金的压力。",
        caution: "克不等于坏，适当制约也能带来平衡。",
      },
      ko: {
        title: "상극",
        subtitle: "오행 사이의 제어 순환입니다.",
        definition: "목극토, 토극수, 수극화, 화극금, 금극목입니다.",
        whyItMatters: "압력, 규율, 조절, 갈등을 읽는 데 도움이 됩니다.",
        example: "화극금은 금에 대한 압력으로 읽을 수 있습니다.",
        caution: "극이 곧 나쁜 것은 아니며 적절한 제어는 균형을 만듭니다.",
      },
      ja: {
        title: "相克",
        subtitle: "五行の制御循環です。",
        definition: "木克土、土克水、水克火、火克金、金克木です。",
        whyItMatters: "圧力、規律、調整、葛藤を読む助けになります。",
        example: "火克金は金への圧力として読めます。",
        caution: "克は必ず悪いわけではなく、適切な制御は均衡を作ります。",
      },
    },
  },
  {
    id: "sexagenary-cycle",
    category: "calendar",
    aliases: [
      "can chi",
      "lục thập hoa giáp",
      "sexagenary cycle",
      "干支",
      "六十甲子",
      "육십갑자",
    ],
    relatedIds: [
      "heavenly-stems",
      "earthly-branches",
      "solar-terms",
    ],
    content: {
      vi: {
        title: "Can Chi / Lục Thập Hoa Giáp",
        subtitle: "Chu kỳ 60 tổ hợp giữa Thiên Can và Địa Chi.",
        definition: "Can Chi ghép 10 Can với 12 Chi để tạo chu kỳ 60 dùng cho năm, tháng, ngày và giờ.",
        whyItMatters: "Today, Timeline và Bát Tự dùng Can Chi làm lớp thời gian nền.",
        example: "Giáp Tý là tổ hợp đầu tiên; sau 60 bước quay lại Giáp Tý.",
        caution: "Can Chi ngày và tháng có quy tắc riêng, không chỉ dựa vào ngày dương lịch.",
      },
      en: {
        title: "Sexagenary Cycle",
        subtitle: "The 60 combinations of stems and branches.",
        definition: "The cycle combines 10 stems with 12 branches to form 60 steps for years, months, days, and hours.",
        whyItMatters: "Today, Timeline, and BaZi use it as a timing layer.",
        example: "Jia Zi is the first combination; after 60 steps the cycle returns to Jia Zi.",
        caution: "Day and month pillars have their own rules, not just simple Gregorian dates.",
      },
      zh: {
        title: "六十甲子 / 干支",
        subtitle: "天干与地支组成的60个组合。",
        definition: "十天干与十二地支组合成60步，用于年、月、日、时。",
        whyItMatters: "今日、时间轴和八字都以干支作为时间层。",
        example: "甲子是第一个组合，60步后回到甲子。",
        caution: "日柱和月柱有各自规则，不只是公历日期。",
      },
      ko: {
        title: "육십갑자 / 간지",
        subtitle: "천간과 지지의 60개 조합입니다.",
        definition: "10천간과 12지지가 결합해 년·월·일·시의 60단계 주기를 만듭니다.",
        whyItMatters: "Today, 타임라인, 사주는 이를 시간 층으로 사용합니다.",
        example: "갑자가 첫 조합이며 60단계 후 다시 갑자로 돌아옵니다.",
        caution: "일주와 월주는 단순 양력 날짜만으로 정해지지 않습니다.",
      },
      ja: {
        title: "六十甲子 / 干支",
        subtitle: "天干と地支の60組み合わせです。",
        definition: "10天干と12地支を組み合わせ、年・月・日・時の60段階周期を作ります。",
        whyItMatters: "Today、タイムライン、八字はこれを時間層として使います。",
        example: "甲子が最初で、60段階後に再び甲子へ戻ります。",
        caution: "日柱と月柱には独自規則があり、単純な西暦日付だけではありません。",
      },
    },
  },
  {
    id: "lunar-calendar",
    category: "calendar",
    aliases: [
      "lịch âm",
      "lunar calendar",
      "âm lịch",
      "农历",
      "음력",
      "旧暦",
    ],
    relatedIds: [
      "solar-terms",
      "auspicious-hours",
      "sexagenary-cycle",
    ],
    content: {
      vi: {
        title: "Lịch Âm",
        subtitle: "Hệ lịch dựa trên chu kỳ Mặt Trăng và điều chỉnh theo mùa.",
        definition: "Lịch âm dùng tháng theo Mặt Trăng và có tháng nhuận để không lệch quá xa mùa.",
        whyItMatters: "Mùng một, ngày rằm, ngày âm và nhiều quy tắc chọn ngày dựa vào lịch âm.",
        example: "Ngày rằm thường là ngày 15 âm lịch.",
        caution: "Lịch âm có thể khác theo múi giờ và cách xử lý tháng nhuận.",
      },
      en: {
        title: "Lunar Calendar",
        subtitle: "A Moon-based calendar with seasonal adjustment.",
        definition: "The lunar calendar uses Moon-based months and leap months to stay aligned with seasons.",
        whyItMatters: "New moon, full moon, lunar dates, and date-selection rules rely on it.",
        example: "The full moon is usually lunar day 15.",
        caution: "Lunar calendars can differ by time zone and leap-month handling.",
      },
      zh: {
        title: "农历",
        subtitle: "基于月相并进行季节调整的历法。",
        definition: "农历以月亮周期定月，并通过闰月与季节保持相对同步。",
        whyItMatters: "初一、十五、农历日期和择日规则都依赖农历。",
        example: "十五通常是望日。",
        caution: "农历会因时区和闰月处理而不同。",
      },
      ko: {
        title: "음력",
        subtitle: "달의 주기를 기반으로 계절을 보정하는 달력입니다.",
        definition: "음력은 달의 주기로 월을 정하고 윤달로 계절 차이를 보정합니다.",
        whyItMatters: "초하루, 보름, 음력 날짜와 날짜 선택 규칙이 이에 의존합니다.",
        example: "보름은 보통 음력 15일입니다.",
        caution: "음력은 시간대와 윤달 처리에 따라 달라질 수 있습니다.",
      },
      ja: {
        title: "旧暦",
        subtitle: "月の周期を基礎に季節調整する暦です。",
        definition: "旧暦は月の周期で月を定め、閏月で季節とのズレを調整します。",
        whyItMatters: "朔日、満月、旧暦日付、日選びの規則が依存します。",
        example: "満月は通常旧暦15日です。",
        caution: "旧暦はタイムゾーンや閏月処理で異なることがあります。",
      },
    },
  },
  {
    id: "solar-terms",
    category: "calendar",
    aliases: [
      "tiết khí",
      "solar terms",
      "24 tiết khí",
      "节气",
      "절기",
      "二十四節気",
    ],
    relatedIds: [
      "lunar-calendar",
      "true-solar-time",
      "bazi-chart",
    ],
    content: {
      vi: {
        title: "Tiết Khí",
        subtitle: "24 mốc theo vị trí Mặt Trời trong năm.",
        definition: "Tiết khí là 24 mốc mùa. Trong nhiều hệ thống, tháng Can Chi đổi theo tiết khí.",
        whyItMatters: "Bát Tự thường dùng tiết khí để xác định tháng sinh.",
        example: "Sinh gần Lập Xuân có thể đổi năm hoặc tháng Can Chi tùy phương pháp.",
        caution: "Ranh giới tiết khí phụ thuộc thời gian chính xác và múi giờ.",
      },
      en: {
        title: "Solar Terms",
        subtitle: "The 24 seasonal markers based on the Sun’s position.",
        definition: "Solar terms are 24 seasonal markers. Many systems change the sexagenary month by solar terms.",
        whyItMatters: "BaZi often uses them to determine the birth month.",
        example: "Birth near Li Chun may change the year or month pillar depending on method.",
        caution: "Boundaries depend on exact time and time zone.",
      },
      zh: {
        title: "节气",
        subtitle: "根据太阳位置划分的24个季节节点。",
        definition: "节气是24个季节节点，许多体系以节气转换干支月。",
        whyItMatters: "八字常用节气确定出生月。",
        example: "出生在立春附近可能影响年柱或月柱。",
        caution: "节气边界取决于精确时间和时区。",
      },
      ko: {
        title: "절기",
        subtitle: "태양 위치를 기준으로 한 24개 계절 기준점입니다.",
        definition: "절기는 24개의 계절 기준점이며 많은 체계에서 간지 월이 절기로 바뀝니다.",
        whyItMatters: "사주는 절기로 출생월을 정하는 경우가 많습니다.",
        example: "입춘 근처 출생은 방법에 따라 년주나 월주가 달라질 수 있습니다.",
        caution: "경계는 정확한 시간과 시간대에 의존합니다.",
      },
      ja: {
        title: "節気",
        subtitle: "太陽位置に基づく24の季節指標です。",
        definition: "節気は24の季節指標で、多くの体系では干支月が節気で変わります。",
        whyItMatters: "八字では出生月を節気で決めることが多いです。",
        example: "立春近くの出生は年柱や月柱に影響する場合があります。",
        caution: "境界は正確な時刻とタイムゾーンに依存します。",
      },
    },
  },
  {
    id: "true-solar-time",
    category: "calendar",
    aliases: [
      "giờ mặt trời thật",
      "true solar time",
      "local solar time",
      "真太阳时",
      "진태양시",
      "真太陽時",
    ],
    relatedIds: [
      "solar-terms",
      "bazi-chart",
    ],
    content: {
      vi: {
        title: "Giờ Mặt Trời Thật",
        subtitle: "Hiệu chỉnh giờ theo vị trí địa lý.",
        definition: "Giờ mặt trời thật hiệu chỉnh giờ đồng hồ theo kinh độ và vị trí Mặt Trời địa phương.",
        whyItMatters: "Trong Bát Tự, giờ sinh quyết định trụ giờ; gần ranh giới giờ có thể đổi trụ.",
        example: "Hai người cùng sinh lúc 23:05 ở hai kinh độ khác nhau có thể có hiệu chỉnh khác nhau.",
        caution: "Không phải truyền thống nào cũng dùng; app nên cho bật/tắt và hiển thị chẩn đoán.",
      },
      en: {
        title: "True Solar Time",
        subtitle: "Birth time adjusted by geographic position.",
        definition: "True solar time adjusts clock time by longitude and local Sun position.",
        whyItMatters: "In BaZi, birth hour determines the hour pillar; near boundaries correction may change it.",
        example: "Two people born at 23:05 in different longitudes may have different corrections.",
        caution: "Not every tradition uses it; the app should allow toggling and diagnostics.",
      },
      zh: {
        title: "真太阳时",
        subtitle: "按地理位置校正出生时间。",
        definition: "真太阳时按经度和当地太阳位置校正钟表时间。",
        whyItMatters: "八字中出生时辰决定时柱，接近边界时校正可能改变时柱。",
        example: "同样23:05出生，经度不同可能校正不同。",
        caution: "并非所有传统都使用，应允许开启/关闭并显示诊断。",
      },
      ko: {
        title: "진태양시",
        subtitle: "지리적 위치에 따라 보정한 출생 시간입니다.",
        definition: "진태양시는 경도와 지역 태양 위치를 반영해 시각을 보정합니다.",
        whyItMatters: "사주에서 출생시는 시주를 결정하며 경계 근처에서는 달라질 수 있습니다.",
        example: "같은 23:05라도 경도가 다르면 보정이 달라질 수 있습니다.",
        caution: "모든 전통이 사용하지 않으므로 토글과 진단이 필요합니다.",
      },
      ja: {
        title: "真太陽時",
        subtitle: "地理的位置に基づいて補正した出生時刻です。",
        definition: "真太陽時は経度と地域の太陽位置に基づき時計時刻を補正します。",
        whyItMatters: "八字では出生時刻が時柱を決め、境界付近では補正で変わることがあります。",
        example: "同じ23:05でも経度が違えば補正が異なる場合があります。",
        caution: "すべての流派が使うわけではないため、切替と診断が必要です。",
      },
    },
  },
  {
    id: "auspicious-hours",
    category: "calendar",
    aliases: [
      "giờ hoàng đạo",
      "auspicious hours",
      "吉时",
      "길시",
      "吉時",
    ],
    relatedIds: [
      "lunar-calendar",
      "sexagenary-cycle",
      "daily-brief",
    ],
    content: {
      vi: {
        title: "Giờ Hoàng Đạo",
        subtitle: "Các khung giờ tham khảo trong ngày.",
        definition: "Giờ hoàng đạo là khung giờ được xem là thuận lợi trong lịch truyền thống, thường dựa trên Chi ngày và Chi giờ.",
        whyItMatters: "Today và Daily Brief dùng như tín hiệu phụ cho chọn thời điểm.",
        example: "09:00–10:59 có thể là khung giờ Tỵ.",
        caution: "Không đảm bảo thành công; chỉ hỗ trợ khi điều kiện thực tế đã sẵn sàng.",
      },
      en: {
        title: "Auspicious Hours",
        subtitle: "Reference time windows within a day.",
        definition: "Auspicious hours are favorable windows in traditional calendars, often based on day and hour branches.",
        whyItMatters: "Today and Daily Brief use them as secondary timing signals.",
        example: "09:00–10:59 may correspond to the Si hour.",
        caution: "They do not guarantee success; use them only when real conditions are ready.",
      },
      zh: {
        title: "吉时",
        subtitle: "一天中的参考时间段。",
        definition: "吉时是传统历法中较有利的时段，常依据日支与时支。",
        whyItMatters: "今日和每日简报将其作为辅助时间信号。",
        example: "09:00–10:59可能对应巳时。",
        caution: "吉时不能保证成功，只能在现实条件具备时辅助参考。",
      },
      ko: {
        title: "길시",
        subtitle: "하루 중 참고 시간대입니다.",
        definition: "길시는 전통 달력에서 유리하다고 보는 시간대로 일지와 시지를 기반으로 합니다.",
        whyItMatters: "Today와 Daily Brief에서 보조 시간 신호로 사용됩니다.",
        example: "09:00–10:59는 사시에 해당할 수 있습니다.",
        caution: "성공을 보장하지 않으며 실제 조건이 준비되었을 때만 참고하세요.",
      },
      ja: {
        title: "吉時",
        subtitle: "一日の中の参考時間帯です。",
        definition: "吉時は伝統暦で有利とされる時間帯で、日支と時支に基づくことが多いです。",
        whyItMatters: "TodayとDaily Briefでは補助的な時間信号として使われます。",
        example: "09:00–10:59は巳時に対応する場合があります。",
        caution: "成功を保証せず、現実条件が整った時の補助参考です。",
      },
    },
  },
  {
    id: "bazi-chart",
    category: "bazi",
    aliases: [
      "bazi",
      "bát tự",
      "bat tu",
      "four pillars",
      "八字",
      "사주",
      "四柱推命",
    ],
    relatedIds: [
      "day-master",
      "ten-gods",
      "hidden-stems",
    ],
    content: {
      vi: {
        title: "Bát Tự / Tứ Trụ",
        subtitle: "Mô hình đọc năm, tháng, ngày và giờ sinh.",
        definition: "Bát Tự dùng bốn trụ năm, tháng, ngày, giờ. Mỗi trụ có một Can và một Chi, tạo thành tám ký hiệu.",
        whyItMatters: "Dùng để đọc cấu trúc Ngũ Hành, Nhật chủ và Thập thần.",
        example: "Trụ ngày Giáp Tý lấy Giáp làm Nhật chủ.",
        caution: "Rất nhạy với giờ sinh, múi giờ và tiết khí; thiếu giờ sinh cần giảm độ tin cậy.",
      },
      en: {
        title: "BaZi / Four Pillars",
        subtitle: "A model based on year, month, day, and hour of birth.",
        definition: "BaZi uses four pillars: year, month, day, and hour. Each pillar has one stem and one branch.",
        whyItMatters: "It reads element structure, Day Master, and Ten-God relationships.",
        example: "A Jia Zi day uses Jia as the Day Master.",
        caution: "It is sensitive to birth time, time zone, and solar terms; unknown time lowers confidence.",
      },
      zh: {
        title: "八字 / 四柱",
        subtitle: "基于出生年、月、日、时的模型。",
        definition: "八字使用年、月、日、时四柱，每柱由天干和地支组成。",
        whyItMatters: "用于读取五行结构、日主和十神关系。",
        example: "甲子日以甲为日主。",
        caution: "对出生时间、时区和节气敏感，时辰未知应降低可信度。",
      },
      ko: {
        title: "사주 / 사주팔자",
        subtitle: "출생 년·월·일·시 기반 모델입니다.",
        definition: "사주는 년주, 월주, 일주, 시주를 사용하며 각 기둥은 천간과 지지로 구성됩니다.",
        whyItMatters: "오행 구조, 일간, 십신 관계를 읽습니다.",
        example: "갑자일은 갑을 일간으로 봅니다.",
        caution: "출생 시간, 시간대, 절기에 민감하며 시간을 모르면 신뢰도를 낮춰야 합니다.",
      },
      ja: {
        title: "八字 / 四柱推命",
        subtitle: "出生年・月・日・時に基づくモデルです。",
        definition: "八字は年柱、月柱、日柱、時柱を使い、各柱は天干と地支で構成されます。",
        whyItMatters: "五行構造、日主、通変星関係を読みます。",
        example: "甲子日は甲を日主とします。",
        caution: "出生時刻、タイムゾーン、節気に敏感で、時刻不明なら信頼度を下げるべきです。",
      },
    },
  },
  {
    id: "day-master",
    category: "bazi",
    aliases: [
      "nhật chủ",
      "day master",
      "日主",
      "日干",
      "일간",
    ],
    relatedIds: [
      "bazi-chart",
      "ten-gods",
      "five-elements",
    ],
    content: {
      vi: {
        title: "Nhật Chủ",
        subtitle: "Thiên Can của trụ ngày trong Bát Tự.",
        definition: "Nhật chủ là Can của ngày sinh và là điểm quy chiếu để tính Thập thần.",
        whyItMatters: "Khi app nói Day Master, đó là hành và âm/dương trung tâm để so sánh toàn lá số.",
        example: "Trụ ngày Đinh Mão có Nhật chủ Đinh, thường gắn với Hỏa âm.",
        caution: "Nhật chủ không phải nhãn tính cách cố định mà là điểm quy chiếu kỹ thuật.",
      },
      en: {
        title: "Day Master",
        subtitle: "The Heavenly Stem of the day pillar.",
        definition: "The Day Master is the stem of the birth day and the reference point for Ten Gods.",
        whyItMatters: "It is the central element and polarity used to compare the rest of the chart.",
        example: "A Ding Mao day has Ding as Day Master, usually yin Fire.",
        caution: "It is not a fixed personality label; it is a technical reference.",
      },
      zh: {
        title: "日主 / 日干",
        subtitle: "日柱的天干。",
        definition: "日主是出生日的天干，是计算十神的参照点。",
        whyItMatters: "它是比较命局其他因素的核心五行与阴阳。",
        example: "丁卯日的日主为丁，通常为阴火。",
        caution: "日主不是固定性格标签，而是技术参照。",
      },
      ko: {
        title: "일간",
        subtitle: "일주의 천간입니다.",
        definition: "일간은 출생일의 천간이며 십신 계산의 기준입니다.",
        whyItMatters: "명식의 나머지 요소와 비교하는 중심 오행과 음양입니다.",
        example: "정묘일은 정이 일간이며 보통 음화입니다.",
        caution: "고정 성격표가 아니라 기술적 기준입니다.",
      },
      ja: {
        title: "日主 / 日干",
        subtitle: "日柱の天干です。",
        definition: "日主は出生日の天干で、通変星を計算する基準です。",
        whyItMatters: "命式の他要素と比較する中心の五行と陰陽です。",
        example: "丁卯日は丁を日主とし、一般に陰の火です。",
        caution: "固定的な性格ラベルではなく、技術的基準です。",
      },
    },
  },
  {
    id: "ten-gods",
    category: "bazi",
    aliases: [
      "thập thần",
      "ten gods",
      "十神",
      "십신",
      "通変星",
    ],
    relatedIds: [
      "day-master",
      "hidden-stems",
      "bazi-chart",
    ],
    content: {
      vi: {
        title: "Thập Thần",
        subtitle: "Mười quan hệ giữa Nhật chủ và các Can khác.",
        definition: "Thập Thần là các quan hệ tính từ Nhật chủ với các Can khác như Tài, Quan, Ấn, Thực Thương, Tỷ Kiếp.",
        whyItMatters: "Giúp giải thích nguồn lực, áp lực, biểu đạt, quan hệ và tài chính.",
        example: "Nhật chủ Mộc gặp Kim có thể liên quan đến Quan/Sát tùy âm dương.",
        caution: "Là thuật ngữ kỹ thuật; không nên dịch thẳng thành kết luận đời sống.",
      },
      en: {
        title: "Ten Gods",
        subtitle: "Ten relationships between the Day Master and other stems.",
        definition: "Ten Gods are categories calculated from the Day Master, such as Wealth, Officer, Resource, Output, and Companion.",
        whyItMatters: "They explain resources, pressure, expression, relationships, and finances.",
        example: "For a Wood Day Master, Metal may relate to Officer/Killing depending on polarity.",
        caution: "These are technical terms; do not turn them directly into life conclusions.",
      },
      zh: {
        title: "十神",
        subtitle: "日主与其他天干的十类关系。",
        definition: "十神以日主为中心，包含财、官、印、食伤、比劫等类别。",
        whyItMatters: "用于解释资源、压力、表达、关系和财务。",
        example: "木日主遇金，可能对应官杀，取决于阴阳。",
        caution: "十神是技术术语，不应直接转成生活结论。",
      },
      ko: {
        title: "십신",
        subtitle: "일간과 다른 천간의 열 가지 관계입니다.",
        definition: "십신은 일간을 기준으로 재성, 관성, 인성, 식상, 비겁 등을 분류합니다.",
        whyItMatters: "자원, 압력, 표현, 관계, 재정을 설명합니다.",
        example: "목 일간에게 금은 음양에 따라 관성/살과 관련됩니다.",
        caution: "기술 용어이므로 생활 결론으로 바로 바꾸지 마세요.",
      },
      ja: {
        title: "通変星 / 十神",
        subtitle: "日主と他の天干の十種類の関係です。",
        definition: "通変星は日主を基準に財、官、印、食傷、比劫などを分類します。",
        whyItMatters: "資源、圧力、表現、関係、財務を説明します。",
        example: "木の日主にとって金は陰陽により官殺に関係します。",
        caution: "技術用語であり、生活上の結論へ直訳しないでください。",
      },
    },
  },
  {
    id: "hidden-stems",
    category: "bazi",
    aliases: [
      "tàng can",
      "hidden stems",
      "藏干",
      "지장간",
      "蔵干",
    ],
    relatedIds: [
      "earthly-branches",
      "ten-gods",
      "bazi-chart",
    ],
    content: {
      vi: {
        title: "Tàng Can",
        subtitle: "Các Thiên Can ẩn bên trong Địa Chi.",
        definition: "Mỗi Địa Chi có thể chứa một hoặc nhiều Can ẩn, gọi là Tàng Can.",
        whyItMatters: "Giúp đọc lớp sâu hơn của trụ và Thập thần ở tầng ẩn.",
        example: "Chi Dần thường chứa Giáp, Bính, Mậu trong nhiều hệ thống.",
        caution: "Bảng Tàng Can có thể khác nhẹ theo trường phái.",
      },
      en: {
        title: "Hidden Stems",
        subtitle: "Stems contained inside Earthly Branches.",
        definition: "Each branch may contain one or more hidden stems.",
        whyItMatters: "They reveal deeper layers of a pillar and hidden Ten-God relationships.",
        example: "The Yin branch often contains Jia, Bing, and Wu.",
        caution: "Tables can vary slightly by school.",
      },
      zh: {
        title: "藏干",
        subtitle: "地支内部所藏的天干。",
        definition: "每个地支可能包含一个或多个藏干。",
        whyItMatters: "用于读取四柱更深层以及隐藏的十神关系。",
        example: "寅支在许多体系中藏甲、丙、戊。",
        caution: "藏干表可能因流派略有差异。",
      },
      ko: {
        title: "지장간",
        subtitle: "지지 안에 숨은 천간입니다.",
        definition: "각 지지는 하나 이상의 숨은 천간을 포함할 수 있습니다.",
        whyItMatters: "기둥의 깊은 층과 숨은 십신 관계를 보여 줍니다.",
        example: "인지는 보통 갑, 병, 무를 포함합니다.",
        caution: "표는 학파마다 조금 다를 수 있습니다.",
      },
      ja: {
        title: "蔵干",
        subtitle: "地支の中に含まれる天干です。",
        definition: "各地支は一つ以上の蔵干を持つことがあります。",
        whyItMatters: "柱の深い層と隠れた通変星関係を示します。",
        example: "寅支は甲、丙、戊を含むことが多いです。",
        caution: "表は流派により少し異なる場合があります。",
      },
    },
  },
  {
    id: "ziwei-chart",
    category: "ziwei",
    aliases: [
      "tử vi",
      "tu vi",
      "zi wei",
      "ziwei",
      "紫微斗数",
      "자미두수",
    ],
    relatedIds: [
      "life-palace",
      "body-palace",
      "major-stars",
    ],
    content: {
      vi: {
        title: "Tử Vi Đẩu Số",
        subtitle: "Hệ thống lá số 12 cung và các sao.",
        definition: "Tử Vi dùng 12 cung, chính tinh, phụ tinh và nhiều chu kỳ để đọc cấu trúc đời sống bằng mô hình biểu tượng.",
        whyItMatters: "Bổ sung góc nhìn cung, sao và chu kỳ bên cạnh Bát Tự.",
        example: "Cung Mệnh và Cung Thân là hai điểm nền thường được hiển thị đầu tiên.",
        caution: "An sao phụ thuộc lịch, giờ sinh và phương pháp; thiếu giờ sinh làm giảm độ chính xác.",
      },
      en: {
        title: "Zi Wei Dou Shu",
        subtitle: "A chart system of 12 palaces and stars.",
        definition: "Zi Wei uses 12 palaces, main stars, auxiliary stars, and cycles to read life structure symbolically.",
        whyItMatters: "It complements BaZi with palace, star, and cycle perspectives.",
        example: "Life Palace and Body Palace are usually foundational points.",
        caution: "Star placement depends on calendar, birth time, and method; unknown time reduces accuracy.",
      },
      zh: {
        title: "紫微斗数",
        subtitle: "由十二宫与星曜构成的命盘系统。",
        definition: "紫微使用十二宫、主星、辅星和周期，以象征模型读取人生结构。",
        whyItMatters: "它从宫位、星曜和周期角度补充八字。",
        example: "命宫和身宫通常是基础点。",
        caution: "安星依赖历法、出生时间和方法，时辰未知会降低准确性。",
      },
      ko: {
        title: "자미두수",
        subtitle: "12궁과 별로 구성된 명반 체계입니다.",
        definition: "자미는 12궁, 주성, 보조성, 주기를 사용해 삶의 구조를 상징적으로 읽습니다.",
        whyItMatters: "궁, 별, 주기 관점에서 사주를 보완합니다.",
        example: "명궁과 신궁은 보통 기본 지점입니다.",
        caution: "별 배치는 달력, 출생 시간, 방법에 의존하며 시간이 없으면 정확도가 낮아집니다.",
      },
      ja: {
        title: "紫微斗数",
        subtitle: "十二宮と星で構成される命盤体系です。",
        definition: "紫微は十二宮、主星、補助星、周期を使い、人生構造を象徴的に読みます。",
        whyItMatters: "宮、星、周期の視点で八字を補完します。",
        example: "命宮と身宮は通常基礎点です。",
        caution: "星の配置は暦、出生時刻、方法に依存し、時刻不明では精度が下がります。",
      },
    },
  },
  {
    id: "life-palace",
    category: "ziwei",
    aliases: [
      "cung mệnh",
      "life palace",
      "命宫",
      "명궁",
      "命宮",
    ],
    relatedIds: [
      "ziwei-chart",
      "body-palace",
      "major-stars",
    ],
    content: {
      vi: {
        title: "Cung Mệnh",
        subtitle: "Cung trung tâm trong lá số Tử Vi.",
        definition: "Cung Mệnh là điểm quy chiếu chính để đọc cấu trúc cá nhân trong Tử Vi.",
        whyItMatters: "App dùng Cung Mệnh làm trung tâm khi trình bày lá số.",
        example: "Cung Mệnh ở Dần khiến sao tại cung Dần trở thành trọng tâm đọc.",
        caution: "Không đọc tách rời khỏi Cung Thân, tam phương tứ chính và các sao liên quan.",
      },
      en: {
        title: "Life Palace",
        subtitle: "The central palace in a Zi Wei chart.",
        definition: "The Life Palace is a primary reference for personal structure in Zi Wei.",
        whyItMatters: "The app uses it as the center when presenting a chart.",
        example: "If the Life Palace is in Yin, stars there become central to the reading.",
        caution: "Do not read it apart from Body Palace, triads, oppositions, and related stars.",
      },
      zh: {
        title: "命宫",
        subtitle: "紫微命盘中的核心宫位。",
        definition: "命宫是紫微中读取个人结构的主要参照。",
        whyItMatters: "应用以命宫作为展示命盘的中心。",
        example: "命宫在寅时，寅宫星曜成为重点。",
        caution: "不要脱离身宫、三方四正和相关星曜读取。",
      },
      ko: {
        title: "명궁",
        subtitle: "자미 명반의 중심 궁입니다.",
        definition: "명궁은 자미에서 개인 구조를 읽는 주요 기준입니다.",
        whyItMatters: "앱은 명궁을 명반 표시의 중심으로 사용합니다.",
        example: "명궁이 인궁이면 그 궁의 별이 핵심이 됩니다.",
        caution: "신궁, 삼방사정, 관련 별과 분리해 읽지 마세요.",
      },
      ja: {
        title: "命宮",
        subtitle: "紫微命盤の中心宮です。",
        definition: "命宮は紫微で個人構造を読む主要な基準です。",
        whyItMatters: "アプリは命宮を命盤表示の中心にします。",
        example: "命宮が寅にある場合、寅宮の星が中心になります。",
        caution: "身宮、三方四正、関連星から切り離して読まないでください。",
      },
    },
  },
  {
    id: "body-palace",
    category: "ziwei",
    aliases: [
      "cung thân",
      "body palace",
      "身宫",
      "신궁",
      "身宮",
    ],
    relatedIds: [
      "ziwei-chart",
      "life-palace",
      "major-stars",
    ],
    content: {
      vi: {
        title: "Cung Thân",
        subtitle: "Cung bổ sung cách năng lượng biểu hiện trong đời sống.",
        definition: "Cung Thân bổ sung cho Cung Mệnh, cho biết cách năng lượng thể hiện qua hành động và trải nghiệm.",
        whyItMatters: "Giúp app không chỉ đọc cấu trúc nền mà còn đọc hướng biểu hiện.",
        example: "Cung Mệnh và Cung Thân khác nhau có thể gợi ý khác biệt giữa nền và biểu hiện.",
        caution: "Cung Thân không thay thế Cung Mệnh; hai cung cần đọc cùng nhau.",
      },
      en: {
        title: "Body Palace",
        subtitle: "A palace showing how energy is expressed in experience.",
        definition: "The Body Palace complements the Life Palace and shows expression through action and lived experience.",
        whyItMatters: "It helps the app read expression, not only underlying structure.",
        example: "Different Life and Body Palaces may show a gap between inner structure and outward expression.",
        caution: "It does not replace the Life Palace; read them together.",
      },
      zh: {
        title: "身宫",
        subtitle: "体现能量在现实中如何表现的宫位。",
        definition: "身宫补充命宫，显示能量如何通过行动和经验表现。",
        whyItMatters: "它帮助应用读取表现层，而不仅是基础结构。",
        example: "命宫与身宫不同，可能提示内在与外在表现差异。",
        caution: "身宫不能取代命宫，应一起读取。",
      },
      ko: {
        title: "신궁",
        subtitle: "에너지가 현실에서 표현되는 방식을 보는 궁입니다.",
        definition: "신궁은 명궁을 보완하고 행동과 경험 속 표현을 보여 줍니다.",
        whyItMatters: "앱이 기본 구조뿐 아니라 표현 방향도 읽도록 돕습니다.",
        example: "명궁과 신궁이 다르면 내면과 표현의 차이를 암시할 수 있습니다.",
        caution: "신궁은 명궁을 대체하지 않으며 함께 읽어야 합니다.",
      },
      ja: {
        title: "身宮",
        subtitle: "エネルギーが現実でどう表れるかを見る宮です。",
        definition: "身宮は命宮を補完し、行動と経験での表れ方を示します。",
        whyItMatters: "基礎構造だけでなく表現方向を読む助けになります。",
        example: "命宮と身宮が異なると内面と外的表現の差を示す場合があります。",
        caution: "身宮は命宮の代わりではなく、合わせて読む必要があります。",
      },
    },
  },
  {
    id: "major-stars",
    category: "ziwei",
    aliases: [
      "chính tinh",
      "main stars",
      "major stars",
      "主星",
      "주성",
    ],
    relatedIds: [
      "ziwei-chart",
      "auxiliary-stars",
      "transformations",
    ],
    content: {
      vi: {
        title: "Chính Tinh",
        subtitle: "Nhóm sao tạo khung chính cho các cung.",
        definition: "Chính tinh là các sao nền quan trọng tạo cấu trúc đọc chính cho từng cung.",
        whyItMatters: "Giúp người dùng biết cung nào có lực biểu tượng nổi bật.",
        example: "Tử Vi, Thiên Phủ, Thái Dương, Thái Âm là các chính tinh quen thuộc.",
        caution: "Cần đọc cùng vị trí cung, độ sáng, phụ tinh và tam phương tứ chính.",
      },
      en: {
        title: "Main Stars",
        subtitle: "Stars that form the primary structure of palaces.",
        definition: "Main stars are foundational Zi Wei stars that build the primary structure of each palace.",
        whyItMatters: "They show which palaces carry prominent symbolic force.",
        example: "Zi Wei, Tian Fu, Tai Yang, and Tai Yin are familiar main stars.",
        caution: "Read them with palace position, brightness, auxiliary stars, and triads/oppositions.",
      },
      zh: {
        title: "主星",
        subtitle: "构成各宫主要结构的星曜。",
        definition: "主星是紫微中建立各宫主要结构的基础星曜。",
        whyItMatters: "显示哪些宫位具有突出的象征力量。",
        example: "紫微、天府、太阳、太阴是常见主星。",
        caution: "需结合宫位、亮度、辅星和三方四正读取。",
      },
      ko: {
        title: "주성",
        subtitle: "각 궁의 주요 구조를 만드는 별입니다.",
        definition: "주성은 각 궁의 기본 구조를 만드는 자미의 핵심 별입니다.",
        whyItMatters: "어떤 궁에 상징적 힘이 두드러지는지 보여 줍니다.",
        example: "자미, 천부, 태양, 태음은 익숙한 주성입니다.",
        caution: "궁 위치, 밝기, 보조성, 삼방사정과 함께 읽어야 합니다.",
      },
      ja: {
        title: "主星",
        subtitle: "各宮の主要構造を作る星です。",
        definition: "主星は各宮の基本構造を作る紫微の基礎星です。",
        whyItMatters: "どの宮に象徴的な力が目立つかを示します。",
        example: "紫微、天府、太陽、太陰はよく知られた主星です。",
        caution: "宮位置、明るさ、補助星、三方四正と合わせて読んでください。",
      },
    },
  },
  {
    id: "auxiliary-stars",
    category: "ziwei",
    aliases: [
      "phụ tinh",
      "auxiliary stars",
      "辅星",
      "보조성",
      "補助星",
    ],
    relatedIds: [
      "major-stars",
      "transformations",
      "ziwei-chart",
    ],
    content: {
      vi: {
        title: "Phụ Tinh",
        subtitle: "Các sao bổ sung sắc thái cho lá số.",
        definition: "Phụ tinh bổ trợ chính tinh, thêm sắc thái, hỗ trợ hoặc thử thách vào từng cung.",
        whyItMatters: "Trong Chế độ chuyên gia, app hiển thị phụ tinh để mở rộng phần đọc Tử Vi.",
        example: "Một cung có chính tinh tốt nhưng phụ tinh thử thách cần đọc thận trọng.",
        caution: "Không nên phóng đại từng phụ tinh riêng lẻ; cần đọc theo cụm.",
      },
      en: {
        title: "Auxiliary Stars",
        subtitle: "Stars that add nuance to the chart.",
        definition: "Auxiliary stars support main stars by adding nuance, support, or challenge to each palace.",
        whyItMatters: "Expert Mode shows them to expand Zi Wei interpretation.",
        example: "A palace with a good main star but challenging auxiliaries needs careful reading.",
        caution: "Do not overemphasize one auxiliary star; read them in groups.",
      },
      zh: {
        title: "辅星",
        subtitle: "为命盘增加细节的星曜。",
        definition: "辅星补充主星，为各宫增加细节、助力或挑战。",
        whyItMatters: "专家模式显示辅星以扩展紫微解读。",
        example: "主星较好但辅星有挑战时，需要谨慎读取。",
        caution: "不要夸大单个辅星，应按组合读取。",
      },
      ko: {
        title: "보조성",
        subtitle: "명반에 세부 의미를 더하는 별입니다.",
        definition: "보조성은 주성을 보완해 각 궁에 세부 의미, 지원, 도전을 더합니다.",
        whyItMatters: "전문가 모드에서 보조성을 표시해 자미 해석을 확장합니다.",
        example: "좋은 주성이 있어도 도전적 보조성이 있으면 신중히 읽어야 합니다.",
        caution: "보조성 하나를 과장하지 말고 그룹으로 읽으세요.",
      },
      ja: {
        title: "補助星",
        subtitle: "命盤にニュアンスを加える星です。",
        definition: "補助星は主星を補い、各宮に詳細、支援、課題を加えます。",
        whyItMatters: "エキスパートモードで紫微解釈を拡張するために表示されます。",
        example: "良い主星でも課題の補助星があれば慎重に読む必要があります。",
        caution: "一つの補助星を過大評価せず、組み合わせで読んでください。",
      },
    },
  },
  {
    id: "transformations",
    category: "ziwei",
    aliases: [
      "tứ hóa",
      "four transformations",
      "四化",
      "사화",
    ],
    relatedIds: [
      "ziwei-chart",
      "major-stars",
      "auxiliary-stars",
    ],
    content: {
      vi: {
        title: "Tứ Hóa",
        subtitle: "Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ.",
        definition: "Tứ Hóa là bốn trạng thái chuyển hóa thêm hướng biến động cho sao và cung.",
        whyItMatters: "Giúp app chỉ ra điểm tăng cường, nổi bật, học hỏi hoặc cần xử lý.",
        example: "Hóa Lộc có thể là tín hiệu tăng nguồn lực ở cung đó.",
        caution: "Hóa Kỵ không phải tai họa chắc chắn; thường là điểm cần chú ý.",
      },
      en: {
        title: "Four Transformations",
        subtitle: "Lu, Quan, Ke, and Ji transformations.",
        definition: "The Four Transformations add dynamic states to stars and palaces.",
        whyItMatters: "They show amplification, prominence, learning, or areas needing attention.",
        example: "Lu transformation may suggest increased resource flow in a palace.",
        caution: "Ji is not guaranteed misfortune; it often marks an area needing attention.",
      },
      zh: {
        title: "四化",
        subtitle: "化禄、化权、化科、化忌。",
        definition: "四化为星曜和宫位增加动态状态。",
        whyItMatters: "用于显示增强、突出、学习或需要注意的领域。",
        example: "化禄可表示该宫资源流动增强。",
        caution: "化忌不等于必然灾祸，通常是需要关注的点。",
      },
      ko: {
        title: "사화",
        subtitle: "화록, 화권, 화과, 화기입니다.",
        definition: "사화는 별과 궁에 동적 상태를 더합니다.",
        whyItMatters: "강화, 부각, 학습, 주의할 영역을 보여 줍니다.",
        example: "화록은 해당 궁의 자원 흐름 증가를 의미할 수 있습니다.",
        caution: "화기는 불행 보장이 아니라 주의할 지점을 뜻하는 경우가 많습니다.",
      },
      ja: {
        title: "四化",
        subtitle: "化禄、化権、化科、化忌です。",
        definition: "四化は星と宮に動的状態を加えます。",
        whyItMatters: "強化、目立つ点、学び、注意領域を示します。",
        example: "化禄はその宮の資源の流れが増すサインです。",
        caution: "化忌は不幸確定ではなく、注意すべき点を示すことが多いです。",
      },
    },
  },
  {
    id: "six-harmony",
    category: "compatibility",
    aliases: [
      "lục hợp",
      "six harmony",
      "六合",
      "육합",
    ],
    relatedIds: [
      "earthly-branches",
      "three-harmony",
      "compatibility-score",
    ],
    content: {
      vi: {
        title: "Lục Hợp",
        subtitle: "Các cặp Địa Chi có quan hệ hỗ trợ.",
        definition: "Lục Hợp là sáu cặp Chi thường được xem là có khả năng phối hợp hoặc hỗ trợ nhau.",
        whyItMatters: "Compatibility dùng như tín hiệu tích cực trong quan hệ Địa Chi.",
        example: "Tý và Sửu là một cặp Lục Hợp.",
        caution: "Không đảm bảo hợp nhau ngoài đời; giao tiếp và hoàn cảnh vẫn quan trọng.",
      },
      en: {
        title: "Six Harmony",
        subtitle: "Supportive pairs of Earthly Branches.",
        definition: "Six Harmony refers to six branch pairs often read as cooperative or mutually supportive.",
        whyItMatters: "Compatibility uses it as a positive signal in branch relationships.",
        example: "Zi and Chou are a Six-Harmony pair.",
        caution: "It does not guarantee real-life compatibility; communication and context still matter.",
      },
      zh: {
        title: "六合",
        subtitle: "地支之间的六组配合关系。",
        definition: "六合指六对常被视为能配合或互相支持的地支。",
        whyItMatters: "合盘中作为地支关系的积极信号。",
        example: "子与丑是一组六合。",
        caution: "六合不能保证现实关系一定合适，沟通与情境仍重要。",
      },
      ko: {
        title: "육합",
        subtitle: "서로 돕는 지지 쌍입니다.",
        definition: "육합은 협력적이거나 서로 돕는 것으로 읽히는 여섯 지지 쌍입니다.",
        whyItMatters: "궁합에서 지지 관계의 긍정 신호로 사용됩니다.",
        example: "자와 축은 육합 쌍입니다.",
        caution: "현실 궁합을 보장하지 않으며 소통과 상황이 중요합니다.",
      },
      ja: {
        title: "六合",
        subtitle: "支援的な地支の組み合わせです。",
        definition: "六合は協力的または相互支援的と読まれる六つの地支ペアです。",
        whyItMatters: "相性では地支関係の前向きな信号として使われます。",
        example: "子と丑は六合のペアです。",
        caution: "現実の相性を保証せず、対話と状況が重要です。",
      },
    },
  },
  {
    id: "three-harmony",
    category: "compatibility",
    aliases: [
      "tam hợp",
      "three harmony",
      "三合",
      "삼합",
    ],
    relatedIds: [
      "earthly-branches",
      "six-harmony",
      "compatibility-score",
    ],
    content: {
      vi: {
        title: "Tam Hợp",
        subtitle: "Nhóm ba Địa Chi cùng tạo một hướng ngũ hành.",
        definition: "Tam Hợp là nhóm ba Chi được xem là cùng tạo một trường năng lượng hoặc hướng ngũ hành.",
        whyItMatters: "Trong Compatibility, Tam Hợp thường là tín hiệu phối hợp mạnh.",
        example: "Thân, Tý, Thìn thường là nhóm Tam Hợp Thủy.",
        caution: "Thiếu một Chi hoặc bối cảnh khó có thể làm ý nghĩa yếu đi.",
      },
      en: {
        title: "Three Harmony",
        subtitle: "Triads of branches forming an elemental direction.",
        definition: "Three Harmony refers to branch triads forming a shared elemental field or direction.",
        whyItMatters: "In Compatibility, it is often a strong cooperative signal.",
        example: "Shen, Zi, and Chen are often read as a Water triad.",
        caution: "Missing parts or difficult context can weaken the meaning.",
      },
      zh: {
        title: "三合",
        subtitle: "形成同一五行方向的地支三组。",
        definition: "三合是三地支共同形成某种五行场或方向的关系。",
        whyItMatters: "在合盘中常是较强的合作信号。",
        example: "申、子、辰常被视为三合水局。",
        caution: "三合不完整或环境不佳时意义会减弱。",
      },
      ko: {
        title: "삼합",
        subtitle: "같은 오행 방향을 만드는 지지 세트입니다.",
        definition: "삼합은 세 지지가 하나의 오행장 또는 방향을 만든다고 보는 관계입니다.",
        whyItMatters: "궁합에서 강한 협력 신호가 될 수 있습니다.",
        example: "신, 자, 진은 수 삼합으로 읽힙니다.",
        caution: "구성이 빠지거나 맥락이 어렵다면 의미가 약해질 수 있습니다.",
      },
      ja: {
        title: "三合",
        subtitle: "同じ五行方向を作る地支の三組です。",
        definition: "三合は三つの地支が共通の五行場や方向を作る関係です。",
        whyItMatters: "相性では強い協力信号になることがあります。",
        example: "申、子、辰は水の三合として読まれます。",
        caution: "欠けや難しい文脈があると意味は弱まります。",
      },
    },
  },
  {
    id: "zodiac-clash",
    category: "compatibility",
    aliases: [
      "tương xung",
      "clash",
      "six clash",
      "相冲",
      "충",
      "冲",
    ],
    relatedIds: [
      "earthly-branches",
      "six-harmony",
      "compatibility-score",
    ],
    content: {
      vi: {
        title: "Tương Xung",
        subtitle: "Quan hệ đối xung giữa một số Địa Chi.",
        definition: "Tương Xung là các cặp Chi có lực đối nghịch hoặc kéo căng trong mô hình truyền thống.",
        whyItMatters: "Compatibility và Timeline dùng như tín hiệu cần kiểm tra kỹ hoặc điều chỉnh cách phối hợp.",
        example: "Tý và Ngọ là một cặp xung.",
        caution: "Xung không có nghĩa là không thể hợp tác; thường là khác biệt cần quản lý.",
      },
      en: {
        title: "Branch Clash",
        subtitle: "Oppositional relationships between branches.",
        definition: "Branch clash refers to pairs with opposing or tension-building forces in the traditional model.",
        whyItMatters: "Compatibility and Timeline use it as a signal to check details or adjust cooperation.",
        example: "Zi and Wu are a clash pair.",
        caution: "Clash does not mean cooperation is impossible; it marks differences to manage.",
      },
      zh: {
        title: "相冲",
        subtitle: "某些地支之间的对冲关系。",
        definition: "相冲指传统模型中具有对立或拉扯力量的地支配对。",
        whyItMatters: "合盘和时间轴用它提示需要核对或调整合作方式。",
        example: "子与午是一组相冲。",
        caution: "相冲不代表不能合作，通常表示需要管理的差异。",
      },
      ko: {
        title: "충",
        subtitle: "일부 지지 사이의 대립 관계입니다.",
        definition: "충은 전통 모델에서 서로 반대되거나 긴장을 만드는 지지 쌍입니다.",
        whyItMatters: "궁합과 타임라인에서 세부 확인이나 협력 조정의 신호로 사용됩니다.",
        example: "자와 오는 충 관계입니다.",
        caution: "충은 협력 불가능이 아니라 관리해야 할 차이를 뜻합니다.",
      },
      ja: {
        title: "冲 / 相冲",
        subtitle: "特定の地支同士の対立関係です。",
        definition: "冲は伝統モデルで反対や緊張を作る地支ペアです。",
        whyItMatters: "相性とタイムラインでは確認や協力調整の信号として使われます。",
        example: "子と午は冲のペアです。",
        caution: "冲は協力不可能ではなく、管理すべき違いを示します。",
      },
    },
  },
  {
    id: "compatibility-score",
    category: "compatibility",
    aliases: [
      "điểm tương hợp",
      "compatibility score",
      "合盘",
      "궁합",
      "相性",
    ],
    relatedIds: [
      "six-harmony",
      "three-harmony",
      "zodiac-clash",
    ],
    content: {
      vi: {
        title: "Điểm Tương Hợp",
        subtitle: "Điểm tổng hợp giữa hai hồ sơ.",
        definition: "Điểm tương hợp được tính từ ngũ hành, quan hệ địa chi, giao tiếp, nhịp cảm xúc và ổn định dài hạn.",
        whyItMatters: "Giúp xem nhanh trước khi đọc từng chiều phân tích.",
        example: "Trong chế độ hôn nhân, ổn định dài hạn có thể có trọng số cao hơn.",
        caution: "Điểm cao không đảm bảo tốt, điểm thấp không có nghĩa phải tránh; chỉ là mô hình phản chiếu.",
      },
      en: {
        title: "Compatibility Score",
        subtitle: "A combined score between two profiles.",
        definition: "The score is built from elements, branch relationships, communication, emotional rhythm, and long-term stability.",
        whyItMatters: "It gives a quick overview before the detailed dimensions.",
        example: "Marriage mode may give more weight to long-term stability.",
        caution: "A high score does not guarantee success; a low score does not mean avoidance. It is a reflection model.",
      },
      zh: {
        title: "合盘分数",
        subtitle: "两份档案之间的综合参考分。",
        definition: "分数由五行、地支关系、沟通、情绪节律和长期稳定等维度构成。",
        whyItMatters: "帮助用户在阅读各维度前获得概览。",
        example: "婚姻模式可能提高长期稳定的权重。",
        caution: "高分不保证成功，低分也不表示必须避免，只是反思模型。",
      },
      ko: {
        title: "궁합 점수",
        subtitle: "두 프로필 사이의 종합 참고 점수입니다.",
        definition: "점수는 오행, 지지 관계, 소통, 감정 리듬, 장기 안정성으로 구성됩니다.",
        whyItMatters: "세부 차원을 읽기 전 빠른 개요를 제공합니다.",
        example: "결혼 모드에서는 장기 안정성 가중치가 높을 수 있습니다.",
        caution: "높은 점수가 성공을 보장하지 않으며 낮은 점수가 회피를 뜻하지 않습니다.",
      },
      ja: {
        title: "相性スコア",
        subtitle: "二つのプロフィール間の総合参考点です。",
        definition: "五行、地支関係、対話、感情リズム、長期安定性から構成されます。",
        whyItMatters: "詳細軸を読む前の概観になります。",
        example: "結婚モードでは長期安定性の重みが高くなる場合があります。",
        caution: "高得点は成功保証ではなく、低得点も避けるべきという意味ではありません。",
      },
    },
  },
  {
    id: "timeline-model",
    category: "practice",
    aliases: [
      "timeline",
      "life timeline",
      "dòng thời gian",
      "时间轴",
      "타임라인",
      "タイムライン",
    ],
    relatedIds: [
      "timeline-events",
      "daily-brief",
      "explainable-results",
    ],
    content: {
      vi: {
        title: "Timeline",
        subtitle: "Mô hình trực quan theo từng năm.",
        definition: "Timeline trong Eastern Destiny trực quan hóa nhịp tham khảo theo năm cho từng hồ sơ.",
        whyItMatters: "Giúp so sánh dữ liệu tham khảo với sự kiện thật đã ghi lại.",
        example: "Chọn năm 2028 để xem điểm công việc, tài chính, quan hệ và thêm sự kiện.",
        caution: "Timeline hiện là mô hình tham khảo, không phải Đại vận đầy đủ nếu chưa ghi rõ.",
      },
      en: {
        title: "Timeline",
        subtitle: "A visual year-by-year reference model.",
        definition: "The Timeline visualizes year-by-year reference patterns for each profile.",
        whyItMatters: "It helps compare reference data with real events users record.",
        example: "Select 2028 to view career, finance, relationship scores and add events.",
        caution: "It is a reference model, not a complete Luck-Pillar system unless documented.",
      },
      zh: {
        title: "时间轴",
        subtitle: "按年展示的视觉参考模型。",
        definition: "时间轴按年可视化每个档案的参考节律。",
        whyItMatters: "帮助把参考数据与用户记录的真实事件对照。",
        example: "选择2028年可查看事业、财务、关系分数并添加事件。",
        caution: "除非明确说明，否则它是参考模型，不等于完整大运。",
      },
      ko: {
        title: "타임라인",
        subtitle: "연도별 시각 참고 모델입니다.",
        definition: "타임라인은 각 프로필의 연도별 참고 흐름을 시각화합니다.",
        whyItMatters: "사용자가 기록한 실제 이벤트와 참고 데이터를 비교하게 합니다.",
        example: "2028년을 선택해 직업, 재정, 관계 점수를 보고 이벤트를 추가합니다.",
        caution: "명시되지 않았다면 완전한 대운 시스템이 아니라 참고 모델입니다.",
      },
      ja: {
        title: "タイムライン",
        subtitle: "年ごとの視覚的な参考モデルです。",
        definition: "タイムラインは各プロフィールの年ごとの参考リズムを可視化します。",
        whyItMatters: "ユーザーが記録した実際の出来事と参考データを比較できます。",
        example: "2028年を選び、仕事、財務、関係の点数とイベント追加ができます。",
        caution: "明示されていない限り完全な大運システムではなく参考モデルです。",
      },
    },
  },
  {
    id: "timeline-events",
    category: "practice",
    aliases: [
      "sự kiện timeline",
      "timeline events",
      "life events",
      "真实事件",
      "이벤트",
      "出来事",
    ],
    relatedIds: [
      "timeline-model",
      "daily-brief",
    ],
    content: {
      vi: {
        title: "Sự Kiện Timeline",
        subtitle: "Các mốc thật người dùng ghi lại theo năm.",
        definition: "Sự kiện Timeline là những điều thực tế như đổi việc, chuyển nhà, bắt đầu quan hệ hoặc thành tựu.",
        whyItMatters: "Làm Timeline có giá trị lâu dài vì app lưu trải nghiệm thật, không chỉ dữ liệu tham khảo.",
        example: "Năm 2026 có thể ghi “đổi việc” nhóm Công việc với mức quan trọng 3.",
        caution: "Có thể chứa dữ liệu cá nhân; không ghi thông tin nhạy cảm của người khác khi chưa đồng ý.",
      },
      en: {
        title: "Timeline Events",
        subtitle: "Real milestones recorded year by year.",
        definition: "Timeline Events are real-life items such as changing jobs, moving, starting a relationship, or achievements.",
        whyItMatters: "They make Timeline valuable because the app stores lived experience, not only reference data.",
        example: "In 2026, a user can add “changed jobs” under Career with importance 3.",
        caution: "Events may contain personal data; do not record another person’s sensitive information without permission.",
      },
      zh: {
        title: "时间轴事件",
        subtitle: "用户按年份记录的真实节点。",
        definition: "时间轴事件是真实经历，如换工作、搬家、开始关系或达成成就。",
        whyItMatters: "它让时间轴保存真实经验，而不只是参考数据。",
        example: "2026年可记录“换工作”，类别为事业，重要度3。",
        caution: "事件可能包含个人数据，未经允许不要记录他人敏感信息。",
      },
      ko: {
        title: "타임라인 이벤트",
        subtitle: "연도별로 기록하는 실제 전환점입니다.",
        definition: "타임라인 이벤트는 이직, 이사, 관계 시작, 성취 같은 실제 항목입니다.",
        whyItMatters: "실제 경험을 저장하므로 타임라인의 장기 가치가 커집니다.",
        example: "2026년에 “이직”을 직업 카테고리, 중요도 3으로 기록할 수 있습니다.",
        caution: "개인 정보가 포함될 수 있으므로 허락 없이 타인 정보를 기록하지 마세요.",
      },
      ja: {
        title: "タイムラインイベント",
        subtitle: "年ごとに記録する実際の節目です。",
        definition: "転職、引っ越し、関係開始、達成などの実際の出来事です。",
        whyItMatters: "参考データだけでなく実体験を保存するため、タイムラインの価値が高まります。",
        example: "2026年に「転職」を仕事カテゴリ、重要度3で記録できます。",
        caution: "個人情報を含む場合があるため、許可なく他人の機密情報を記録しないでください。",
      },
    },
  },
  {
    id: "daily-brief",
    category: "practice",
    aliases: [
      "daily brief",
      "tóm tắt hôm nay",
      "每日简报",
      "데일리 브리프",
      "デイリーブリーフ",
    ],
    relatedIds: [
      "lunar-calendar",
      "auspicious-hours",
      "explainable-results",
    ],
    content: {
      vi: {
        title: "Daily Brief",
        subtitle: "Bản tóm tắt ngắn cho từng ngày.",
        definition: "Daily Brief kết hợp ngày âm, Can Chi, hồ sơ đang chọn, việc phù hợp và câu chiêm nghiệm.",
        whyItMatters: "Là tính năng giúp người dùng có lý do mở app mỗi ngày.",
        example: "Buổi sáng người dùng nhận Daily Brief và xem gợi ý trong ngày.",
        caution: "Nên viết nhẹ nhàng, không tạo cảm giác định mệnh hoặc gây lo lắng.",
      },
      en: {
        title: "Daily Brief",
        subtitle: "A short daily summary.",
        definition: "Daily Brief combines lunar date, sexagenary data, selected profile, suitable activities, and a reflection line.",
        whyItMatters: "It gives users a reason to open the app every day.",
        example: "In the morning, users receive Daily Brief and view guidance.",
        caution: "It should feel gentle, not deterministic or anxiety-inducing.",
      },
      zh: {
        title: "每日简报",
        subtitle: "每天的短摘要。",
        definition: "每日简报结合农历、干支、所选档案、适合事项和一句思考提示。",
        whyItMatters: "它让用户每天都有打开应用的理由。",
        example: "早上用户收到每日简报并查看当天参考。",
        caution: "表达应温和，避免宿命感或焦虑。",
      },
      ko: {
        title: "데일리 브리프",
        subtitle: "하루를 위한 짧은 요약입니다.",
        definition: "데일리 브리프는 음력, 간지, 선택 프로필, 적합 활동, 성찰 문장을 결합합니다.",
        whyItMatters: "사용자가 매일 앱을 열 이유를 제공합니다.",
        example: "아침에 데일리 브리프를 받고 안내를 확인합니다.",
        caution: "부드럽게 쓰고 결정론적이거나 불안을 유발하지 않아야 합니다.",
      },
      ja: {
        title: "デイリーブリーフ",
        subtitle: "一日の短い要約です。",
        definition: "旧暦、干支、選択プロフィール、適した行動、内省文を組み合わせます。",
        whyItMatters: "ユーザーが毎日アプリを開く理由になります。",
        example: "朝にデイリーブリーフを受け取り、参考内容を確認します。",
        caution: "穏やかに書き、決定論的または不安を生む表現を避けるべきです。",
      },
    },
  },
  {
    id: "explainable-results",
    category: "practice",
    aliases: [
      "explainable results",
      "vì sao có kết quả này",
      "结果说明",
      "결과 설명",
      "結果説明",
    ],
    relatedIds: [
      "compatibility-score",
      "timeline-model",
      "bazi-chart",
    ],
    content: {
      vi: {
        title: "Explainable Results",
        subtitle: "Giải thích vì sao app đưa ra điểm hoặc kết luận.",
        definition: "Explainable Results trình bày yếu tố, trọng số, dữ liệu gốc và giới hạn của kết quả.",
        whyItMatters: "Tăng độ tin cậy vì người dùng thấy kết quả đến từ đâu.",
        example: "Compatibility có thể cho thấy Element Flow đóng góp bao nhiêu phần trăm vào điểm tổng.",
        caution: "Giải thích rõ hơn không làm kết quả chắc chắn hơn; giới hạn luôn cần hiển thị.",
      },
      en: {
        title: "Explainable Results",
        subtitle: "Why the app produced a score or conclusion.",
        definition: "Explainable Results show factors, weights, raw data, and limitations behind a result.",
        whyItMatters: "They increase trust by showing where the result comes from.",
        example: "Compatibility can show how much Element Flow contributes to the total score.",
        caution: "Clearer explanation does not make a result certain; limitations should always be shown.",
      },
      zh: {
        title: "结果说明",
        subtitle: "说明应用为何得出某个分数或结论。",
        definition: "结果说明展示影响结果的因素、权重、原始数据和限制。",
        whyItMatters: "让用户看到结果来源，从而提高信任。",
        example: "合盘可显示五行流动对总分的贡献比例。",
        caution: "解释更清楚不代表结果更确定，限制说明应始终显示。",
      },
      ko: {
        title: "결과 설명",
        subtitle: "앱이 점수나 결론을 만든 이유입니다.",
        definition: "결과 설명은 요인, 가중치, 원시 데이터, 한계를 보여 줍니다.",
        whyItMatters: "결과의 출처를 보여 주어 신뢰를 높입니다.",
        example: "궁합은 Element Flow가 총점에 얼마나 기여했는지 보여 줄 수 있습니다.",
        caution: "설명이 명확해져도 결과가 확실해지는 것은 아니며 한계는 항상 표시해야 합니다.",
      },
      ja: {
        title: "結果説明",
        subtitle: "アプリが点数や結論を出した理由です。",
        definition: "結果説明は要因、重み、元データ、限界を示します。",
        whyItMatters: "結果の出所が見えるため信頼が高まります。",
        example: "相性ではElement Flowが総合点にどれだけ寄与したかを表示できます。",
        caution: "説明が明確でも結果が確実になるわけではなく、限界は常に表示すべきです。",
      },
    },
  },
];


export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  'foundation',
  'calendar',
  'bazi',
  'ziwei',
  'compatibility',
  'practice',
];

function normalizeLanguage(language?: string): GlossaryLanguage {
  const value = (language ?? LANGUAGE_FALLBACK).toLowerCase();

  if (value.startsWith('vi')) {
    return 'vi';
  }

  if (value.startsWith('zh')) {
    return 'zh';
  }

  if (value.startsWith('ko')) {
    return 'ko';
  }

  if (value.startsWith('ja')) {
    return 'ja';
  }

  return 'en';
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function localized(term: GlossaryTerm, language: GlossaryLanguage): GlossaryLocalizedContent {
  return term.content[language] ?? term.content[LANGUAGE_FALLBACK];
}

export function getGlossaryLanguage(language?: string): GlossaryLanguage {
  return normalizeLanguage(language);
}

export function getGlossaryTerms(language?: string): GlossaryTerm[] {
  const lang = normalizeLanguage(language);

  return [...TERMS].sort((first, second) =>
    localized(first, lang).title.localeCompare(localized(second, lang).title),
  );
}

export function getGlossaryTerm(id: string): GlossaryTerm | undefined {
  return TERMS.find(item => item.id === id);
}

export function getGlossaryTermsByCategory(
  category: GlossaryCategory,
  language?: string,
): GlossaryTerm[] {
  return getGlossaryTerms(language).filter(item => item.category === category);
}

export function getGlossaryRelatedTerms(
  term: GlossaryTerm,
  language?: string,
): GlossaryTerm[] {
  const lang = normalizeLanguage(language);

  return term.relatedIds
    .map(getGlossaryTerm)
    .filter((item): item is GlossaryTerm => Boolean(item))
    .sort((first, second) =>
      localized(first, lang).title.localeCompare(localized(second, lang).title),
    );
}

export function getGlossaryLocalizedContent(
  term: GlossaryTerm,
  language?: string,
): GlossaryLocalizedContent {
  return localized(term, normalizeLanguage(language));
}

export function searchGlossaryTerms(
  query: string,
  options?: {
    language?: string;
    category?: GlossaryCategory | 'all';
  },
): GlossarySearchResult[] {
  const lang = normalizeLanguage(options?.language);
  const category = options?.category ?? 'all';
  const normalizedQuery = normalizeText(query);

  const terms =
    category === 'all'
      ? TERMS
      : TERMS.filter(item => item.category === category);

  if (!normalizedQuery) {
    return terms
      .map(item => ({...item, score: 0}))
      .sort((first, second) =>
        localized(first, lang).title.localeCompare(localized(second, lang).title),
      );
  }

  return terms
    .map(term => {
      const content = localized(term, lang);
      const title = normalizeText(content.title);
      const haystack = [
        term.id,
        term.category,
        content.title,
        content.subtitle,
        content.definition,
        content.whyItMatters,
        content.example,
        content.caution,
        ...term.aliases,
      ]
        .map(normalizeText)
        .join(' ');

      const aliasScore = term.aliases.some(alias => normalizeText(alias) === normalizedQuery)
        ? 120
        : 0;
      const titleScore = title === normalizedQuery ? 100 : title.includes(normalizedQuery) ? 70 : 0;
      const contentScore = haystack.includes(normalizedQuery) ? 35 : 0;

      return {
        ...term,
        score: aliasScore + titleScore + contentScore,
      };
    })
    .filter(item => item.score > 0)
    .sort((first, second) =>
      second.score - first.score ||
      localized(first, lang).title.localeCompare(localized(second, lang).title),
    );
}

export function getGlossaryStats(): {
  totalTerms: number;
  categoryCounts: Record<GlossaryCategory, number>;
} {
  return {
    totalTerms: TERMS.length,
    categoryCounts: GLOSSARY_CATEGORIES.reduce((result, category) => {
      result[category] = TERMS.filter(item => item.category === category).length;
      return result;
    }, {} as Record<GlossaryCategory, number>),
  };
}
