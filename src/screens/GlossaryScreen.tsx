import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type {
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useTranslation,
} from 'react-i18next';

import type {
  RootTabParamList,
} from '../navigation/RootNavigator';

import {
  GLOSSARY_CATEGORIES,
  getGlossaryLocalizedContent,
  getGlossaryRelatedTerms,
  getGlossaryStats,
  getGlossaryTerm,
  searchGlossaryTerms,
  type GlossaryCategory,
  type GlossaryTerm,
} from '../services/glossary';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'Glossary'
>;

type CategoryFilter =
  | 'all'
  | GlossaryCategory;

function TermCard({
  term,
  language,
  selected,
  onPress,
}: {
  term: GlossaryTerm;
  language: string;
  selected: boolean;
  onPress: () => void;
}) {
  const content =
    getGlossaryLocalizedContent(
      term,
      language,
    );

  return (
    <Pressable
      style={({pressed}) => [
        styles.termCard,
        selected &&
          styles.termCardSelected,
        pressed && styles.pressed,
      ]}
      onPress={onPress}>
      <View style={styles.termCardTop}>
        <View
          style={[
            styles.termIcon,
            selected &&
              styles.termIconSelected,
          ]}>
          <Text
            style={[
              styles.termIconText,
              selected &&
                styles.termIconTextSelected,
            ]}>
            {content.title
              .trim()
              .slice(0, 1)
              .toUpperCase()}
          </Text>
        </View>

        <View style={styles.termTextWrap}>
          <Text
            numberOfLines={2}
            style={[
              styles.termTitle,
              selected &&
                styles.termTitleSelected,
            ]}>
            {content.title}
          </Text>

          <Text
            numberOfLines={2}
            style={[
              styles.termSubtitle,
              selected &&
                styles.termSubtitleSelected,
            ]}>
            {content.subtitle}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function DetailSection({
  title,
  children,
  tone = 'normal',
}: {
  title: string;
  children: React.ReactNode;
  tone?: 'normal' | 'warning';
}) {
  return (
    <View
      style={[
        styles.detailSection,
        tone === 'warning' &&
          styles.detailWarning,
      ]}>
      <Text
        style={[
          styles.detailSectionTitle,
          tone === 'warning' &&
            styles.detailWarningTitle,
        ]}>
        {title}
      </Text>

      <Text
        selectable
        style={[
          styles.detailSectionText,
          tone === 'warning' &&
            styles.detailWarningText,
        ]}>
        {children}
      </Text>
    </View>
  );
}

function TermDetail({
  term,
  language,
  onSelectTerm,
}: {
  term: GlossaryTerm;
  language: string;
  onSelectTerm: (
    term: GlossaryTerm,
  ) => void;
}) {
  const {t} = useTranslation();
  const content =
    getGlossaryLocalizedContent(
      term,
      language,
    );

  const related =
    getGlossaryRelatedTerms(
      term,
      language,
    );

  return (
    <View style={styles.detailCard}>
      <View style={styles.detailHeader}>
        <Text style={styles.detailEyebrow}>
          {t(
            `glossary.categories.${term.category}`,
          )}
        </Text>

        <Text style={styles.detailTitle}>
          {content.title}
        </Text>

        <Text style={styles.detailSubtitle}>
          {content.subtitle}
        </Text>
      </View>

      <DetailSection
        title={t(
          'glossary.sections.definition',
        )}>
        {content.definition}
      </DetailSection>

      <DetailSection
        title={t(
          'glossary.sections.whyItMatters',
        )}>
        {content.whyItMatters}
      </DetailSection>

      <DetailSection
        title={t(
          'glossary.sections.example',
        )}>
        {content.example}
      </DetailSection>

      <DetailSection
        title={t(
          'glossary.sections.caution',
        )}
        tone="warning">
        {content.caution}
      </DetailSection>

      {related.length > 0 && (
        <View style={styles.relatedWrap}>
          <Text style={styles.relatedTitle}>
            {t(
              'glossary.relatedTerms',
            )}
          </Text>

          <View style={styles.relatedGrid}>
            {related.map(item => {
              const itemContent =
                getGlossaryLocalizedContent(
                  item,
                  language,
                );

              return (
                <Pressable
                  key={item.id}
                  style={({pressed}) => [
                    styles.relatedChip,
                    pressed &&
                      styles.pressed,
                  ]}
                  onPress={() =>
                    onSelectTerm(item)
                  }>
                  <Text
                    style={
                      styles.relatedChipText
                    }>
                    {itemContent.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

export default function GlossaryScreen({
  navigation,
  route,
}: Props) {
  const {t, i18n} =
    useTranslation();

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const [query, setQuery] =
    useState('');

  const [category, setCategory] =
    useState<CategoryFilter>(
      route.params?.category ??
        'all',
    );

  const [selectedId, setSelectedId] =
    useState<string | null>(
      route.params?.termId ??
        null,
    );

  const stats = useMemo(
    () => getGlossaryStats(),
    [],
  );

  const results = useMemo(
    () =>
      searchGlossaryTerms(query, {
        language,
        category,
      }),
    [category, language, query],
  );

  useEffect(() => {
    if (
      selectedId &&
      results.some(
        item => item.id === selectedId,
      )
    ) {
      return;
    }

    setSelectedId(
      results[0]?.id ?? null,
    );
  }, [results, selectedId]);

  const selectedTerm =
    selectedId
      ? getGlossaryTerm(selectedId)
      : results[0];

  const selectTerm = (
    term: GlossaryTerm,
  ) => {
    setSelectedId(term.id);
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={styles.screen}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.navy
        }
      />

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          false
        }>
        <View style={styles.hero}>
          <Pressable
            style={({pressed}) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              navigation.goBack()
            }>
            <Text style={styles.backText}>
              ‹
            </Text>
          </Pressable>

          <View style={styles.heroTextWrap}>
            <Text style={styles.heroEyebrow}>
              EASTERN DESTINY
            </Text>

            <Text style={styles.heroTitle}>
              {t('glossary.title')}
            </Text>

            <Text style={styles.heroSubtitle}>
              {t('glossary.subtitle', {
                count:
                  stats.totalTerms,
              })}
            </Text>
          </View>

          <View style={styles.heroIcon}>
            <Text style={styles.heroIconText}>
              字
            </Text>
          </View>
        </View>

        <View style={styles.searchCard}>
          <Text style={styles.searchLabel}>
            {t('glossary.searchLabel')}
          </Text>

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t(
              'glossary.searchPlaceholder',
            )}
            placeholderTextColor="#8A8B89"
            style={styles.searchInput}
            autoCorrect={false}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.categoryRow
          }>
          <Pressable
            style={[
              styles.categoryChip,
              category === 'all' &&
                styles.categoryChipActive,
            ]}
            onPress={() =>
              setCategory('all')
            }>
            <Text
              style={[
                styles.categoryText,
                category === 'all' &&
                  styles.categoryTextActive,
              ]}>
              {t('glossary.categories.all')}
            </Text>
          </Pressable>

          {GLOSSARY_CATEGORIES.map(item => (
            <Pressable
              key={item}
              style={[
                styles.categoryChip,
                category === item &&
                  styles.categoryChipActive,
              ]}
              onPress={() =>
                setCategory(item)
              }>
              <Text
                style={[
                  styles.categoryText,
                  category === item &&
                    styles.categoryTextActive,
                ]}>
                {t(
                  `glossary.categories.${item}`,
                )}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statValue}>
              {results.length}
            </Text>

            <Text style={styles.statLabel}>
              {query
                ? t(
                    'glossary.resultsFound',
                  )
                : t(
                    'glossary.termsShown',
                  )}
            </Text>
          </View>

          <View style={styles.statPill}>
            <Text style={styles.statValue}>
              {category === 'all'
                ? stats.totalTerms
                : stats.categoryCounts[
                    category
                  ]}
            </Text>

            <Text style={styles.statLabel}>
              {t(
                'glossary.totalInCategory',
              )}
            </Text>
          </View>
        </View>

        {results.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              ⌕
            </Text>

            <Text style={styles.emptyTitle}>
              {t('glossary.emptyTitle')}
            </Text>

            <Text style={styles.emptyText}>
              {t('glossary.emptyMessage')}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionEyebrow}>
                {t(
                  'glossary.termListEyebrow',
                )}
              </Text>

              <Text style={styles.sectionTitle}>
                {t('glossary.termListTitle')}
              </Text>

              <View style={styles.termGrid}>
                {results.map(term => (
                  <TermCard
                    key={term.id}
                    term={term}
                    language={language}
                    selected={
                      term.id === selectedId
                    }
                    onPress={() =>
                      selectTerm(term)
                    }
                  />
                ))}
              </View>
            </View>

            {selectedTerm && (
              <View style={styles.section}>
                <Text style={styles.sectionEyebrow}>
                  {t(
                    'glossary.detailEyebrow',
                  )}
                </Text>

                <Text style={styles.sectionTitle}>
                  {t('glossary.detailTitle')}
                </Text>

                <TermDetail
                  term={selectedTerm}
                  language={language}
                  onSelectTerm={selectTerm}
                />
              </View>
            )}
          </>
        )}

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>
            {t('glossary.noticeTitle')}
          </Text>

          <Text style={styles.noticeText}>
            {t('glossary.notice')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = {
  navy: '#17243A',
  gold: '#D7AF5E',
  cream: '#F7F2E8',
  surface: '#FFFDF8',
  text: '#282D36',
  muted: '#6C726F',
  border: '#E2D7C5',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor:
      COLORS.cream,
  },

  content: {
    paddingBottom: 145,
  },

  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.navy,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 22,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(255,255,255,0.08)',
    borderRadius: 13,
  },

  backText: {
    color: '#FFF3D3',
    fontSize: 29,
  },

  heroTextWrap: {
    flex: 1,
    marginLeft: 11,
  },

  heroEyebrow: {
    color: '#D5B672',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1,
  },

  heroTitle: {
    color: '#FFF7E5',
    fontSize: 25,
    fontWeight: '900',
    marginTop: 3,
  },

  heroSubtitle: {
    color: '#C8CFD9',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 5,
  },

  heroIcon: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(215,175,94,0.14)',
    borderWidth: 1,
    borderColor:
      'rgba(215,175,94,0.38)',
    borderRadius: 15,
  },

  heroIconText: {
    color: '#F0D18B',
    fontSize: 21,
    fontWeight: '900',
  },

  searchCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 16,
  },

  searchLabel: {
    color: '#8F6B34',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  searchInput: {
    minHeight: 46,
    color: COLORS.text,
    backgroundColor: '#F4EFE6',
    borderRadius: 13,
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: '700',
  },

  categoryRow: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 3,
  },

  categoryChip: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginRight: 8,
  },

  categoryChipActive: {
    backgroundColor:
      COLORS.navy,
    borderColor: COLORS.navy,
  },

  categoryText: {
    color: '#6C665E',
    fontSize: 9.5,
    fontWeight: '900',
  },

  categoryTextActive: {
    color: '#FFF1D0',
  },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 11,
  },

  statPill: {
    flex: 1,
    backgroundColor: '#EEE8DE',
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginRight: 8,
  },

  statValue: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: '900',
  },

  statLabel: {
    color: COLORS.muted,
    fontSize: 8.5,
    fontWeight: '800',
    marginTop: 3,
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 23,
  },

  sectionEyebrow: {
    color: '#9B783B',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 3,
  },

  termGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 11,
  },

  termCard: {
    width: '48.5%',
    minHeight: 118,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
  },

  termCardSelected: {
    backgroundColor:
      COLORS.navy,
    borderColor:
      COLORS.navy,
  },

  termCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  termIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECE4DA',
    borderRadius: 13,
  },

  termIconSelected: {
    backgroundColor:
      'rgba(215,175,94,0.18)',
  },

  termIconText: {
    color: '#7C5D2C',
    fontSize: 16,
    fontWeight: '900',
  },

  termIconTextSelected: {
    color: '#F0D18B',
  },

  termTextWrap: {
    flex: 1,
    marginLeft: 9,
  },

  termTitle: {
    color: COLORS.text,
    fontSize: 11.5,
    fontWeight: '900',
    lineHeight: 15,
  },

  termTitleSelected: {
    color: '#FFF2D4',
  },

  termSubtitle: {
    color: COLORS.muted,
    fontSize: 8.8,
    lineHeight: 13,
    marginTop: 5,
  },

  termSubtitleSelected: {
    color: '#C8CFD9',
  },

  detailCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 20,
    padding: 15,
    marginTop: 11,
  },

  detailHeader: {
    backgroundColor:
      COLORS.navy,
    borderRadius: 16,
    padding: 15,
  },

  detailEyebrow: {
    color: '#D7AF5E',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  detailTitle: {
    color: '#FFF3D4',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 5,
  },

  detailSubtitle: {
    color: '#C8CFD9',
    fontSize: 10,
    lineHeight: 16,
    marginTop: 7,
  },

  detailSection: {
    backgroundColor: '#F4EFE6',
    borderRadius: 15,
    padding: 13,
    marginTop: 11,
  },

  detailWarning: {
    backgroundColor: '#F7E7E1',
  },

  detailSectionTitle: {
    color: '#7D6036',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },

  detailWarningTitle: {
    color: '#884D44',
  },

  detailSectionText: {
    color: '#4F565E',
    fontSize: 10.5,
    lineHeight: 17,
    marginTop: 7,
  },

  detailWarningText: {
    color: '#6F514D',
  },

  relatedWrap: {
    marginTop: 14,
  },

  relatedTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
  },

  relatedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },

  relatedChip: {
    backgroundColor: '#E8EDF3',
    borderRadius: 11,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 7,
    marginBottom: 7,
  },

  relatedChipText: {
    color: COLORS.navy,
    fontSize: 9,
    fontWeight: '900',
  },

  emptyCard: {
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 18,
    padding: 22,
    marginHorizontal: 16,
    marginTop: 18,
  },

  emptyIcon: {
    color: '#B28C49',
    fontSize: 28,
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 7,
  },

  emptyText: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 6,
  },

  noticeCard: {
    backgroundColor: '#E8EDF3',
    borderRadius: 17,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 22,
  },

  noticeTitle: {
    color: COLORS.navy,
    fontSize: 10.5,
    fontWeight: '900',
  },

  noticeText: {
    color: '#5F6875',
    fontSize: 9.5,
    lineHeight: 15,
    marginTop: 5,
  },

  pressed: {
    opacity: 0.72,
    transform: [{scale: 0.985}],
  },
});
