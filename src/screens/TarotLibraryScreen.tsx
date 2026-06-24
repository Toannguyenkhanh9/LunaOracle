import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
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

import LunaShareButton
  from '../components/LunaShareButton';

import {
  buildTarotCollectionStats,
  listTarotCollection,
  toggleTarotCollectionFavorite,
  type TarotCollectionEntry,
  type TarotCollectionStats,
} from '../services/tarotCollection';

type Filter =
  | 'all'
  | 'discovered'
  | 'locked'
  | 'favorites';

export default function TarotLibraryScreen() {
  const {t} =
    useTranslation();

  const [
    entries,
    setEntries,
  ] =
    useState<TarotCollectionEntry[]>([]);

  const [
    stats,
    setStats,
  ] =
    useState<TarotCollectionStats | undefined>();

  const [
    filter,
    setFilter,
  ] =
    useState<Filter>('all');

  const [
    search,
    setSearch,
  ] =
    useState('');

  const load = useCallback(
    async () => {
      const [
        nextEntries,
        nextStats,
      ] =
        await Promise.all([
          listTarotCollection(),
          buildTarotCollectionStats(),
        ]);

      setEntries(nextEntries);
      setStats(nextStats);
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

  const filtered =
    useMemo(
      () =>
        entries.filter(entry => {
          const term =
            search
              .trim()
              .toLowerCase();

          const matchSearch =
            !term ||
            entry.name
              .toLowerCase()
              .includes(term) ||
            entry.id
              .toLowerCase()
              .includes(term);

          const matchFilter =
            filter === 'all'
              ? true
              : filter === 'discovered'
                ? entry.discovered
                : filter === 'locked'
                  ? !entry.discovered
                  : !!entry.favorite;

          return (
            matchSearch &&
            matchFilter
          );
        }),
      [
        entries,
        filter,
        search,
      ],
    );

  const toggleFavorite =
    async (
      entry: TarotCollectionEntry,
    ) => {
      await toggleTarotCollectionFavorite(
        entry.id,
      );
      await load();
    };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'tarotLibrary.eyebrow',
            {
              defaultValue:
                'Collection',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'tarotLibrary.title',
            {
              defaultValue:
                'Tarot Library',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'tarotLibrary.subtitle',
            {
              defaultValue:
                'Discover cards as you draw them and build your personal tarot collection.',
            },
          )}
        </Text>

        <View style={styles.heroCard}>
          <View>
            <Text style={styles.heroLabel}>
              {t(
                'tarotLibrary.completion',
                {
                  defaultValue:
                    'Completion',
                },
              )}
            </Text>

            <Text style={styles.heroScore}>
              {stats?.completionRate ?? 0}%
            </Text>
          </View>

          <View style={styles.heroStats}>
            <Stat
              label={t(
                'tarotLibrary.discovered',
                {
                  defaultValue:
                    'Discovered',
                },
              )}
              value={`${stats?.discovered ?? 0}/${stats?.total ?? 0}`}
            />

            <Stat
              label={t(
                'tarotLibrary.draws',
                {
                  defaultValue:
                    'Draws',
                },
              )}
              value={`${stats?.totalDraws ?? 0}`}
            />
          </View>
        </View>

        {stats?.mostDrawn ? (
          <View style={styles.featuredCard}>
            <Text style={styles.sectionTitle}>
              {t(
                'tarotLibrary.mostDrawn',
                {
                  defaultValue:
                    'Most drawn',
                },
              )}
            </Text>

            <View style={styles.featuredRow}>
              <TarotCardImage
                cardId={stats.mostDrawn.id}
                title={stats.mostDrawn.name}
                width={78}
                height={124}
              />

              <View style={styles.featuredText}>
                <Text style={styles.featuredTitle}>
                  {stats.mostDrawn.name}
                </Text>

                <Text style={styles.featuredSubtitle}>
                  {t(
                    'tarotLibrary.drawCount',
                    {
                      count:
                        stats.mostDrawn.drawCount,
                      defaultValue:
                        `${stats.mostDrawn.drawCount} draws`,
                    },
                  )}
                </Text>

                <LunaShareButton
                  compact
                  data={{
                    variant: 'tarot',
                    title:
                      stats.mostDrawn.name,
                    subtitle:
                      t(
                        'tarotLibrary.mostDrawn',
                        {
                          defaultValue:
                            'Most drawn',
                        },
                      ),
                    message:
                      t(
                        'tarotLibrary.shareMessage',
                        {
                          name:
                            stats.mostDrawn.name,
                          defaultValue:
                            `${stats.mostDrawn.name} is my most drawn Luna Oracle card.`,
                        },
                      ),
                    cardId:
                      stats.mostDrawn.id,
                    cardName:
                      stats.mostDrawn.name,
                    badge: 'LIBRARY',
                    tags: [
                      'tarot',
                      'collection',
                      'luna',
                    ],
                  }}
                />
              </View>
            </View>
          </View>
        ) : null}

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t(
            'tarotLibrary.search',
            {
              defaultValue:
                'Search cards...',
            },
          )}
          placeholderTextColor="#A99DAF"
          style={styles.searchInput}
        />

        <View style={styles.filterRow}>
          {(
            [
              'all',
              'discovered',
              'locked',
              'favorites',
            ] as Filter[]
          ).map(item => (
            <Pressable
              key={item}
              style={[
                styles.filterChip,
                filter === item &&
                  styles.filterChipActive,
              ]}
              onPress={() =>
                setFilter(item)
              }>
              <Text
                style={[
                  styles.filterText,
                  filter === item &&
                    styles.filterTextActive,
                ]}>
                {t(
                  `tarotLibrary.filters.${item}`,
                  {
                    defaultValue:
                      item,
                  },
                )}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.grid}>
          {filtered.map(entry => (
            <Pressable
              key={entry.id}
              style={[
                styles.cardItem,
                !entry.discovered &&
                  styles.cardLocked,
              ]}
              onPress={() =>
                entry.discovered
                  ? toggleFavorite(entry)
                  : undefined
              }>
              {entry.discovered ? (
                <TarotCardImage
                  cardId={entry.id}
                  title={entry.name}
                  width={82}
                  height={130}
                />
              ) : (
                <View style={styles.lockedBack}>
                  <Text style={styles.lockedMoon}>
                    ☾
                  </Text>
                </View>
              )}

              <Text
                numberOfLines={2}
                style={styles.cardName}>
                {entry.discovered
                  ? entry.name
                  : t(
                      'tarotLibrary.locked',
                      {
                        defaultValue:
                          'Undiscovered',
                      },
                    )}
              </Text>

              {entry.discovered ? (
                <Text style={styles.cardMeta}>
                  {entry.favorite
                    ? '★ '
                    : ''}
                  {entry.drawCount}
                </Text>
              ) : null}
            </Pressable>
          ))}
        </View>
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
    <View style={styles.statBox}>
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
    fontWeight: '900',
    marginTop: 5,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },

  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.night,
    borderRadius: 28,
    padding: 18,
    marginTop: 16,
  },

  heroLabel: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  heroScore: {
    color: '#FFF8EA',
    fontSize: 48,
    fontWeight: '900',
    marginTop: 3,
  },

  heroStats: {
    flex: 1,
    marginLeft: 16,
  },

  statBox: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 11,
    marginBottom: 8,
  },

  statValue: {
    color: '#FFF8EA',
    fontSize: 18,
    fontWeight: '900',
  },

  statLabel: {
    color: '#BEB3DD',
    fontSize: 9,
    fontWeight: '900',
    marginTop: 2,
    textTransform: 'uppercase',
  },

  featuredCard: {
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

  featuredRow: {
    flexDirection: 'row',
  },

  featuredText: {
    flex: 1,
    marginLeft: 14,
  },

  featuredTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
  },

  featuredSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 5,
  },

  searchInput: {
    minHeight: 50,
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 15,
    marginTop: 14,
  },

  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginTop: 12,
  },

  filterChip: {
    backgroundColor: '#EEE6F4',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 8,
    marginHorizontal: 4,
    marginBottom: 8,
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

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },

  cardItem: {
    width: '33.333%',
    alignItems: 'center',
    padding: 6,
    marginBottom: 8,
  },

  cardLocked: {
    opacity: 0.72,
  },

  lockedBack: {
    width: 82,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.night,
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 14,
  },

  lockedMoon: {
    color: COLORS.gold,
    fontSize: 28,
    fontWeight: '900',
  },

  cardName: {
    color: COLORS.text,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 7,
    minHeight: 28,
  },

  cardMeta: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 3,
  },
});
