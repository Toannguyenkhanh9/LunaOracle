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
  OracleLevel,
} from '../services/oracleEngagement';

type Props = {
  level: OracleLevel;
  totalExp: number;
  progress: number;
  expToNextLevel: number;
};

export default function OracleLevelBadge({
  level,
  totalExp,
  progress,
  expToNextLevel,
}: Props) {
  const {t} = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.orb}>
        <Text style={styles.levelNumber}>
          {level.level}
        </Text>

        <Text style={styles.levelLabel}>
          LVL
        </Text>
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>
          {t(level.titleKey, {
            defaultValue:
              level.titleFallback,
          })}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'oracleLevel.totalExp',
            {
              exp: totalExp,
              defaultValue:
                `${totalExp} EXP`,
            },
          )}
        </Text>

        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              {
                width:
                  `${Math.max(
                    0,
                    Math.min(
                      100,
                      progress,
                    ),
                  )}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.nextText}>
          {expToNextLevel > 0
            ? t(
                'oracleLevel.toNext',
                {
                  exp:
                    expToNextLevel,
                  defaultValue:
                    `${expToNextLevel} EXP to next level`,
                },
              )
            : t(
                'oracleLevel.maxLevel',
                {
                  defaultValue:
                    'Max level reached',
                },
              )}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B1537',
    borderRadius: 26,
    padding: 16,
  },

  orb: {
    width: 82,
    height: 82,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(217,183,110,0.14)',
    borderWidth: 1,
    borderColor: '#D9B76E',
    borderRadius: 41,
  },

  levelNumber: {
    color: '#FFF8EA',
    fontSize: 34,
    fontWeight: '900',
  },

  levelLabel: {
    color: '#D9B76E',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  copy: {
    flex: 1,
    marginLeft: 14,
  },

  title: {
    color: '#FFF8EA',
    fontSize: 20,
    fontWeight: '900',
  },

  subtitle: {
    color: '#DCD2F3',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
  },

  track: {
    overflow: 'hidden',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 999,
    marginTop: 11,
  },

  fill: {
    height: 8,
    backgroundColor: '#D9B76E',
    borderRadius: 999,
  },

  nextText: {
    color: '#BEB3DD',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 6,
  },
});
