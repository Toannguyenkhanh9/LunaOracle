import React, {
  useState,
} from 'react';

import {
  Image,
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
  useTranslation,
} from 'react-i18next';

import type {
  PalmDominantHand,
  PalmFateVisibility,
  PalmFingerShape,
  PalmHandSide,
  PalmLineCurve,
  PalmLineDepth,
  PalmLineLength,
  PalmMount,
  PalmReadingFocus,
  PalmReadingObservation,
  PalmShape,
} from '../services/palmReading';

type Params = {
  imageUri: string;
  handSide: PalmHandSide;
  dominantHand: PalmDominantHand;
  focus: PalmReadingFocus;
};

type Props = {
  navigation: {
    navigate: (
      routeName: string,
      params?: Record<string, unknown>,
    ) => void;
    replace?: (
      routeName: string,
      params?: Record<string, unknown>,
    ) => void;
  };
  route: {
    params: Params;
  };
};

type Option<T extends string> = {
  value: T;
  labelKey: string;
  labelFallback: string;
};

const PALM_SHAPES:
Option<PalmShape>[] = [
  {
    value: 'earth',
    labelKey: 'palmReading.shapes.earth',
    labelFallback: 'Earth',
  },
  {
    value: 'air',
    labelKey: 'palmReading.shapes.air',
    labelFallback: 'Air',
  },
  {
    value: 'water',
    labelKey: 'palmReading.shapes.water',
    labelFallback: 'Water',
  },
  {
    value: 'fire',
    labelKey: 'palmReading.shapes.fire',
    labelFallback: 'Fire',
  },
];

const DEPTHS:
Option<PalmLineDepth>[] = [
  {
    value: 'clear',
    labelKey: 'palmReading.v2.options.clear',
    labelFallback: 'Clear',
  },
  {
    value: 'medium',
    labelKey: 'palmReading.v2.options.medium',
    labelFallback: 'Medium',
  },
  {
    value: 'faint',
    labelKey: 'palmReading.v2.options.faint',
    labelFallback: 'Faint',
  },
];

const LENGTHS:
Option<PalmLineLength>[] = [
  {
    value: 'short',
    labelKey: 'palmReading.v2.options.short',
    labelFallback: 'Short',
  },
  {
    value: 'medium',
    labelKey: 'palmReading.v2.options.medium',
    labelFallback: 'Medium',
  },
  {
    value: 'long',
    labelKey: 'palmReading.v2.options.long',
    labelFallback: 'Long',
  },
];

const CURVES:
Option<PalmLineCurve>[] = [
  {
    value: 'straight',
    labelKey: 'palmReading.v2.options.straight',
    labelFallback: 'Straight',
  },
  {
    value: 'balanced',
    labelKey: 'palmReading.v2.options.balanced',
    labelFallback: 'Balanced',
  },
  {
    value: 'curved',
    labelKey: 'palmReading.v2.options.curved',
    labelFallback: 'Curved',
  },
];

const FATE_OPTIONS:
Option<PalmFateVisibility>[] = [
  {
    value: 'clear',
    labelKey: 'palmReading.v2.options.clear',
    labelFallback: 'Clear',
  },
  {
    value: 'medium',
    labelKey: 'palmReading.v2.options.medium',
    labelFallback: 'Medium',
  },
  {
    value: 'faint',
    labelKey: 'palmReading.v2.options.faint',
    labelFallback: 'Faint',
  },
  {
    value: 'absent',
    labelKey: 'palmReading.v2.options.absent',
    labelFallback: 'Absent',
  },
];

const FINGER_OPTIONS:
Option<PalmFingerShape>[] = [
  {
    value: 'shortWide',
    labelKey: 'palmReading.v2.fingers.shortWide',
    labelFallback: 'Short & wide',
  },
  {
    value: 'balanced',
    labelKey: 'palmReading.v2.fingers.balanced',
    labelFallback: 'Balanced',
  },
  {
    value: 'longSlim',
    labelKey: 'palmReading.v2.fingers.longSlim',
    labelFallback: 'Long & slim',
  },
];

