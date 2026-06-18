import React, {
  useCallback,
  useState,
} from 'react';
import {
  Alert,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import TempleSceneOverlay from '../components/TempleSceneOverlay';
import {
  DEFAULT_ALTAR_PREFERENCES,
  getAltarPreferences,
  resetAltarPreferences,
  saveAltarPreferences,
  type AltarAccent,
  type AltarCenterpiece,
  type AltarCultureTheme,
  type AltarFlower,
  type AltarLamp,
  type AltarPreferences,
  type TempleSceneMode,
  type TempleSoundscape,
} from '../services/altarPreferences';
import {colors} from '../theme/colors';
import {
  getAltarBackgroundSource,
  resolveAltarCultureTheme,
} from '../utils/altarTheme';

type Option<T extends string> = {
  value: T;
  icon: string;
  labelKey: string;
};

const CULTURE_THEME_OPTIONS: Array<
  Option<AltarCultureTheme>
> = [
  {
    value: 'auto',
    icon: '🌐',
    labelKey:
      'altarCustomization.cultureThemes.auto',
  },
  {
    value: 'vietnam',
    icon: '🇻🇳',
    labelKey:
      'altarCustomization.cultureThemes.vietnam',
  },
  {
    value: 'china',
    icon: '🇨🇳',
    labelKey:
      'altarCustomization.cultureThemes.china',
  },
  {
    value: 'japan',
    icon: '🇯🇵',
    labelKey:
      'altarCustomization.cultureThemes.japan',
  },
  {
    value: 'korea',
    icon: '🇰🇷',
    labelKey:
      'altarCustomization.cultureThemes.korea',
  },
  {
    value: 'western',
    icon: '🌍',
    labelKey:
      'altarCustomization.cultureThemes.western',
  },
];

const SCENE_OPTIONS: Array<
  Option<TempleSceneMode>
> = [
  {
    value: 'auto',
    icon: '◐',
    labelKey:
      'altarCustomization.sceneModes.auto',
  },
  {
    value: 'dawn',
    icon: '🌅',
    labelKey:
      'altarCustomization.sceneModes.dawn',
  },
  {
    value: 'day',
    icon: '☀️',
    labelKey:
      'altarCustomization.sceneModes.day',
  },
  {
    value: 'dusk',
    icon: '🌇',
    labelKey:
      'altarCustomization.sceneModes.dusk',
  },
  {
    value: 'night',
    icon: '🌙',
    labelKey:
      'altarCustomization.sceneModes.night',
  },
];

const CENTERPIECE_OPTIONS: Array<
  Option<AltarCenterpiece>
> = [
  {
    value: 'buddha',
    icon: '🧘',
    labelKey:
      'altarCustomization.centerpieces.buddha',
  },
  {
    value: 'lotus',
    icon: '🪷',
    labelKey:
      'altarCustomization.centerpieces.lotus',
  },
  {
    value: 'dharmaWheel',
    icon: '☸',
    labelKey:
      'altarCustomization.centerpieces.dharmaWheel',
  },
  {
    value: 'none',
    icon: '—',
    labelKey:
      'altarCustomization.centerpieces.none',
  },
];

const FLOWER_OPTIONS: Array<
  Option<AltarFlower>
> = [
  {
    value: 'lily',
    icon: '🌼',
    labelKey:
      'altarCustomization.flowers.lily',
  },
  {
    value: 'lotus',
    icon: '🪷',
    labelKey:
      'altarCustomization.flowers.lotus',
  },
  {
    value: 'orchid',
    icon: '🌸',
    labelKey:
      'altarCustomization.flowers.orchid',
  },
  {
    value: 'none',
    icon: '—',
    labelKey:
      'altarCustomization.flowers.none',
  },
];

const LAMP_OPTIONS: Array<
  Option<AltarLamp>
> = [
  {
    value: 'candle',
    icon: '🕯️',
    labelKey:
      'altarCustomization.lamps.candle',
  },
  {
    value: 'lantern',
    icon: '🏮',
    labelKey:
      'altarCustomization.lamps.lantern',
  },
  {
    value: 'lotusLamp',
    icon: '🪷',
    labelKey:
      'altarCustomization.lamps.lotusLamp',
  },
  {
    value: 'none',
    icon: '—',
    labelKey:
      'altarCustomization.lamps.none',
  },
];

const ACCENT_OPTIONS: Array<
  Option<AltarAccent>
> = [
  {
    value: 'amber',
    icon: '🟠',
    labelKey:
      'altarCustomization.accents.amber',
  },
  {
    value: 'gold',
    icon: '🟡',
    labelKey:
      'altarCustomization.accents.gold',
  },
  {
    value: 'rose',
    icon: '🩷',
    labelKey:
      'altarCustomization.accents.rose',
  },
  {
    value: 'jade',
    icon: '🟢',
    labelKey:
      'altarCustomization.accents.jade',
  },
  {
    value: 'none',
    icon: '—',
    labelKey:
      'altarCustomization.accents.none',
  },
];

const SOUNDSCAPE_OPTIONS: Array<
  Option<TempleSoundscape>
> = [
  {
    value: 'none',
    icon: '🔇',
    labelKey:
      'altarCustomization.soundscapes.none',
  },
  {
    value: 'rain',
    icon: '🌧️',
    labelKey:
      'altarCustomization.soundscapes.rain',
  },
  {
    value: 'forest',
    icon: '🌿',
    labelKey:
      'altarCustomization.soundscapes.forest',
  },
  {
    value: 'bell',
    icon: '🔔',
    labelKey:
      'altarCustomization.soundscapes.bell',
  },
];

type OptionGroupProps<T extends string> = {
  title: string;
  options: Array<Option<T>>;
  value: T;
  onChange: (value: T) => void;
};

function OptionGroup<T extends string>({
  title,
  options,
  value,
  onChange,
}: OptionGroupProps<T>) {
  const {t} = useTranslation();

  return (
    <View style={styles.optionSection}>
      <Text style={styles.optionTitle}>
        {title}
      </Text>

      <View style={styles.optionGrid}>
        {options.map(option => {
          const selected =
            option.value === value;

          return (
            <Pressable
              key={option.value}
              style={[
                styles.optionCard,
                selected &&
                  styles.optionCardSelected,
              ]}
              onPress={() =>
                onChange(option.value)
              }>
              <Text style={styles.optionIcon}>
                {option.icon}
              </Text>
              <Text
                style={[
                  styles.optionLabel,
                  selected &&
                    styles.optionLabelSelected,
                ]}>
                {t(option.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function AltarCustomizationScreen() {
  const {t, i18n} = useTranslation();

  const [preferences, setPreferences] =
    useState<AltarPreferences>(
      DEFAULT_ALTAR_PREFERENCES,
    );
  const [isSaving, setIsSaving] =
    useState(false);

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const effectiveCultureTheme =
    resolveAltarCultureTheme(
      preferences.cultureTheme,
      language,
    );

  const previewBackground =
    getAltarBackgroundSource(
      effectiveCultureTheme,
    );

  useFocusEffect(
    useCallback(() => {
      getAltarPreferences().then(
        setPreferences,
      );
    }, []),
  );

  const update = <
    K extends keyof AltarPreferences,
  >(
    key: K,
    value: AltarPreferences[K],
  ) => {
    setPreferences(current => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await saveAltarPreferences(
        preferences,
      );

      Alert.alert(
        t(
          'altarCustomization.savedTitle',
        ),
        t(
          'altarCustomization.savedMessage',
        ),
      );
    } catch (error) {
      console.warn(
        'Unable to save altar preferences:',
        error,
      );

      Alert.alert(
        t(
          'altarCustomization.saveErrorTitle',
        ),
        t(
          'altarCustomization.saveErrorMessage',
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      t('altarCustomization.resetTitle'),
      t('altarCustomization.resetMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.reset'),
          style: 'destructive',
          onPress: async () => {
            const defaults =
              await resetAltarPreferences();

            setPreferences(defaults);
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
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>
            🪔
          </Text>
          <Text style={styles.title}>
            {t(
              'altarCustomization.title',
            )}
          </Text>
          <Text style={styles.subtitle}>
            {t(
              'altarCustomization.subtitle',
            )}
          </Text>
        </View>

        <View style={styles.previewCard}>
          <ImageBackground
            source={previewBackground}
            resizeMode="cover"
            style={styles.previewImage}
            imageStyle={
              styles.previewImageStyle
            }>
            <TempleSceneOverlay
              preferences={preferences}
            />

            <View
              pointerEvents="none"
              style={styles.previewLabelWrap}>
              <Text
                style={styles.previewLabel}>
                {t(
                  'altarCustomization.preview',
                )}
              </Text>

              <Text
                style={styles.previewCultureLabel}>
                {t(
                  'altarCustomization.activeCultureTheme',
                  {
                    theme: t(
                      `altarCustomization.cultureThemes.${effectiveCultureTheme}`,
                    ),
                  },
                )}
              </Text>
            </View>
          </ImageBackground>
        </View>

        <OptionGroup
          title={t(
            'altarCustomization.cultureThemeTitle',
          )}
          options={CULTURE_THEME_OPTIONS}
          value={preferences.cultureTheme}
          onChange={value =>
            update('cultureTheme', value)
          }
        />

        <OptionGroup
          title={t(
            'altarCustomization.sceneTitle',
          )}
          options={SCENE_OPTIONS}
          value={preferences.sceneMode}
          onChange={value =>
            update('sceneMode', value)
          }
        />

        <OptionGroup
          title={t(
            'altarCustomization.centerpieceTitle',
          )}
          options={CENTERPIECE_OPTIONS}
          value={preferences.centerpiece}
          onChange={value =>
            update('centerpiece', value)
          }
        />

        <OptionGroup
          title={t(
            'altarCustomization.flowerTitle',
          )}
          options={FLOWER_OPTIONS}
          value={preferences.flower}
          onChange={value =>
            update('flower', value)
          }
        />

        <OptionGroup
          title={t(
            'altarCustomization.lampTitle',
          )}
          options={LAMP_OPTIONS}
          value={preferences.lamp}
          onChange={value =>
            update('lamp', value)
          }
        />

        <OptionGroup
          title={t(
            'altarCustomization.accentTitle',
          )}
          options={ACCENT_OPTIONS}
          value={preferences.accent}
          onChange={value =>
            update('accent', value)
          }
        />

        <OptionGroup
          title={t(
            'altarCustomization.soundscapeTitle',
          )}
          options={SOUNDSCAPE_OPTIONS}
          value={preferences.soundscape}
          onChange={value =>
            update('soundscape', value)
          }
        />

        <View style={styles.switchCard}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>
              {t(
                'altarCustomization.petalsTitle',
              )}
            </Text>
            <Text
              style={
                styles.switchDescription
              }>
              {t(
                'altarCustomization.petalsDescription',
              )}
            </Text>
          </View>

          <Switch
            value={
              preferences.showFloatingPetals
            }
            onValueChange={value =>
              update(
                'showFloatingPetals',
                value,
              )
            }
            trackColor={{
              false: '#C9BBA8',
              true: '#D5A347',
            }}
            thumbColor="#FFF8E8"
          />
        </View>

        <Pressable
          disabled={isSaving}
          style={({pressed}) => [
            styles.saveButton,
            pressed && styles.pressed,
            isSaving &&
              styles.saveButtonDisabled,
          ]}
          onPress={handleSave}>
          <Text
            style={styles.saveButtonText}>
            {isSaving
              ? t(
                  'altarCustomization.saving',
                )
              : t(
                  'altarCustomization.save',
                )}
          </Text>
        </Pressable>

        <Pressable
          style={({pressed}) => [
            styles.resetButton,
            pressed && styles.pressed,
          ]}
          onPress={handleReset}>
          <Text
            style={styles.resetButtonText}>
            {t(
              'altarCustomization.reset',
            )}
          </Text>
        </Pressable>

        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            {t(
              'altarCustomization.soundscapeNote',
            )}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const BROWN = '#492918';
const GOLD = '#D5A347';

const styles = StyleSheet.create({
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
    fontSize: 47,
  },
  title: {
    color: BROWN,
    fontSize: 27,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 7,
  },
  subtitle: {
    color: '#765D49',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
  previewCard: {
    height: 330,
    borderWidth: 2,
    borderColor: GOLD,
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 16,
  },
  previewImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  previewImageStyle: {
    borderRadius: 22,
  },
  previewLabelWrap: {
    alignSelf: 'center',
    backgroundColor:
      'rgba(45,25,14,0.76)',
    borderWidth: 1,
    borderColor:
      'rgba(213,163,71,0.65)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 13,
  },
  previewLabel: {
    color: '#FFE4A5',
    fontSize: 12,
    fontWeight: '800',
  },
  previewCultureLabel: {
    color: '#F6E4C3',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  optionSection: {
    marginTop: 22,
  },
  optionTitle: {
    color: BROWN,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionCard: {
    width: '31.5%',
    minHeight: 82,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E4D5BD',
    borderRadius: 16,
    padding: 8,
    margin: '0.9%',
  },
  optionCardSelected: {
    backgroundColor: '#FFF1CC',
    borderColor: GOLD,
  },
  optionIcon: {
    fontSize: 27,
  },
  optionLabel: {
    color: '#7C6652',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 5,
  },
  optionLabelSelected: {
    color: BROWN,
  },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E4D5BD',
    borderRadius: 18,
    padding: 16,
    marginTop: 22,
  },
  switchInfo: {
    flex: 1,
    marginRight: 12,
  },
  switchTitle: {
    color: BROWN,
    fontSize: 15,
    fontWeight: '800',
  },
  switchDescription: {
    color: '#806B57',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },
  saveButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BROWN,
    borderRadius: 17,
    marginTop: 24,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFE4A5',
    fontSize: 15,
    fontWeight: '800',
  },
  resetButton: {
    alignItems: 'center',
    padding: 15,
    marginTop: 4,
  },
  resetButtonText: {
    color: '#9A7759',
    fontSize: 13,
    fontWeight: '700',
  },
  noteCard: {
    backgroundColor: '#F4E8D7',
    borderRadius: 17,
    padding: 15,
  },
  noteText: {
    color: '#77604C',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
    transform: [{scale: 0.99}],
  },
});
