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

import type {
  OracleJourneyDay,
} from '../services/oracleJourney';

type Props = {
  day: OracleJourneyDay;
  completed: boolean;
  claimed: boolean;
  onComplete: () => void;
  onClaim: () => void;
};

export default function JourneyDayCard({
  day,
  completed,
  claimed,
  onComplete,
  onClaim,
}: Props) {
  const {t} =
    useTranslation();

  return (
    <View
      style={[
        styles.card,
        completed &&
          styles.cardDone,
      ]}>
      <View style={styles.dayOrb}>
        <Text style={styles.dayNumber}>
          {day.day}
        </Text>

        <Text style={styles.dayLabel}>
          {t(
            'journey.day',
            {
              defaultValue:
                'Day',
            },
          )}
        </Text>
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>
          {t(day.titleKey, {
            defaultValue:
              day.titleFallback,
          })}
        </Text>

        <Text style={styles.prompt}>
          {t(day.promptKey, {
            defaultValue:
              day.promptFallback,
          })}
        </Text>

        <Text style={styles.action}>
          {t(day.actionKey, {
            defaultValue:
              day.actionFallback,
          })}
        </Text>

        <View style={styles.row}>
          <Text style={styles.reward}>
            +{day.moonDustReward} ✦
          </Text>

          {!completed ? (
            <Pressable
              style={styles.button}
              onPress={onComplete}>
              <Text style={styles.buttonText}>
                {t(
                  'journey.complete',
                  {
                    defaultValue:
                      'Complete',
                  },
                )}
              </Text>
            </Pressable>
          ) : !claimed ? (
            <Pressable
              style={styles.claimButton}
              onPress={onClaim}>
              <Text style={styles.claimText}>
                {t(
                  'journey.claim',
                  {
                    defaultValue:
                      'Claim',
                  },
                )}
              </Text>
            </Pressable>
          ) : (
            <Text style={styles.claimed}>
              {t(
                'journey.claimed',
                {
                  defaultValue:
                    'Claimed',
                },
              )}
            </Text>
          )}
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
    borderRadius: 24,
    padding: 14,
  },

  cardDone: {
    backgroundColor: '#FFF8EA',
    borderColor: '#D9B76E',
  },

  dayOrb: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B1537',
    borderRadius: 20,
    marginRight: 13,
  },

  dayNumber: {
    color: '#FFF8EA',
    fontSize: 22,
    fontWeight: '900',
  },

  dayLabel: {
    color: '#D9B76E',
    fontSize: 8,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  copy: {
    flex: 1,
  },

  title: {
    color: '#282236',
    fontSize: 16,
    fontWeight: '900',
  },

  prompt: {
    color: '#756D7D',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },

  action: {
    color: '#4D405E',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    marginTop: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 11,
  },

  reward: {
    color: '#6E4DA8',
    fontSize: 11,
    fontWeight: '900',
  },

  button: {
    backgroundColor: '#1B1537',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginLeft: 'auto',
  },

  buttonText: {
    color: '#F8EBCB',
    fontSize: 11,
    fontWeight: '900',
  },

  claimButton: {
    backgroundColor: '#D9B76E',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginLeft: 'auto',
  },

  claimText: {
    color: '#1B1537',
    fontSize: 11,
    fontWeight: '900',
  },

  claimed: {
    color: '#9A7939',
    fontSize: 11,
    fontWeight: '900',
    marginLeft: 'auto',
    textTransform: 'uppercase',
  },
});
