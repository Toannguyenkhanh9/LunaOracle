import React, {
  useCallback,
  useState,
} from 'react';

import {
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

import OracleLevelBadge
  from '../components/OracleLevelBadge';

import {
  buildUserProgressHub,
} from '../services/userProgressHub';

type Hub = Awaited<
  ReturnType<typeof buildUserProgressHub>
>;

export default function UserProgressHubScreen() {
  const {t} =
    useTranslation();

  const [
    hub,
    setHub,
  ] =
    useState<Hub | undefined>();

  const load = useCallback(
    async () => {
      setHub(
        await buildUserProgressHub(),
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

  if (!hub) {
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
            'progressHub.eyebrow',
            {
              defaultValue:
                'Progress',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'progressHub.title',
            {
              defaultValue:
                'User Progress Hub',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'progressHub.subtitle',
            {
              defaultValue:
                'See your Oracle level, journey, mood pattern, dreams, and relationship reflection in one place.',
            },
          )}
        </Text>

        <OracleLevelBadge
          level={hub.oracle.level}
          totalExp={
            hub.oracle.progress.totalExp
          }
          progress={
            hub.oracle.levelProgress
          }
          expToNextLevel={
            hub.oracle.expToNextLevel
          }
        />

        <View style={styles.grid}>
          <Stat
            label={t(
              'progressHub.retentionActions',
              {
                defaultValue:
                  'Actions',
              },
            )}
            value={`${hub.retention.totalActions}`}
          />

          <Stat
            label={t(
              'progressHub.journey',
              {
                defaultValue:
                  'Journey',
              },
            )}
            value={`${hub.journey.progress}%`}
          />

          <Stat
            label={t(
              'progressHub.moodEnergy',
              {
                defaultValue:
                  'Mood',
              },
            )}
            value={`${hub.mood.insight.averageEnergy}`}
          />

          <Stat
            label={t(
              'progressHub.dreams',
              {
                defaultValue:
                  'Dreams',
              },
            )}
            value={`${hub.dreams.total}`}
          />

          <Stat
            label={t(
              'progressHub.relationship',
              {
                defaultValue:
                  'Love',
              },
            )}
            value={`${hub.relationship.insight.averageIntensity}`}
          />

          <Stat
            label={t(
              'progressHub.quest',
              {
                defaultValue:
                  'Quest',
              },
            )}
            value={`${hub.oracle.completedCount}/${hub.oracle.totalCount}`}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {t(
              'progressHub.nextFocus',
              {
                defaultValue:
                  'Suggested focus',
              },
            )}
          </Text>

          <Text style={styles.bodyText}>
            {hub.oracle.readyToClaimCount > 0
              ? t(
                  'progressHub.focusClaim',
                  {
                    defaultValue:
                      'You have quest rewards ready to claim.',
                  },
                )
              : hub.journey.activeJourney
                ? t(
                    'progressHub.focusJourney',
                    {
                      defaultValue:
                        'Continue your active journey today.',
                    },
                  )
                : t(
                    'progressHub.focusStart',
                    {
                      defaultValue:
                        'Start a journey or log your mood to build a stronger pattern.',
                    },
                  )}
          </Text>
        </View>

        <Text style={styles.notice}>
          {t(
            'progressHub.notice',
            {
              defaultValue:
                'Progress is stored locally on this device.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

const COLORS = {
  cream: '#F7F2EA',
  paper: '#FFFDF8',
  border: '#E9DCC5',
  text: '#282236',
  muted: '#756D7D',
  purple: '#6E4DA8',
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

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
    marginTop: 14,
  },

  stat: {
    width: '50%',
    paddingHorizontal: 5,
    marginBottom: 10,
  },

  statValue: {
    color: COLORS.purple,
    fontSize: 24,
    fontWeight: '900',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 12,
    paddingTop: 12,
  },

  statLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '900',
    backgroundColor: COLORS.paper,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingHorizontal: 12,
    paddingBottom: 12,
    textTransform: 'uppercase',
  },

  card: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 15,
    marginTop: 4,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '900',
  },

  bodyText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    fontWeight: '800',
    marginTop: 7,
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 14,
  },
});
