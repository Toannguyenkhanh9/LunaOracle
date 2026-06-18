import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import {useTranslation} from 'react-i18next';

import {
  buildChantDailySummary,
  CHANT_PRACTICE_TYPES,
  CHANT_TARGETS,
  createDefaultChantDraft,
  deleteChantCounterSession,
  getChantCounterDraft,
  getChantCounterHistory,
  getLocalDateKey,
  saveChantCounterDraft,
  saveChantCounterSession,
  type ChantCounterDraft,
  type ChantCounterSession,
  type ChantPracticeType,
  type ChantTarget,
} from '../services/chantCounter';

import {
  playCounterMilestoneFeedback,
  playCounterTapFeedback,
  preloadChantCounterSounds,
  releaseChantCounterSounds,
} from '../services/chantCounterFeedback';

import {colors} from '../theme/colors';

type PracticeOption = {
  id: ChantPracticeType;
  icon: string;
};

const PRACTICE_OPTIONS: PracticeOption[] = [
  {
    id: 'buddhaName',
    icon: '🙏',
  },
  {
    id: 'mantra',
    icon: '📿',
  },
  {
    id: 'prostration',
    icon: '🙇',
  },
  {
    id: 'woodenFish',
    icon: '🥁',
  },
  {
    id: 'breath',
    icon: '🌬️',
  },
  {
    id: 'mala108',
    icon: '🧿',
  },
];

function formatHistoryDate(
  dateKey: string,
  language: string,
): string {
  const [year, month, day] =
    dateKey.split('-').map(Number);

  const date = new Date(
    year,
    month - 1,
    day,
    12,
  );

  try {
    return new Intl.DateTimeFormat(
      language,
      {
        dateStyle: 'full',
      },
    ).format(date);
  } catch {
    return dateKey;
  }
}

function formatSessionTime(
  value: string,
  language: string,
): string {
  try {
    return new Intl.DateTimeFormat(
      language,
      {
        hour: '2-digit',
        minute: '2-digit',
      },
    ).format(new Date(value));
  } catch {
    return '';
  }
}

