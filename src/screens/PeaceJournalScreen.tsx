import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {
  addPeaceJournalEntry,
  deletePeaceJournalEntry,
  getPeaceJournalEntries,
  type PeaceJournalEntry,
  type PeaceMood,
} from '../services/peaceJournal';
import {recordPracticeActivity} from '../services/practice';
import {colors} from '../theme/colors';

const MOODS: Array<{
  id: PeaceMood;
  icon: string;
}> = [
  {
    id: 'peaceful',
    icon: '😌',
  },
  {
    id: 'grateful',
    icon: '🥰',
  },
  {
    id: 'neutral',
    icon: '🙂',
  },
  {
    id: 'worried',
    icon: '😟',
  },
  {
    id: 'sad',
    icon: '😔',
  },
];

function formatEntryDate(
  value: string,
  language: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  try {
    return new Intl.DateTimeFormat(
      language,
      {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    ).format(date);
  } catch {
    return date.toLocaleString();
  }
}

type MoodPickerProps = {
  title: string;
  value: PeaceMood;
  onChange: (value: PeaceMood) => void;
  t: ReturnType<
    typeof useTranslation
  >['t'];
};

function MoodPicker({
  title,
  value,
  onChange,
  t,
}: MoodPickerProps) {
  return (
    <View style={styles.moodSection}>
      <Text style={styles.fieldLabel}>
        {title}
      </Text>

      <View style={styles.moodRow}>
        {MOODS.map(mood => {
          const selected =
            mood.id === value;

          return (
            <Pressable
              key={mood.id}
              style={[
                styles.moodButton,
                selected &&
                  styles.moodButtonSelected,
              ]}
              onPress={() =>
                onChange(mood.id)
              }>
              <Text style={styles.moodIcon}>
                {mood.icon}
              </Text>
              <Text
                style={[
                  styles.moodLabel,
                  selected &&
                    styles.moodLabelSelected,
                ]}>
                {t(
                  `peaceJournal.moods.${mood.id}`,
                )}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function PeaceJournalScreen() {
  const {t, i18n} = useTranslation();

  const [beforeMood, setBeforeMood] =
    useState<PeaceMood>('neutral');
  const [afterMood, setAfterMood] =
    useState<PeaceMood>('peaceful');
  const [gratitude, setGratitude] =
    useState('');
  const [release, setRelease] =
    useState('');
  const [prayer, setPrayer] =
    useState('');
  const [note, setNote] = useState('');
  const [entries, setEntries] =
    useState<PeaceJournalEntry[]>([]);
  const [isSaving, setIsSaving] =
    useState(false);

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const loadEntries = useCallback(() => {
    getPeaceJournalEntries().then(
      setEntries,
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries]),
  );

  const canSave = useMemo(
    () =>
      Boolean(
        gratitude.trim() ||
          release.trim() ||
          prayer.trim() ||
          note.trim(),
      ),
    [
      gratitude,
      note,
      prayer,
      release,
    ],
  );

  const resetForm = () => {
    setBeforeMood('neutral');
    setAfterMood('peaceful');
    setGratitude('');
    setRelease('');
    setPrayer('');
    setNote('');
  };

  const handleSave = async () => {
    if (!canSave || isSaving) {
      Alert.alert(
        t('peaceJournal.requiredTitle'),
        t('peaceJournal.requiredMessage'),
      );

      return;
    }

    setIsSaving(true);

    try {
      const updated =
        await addPeaceJournalEntry({
          beforeMood,
          afterMood,
          gratitude: gratitude.trim(),
          release: release.trim(),
          prayer: prayer.trim(),
          note: note.trim(),
        });

      setEntries(updated);
      resetForm();

      if (gratitude.trim()) {
        recordPracticeActivity(
          'gratitude',
        ).catch(error => {
          console.warn(
            'Unable to record gratitude practice:',
            error,
          );
        });
      }

      Alert.alert(
        t('peaceJournal.savedTitle'),
        t('peaceJournal.savedMessage'),
      );
    } catch (error) {
      console.warn(
        'Unable to save peace journal:',
        error,
      );

      Alert.alert(
        t('peaceJournal.saveErrorTitle'),
        t('peaceJournal.saveErrorMessage'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = (
    entry: PeaceJournalEntry,
  ) => {
    Alert.alert(
      t('peaceJournal.deleteTitle'),
      t('peaceJournal.deleteMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            const updated =
              await deletePeaceJournalEntry(
                entry.id,
              );

            setEntries(updated);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }>
        <ScrollView
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }>
          <View style={styles.hero}>
            <Text style={styles.heroIcon}>
              🪷
            </Text>
            <Text style={styles.title}>
              {t('peaceJournal.title')}
            </Text>
            <Text style={styles.subtitle}>
              {t('peaceJournal.subtitle')}
            </Text>
          </View>

          <View style={styles.formCard}>
            <MoodPicker
              title={t(
                'peaceJournal.beforeMood',
              )}
              value={beforeMood}
              onChange={setBeforeMood}
              t={t}
            />

            <Text style={styles.fieldLabel}>
              {t(
                'peaceJournal.gratitudeLabel',
              )}
            </Text>
            <TextInput
              value={gratitude}
              onChangeText={setGratitude}
              placeholder={t(
                'peaceJournal.gratitudePlaceholder',
              )}
              placeholderTextColor="#9B8978"
              multiline
              maxLength={500}
              style={styles.input}
              textAlignVertical="top"
            />

            <Text style={styles.fieldLabel}>
              {t(
                'peaceJournal.releaseLabel',
              )}
            </Text>
            <TextInput
              value={release}
              onChangeText={setRelease}
              placeholder={t(
                'peaceJournal.releasePlaceholder',
              )}
              placeholderTextColor="#9B8978"
              multiline
              maxLength={500}
              style={styles.input}
              textAlignVertical="top"
            />

            <Text style={styles.fieldLabel}>
              {t(
                'peaceJournal.prayerLabel',
              )}
            </Text>
            <TextInput
              value={prayer}
              onChangeText={setPrayer}
              placeholder={t(
                'peaceJournal.prayerPlaceholder',
              )}
              placeholderTextColor="#9B8978"
              multiline
              maxLength={500}
              style={styles.input}
              textAlignVertical="top"
            />

            <Text style={styles.fieldLabel}>
              {t(
                'peaceJournal.noteLabel',
              )}
            </Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder={t(
                'peaceJournal.notePlaceholder',
              )}
              placeholderTextColor="#9B8978"
              multiline
              maxLength={1000}
              style={[
                styles.input,
                styles.largeInput,
              ]}
              textAlignVertical="top"
            />

            <MoodPicker
              title={t(
                'peaceJournal.afterMood',
              )}
              value={afterMood}
              onChange={setAfterMood}
              t={t}
            />

            <Pressable
              disabled={isSaving}
              style={({pressed}) => [
                styles.saveButton,
                (!canSave || isSaving) &&
                  styles.saveButtonDisabled,
                pressed && styles.pressed,
              ]}
              onPress={handleSave}>
              <Text
                style={styles.saveButtonText}>
                {isSaving
                  ? t('peaceJournal.saving')
                  : t('peaceJournal.save')}
              </Text>
            </Pressable>

            <Text style={styles.privacyText}>
              🔒{' '}
              {t('peaceJournal.privacy')}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            {t('peaceJournal.history')}
          </Text>

          {entries.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>
                📖
              </Text>
              <Text style={styles.emptyText}>
                {t('peaceJournal.empty')}
              </Text>
            </View>
          ) : (
            entries.map(entry => {
              const before = MOODS.find(
                mood =>
                  mood.id ===
                  entry.beforeMood,
              );

              const after = MOODS.find(
                mood =>
                  mood.id ===
                  entry.afterMood,
              );

              return (
                <View
                  key={entry.id}
                  style={styles.entryCard}>
                  <View
                    style={styles.entryHeader}>
                    <Text
                      style={styles.entryDate}>
                      {formatEntryDate(
                        entry.createdAt,
                        language,
                      )}
                    </Text>

                    <Text
                      style={styles.moodChange}>
                      {before?.icon ?? '🙂'} →{' '}
                      {after?.icon ?? '😌'}
                    </Text>
                  </View>

                  {!!entry.gratitude && (
                    <View
                      style={styles.entryBlock}>
                      <Text
                        style={
                          styles.entryBlockTitle
                        }>
                        {t(
                          'peaceJournal.gratitudeLabel',
                        )}
                      </Text>
                      <Text
                        style={
                          styles.entryBlockText
                        }>
                        {entry.gratitude}
                      </Text>
                    </View>
                  )}

                  {!!entry.release && (
                    <View
                      style={styles.entryBlock}>
                      <Text
                        style={
                          styles.entryBlockTitle
                        }>
                        {t(
                          'peaceJournal.releaseLabel',
                        )}
                      </Text>
                      <Text
                        style={
                          styles.entryBlockText
                        }>
                        {entry.release}
                      </Text>
                    </View>
                  )}

                  {!!entry.prayer && (
                    <View
                      style={styles.entryBlock}>
                      <Text
                        style={
                          styles.entryBlockTitle
                        }>
                        {t(
                          'peaceJournal.prayerLabel',
                        )}
                      </Text>
                      <Text
                        style={
                          styles.entryBlockText
                        }>
                        {entry.prayer}
                      </Text>
                    </View>
                  )}

                  {!!entry.note && (
                    <View
                      style={styles.entryBlock}>
                      <Text
                        style={
                          styles.entryBlockTitle
                        }>
                        {t(
                          'peaceJournal.noteLabel',
                        )}
                      </Text>
                      <Text
                        style={
                          styles.entryBlockText
                        }>
                        {entry.note}
                      </Text>
                    </View>
                  )}

                  <Pressable
                    hitSlop={8}
                    style={styles.deleteButton}
                    onPress={() =>
                      confirmDelete(entry)
                    }>
                    <Text
                      style={styles.deleteText}>
                      {t('common.delete')}
                    </Text>
                  </Pressable>
                </View>
              );
            })
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const BROWN = '#4A2A1A';
const GOLD = '#D3A24A';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
    marginTop: 6,
  },
  subtitle: {
    color: '#775F4B',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
  formCard: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E7D8BE',
    borderRadius: 22,
    padding: 17,
    marginTop: 16,
  },
  moodSection: {
    marginBottom: 16,
  },
  fieldLabel: {
    color: BROWN,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 4,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    width: '18.5%',
    alignItems: 'center',
    backgroundColor: '#F2E8D8',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 13,
    paddingVertical: 8,
  },
  moodButtonSelected: {
    backgroundColor: '#FFF0C8',
    borderColor: GOLD,
  },
  moodIcon: {
    fontSize: 25,
  },
  moodLabel: {
    color: '#826B57',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 4,
  },
  moodLabelSelected: {
    color: BROWN,
    fontWeight: '800',
  },
  input: {
    minHeight: 78,
    color: BROWN,
    fontSize: 14,
    lineHeight: 21,
    backgroundColor: '#F7F0E5',
    borderWidth: 1,
    borderColor: '#E5D6C0',
    borderRadius: 15,
    padding: 13,
    marginBottom: 14,
  },
  largeInput: {
    minHeight: 110,
  },
  saveButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BROWN,
    borderRadius: 16,
    marginTop: 4,
  },
  saveButtonDisabled: {
    opacity: 0.45,
  },
  saveButtonText: {
    color: '#FFE6A9',
    fontSize: 15,
    fontWeight: '800',
  },
  privacyText: {
    color: '#8A7561',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 11,
  },
  sectionTitle: {
    color: BROWN,
    fontSize: 21,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 12,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#FFF9EF',
    borderRadius: 20,
    padding: 28,
  },
  emptyIcon: {
    fontSize: 38,
  },
  emptyText: {
    color: '#826B57',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 9,
  },
  entryCard: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E7D8BE',
    borderRadius: 19,
    padding: 16,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryDate: {
    flex: 1,
    color: '#8A7561',
    fontSize: 11,
  },
  moodChange: {
    fontSize: 18,
  },
  entryBlock: {
    marginTop: 12,
  },
  entryBlockTitle: {
    color: BROWN,
    fontSize: 12,
    fontWeight: '800',
  },
  entryBlockText: {
    color: '#685443',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 5,
    paddingVertical: 7,
    marginTop: 7,
  },
  deleteText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.7,
    transform: [{scale: 0.99}],
  },
});
