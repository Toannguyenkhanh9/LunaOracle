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
  PalmLineReading,
} from '../services/palmReading';

type Props = {
  line: PalmLineReading;
};

export default function PalmReadingCard({
  line,
}: Props) {
  const {t} =
    useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.scoreOrb}>
        <Text style={styles.score}>
          {line.score}
        </Text>
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>
          {t(line.titleKey, {
            defaultValue:
              line.titleFallback,
          })}
        </Text>

        <Text style={styles.message}>
          {t(line.messageKey, {
            defaultValue:
              line.messageFallback,
          })}
        </Text>

        <View style={styles.actionBox}>
          <Text style={styles.actionLabel}>
            {t(
              'palmReading.action',
              {
                defaultValue:
                  'Action',
              },
            )}
          </Text>

          <Text style={styles.actionText}>
            {t(line.actionKey, {
              defaultValue:
                line.actionFallback,
            })}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E9DCC5',
    borderRadius: 22,
    padding: 14,
    marginBottom: 10,
  },

  scoreOrb: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B1537',
    borderRadius: 18,
    marginRight: 13,
  },

  score: {
    color: '#D9B76E',
    fontSize: 20,
    fontWeight: '900',
  },

  copy: {
    flex: 1,
  },

  title: {
    color: '#282236',
    fontSize: 16,
    fontWeight: '900',
  },

  message: {
    color: '#756D7D',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },

  actionBox: {
    backgroundColor: '#F7F2EA',
    borderRadius: 15,
    padding: 10,
    marginTop: 10,
  },

  actionLabel: {
    color: '#9A7939',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  actionText: {
    color: '#282236',
    fontSize: 11.5,
    lineHeight: 17,
    fontWeight: '800',
    marginTop: 4,
  },
});