export default function ChantCounterScreen() {
  const {t, i18n} = useTranslation();

  const [draft, setDraft] =
    useState<ChantCounterDraft>(
      createDefaultChantDraft(),
    );

  const [history, setHistory] =
    useState<ChantCounterSession[]>([]);

  const [isLoaded, setIsLoaded] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [soundEnabled, setSoundEnabled] =
    useState(true);

  const [hapticEnabled, setHapticEnabled] =
    useState(true);

  const startedAtRef =
    useRef<string | null>(null);

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  useEffect(() => {
    let mounted = true;

    Promise.all([
      getChantCounterDraft(),
      getChantCounterHistory(),
      preloadChantCounterSounds(),
    ])
      .then(([savedDraft, savedHistory]) => {
        if (!mounted) {
          return;
        }

        setDraft(savedDraft);
        setHistory(savedHistory);
        setIsLoaded(true);
      })
      .catch(error => {
        console.warn(
          'Unable to load chant counter:',
          error,
        );

        if (mounted) {
          setIsLoaded(true);
        }
      });

    return () => {
      mounted = false;
      releaseChantCounterSounds();
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const timer = setTimeout(() => {
      saveChantCounterDraft(
        draft,
      ).catch(error => {
        console.warn(
          'Unable to save chant draft:',
          error,
        );
      });
    }, 180);

    return () => {
      clearTimeout(timer);
    };
  }, [draft, isLoaded]);

  const selectedType =
    draft.selectedType;

  const currentCount =
    draft.counts[selectedType];

  const currentTarget =
    draft.targets[selectedType];

  const progress = Math.min(
    1,
    currentCount / currentTarget,
  );

  const completedRounds108 =
    Math.floor(currentCount / 108);

  const currentBead =
    currentCount % 108;

  const todaySummary = useMemo(
    () =>
      buildChantDailySummary(
        getLocalDateKey(),
        history,
      ),
    [history],
  );

  const groupedHistory = useMemo(() => {
    const result: Array<{
      dateKey: string;
      items: ChantCounterSession[];
    }> = [];

    history.forEach(item => {
      const existing = result.find(
        group =>
          group.dateKey === item.dateKey,
      );

      if (existing) {
        existing.items.push(item);
      } else {
        result.push({
          dateKey: item.dateKey,
          items: [item],
        });
      }
    });

    return result.slice(0, 14);
  }, [history]);

  const selectPractice = (
    type: ChantPracticeType,
  ) => {
    setDraft(current => ({
      ...current,
      selectedType: type,
      updatedAt:
        new Date().toISOString(),
    }));

    startedAtRef.current = null;
  };

  const selectTarget = (
    target: ChantTarget,
  ) => {
    setDraft(current => ({
      ...current,
      targets: {
        ...current.targets,
        [current.selectedType]: target,
      },
      updatedAt:
        new Date().toISOString(),
    }));
  };

  const changeCurrentCount = (
    updater: (value: number) => number,
  ) => {
    setDraft(current => {
      const type = current.selectedType;
      const previous =
        current.counts[type];
      const next = Math.max(
        0,
        Math.floor(updater(previous)),
      );

      if (
        previous === 0 &&
        next > 0 &&
        !startedAtRef.current
      ) {
        startedAtRef.current =
          new Date().toISOString();
      }

      return {
        ...current,
        counts: {
          ...current.counts,
          [type]: next,
        },
        updatedAt:
          new Date().toISOString(),
      };
    });
  };

  const increment = (
    amount = 1,
  ) => {
    const previous = currentCount;
    const next = previous + amount;

    playCounterTapFeedback(
      selectedType,
      soundEnabled,
      hapticEnabled,
    );

    if (
      previous < currentTarget &&
      next >= currentTarget
    ) {
      setTimeout(() => {
        playCounterMilestoneFeedback(
          soundEnabled,
          hapticEnabled,
        );
      }, 80);
    }

    changeCurrentCount(
      value => value + amount,
    );
  };

  const decrement = () => {
    changeCurrentCount(
      value => value - 1,
    );
  };

  const resetCurrent = () => {
    if (currentCount === 0) {
      return;
    }

    Alert.alert(
      t('chantCounter.resetTitle'),
      t('chantCounter.resetMessage'),
      [
        {
          text: t('chantCounter.cancel'),
          style: 'cancel',
        },
        {
          text: t('chantCounter.reset'),
          style: 'destructive',
          onPress: () => {
            changeCurrentCount(() => 0);
            startedAtRef.current = null;
          },
        },
      ],
    );
  };

  const saveSession = async () => {
    if (currentCount <= 0 || isSaving) {
      Alert.alert(
        t('chantCounter.emptyTitle'),
        t('chantCounter.emptyMessage'),
      );

      return;
    }

    setIsSaving(true);

    try {
      const updatedHistory =
        await saveChantCounterSession({
          practiceType: selectedType,
          count: currentCount,
          target: currentTarget,
          startedAt:
            startedAtRef.current ??
            undefined,
        });

      setHistory(updatedHistory);

      setDraft(current => ({
        ...current,
        counts: {
          ...current.counts,
          [current.selectedType]: 0,
        },
        updatedAt:
          new Date().toISOString(),
      }));

      startedAtRef.current = null;

      Alert.alert(
        t('chantCounter.savedTitle'),
        t('chantCounter.savedMessage'),
      );
    } catch (error) {
      console.warn(
        'Unable to save chant counter session:',
        error,
      );

      Alert.alert(
        t('chantCounter.saveErrorTitle'),
        t('chantCounter.saveErrorMessage'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const removeSession = (
    session: ChantCounterSession,
  ) => {
    Alert.alert(
      t('chantCounter.deleteTitle'),
      t('chantCounter.deleteMessage'),
      [
        {
          text: t('chantCounter.cancel'),
          style: 'cancel',
        },
        {
          text: t('chantCounter.delete'),
          style: 'destructive',
          onPress: async () => {
            const updated =
              await deleteChantCounterSession(
                session.id,
              );

            setHistory(updated);
          },
        },
      ],
    );
  };

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
            📿
          </Text>

          <Text style={styles.title}>
            {t('chantCounter.title')}
          </Text>

          <Text style={styles.subtitle}>
            {t('chantCounter.subtitle')}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          {t(
            'chantCounter.choosePractice',
          )}
        </Text>

        <View style={styles.practiceGrid}>
          {PRACTICE_OPTIONS.map(option => {
            const selected =
              option.id === selectedType;

            return (
              <Pressable
                key={option.id}
                style={({pressed}) => [
                  styles.practiceCard,
                  selected &&
                    styles.practiceCardSelected,
                  pressed &&
                    styles.pressed,
                ]}
                onPress={() =>
                  selectPractice(option.id)
                }>
                <Text
                  style={styles.practiceIcon}>
                  {option.icon}
                </Text>

                <Text
                  style={[
                    styles.practiceTitle,
                    selected &&
                      styles.practiceTitleSelected,
                  ]}>
                  {t(
                    `chantCounter.types.${option.id}`,
                  )}
                </Text>

                <Text
                  style={[
                    styles.practiceDraftCount,
                    selected &&
                      styles.practiceDraftCountSelected,
                  ]}>
                  {draft.counts[option.id]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>
          {t('chantCounter.chooseTarget')}
        </Text>

        <View style={styles.targetRow}>
          {CHANT_TARGETS.map(target => {
            const selected =
              target === currentTarget;

            return (
              <Pressable
                key={target}
                style={[
                  styles.targetButton,
                  selected &&
                    styles.targetButtonSelected,
                ]}
                onPress={() =>
                  selectTarget(target)
                }>
                <Text
                  style={[
                    styles.targetText,
                    selected &&
                      styles.targetTextSelected,
                  ]}>
                  {target}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.feedbackCard}>
          <View style={styles.feedbackItem}>
            <View style={styles.feedbackTextWrap}>
              <Text
                style={styles.feedbackTitle}>
                {t(
                  'chantCounter.soundFeedback',
                )}
              </Text>

              <Text
                style={
                  styles.feedbackDescription
                }>
                {t(
                  'chantCounter.soundFeedbackDescription',
                )}
              </Text>
            </View>

            <Switch
              value={soundEnabled}
              onValueChange={
                setSoundEnabled
              }
            />
          </View>

          <View style={styles.feedbackDivider} />

          <View style={styles.feedbackItem}>
            <View style={styles.feedbackTextWrap}>
              <Text
                style={styles.feedbackTitle}>
                {t(
                  'chantCounter.hapticFeedback',
                )}
              </Text>

              <Text
                style={
                  styles.feedbackDescription
                }>
                {t(
                  'chantCounter.hapticFeedbackDescription',
                )}
              </Text>
            </View>

            <Switch
              value={hapticEnabled}
              onValueChange={
                setHapticEnabled
              }
            />
          </View>
        </View>

        <View style={styles.counterCard}>
          <View style={styles.counterHeader}>
            <View>
              <Text style={styles.counterType}>
                {t(
                  `chantCounter.types.${selectedType}`,
                )}
              </Text>

              <Text style={styles.counterGoal}>
                {t(
                  'chantCounter.targetLabel',
                  {
                    target: currentTarget,
                  },
                )}
              </Text>
            </View>

            {currentCount >=
              currentTarget && (
              <View
                style={
                  styles.completedBadge
                }>
                <Text
                  style={
                    styles.completedBadgeText
                  }>
                  {t(
                    'chantCounter.completed',
                  )}
                </Text>
              </View>
            )}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t(
              'chantCounter.tapToCount',
            )}
            style={({pressed}) => [
              styles.counterButton,
              pressed &&
                styles.counterButtonPressed,
            ]}
            onPress={() => increment(1)}>
            <Text style={styles.counterNumber}>
              {currentCount}
            </Text>

            <Text style={styles.tapHint}>
              {t('chantCounter.tapToCount')}
            </Text>
          </Pressable>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress * 100}%`,
                },
              ]}
            />
          </View>

          <View style={styles.progressLabels}>
            <Text
              style={styles.progressText}>
              {currentCount}
            </Text>

            <Text
              style={styles.progressText}>
              {currentTarget}
            </Text>
          </View>

          {selectedType === 'mala108' && (
            <View style={styles.malaCard}>
              <View style={styles.malaStat}>
                <Text
                  style={styles.malaValue}>
                  {completedRounds108}
                </Text>

                <Text
                  style={styles.malaLabel}>
                  {t(
                    'chantCounter.completedRounds',
                  )}
                </Text>
              </View>

              <View
                style={styles.malaDivider}
              />

              <View style={styles.malaStat}>
                <Text
                  style={styles.malaValue}>
                  {currentBead}
                </Text>

                <Text
                  style={styles.malaLabel}>
                  {t(
                    'chantCounter.currentBead',
                  )}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.controlRow}>
            <Pressable
              style={({pressed}) => [
                styles.controlButton,
                pressed &&
                  styles.pressed,
              ]}
              onPress={decrement}>
              <Text
                style={styles.controlText}>
                −1
              </Text>
            </Pressable>

            <Pressable
              style={({pressed}) => [
                styles.controlButton,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() => increment(10)}>
              <Text
                style={styles.controlText}>
                +10
              </Text>
            </Pressable>

            <Pressable
              style={({pressed}) => [
                styles.controlButton,
                pressed &&
                  styles.pressed,
              ]}
              onPress={resetCurrent}>
              <Text
                style={styles.controlText}>
                {t('chantCounter.reset')}
              </Text>
            </Pressable>
          </View>

          <Pressable
            disabled={
              currentCount <= 0 ||
              isSaving
            }
            style={({pressed}) => [
              styles.saveButton,
              (currentCount <= 0 ||
                isSaving) &&
                styles.saveButtonDisabled,
              pressed &&
                styles.pressed,
            ]}
            onPress={saveSession}>
            <Text style={styles.saveButtonText}>
              {isSaving
                ? t(
                    'chantCounter.saving',
                  )
                : t(
                    'chantCounter.saveSession',
                  )}
            </Text>
          </Pressable>

          <Text style={styles.autoSaveText}>
            {t('chantCounter.autoSave')}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          {t('chantCounter.todaySummary')}
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <SummaryStat
              value={
                todaySummary.totalCount
              }
              label={t(
                'chantCounter.totalCount',
              )}
            />

            <SummaryStat
              value={
                todaySummary.totalSessions
              }
              label={t(
                'chantCounter.totalSessions',
              )}
            />

            <SummaryStat
              value={
                todaySummary.completedTargets
              }
              label={t(
                'chantCounter.targetsReached',
              )}
            />
          </View>

          <View style={styles.summaryList}>
            {CHANT_PRACTICE_TYPES.map(
              type => (
                <View
                  key={type}
                  style={styles.summaryRow}>
                  <Text
                    style={
                      styles.summaryLabel
                    }>
                    {t(
                      `chantCounter.types.${type}`,
                    )}
                  </Text>

                  <Text
                    style={
                      styles.summaryValue
                    }>
                    {
                      todaySummary
                        .totals[type]
                    }
                  </Text>
                </View>
              ),
            )}
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          {t('chantCounter.history')}
        </Text>

        {groupedHistory.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              📖
            </Text>

            <Text style={styles.emptyText}>
              {t('chantCounter.emptyHistory')}
            </Text>
          </View>
        ) : (
          groupedHistory.map(group => (
            <View
              key={group.dateKey}
              style={styles.historyDay}>
              <Text
                style={styles.historyDate}>
                {formatHistoryDate(
                  group.dateKey,
                  language,
                )}
              </Text>

              {group.items.map(session => (
                <View
                  key={session.id}
                  style={styles.historyCard}>
                  <View
                    style={
                      styles.historyIconWrap
                    }>
                    <Text
                      style={
                        styles.historyIcon
                      }>
                      {
                        PRACTICE_OPTIONS.find(
                          option =>
                            option.id ===
                            session.practiceType,
                        )?.icon
                      }
                    </Text>
                  </View>

                  <View
                    style={
                      styles.historyInfo
                    }>
                    <Text
                      style={
                        styles.historyTitle
                      }>
                      {t(
                        `chantCounter.types.${session.practiceType}`,
                      )}
                    </Text>

                    <Text
                      style={
                        styles.historyMeta
                      }>
                      {formatSessionTime(
                        session.completedAt,
                        language,
                      )}
                      {' · '}
                      {t(
                        'chantCounter.historyTarget',
                        {
                          count:
                            session.count,
                          target:
                            session.target,
                        },
                      )}
                    </Text>

                    {session.rounds108 >
                      0 && (
                      <Text
                        style={
                          styles.historyRounds
                        }>
                        {t(
                          'chantCounter.historyRounds',
                          {
                            rounds:
                              session.rounds108,
                            remainder:
                              session.remainder108,
                          },
                        )}
                      </Text>
                    )}
                  </View>

                  <Pressable
                    hitSlop={8}
                    style={styles.deleteButton}
                    onPress={() =>
                      removeSession(session)
                    }>
                    <Text
                      style={styles.deleteText}>
                      {t(
                        'chantCounter.delete',
                      )}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryStat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <View style={styles.summaryStat}>
      <Text style={styles.summaryStatValue}>
        {value}
      </Text>

      <Text style={styles.summaryStatLabel}>
        {label}
      </Text>
    </View>
  );
}

const BROWN = '#4A2A1A';
const GOLD = '#D3A24A';

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
    backgroundColor: '#F0DFC5',
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
    marginTop: 7,
  },

  subtitle: {
    color: '#775F4B',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },

  sectionTitle: {
    color: BROWN,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 23,
    marginBottom: 11,
  },

  practiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  practiceCard: {
    width: '31.5%',
    minHeight: 104,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E5D6BE',
    borderRadius: 17,
    padding: 8,
    marginBottom: 9,
  },

  practiceCardSelected: {
    backgroundColor: BROWN,
    borderColor: GOLD,
  },

  practiceIcon: {
    fontSize: 29,
  },

  practiceTitle: {
    color: '#705947',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 6,
  },

  practiceTitleSelected: {
    color: '#FFE4A5',
  },

  practiceDraftCount: {
    color: '#A08871',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },

  practiceDraftCountSelected: {
    color: '#E9D4B6',
  },

  targetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  targetButton: {
    minWidth: 54,
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#DFCDB2',
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
  },

  targetButtonSelected: {
    backgroundColor: GOLD,
    borderColor: '#B9822F',
  },

  targetText: {
    color: BROWN,
    fontSize: 13,
    fontWeight: '800',
  },

  targetTextSelected: {
    color: '#3C2418',
  },

  feedbackCard: {
    backgroundColor: '#FFF9EF',
    borderRadius: 18,
    padding: 15,
    marginTop: 7,
  },

  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  feedbackTextWrap: {
    flex: 1,
    marginRight: 12,
  },

  feedbackTitle: {
    color: BROWN,
    fontSize: 13,
    fontWeight: '800',
  },

  feedbackDescription: {
    color: '#806B57',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },

  feedbackDivider: {
    height: 1,
    backgroundColor: '#E6D6BD',
    marginVertical: 12,
  },

  counterCard: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E3D1B4',
    borderRadius: 24,
    padding: 18,
    marginTop: 16,
  },

  counterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  counterType: {
    color: BROWN,
    fontSize: 18,
    fontWeight: '800',
  },

  counterGoal: {
    color: '#846E59',
    fontSize: 11,
    marginTop: 3,
  },

  completedBadge: {
    backgroundColor: '#E8F1D9',
    borderRadius: 11,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  completedBadgeText: {
    color: '#4E6A31',
    fontSize: 10,
    fontWeight: '800',
  },

  counterButton: {
    width: 220,
    height: 220,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BROWN,
    borderWidth: 8,
    borderColor: '#E4C98E',
    borderRadius: 110,
    marginVertical: 24,
    shadowColor: GOLD,
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    elevation: 8,
  },

  counterButtonPressed: {
    opacity: 0.84,
    transform: [{scale: 0.97}],
  },

  counterNumber: {
    color: '#FFE7A9',
    fontSize: 58,
    fontWeight: '900',
  },

  tapHint: {
    color: '#E8D0AF',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 5,
  },

  progressBackground: {
    height: 9,
    backgroundColor: '#E8DDCC',
    borderRadius: 5,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: GOLD,
  },

  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  progressText: {
    color: '#806B57',
    fontSize: 10,
    fontWeight: '700',
  },

  malaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8EEDC',
    borderRadius: 16,
    padding: 13,
    marginTop: 15,
  },

  malaStat: {
    flex: 1,
    alignItems: 'center',
  },

  malaValue: {
    color: BROWN,
    fontSize: 23,
    fontWeight: '900',
  },

  malaLabel: {
    color: '#826C57',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 3,
  },

  malaDivider: {
    width: 1,
    height: 39,
    backgroundColor: '#D9C7AA',
  },

  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  controlButton: {
    width: '31%',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2E7D5',
    borderRadius: 13,
  },

  controlText: {
    color: BROWN,
    fontSize: 12,
    fontWeight: '800',
  },

  saveButton: {
    minHeight: 53,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GOLD,
    borderRadius: 16,
    marginTop: 13,
  },

  saveButtonDisabled: {
    opacity: 0.42,
  },

  saveButtonText: {
    color: '#3D2417',
    fontSize: 14,
    fontWeight: '900',
  },

  autoSaveText: {
    color: '#8B7764',
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 8,
  },

  summaryCard: {
    backgroundColor: '#FFF9EF',
    borderWidth: 1,
    borderColor: '#E5D4B9',
    borderRadius: 20,
    padding: 15,
  },

  summaryTopRow: {
    flexDirection: 'row',
  },

  summaryStat: {
    flex: 1,
    alignItems: 'center',
  },

  summaryStatValue: {
    color: BROWN,
    fontSize: 22,
    fontWeight: '900',
  },

  summaryStatLabel: {
    color: '#806B57',
    fontSize: 9,
    lineHeight: 13,
    textAlign: 'center',
    marginTop: 3,
  },

  summaryList: {
    borderTopWidth: 1,
    borderTopColor: '#E8D8BF',
    marginTop: 13,
    paddingTop: 9,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },

  summaryLabel: {
    color: '#715C49',
    fontSize: 11,
  },

  summaryValue: {
    color: BROWN,
    fontSize: 11,
    fontWeight: '800',
  },

  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#FFF9EF',
    borderRadius: 18,
    padding: 25,
  },

  emptyIcon: {
    fontSize: 34,
  },

  emptyText: {
    color: '#806B57',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },

  historyDay: {
    marginBottom: 16,
  },

  historyDate: {
    color: '#8A6A4D',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'capitalize',
    marginBottom: 8,
  },

  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E5D6BE',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },

  historyIconWrap: {
    width: 43,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2E4CF',
    borderRadius: 13,
  },

  historyIcon: {
    fontSize: 22,
  },

  historyInfo: {
    flex: 1,
    marginLeft: 10,
  },

  historyTitle: {
    color: BROWN,
    fontSize: 13,
    fontWeight: '800',
  },

  historyMeta: {
    color: '#806B57',
    fontSize: 10,
    marginTop: 3,
  },

  historyRounds: {
    color: '#A06A25',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },

  deleteButton: {
    paddingHorizontal: 7,
    paddingVertical: 6,
  },

  deleteText: {
    color: colors.danger,
    fontSize: 10,
    fontWeight: '800',
  },

  pressed: {
    opacity: 0.7,
    transform: [{scale: 0.98}],
  },
});
