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
  ORACLE_LEVELS,
  getDailyQuestDashboard,
  type DailyQuestDashboard,
} from '../services/oracleEngagement';

export default function OracleProgressScreen() {
  const {t} = useTranslation();

  const [
    dashboard,
    setDashboard,
  ] =
    useState<DailyQuestDashboard | undefined>();

  const load = useCallback(
    async () => {
      setDashboard(
        await getDailyQuestDashboard(),
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

  const counts =
    dashboard.progress.activityCounts;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'oracleLevel.eyebrow',
            {
              defaultValue:
                'Progress',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'oracleLevel.title',
            {
              defaultValue:
                'Oracle Level',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'oracleLevel.subtitle',
            {
              defaultValue:
                'Grow your Oracle level by completing rituals, tarot pulls, journal notes, shares, and reports.',
            },
          )}
        </Text>

        <OracleLevelBadge
          level={dashboard.level}
          totalExp={
            dashboard.progress.totalExp
          }
          progress={
            dashboard.levelProgress
          }
          expToNextLevel={
            dashboard.expToNextLevel
          }
        />

        <Text style={styles.sectionTitle}>
          {t(
            'oracleLevel.activity',
            {
              defaultValue:
                'Activity',
            },
          )}
        </Text>

        {Object.entries(counts).map(
          ([activity, count]) => (
            <View
              key={activity}
              style={styles.activityRow}>
              <Text style={styles.activityName}>
                {t(
                  `oracleLevel.activities.${activity}`,
                  {
                    defaultValue:
                      activity,
                  },
                )}
              </Text>

              <Text style={styles.activityCount}>
                {count}
              </Text>
            </View>
          ),
        )}

        <Text style={styles.sectionTitle}>
          {t(
            'oracleLevel.levelMap',
            {
              defaultValue:
                'Level map',
            },
          )}
        </Text>

        {ORACLE_LEVELS.map(level => (
          <View
            key={level.level}
            style={[
              styles.levelRow,
              level.level ===
                dashboard.level.level &&
                styles.levelRowActive,
            ]}>
            <Text style={styles.levelText}>
              {level.level}.{' '}
              {t(level.titleKey, {
                defaultValue:
                  level.titleFallback,
              })}
            </Text>

            <Text style={styles.levelExp}>
              {level.minExp} EXP
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
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

  sectionTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 20,
    marginBottom: 12,
  },

  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 13,
    marginBottom: 8,
  },

  activityName: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },

  activityCount: {
    color: COLORS.purple,
    fontSize: 16,
    fontWeight: '900',
  },

  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 13,
    marginBottom: 8,
  },

  levelRowActive: {
    backgroundColor: '#FFF8EA',
    borderColor: '#D9B76E',
  },

  levelText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },

  levelExp: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '900',
  },
});
