import React, { useState } from 'react';

import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTranslation } from 'react-i18next';

import { changeAppLanguage, getCurrentLanguage } from '../i18n';

import { AppLanguage, SUPPORTED_LANGUAGES } from '../i18n/languages';

import { colors } from '../theme/colors';
export default function SettingsScreen() {
  const { t } = useTranslation();

  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>(
    getCurrentLanguage(),
  );

  const handleLanguageChange = async (language: AppLanguage) => {
    setSelectedLanguage(language);

    await changeAppLanguage(language);

    setLanguageModalVisible(false);
  };

  const selectedLanguageName =
    SUPPORTED_LANGUAGES.find(item => item.code === selectedLanguage)?.name ??
    'English';

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('settings.title')}</Text>

        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => setLanguageModalVisible(true)}
        >
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={styles.cardTitle}>🌐 {t('settings.language')}</Text>

              <Text style={styles.cardText}>
                {t('settings.languageDescription')}
              </Text>
            </View>

            <Text style={styles.currentLanguage}>{selectedLanguageName} ›</Text>
          </View>
        </Pressable>
      </ScrollView>

      <Modal
        visible={isLanguageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {t('settings.chooseLanguage')}
            </Text>

            {SUPPORTED_LANGUAGES.map(language => {
              const isSelected = language.code === selectedLanguage;

              return (
                <Pressable
                  key={language.code}
                  style={[
                    styles.languageRow,

                    isSelected && styles.languageRowSelected,
                  ]}
                  onPress={() => handleLanguageChange(language.code)}
                >
                  <Text
                    style={[
                      styles.languageText,

                      isSelected && styles.languageTextSelected,
                    ]}
                  >
                    {language.name}
                  </Text>

                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </Pressable>
              );
            })}

            <Pressable
              style={styles.cancelButton}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.cancelText}>{t('common.cancel')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,

    backgroundColor: colors.background,
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
    backgroundColor: colors.surface,

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

  currentLanguage: {
    color: colors.primary,

    fontSize: 14,

    fontWeight: '700',

    marginLeft: 12,
  },

  modalBackdrop: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.45)',

    padding: 20,
  },

  modalCard: {
    backgroundColor: colors.surface,

    borderRadius: 24,

    padding: 20,
  },

  modalTitle: {
    color: colors.primaryDark,

    fontSize: 22,

    fontWeight: '800',

    textAlign: 'center',

    marginBottom: 14,
  },

  languageRow: {
    minHeight: 55,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    borderBottomWidth: StyleSheet.hairlineWidth,

    borderBottomColor: colors.border,

    paddingHorizontal: 12,
  },

  languageRowSelected: {
    backgroundColor: '#F3E4D2',

    borderRadius: 12,
  },

  languageText: {
    color: colors.text,

    fontSize: 16,
  },

  languageTextSelected: {
    color: colors.primary,

    fontWeight: '800',
  },

  checkmark: {
    color: colors.primary,

    fontSize: 20,

    fontWeight: '800',
  },

  cancelButton: {
    alignItems: 'center',

    paddingVertical: 14,

    marginTop: 10,
  },

  cancelText: {
    color: colors.primary,

    fontSize: 16,

    fontWeight: '800',
  },
});
