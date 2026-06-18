import React, {useEffect, useState} from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {useTranslation} from 'react-i18next';

import PrimaryButton from '../components/PrimaryButton';

import {
  addPrayer,
  deletePrayer,
  getPrayers,
  type PrayerItem,
} from '../services/storage';

import {colors} from '../theme/colors';

function formatPrayerDate(
  value: string,
  language: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  try {
    return new Intl.DateTimeFormat(language, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

export default function PrayerScreen() {
  const {t, i18n} = useTranslation();

  const [prayerText, setPrayerText] = useState('');
  const [prayers, setPrayers] = useState<PrayerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSavedPrayers = async () => {
      try {
        const savedPrayers = await getPrayers();
        setPrayers(savedPrayers);
      } catch (error) {
        console.warn('Không thể tải lời cầu nguyện:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedPrayers();
  }, []);

  const handleSavePrayer = async () => {
    const cleanedText = prayerText.trim();

    if (!cleanedText) {
      Alert.alert(
        t('prayer.requiredTitle'),
        t('prayer.requiredMessage'),
      );
      return;
    }

    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const updatedPrayers = await addPrayer(cleanedText);

      setPrayers(updatedPrayers);
      setPrayerText('');

      Alert.alert(
        t('prayer.savedTitle'),
        t('prayer.savedMessage'),
      );
    } catch (error) {
      console.warn('Không thể lưu lời cầu nguyện:', error);

      Alert.alert(
        t('prayer.saveErrorTitle'),
        t('prayer.saveErrorMessage'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePrayer = (prayer: PrayerItem) => {
    Alert.alert(
      t('prayer.deleteDialogTitle'),
      t('prayer.deleteDialogMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedPrayers = await deletePrayer(prayer.id);
              setPrayers(updatedPrayers);
            } catch (error) {
              console.warn(
                'Không thể xóa lời cầu nguyện:',
                error,
              );

              Alert.alert(
                t('prayer.deleteErrorTitle'),
                t('prayer.deleteErrorMessage'),
              );
            }
          },
        },
      ],
    );
  };

  const currentLanguage =
    i18n.resolvedLanguage ?? i18n.language ?? 'en';

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={BACKGROUND}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={require('../assets/images/prayer_hero.png')}
            resizeMode="cover"
            imageStyle={styles.heroImage}
            style={styles.heroCard}>
            <View style={styles.heroOverlay}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeIcon}>🙏</Text>
              </View>

              <Text style={styles.heroTitle}>
                {t('prayer.title')}
              </Text>

              <Text style={styles.heroSubtitle}>
                {t('prayer.subtitle')}
              </Text>
            </View>
          </ImageBackground>

          <View style={styles.editorCard}>
            <View style={styles.editorHeader}>
              <Text style={styles.editorIcon}>✦</Text>

              <View style={styles.editorHeaderText}>
                <Text style={styles.editorTitle}>
                  {t('prayer.writeTitle', {
                    defaultValue: 'Viết lời cầu nguyện',
                  })}
                </Text>

                <Text style={styles.editorHint}>
                  {t('prayer.writeHint', {
                    defaultValue:
                      'Nội dung được lưu riêng tư trên thiết bị của bạn.',
                  })}
                </Text>
              </View>
            </View>

            <TextInput
              style={styles.input}
              value={prayerText}
              onChangeText={setPrayerText}
              placeholder={t('prayer.placeholder')}
              placeholderTextColor="#9A8573"
              multiline
              textAlignVertical="top"
              maxLength={1000}
              editable={!isSaving}
              selectionColor={PRIMARY}
            />

            <View style={styles.inputFooter}>
              <Text style={styles.privateText}>
                🔒{' '}
                {t('prayer.privateLabel', {
                  defaultValue: 'Riêng tư',
                })}
              </Text>

              <Text style={styles.characterCount}>
                {prayerText.length}/1000
              </Text>
            </View>

            <PrimaryButton
              title={
                isSaving
                  ? t('prayer.saving')
                  : t('prayer.save')
              }
              onPress={handleSavePrayer}
              disabled={isSaving}
            />
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                {t('prayer.savedItems')}
              </Text>

              <Text style={styles.sectionSubtitle}>
                {t('prayer.savedCount', {
                  count: prayers.length,
                  defaultValue: `${prayers.length} nội dung đã lưu`,
                })}
              </Text>
            </View>

            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {prayers.length}
              </Text>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>⌛</Text>

              <Text style={styles.emptyText}>
                {t('common.loading')}
              </Text>
            </View>
          ) : prayers.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🪷</Text>

              <Text style={styles.emptyTitle}>
                {t('prayer.emptyTitle', {
                  defaultValue: 'Chưa có lời cầu nguyện',
                })}
              </Text>

              <Text style={styles.emptyText}>
                {t('prayer.empty')}
              </Text>
            </View>
          ) : (
            prayers.map((prayer, index) => (
              <View
                key={prayer.id}
                style={styles.prayerCard}>
                <View style={styles.prayerCardHeader}>
                  <View style={styles.prayerNumber}>
                    <Text style={styles.prayerNumberText}>
                      {index + 1}
                    </Text>
                  </View>

                  <Text style={styles.prayerDate}>
                    {formatPrayerDate(
                      prayer.createdAt,
                      currentLanguage,
                    )}
                  </Text>
                </View>

                <Text style={styles.prayerText}>
                  “{prayer.text}”
                </Text>

                <View style={styles.prayerFooter}>
                  <Text style={styles.savedPrivateText}>
                    🔒{' '}
                    {t('prayer.savedPrivately', {
                      defaultValue: 'Được lưu riêng tư',
                    })}
                  </Text>

                  <Pressable
                    hitSlop={10}
                    style={({pressed}) => [
                      styles.deleteButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={() =>
                      handleDeletePrayer(prayer)
                    }>
                    <Text style={styles.deleteText}>
                      {t('common.delete')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const BACKGROUND = '#FFF8EF';
const SURFACE = '#FFFCF7';
const PRIMARY = '#8B4A22';
const PRIMARY_DARK = '#5A2F18';
const GOLD = '#D6A45C';
const BORDER = '#E6D1B3';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  content: {
    padding: 16,
    paddingBottom: 120,
  },

  heroCard: {
    width: '100%',
    aspectRatio: 1.18,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderRadius: 24,
    marginBottom: 18,

    shadowColor: '#5B341F',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 7,
    },

    elevation: 7,
  },

  heroImage: {
    borderRadius: 24,
  },

  heroOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(79, 38, 17, 0.16)',
    paddingHorizontal: 22,
    paddingBottom: 22,
  },

  heroBadge: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 249, 234, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(214, 164, 92, 0.75)',
    borderRadius: 25,
    marginBottom: 10,
  },

  heroBadgeIcon: {
    fontSize: 25,
  },

  heroTitle: {
    color: '#FFF8E8',
    fontSize: 27,
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(70, 30, 12, 0.85)',
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 7,
  },

  heroSubtitle: {
    color: '#FFF3DF',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 7,
    textShadowColor: 'rgba(70, 30, 12, 0.85)',
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 5,
  },

  editorCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 22,
    padding: 17,

    shadowColor: '#5B341F',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  editorIcon: {
    color: GOLD,
    fontSize: 24,
    marginRight: 10,
  },

  editorHeaderText: {
    flex: 1,
  },

  editorTitle: {
    color: PRIMARY_DARK,
    fontSize: 18,
    fontWeight: '800',
  },

  editorHint: {
    color: '#8B715E',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },

  input: {
    minHeight: 165,
    color: '#3F2B20',
    fontSize: 16,
    lineHeight: 24,
    backgroundColor: '#FFF7EA',
    borderWidth: 1,
    borderColor: '#E5CBA7',
    borderRadius: 17,
    padding: 15,
  },

  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 14,
  },

  privateText: {
    color: '#8C735E',
    fontSize: 12,
  },

  characterCount: {
    color: '#9B8573',
    fontSize: 12,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 26,
    marginBottom: 13,
  },

  sectionTitle: {
    color: PRIMARY_DARK,
    fontSize: 22,
    fontWeight: '800',
  },

  sectionSubtitle: {
    color: '#8A725F',
    fontSize: 12,
    marginTop: 3,
  },

  countBadge: {
    minWidth: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 19,
    paddingHorizontal: 9,
  },

  countBadgeText: {
    color: '#FFF8E9',
    fontSize: 14,
    fontWeight: '800',
  },

  emptyCard: {
    alignItems: 'center',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 30,
  },

  emptyIcon: {
    fontSize: 42,
  },

  emptyTitle: {
    color: PRIMARY_DARK,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 10,
  },

  emptyText: {
    color: '#7D6757',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 7,
  },

  prayerCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 19,
    padding: 16,
    marginBottom: 13,

    shadowColor: '#5B341F',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  prayerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  prayerNumber: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3DFC1',
    borderWidth: 1,
    borderColor: '#D9B77C',
    borderRadius: 15,
    marginRight: 10,
  },

  prayerNumberText: {
    color: PRIMARY_DARK,
    fontSize: 12,
    fontWeight: '800',
  },

  prayerDate: {
    flex: 1,
    color: '#9A816E',
    fontSize: 12,
  },

  prayerText: {
    color: '#493326',
    fontSize: 15,
    lineHeight: 24,
    fontStyle: 'italic',
    marginTop: 13,
  },

  prayerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEDFCB',
    marginTop: 15,
    paddingTop: 11,
  },

  savedPrivateText: {
    flex: 1,
    color: '#9A816E',
    fontSize: 11,
    marginRight: 12,
  },

  deleteButton: {
    backgroundColor: '#FFF0ED',
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  deleteText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '800',
  },

  buttonPressed: {
    opacity: 0.6,
  },
});
