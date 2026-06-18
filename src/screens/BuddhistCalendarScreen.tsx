import React, {
  useMemo,
  useState,
} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useTranslation} from 'react-i18next';

import {
  buildBuddhistMonth,
  getUpcomingBuddhistEvents,
  type BuddhistCalendarDay,
} from '../services/buddhistCalendar';
import {colors} from '../theme/colors';

function monthTitle(
  year: number,
  month: number,
  language: string,
): string {
  try {
    return new Intl.DateTimeFormat(
      language,
      {
        month: 'long',
        year: 'numeric',
      },
    ).format(
      new Date(year, month - 1, 1),
    );
  } catch {
    return `${month}/${year}`;
  }
}

function weekdayLabels(
  language: string,
): string[] {
  const start = new Date(2026, 5, 7);

  return Array.from(
    {length: 7},
    (_, index) => {
      const date = new Date(start);

      date.setDate(
        start.getDate() + index,
      );

      try {
        return new Intl.DateTimeFormat(
          language,
          {
            weekday: 'short',
          },
        ).format(date);
      } catch {
        return String(index + 1);
      }
    },
  );
}

export default function BuddhistCalendarScreen() {
  const {t, i18n} = useTranslation();

  const now = new Date();

  const [year, setYear] = useState(
    now.getFullYear(),
  );
  const [month, setMonth] = useState(
    now.getMonth() + 1,
  );
  const [selectedDateKey, setSelectedDateKey] =
    useState<string | null>(null);

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const days = useMemo(
    () => buildBuddhistMonth(year, month),
    [month, year],
  );

  const selectedDay = useMemo(
    () =>
      days.find(
        day =>
          day.solarDateKey ===
          selectedDateKey,
      ) ?? null,
    [days, selectedDateKey],
  );

  const upcoming = useMemo(
    () =>
      getUpcomingBuddhistEvents(
        new Date(),
        90,
      ).slice(0, 8),
    [],
  );

  const changeMonth = (
    offset: number,
  ) => {
    const next = new Date(
      year,
      month - 1 + offset,
      1,
    );

    setYear(next.getFullYear());
    setMonth(next.getMonth() + 1);
    setSelectedDateKey(null);
  };

  const weekdays = weekdayLabels(
    language,
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>
            ☸
          </Text>
          <Text style={styles.title}>
            {t('buddhistCalendar.title')}
          </Text>
          <Text style={styles.subtitle}>
            {t('buddhistCalendar.subtitle')}
          </Text>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.monthHeader}>
            <Pressable
              style={styles.monthButton}
              onPress={() =>
                changeMonth(-1)
              }>
              <Text
                style={styles.monthButtonText}>
                ‹
              </Text>
            </Pressable>

            <Text style={styles.monthTitle}>
              {monthTitle(
                year,
                month,
                language,
              )}
            </Text>

            <Pressable
              style={styles.monthButton}
              onPress={() =>
                changeMonth(1)
              }>
              <Text
                style={styles.monthButtonText}>
                ›
              </Text>
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {weekdays.map((label, index) => (
              <Text
                key={`${label}-${index}`}
                style={styles.weekLabel}>
                {label}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {days.map(day => {
              const selected =
                day.solarDateKey ===
                selectedDateKey;

              const hasFestival =
                day.events.some(
                  event =>
                    event.type ===
                    'festival',
                );

              const hasObservance =
                day.events.length > 0;

              return (
                <Pressable
                  key={day.solarDateKey}
                  style={[
                    styles.dayCell,
                    !day.isCurrentMonth &&
                      styles.dayCellOutside,
                    day.isToday &&
                      styles.dayCellToday,
                    selected &&
                      styles.dayCellSelected,
                  ]}
                  onPress={() =>
                    setSelectedDateKey(
                      day.solarDateKey,
                    )
                  }>
                  <Text
                    style={[
                      styles.solarDay,
                      !day.isCurrentMonth &&
                        styles.mutedText,
                      selected &&
                        styles.selectedText,
                    ]}>
                    {day.solarDay}
                  </Text>

                  <Text
                    style={[
                      styles.lunarDay,
                      !day.isCurrentMonth &&
                        styles.mutedText,
                      selected &&
                        styles.selectedSubText,
                    ]}>
                    {day.lunarDay === 1
                      ? `${day.lunarDay}/${day.lunarMonth}`
                      : day.lunarDay}
                  </Text>

                  {hasObservance && (
                    <View
                      style={[
                        styles.eventDot,
                        hasFestival &&
                          styles.festivalDot,
                      ]}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {!!selectedDay && (
          <SelectedDayCard
            day={selectedDay}
            language={language}
          />
        )}

        <Text style={styles.sectionTitle}>
          {t(
            'buddhistCalendar.upcomingTitle',
          )}
        </Text>

        {upcoming.map(day => (
          <View
            key={day.solarDateKey}
            style={styles.eventCard}>
            <View
              style={styles.eventDateBadge}>
              <Text
                style={
                  styles.eventDateNumber
                }>
                {day.solarDay}
              </Text>
              <Text
                style={styles.eventDateMonth}>
                {new Intl.DateTimeFormat(
                  language,
                  {
                    month: 'short',
                  },
                ).format(day.date)}
              </Text>
            </View>

            <View style={styles.eventInfo}>
              {day.events.map(event => (
                <View
                  key={event.id}
                  style={styles.eventItem}>
                  <Text
                    style={styles.eventTitle}>
                    {t(event.titleKey)}
                  </Text>
                  <Text
                    style={styles.eventLunar}>
                    {t(
                      'buddhistCalendar.lunarDate',
                      {
                        day: day.lunarDay,
                        month:
                          day.lunarMonth,
                      },
                    )}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>
            {t(
              'buddhistCalendar.noticeTitle',
            )}
          </Text>
          <Text style={styles.noticeText}>
            {t(
              'buddhistCalendar.notice',
            )}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SelectedDayCard({
  day,
  language,
}: {
  day: BuddhistCalendarDay;
  language: string;
}) {
  const {t} = useTranslation();

  let solarLabel = day.solarDateKey;

  try {
    solarLabel =
      new Intl.DateTimeFormat(
        language,
        {
          dateStyle: 'full',
        },
      ).format(day.date);
  } catch {
    // Keep date key.
  }

  return (
    <View style={styles.selectedCard}>
      <Text style={styles.selectedTitle}>
        {solarLabel}
      </Text>

      <Text style={styles.selectedLunar}>
        {t(
          'buddhistCalendar.lunarDate',
          {
            day: day.lunarDay,
            month: day.lunarMonth,
          },
        )}
        {day.isLeapMonth
          ? ` · ${t(
              'buddhistCalendar.leapMonth',
            )}`
          : ''}
      </Text>

      {day.events.length === 0 ? (
        <Text style={styles.noEventText}>
          {t(
            'buddhistCalendar.noEvent',
          )}
        </Text>
      ) : (
        day.events.map(event => (
          <View
            key={event.id}
            style={styles.selectedEvent}>
            <Text
              style={
                styles.selectedEventIcon
              }>
              {event.type === 'festival'
                ? '🪷'
                : event.type ===
                    'fullMoon'
                  ? '🌕'
                  : event.type ===
                      'newMoon'
                    ? '🌑'
                    : '☸'}
            </Text>
            <View style={styles.selectedEventInfo}>
              <Text
                style={
                  styles.selectedEventTitle
                }>
                {t(event.titleKey)}
              </Text>

              {!!event.noteKey && (
                <Text
                  style={
                    styles.selectedEventNote
                  }>
                  {t(event.noteKey)}
                </Text>
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const BROWN = '#4B2A19';
const GOLD = '#D4A347';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 18,
    paddingBottom: 120,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: '#F0DFC5',
    borderRadius: 26,
    padding: 22,
  },
  heroIcon: {
    color: '#A66C20',
    fontSize: 46,
  },
  title: {
    color: BROWN,
    fontSize: 27,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 7,
  },
  subtitle: {
    color: '#775F4B',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
  calendarCard: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E5D4B7',
    borderRadius: 22,
    padding: 13,
    marginTop: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  monthButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2E6D4',
    borderRadius: 19,
  },
  monthButtonText: {
    color: BROWN,
    fontSize: 29,
    lineHeight: 31,
  },
  monthTitle: {
    flex: 1,
    color: BROWN,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekLabel: {
    width: '14.2857%',
    color: '#8A735E',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 7,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.2857%',
    height: 57,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    position: 'relative',
  },
  dayCellOutside: {
    opacity: 0.34,
  },
  dayCellToday: {
    backgroundColor: '#FFF2CD',
    borderWidth: 1,
    borderColor: GOLD,
  },
  dayCellSelected: {
    backgroundColor: BROWN,
  },
  solarDay: {
    color: BROWN,
    fontSize: 15,
    fontWeight: '800',
  },
  lunarDay: {
    color: '#9B8067',
    fontSize: 9,
    marginTop: 2,
  },
  mutedText: {
    color: '#A89A8E',
  },
  selectedText: {
    color: '#FFE7A9',
  },
  selectedSubText: {
    color: '#E7CDAA',
  },
  eventDot: {
    position: 'absolute',
    bottom: 5,
    width: 5,
    height: 5,
    backgroundColor: '#967047',
    borderRadius: 3,
  },
  festivalDot: {
    backgroundColor: '#C43F35',
  },
  selectedCard: {
    backgroundColor: '#4B2A19',
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 20,
    padding: 17,
    marginTop: 16,
  },
  selectedTitle: {
    color: '#FFE7A9',
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  selectedLunar: {
    color: '#DCC4A4',
    fontSize: 12,
    marginTop: 5,
  },
  noEventText: {
    color: '#DCC4A4',
    fontSize: 13,
    marginTop: 13,
  },
  selectedEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 11,
    marginTop: 11,
  },
  selectedEventIcon: {
    fontSize: 25,
    marginRight: 10,
  },
  selectedEventInfo: {
    flex: 1,
  },
  selectedEventTitle: {
    color: '#FFE7A9',
    fontSize: 14,
    fontWeight: '800',
  },
  selectedEventNote: {
    color: '#DCC4A4',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  sectionTitle: {
    color: BROWN,
    fontSize: 21,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 12,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E5D4B7',
    borderRadius: 18,
    padding: 13,
    marginBottom: 10,
  },
  eventDateBadge: {
    width: 52,
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0DFC5',
    borderRadius: 14,
    marginRight: 12,
  },
  eventDateNumber: {
    color: BROWN,
    fontSize: 21,
    fontWeight: '900',
  },
  eventDateMonth: {
    color: '#8B6D52',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  eventInfo: {
    flex: 1,
  },
  eventItem: {
    paddingVertical: 3,
  },
  eventTitle: {
    color: BROWN,
    fontSize: 14,
    fontWeight: '800',
  },
  eventLunar: {
    color: '#8A735E',
    fontSize: 11,
    marginTop: 3,
  },
  noticeCard: {
    backgroundColor: '#F4E8D6',
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
  },
  noticeTitle: {
    color: BROWN,
    fontSize: 14,
    fontWeight: '800',
  },
  noticeText: {
    color: '#75604D',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
});
