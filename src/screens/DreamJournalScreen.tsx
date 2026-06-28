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

import LunaShareButton
  from '../components/LunaShareButton';

import {
  DREAM_MOODS,
  DREAM_SYMBOLS,
  deleteDreamEntry,
  listDreamEntries,
  saveDreamEntry,
  type DreamEntry,
  type DreamMood,
  type DreamSymbol,
} from '../services/dreamJournal';

export default function DreamJournalScreen() {
  const {t} =
    useTranslation();

  const [
    title,
    setTitle,
  ] =
    useState('');

  const [
    dreamText,
    setDreamText,
  ] =
    useState('');

  const [
    mood,
    setMood,
  ] =
    useState<DreamMood>('strange');

  const [
    symbols,
    setSymbols,
  ] =
    useState<DreamSymbol[]>([]);

  const [
    entries,
    setEntries,
  ] =
    useState<DreamEntry[]>([]);

  const load = useCallback(
    async () => {
      setEntries(
        await listDreamEntries(),
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

  const toggleSymbol =
    (symbol: DreamSymbol) => {
      setSymbols(previous =>
        previous.includes(symbol)
          ? previous.filter(
              item => item !== symbol,
            )
          : [...previous, symbol],
      );
    };

  const save = async () => {
    if (!dreamText.trim()) {
      Alert.alert(
        t(
          'dreamJournal.emptyTitle',
          {
            defaultValue:
              'Write your dream first',
          },
        ),
      );
      return;
    }

    await saveDreamEntry({
      title,
      dreamText,
      mood,
      symbols,
    });

    setTitle('');
    setDreamText('');
    setSymbols([]);
    await load();
  };

  const remove =
    (id: string) => {
      Alert.alert(
        t(
          'dreamJournal.deleteTitle',
          {
            defaultValue:
              'Delete dream?',
          },
        ),
        t(
          'dreamJournal.deleteMessage',
          {
            defaultValue:
              'This dream entry will be removed from this device.',
          },
        ),
        [
          {
            text:
              t('common.cancel', {
                defaultValue: 'Cancel',
              }),
            style: 'cancel',
          },
          {
            text:
              t('common.delete', {
                defaultValue: 'Delete',
              }),
            style: 'destructive',
            onPress:
              async () => {
                await deleteDreamEntry(id);
                await load();
              },
          },
        ],
      );
    };

  const latest =
    entries[0];

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'dreamJournal.eyebrow',
            {
              defaultValue:
                'Dreams',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'dreamJournal.title',
            {
              defaultValue:
                'Dream Journal',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'dreamJournal.subtitle',
            {
              defaultValue:
                'Record dreams, symbols, waking mood, and local symbolic interpretations.',
            },
          )}
        </Text>

        <View style={styles.card}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder={t(
              'dreamJournal.titlePlaceholder',
              {
                defaultValue:
                  'Dream title...',
              },
            )}
            placeholderTextColor="#A99DAF"
            style={styles.input}
          />

          <TextInput
            value={dreamText}
            onChangeText={setDreamText}
            placeholder={t(
              'dreamJournal.textPlaceholder',
              {
                defaultValue:
                  'What happened in the dream?',
              },
            )}
            placeholderTextColor="#A99DAF"
            multiline
            style={styles.textArea}
          />

          <Text style={styles.label}>
            {t(
              'dreamJournal.mood',
              {
                defaultValue:
                  'Waking mood',
              },
            )}
          </Text>

          <View style={styles.chipRow}>
            {DREAM_MOODS.map(item => (
              <Pressable
                key={item}
                style={[
                  styles.chip,
                  mood === item &&
                    styles.chipActive,
                ]}
                onPress={() =>
                  setMood(item)
                }>
                <Text
                  style={[
                    styles.chipText,
                    mood === item &&
                      styles.chipTextActive,
                  ]}>
                  {t(
                    `dreamJournal.moods.${item}`,
                    {
                      defaultValue:
                        item,
                    },
                  )}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>
            {t(
              'dreamJournal.symbols',
              {
                defaultValue:
                  'Symbols',
              },
            )}
          </Text>

          <View style={styles.chipRow}>
            {DREAM_SYMBOLS.map(item => (
              <Pressable
                key={item}
                style={[
                  styles.chip,
                  symbols.includes(item) &&
                    styles.chipActive,
                ]}
                onPress={() =>
                  toggleSymbol(item)
                }>
                <Text
                  style={[
                    styles.chipText,
                    symbols.includes(item) &&
                      styles.chipTextActive,
                  ]}>
                  {t(
                    `dreamJournal.symbolNames.${item}`,
                    {
                      defaultValue:
                        item,
                    },
                  )}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={styles.saveButton}
            onPress={save}>
            <Text style={styles.saveText}>
              {t(
                'dreamJournal.save',
                {
                  defaultValue:
                    'Save Dream',
                },
              )}
            </Text>
          </Pressable>
        </View>

        {latest ? (
          <LunaShareButton
            data={{
              variant: 'moon',
              title:
                latest.title,
              subtitle:
                t(
                  'dreamJournal.title',
                  {
                    defaultValue:
                      'Dream Journal',
                  },
                ),
              message:
                latest.interpretation,
              badge: 'DREAM',
              tags: [
                'dream',
                'oracle',
                'luna',
              ],
            }}
          />
        ) : null}

        <Text style={styles.sectionTitle}>
          {t(
            'dreamJournal.entries',
            {
              defaultValue:
                'Entries',
            },
          )}
        </Text>

        {entries.map(entry => (
          <View
            key={entry.id}
            style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryTitle}>
                {entry.title}
              </Text>

              <Pressable
                onPress={() =>
                  remove(entry.id)
                }>
                <Text style={styles.deleteText}>
                  ×
                </Text>
              </Pressable>
            </View>

            <Text style={styles.entryMeta}>
              {new Date(
                entry.createdAt,
              ).toLocaleDateString()}{' '}
              •{' '}
              {t(
                `dreamJournal.moods.${entry.mood}`,
                {
                  defaultValue:
                    entry.mood,
                },
              )}
            </Text>

            <Text style={styles.entryText}>
              {entry.dreamText}
            </Text>

            <Text style={styles.interpretation}>
              {entry.interpretation}
            </Text>
          </View>
        ))}

        <Text style={styles.notice}>
          {t(
            'dreamJournal.notice',
            {
              defaultValue:
                'Dream interpretation is symbolic reflection, not certainty.',
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

  input: {
    minHeight: 48,
    backgroundColor: '#F7F2EA',
    borderRadius: 16,
    color: COLORS.text,
    paddingHorizontal: 13,
  },

  textArea: {
    minHeight: 120,
    backgroundColor: '#F7F2EA',
    borderRadius: 16,
    color: COLORS.text,
    padding: 13,
    textAlignVertical: 'top',
    marginTop: 10,
  },

  label: {
    color: COLORS.purple,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 13,
    marginBottom: 8,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },

  chip: {
    backgroundColor: '#EEE6F4',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: 4,
    marginBottom: 8,
  },

  chipActive: {
    backgroundColor: COLORS.night,
  },

  chipText: {
    color: COLORS.purple,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  chipTextActive: {
    color: '#F8EBCB',
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

  sectionTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 20,
    marginBottom: 12,
  },

  entryCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 14,
    marginBottom: 10,
  },

  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  entryTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
  },

  deleteText: {
    color: COLORS.muted,
    fontSize: 24,
    fontWeight: '900',
    marginLeft: 10,
  },

  entryMeta: {
    color: COLORS.purple,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 4,
    textTransform: 'capitalize',
  },

  entryText: {
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },

  interpretation: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    marginTop: 9,
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 14,
  },
});
