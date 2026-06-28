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

import TarotCardImage
  from '../components/TarotCardImage';

import LunaShareButton
  from '../components/LunaShareButton';

import {
  buildWeeklyReport,
  type WeeklyReport,
} from '../services/weeklyReport';

export default function WeeklyReportScreen() {
  const {t, i18n} =
    useTranslation();

  const [
    report,
    setReport,
  ] =
    useState<WeeklyReport | undefined>();

  const load = useCallback(
    async () => {
      setReport(
        await buildWeeklyReport(),
      );

      recordOracleActivity('weeklyReport').catch(error => {
        console.warn(
          'Unable to record weekly report activity:',
          error,
        );
      });
    },
    [],
  );

  useFocusEffect(
    useCallback(
      () => {
        void load();
      },
      [load],
    ),
  );

  const formatDate =
    (value: string) => {
      try {
        return new Intl.DateTimeFormat(
          i18n.resolvedLanguage ??
            i18n.language,
          {
            month: 'short',
            day: '2-digit',
          },
        ).format(new Date(value));
      } catch {
        return value;
      }
    };

  if (!report) {
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
            'weeklyReport.eyebrow',
            {
              defaultValue:
                'Weekly',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'weeklyReport.title',
            {
              defaultValue:
                'Weekly Report',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {formatDate(
            report.startDate,
          )}{' '}
          -{' '}
          {formatDate(
            report.endDate,
          )}
        </Text>

        <View style={styles.heroCard}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroLabel}>
              {t(
                `weeklyReport.themes.${report.themeId}.label`,
                {
                  defaultValue:
                    'Weekly theme',
                },
              )}
            </Text>

            <Text style={styles.heroTitle}>
              {t(
                `weeklyReport.themes.${report.themeId}.title`,
                {
                  defaultValue:
                    'Alignment',
                },
              )}
            </Text>

            <Text style={styles.heroText}>
              {t(
                `weeklyReport.themes.${report.themeId}.message`,
                {
                  defaultValue:
                    'A week for noticing what wants to become more intentional.',
                },
              )}
            </Text>
          </View>

          <TarotCardImage
            cardId={
              report.weeklyCard.card.id ??
              report.weeklyCard.card.name
            }
            title={
              report.weeklyCard.card.name
            }
            reversed={
              report.weeklyCard.orientation ===
              'reversed'
            }
            width={88}
            height={140}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            label={t(
              'weeklyReport.energyAverage',
              {
                defaultValue:
                  'Energy',
              },
            )}
            value={`${report.energyAverage}`}
          />

          <StatCard
            label={t(
              'weeklyReport.loveTrend',
              {
                defaultValue:
                  'Love',
              },
            )}
            value={`${report.loveTrend}`}
          />

          <StatCard
            label={t(
              'weeklyReport.streak',
              {
                defaultValue:
                  'Streak',
              },
            )}
            value={`${report.moonDust.currentStreak}`}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {t(
              'weeklyReport.tarotSummary',
              {
                defaultValue:
                  'Tarot summary',
              },
            )}
          </Text>

          <Text style={styles.bodyText}>
            {t(
              'weeklyReport.tarotBody',
              {
                discovered:
                  report.tarot.discovered,
                total:
                  report.tarot.total,
                mostDrawn:
                  report.tarot.mostDrawn?.name ??
                  t(
                    'weeklyReport.noneYet',
                    {
                      defaultValue:
                        'none yet',
                    },
                  ),
                defaultValue:
                  `You discovered ${report.tarot.discovered}/${report.tarot.total} cards. Most drawn: ${report.tarot.mostDrawn?.name ?? 'none yet'}.`,
              },
            )}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {t(
              'weeklyReport.reflection',
              {
                defaultValue:
                  'Reflection prompt',
              },
            )}
          </Text>

          <Text style={styles.bodyText}>
            {t(
              report.reflectionPromptId,
              {
                defaultValue:
                  'What did this week teach me about my timing?',
              },
            )}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {t(
              'weeklyReport.nextAction',
              {
                defaultValue:
                  'Next action',
              },
            )}
          </Text>

          <Text style={styles.bodyText}>
            {t(
              report.actionId,
              {
                defaultValue:
                  'Choose one clear action and keep it simple.',
              },
            )}
          </Text>
        </View>

        <LunaShareButton
          data={{
            variant: 'forecast',
            title:
              t(
                'weeklyReport.shareTitle',
                {
                  defaultValue:
                    'My Weekly Luna Report',
                },
              ),
            subtitle:
              `${formatDate(report.startDate)} - ${formatDate(report.endDate)}`,
            message:
              t(
                `weeklyReport.themes.${report.themeId}.message`,
                {
                  defaultValue:
                    'A week for noticing what wants to become more intentional.',
                },
              ),
            score:
              report.energyAverage,
            cardId:
              report.weeklyCard.card.id ??
              report.weeklyCard.card.name,
            cardName:
              report.weeklyCard.card.name,
            reversed:
              report.weeklyCard.orientation ===
              'reversed',
            badge: 'WEEKLY',
            tags: [
              'weekly',
              'report',
              'luna',
            ],
          }}
        />

        <Pressable
          style={styles.refreshButton}
          onPress={load}>
          <Text style={styles.refreshText}>
            {t(
              'weeklyReport.refresh',
              {
                defaultValue:
                  'Refresh Report',
              },
            )}
          </Text>
        </Pressable>

        <Text style={styles.notice}>
          {t(
            'weeklyReport.notice',
            {
              defaultValue:
                'Weekly Report is a reflective summary generated locally from your app activity.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
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
    fontWeight: '900',
    marginTop: 5,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 6,
  },

  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.night,
    borderRadius: 28,
    padding: 16,
    marginTop: 16,
  },

  heroCopy: {
    flex: 1,
    paddingRight: 14,
  },

  heroLabel: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  heroTitle: {
    color: '#FFF8EA',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    marginTop: 6,
  },

  heroText: {
    color: '#DCD2F3',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    marginTop: 7,
  },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginTop: 14,
  },

  statCard: {
    flex: 1,
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 12,
    marginHorizontal: 5,
  },

  statValue: {
    color: COLORS.purple,
    fontSize: 24,
    fontWeight: '900',
  },

  statLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '900',
    marginTop: 3,
    textTransform: 'uppercase',
  },

  card: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 15,
    marginTop: 12,
  },

  sectionTitle: {
    color: COLORS.purple,
    fontSize: 16,
    fontWeight: '900',
  },

  bodyText: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 21,
    fontWeight: '800',
    marginTop: 7,
  },

  refreshButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    backgroundColor: '#EEE6F4',
    borderRadius: 18,
    marginTop: 10,
  },

  refreshText: {
    color: COLORS.purple,
    fontSize: 13,
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
