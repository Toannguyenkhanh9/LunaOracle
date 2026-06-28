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
  MoonDustMilestone,
} from '../services/moonDustRewards';

type Props = {
  milestone: MoonDustMilestone;
  unlocked: boolean;
  active?: boolean;
};

export default function MoonDustRewardCard({
  milestone,
  unlocked,
  active,
}: Props) {
  const {t} =
    useTranslation();

  return (
    <View
      style={[
        styles.card,
        active &&
          styles.cardActive,
        unlocked &&
          styles.cardUnlocked,
      ]}>
      <View style={styles.dayOrb}>
        <Text style={styles.dayText}>
          {milestone.day}
        </Text>

        <Text style={styles.dayLabel}>
          {t(
            'moonDust.day',
            {
              defaultValue:
                'Day',
            },
          )}
        </Text>
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>
          {milestone.unlock
            ? t(
                milestone.unlock.titleKey,
                {
                  defaultValue:
                    milestone.unlock.titleFallback,
                },
              )
            : t(
                'moonDust.moonDustAmount',
                {
                  amount:
                    milestone.moonDust,
                  defaultValue:
                    `${milestone.moonDust} Moon Dust`,
                },
              )}
        </Text>

        <Text style={styles.subtitle}>
          {milestone.unlock
            ? t(
                milestone.unlock.descriptionKey,
                {
                  defaultValue:
                    milestone.unlock.descriptionFallback,
                },
              )
            : t(
                'moonDust.dailyBonus',
                {
                  defaultValue:
                    'Daily streak bonus',
                },
              )}
        </Text>
      </View>

      <View style={styles.amountPill}>
        <Text style={styles.amountText}>
          +{milestone.moonDust}
        </Text>

        <Text style={styles.amountIcon}>
          ✦
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E9DCC5',
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
  },

  cardActive: {
    borderColor: '#D9B76E',
    backgroundColor: '#FFF8EA',
  },

  cardUnlocked: {
    backgroundColor: '#F4ECFF',
  },

  dayOrb: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B1537',
    borderRadius: 18,
  },

  dayText: {
    color: '#FFF8EA',
    fontSize: 20,
    fontWeight: '900',
  },

  dayLabel: {
    color: '#D9B76E',
    fontSize: 7,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  copy: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    color: '#282236',
    fontSize: 14,
    fontWeight: '900',
  },

  subtitle: {
    color: '#756D7D',
    fontSize: 10.5,
    lineHeight: 16,
    marginTop: 4,
  },

  amountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217,183,110,0.16)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 6,
    marginLeft: 8,
  },

  amountText: {
    color: '#9A7939',
    fontSize: 12,
    fontWeight: '900',
  },

  amountIcon: {
    color: '#D9B76E',
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 3,
  },
});
