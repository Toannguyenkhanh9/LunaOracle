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
  useNavigation,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import DailyQuestCard
  from '../components/DailyQuestCard';

import OracleLevelBadge
  from '../components/OracleLevelBadge';

import {
  claimAllDailyQuestRewards,
  claimDailyQuestReward,
  getDailyQuestDashboard,
  markDailyQuestCompleted,
  type DailyQuestDashboard,
} from '../services/oracleEngagement';

type NavigationLike = {
  navigate: (
    routeName: string,
    params?: Record<string, unknown>,
  ) => void;
};

export default function DailyQuestScreen() {
  const {t} = useTranslation();

  const navigation =
    useNavigation<NavigationLike>();

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

  const markDone =
    async (
      questId: string,
    ) => {
      await markDailyQuestCompleted(
        questId,
      );
      await load();
    };

  const claim =
    async (
      questId: string,
    ) => {
      const result =
        await claimDailyQuestReward(
          questId,
        );

      await load();

      if (result.success) {
        Alert.alert(
          t(
            'dailyQuest.claimedTitle',
            {
              defaultValue:
                'Reward claimed',
            },
          ),
          t(
            'dailyQuest.claimedMessage',
            {
              amount:
                result.moonDust,
              defaultValue:
                `You earned ${result.moonDust} Moon Dust.`,
            },
          ),
        );
      }
    };

  const claimAll =
    async () => {
      const result =
        await claimAllDailyQuestRewards();

      await load();

      if (result.claimedCount > 0) {
        Alert.alert(
          t(
            'dailyQuest.claimedTitle',
            {
              defaultValue:
                'Reward claimed',
            },
          ),
          t(
            'dailyQuest.claimedAllMessage',
            {
              count:
                result.claimedCount,
              amount:
                result.moonDust,
              defaultValue:
                `Claimed ${result.claimedCount} rewards and earned ${result.moonDust} Moon Dust.`,
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

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'dailyQuest.eyebrow',
            {
              defaultValue:
                'Daily Quest',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'dailyQuest.title',
            {
              defaultValue:
                'Personalized Daily Quest',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'dailyQuest.subtitle',
            {
              defaultValue:
                'Complete small mystical actions each day to earn EXP, Moon Dust, and long-term progress.',
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

        <View style={styles.summaryRow}>
          <Stat
            label={t(
              'dailyQuest.completed',
              {
                defaultValue:
                  'Completed',
              },
            )}
            value={`${dashboard.completedCount}/${dashboard.totalCount}`}
          />

          <Stat
            label={t(
              'dailyQuest.ready',
              {
                defaultValue:
                  'Ready',
              },
            )}
            value={`${dashboard.readyToClaimCount}`}
          />
        </View>

        {dashboard.readyToClaimCount > 0 ? (
          <Pressable
            style={styles.claimAllButton}
            onPress={claimAll}>
            <Text style={styles.claimAllText}>
              {t(
                'dailyQuest.claimAll',
                {
                  defaultValue:
                    'Claim All Rewards',
                },
              )}
            </Text>
          </Pressable>
        ) : null}

        <Text style={styles.sectionTitle}>
          {t(
            'dailyQuest.today',
            {
              defaultValue:
                'Today’s quests',
            },
          )}
        </Text>

        {dashboard.quests.map(quest => (
          <DailyQuestCard
            key={quest.id}
            quest={quest}
            completed={
              dashboard.questState.completedQuestIds.includes(
                quest.id,
              )
            }
            claimed={
              dashboard.questState.claimedQuestIds.includes(
                quest.id,
              )
            }
            onOpen={() =>
              navigation.navigate(
                quest.routeName,
              )
            }
            onMarkDone={() =>
              markDone(quest.id)
            }
            onClaim={() =>
              claim(quest.id)
            }
          />
        ))}

        <Text style={styles.notice}>
          {t(
            'dailyQuest.notice',
            {
              defaultValue:
                'Tip: you can mark a quest done for testing. For production, connect recordOracleActivity() to each feature screen.',
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

  summaryRow: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginTop: 14,
  },

  stat: {
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
    textTransform: 'uppercase',
    marginTop: 3,
  },

  claimAllButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    backgroundColor: COLORS.gold,
    borderRadius: 17,
    marginTop: 14,
  },

  claimAllText: {
    color: COLORS.night,
    fontSize: 13,
    fontWeight: '900',
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 20,
    marginBottom: 12,
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 12,
  },
});
