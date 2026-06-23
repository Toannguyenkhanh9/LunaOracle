import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useTranslation,
} from 'react-i18next';

import type {
  LunaAchievement,
} from '../services/lunaAchievements';

type Props = {
  achievement: LunaAchievement;
};

export default function AchievementBadge({
  achievement,
}: Props) {
  const {t} =
    useTranslation();

  const percent =
    Math.round(
      (
        achievement.progress /
        achievement.target
      ) *
        100,
    );

  return (
    <View
      style={[
        styles.badge,
        achievement.unlocked &&
          styles.badgeUnlocked,
      ]}>
      <View
        style={[
          styles.iconCircle,
          achievement.unlocked &&
            styles.iconCircleUnlocked,
        ]}>
        <Text
          style={[
            styles.icon,
            achievement.unlocked &&
              styles.iconUnlocked,
          ]}>
          {achievement.icon}
        </Text>
      </View>

      <View style={styles.copy}>
        <Text
          style={[
            styles.title,
            achievement.unlocked &&
              styles.titleUnlocked,
          ]}>
          {t(
            `lunaAchievements.items.${achievement.id}.title`,
            {
              defaultValue:
                achievement.id,
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            `lunaAchievements.items.${achievement.id}.subtitle`,
            {
              defaultValue:
                'Complete this milestone.',
            },
          )}
        </Text>

        <View style={styles.progressRow}>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                {
                  width:
                    `${Math.min(
                      100,
                      percent,
                    )}%`,
                },
                achievement.unlocked &&
                  styles.fillUnlocked,
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {achievement.progress}/
            {achievement.target}
          </Text>
        </View>
      </View>
    </View>
  );
}

const COLORS = {
  paper: '#FFFDF8',
  border: '#E9DCC5',
  night: '#1B1537',
  purple: '#6E4DA8',
  gold: '#D9B76E',
  text: '#282236',
  muted: '#756D7D',
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
  },

  badgeUnlocked: {
    backgroundColor: '#FFF7E4',
    borderColor: COLORS.gold,
  },

  iconCircle: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE6F4',
    borderRadius: 26,
    marginRight: 12,
  },

  iconCircleUnlocked: {
    backgroundColor: COLORS.night,
  },

  icon: {
    color: COLORS.purple,
    fontSize: 25,
    fontWeight: '900',
  },

  iconUnlocked: {
    color: COLORS.gold,
  },

  copy: {
    flex: 1,
  },

  title: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
  },

  titleUnlocked: {
    color: COLORS.night,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
  },

  track: {
    flex: 1,
    height: 7,
    overflow: 'hidden',
    backgroundColor: '#EEE6F4',
    borderRadius: 99,
  },

  fill: {
    height: 7,
    backgroundColor: '#B9A7D8',
    borderRadius: 99,
  },

  fillUnlocked: {
    backgroundColor: COLORS.gold,
  },

  progressText: {
    width: 48,
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'right',
  },
});
