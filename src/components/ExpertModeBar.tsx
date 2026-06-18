import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useTranslation,
} from 'react-i18next';

import {
  useExpertMode,
} from '../services/expertMode';

type Props = {
  onOpenSettings?: () => void;
  compact?: boolean;
};

export default function ExpertModeBar({
  onOpenSettings,
  compact = false,
}: Props) {
  const {t} =
    useTranslation();

  const {
    isExpert,
    setMode,
  } =
    useExpertMode();

  return (
    <View
      style={[
        styles.container,
        compact &&
          styles.containerCompact,
      ]}>
      <View style={styles.textWrap}>
        <Text style={styles.eyebrow}>
          {t(
            'expertMode.bar.eyebrow',
          )}
        </Text>

        <Text style={styles.title}>
          {isExpert
            ? t(
                'expertMode.bar.expertTitle',
              )
            : t(
                'expertMode.bar.simpleTitle',
              )}
        </Text>

        {!compact && (
          <Text
            style={
              styles.subtitle
            }>
            {isExpert
              ? t(
                  'expertMode.bar.expertSubtitle',
                )
              : t(
                  'expertMode.bar.simpleSubtitle',
                )}
          </Text>
        )}
      </View>

      <View style={styles.controls}>
        <View style={styles.segment}>
          <Pressable
            style={[
              styles.segmentButton,
              !isExpert &&
                styles.segmentButtonActive,
            ]}
            onPress={() =>
              setMode('simple')
            }>
            <Text
              style={[
                styles.segmentText,
                !isExpert &&
                  styles.segmentTextActive,
              ]}>
              {t(
                'expertMode.modes.simple',
              )}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.segmentButton,
              isExpert &&
                styles.segmentButtonActive,
            ]}
            onPress={() =>
              setMode('expert')
            }>
            <Text
              style={[
                styles.segmentText,
                isExpert &&
                  styles.segmentTextActive,
              ]}>
              {t(
                'expertMode.modes.expert',
              )}
            </Text>
          </Pressable>
        </View>

        {!!onOpenSettings && (
          <Pressable
            style={({pressed}) => [
              styles.settingsButton,
              pressed &&
                styles.pressed,
            ]}
            onPress={
              onOpenSettings
            }>
            <Text
              style={
                styles.settingsButtonText
              }>
              ⚙
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E2D7C5',
    borderRadius: 17,
    padding: 13,
    marginHorizontal: 16,
    marginTop: 13,
  },

  containerCompact: {
    marginHorizontal: 0,
    marginTop: 0,
    paddingVertical: 10,
  },

  textWrap: {
    flex: 1,
    marginRight: 10,
  },

  eyebrow: {
    color: '#9A763D',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  title: {
    color: '#282D36',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 3,
  },

  subtitle: {
    color: '#6C726F',
    fontSize: 9.5,
    lineHeight: 14,
    marginTop: 4,
  },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  segment: {
    flexDirection: 'row',
    backgroundColor: '#EDE6DA',
    borderRadius: 12,
    padding: 3,
  },

  segmentButton: {
    minWidth: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },

  segmentButtonActive: {
    backgroundColor: '#17243A',
  },

  segmentText: {
    color: '#6F675D',
    fontSize: 8.5,
    fontWeight: '900',
  },

  segmentTextActive: {
    color: '#FFF1D0',
  },

  settingsButton: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0E7D8',
    borderRadius: 11,
    marginLeft: 7,
  },

  settingsButtonText: {
    color: '#76572B',
    fontSize: 16,
  },

  pressed: {
    opacity: 0.72,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },
});