const MOUNT_OPTIONS:
Option<PalmMount>[] = [
  {
    value: 'venus',
    labelKey: 'palmReading.v2.mounts.venus',
    labelFallback: 'Venus',
  },
  {
    value: 'jupiter',
    labelKey: 'palmReading.v2.mounts.jupiter',
    labelFallback: 'Jupiter',
  },
  {
    value: 'saturn',
    labelKey: 'palmReading.v2.mounts.saturn',
    labelFallback: 'Saturn',
  },
  {
    value: 'apollo',
    labelKey: 'palmReading.v2.mounts.apollo',
    labelFallback: 'Apollo',
  },
  {
    value: 'mercury',
    labelKey: 'palmReading.v2.mounts.mercury',
    labelFallback: 'Mercury',
  },
  {
    value: 'moon',
    labelKey: 'palmReading.v2.mounts.moon',
    labelFallback: 'Moon',
  },
  {
    value: 'mars',
    labelKey: 'palmReading.v2.mounts.mars',
    labelFallback: 'Mars',
  },
];

export default function PalmReadingLiteAnalysisScreen({
  navigation,
  route,
}: Props) {
  const {t} =
    useTranslation();

  const [
    palmShape,
    setPalmShape,
  ] =
    useState<PalmShape>('earth');

  const [
    fingerShape,
    setFingerShape,
  ] =
    useState<PalmFingerShape>('balanced');

  const [
    lineClarity,
    setLineClarity,
  ] =
    useState<PalmLineDepth>('medium');

  const [
    lifeLineDepth,
    setLifeLineDepth,
  ] =
    useState<PalmLineDepth>('medium');

  const [
    heartLineLength,
    setHeartLineLength,
  ] =
    useState<PalmLineLength>('medium');

  const [
    heartLineCurve,
    setHeartLineCurve,
  ] =
    useState<PalmLineCurve>('balanced');

  const [
    headLineShape,
    setHeadLineShape,
  ] =
    useState<PalmLineCurve>('balanced');

  const [
    fateLineVisibility,
    setFateLineVisibility,
  ] =
    useState<PalmFateVisibility>('medium');

  const [
    strongestMount,
    setStrongestMount,
  ] =
    useState<PalmMount>('venus');

  const goToResult = () => {
    const observations:
      PalmReadingObservation = {
        palmShape,
        fingerShape,
        lineClarity,
        lifeLineDepth,
        heartLineLength,
        heartLineCurve,
        headLineShape,
        fateLineVisibility,
        strongestMount,
      };

    const params = {
      ...route.params,
      observations,
    };

    if (navigation.replace) {
      navigation.replace(
        'PalmReadingResult',
        params,
      );
    } else {
      navigation.navigate(
        'PalmReadingResult',
        params,
      );
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'palmReading.v2.eyebrow',
            {
              defaultValue:
                'V2 Lite',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'palmReading.v2.title',
            {
              defaultValue:
                'Palm Details',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'palmReading.v2.subtitle',
            {
              defaultValue:
                'Select the visible palm features. This makes the reading more personal without uploading your photo to an AI server.',
            },
          )}
        </Text>

        <Image
          source={{
            uri:
              route.params.imageUri,
          }}
          style={styles.image}
        />

        <Question
          title={t(
            'palmReading.v2.questions.palmShape',
            {
              defaultValue:
                'Palm shape',
            },
          )}
          description={t(
            'palmReading.v2.help.palmShape',
            {
              defaultValue:
                'Earth = square palm, Air = long fingers, Water = soft/long palm, Fire = rectangular palm.',
            },
          )}>
          <OptionGrid
            options={PALM_SHAPES}
            value={palmShape}
            onChange={setPalmShape}
          />
        </Question>

        <Question
          title={t(
            'palmReading.v2.questions.fingerShape',
            {
              defaultValue:
                'Finger shape',
            },
          )}>
          <OptionGrid
            options={FINGER_OPTIONS}
            value={fingerShape}
            onChange={setFingerShape}
          />
        </Question>

        <Question
          title={t(
            'palmReading.v2.questions.lineClarity',
            {
              defaultValue:
                'Overall line clarity',
            },
          )}>
          <OptionGrid
            options={DEPTHS}
            value={lineClarity}
            onChange={setLineClarity}
          />
        </Question>

        <Question
          title={t(
            'palmReading.v2.questions.lifeLineDepth',
            {
              defaultValue:
                'Life line depth',
            },
          )}
          description={t(
            'palmReading.v2.help.lifeLineDepth',
            {
              defaultValue:
                'Life line curves around the base of the thumb.',
            },
          )}>
          <OptionGrid
            options={DEPTHS}
            value={lifeLineDepth}
            onChange={setLifeLineDepth}
          />
        </Question>

        <Question
          title={t(
            'palmReading.v2.questions.heartLineLength',
            {
              defaultValue:
                'Heart line length',
            },
          )}
          description={t(
            'palmReading.v2.help.heartLine',
            {
              defaultValue:
                'Heart line is the upper major line under the fingers.',
            },
          )}>
          <OptionGrid
            options={LENGTHS}
            value={heartLineLength}
            onChange={setHeartLineLength}
          />
        </Question>

        <Question
          title={t(
            'palmReading.v2.questions.heartLineCurve',
            {
              defaultValue:
                'Heart line curve',
            },
          )}>
          <OptionGrid
            options={CURVES}
            value={heartLineCurve}
            onChange={setHeartLineCurve}
          />
        </Question>

        <Question
          title={t(
            'palmReading.v2.questions.headLineShape',
            {
              defaultValue:
                'Head line shape',
            },
          )}
          description={t(
            'palmReading.v2.help.headLine',
            {
              defaultValue:
                'Head line usually crosses the center of the palm.',
            },
          )}>
          <OptionGrid
            options={CURVES}
            value={headLineShape}
            onChange={setHeadLineShape}
          />
        </Question>

        <Question
          title={t(
            'palmReading.v2.questions.fateLineVisibility',
            {
              defaultValue:
                'Fate line visibility',
            },
          )}
          description={t(
            'palmReading.v2.help.fateLine',
            {
              defaultValue:
                'Fate line often runs vertically toward the middle finger. It may be faint or absent.',
            },
          )}>
          <OptionGrid
            options={FATE_OPTIONS}
            value={fateLineVisibility}
            onChange={setFateLineVisibility}
          />
        </Question>

        <Question
          title={t(
            'palmReading.v2.questions.strongestMount',
            {
              defaultValue:
                'Strongest palm mount',
            },
          )}
          description={t(
            'palmReading.v2.help.mount',
            {
              defaultValue:
                'Choose the padded area that looks most prominent.',
            },
          )}>
          <OptionGrid
            options={MOUNT_OPTIONS}
            value={strongestMount}
            onChange={setStrongestMount}
          />
        </Question>

        <Pressable
          style={styles.primaryButton}
          onPress={goToResult}>
          <Text style={styles.primaryText}>
            {t(
              'palmReading.v2.generate',
              {
                defaultValue:
                  'Generate V2 Lite Reading',
              },
            )}
          </Text>
        </Pressable>

        <Text style={styles.notice}>
          {t(
            'palmReading.v2.notice',
            {
              defaultValue:
                'V2 Lite is still symbolic and for entertainment. It uses your selected observations to personalize the result locally.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Question({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.questionCard}>
      <Text style={styles.questionTitle}>
        {title}
      </Text>

      {description ? (
        <Text style={styles.questionDescription}>
          {description}
        </Text>
      ) : null}

      {children}
    </View>
  );
}

function OptionGrid<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const {t} =
    useTranslation();

  return (
    <View style={styles.optionGrid}>
      {options.map(option => {
        const active =
          option.value === value;

        return (
          <Pressable
            key={option.value}
            style={[
              styles.optionChip,
              active &&
                styles.optionChipActive,
            ]}
            onPress={() =>
              onChange(option.value)
            }>
            <Text
              style={[
                styles.optionText,
                active &&
                  styles.optionTextActive,
              ]}>
              {t(option.labelKey, {
                defaultValue:
                  option.labelFallback,
              })}
            </Text>
          </Pressable>
        );
      })}
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
    fontSize: 31,
    lineHeight: 36,
    fontWeight: '900',
    marginTop: 5,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },

  image: {
    width: '100%',
    height: 220,
    backgroundColor: '#DDD3E9',
    borderRadius: 26,
    marginTop: 16,
  },

  questionCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 14,
    marginTop: 12,
  },

  questionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
  },

  questionDescription: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginTop: 10,
  },

  optionChip: {
    backgroundColor: '#EEE6F4',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 9,
    marginHorizontal: 4,
    marginBottom: 8,
  },

  optionChipActive: {
    backgroundColor: COLORS.night,
  },

  optionText: {
    color: COLORS.purple,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  optionTextActive: {
    color: '#F8EBCB',
  },

  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    backgroundColor: COLORS.gold,
    borderRadius: 18,
    marginTop: 16,
  },

  primaryText: {
    color: COLORS.night,
    fontSize: 14,
    fontWeight: '900',
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 14,
  },
});
