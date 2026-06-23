import React, {
  useCallback,
  useMemo,
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

import TarotCardImage
  from '../components/TarotCardImage';

import {
  buildTarotJournalStats,
  deleteAdvancedTarotJournalEntry,
  filterAdvancedTarotJournalEntries,
  listAdvancedTarotJournalEntries,
  TAROT_JOURNAL_TAGS,
  toggleTarotJournalFavorite,
  type AdvancedTarotJournalEntry,
  type TarotJournalTag,
} from '../services/tarotJournalAdvanced';

type FilterTag =
  | 'all'
  | TarotJournalTag;

export default function AdvancedTarotJournalScreen() {
  const {t} =
    useTranslation();

  const [
    entries,
    setEntries,
  ] =
    useState<AdvancedTarotJournalEntry[]>([]);

  const [
    query,
    setQuery,
  ] =
    useState('');

  const [
    activeTag,
    setActiveTag,
  ] =
    useState<FilterTag>('all');

  const [
    favoriteOnly,
    setFavoriteOnly,
  ] =
    useState(false);

  const load = useCallback(
    async () => {
      setEntries(
        await listAdvancedTarotJournalEntries(),
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

  const stats =
    useMemo(
      () =>
        buildTarotJournalStats(
          entries,
        ),
      [entries],
    );

  const filtered =
    useMemo(
      () =>
        filterAdvancedTarotJournalEntries(
          entries,
          {
            query,
            tag:
              activeTag,
            favoriteOnly,
          },
        ),
      [
        entries,
        query,
        activeTag,
        favoriteOnly,
      ],
    );

  const toggleFavorite = async (
    entryId: string,
  ) => {
    await toggleTarotJournalFavorite(
      entryId,
    );
    await load();
  };

  const removeEntry = (
    entryId: string,
  ) => {
    Alert.alert(
      t(
        'lunaTarotJournal.deleteTitle',
        {
          defaultValue:
            'Delete reading?',
        },
      ),
      t(
        'lunaTarotJournal.deleteMessage',
        {
          defaultValue:
            'This journal entry will be removed from this device.',
        },
      ),
      [
        {
          text:
            t(
              'common.cancel',
              {
                defaultValue:
                  'Cancel',
              },
            ),
          style:
            'cancel',
        },
        {
          text:
            t(
              'common.delete',
              {
                defaultValue:
                  'Delete',
              },
            ),
          style:
            'destructive',
          onPress:
            async () => {
              await deleteAdvancedTarotJournalEntry(
                entryId,
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
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'lunaTarotJournal.eyebrow',
            {
              defaultValue:
                'Tarot Journal',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'lunaTarotJournal.title',
            {
              defaultValue:
                'Advanced Tarot Journal',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'lunaTarotJournal.subtitle',
            {
              defaultValue:
                'Track readings, favorite important pulls, search notes, and discover repeated card themes.',
            },
          )}
        </Text>

        <View style={styles.statsRow}>
          <StatPill
            label={t(
              'lunaTarotJournal.stats.total',
              {
                defaultValue:
                  'Readings',
              },
            )}
            value={stats.totalReadings}
          />

          <StatPill
            label={t(
              'lunaTarotJournal.stats.favorites',
              {
                defaultValue:
                  'Favorites',
              },
            )}
            value={stats.favoriteCount}
          />

          <StatPill
            label={t(
              'lunaTarotJournal.stats.notes',
              {
                defaultValue:
                  'Notes',
              },
            )}
            value={stats.noteCount}
          />
        </View>

        {stats.mostDrawnCards.length > 0 ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              {t(
                'lunaTarotJournal.mostDrawn',
                {
                  defaultValue:
                    'Most drawn cards',
                },
              )}
            </Text>

            {stats.mostDrawnCards.map(
              card => (
                <View
                  key={card.cardId}
                  style={styles.cardStatRow}>
                  <Text style={styles.cardStatName}>
                    {card.cardName}
                  </Text>

                  <Text style={styles.cardStatCount}>
                    ×{card.count}
                  </Text>
                </View>
              ),
            )}
          </View>
        ) : null}

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t(
            'lunaTarotJournal.searchPlaceholder',
            {
              defaultValue:
                'Search by card, question, note, or tag...',
            },
          )}
          placeholderTextColor="#A99DAF"
          style={styles.searchInput}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagRow}>
          <FilterChip
            label={t(
              'lunaTarotJournal.all',
              {
                defaultValue:
                  'All',
              },
            )}
            active={activeTag === 'all'}
            onPress={() =>
              setActiveTag('all')
            }
          />

          {TAROT_JOURNAL_TAGS.map(
            tag => (
              <FilterChip
                key={tag}
                label={t(
                  `lunaTarotJournal.tags.${tag}`,
                  {
                    defaultValue:
                      tag,
                  },
                )}
                active={activeTag === tag}
                onPress={() =>
                  setActiveTag(tag)
                }
              />
            ),
          )}

          <FilterChip
            label={t(
              'lunaTarotJournal.favoritesOnly',
              {
                defaultValue:
                  'Favorites',
              },
            )}
            active={favoriteOnly}
            onPress={() =>
              setFavoriteOnly(
                value => !value,
              )
            }
          />
        </ScrollView>

        {filtered.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              {t(
                'lunaTarotJournal.emptyTitle',
                {
                  defaultValue:
                    'No readings yet',
                },
              )}
            </Text>

            <Text style={styles.emptyText}>
              {t(
                'lunaTarotJournal.emptyText',
                {
                  defaultValue:
                    'Save a tarot reading first, then return here to review patterns.',
                },
              )}
            </Text>
          </View>
        ) : (
          filtered.map(entry => (
            <JournalCard
              key={entry.id}
              entry={entry}
              onToggleFavorite={() =>
                toggleFavorite(
                  entry.id,
                )
              }
              onDelete={() =>
                removeEntry(
                  entry.id,
                )
              }
            />
          ))
        )}

        <Text style={styles.notice}>
          {t(
            'lunaTarotJournal.notice',
            {
              defaultValue:
                'Journal entries are stored locally on this device.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatPill({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.filterChip,
        active &&
          styles.filterChipActive,
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.filterText,
          active &&
            styles.filterTextActive,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

function JournalCard({
  entry,
  onToggleFavorite,
  onDelete,
}: {
  entry: AdvancedTarotJournalEntry;
  onToggleFavorite: () => void;
  onDelete: () => void;
}) {
  const {t} =
    useTranslation();

  const firstDraw =
    entry.cards[0];

  const date =
    new Date(
      entry.createdAt,
    ).toLocaleDateString();

  return (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <View style={styles.entryTitleWrap}>
          <Text style={styles.entryTitle}>
            {entry.title}
          </Text>

          <Text style={styles.entryMeta}>
            {date} • {entry.spread}
          </Text>
        </View>

        <Pressable
          style={styles.favoriteButton}
          onPress={onToggleFavorite}>
          <Text style={styles.favoriteText}>
            {entry.favorite
              ? '★'
              : '☆'}
          </Text>
        </Pressable>
      </View>

      {entry.question ? (
        <Text style={styles.question}>
          “{entry.question}”
        </Text>
      ) : null}

      {firstDraw ? (
        <View style={styles.drawRow}>
          <TarotCardImage
            cardId={
              firstDraw.card.id ??
              firstDraw.card.name
            }
            title={firstDraw.card.name}
            roman={firstDraw.card.number}
            reversed={
              firstDraw.orientation ===
              'reversed'
            }
            width={64}
            height={102}
          />

          <View style={styles.drawCopy}>
            <Text style={styles.drawTitle}>
              {firstDraw.card.name}
            </Text>

            <Text style={styles.drawMeta}>
              {t(
                `western.tarot.orientations.${firstDraw.orientation}`,
                {
                  defaultValue:
                    firstDraw.orientation,
                },
              )}
            </Text>

            <Text style={styles.drawText}>
              {firstDraw.orientation ===
              'reversed'
                ? firstDraw.card.reversed
                : firstDraw.card.upright}
            </Text>
          </View>
        </View>
      ) : null}

      {entry.note ? (
        <Text style={styles.note}>
          {entry.note}
        </Text>
      ) : null}

      <View style={styles.entryFooter}>
        <View style={styles.tagWrap}>
          {(entry.tags ?? []).slice(
            0,
            4,
          ).map(tag => (
            <View
              key={tag}
              style={styles.tag}>
              <Text style={styles.tagText}>
                {tag}
              </Text>
            </View>
          ))}
        </View>

        <Pressable
          style={styles.deleteButton}
          onPress={onDelete}>
          <Text style={styles.deleteText}>
            {t(
              'common.delete',
              {
                defaultValue:
                  'Delete',
              },
            )}
          </Text>
        </Pressable>
      </View>
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
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginTop: 16,
  },
  statPill: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 12,
    marginHorizontal: 4,
  },
  statValue: {
    color: COLORS.purple,
    fontSize: 23,
    fontWeight: '900',
  },
  statLabel: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 3,
  },
  sectionCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 14,
    marginTop: 14,
  },
  sectionTitle: {
    color: COLORS.purple,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 8,
  },
  cardStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F7F2EA',
    borderRadius: 14,
    padding: 10,
    marginTop: 7,
  },
  cardStatName: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
  },
  cardStatCount: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '900',
  },
  searchInput: {
    minHeight: 48,
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    color: COLORS.text,
    fontSize: 13,
    paddingHorizontal: 14,
    marginTop: 14,
  },
  tagRow: {
    paddingTop: 12,
    paddingBottom: 2,
  },
  filterChip: {
    backgroundColor: '#EEE6F4',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 7,
  },
  filterChipActive: {
    backgroundColor: COLORS.night,
  },
  filterText: {
    color: '#4D405E',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
  filterTextActive: {
    color: '#F8EBCB',
  },
  emptyCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 18,
    marginTop: 14,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  entryCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 14,
    marginTop: 13,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  entryTitleWrap: {
    flex: 1,
  },
  entryTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
  },
  entryMeta: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  favoriteButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE6F4',
    borderRadius: 19,
    marginLeft: 8,
  },
  favoriteText: {
    color: COLORS.gold,
    fontSize: 20,
    fontWeight: '900',
  },
  question: {
    color: COLORS.purple,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    marginTop: 10,
  },
  drawRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  drawCopy: {
    flex: 1,
    marginLeft: 12,
  },
  drawTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
  },
  drawMeta: {
    color: COLORS.purple,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 3,
    textTransform: 'capitalize',
  },
  drawText: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },
  note: {
    color: '#4D405E',
    fontSize: 12,
    lineHeight: 18,
    backgroundColor: '#F7F2EA',
    borderRadius: 14,
    padding: 10,
    marginTop: 12,
  },
  entryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 11,
  },
  tagWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#EEE6F4',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    color: COLORS.purple,
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  deleteText: {
    color: '#A74372',
    fontSize: 10,
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
