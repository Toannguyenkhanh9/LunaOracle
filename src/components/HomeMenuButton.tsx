import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import {colors} from '../theme/colors';

type HomeMenuButtonProps = {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
};

export default function HomeMenuButton({
  icon,
  title,
  subtitle,
  onPress,
}: HomeMenuButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.card,
        pressed && styles.pressed,
      ]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 165,
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,

    shadowColor: colors.primaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 3,
  },

  icon: {
    fontSize: 38,
    marginBottom: 14,
  },

  title: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: '800',
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },

  pressed: {
    opacity: 0.75,
    transform: [{scale: 0.98}],
  },
});