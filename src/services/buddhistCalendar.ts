import {Solar} from 'lunar-javascript';

export type BuddhistEventType =
  | 'newMoon'
  | 'fullMoon'
  | 'festival'
  | 'observance';

export type BuddhistCalendarEvent = {
  id: string;
  titleKey: string;
  type: BuddhistEventType;
  lunarMonth: number;
  lunarDay: number;
  noteKey?: string;
};

export type BuddhistCalendarDay = {
  date: Date;
  solarDateKey: string;
  solarDay: number;
  lunarDay: number;
  lunarMonth: number;
  lunarMonthLabel: string;
  isLeapMonth: boolean;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: BuddhistCalendarEvent[];
};

const FIXED_EVENTS: BuddhistCalendarEvent[] = [
  {
    id: 'maitreya',
    titleKey:
      'buddhistCalendar.events.maitreya',
    type: 'festival',
    lunarMonth: 1,
    lunarDay: 1,
  },
  {
    id: 'firstFullMoon',
    titleKey:
      'buddhistCalendar.events.firstFullMoon',
    type: 'festival',
    lunarMonth: 1,
    lunarDay: 15,
  },
  {
    id: 'avalokitesvaraBirth',
    titleKey:
      'buddhistCalendar.events.avalokitesvaraBirth',
    type: 'observance',
    lunarMonth: 2,
    lunarDay: 19,
  },
  {
    id: 'vesak',
    titleKey:
      'buddhistCalendar.events.vesak',
    type: 'festival',
    lunarMonth: 4,
    lunarDay: 15,
    noteKey:
      'buddhistCalendar.events.traditionNote',
  },
  {
    id: 'avalokitesvaraEnlightenment',
    titleKey:
      'buddhistCalendar.events.avalokitesvaraEnlightenment',
    type: 'observance',
    lunarMonth: 6,
    lunarDay: 19,
  },
  {
    id: 'ulambana',
    titleKey:
      'buddhistCalendar.events.ulambana',
    type: 'festival',
    lunarMonth: 7,
    lunarDay: 15,
  },
  {
    id: 'avalokitesvaraRenunciation',
    titleKey:
      'buddhistCalendar.events.avalokitesvaraRenunciation',
    type: 'observance',
    lunarMonth: 9,
    lunarDay: 19,
  },
  {
    id: 'amitabha',
    titleKey:
      'buddhistCalendar.events.amitabha',
    type: 'observance',
    lunarMonth: 11,
    lunarDay: 17,
  },
  {
    id: 'buddhaEnlightenment',
    titleKey:
      'buddhistCalendar.events.buddhaEnlightenment',
    type: 'festival',
    lunarMonth: 12,
    lunarDay: 8,
  },
];

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0');
  const day = String(
    date.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getBuddhistEvents(
  lunarMonth: number,
  lunarDay: number,
): BuddhistCalendarEvent[] {
  const events: BuddhistCalendarEvent[] = [];

  if (lunarDay === 1) {
    events.push({
      id: `new-moon-${lunarMonth}`,
      titleKey:
        'buddhistCalendar.events.newMoon',
      type: 'newMoon',
      lunarMonth,
      lunarDay,
    });
  }

  if (lunarDay === 15) {
    events.push({
      id: `full-moon-${lunarMonth}`,
      titleKey:
        'buddhistCalendar.events.fullMoon',
      type: 'fullMoon',
      lunarMonth,
      lunarDay,
    });
  }

  events.push(
    ...FIXED_EVENTS.filter(
      event =>
        event.lunarMonth === lunarMonth &&
        event.lunarDay === lunarDay,
    ),
  );

  const unique = new Map<
    string,
    BuddhistCalendarEvent
  >();

  events.forEach(event => {
    unique.set(event.id, event);
  });

  return [...unique.values()];
}

export function buildBuddhistMonth(
  year: number,
  month: number,
): BuddhistCalendarDay[] {
  const firstDay = new Date(
    year,
    month - 1,
    1,
    12,
  );

  const firstWeekday = firstDay.getDay();
  const gridStart = new Date(firstDay);

  gridStart.setDate(
    firstDay.getDate() - firstWeekday,
  );

  const todayKey = localDateKey(new Date());
  const result: BuddhistCalendarDay[] = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart);

    date.setDate(
      gridStart.getDate() + index,
    );

    const solar = Solar.fromYmd(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );

    const lunar = solar.getLunar();
    const lunarMonth = Math.abs(
      lunar.getMonth(),
    );
    const lunarDay = lunar.getDay();
    const isLeapMonth =
      lunar.getMonth() < 0;

    result.push({
      date,
      solarDateKey: localDateKey(date),
      solarDay: date.getDate(),
      lunarDay,
      lunarMonth,
      lunarMonthLabel:
        lunar.getMonthInChinese(),
      isLeapMonth,
      isCurrentMonth:
        date.getMonth() + 1 === month,
      isToday:
        localDateKey(date) === todayKey,
      events: getBuddhistEvents(
        lunarMonth,
        lunarDay,
      ),
    });
  }

  return result;
}

export function getUpcomingBuddhistEvents(
  fromDate = new Date(),
  days = 90,
): BuddhistCalendarDay[] {
  const result: BuddhistCalendarDay[] = [];

  for (let index = 0; index < days; index += 1) {
    const date = new Date(fromDate);

    date.setDate(
      fromDate.getDate() + index,
    );

    const solar = Solar.fromYmd(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );

    const lunar = solar.getLunar();
    const lunarMonth = Math.abs(
      lunar.getMonth(),
    );
    const lunarDay = lunar.getDay();
    const events = getBuddhistEvents(
      lunarMonth,
      lunarDay,
    );

    if (events.length > 0) {
      result.push({
        date,
        solarDateKey: localDateKey(date),
        solarDay: date.getDate(),
        lunarDay,
        lunarMonth,
        lunarMonthLabel:
          lunar.getMonthInChinese(),
        isLeapMonth:
          lunar.getMonth() < 0,
        isCurrentMonth: true,
        isToday:
          localDateKey(date) ===
          localDateKey(new Date()),
        events,
      });
    }
  }

  return result;
}
