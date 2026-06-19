import React, {
  useMemo,
  useState,
} from 'react';

import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useTranslation,
} from 'react-i18next';

import {
  changeAppLanguage,
  getCurrentLanguage,
} from '../i18n';

import {
  type AppLanguage,
  SUPPORTED_LANGUAGES,
} from '../i18n/languages';

import {
  colors,
} from '../theme/colors';

type LanguageItem = {
  code: AppLanguage;
  name: string;
};

const LANGUAGE_COLUMNS = 2;

export default function SettingsScreen() {
  const {t} = useTranslation();

  const [
    isLanguageModalVisible,
    setLanguageModalVisible,
  ] = useState(false);

  const [
    selectedLanguage,
    setSelectedLanguage,
  ] = useState<AppLanguage>(
    getCurrentLanguage(),
  );

  const languages =
    useMemo<LanguageItem[]>(
      () =>
        SUPPORTED_LANGUAGES.map(
          language => ({
            code: language.code,
            name: language.name,
          }),
        ),
      [],
    );

  const selectedLanguageName =
    languages.find(
      item =>
        item.code === selectedLanguage,
    )?.name ?? 'English';

  const handleLanguageChange =
    async (
      language: AppLanguage,
    ) => {
      setSelectedLanguage(language);

      await changeAppLanguage(
        language,
      );

      setLanguageModalVisible(
        false,
      );
    };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {t('settings.title')}
        </Text>

        <Pressable
          style={({pressed}) => [
            styles.card,
            pressed &&
              styles.cardPressed,
          ]}
          onPress={() =>
            setLanguageModalVisible(
              true,
            )
          }>
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={styles.cardTitle}>
                🌐{' '}
                {t(
                  'settings.language',
                )}
              </Text>

              <Text style={styles.cardText}>
                {t(
                  'settings.languageDescription',
                )}
              </Text>
            </View>

            <View style={styles.currentLanguagePill}>
              <Text
                style={styles.currentLanguage}
                numberOfLines={1}>
                {selectedLanguageName}
              </Text>

              <Text style={styles.chevron}>
                ›
              </Text>
            </View>
          </View>
        </Pressable>
      </View>

      <Modal
        visible={
          isLanguageModalVisible
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setLanguageModalVisible(
            false,
          )
        }>
        <View style={styles.modalBackdrop}>
          <Pressable
            style={styles.backdropPressArea}
            onPress={() =>
              setLanguageModalVisible(
                false,
              )
            }
          />

          <SafeAreaView
            style={styles.modalSafeArea}>
            <View style={styles.modalCard}>
              <View style={styles.handle} />

              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>
                    {t(
                      'settings.chooseLanguage',
                    )}
                  </Text>

                  <Text style={styles.modalSubtitle}>
                    {selectedLanguageName}
                  </Text>
                </View>

                <Pressable
                  style={({pressed}) => [
                    styles.closeButton,
                    pressed &&
                      styles.cardPressed,
                  ]}
                  onPress={() =>
                    setLanguageModalVisible(
                      false,
                    )
                  }>
                  <Text style={styles.closeText}>
                    ×
                  </Text>
                </Pressable>
              </View>

              <FlatList
                data={languages}
                keyExtractor={item =>
                  item.code
                }
                numColumns={
                  LANGUAGE_COLUMNS
                }
                showsVerticalScrollIndicator={
                  false
                }
                contentContainerStyle={
                  styles.languageGrid
                }
                columnWrapperStyle={
                  styles.languageRow
                }
                renderItem={({item}) => {
                  const isSelected =
                    item.code ===
                    selectedLanguage;

                  return (
                    <Pressable
                      style={({pressed}) => [
                        styles.languageCard,
                        isSelected &&
                          styles.languageCardSelected,
                        pressed &&
                          styles.languageCardPressed,
                      ]}
                      onPress={() =>
                        handleLanguageChange(
                          item.code,
                        )
                      }>
                      <View
                        style={[
                          styles.languageCodeBadge,
                          isSelected &&
                            styles.languageCodeBadgeSelected,
                        ]}>
                        <Text
                          style={[
                            styles.languageCodeText,
                            isSelected &&
                              styles.languageCodeTextSelected,
                          ]}>
                          {item.code.toUpperCase()}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.languageText,
                          isSelected &&
                            styles.languageTextSelected,
                        ]}
                        numberOfLines={2}>
                        {item.name}
                      </Text>

                      {isSelected && (
                        <View style={styles.checkCircle}>
                          <Text style={styles.checkmark}>
                            ✓
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  );
                }}
              />

              <Pressable
                style={({pressed}) => [
                  styles.cancelButton,
                  pressed &&
                    styles.cardPressed,
                ]}
                onPress={() =>
                  setLanguageModalVisible(
                    false,
                  )
                }>
                <Text style={styles.cancelText}>
                  {t('common.cancel')}
                </Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor:
      colors.background,
  },

  content: {
    padding: 20,
    paddingBottom: 120,
  },

  title: {
    color: colors.primaryDark,
    fontSize: 29,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 24,
  },

  card: {
    backgroundColor:
      colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
  },

  cardPressed: {
    opacity: 0.75,
  },

  cardTitle: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: '800',
  },

  cardText: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowContent: {
    flex: 1,
  },

  currentLanguagePill: {
    maxWidth: 148,
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E4D2',
    borderRadius: 18,
    paddingHorizontal: 12,
    marginLeft: 12,
  },

  currentLanguage: {
    flexShrink: 1,
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },

  chevron: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '800',
    marginLeft: 5,
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor:
      'rgba(0,0,0,0.48)',
  },

  backdropPressArea: {
    flex: 1,
  },

  modalSafeArea: {
    backgroundColor:
      'transparent',
  },

  modalCard: {
    maxHeight: '82%',
    backgroundColor:
      colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },

  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    backgroundColor: '#D6C8B8',
    borderRadius: 99,
    marginBottom: 12,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    paddingHorizontal: 4,
    marginBottom: 12,
  },

  modalTitle: {
    color: colors.primaryDark,
    fontSize: 22,
    fontWeight: '800',
  },

  modalSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },

  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6EFE7',
    borderRadius: 20,
  },

  closeText: {
    color: colors.primaryDark,
    fontSize: 26,
    fontWeight: '700',
    marginTop: -2,
  },

  languageGrid: {
    paddingBottom: 8,
  },

  languageRow: {
    columnGap: 10,
  },

  languageCard: {
    flex: 1,
    minHeight: 82,
    backgroundColor: '#FBF7F0',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    position: 'relative',
  },

  languageCardSelected: {
    backgroundColor: '#F3E4D2',
    borderColor: colors.primary,
  },

  languageCardPressed: {
    opacity: 0.78,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  languageCodeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFE5DA',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },

  languageCodeBadgeSelected: {
    backgroundColor:
      colors.primary,
  },

  languageCodeText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '900',
  },

  languageCodeTextSelected: {
    color: '#FFFFFF',
  },

  languageText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    paddingRight: 22,
  },

  languageTextSelected: {
    color: colors.primary,
    fontWeight: '900',
  },

  checkCircle: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
  },

  checkmark: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: '#F6EFE7',
    borderRadius: 16,
    marginTop: 4,
  },

  cancelText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
});
