import React, {
  useState,
} from 'react';

import {
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
  PalmHandSide,
  PalmReadingFocus,
} from '../services/palmReading';

type NavigationLike = {
  navigate: (
    routeName: string,
    params?: Record<string, unknown>,
  ) => void;
};

type Props = {
  navigation: NavigationLike;
};

const FOCUS_OPTIONS:
PalmReadingFocus[] = [
  'general',
  'love',
  'career',
  'energy',
  'spiritual',
];

export default function PalmReadingIntroScreen({
  navigation,
}: Props) {
  const {t} =
    useTranslation();

  const [
    handSide,
    setHandSide,
  ] =
    useState<PalmHandSide>('left');

  const [
    dominantHand,
    setDominantHand,
  ] =
    useState<PalmDominantHand>('right');

  const [
    focus,
    setFocus,
  ] =
    useState<PalmReadingFocus>('general');

  const startCamera = () => {
    navigation.navigate(
      'PalmReadingCamera',
      {
        handSide,
        dominantHand,
        focus,
      },
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'palmReading.eyebrow',
            {
              defaultValue:
                'Palmistry',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'palmReading.title',
            {
              defaultValue:
                'Palm Reading',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'palmReading.subtitle',
            {
              defaultValue:
                'Capture your palm and receive a reflective palmistry reading for love, career, energy, and inner guidance.',
            },
          )}
        </Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>
            ✋
          </Text>

          <Text style={styles.heroTitle}>
            {t(
              'palmReading.introHeroTitle',
              {
                defaultValue:
                  'Prepare your palm',
              },
            )}
          </Text>

          <Text style={styles.heroText}>
            {t(
              'palmReading.introHeroText',
              {
                defaultValue:
                  'Use bright light, open your palm fully, keep fingers relaxed, and capture the center of your palm clearly.',
              },
            )}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          {t(
            'palmReading.handToRead',
            {
              defaultValue:
                'Which hand do you want to read?',
            },
          )}
        </Text>

        <View style={styles.optionRow}>
          <Choice
            label={t(
              'palmReading.leftHand',
              {
                defaultValue:
                  'Left hand',
              },
            )}
            active={handSide === 'left'}
            onPress={() =>
              setHandSide('left')
            }
          />

          <Choice
            label={t(
              'palmReading.rightHand',
              {
                defaultValue:
                  'Right hand',
              },
            )}
            active={handSide === 'right'}
            onPress={() =>
              setHandSide('right')
            }
          />
        </View>

        <Text style={styles.sectionTitle}>
          {t(
            'palmReading.dominantHand',
            {
              defaultValue:
                'Dominant hand',
            },
          )}
        </Text>

        <View style={styles.optionRow}>
          <Choice
            label={t(
              'palmReading.leftHand',
              {
                defaultValue:
                  'Left hand',
              },
            )}
            active={dominantHand === 'left'}
            onPress={() =>
              setDominantHand('left')
            }
          />

          <Choice
            label={t(
              'palmReading.rightHand',
              {
                defaultValue:
                  'Right hand',
              },
            )}
            active={dominantHand === 'right'}
            onPress={() =>
              setDominantHand('right')
            }
          />
        </View>

        <Text style={styles.sectionTitle}>
          {t(
            'palmReading.focus',
            {
              defaultValue:
                'Reading focus',
            },
          )}
        </Text>

        <View style={styles.focusGrid}>
          {FOCUS_OPTIONS.map(item => (
            <Pressable
              key={item}
              style={[
                styles.focusChip,
                focus === item &&
                  styles.focusChipActive,
              ]}
              onPress={() =>
                setFocus(item)
              }>
              <Text
                style={[
                  styles.focusText,
                  focus === item &&
                    styles.focusTextActive,
                ]}>
                {t(
                  `palmReading.focusOptions.${item}`,
                  {
                    defaultValue:
                      item,
                  },
                )}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={startCamera}>
          <Text style={styles.primaryText}>
            {t(
              'palmReading.openCamera',
              {
                defaultValue:
                  'Open Camera',
              },
            )}
          </Text>
        </Pressable>

        <Pressable
          style={styles.historyButton}
          onPress={() =>
            navigation.navigate(
              'PalmReadingHistory',
            )
          }>
          <Text style={styles.historyText}>
            {t(
              'palmReading.history',
              {
                defaultValue:
                  'History',
              },
            )}
          </Text>
        </Pressable>

        <Text style={styles.disclaimer}>
          {t(
            'palmReading.disclaimer',
            {
              defaultValue:
                'Palm reading is for entertainment, reflection, and self-awareness only. It should not be used as medical, financial, legal, or professional advice.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Choice({
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
        styles.choice,
        active &&
          styles.choiceActive,
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.choiceText,
          active &&
            styles.choiceTextActive,
        ]}>
        {label}
      </Text>
    </Pressable>
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

  heroCard: {
    alignItems: 'center',
    backgroundColor: COLORS.night,
    borderRadius: 28,
    padding: 22,
    marginTop: 16,
  },

  heroIcon: {
    fontSize: 56,
  },

  heroTitle: {
    color: '#FFF8EA',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 10,
  },

  heroText: {
    color: '#DCD2F3',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 7,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 20,
    marginBottom: 10,
  },

  optionRow: {
    flexDirection: 'row',
    marginHorizontal: -5,
  },

  choice: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingVertical: 13,
    marginHorizontal: 5,
  },

  choiceActive: {
    backgroundColor: COLORS.night,
    borderColor: COLORS.gold,
  },

  choiceText: {
    color: COLORS.purple,
    fontSize: 12,
    fontWeight: '900',
  },

  choiceTextActive: {
    color: '#F8EBCB',
  },

  focusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },

  focusChip: {
    backgroundColor: '#EEE6F4',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginHorizontal: 4,
    marginBottom: 8,
  },

  focusChipActive: {
    backgroundColor: COLORS.night,
  },

  focusText: {
    color: COLORS.purple,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  focusTextActive: {
    color: '#F8EBCB',
  },

  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    backgroundColor: COLORS.gold,
    borderRadius: 18,
    marginTop: 18,
  },

  primaryText: {
    color: COLORS.night,
    fontSize: 14,
    fontWeight: '900',
  },

  historyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: '#EEE6F4',
    borderRadius: 17,
    marginTop: 10,
  },

  historyText: {
    color: COLORS.purple,
    fontSize: 13,
    fontWeight: '900',
  },

  disclaimer: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 14,
  },
});
