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

import type {
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import type {
  RootTabParamList,
} from '../navigation/RootNavigator';

import {
  buildPracticeJourneySummary,
  getPracticeJourneyDay,
  getPracticeJourneyState,
  getPracticeJourneyTaskProgress,
  getUnlockedJourneyDay,
  isJourneyDayCompleted,
  isJourneyTaskCompleted,
  resetActivePracticeJourney,
  startPracticeJourney,
  togglePracticeJourneyTask,
  type ActivePracticeJourney,
  type PracticeJourneyLength,
  type PracticeJourneyTask,
  type PracticeJourneyState,
} from '../services/practiceJourney';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'PracticeJourney'
>;

const PLAN_OPTIONS: Array<{
  length: PracticeJourneyLength;
  icon: string;
  accent: string;
}> = [
  {
    length: 7,
    icon: '🌱',
    accent: '#E8E6CD',
  },
  {
    length: 21,
    icon: '🪷',
    accent: '#F2DEC1',
  },
  {
    length: 49,
    icon: '✨',
    accent: '#E6D9EA',
  },
];

function formatDate(
  value: string,
  language: string,
): string {
  try {
    return new Intl.DateTimeFormat(
      language,
      {
        dateStyle: 'medium',
      },
    ).format(new Date(value));
  } catch {
    return value.slice(0, 10);
  }
}

export default function PracticeJourneyScreen({
  navigation,
}: Props) {
  const {t, i18n} = useTranslation();

  const [state, setState] =
    useState<PracticeJourneyState>({
      version: 1,
      activeJourney: null,
      completedJourneys: [],
    });

  const [selectedDay, setSelectedDay] =
    useState(1);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isWorking, setIsWorking] =
    useState(false);

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const load = useCallback(async () => {
    try {
      const saved =
        await getPracticeJourneyState();

      setState(saved);

      if (saved.activeJourney) {
        setSelectedDay(
          getUnlockedJourneyDay(
            saved.activeJourney,
          ),
        );
      }
    } catch (error) {
      console.warn(
        'Unable to load practice journey:',
        error,
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const activeJourney =
    state.activeJourney;

  const summary = useMemo(() => {
    if (!activeJourney) {
      return null;
    }

    return buildPracticeJourneySummary(
      activeJourney,
    );
  }, [activeJourney]);

  const selectedJourneyDay =
    activeJourney
      ? getPracticeJourneyDay(
          activeJourney.length,
          selectedDay,
        )
      : null;

  const start = async (
    length: PracticeJourneyLength,
  ) => {
    setIsWorking(true);

    try {
      const next =
        await startPracticeJourney(
          length,
        );

      setState(next);
      setSelectedDay(1);
    } catch (error) {
      console.warn(
        'Unable to start practice journey:',
        error,
      );

      Alert.alert(
        t(
          'practiceJourney.errorTitle',
        ),
        t(
          'practiceJourney.startError',
        ),
      );
    } finally {
      setIsWorking(false);
    }
  };

  const confirmStart = (
    length: PracticeJourneyLength,
  ) => {
    Alert.alert(
      t(
        'practiceJourney.startDialogTitle',
      ),
      t(
        'practiceJourney.startDialogMessage',
        {
          count: length,
        },
      ),
      [
        {
          text: t(
            'practiceJourney.cancel',
          ),
          style: 'cancel',
        },
        {
          text: t(
            'practiceJourney.start',
          ),
          onPress: () => {
            void start(length);
          },
        },
      ],
    );
  };

  const restart = () => {
    Alert.alert(
      t(
        'practiceJourney.stopDialogTitle',
      ),
      t(
        'practiceJourney.stopDialogMessage',
      ),
      [
        {
          text: t(
            'practiceJourney.cancel',
          ),
          style: 'cancel',
        },
        {
          text: t(
            'practiceJourney.stop',
          ),
          style: 'destructive',
          onPress: async () => {
            try {
              const next =
                await resetActivePracticeJourney();

              setState(next);
              setSelectedDay(1);
            } catch (error) {
              console.warn(
                'Unable to stop practice journey:',
                error,
              );
            }
          },
        },
      ],
    );
  };

  const toggleTask = async (
    task: PracticeJourneyTask,
  ) => {
    if (!activeJourney) {
      return;
    }

    try {
      const next =
        await togglePracticeJourneyTask(
          selectedDay,
          task.id,
        );

      setState(next);
    } catch (error) {
      console.warn(
        'Unable to update journey task:',
        error,
      );
    }
  };

  const openTask = (
    task: PracticeJourneyTask,
  ) => {
    navigation.navigate(
      task.route as never,
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>
            {t(
              'practiceJourney.loading',
            )}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!activeJourney) {
    return (
      <SafeAreaView style={styles.screen}>
        <ScrollView
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={
            false
          }>
          <View style={styles.hero}>
            <Text style={styles.heroIcon}>
              🪷
            </Text>

            <Text style={styles.title}>
              {t(
                'practiceJourney.title',
              )}
            </Text>

            <Text style={styles.subtitle}>
              {t(
                'practiceJourney.subtitle',
              )}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            {t(
              'practiceJourney.choosePlan',
            )}
          </Text>

          {PLAN_OPTIONS.map(option => (
            <Pressable
              key={option.length}
              disabled={isWorking}
              style={({pressed}) => [
                styles.planCard,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                confirmStart(
                  option.length,
                )
              }>
              <View
                style={[
                  styles.planIconWrap,
                  {
                    backgroundColor:
                      option.accent,
                  },
                ]}>
                <Text
                  style={styles.planIcon}>
                  {option.icon}
                </Text>
              </View>

              <View style={styles.planInfo}>
                <Text
                  style={styles.planTitle}>
                  {t(
                    `practiceJourney.plans.${option.length}.title`,
                  )}
                </Text>

                <Text
                  style={
                    styles.planDescription
                  }>
                  {t(
                    `practiceJourney.plans.${option.length}.description`,
                  )}
                </Text>

                <Text
                  style={styles.planMeta}>
                  {t(
                    'practiceJourney.days',
                    {
                      count:
                        option.length,
                    },
                  )}
                </Text>
              </View>

              <Text style={styles.planArrow}>
                ›
              </Text>
            </Pressable>
          ))}

          {state.completedJourneys.length >
            0 && (
            <>
              <Text
                style={
                  styles.sectionTitle
                }>
                {t(
                  'practiceJourney.completedJourneys',
                )}
              </Text>

              {state.completedJourneys.map(
                item => (
                  <View
                    key={item.id}
                    style={
                      styles.completedCard
                    }>
                    <Text
                      style={
                        styles.completedIcon
                      }>
                      ✓
                    </Text>

                    <View
                      style={
                        styles.completedInfo
                      }>
                      <Text
                        style={
                          styles.completedTitle
                        }>
                        {t(
                          `practiceJourney.plans.${item.length}.title`,
                        )}
                      </Text>

                      <Text
                        style={
                          styles.completedDate
                        }>
                        {formatDate(
                          item.completedAt,
                          language,
                        )}
                      </Text>
                    </View>
                  </View>
                ),
              )}
            </>
          )}

          <View style={styles.noticeCard}>
            <Text style={styles.noticeText}>
              {t(
                'practiceJourney.notice',
              )}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const unlockedDay =
    getUnlockedJourneyDay(
      activeJourney,
    );

  const selectedCompleted =
    isJourneyDayCompleted(
      activeJourney,
      selectedDay,
    );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }>
        <View style={styles.activeHero}>
          <View
            style={
              styles.activeHeroHeader
            }>
            <View style={styles.activeHeroText}>
              <Text
                style={
                  styles.activeEyebrow
                }>
                {t(
                  'practiceJourney.currentJourney',
                )}
              </Text>

              <Text
                style={
                  styles.activeTitle
                }>
                {t(
                  `practiceJourney.plans.${activeJourney.length}.title`,
                )}
              </Text>
            </View>

            <View
              style={
                styles.activeDayBadge
              }>
              <Text
                style={
                  styles.activeDayValue
                }>
                {unlockedDay}
              </Text>

              <Text
                style={
                  styles.activeDayLabel
                }>
                / {activeJourney.length}
              </Text>
            </View>
          </View>

          <Text
            style={
              styles.activeSubtitle
            }>
            {t(
              'practiceJourney.startedOn',
              {
                date: formatDate(
                  activeJourney.startedAt,
                  language,
                ),
              },
            )}
          </Text>

          <View
            style={
              styles.progressBackground
            }>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    (summary?.progress ??
                      0) * 100
                  }%`,
                },
              ]}
            />
          </View>

          <View
            style={
              styles.progressSummary
            }>
            <Text
              style={
                styles.progressSummaryText
              }>
              {t(
                'practiceJourney.daysCompleted',
                {
                  completed:
                    summary?.completedDays ??
                    0,
                  total:
                    activeJourney.length,
                },
              )}
            </Text>

            <Text
              style={
                styles.progressSummaryText
              }>
              {Math.round(
                (summary?.progress ?? 0) *
                  100,
              )}
              %
            </Text>
          </View>
        </View>

        {activeJourney.status ===
          'completed' && (
          <View
            style={
              styles.journeyCompleteCard
            }>
            <Text
              style={
                styles.journeyCompleteIcon
              }>
              ✨
            </Text>

            <Text
              style={
                styles.journeyCompleteTitle
              }>
              {t(
                'practiceJourney.journeyCompletedTitle',
              )}
            </Text>

            <Text
              style={
                styles.journeyCompleteText
              }>
              {t(
                'practiceJourney.journeyCompletedMessage',
              )}
            </Text>

            <Pressable
              style={
                styles.newJourneyButton
              }
              onPress={restart}>
              <Text
                style={
                  styles.newJourneyButtonText
                }>
                {t(
                  'practiceJourney.chooseAnotherPlan',
                )}
              </Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          {t(
            'practiceJourney.journeyDays',
          )}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.dayRow
          }>
          {Array.from(
            {
              length:
                activeJourney.length,
            },
            (_, index) => {
              const dayNumber =
                index + 1;

              const locked =
                dayNumber >
                unlockedDay;

              const completed =
                isJourneyDayCompleted(
                  activeJourney,
                  dayNumber,
                );

              const selected =
                selectedDay ===
                dayNumber;

              return (
                <Pressable
                  key={dayNumber}
                  disabled={locked}
                  style={[
                    styles.dayButton,
                    selected &&
                      styles.dayButtonSelected,
                    completed &&
                      styles.dayButtonCompleted,
                    locked &&
                      styles.dayButtonLocked,
                  ]}
                  onPress={() =>
                    setSelectedDay(
                      dayNumber,
                    )
                  }>
                  <Text
                    style={[
                      styles.dayButtonNumber,
                      selected &&
                        styles.dayButtonNumberSelected,
                      locked &&
                        styles.dayButtonNumberLocked,
                    ]}>
                    {completed
                      ? '✓'
                      : dayNumber}
                  </Text>
                </Pressable>
              );
            },
          )}
        </ScrollView>

        {selectedJourneyDay && (
          <View style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <View>
                <Text
                  style={
                    styles.dayEyebrow
                  }>
                  {t(
                    'practiceJourney.dayNumber',
                    {
                      count:
                        selectedJourneyDay.dayNumber,
                    },
                  )}
                </Text>

                <Text
                  style={styles.dayTitle}>
                  {t(
                    selectedJourneyDay.themeKey,
                  )}
                </Text>
              </View>

              <View
                style={[
                  styles.dayStatusBadge,
                  selectedCompleted &&
                    styles.dayStatusBadgeCompleted,
                ]}>
                <Text
                  style={[
                    styles.dayStatusText,
                    selectedCompleted &&
                      styles.dayStatusTextCompleted,
                  ]}>
                  {selectedCompleted
                    ? t(
                        'practiceJourney.completed',
                      )
                    : t(
                        'practiceJourney.inProgress',
                      )}
                </Text>
              </View>
            </View>

            <Text
              style={
                styles.dayDescription
              }>
              {t(
                'practiceJourney.dayDescription',
                {
                  week:
                    selectedJourneyDay.weekNumber,
                },
              )}
            </Text>

            {selectedJourneyDay.tasks.map(
              task => {
                const completed =
                  isJourneyTaskCompleted(
                    activeJourney,
                    selectedDay,
                    task.id,
                  );

                const taskProgress =
                  getPracticeJourneyTaskProgress(
                    activeJourney,
                    selectedDay,
                    task,
                  );

                return (
                  <View
                    key={task.id}
                    style={[
                      styles.taskCard,
                      completed &&
                        styles.taskCardCompleted,
                    ]}>
                    <Pressable
                      accessibilityRole="checkbox"
                      accessibilityState={{
                        checked: completed,
                      }}
                      style={[
                        styles.taskCheck,
                        completed &&
                          styles.taskCheckCompleted,
                      ]}
                      onPress={() =>
                        toggleTask(task)
                      }>
                      <Text
                        style={
                          styles.taskCheckText
                        }>
                        {completed
                          ? '✓'
                          : ''}
                      </Text>
                    </Pressable>

                    <View
                      style={
                        styles.taskInfo
                      }>
                      <Text
                        style={[
                          styles.taskTitle,
                          completed &&
                            styles.taskTitleCompleted,
                        ]}>
                        {t(
                          task.titleKey,
                        )}
                      </Text>

                      <Text
                        style={
                          styles.taskDescription
                        }>
                        {t(
                          task.descriptionKey,
                          {
                            target:
                              task.target,
                            unit: t(
                              task.unitKey,
                            ),
                          },
                        )}
                      </Text>

                      <Text
                        style={
                          styles.taskProgressText
                        }>
                        {t(
                          'practiceJourney.taskProgress',
                          {
                            current:
                              Math.min(
                                taskProgress,
                                task.target,
                              ),
                            target:
                              task.target,
                            unit: t(
                              task.unitKey,
                            ),
                          },
                        )}
                      </Text>
                    </View>

                    <Pressable
                      style={
                        styles.openTaskButton
                      }
                      onPress={() =>
                        openTask(task)
                      }>
                      <Text
                        style={
                          styles.openTaskText
                        }>
                        {t(
                          'practiceJourney.open',
                        )}
                      </Text>
                    </Pressable>
                  </View>
                );
              },
            )}

            <Text
              style={
                styles.manualHint
              }>
              {t(
                'practiceJourney.manualHint',
              )}
            </Text>
          </View>
        )}

        <Pressable
          style={styles.stopButton}
          onPress={restart}>
          <Text style={styles.stopButtonText}>
            {t(
              'practiceJourney.stopJourney',
            )}
          </Text>
        </Pressable>

        <View style={styles.noticeCard}>
          <Text style={styles.noticeText}>
            {t(
              'practiceJourney.notice',
            )}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const BROWN = '#4A2A1A';
const GOLD = '#D4A447';
const BACKGROUND = '#FFF9F1';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  content: {
    padding: 18,
    paddingBottom: 140,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: '#7C6755',
    fontSize: 14,
  },

  hero: {
    alignItems: 'center',
    backgroundColor: '#F0DFC5',
    borderRadius: 26,
    padding: 24,
  },

  heroIcon: {
    fontSize: 50,
  },

  title: {
    color: BROWN,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 8,
  },

  subtitle: {
    color: '#765F4C',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 8,
  },

  sectionTitle: {
    color: BROWN,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 24,
    marginBottom: 12,
  },

  planCard: {
    minHeight: 116,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E5D4BA',
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
  },

  planIconWrap: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },

  planIcon: {
    fontSize: 31,
  },

  planInfo: {
    flex: 1,
    marginLeft: 13,
  },

  planTitle: {
    color: BROWN,
    fontSize: 17,
    fontWeight: '900',
  },

  planDescription: {
    color: '#786451',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  planMeta: {
    color: '#A06D24',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 6,
  },

  planArrow: {
    color: '#92745C',
    fontSize: 28,
    marginLeft: 8,
  },

  completedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5ECD9',
    borderRadius: 16,
    padding: 14,
    marginBottom: 9,
  },

  completedIcon: {
    width: 34,
    height: 34,
    color: '#496A32',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 34,
    backgroundColor: '#DFEBCD',
    borderRadius: 17,
  },

  completedInfo: {
    flex: 1,
    marginLeft: 11,
  },

  completedTitle: {
    color: BROWN,
    fontSize: 14,
    fontWeight: '800',
  },

  completedDate: {
    color: '#806B57',
    fontSize: 11,
    marginTop: 3,
  },

  activeHero: {
    backgroundColor: BROWN,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 24,
    padding: 20,
  },

  activeHeroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  activeHeroText: {
    flex: 1,
    marginRight: 12,
  },

  activeEyebrow: {
    color: '#DDBE83',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  activeTitle: {
    color: '#FFE4A5',
    fontSize: 23,
    fontWeight: '900',
    marginTop: 4,
  },

  activeDayBadge: {
    minWidth: 66,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },

  activeDayValue: {
    color: '#FFE4A5',
    fontSize: 24,
    fontWeight: '900',
  },

  activeDayLabel: {
    color: '#E0C8A5',
    fontSize: 10,
    marginTop: 1,
  },

  activeSubtitle: {
    color: '#E6D0B0',
    fontSize: 11,
    marginTop: 12,
  },

  progressBackground: {
    height: 9,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 16,
  },

  progressFill: {
    height: '100%',
    backgroundColor: GOLD,
  },

  progressSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
  },

  progressSummaryText: {
    color: '#EBD8B9',
    fontSize: 10,
    fontWeight: '700',
  },

  journeyCompleteCard: {
    alignItems: 'center',
    backgroundColor: '#FFF4D7',
    borderWidth: 1,
    borderColor: '#D9AD59',
    borderRadius: 20,
    padding: 20,
    marginTop: 15,
  },

  journeyCompleteIcon: {
    fontSize: 36,
  },

  journeyCompleteTitle: {
    color: BROWN,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 7,
  },

  journeyCompleteText: {
    color: '#76604D',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 6,
  },

  newJourneyButton: {
    backgroundColor: BROWN,
    borderRadius: 13,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 13,
  },

  newJourneyButtonText: {
    color: '#FFE4A5',
    fontSize: 12,
    fontWeight: '800',
  },

  dayRow: {
    paddingRight: 10,
  },

  dayButton: {
    width: 43,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#DDCDB4',
    borderRadius: 14,
    marginRight: 8,
  },

  dayButtonSelected: {
    backgroundColor: BROWN,
    borderColor: BROWN,
  },

  dayButtonCompleted: {
    borderColor: '#91A86F',
  },

  dayButtonLocked: {
    opacity: 0.36,
  },

  dayButtonNumber: {
    color: BROWN,
    fontSize: 12,
    fontWeight: '900',
  },

  dayButtonNumberSelected: {
    color: '#FFE4A5',
  },

  dayButtonNumberLocked: {
    color: '#9D8F80',
  },

  dayCard: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E4D4BB',
    borderRadius: 22,
    padding: 17,
    marginTop: 15,
  },

  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dayEyebrow: {
    color: '#9B784D',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },

  dayTitle: {
    color: BROWN,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 3,
  },

  dayStatusBadge: {
    marginLeft: 'auto',
    backgroundColor: '#F2E8D8',
    borderRadius: 11,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  dayStatusBadgeCompleted: {
    backgroundColor: '#E4EDD7',
  },

  dayStatusText: {
    color: '#846B56',
    fontSize: 9,
    fontWeight: '800',
  },

  dayStatusTextCompleted: {
    color: '#4E6A31',
  },

  dayDescription: {
    color: '#7C6755',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 12,
  },

  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF4E8',
    borderWidth: 1,
    borderColor: '#E8D7BE',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },

  taskCardCompleted: {
    backgroundColor: '#F0F5E8',
    borderColor: '#C9D8B2',
  },

  taskCheck: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#C7A978',
    borderRadius: 10,
  },

  taskCheckCompleted: {
    backgroundColor: '#6C874D',
    borderColor: '#6C874D',
  },

  taskCheckText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  taskInfo: {
    flex: 1,
    marginHorizontal: 11,
  },

  taskTitle: {
    color: BROWN,
    fontSize: 14,
    fontWeight: '900',
  },

  taskTitleCompleted: {
    color: '#58703C',
  },

  taskDescription: {
    color: '#7C6755',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },

  taskProgressText: {
    color: '#A06D24',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 4,
  },

  openTaskButton: {
    backgroundColor: BROWN,
    borderRadius: 11,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  openTaskText: {
    color: '#FFE4A5',
    fontSize: 10,
    fontWeight: '900',
  },

  manualHint: {
    color: '#8B7764',
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 3,
  },

  stopButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#CDAE8C',
    borderRadius: 15,
    marginTop: 17,
  },

  stopButtonText: {
    color: '#8C5D43',
    fontSize: 12,
    fontWeight: '800',
  },

  noticeCard: {
    backgroundColor: '#F4E8D7',
    borderRadius: 16,
    padding: 15,
    marginTop: 15,
  },

  noticeText: {
    color: '#75604D',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.72,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },
});
