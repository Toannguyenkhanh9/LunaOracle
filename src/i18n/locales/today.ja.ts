const today = {
  eyebrow: 'Eastern Destiny Daily',
  title: '今日',
  homeSubtitle:
    '旧暦、干支、吉時の参考とプロフィール別の見方',
  openToday: '今日を開く',
  homeSubtitle:
    '旧暦、干支、吉時の参考、今日の内省を確認します。',

  lunarDate: '旧暦の日付',
  lunarDateValue:
    '{{year}}年{{month}}月{{day}}日 {{leap}}',
  leapShort: '閏',

  ratings: {
    auspicious: '比較的良好',
    balanced: 'バランス',
    caution: '慎重に検討',
  },

  specialDays: {
    newMoon: '朔日',
    fullMoon: '十五日',
    newMoonToday:
      '今日は旧暦の朔日です。',
    fullMoonToday:
      '今日は旧暦の十五日です。',
  },

  dayEnergyEyebrow: '今日の流れ',
  dayEnergyTitle: '干支情報',
  dayCanChi: '日柱',
  monthCanChi: '月柱',
  yearCanChi: '年柱',
  dayElement: '今日の五行',

  elements: {
    wood: '木',
    fire: '火',
    earth: '土',
    metal: '金',
    water: '水',
    unknown: '未確認',
  },

  dailyGuidanceEyebrow: '伝統的な参考',
  dailyGuidanceTitle: '今日の行動',
  suitableTitle: '向いていること',
  cautionTitle: '慎重にすること',
  noStrongCaution:
    '今日の伝統暦データには目立った注意事項がありません。',

  activities: {
    worship: '静かな内省、祈り、個人の儀式',
    wedding: '結婚や婚約に関すること',
    opening: '開業や新しい開始',
    construction: '建築、修理、着工',
    moving: '引っ越しや住環境の整理',
    travel: '旅行や出発',
    signing: '取引や契約',
    cleaning: '掃除、整理、浄化',
    study: '学習や知識の習得',
    health: '健康とウェルビーイングのケア',
    rest: '休息と回復',
    majorDecision: '情報が不十分な状態での大きな決断',
    overcommitment: '一度に多くを引き受けること',
  },

  hoursEyebrow: '今日の時間帯',
  hoursTitle: '吉時の参考',
  hoursSubtitle:
    '伝統的な十二支の時刻体系に基づく時間帯です。',

  branches: {
    rat: '子時',
    ox: '丑時',
    tiger: '寅時',
    rabbit: '卯時',
    dragon: '辰時',
    snake: '巳時',
    horse: '午時',
    goat: '未時',
    monkey: '申時',
    rooster: '酉時',
    dog: '戌時',
    pig: '亥時',
  },

  profileEyebrow: '個人の内省',
  profileTitle: 'プロフィール別の見方',
  manageProfiles: 'プロフィール管理',
  loadingProfiles: 'プロフィールを読み込み中...',
  noProfileTitle: '内省プロフィールがありません',
  noProfileMessage:
    '出生プロフィールを作成すると、今日の個人的な参考情報を追加できます。',
  createProfile: 'プロフィール作成',

  profileRelations: {
    sixHarmony: {
      title: '比較的調和した流れ',
      message:
        '今日の地支は出生年の干支と六合の関係です。対話、つながり、継続中の作業の完了に活かせるかもしれません。',
    },
    threeHarmony: {
      title: '三合による支え',
      message:
        '今日は出生年と三合の組にあります。穏やかな流れを活かして着実に進みましょう。',
    },
    supportive: {
      title: 'やや支えのある流れ',
      message:
        '今日の地支と出生年の関係は比較的近く、慣れた作業や継続的な進行に向く可能性があります。',
    },
    neutral: {
      title: '全体的に中立的な流れ',
      message:
        '目立つ合や冲はありません。現実の計画と実際の状態を中心に判断してください。',
    },
    clash: {
      title: '少し速度を落として確認',
      message:
        '今日の地支は出生年の干支と冲の関係です。不運を意味するものではありませんが、大きな決断を急がないための参考になります。',
    },
  },

  reflectionEyebrow: '静かな一分',
  reflectionTitle: '今日の内省',

  reflections: {
    0: '平安はすべてが完璧だから生まれるのではなく、起きていることにどう向き合うかから生まれることもあります。',
    1: '迷いを感じることに答える前に、ゆっくり一度呼吸してみましょう。',
    2: '丁寧に終えた小さな一つのことは、始まっていない多くの計画より価値があります。',
    3: '思考が騒がしくなったら、今はっきりできる次の一歩に戻りましょう。',
    4: 'やさしさは弱さではなく、長く明晰さを守る方法になることがあります。',
    5: '何をコントロールしようとしているか見つめ、不要な一部を手放してみましょう。',
    6: '感謝は、日々すでに自分を支えているものを見えやすくします。',
    7: '速く進む必要はありません。気づきと誠実さを持って続ければ十分です。',
    8: '落ち着いた会話は、焦りでは見えなかった道を開くことがあります。',
    9: '今日は行動と休息の両方に場所を用意しましょう。',
    10: '確信がないときは、事実、意図、感情の状態を確認してから決めましょう。',
    11: 'すぐ答えを出さなければという力みを手放すと、明晰さが現れることがあります。',
  },

  upcomingEyebrow: '近日',
  upcomingTitle: '最も近い旧暦の節目',
  inDays: '{{count}}日後',
  openCalendar: '暦を開く',

  viewFullCalendar: '暦をすべて見る',
  findAuspiciousDates: '適した日を探す',

  disclaimerTitle: '参考情報',
  disclaimer:
    '干支、吉時、行動の案内、プロフィールとの関係は文化的参考と自己内省のためのものです。重要な決断の唯一の根拠にはしないでください。',
};

export default today;
