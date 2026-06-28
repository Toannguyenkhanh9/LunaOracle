import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useTranslation,
} from 'react-i18next';

import {
  getMoonCalendarMonth,
  getMoonDayInfo,
  type MoonDayInfo,
} from '../services/moonCalendar';

function monthTitle(
  date: Date,
): string {
  return new Intl.DateTimeFormat(
    undefined,
    {
      month: 'long',
      year: 'numeric',
    },
  ).format(date);
}

function getMoonPhaseName(
  t: ReturnType<typeof useTranslation>['t'],
  phaseId: MoonDayInfo['phaseId'],
  fallback: string,
): string {
  return t(
    `western.moon.phases.${phaseId}.name`,
    {
      defaultValue:
        fallback,
    },
  );
}

function getMoonRitualTitle(
  t: ReturnType<typeof useTranslation>['t'],
  phaseId: MoonDayInfo['phaseId'],
  fallback: string,
): string {
  return t(
    `western.moon.phases.${phaseId}.ritualTitle`,
    {
      defaultValue:
        fallback,
    },
  );
}

function getMoonRitualText(
  t: ReturnType<typeof useTranslation>['t'],
  phaseId: MoonDayInfo['phaseId'],
  fallback: string,
): string {
  return t(
    `western.moon.phases.${phaseId}.ritualText`,
    {
      defaultValue:
        fallback,
    },
  );
}

export default function MoonCalendarScreen() {
  const {t} =
    useTranslation();

  const [currentMonth, setCurrentMonth] =
    useState(
      () =>
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1,
        ),
    );

  useEffect(
    () => {
      recordOracleActivity('moonCalendar').catch(error => {
        console.warn(
          'Unable to record moon calendar activity:',
          error,
        );
      });
    },
    [],
  );

  const todayInfo =
    useMemo(
      () => getMoonDayInfo(),
      [],
    );

  const monthDays =
    useMemo(
      () =>
        getMoonCalendarMonth(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
        ),
      [currentMonth],
    );

  const majorDays =
    monthDays.filter(
      day => day.isMajorPhase,
    );

  const changeMonth = (
    delta: number,
  ) => {
    setCurrentMonth(
      previous =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + delta,
          1,
        ),
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'western.moon.eyebrow',
            {
              defaultValue:
                'Moon Rhythm',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'western.moon.title',
            {
              defaultValue:
                'Moon Calendar',
            },
          )}
        </Text>

        <View style={styles.todayCard}>
          <Text style={styles.todayEmoji}>
            {todayInfo.emoji}
          </Text>

          <Text style={styles.todayPhase}>
            {getMoonPhaseName(
              t,
              todayInfo.phaseId,
              todayInfo.phaseName,
            )}
          </Text>

          <Text style={styles.todayMeta}>
            {t(
              'western.moon.illumination',
              {
                defaultValue:
                  'Illumination',
              },
            )}{' '}
            {todayInfo.illumination}% •{' '}
            {t(
              'western.moon.moonAge',
              {
                defaultValue:
                  'Moon age',
              },
            )}{' '}
            {todayInfo.age}{' '}
            {t(
              'western.moon.days',
              {
                defaultValue:
                  'days',
              },
            )}
          </Text>

          <View style={styles.ritualBox}>
            <Text style={styles.ritualTitle}>
              {getMoonRitualTitle(
                t,
                todayInfo.phaseId,
                todayInfo.ritualTitle,
              )}
            </Text>

            <Text style={styles.ritualText}>
              {getMoonRitualText(
                t,
                todayInfo.phaseId,
                todayInfo.ritualText,
              )}
            </Text>
          </View>
        </View>

        <View style={styles.monthHeader}>
          <Pressable
            style={styles.monthButton}
            onPress={() =>
              changeMonth(-1)
            }>
            <Text style={styles.monthButtonText}>
              ‹
            </Text>
          </Pressable>

          <Text style={styles.monthTitle}>
            {monthTitle(currentMonth)}
          </Text>

          <Pressable
            style={styles.monthButton}
            onPress={() =>
              changeMonth(1)
            }>
            <Text style={styles.monthButtonText}>
              ›
            </Text>
          </Pressable>
        </View>

        <View style={styles.calendarGrid}>
          {monthDays.map(day => (
            <View
              key={day.date}
              style={[
                styles.dayCell,
                day.isMajorPhase &&
                  styles.dayCellMajor,
              ]}>
              <Text
                style={[
                  styles.dayNumber,
                  day.isMajorPhase &&
                    styles.dayNumberMajor,
                ]}>
                {day.day}
              </Text>

              <Text style={styles.dayEmoji}>
                {day.emoji}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>
          {t(
            'western.moon.majorDays',
            {
              defaultValue:
                'Major moon days',
            },
          )}
        </Text>

        {majorDays.map(day => (
          <View
            key={day.date}
            style={styles.eventCard}>
            <View style={styles.eventIcon}>
              <Text style={styles.eventEmoji}>
                {day.emoji}
              </Text>
            </View>

            <View style={styles.eventCopy}>
              <Text style={styles.eventTitle}>
                {getMoonPhaseName(
                  t,
                  day.phaseId,
                  day.phaseName,
                )}{' '}
                • {day.day}
              </Text>

              <Text style={styles.eventText}>
                {getMoonRitualTitle(
                  t,
                  day.phaseId,
                  day.ritualTitle,
                )}
                :{' '}
                {getMoonRitualText(
                  t,
                  day.phaseId,
                  day.ritualText,
                )}
              </Text>
            </View>
          </View>
        ))}

        <Text style={styles.disclaimer}>
          {t(
            'western.moon.disclaimer',
            {
              defaultValue:
                'Moon phase calculations are approximate and intended for personal reflection.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

import {
  recordOracleActivity,
} from '../services/oracleEngagement';

const COLORS = {
  cream: '#F7F2EA',
  paper: '#FFFDF8',
  border: '#E9DCC5',
  night: '#1B1537',
  purple: '#6E4DA8',
  gold: '#D9B76E',
  text: '#282236',
  muted: '#756D7D',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  content: {
    padding: 18,
    paddingBottom: 110,
  },
  eyebrow: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 5,
  },
  todayCard: {
    alignItems: 'center',
    backgroundColor: COLORS.night,
    borderRadius: 28,
    padding: 22,
    marginTop: 18,
  },
  todayEmoji: {
    fontSize: 58,
  },
  todayPhase: {
    color: '#FFF8EA',
    fontSize: 23,
    fontWeight: '900',
    marginTop: 8,
  },
  todayMeta: {
    color: '#DCD2F3',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 7,
  },
  ritualBox: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 14,
    marginTop: 16,
  },
  ritualTitle: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '900',
  },
  ritualText: {
    color: '#E9E4F5',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 12,
  },
  monthButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
  },
  monthButtonText: {
    color: COLORS.purple,
    fontSize: 27,
    fontWeight: '900',
  },
  monthTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 8,
  },
  dayCell: {
    width: '14.2857%',
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  dayCellMajor: {
    backgroundColor: '#EEE6F4',
  },
  dayNumber: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '900',
  },
  dayNumberMajor: {
    color: COLORS.purple,
  },
  dayEmoji: {
    fontSize: 17,
    marginTop: 3,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 22,
    marginBottom: 10,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
  },
  eventIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE6F4',
    borderRadius: 16,
  },
  eventEmoji: {
    fontSize: 25,
  },
  eventCopy: {
    flex: 1,
    marginLeft: 12,
  },
  eventTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },
  eventText: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },
  disclaimer: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 14,
  },
});
