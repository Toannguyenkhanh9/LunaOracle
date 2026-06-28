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
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import MoodChip
  from '../components/MoodChip';

import {
  LUNA_MOODS,
  getMoodDashboard,
  saveMoodEntry,
  type LunaMood,
  type MoodEntry,
  type MoodPatternInsight,
} from '../services/moodTracker';

export default function MoodTrackerScreen() {
  const {t} =
    useTranslation();

  const [
    mood,
    setMood,
  ] =
    useState<LunaMood>('calm');

  const [
    energy,
    setEnergy,
  ] =
    useState(70);

  const [
    note,
    setNote,
  ] =
    useState('');

  const [
    entries,
    setEntries,
  ] =
    useState<MoodEntry[]>([]);

  const [
    insight,
    setInsight,
  ] =
    useState<MoodPatternInsight | undefined>();

  const load = useCallback(
    async () => {
      const dashboard =
        await getMoodDashboard();

      setEntries(
        dashboard.entries,
      );
      setInsight(
        dashboard.insight,
      );

      if (dashboard.today) {
        setMood(
          dashboard.today.mood,
        );
        setEnergy(
          dashboard.today.energy,
        );
        setNote(
          dashboard.today.note ?? '',
        );
      }
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

  const save = async () => {
    await saveMoodEntry(
      mood,
      energy,
      note,
    );

    await load();

    Alert.alert(
      t(
        'moodTracker.savedTitle',
        {
          defaultValue:
            'Mood saved',
        },
      ),
      t(
        'moodTracker.savedMessage',
        {
          defaultValue:
            'Your mood check-in was saved.',
        },
      ),
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'moodTracker.eyebrow',
            {
              defaultValue:
                'Mood',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'moodTracker.title',
            {
              defaultValue:
                'Mood Tracker',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'moodTracker.subtitle',
            {
              defaultValue:
                'Track your mood and energy to reveal patterns across the week.',
            },
          )}
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {t(
              'moodTracker.today',
              {
                defaultValue:
                  'Today',
              },
            )}
          </Text>

          <View style={styles.moodGrid}>
            {LUNA_MOODS.map(item => (
              <MoodChip
                key={item}
                mood={item}
                active={mood === item}
                onPress={() =>
                  setMood(item)
                }
              />
            ))}
          </View>

          <Text style={styles.energyLabel}>
            {t(
              'moodTracker.energy',
              {
                defaultValue:
                  'Energy',
              },
            )}
            : {energy}
          </Text>

          <View style={styles.energyRow}>
            {[30, 50, 70, 90].map(value => (
              <Pressable
                key={value}
                style={[
                  styles.energyButton,
                  energy === value &&
                    styles.energyButtonActive,
                ]}
                onPress={() =>
                  setEnergy(value)
                }>
                <Text
                  style={[
                    styles.energyButtonText,
                    energy === value &&
                      styles.energyButtonTextActive,
                  ]}>
                  {value}
                </Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder={t(
              'moodTracker.notePlaceholder',
              {
                defaultValue:
                  'Optional note...',
              },
            )}
            placeholderTextColor="#A99DAF"
            multiline
            style={styles.input}
          />

          <Pressable
            style={styles.saveButton}
            onPress={save}>
            <Text style={styles.saveText}>
              {t(
                'moodTracker.save',
                {
                  defaultValue:
                    'Save Mood',
                },
              )}
            </Text>
          </Pressable>
        </View>

        {insight ? (
          <View style={styles.insightCard}>
            <Text style={styles.sectionTitle}>
              {t(
                'moodTracker.patternTitle',
                {
                  defaultValue:
                    '7-day pattern',
                },
              )}
            </Text>

            <View style={styles.statsRow}>
              <Stat
                label={t(
                  'moodTracker.days',
                  {
                    defaultValue:
                      'Days',
                  },
                )}
                value={`${insight.totalDays}`}
              />

              <Stat
                label={t(
                  'moodTracker.avgEnergy',
                  {
                    defaultValue:
                      'Avg',
                  },
                )}
                value={`${insight.averageEnergy}`}
              />

              <Stat
                label={t(
                  'moodTracker.dominant',
                  {
                    defaultValue:
                      'Mood',
                  },
                )}
                value={
                  insight.dominantMood
                    ? t(
                        `moodTracker.moods.${insight.dominantMood}`,
                        {
                          defaultValue:
                            insight.dominantMood,
                        },
                      )
                    : '—'
                }
              />
            </View>

            <Text style={styles.insightText}>
              {t(
                insight.messageKey,
                {
                  defaultValue:
                    insight.messageFallback,
                },
              )}
            </Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>
          {t(
            'moodTracker.history',
            {
              defaultValue:
                'History',
            },
          )}
        </Text>

        {entries.slice(0, 14).map(entry => (
          <View
            key={entry.dateKey}
            style={styles.historyRow}>
            <View>
              <Text style={styles.historyDate}>
                {entry.dateKey}
              </Text>

              <Text style={styles.historyMood}>
                {t(
                  `moodTracker.moods.${entry.mood}`,
                  {
                    defaultValue:
                      entry.mood,
                  },
                )}
              </Text>
            </View>

            <Text style={styles.historyEnergy}>
              {entry.energy}
            </Text>
          </View>
        ))}

        <Text style={styles.notice}>
          {t(
            'moodTracker.notice',
            {
              defaultValue:
                'Mood tracking is for self-awareness and should not replace professional support.',
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

  card: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 15,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 18,
    marginBottom: 12,
  },

  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  energyLabel: {
    color: COLORS.purple,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 14,
  },

  energyRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginTop: 8,
  },

  energyButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#EEE6F4',
    borderRadius: 14,
    paddingVertical: 10,
    marginHorizontal: 4,
  },

  energyButtonActive: {
    backgroundColor: COLORS.night,
  },

  energyButtonText: {
    color: COLORS.purple,
    fontWeight: '900',
  },

  energyButtonTextActive: {
    color: '#F8EBCB',
  },

  input: {
    minHeight: 88,
    backgroundColor: '#F7F2EA',
    borderRadius: 18,
    color: COLORS.text,
    fontSize: 13,
    textAlignVertical: 'top',
    padding: 13,
    marginTop: 12,
  },

  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    backgroundColor: COLORS.gold,
    borderRadius: 17,
    marginTop: 12,
  },

  saveText: {
    color: COLORS.night,
    fontSize: 13,
    fontWeight: '900',
  },

  insightCard: {
    backgroundColor: COLORS.night,
    borderRadius: 24,
    padding: 15,
    marginTop: 14,
  },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },

  stat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 10,
    marginHorizontal: 4,
  },

  statValue: {
    color: '#FFF8EA',
    fontSize: 18,
    fontWeight: '900',
  },

  statLabel: {
    color: '#BEB3DD',
    fontSize: 8.5,
    fontWeight: '900',
    marginTop: 3,
    textTransform: 'uppercase',
  },

  insightText: {
    color: '#DCD2F3',
    fontSize: 12,
    lineHeight: 19,
    fontWeight: '800',
    marginTop: 12,
  },

  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    padding: 13,
    marginBottom: 8,
  },

  historyDate: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },

  historyMood: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
    textTransform: 'capitalize',
  },

  historyEnergy: {
    color: COLORS.purple,
    fontSize: 20,
    fontWeight: '900',
    marginLeft: 'auto',
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 14,
  },
});
