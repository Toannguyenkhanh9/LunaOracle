import React, {
  useMemo,
  useState,
} from 'react';

import {
  Modal,
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
  useTranslation,
} from 'react-i18next';

import {
  ASTRO_GLOSSARY_CATEGORIES,
  searchAstroGlossaryTerms,
  type AstroGlossaryCategory,
  type AstroGlossaryTerm,
} from '../services/astroGlossary';

import {
  translateGlossaryTerm,
} from '../utils/lunaContentLocalization';

function getCategoryLabel(
  t: ReturnType<typeof useTranslation>['t'],
  category: AstroGlossaryCategory,
): string {
  return t(
    `western.glossary.categories.${category}`,
    {
      defaultValue:
        category,
    },
  );
}

export default function AstroGlossaryScreen() {
  const {t} =
    useTranslation();

  const [query, setQuery] =
    useState('');

  const [category, setCategory] =
    useState<
      AstroGlossaryCategory | undefined
    >();

  const [selectedTerm, setSelectedTerm] =
    useState<
      AstroGlossaryTerm | undefined
    >();

  const terms =
    useMemo(
      () =>
        searchAstroGlossaryTerms(
          query,
          category,
        ),
      [query, category],
    );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>
          {t(
            'western.glossary.eyebrow',
            {
              defaultValue:
                'Learn',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'western.glossary.title',
            {
              defaultValue:
                'Astro Glossary',
            },
          )}
        </Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t(
            'western.glossary.searchPlaceholder',
            {
              defaultValue:
                'Search planets, tarot, moon...',
            },
          )}
          placeholderTextColor="#A99DAF"
          style={styles.search}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}>
          <Pressable
            style={[
              styles.categoryChip,
              !category &&
                styles.categoryChipSelected,
            ]}
            onPress={() =>
              setCategory(undefined)
            }>
            <Text
              style={[
                styles.categoryText,
                !category &&
                  styles.categoryTextSelected,
              ]}>
              {t(
                'western.glossary.all',
                {
                  defaultValue:
                    'All',
                },
              )}
            </Text>
          </Pressable>

          {ASTRO_GLOSSARY_CATEGORIES.map(
            item => {
              const selected =
                item === category;

              return (
                <Pressable
                  key={item}
                  style={[
                    styles.categoryChip,
                    selected &&
                      styles.categoryChipSelected,
                  ]}
                  onPress={() =>
                    setCategory(item)
                  }>
                  <Text
                    style={[
                      styles.categoryText,
                      selected &&
                        styles.categoryTextSelected,
                    ]}>
                    {getCategoryLabel(
                      t,
                      item,
                    )}
                  </Text>
                </Pressable>
              );
            },
          )}
        </ScrollView>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.termList
          }>
          {terms.map(term => (
            <Pressable
              key={term.id}
              style={({pressed}) => [
                styles.termCard,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                setSelectedTerm(term)
              }>
              <Text style={styles.termCategory}>
                {getCategoryLabel(
                  t,
                  term.category,
                )}
              </Text>

              <Text style={styles.termTitle}>
                {translateGlossaryTerm(t, term, 'term')}
              </Text>

              <Text style={styles.termShort}>
                {translateGlossaryTerm(t, term, 'short')}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <Modal
        visible={Boolean(selectedTerm)}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setSelectedTerm(undefined)
        }>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalCategory}>
              {selectedTerm
                ? getCategoryLabel(
                    t,
                    selectedTerm.category,
                  )
                : ''}
            </Text>

            <Text style={styles.modalTitle}>
              {selectedTerm ? translateGlossaryTerm(t, selectedTerm, 'term') : ''}
            </Text>

            <Text style={styles.modalText}>
              {selectedTerm ? translateGlossaryTerm(t, selectedTerm, 'description') : ''}
            </Text>

            <View style={styles.keywordWrap}>
              {selectedTerm?.keywords.map(
                keyword => (
                  <View
                    key={keyword}
                    style={styles.keyword}>
                    <Text style={styles.keywordText}>
                      {keyword}
                    </Text>
                  </View>
                ),
              )}
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={() =>
                setSelectedTerm(undefined)
              }>
              <Text style={styles.closeText}>
                {t(
                  'western.glossary.close',
                  {
                    defaultValue:
                      'Close',
                  },
                )}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    flex: 1,
    padding: 18,
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
  search: {
    minHeight: 50,
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 15,
    marginTop: 16,
  },
  categoryScroll: {
    marginTop: 13,
    maxHeight: 42,
  },
  categoryChip: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 13,
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.night,
    borderColor: COLORS.gold,
  },
  categoryText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '900',
  },
  categoryTextSelected: {
    color: '#F8EBCB',
  },
  termList: {
    paddingTop: 14,
    paddingBottom: 110,
  },
  termCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
  },
  termCategory: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  termTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 5,
  },
  termShort: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.48)',
    padding: 18,
  },
  modalCard: {
    backgroundColor: COLORS.paper,
    borderRadius: 26,
    padding: 20,
  },
  modalCategory: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 6,
  },
  modalText: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 10,
  },
  keywordWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  keyword: {
    backgroundColor: '#EEE6F4',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginRight: 7,
    marginBottom: 7,
  },
  keywordText: {
    color: COLORS.purple,
    fontSize: 10,
    fontWeight: '900',
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: COLORS.night,
    borderRadius: 16,
    marginTop: 12,
  },
  closeText: {
    color: '#F8EBCB',
    fontSize: 14,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.78,
  },
});
