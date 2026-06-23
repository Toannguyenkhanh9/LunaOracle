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
  TextInput,
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

import TarotCardImage
  from '../components/TarotCardImage';

import {
  getDailyRitualSession,
  getDailyRitualStreak,
  saveDailyRitualEntry,
  toggleDailyRitualStep,
  type DailyRitualEntry,
  type DailyRitualMood,
  type DailyRitualStep,
} from '../services/dailyRitual';

import {
  getZodiacSymbol,
} from '../services/astroBirthChart';

type NavigationLike = {
  navigate: (
    routeName: string,
    params?: Record<string, unknown>,
  ) => void;
};

const MOODS:
  DailyRitualMood[] = [
    'calm',
    'hopeful',
    'focused',
    'tired',
    'anxious',
    'grateful',
  ];

const STEPS:
  DailyRitualStep[] = [
    'breathe',
    'readInsight',
    'drawCard',
    'writeNote',
  ];

export default function DailyRitualScreen() {
  const {t} =
    useTranslation();

  const navigation =
    useNavigation<NavigationLike>();

  const [
    entry,
    setEntry,
  ] =
    useState<DailyRitualEntry | undefined>();

  const [
    moonSign,
    setMoonSign,
  ] =
    useState('');

  const [
    profileName,
    setProfileName,
  ] =
    useState('');

  const [
    streak,
    setStreak,
  ] =
    useState(0);

  const [isSaving, setSaving] =
    useState(false);

  const load = useCallback(
    async () => {
      const session =
        await getDailyRitualSession();

      setEntry(session.entry);
      setProfileName(
        session.profile.name,
      );
      setMoonSign(
        session.insight.transitChart.points.moon.sign,
      );
      setStreak(
        await getDailyRitualStreak(),
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

  const save = async (
    nextEntry = entry,
    showAlert = true,
  ) => {
    if (!nextEntry) {
      return;
    }

    setSaving(true);

    try {
      const saved =
        await saveDailyRitualEntry(
          nextEntry,
        );

      setEntry(saved);
      setStreak(
        await getDailyRitualStreak(),
      );

      if (showAlert) {
        Alert.alert(
          t(
            'lunaDailyRitual.savedTitle',
            {
              defaultValue:
                'Saved',
            },
          ),
          t(
            'lunaDailyRitual.savedMessage',
            {
              defaultValue:
                'Your daily ritual was saved.',
            },
          ),
        );
      }
    } catch (error) {
      console.warn(
        'Unable to save daily ritual:',
        error,
      );

      Alert.alert(
        t(
          'lunaDailyRitual.saveErrorTitle',
          {
            defaultValue:
              'Unable to save',
          },
        ),
        t(
          'lunaDailyRitual.saveErrorMessage',
          {
            defaultValue:
              'Please try again.',
          },
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const updateMood = (
    mood: DailyRitualMood,
  ) => {
    if (!entry) {
      return;
    }

    const next = {
      ...entry,
      mood,
    };

    setEntry(next);
    void save(next, false);
  };

  const updateStep = (
    step: DailyRitualStep,
  ) => {
    if (!entry) {
      return;
    }

    const next =
      toggleDailyRitualStep(
        entry,
        step,
      );

    setEntry(next);
    void save(next, false);
  };

  const updateNote = (
    note: string,
  ) => {
    if (!entry) {
      return;
    }

    setEntry({
      ...entry,
      note,
    });
  };

  if (!entry) {
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

  const completedCount =
    entry.completedSteps.length;

  const progress =
    Math.round(
      (
        completedCount /
        STEPS.length
      ) *
        100,
    );

  const tarotMeaning =
    entry.tarotDraw.orientation ===
    'reversed'
      ? entry.tarotDraw.card.reversed
      : entry.tarotDraw.card.upright;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'lunaDailyRitual.eyebrow',
            {
              defaultValue:
                'Daily Ritual',
            },
          )}
        </Text>

        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text style={styles.title}>
              {t(
                'lunaDailyRitual.title',
                {
                  defaultValue:
                    'Today’s Check-in',
                },
              )}
            </Text>

            <Text style={styles.subtitle}>
              {t(
                'lunaDailyRitual.subtitleFor',
                {
                  name:
                    profileName,
                  defaultValue:
                    `For ${profileName}`,
                },
              )}
            </Text>
          </View>

          <Pressable
            style={styles.profileButton}
            onPress={() =>
              navigation.navigate(
                'BirthProfiles',
              )
            }>
            <Text style={styles.profileText}>
              {t(
                'lunaDailyRitual.profile',
                {
                  defaultValue:
                    'Profile',
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
                  'lunaDailyRitual.todayEnergy',
                  {
                    defaultValue:
                      'Today energy',
                  },
                )}
              </Text>

              <Text style={styles.heroTitle}>
                {entry.energyScore}
              </Text>
            </View>

            <View style={styles.streakBox}>
              <Text style={styles.streakNumber}>
                {streak}
              </Text>

              <Text style={styles.streakLabel}>
                {t(
                  'lunaDailyRitual.streak',
                  {
                    defaultValue:
                      'streak',
                  },
                )}
              </Text>
            </View>
          </View>

          <Text style={styles.heroText}>
            {getZodiacSymbol(
              moonSign as never,
            )}{' '}
            {t(
              `western.signs.${moonSign}`,
              {
                defaultValue:
                  moonSign,
              },
            )}
            {' • '}
            {t(
              'lunaDailyRitual.houseFocus',
              {
                number:
                  entry.moonHouse,
                defaultValue:
                  `Moon focus: House ${entry.moonHouse}`,
              },
            )}
          </Text>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width:
                    `${progress}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {t(
              'lunaDailyRitual.progress',
              {
                done:
                  completedCount,
                total:
                  STEPS.length,
                defaultValue:
                  `${completedCount}/${STEPS.length} complete`,
              },
            )}
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'lunaDailyRitual.moodTitle',
              {
                defaultValue:
                  'How do you feel?',
              },
            )}
          </Text>

          <View style={styles.moodGrid}>
            {MOODS.map(mood => {
              const active =
                entry.mood === mood;

              return (
                <Pressable
                  key={mood}
                  style={[
                    styles.moodChip,
                    active &&
                      styles.moodChipActive,
                  ]}
                  onPress={() =>
                    updateMood(mood)
                  }>
                  <Text
                    style={[
                      styles.moodEmoji,
                      active &&
                        styles.moodTextActive,
                    ]}>
                    {t(
                      `lunaDailyRitual.moods.${mood}.emoji`,
                      {
                        defaultValue:
                          '✦',
                      },
                    )}
                  </Text>

                  <Text
                    style={[
                      styles.moodText,
                      active &&
                        styles.moodTextActive,
                    ]}>
                    {t(
                      `lunaDailyRitual.moods.${mood}.label`,
                      {
                        defaultValue:
                          mood,
                      },
                    )}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'lunaDailyRitual.stepsTitle',
              {
                defaultValue:
                  'Ritual steps',
              },
            )}
          </Text>

          {STEPS.map(step => {
            const done =
              entry.completedSteps.includes(
                step,
              );

            return (
              <Pressable
                key={step}
                style={[
                  styles.stepRow,
                  done &&
                    styles.stepRowDone,
                ]}
                onPress={() =>
                  updateStep(step)
                }>
                <View
                  style={[
                    styles.checkCircle,
                    done &&
                      styles.checkCircleDone,
                  ]}>
                  <Text style={styles.checkText}>
                    {done ? '✓' : ''}
                  </Text>
                </View>

                <View style={styles.stepCopy}>
                  <Text style={styles.stepTitle}>
                    {t(
                      `lunaDailyRitual.steps.${step}.title`,
                      {
                        defaultValue:
                          step,
                      },
                    )}
                  </Text>

                  <Text style={styles.stepSubtitle}>
                    {t(
                      `lunaDailyRitual.steps.${step}.subtitle`,
                      {
                        defaultValue:
                          'Complete this ritual step.',
                      },
                    )}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'lunaDailyRitual.cardTitle',
              {
                defaultValue:
                  'Daily card',
              },
            )}
          </Text>

          <View style={styles.cardRow}>
            <TarotCardImage
              cardId={
                entry.tarotDraw.card.id ??
                entry.tarotDraw.card.name
              }
              title={
                entry.tarotDraw.card.name
              }
              roman={
                entry.tarotDraw.card.number
              }
              reversed={
                entry.tarotDraw.orientation ===
                'reversed'
              }
              width={96}
              height={152}
            />

            <View style={styles.cardCopy}>
              <Text style={styles.cardName}>
                {entry.tarotDraw.card.name}
              </Text>

              <Text style={styles.orientation}>
                {t(
                  `western.tarot.orientations.${entry.tarotDraw.orientation}`,
                  {
                    defaultValue:
                      entry.tarotDraw.orientation,
                  },
                )}
              </Text>

              <Text style={styles.meaning}>
                {tarotMeaning}
              </Text>

              <Text style={styles.advice}>
                {t(
                  'western.tarot.advice',
                  {
                    defaultValue:
                      'Advice',
                  },
                )}
                :{' '}
                {entry.tarotDraw.card.advice}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.promptCard}>
          <Text style={styles.promptLabel}>
            {t(
              'lunaDailyRitual.actionTitle',
              {
                defaultValue:
                  'Today action',
              },
            )}
          </Text>

          <Text style={styles.promptText}>
            {t(
              `lunaDailyInsight.actions.${entry.actionId}`,
              {
                defaultValue:
                  'Take one small aligned action before the day gets busy.',
              },
            )}
          </Text>

          <View style={styles.promptDivider} />

          <Text style={styles.promptLabel}>
            {t(
              'lunaDailyRitual.journalPromptTitle',
              {
                defaultValue:
                  'Journal prompt',
              },
            )}
          </Text>

          <Text style={styles.promptText}>
            {t(
              `lunaDailyInsight.prompts.${entry.journalPromptId}`,
              {
                defaultValue:
                  'What pattern am I ready to notice today?',
              },
            )}
          </Text>
        </View>

        <TextInput
          value={entry.note ?? ''}
          onChangeText={updateNote}
          placeholder={t(
            'lunaDailyRitual.notePlaceholder',
            {
              defaultValue:
                'Write a short reflection...',
            },
          )}
          placeholderTextColor="#A99DAF"
          multiline
          style={styles.noteInput}
        />

        <Pressable
          style={styles.saveButton}
          disabled={isSaving}
          onPress={() =>
            save(entry, true)
          }>
          <Text style={styles.saveText}>
            {isSaving
              ? t(
                  'lunaDailyRitual.saving',
                  {
                    defaultValue:
                      'Saving...',
                  },
                )
              : t(
                  'lunaDailyRitual.save',
                  {
                    defaultValue:
                      'Save Check-in',
                  },
                )}
          </Text>
        </Pressable>

        <Text style={styles.notice}>
          {t(
            'lunaDailyRitual.notice',
            {
              defaultValue:
                'Daily ritual is for reflection and self-awareness. It should not replace professional advice.',
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
    fontWeight: '900',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 5,
  },
  profileButton: {
    backgroundColor: COLORS.night,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginLeft: 10,
  },
  profileText: {
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
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#FFF8EA',
    fontSize: 54,
    fontWeight: '900',
    marginTop: 4,
  },
  streakBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 78,
    height: 78,
    backgroundColor: 'rgba(217,183,110,0.14)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 39,
  },
  streakNumber: {
    color: '#F8EBCB',
    fontSize: 25,
    fontWeight: '900',
  },
  streakLabel: {
    color: '#BEB3DD',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  heroText: {
    color: '#E9E4F5',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
    textTransform: 'capitalize',
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 99,
    overflow: 'hidden',
    marginTop: 14,
  },
  progressFill: {
    height: 8,
    backgroundColor: COLORS.gold,
    borderRadius: 99,
  },
  progressText: {
    color: '#DCD2F3',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 7,
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
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  moodChip: {
    width: '33.333%',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  moodChipActive: {},
  moodEmoji: {
    color: COLORS.purple,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    backgroundColor: '#EEE6F4',
    borderRadius: 16,
    paddingTop: 11,
    minHeight: 54,
  },
  moodText: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  moodTextActive: {
    color: COLORS.gold,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F2EA',
    borderRadius: 16,
    padding: 12,
    marginBottom: 9,
  },
  stepRowDone: {
    backgroundColor: '#FFF6DD',
  },
  checkCircle: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    marginRight: 11,
  },
  checkCircleDone: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  checkText: {
    color: COLORS.night,
    fontSize: 16,
    fontWeight: '900',
  },
  stepCopy: {
    flex: 1,
  },
  stepTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },
  stepSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardCopy: {
    flex: 1,
    marginLeft: 14,
  },
  cardName: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '900',
  },
  orientation: {
    color: COLORS.purple,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  meaning: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },
  advice: {
    color: '#4D405E',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    marginTop: 7,
  },
  promptCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 16,
    marginTop: 14,
  },
  promptLabel: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  promptText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '800',
    marginTop: 6,
  },
  promptDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 13,
  },
  noteInput: {
    minHeight: 92,
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    color: COLORS.text,
    fontSize: 13,
    textAlignVertical: 'top',
    padding: 14,
    marginTop: 14,
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    backgroundColor: COLORS.night,
    borderRadius: 18,
    marginTop: 14,
  },
  saveText: {
    color: '#F8EBCB',
    fontSize: 14,
    fontWeight: '900',
  },
  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 15,
  },
});
