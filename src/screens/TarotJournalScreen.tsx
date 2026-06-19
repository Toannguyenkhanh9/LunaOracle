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
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import {
  deleteTarotJournalEntry,
  listTarotJournalEntries,
  type TarotJournalEntry,
} from '../services/tarotJournal';

export default function TarotJournalScreen() {
  const {t} =
    useTranslation();

  const [entries, setEntries] =
    useState<TarotJournalEntry[]>([]);

  const [loading, setLoading] =
    useState(false);

  const load = useCallback(
    async () => {
      setLoading(true);

      try {
        setEntries(
          await listTarotJournalEntries(),
        );
      } catch (error) {
        console.warn(
          'Unable to load tarot journal:',
          error,
        );
      } finally {
        setLoading(false);
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

  const confirmDelete = (
    entry: TarotJournalEntry,
  ) => {
    Alert.alert(
      t(
        'luna.tarotJournal.deleteTitle',
        {
          defaultValue:
            'Delete reading?',
        },
      ),
      t(
        'luna.tarotJournal.deleteMessage',
        {
          defaultValue:
            'This saved tarot reading will be removed from your journal.',
        },
      ),
      [
        {
          text: t(
            'common.cancel',
            {
              defaultValue:
                'Cancel',
            },
          ),
          style: 'cancel',
        },
        {
          text: t(
            'luna.tarotJournal.delete',
            {
              defaultValue:
                'Delete',
            },
          ),
          style: 'destructive',
          onPress: async () => {
            await deleteTarotJournalEntry(
              entry.id,
            );

            await load();
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
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'luna.tarotJournal.eyebrow',
            {
              defaultValue:
                'Tarot',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'luna.tarotJournal.title',
            {
              defaultValue:
                'Tarot Journal',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'luna.tarotJournal.subtitle',
            {
              defaultValue:
                'Save meaningful card pulls and review your patterns over time.',
            },
          )}
        </Text>

        {entries.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              ✦
            </Text>

            <Text style={styles.emptyTitle}>
              {loading
                ? t(
                    'common.loading',
                    {
                      defaultValue:
                        'Loading...',
                    },
                  )
                : t(
                    'luna.tarotJournal.empty',
                    {
                      defaultValue:
                        'No saved readings yet',
                    },
                  )}
            </Text>

            <Text style={styles.emptyText}>
              {t(
                'luna.tarotJournal.emptyHint',
                {
                  defaultValue:
                    'Open Tarot Reading, draw cards, and tap Save Reading.',
                },
              )}
            </Text>
          </View>
        )}

        {entries.map(entry => (
          <View
            key={entry.id}
            style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <View style={styles.entryHeaderCopy}>
                <Text style={styles.entryTitle}>
                  {entry.title}
                </Text>

                <Text style={styles.entryDate}>
                  {new Date(
                    entry.createdAt,
                  ).toLocaleString()}
                </Text>
              </View>

              <Pressable
                style={styles.deleteButton}
                onPress={() =>
                  confirmDelete(entry)
                }>
                <Text style={styles.deleteText}>
                  ×
                </Text>
              </Pressable>
            </View>

            {entry.question ? (
              <Text style={styles.question}>
                “{entry.question}”
              </Text>
            ) : null}

            {entry.cards.map(draw => (
              <View
                key={`${entry.id}-${draw.position}-${draw.card.id}`}
                style={styles.cardRow}>
                <Text style={styles.cardPosition}>
                  {draw.position}
                </Text>

                <Text style={styles.cardName}>
                  {draw.card.name}
                </Text>

                <Text style={styles.cardOrientation}>
                  {t(
                    `western.tarot.orientations.${draw.orientation}`,
                    {
                      defaultValue:
                        draw.orientation,
                    },
                  )}
                </Text>
              </View>
            ))}

            {entry.note ? (
              <Text style={styles.note}>
                {entry.note}
              </Text>
            ) : null}
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
    fontSize: 28,
    fontWeight: '900',
    marginTop: 5,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 14,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 24,
    marginTop: 10,
  },
  emptyIcon: {
    color: COLORS.purple,
    fontSize: 44,
    fontWeight: '900',
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 10,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 7,
  },
  entryCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 15,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryHeaderCopy: {
    flex: 1,
  },
  entryTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
  },
  entryDate: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  deleteButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6EFE7',
    borderRadius: 17,
  },
  deleteText: {
    color: COLORS.purple,
    fontSize: 24,
    fontWeight: '800',
    marginTop: -2,
  },
  question: {
    color: COLORS.purple,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    marginTop: 10,
  },
  cardRow: {
    backgroundColor: '#F7F2EA',
    borderRadius: 14,
    padding: 11,
    marginTop: 9,
  },
  cardPosition: {
    color: '#9A7939',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  cardName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 3,
  },
  cardOrientation: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  note: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 10,
  },
});
