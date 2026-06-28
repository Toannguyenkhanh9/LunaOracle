import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import {
  useTranslation,
} from 'react-i18next';

import type {
  LunaMood,
} from '../services/moodTracker';

type Props = {
  mood: LunaMood;
  active: boolean;
  onPress: () => void;
};

const EMOJIS:
Record<LunaMood, string> = {
  calm: '🌙',
  hopeful: '🌤',
  focused: '🎯',
  anxious: '🌫',
  sad: '🌧',
  loved: '💗',
  tired: '🕯',
  grateful: '✨',
};

export default function MoodChip({
  mood,
  active,
  onPress,
}: Props) {
  const {t} =
    useTranslation();

  return (
    <Pressable
      style={[
        styles.chip,
        active &&
          styles.chipActive,
      ]}
      onPress={onPress}>
      <Text style={styles.emoji}>
        {EMOJIS[mood]}
      </Text>

      <Text
        style={[
          styles.label,
          active &&
            styles.labelActive,
        ]}>
        {t(
          `moodTracker.moods.${mood}`,
          {
            defaultValue:
              mood,
          },
        )}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 16,
  },

  chipActive: {
    backgroundColor: '#1B1537',
  },

  emoji: {
    fontSize: 22,
  },

  label: {
    color: '#756D7D',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 4,
    textTransform: 'capitalize',
  },

  labelActive: {
    color: '#F8EBCB',
  },
});
