import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import type {RootTabParamList} from '../navigation/RootNavigator';
import {
  getPracticeStats,
  getTodayPractice,
  resetTodayPractice,
  setPracticeActivity,
  type DailyPracticeRecord,
  type PracticeActivityId,
  type PracticeStats,
} from '../services/practice';
import {colors} from '../theme/colors';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'DailyRitual'
>;

type RitualStep = {
  id: PracticeActivityId;
  icon: string;
  route:
    | 'Temple'
    | 'Meditation'
    | 'SpiritualAudio'
    | 'Prayer';
};

const STEPS: RitualStep[] = [
  {
    id: 'incense',
    icon: '🪔',
    route: 'Temple',
  },
  {
    id: 'listening',
    icon: '📿',
    route: 'SpiritualAudio',
  },
  {
    id: 'meditation',
    icon: '🧘',
    route: 'Meditation',
  },
  {
    id: 'gratitude',
    icon: '🙏',
    route: 'Prayer',
  },
];

const EMPTY_STATS: PracticeStats = {
  currentStreak: 0,
  longestStreak: 0,
  totalPracticeDays: 0,
  totalCompletedRituals: 0,
  totalMeditationMinutes: 0,
};

export default function DailyRitualScreen({
  navigation,
}: Props) {
  const {t} = useTranslation();

  const [today, setToday] =
    useState<DailyPracticeRecord | null>(null);
  const [stats, setStats] =
    useState<PracticeStats>(EMPTY_STATS);
  const [isUpdating, setIsUpdating] = useState(false);

  const refresh = useCallback(async () => {
    const [todayRecord, currentStats] =
      await Promise.all([
        getTodayPractice(),
        getPracticeStats(),
      ]);

    setToday(todayRecord);
    setStats(currentStats);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const completedCount = useMemo(
    () =>
      today
        ? Object.values(today.activities).filter(Boolean)
            .length
        : 0,
    [today],
  );

  const progress = completedCount / STEPS.length;

  const toggleStep = async (
    activity: PracticeActivityId,
  ) => {
    if (!today || isUpdating) {
      return;
    }

    setIsUpdating(true);

    try {
      const updated = await setPracticeActivity(
        activity,
        !today.activities[activity],
      );

      setToday(updated);
      setStats(await getPracticeStats());
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      t('practice.resetTitle'),
      t('practice.resetMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.reset'),
          style: 'destructive',
          onPress: async () => {
            await resetTodayPractice();
            await refresh();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>🪷</Text>
          <Text style={styles.title}>
            {t('practice.title')}
          </Text>
          <Text style={styles.subtitle}>
            {t('practice.subtitle')}
          </Text>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {width: `${progress * 100}%`},
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {t('practice.progress', {
              completed: completedCount,
              total: STEPS.length,
            })}
          </Text>
        </View>

        <View style={styles.streakCard}>
          <View style={styles.streakMain}>
            <Text style={styles.streakIcon}>🔥</Text>
            <View>
              <Text style={styles.streakValue}>
                {stats.currentStreak}
              </Text>
              <Text style={styles.streakLabel}>
                {t('practice.currentStreak')}
              </Text>
            </View>
          </View>

          <View style={styles.streakDivider} />

          <View style={styles.streakSecondary}>
            <Text style={styles.streakSecondaryValue}>
              {stats.longestStreak}
            </Text>
            <Text style={styles.streakSecondaryLabel}>
              {t('practice.longestStreak')}
            </Text>
          </View>

          <View style={styles.streakSecondary}>
            <Text style={styles.streakSecondaryValue}>
              {stats.totalPracticeDays}
            </Text>
            <Text style={styles.streakSecondaryLabel}>
              {t('practice.practiceDays')}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          {t('practice.todayRitual')}
        </Text>

        {STEPS.map((step, index) => {
          const completed =
            today?.activities[step.id] ?? false;

          return (
            <View
              key={step.id}
              style={[
                styles.stepCard,
                completed && styles.stepCardCompleted,
              ]}>
              <View
                style={[
                  styles.stepNumber,
                  completed &&
                    styles.stepNumberCompleted,
                ]}>
                <Text style={styles.stepNumberText}>
                  {completed ? '✓' : index + 1}
                </Text>
              </View>

              <Text style={styles.stepIcon}>
                {step.icon}
              </Text>

              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>
                  {t(
                    `practice.steps.${step.id}.title`,
                  )}
                </Text>
                <Text style={styles.stepDescription}>
                  {t(
                    `practice.steps.${step.id}.description`,
                  )}
                </Text>
              </View>

              <View style={styles.stepActions}>
                <Pressable
                  style={({pressed}) => [
                    styles.openButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={() =>
                    navigation.navigate(step.route)
                  }>
                  <Text style={styles.openButtonText}>
                    {t('practice.open')}
                  </Text>
                </Pressable>

                <Pressable
                  disabled={isUpdating}
                  style={({pressed}) => [
                    styles.doneButton,
                    completed &&
                      styles.doneButtonCompleted,
                    pressed && styles.pressed,
                  ]}
                  onPress={() =>
                    toggleStep(step.id)
                  }>
                  <Text
                    style={[
                      styles.doneButtonText,
                      completed &&
                        styles.doneButtonTextCompleted,
                    ]}>
                    {completed
                      ? t('practice.done')
                      : t('practice.markDone')}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}

        {completedCount === STEPS.length && (
          <View style={styles.completedCard}>
            <Text style={styles.completedIcon}>✨</Text>
            <Text style={styles.completedTitle}>
              {t('practice.completedTitle')}
            </Text>
            <Text style={styles.completedMessage}>
              {t('practice.completedMessage')}
            </Text>
          </View>
        )}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            {t('practice.summaryTitle')}
          </Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {t('practice.completedRituals')}
            </Text>
            <Text style={styles.summaryValue}>
              {stats.totalCompletedRituals}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {t('practice.meditationMinutes')}
            </Text>
            <Text style={styles.summaryValue}>
              {stats.totalMeditationMinutes}
            </Text>
          </View>
        </View>

        <Pressable
          style={({pressed}) => [
            styles.resetButton,
            pressed && styles.pressed,
          ]}
          onPress={handleReset}>
          <Text style={styles.resetButtonText}>
            {t('practice.resetToday')}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const GOLD = '#D5A347';
const BROWN = '#4A2918';

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
    backgroundColor: '#F0DFC4',
    borderRadius: 26,
    padding: 22,
  },
  heroIcon: {
    fontSize: 48,
  },
  title: {
    color: BROWN,
    fontSize: 27,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    color: '#765B46',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
  progressBackground: {
    width: '100%',
    height: 9,
    backgroundColor: 'rgba(74,41,24,0.13)',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 18,
  },
  progressFill: {
    height: '100%',
    backgroundColor: GOLD,
  },
  progressText: {
    color: '#765B46',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9EF',
    borderWidth: 1,
    borderColor: '#E4D0AF',
    borderRadius: 22,
    padding: 16,
    marginTop: 16,
  },
  streakMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIcon: {
    fontSize: 33,
    marginRight: 9,
  },
  streakValue: {
    color: BROWN,
    fontSize: 25,
    fontWeight: '900',
  },
  streakLabel: {
    color: '#8C725B',
    fontSize: 11,
  },
  streakDivider: {
    width: 1,
    height: 45,
    backgroundColor: '#E4D0AF',
    marginHorizontal: 14,
  },
  streakSecondary: {
    flex: 1,
    alignItems: 'center',
  },
  streakSecondaryValue: {
    color: BROWN,
    fontSize: 20,
    fontWeight: '800',
  },
  streakSecondaryLabel: {
    color: '#8C725B',
    fontSize: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    color: BROWN,
    fontSize: 21,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 12,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E7D8BE',
    borderRadius: 18,
    padding: 13,
    marginBottom: 11,
  },
  stepCardCompleted: {
    backgroundColor: '#FFF5D8',
    borderColor: GOLD,
  },
  stepNumber: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9DCC9',
    borderRadius: 14,
  },
  stepNumberCompleted: {
    backgroundColor: GOLD,
  },
  stepNumberText: {
    color: BROWN,
    fontSize: 13,
    fontWeight: '800',
  },
  stepIcon: {
    fontSize: 29,
    marginHorizontal: 10,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    color: BROWN,
    fontSize: 15,
    fontWeight: '800',
  },
  stepDescription: {
    color: '#846D58',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  stepActions: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  openButton: {
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  openButtonText: {
    color: '#9A651E',
    fontSize: 11,
    fontWeight: '700',
  },
  doneButton: {
    backgroundColor: '#EDE1CE',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 6,
    marginTop: 4,
  },
  doneButtonCompleted: {
    backgroundColor: GOLD,
  },
  doneButtonText: {
    color: BROWN,
    fontSize: 10,
    fontWeight: '800',
  },
  doneButtonTextCompleted: {
    color: '#FFF8E8',
  },
  completedCard: {
    alignItems: 'center',
    backgroundColor: BROWN,
    borderRadius: 20,
    padding: 20,
    marginTop: 8,
  },
  completedIcon: {
    fontSize: 33,
  },
  completedTitle: {
    color: '#FFE4A3',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 7,
  },
  completedMessage: {
    color: '#EBD5B5',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 6,
  },
  summaryCard: {
    backgroundColor: '#FFF9EF',
    borderRadius: 18,
    padding: 17,
    marginTop: 16,
  },
  summaryTitle: {
    color: BROWN,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  summaryLabel: {
    color: '#806852',
    fontSize: 13,
  },
  summaryValue: {
    color: BROWN,
    fontSize: 14,
    fontWeight: '800',
  },
  resetButton: {
    alignItems: 'center',
    padding: 15,
    marginTop: 8,
  },
  resetButtonText: {
    color: '#9A7455',
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.65,
    transform: [{scale: 0.98}],
  },
});
