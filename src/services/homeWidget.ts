import {
  NativeModules,
  Platform,
} from 'react-native';

import {
  buildDailyBrief,
} from './dailyBrief';

import {
  getUserProfiles,
  type UserProfile,
} from './userProfiles';

type WidgetNativeModule = {
  setWidgetData: (
    json: string,
  ) => Promise<void>;
  reloadWidget?: () => Promise<void>;
};

type WidgetPayload = {
  schemaVersion: 1;
  title: string;
  date: string;
  lunarDate: string;
  headline: string;
  profileName: string;
  dayCanChi: string;
  updatedAt: string;
  route: 'DailyBrief';
  profileId: string;
};

const COPY = {
  vi: {
    title: 'Eastern Destiny · Hôm nay',
    lunar: 'Âm lịch',
    headlines: {
      slowDown:
        'Chậm lại và kiểm tra kỹ trước quyết định quan trọng.',
      connection:
        'Thuận cho kết nối, trao đổi và hoàn tất việc đang làm.',
      steadyMomentum:
        'Duy trì tiến độ và tập trung một ưu tiên rõ ràng.',
      carefulReview:
        'Rà soát thông tin và tránh nhận quá nhiều việc.',
      balancedDay:
        'Ngày khá cân bằng; hãy tập trung một việc có ý nghĩa.',
    },
  },
  en: {
    title: 'Eastern Destiny · Today',
    lunar: 'Lunar',
    headlines: {
      slowDown:
        'Slow down and review details before major decisions.',
      connection:
        'Supportive for communication, connection, and completion.',
      steadyMomentum:
        'Maintain steady momentum and one clear priority.',
      carefulReview:
        'Review information and avoid overcommitting.',
      balancedDay:
        'A balanced day; focus on one meaningful priority.',
    },
  },
  zh: {
    title: 'Eastern Destiny · 今日',
    lunar: '农历',
    headlines: {
      slowDown:
        '放慢脚步，重大决定前先核对细节。',
      connection:
        '适合沟通、连接与完成正在进行的事务。',
      steadyMomentum:
        '保持稳定进度，专注一个明确重点。',
      carefulReview:
        '仔细复核信息，避免承担过多事务。',
      balancedDay:
        '整体较平衡，请专注一个真正重要的重点。',
    },
  },
  ko: {
    title: 'Eastern Destiny · 오늘',
    lunar: '음력',
    headlines: {
      slowDown:
        '속도를 늦추고 큰 결정 전 세부 사항을 확인하세요.',
      connection:
        '소통, 연결과 마무리에 도움이 되는 날입니다.',
      steadyMomentum:
        '꾸준히 진행하며 하나의 우선순위에 집중하세요.',
      carefulReview:
        '정보를 확인하고 과도한 약속을 피하세요.',
      balancedDay:
        '균형적인 날이므로 의미 있는 한 가지에 집중하세요.',
    },
  },
  ja: {
    title: 'Eastern Destiny · 今日',
    lunar: '旧暦',
    headlines: {
      slowDown:
        '少し速度を落とし、大きな判断の前に詳細を確認しましょう。',
      connection:
        '対話、つながり、継続中の作業の完了に向いています。',
      steadyMomentum:
        '着実に進み、一つの明確な優先事項に集中しましょう。',
      carefulReview:
        '情報を確認し、予定を詰め込みすぎないようにしましょう。',
      balancedDay:
        'バランスの良い日です。一つの大切なことに集中しましょう。',
    },
  },
} as const;

function normalizeLanguage(
  language?: string,
): keyof typeof COPY {
  const value =
    (
      language ??
      'en'
    ).toLowerCase();

  if (
    value.startsWith('vi')
  ) {
    return 'vi';
  }

  if (
    value.startsWith('zh')
  ) {
    return 'zh';
  }

  if (
    value.startsWith('ko')
  ) {
    return 'ko';
  }

  if (
    value.startsWith('ja')
  ) {
    return 'ja';
  }

  return 'en';
}

function formatDate(
  date: Date,
  language: string,
): string {
  try {
    return new Intl.DateTimeFormat(
      language,
      {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      },
    ).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

function resolveProfile(
  profiles: UserProfile[],
  profileId?: string,
): UserProfile | null {
  if (profileId) {
    const exact =
      profiles.find(
        item =>
          item.id ===
          profileId,
      );

    if (exact) {
      return exact;
    }
  }

  return (
    profiles.find(
      item =>
        item.isFavorite,
    ) ??
    profiles[0] ??
    null
  );
}

export function isHomeWidgetNativeAvailable(): boolean {
  return Boolean(
    NativeModules
      .EasternDestinyWidgetData,
  );
}

export async function refreshHomeWidget(
  language?: string,
  profileId?: string,
): Promise<boolean> {
  const nativeModule =
    NativeModules
      .EasternDestinyWidgetData as
      | WidgetNativeModule
      | undefined;

  if (!nativeModule) {
    console.warn(
      `Eastern Destiny widget module is not installed on ${Platform.OS}.`,
    );

    return false;
  }

  const profiles =
    await getUserProfiles();

  const profile =
    resolveProfile(
      profiles,
      profileId,
    );

  const brief =
    buildDailyBrief(
      profile,
      new Date(),
    );

  const languageKey =
    normalizeLanguage(
      language,
    );

  const copy =
    COPY[languageKey];

  const payload:
    WidgetPayload = {
      schemaVersion: 1,
      title:
        copy.title,
      date:
        formatDate(
          brief.date,
          language ??
            languageKey,
        ),
      lunarDate:
        `${copy.lunar} ${brief.lunarDay}/${brief.lunarMonth}/${brief.lunarYear}`,
      headline:
        copy.headlines[
          brief.headlineCode as keyof typeof copy.headlines
        ] ??
        copy.headlines
          .balancedDay,
      profileName:
        profile?.displayName ??
        '',
      dayCanChi:
        brief.dayCanChiRaw,
      updatedAt:
        new Date().toISOString(),
      route:
        'DailyBrief',
      profileId:
        profile?.id ??
        '',
    };

  await nativeModule.setWidgetData(
    JSON.stringify(
      payload,
    ),
  );

  if (
    nativeModule.reloadWidget
  ) {
    await nativeModule.reloadWidget();
  }

  return true;
}
