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
  useNavigation,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import AchievementBadge
  from '../components/AchievementBadge';

import {
  buildLunaStreakStats,
  type LunaStreakStats,
} from '../services/lunaAchievements';

type NavigationLike = {
  navigate: (
    routeName: string,
    params?: Record<string, unknown>,
  ) => void;
};

export default function StreakAchievementsScreen() {
  const {t} =
    useTranslation();

  const navigation =
    useNavigation<NavigationLike>();

  const [
    stats,
    setStats,
  ] =
    useState<LunaStreakStats | undefined>();

  const load = useCallback(
    async () => {
      setStats(
        await buildLunaStreakStats(),
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

  if (!stats) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>
            {t(
              'common.loading',
              {
                defaultValue:
                  'Loading...',
              },
            )}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const unlockedCount =
    stats.achievements.filter(
      item => item.unlocked,
    ).length;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'lunaAchievements.eyebrow',
            {
              defaultValue:
                'Progress',
            },
          )}
        </Text>

        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text style={styles.title}>
              {t(
                'lunaAchievements.title',
                {
                  defaultValue:
                    'Streak & Achievements',
                },
              )}
            </Text>

            <Text style={styles.subtitle}>
              {t(
                'lunaAchievements.subtitle',
                {
                  defaultValue:
                    'Build a small daily rhythm with rituals, tarot, mood check-ins, and reflections.',
                },
              )}
            </Text>
          </View>

          <Pressable
            style={styles.ritualButton}
            onPress={() =>
              navigation.navigate(
                'DailyRitual',
              )
            }>
            <Text style={styles.ritualButtonText}>
              {t(
                'lunaAchievements.openRitual',
                {
                  defaultValue:
                    'Ritual',
                },
              )}
            </Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>
                {t(
                  'lunaAchievements.currentStreak',
                  {
                    defaultValue:
                      'Current streak',
                  },
                )}
              </Text>

              <Text style={styles.streakNumber}>
                {stats.currentStreak}
              </Text>

              <Text style={styles.streakUnit}>
                {t(
                  'lunaAchievements.days',
                  {
                    defaultValue:
                      'days',
                  },
                )}
              </Text>
            </View>

            <View style={styles.unlockBox}>
              <Text style={styles.unlockNumber}>
                {unlockedCount}
              </Text>

              <Text style={styles.unlockLabel}>
                {t(
                  'lunaAchievements.unlocked',
                  {
                    defaultValue:
                      'unlocked',
                  },
                )}
              </Text>
            </View>
          </View>

          <View style={styles.heroGrid}>
            <StatMini
              label={t(
                'lunaAchievements.longestStreak',
                {
                  defaultValue:
                    'Longest',
                },
              )}
              value={`${stats.longestStreak}`}
            />

            <StatMini
              label={t(
                'lunaAchievements.totalRituals',
                {
                  defaultValue:
                    'Rituals',
                },
              )}
              value={`${stats.totalRituals}`}
            />

            <StatMini
              label={t(
                'lunaAchievements.notes',
                {
                  defaultValue:
                    'Notes',
                },
              )}
              value={`${stats.totalNotes}`}
            />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'lunaAchievements.statsTitle',
              {
                defaultValue:
                  'Your rhythm',
              },
            )}
          </Text>

          <View style={styles.statsGrid}>
            <StatCard
              icon="♡"
              label={t(
                'lunaAchievements.uniqueMoods',
                {
                  defaultValue:
                    'Moods',
                },
              )}
              value={stats.uniqueMoods}
            />

            <StatCard
              icon="✦"
              label={t(
                'lunaAchievements.uniqueTarot',
                {
                  defaultValue:
                    'Tarot cards',
                },
              )}
              value={stats.uniqueTarotCards}
            />

            <StatCard
              icon="☾"
              label={t(
                'lunaAchievements.moonHouses',
                {
                  defaultValue:
                    'Moon houses',
                },
              )}
              value={stats.uniqueMoonHouses}
            />

            <StatCard
              icon="♃"
              label={t(
                'lunaAchievements.profiles',
                {
                  defaultValue:
                    'Profiles',
                },
              )}
              value={stats.profileCount}
            />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'lunaAchievements.badgesTitle',
              {
                defaultValue:
                  'Badges',
              },
            )}
          </Text>

          {stats.achievements.map(
            achievement => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
              />
            ),
          )}
        </View>

        <Text style={styles.notice}>
          {t(
            'lunaAchievements.notice',
            {
              defaultValue:
                'Achievements are stored locally on this device and are designed for motivation and reflection.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatMini({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statMini}>
      <Text style={styles.statMiniValue}>
        {value}
      </Text>

      <Text style={styles.statMiniLabel}>
        {label}
      </Text>
    </View>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>
        {icon}
      </Text>

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

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  titleCopy: {
    flex: 1,
  },

  title: {
    color: COLORS.text,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '900',
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  ritualButton: {
    backgroundColor: COLORS.night,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginLeft: 10,
  },

  ritualButtonText: {
    color: '#F8EBCB',
    fontSize: 11,
    fontWeight: '900',
  },

  heroCard: {
    backgroundColor: COLORS.night,
    borderRadius: 28,
    padding: 18,
    marginTop: 16,
  },

  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  heroLabel: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  streakNumber: {
    color: '#FFF8EA',
    fontSize: 64,
    lineHeight: 72,
    fontWeight: '900',
    marginTop: 4,
  },

  streakUnit: {
    color: '#DCD2F3',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  unlockBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 86,
    height: 86,
    backgroundColor: 'rgba(217,183,110,0.14)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 43,
  },

  unlockNumber: {
    color: COLORS.gold,
    fontSize: 28,
    fontWeight: '900',
  },

  unlockLabel: {
    color: '#BEB3DD',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  heroGrid: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginTop: 15,
  },

  statMini: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 10,
    marginHorizontal: 4,
  },

  statMiniValue: {
    color: '#F8EBCB',
    fontSize: 19,
    fontWeight: '900',
  },

  statMiniLabel: {
    color: '#BEB3DD',
    fontSize: 9,
    fontWeight: '900',
    marginTop: 2,
    textTransform: 'uppercase',
  },

  sectionCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 15,
    marginTop: 14,
  },

  sectionTitle: {
    color: COLORS.purple,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },

  statCard: {
    width: '50%',
    padding: 5,
  },

  statIcon: {
    color: COLORS.purple,
    fontSize: 25,
    fontWeight: '900',
    textAlign: 'center',
    backgroundColor: '#EEE6F4',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 12,
  },

  statValue: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    backgroundColor: '#EEE6F4',
    paddingTop: 2,
  },

  statLabel: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
    backgroundColor: '#EEE6F4',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingTop: 2,
    paddingBottom: 12,
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 16,
  },
});
