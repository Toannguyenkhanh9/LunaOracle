import {Solar} from 'lunar-javascript';

export type LunarObservanceDay = {
  date: Date;
  lunarDay: 1 | 15;
  lunarMonth: number;
};

export function getUpcomingLunarObservanceDays(
  numberOfDays = 370,
): LunarObservanceDay[] {
  const result: LunarObservanceDay[] = [];

  const date = new Date();
  date.setHours(0, 0, 0, 0);

  for (let offset = 0; offset < numberOfDays; offset += 1) {
    const currentDate = new Date(date);
    currentDate.setDate(date.getDate() + offset);

    const solar = Solar.fromYmd(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate(),
    );

    const lunar = solar.getLunar();
    const lunarDay = lunar.getDay();

    if (lunarDay === 1 || lunarDay === 15) {
      result.push({
        date: currentDate,
        lunarDay,
        lunarMonth: lunar.getMonth(),
      });
    }
  }

  return result;
}