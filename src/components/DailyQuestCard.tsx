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
  DailyQuest,
} from '../services/oracleEngagement';

type Props = {
  quest: DailyQuest;
  completed: boolean;
  claimed: boolean;
  onOpen: () => void;
  onMarkDone: () => void;
  onClaim: () => void;
};

export default function DailyQuestCard({
  quest,
  completed,
  claimed,
  onOpen,
  onMarkDone,
  onClaim,
}: Props) {
  const {t} = useTranslation();

  const statusText =
    claimed
      ? t('dailyQuest.claimed', {
          defaultValue: 'Claimed',
        })
      : completed
        ? t('dailyQuest.readyToClaim', {
            defaultValue: 'Ready',
          })
        : t('dailyQuest.notDone', {
            defaultValue: 'Not done',
          });

  return (
    <View
      style={[
        styles.card,
        completed && styles.cardDone,
      ]}>
      <View
        style={[
          styles.check,
          completed && styles.checkDone,
        ]}>
        <Text style={styles.checkText}>
          {completed ? '✓' : '✦'}
        </Text>
      </View>

      <View style={styles.copy}>
        <View style={styles.topRow}>
          <Text style={styles.title}>
            {t(quest.titleKey, {
              defaultValue:
                quest.titleFallback,
            })}
          </Text>

          <Text
            style={[
              styles.status,
              completed &&
                styles.statusDone,
            ]}>
            {statusText}
          </Text>
        </View>

        <Text style={styles.description}>
          {t(quest.descriptionKey, {
            defaultValue:
              quest.descriptionFallback,
          })}
        </Text>

        <View style={styles.rewardRow}>
          <Text style={styles.reward}>
            +{quest.expReward} EXP
          </Text>

          <Text style={styles.reward}>
            +{quest.moonDustReward} ✦
          </Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            style={styles.openButton}
            onPress={onOpen}>
            <Text style={styles.openText}>
              {t('dailyQuest.open', {
                defaultValue: 'Open',
              })}
            </Text>
          </Pressable>

          {!completed ? (
            <Pressable
              style={styles.doneButton}
              onPress={onMarkDone}>
              <Text style={styles.doneText}>
                {t('dailyQuest.markDone', {
                  defaultValue: 'Mark Done',
                })}
              </Text>
            </Pressable>
          ) : !claimed ? (
            <Pressable
              style={styles.claimButton}
              onPress={onClaim}>
              <Text style={styles.claimText}>
                {t('dailyQuest.claim', {
                  defaultValue: 'Claim',
                })}
              </Text>
            </Pressable>
          ) : null}
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

  cardDone: {
    backgroundColor: '#FFF8EA',
    borderColor: '#D9B76E',
  },

  check: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE6F4',
    borderRadius: 16,
    marginRight: 12,
  },

  checkDone: {
    backgroundColor: '#D9B76E',
  },

  checkText: {
    color: '#1B1537',
    fontSize: 17,
    fontWeight: '900',
  },

  copy: {
    flex: 1,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    flex: 1,
    color: '#282236',
    fontSize: 14,
    fontWeight: '900',
  },

  status: {
    color: '#756D7D',
    fontSize: 9,
    fontWeight: '900',
    marginLeft: 8,
    textTransform: 'uppercase',
  },

  statusDone: {
    color: '#9A7939',
  },

  description: {
    color: '#756D7D',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  rewardRow: {
    flexDirection: 'row',
    marginTop: 8,
  },

  reward: {
    color: '#6E4DA8',
    fontSize: 10,
    fontWeight: '900',
    marginRight: 12,
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 11,
  },

  openButton: {
    backgroundColor: '#EEE6F4',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginRight: 8,
  },

  openText: {
    color: '#6E4DA8',
    fontSize: 11,
    fontWeight: '900',
  },

  doneButton: {
    backgroundColor: '#1B1537',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  doneText: {
    color: '#F8EBCB',
    fontSize: 11,
    fontWeight: '900',
  },

  claimButton: {
    backgroundColor: '#D9B76E',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  claimText: {
    color: '#1B1537',
    fontSize: 11,
    fontWeight: '900',
  },
});
