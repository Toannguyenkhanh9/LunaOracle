import React, {
  useCallback,
  useState,
} from 'react';

import {
  Alert,
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

import JourneyDayCard
  from '../components/JourneyDayCard';

import {
  ORACLE_JOURNEYS,
  claimActiveJourneyDayReward,
  completeActiveJourneyDay,
  getOracleJourneyDashboard,
  startOracleJourney,
  type OracleJourneyDashboard,
  type OracleJourneyId,
} from '../services/oracleJourney';

export default function OracleJourneyScreen() {
  const {t} =
    useTranslation();

  const [
    dashboard,
    setDashboard,
  ] =
    useState<OracleJourneyDashboard | undefined>();

  const load = useCallback(
    async () => {
      setDashboard(
        await getOracleJourneyDashboard(),
      );
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

  const start =
    async (
      id: OracleJourneyId,
    ) => {
      await startOracleJourney(id);
      await load();
    };

  const complete =
    async () => {
      setDashboard(
        await completeActiveJourneyDay(),
      );
    };

  const claim =
    async () => {
      const result =
        await claimActiveJourneyDayReward();

      setDashboard(result.dashboard);

      if (result.success) {
        Alert.alert(
          t(
            'journey.claimedTitle',
            {
              defaultValue:
                'Reward claimed',
            },
          ),
          t(
            'journey.claimedMessage',
            {
              amount:
                result.reward,
              defaultValue:
                `You earned ${result.reward} Moon Dust.`,
            },
          ),
        );
      }
    };

  if (!dashboard) {
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

  const activeDayCompleted =
    !!dashboard.activeDayKey &&
    dashboard.state.completedDayKeys.includes(
      dashboard.activeDayKey,
    );

  const activeDayClaimed =
    !!dashboard.activeDayKey &&
    dashboard.state.claimedDayKeys.includes(
      dashboard.activeDayKey,
    );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'journey.eyebrow',
            {
              defaultValue:
                'Journey',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'journey.title',
            {
              defaultValue:
                '7-Day / 30-Day Journey',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'journey.subtitle',
            {
              defaultValue:
                'Choose a guided path. Each day gives a prompt, one aligned action, and Moon Dust.',
            },
          )}
        </Text>

        {dashboard.activeJourney &&
        dashboard.activeDay ? (
          <View>
            <View
              style={[
                styles.heroCard,
                {
                  backgroundColor:
                    dashboard.activeJourney.color,
                },
              ]}>
              <Text
                style={[
                  styles.heroKicker,
                  {
                    color:
                      dashboard.activeJourney.accent,
                  },
                ]}>
                {t(
                  'journey.active',
                  {
                    defaultValue:
                      'Active Journey',
                  },
                )}
              </Text>

              <Text style={styles.heroTitle}>
                {t(
                  dashboard.activeJourney.titleKey,
                  {
                    defaultValue:
                      dashboard.activeJourney.titleFallback,
                  },
                )}
              </Text>

              <Text style={styles.heroText}>
                {t(
                  dashboard.activeJourney.descriptionKey,
                  {
                    defaultValue:
                      dashboard.activeJourney.descriptionFallback,
                  },
                )}
              </Text>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width:
                        `${dashboard.progress}%`,
                      backgroundColor:
                        dashboard.activeJourney.accent,
                    },
                  ]}
                />
              </View>

              <Text style={styles.progressText}>
                {dashboard.completedCount}/
                {dashboard.activeJourney.days}{' '}
                {t(
                  'journey.daysCompleted',
                  {
                    defaultValue:
                      'days completed',
                  },
                )}
              </Text>
            </View>

            <Text style={styles.sectionTitle}>
              {t(
                'journey.today',
                {
                  defaultValue:
                    'Today',
                },
              )}
            </Text>

            <JourneyDayCard
              day={dashboard.activeDay}
              completed={activeDayCompleted}
              claimed={activeDayClaimed}
              onComplete={complete}
              onClaim={claim}
            />
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>
              {t(
                'journey.choose',
                {
                  defaultValue:
                    'Choose your path',
                },
              )}
            </Text>

            {ORACLE_JOURNEYS.map(item => (
              <Pressable
                key={item.id}
                style={[
                  styles.journeyCard,
                  {
                    backgroundColor:
                      item.color,
                  },
                ]}
                onPress={() =>
                  start(item.id)
                }>
                <Text
                  style={[
                    styles.journeyDays,
                    {
                      color:
                        item.accent,
                    },
                  ]}>
                  {item.days}{' '}
                  {t(
                    'journey.days',
                    {
                      defaultValue:
                        'days',
                    },
                  )}
                </Text>

                <Text style={styles.journeyTitle}>
                  {t(item.titleKey, {
                    defaultValue:
                      item.titleFallback,
                  })}
                </Text>

                <Text style={styles.journeyText}>
                  {t(item.descriptionKey, {
                    defaultValue:
                      item.descriptionFallback,
                  })}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        <Text style={styles.notice}>
          {t(
            'journey.notice',
            {
              defaultValue:
                'Journeys are stored locally on this device. Start a new journey when you want to reset the path.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = {
  cream: '#F7F2EA',
  paper: '#FFFDF8',
  border: '#E9DCC5',
  night: '#1B1537',
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
    lineHeight: 35,
    fontWeight: '900',
    marginTop: 5,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 16,
  },

  heroCard: {
    borderRadius: 28,
    padding: 18,
  },

  heroKicker: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },

  heroTitle: {
    color: '#FFF8EA',
    fontSize: 25,
    fontWeight: '900',
    marginTop: 6,
  },

  heroText: {
    color: '#DCD2F3',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
  },

  progressTrack: {
    overflow: 'hidden',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 99,
    marginTop: 14,
  },

  progressFill: {
    height: 8,
    borderRadius: 99,
  },

  progressText: {
    color: '#DCD2F3',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 7,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 20,
    marginBottom: 12,
  },

  journeyCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
  },

  journeyDays: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },

  journeyTitle: {
    color: '#FFF8EA',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 5,
  },

  journeyText: {
    color: '#DCD2F3',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 15,
  },
});
