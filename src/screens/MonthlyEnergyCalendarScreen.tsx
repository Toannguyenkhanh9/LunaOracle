import React, {
  useCallback,
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
  useFocusEffect,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import {
  buildMonthlyEnergyCalendar,
  type MonthlyEnergyCalendar,
  type MonthlyEnergyDay,
} from '../services/monthlyEnergyCalendar';

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

export default function MonthlyEnergyCalendarScreen() {
  const {t} =
    useTranslation();

  const [
    currentMonth,
    setCurrentMonth,
  ] =
    useState(
      () =>
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1,
        ),
    );

  const [
    calendar,
    setCalendar,
  ] =
    useState<MonthlyEnergyCalendar | undefined>();

  const [
    selected,
    setSelected,
  ] =
    useState<MonthlyEnergyDay | undefined>();

  const load = useCallback(
    async () => {
      const next =
        await buildMonthlyEnergyCalendar(
          currentMonth,
        );

      setCalendar(next);

      setSelected(
        next.days.find(
          day =>
            day.day ===
            new Date().getDate(),
        ) ?? next.days[0],
      );
    },
    [currentMonth],
  );

  useFocusEffect(
    useCallback(
      () => {
        void load();
      },
      [load],
    ),
  );

  const changeMonth =
    (delta: number) => {
      setCurrentMonth(
        previous =>
          new Date(
            previous.getFullYear(),
            previous.getMonth() + delta,
            1,
          ),
      );
    };

  if (!calendar) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>
            {t('common.loading', {
              defaultValue: 'Loading...',
            })}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'monthlyEnergy.eyebrow',
            {
              defaultValue:
                'Calendar',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'monthlyEnergy.title',
            {
              defaultValue:
                'Monthly Energy Calendar',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'monthlyEnergy.subtitle',
            {
              defaultValue:
                'Plan love, career, ritual, rest, and creative days across the month.',
            },
          )}
        </Text>

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

        <View style={styles.grid}>
          {calendar.days.map(day => (
            <Pressable
              key={day.date}
              style={[
                styles.dayCell,
                selected?.date ===
                  day.date &&
                  styles.dayCellActive,
              ]}
              onPress={() =>
                setSelected(day)
              }>
              <Text style={styles.dayNumber}>
                {day.day}
              </Text>

              <Text style={styles.dayEmoji}>
                {day.moonEmoji}
              </Text>

              <Text
                style={[
                  styles.dayScore,
                  day.score >= 75 &&
                    styles.dayScoreHigh,
                  day.score < 48 &&
                    styles.dayScoreLow,
                ]}>
                {day.score}
              </Text>
            </Pressable>
          ))}
        </View>

        {selected ? (
          <View style={styles.detailCard}>
            <Text style={styles.detailKicker}>
              {selected.date}
            </Text>

            <Text style={styles.detailTitle}>
              {t(
                selected.titleKey,
                {
                  defaultValue:
                    selected.titleFallback,
                },
              )}
            </Text>

            <Text style={styles.detailScore}>
              {selected.score}
            </Text>

            <Text style={styles.detailText}>
              {t(
                selected.messageKey,
                {
                  defaultValue:
                    selected.messageFallback,
                },
              )}
            </Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>
          {t(
            'monthlyEnergy.highlights',
            {
              defaultValue:
                'Highlights',
            },
          )}
        </Text>

        <Highlight
          label={t(
            'monthlyEnergy.bestLove',
            {
              defaultValue:
                'Best love day',
            },
          )}
          day={calendar.bestLoveDay}
        />

        <Highlight
          label={t(
            'monthlyEnergy.bestCareer',
            {
              defaultValue:
                'Best career day',
            },
          )}
          day={calendar.bestCareerDay}
        />

        <Highlight
          label={t(
            'monthlyEnergy.bestRitual',
            {
              defaultValue:
                'Best ritual day',
            },
          )}
          day={calendar.bestRitualDay}
        />

        <Text style={styles.notice}>
          {t(
            'monthlyEnergy.notice',
            {
              defaultValue:
                'Energy scores are reflective planning prompts, not predictions.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Highlight({
  label,
  day,
}: {
  label: string;
  day?: MonthlyEnergyDay;
}) {
  return (
    <View style={styles.highlightRow}>
      <Text style={styles.highlightLabel}>
        {label}
      </Text>

      <Text style={styles.highlightValue}>
        {day
          ? `${day.day} · ${day.score}`
          : '—'}
      </Text>
    </View>
  );
}

const COLORS = {
  cream: '#F7F2EA',
  paper: '#FFFDF8',
  border: '#E9DCC5',
  night: '#1B1537',
  purple: '#6E4DA8',
  gold: '#D9B76E',
  text: '#282236',
  muted: '#756D7D',
  rose: '#B7477C',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: COLORS.muted,
    fontWeight: '800',
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
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '900',
    marginTop: 5,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },

  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },

  monthButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.night,
    borderRadius: 15,
  },

  monthButtonText: {
    color: '#F8EBCB',
    fontSize: 26,
    fontWeight: '900',
  },

  monthTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },

  dayCell: {
    width: '14.285%',
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    paddingVertical: 8,
    marginBottom: 6,
  },

  dayCellActive: {
    backgroundColor: COLORS.night,
    borderColor: COLORS.gold,
  },

  dayNumber: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '900',
  },

  dayEmoji: {
    fontSize: 16,
    marginTop: 3,
  },

  dayScore: {
    color: COLORS.purple,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 3,
  },

  dayScoreHigh: {
    color: COLORS.gold,
  },

  dayScoreLow: {
    color: COLORS.rose,
  },

  detailCard: {
    backgroundColor: COLORS.night,
    borderRadius: 26,
    padding: 16,
    marginTop: 14,
  },

  detailKicker: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  detailTitle: {
    color: '#FFF8EA',
    fontSize: 23,
    fontWeight: '900',
    marginTop: 6,
  },

  detailScore: {
    color: COLORS.gold,
    fontSize: 42,
    fontWeight: '900',
    marginTop: 4,
  },

  detailText: {
    color: '#DCD2F3',
    fontSize: 12,
    lineHeight: 19,
    fontWeight: '800',
    marginTop: 6,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 20,
    marginBottom: 12,
  },

  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    padding: 13,
    marginBottom: 8,
  },

  highlightLabel: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },

  highlightValue: {
    color: COLORS.purple,
    fontSize: 14,
    fontWeight: '900',
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 14,
  },
});
