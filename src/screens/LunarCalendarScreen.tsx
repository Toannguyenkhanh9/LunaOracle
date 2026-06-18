import React, {useMemo, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useTranslation} from 'react-i18next';
import {Solar} from 'lunar-javascript';

import {colors} from '../theme/colors';

type CalendarCell = {
  key: string;
  solarDate: Date | null;
  solarDay?: number;
  lunarDay?: number;
  lunarMonth?: number;
  lunarYear?: number;
  isLeapMonth?: boolean;
  isToday?: boolean;
  isFirstDay?: boolean;
  isFullMoon?: boolean;
};

const WEEK_DAYS_VI = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const WEEK_DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function toMondayBasedIndex(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getLunarInfo(date: Date) {
  const solar = Solar.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );

  const lunar = solar.getLunar();
  const rawMonth = lunar.getMonth();

  return {
    lunarDay: lunar.getDay(),
    lunarMonth: Math.abs(rawMonth),
    lunarYear: lunar.getYear(),
    isLeapMonth: rawMonth < 0,
  };
}

function buildMonthCells(year: number, monthIndex: number): CalendarCell[] {
  const firstDate = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingBlankCount = toMondayBasedIndex(firstDate.getDay());
  const today = new Date();

  const cells: CalendarCell[] = [];

  for (let index = 0; index < leadingBlankCount; index += 1) {
    cells.push({
      key: `blank-start-${index}`,
      solarDate: null,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const solarDate = new Date(year, monthIndex, day);
    const lunar = getLunarInfo(solarDate);

    cells.push({
      key: `${year}-${monthIndex + 1}-${day}`,
      solarDate,
      solarDay: day,
      lunarDay: lunar.lunarDay,
      lunarMonth: lunar.lunarMonth,
      lunarYear: lunar.lunarYear,
      isLeapMonth: lunar.isLeapMonth,
      isToday: isSameDate(solarDate, today),
      isFirstDay: lunar.lunarDay === 1,
      isFullMoon: lunar.lunarDay === 15,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({
      key: `blank-end-${cells.length}`,
      solarDate: null,
    });
  }

  return cells;
}

function formatMonthTitle(date: Date, language: string): string {
  try {
    return new Intl.DateTimeFormat(language, {
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
  }
}

function formatSelectedDate(date: Date, language: string): string {
  try {
    return new Intl.DateTimeFormat(language, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

export default function LunarCalendarScreen() {
  const {t, i18n} = useTranslation();

  const today = useMemo(() => new Date(), []);

  const [visibleMonth, setVisibleMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [selectedDate, setSelectedDate] = useState(today);

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const isVietnamese = language.toLowerCase().startsWith('vi');

  const weekDays = isVietnamese
    ? WEEK_DAYS_VI
    : WEEK_DAYS_EN;

  const cells = useMemo(
    () =>
      buildMonthCells(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth(),
      ),
    [visibleMonth],
  );

  const selectedLunar = useMemo(
    () => getLunarInfo(selectedDate),
    [selectedDate],
  );

  const goToPreviousMonth = () => {
    setVisibleMonth(current =>
      new Date(
        current.getFullYear(),
        current.getMonth() - 1,
        1,
      ),
    );
  };

  const goToNextMonth = () => {
    setVisibleMonth(current =>
      new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        1,
      ),
    );
  };

  const goToToday = () => {
    const now = new Date();

    setVisibleMonth(
      new Date(now.getFullYear(), now.getMonth(), 1),
    );

    setSelectedDate(now);
  };

  const selectDate = (cell: CalendarCell) => {
    if (!cell.solarDate) {
      return;
    }

    setSelectedDate(cell.solarDate);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.title}>
            {t('lunarCalendar.title', {
              defaultValue: 'Lịch âm',
            })}
          </Text>

          <Text style={styles.subtitle}>
            {t('lunarCalendar.subtitle', {
              defaultValue:
                'Xem ngày âm, mùng một và ngày rằm.',
            })}
          </Text>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.monthHeader}>
            <Pressable
              hitSlop={10}
              style={({pressed}) => [
                styles.navButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={goToPreviousMonth}>
              <Text style={styles.navButtonText}>‹</Text>
            </Pressable>

            <Text style={styles.monthTitle}>
              {formatMonthTitle(
                visibleMonth,
                language,
              )}
            </Text>

            <Pressable
              hitSlop={10}
              style={({pressed}) => [
                styles.navButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={goToNextMonth}>
              <Text style={styles.navButtonText}>›</Text>
            </Pressable>
          </View>

          <Pressable
            style={({pressed}) => [
              styles.todayButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={goToToday}>
            <Text style={styles.todayButtonText}>
              {t('lunarCalendar.today', {
                defaultValue: 'Hôm nay',
              })}
            </Text>
          </Pressable>

          <View style={styles.weekRow}>
            {weekDays.map(day => (
              <View key={day} style={styles.weekCell}>
                <Text style={styles.weekText}>
                  {day}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.grid}>
            {cells.map(cell => {
              if (!cell.solarDate) {
                return (
                  <View
                    key={cell.key}
                    style={styles.dayCell}
                  />
                );
              }

              const isSelected = isSameDate(
                cell.solarDate,
                selectedDate,
              );

              return (
                <Pressable
                  key={cell.key}
                  style={({pressed}) => [
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    cell.isToday && styles.dayCellToday,
                    pressed && styles.dayCellPressed,
                  ]}
                  onPress={() => selectDate(cell)}>
                  <Text
                    style={[
                      styles.solarDay,
                      isSelected &&
                        styles.solarDaySelected,
                    ]}>
                    {cell.solarDay}
                  </Text>

                  <Text
                    style={[
                      styles.lunarDay,
                      (cell.isFirstDay ||
                        cell.isFullMoon) &&
                        styles.lunarDaySpecial,
                      isSelected &&
                        styles.lunarDaySelected,
                    ]}>
                    {cell.lunarDay === 1
                      ? `${cell.lunarDay}/${cell.lunarMonth}`
                      : cell.lunarDay}
                  </Text>

                  {(cell.isFirstDay ||
                    cell.isFullMoon) && (
                    <View
                      style={[
                        styles.specialDot,
                        cell.isFirstDay
                          ? styles.firstDayDot
                          : styles.fullMoonDot,
                      ]}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  styles.firstDayDot,
                ]}
              />
              <Text style={styles.legendText}>
                {t('lunarCalendar.firstDay', {
                  defaultValue: 'Mùng một',
                })}
              </Text>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  styles.fullMoonDot,
                ]}
              />
              <Text style={styles.legendText}>
                {t('lunarCalendar.fullMoon', {
                  defaultValue: 'Ngày rằm',
                })}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>
            {formatSelectedDate(
              selectedDate,
              language,
            )}
          </Text>

          <View style={styles.lunarDateCircle}>
            <Text style={styles.lunarDateDay}>
              {selectedLunar.lunarDay}
            </Text>

            <Text style={styles.lunarDateMonth}>
              {t('lunarCalendar.lunarMonth', {
                month: selectedLunar.lunarMonth,
                defaultValue: `Tháng ${selectedLunar.lunarMonth}`,
              })}
            </Text>
          </View>

          <View style={styles.detailRows}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t('lunarCalendar.solarDate', {
                  defaultValue: 'Dương lịch',
                })}
              </Text>

              <Text style={styles.detailValue}>
                {selectedDate.getDate()}/
                {selectedDate.getMonth() + 1}/
                {selectedDate.getFullYear()}
              </Text>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t('lunarCalendar.lunarDate', {
                  defaultValue: 'Âm lịch',
                })}
              </Text>

              <Text style={styles.detailValue}>
                {selectedLunar.lunarDay}/
                {selectedLunar.lunarMonth}/
                {selectedLunar.lunarYear}
                {selectedLunar.isLeapMonth
                  ? ` (${t('lunarCalendar.leapMonth', {
                      defaultValue: 'nhuận',
                    })})`
                  : ''}
              </Text>
            </View>
          </View>

          {selectedLunar.lunarDay === 1 && (
            <View style={styles.observanceCard}>
              <Text style={styles.observanceIcon}>
                🌑
              </Text>

              <View style={styles.observanceContent}>
                <Text style={styles.observanceTitle}>
                  {t(
                    'lunarCalendar.firstDayTitle',
                    {
                      defaultValue:
                        'Hôm nay là mùng một',
                    },
                  )}
                </Text>

                <Text style={styles.observanceText}>
                  {t(
                    'lunarCalendar.observanceMessage',
                    {
                      defaultValue:
                        'Hãy dành một chút thời gian để tĩnh tâm, thiền hoặc tụng kinh.',
                    },
                  )}
                </Text>
              </View>
            </View>
          )}

          {selectedLunar.lunarDay === 15 && (
            <View style={styles.observanceCard}>
              <Text style={styles.observanceIcon}>
                🌕
              </Text>

              <View style={styles.observanceContent}>
                <Text style={styles.observanceTitle}>
                  {t(
                    'lunarCalendar.fullMoonTitle',
                    {
                      defaultValue:
                        'Hôm nay là ngày rằm',
                    },
                  )}
                </Text>

                <Text style={styles.observanceText}>
                  {t(
                    'lunarCalendar.observanceMessage',
                    {
                      defaultValue:
                        'Hãy dành một chút thời gian để tĩnh tâm, thiền hoặc tụng kinh.',
                    },
                  )}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const GOLD = '#D4A747';
const GOLD_LIGHT = '#F6D98E';
const BROWN = '#4A2D1D';
const CARD = '#FFF9EF';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 16,
    paddingBottom: 120,
  },

  headerCard: {
    backgroundColor: BROWN,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },

  title: {
    color: GOLD_LIGHT,
    fontSize: 29,
    fontWeight: '800',
    textAlign: 'center',
  },

  subtitle: {
    color: '#E6CDAA',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },

  calendarCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: '#E7D2AB',
    borderRadius: 22,
    padding: 14,
  },

  monthHeader: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  navButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1E2C8',
    borderRadius: 21,
  },

  navButtonText: {
    color: BROWN,
    fontSize: 31,
    lineHeight: 34,
  },

  monthTitle: {
    flex: 1,
    color: BROWN,
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'capitalize',
  },

  todayButton: {
    alignSelf: 'center',
    backgroundColor: BROWN,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 8,
    marginBottom: 13,
  },

  todayButtonText: {
    color: GOLD_LIGHT,
    fontSize: 13,
    fontWeight: '700',
  },

  weekRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E8D8BC',
    paddingBottom: 7,
  },

  weekCell: {
    width: '14.2857%',
    alignItems: 'center',
  },

  weekText: {
    color: '#80684F',
    fontSize: 12,
    fontWeight: '700',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 6,
  },

  dayCell: {
    width: '14.2857%',
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    marginVertical: 2,
  },

  dayCellSelected: {
    backgroundColor: BROWN,
  },

  dayCellToday: {
    borderWidth: 1.5,
    borderColor: GOLD,
  },

  dayCellPressed: {
    opacity: 0.65,
  },

  solarDay: {
    color: '#3F3025',
    fontSize: 16,
    fontWeight: '700',
  },

  solarDaySelected: {
    color: '#FFF8E9',
  },

  lunarDay: {
    color: '#A58D70',
    fontSize: 10,
    marginTop: 2,
  },

  lunarDaySpecial: {
    color: '#B64635',
    fontWeight: '800',
  },

  lunarDaySelected: {
    color: GOLD_LIGHT,
  },

  specialDot: {
    position: 'absolute',
    bottom: 4,
    width: 5,
    height: 5,
    borderRadius: 3,
  },

  firstDayDot: {
    backgroundColor: '#8553B6',
  },

  fullMoonDot: {
    backgroundColor: '#D49A24',
  },

  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  legendText: {
    color: '#80684F',
    fontSize: 12,
  },

  detailCard: {
    alignItems: 'center',
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: '#E7D2AB',
    borderRadius: 22,
    padding: 18,
    marginTop: 16,
  },

  detailTitle: {
    color: BROWN,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'capitalize',
  },

  lunarDateCircle: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BROWN,
    borderWidth: 3,
    borderColor: GOLD,
    borderRadius: 56,
    marginTop: 16,
  },

  lunarDateDay: {
    color: GOLD_LIGHT,
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 46,
  },

  lunarDateMonth: {
    color: '#EED5A6',
    fontSize: 13,
    fontWeight: '700',
  },

  detailRows: {
    width: '100%',
    backgroundColor: '#F5EAD7',
    borderRadius: 16,
    paddingHorizontal: 15,
    marginTop: 18,
  },

  detailRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  detailLabel: {
    color: '#80684F',
    fontSize: 14,
  },

  detailValue: {
    flexShrink: 1,
    color: BROWN,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
    marginLeft: 14,
  },

  detailDivider: {
    height: 1,
    backgroundColor: '#DFCCAB',
  },

  observanceCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0C7',
    borderWidth: 1,
    borderColor: '#E8C672',
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
  },

  observanceIcon: {
    fontSize: 36,
    marginRight: 12,
  },

  observanceContent: {
    flex: 1,
  },

  observanceTitle: {
    color: BROWN,
    fontSize: 15,
    fontWeight: '800',
  },

  observanceText: {
    color: '#745B42',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },

  buttonPressed: {
    opacity: 0.65,
  },
});
