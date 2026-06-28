import React, {
  useCallback,
  useState,
} from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import {
  getDailyQuestDashboard,
  type DailyQuestDashboard,
} from '../services/oracleEngagement';

import OracleLevelBadge
  from './OracleLevelBadge';

type NavigationLike = {
  navigate: (routeName: string) => void;
};

export default function OracleProgressCard() {
  const {t} = useTranslation();
  const navigation =
    useNavigation<NavigationLike>();

  const [dashboard, setDashboard] =
    useState<DailyQuestDashboard | undefined>();

  const load = useCallback(async () => {
    setDashboard(
      await getDailyQuestDashboard(),
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (!dashboard) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <OracleLevelBadge
        level={dashboard.level}
        totalExp={
          dashboard.progress.totalExp
        }
        progress={
          dashboard.levelProgress
        }
        expToNextLevel={
          dashboard.expToNextLevel
        }
      />

      <View style={styles.questRow}>
        <View>
          <Text style={styles.questTitle}>
            {t(
              'dailyQuest.todayProgress',
              {
                defaultValue:
                  'Today’s quests',
              },
            )}
          </Text>

          <Text style={styles.questSubtitle}>
            {dashboard.completedCount}/
            {dashboard.totalCount}{' '}
            {t(
              'dailyQuest.completed',
              {
                defaultValue:
                  'completed',
              },
            )}
          </Text>
        </View>

        <Pressable
          style={styles.openButton}
          onPress={() =>
            navigation.navigate(
              'DailyQuest',
            )
          }>
          <Text style={styles.openText}>
            {t('dailyQuest.open', {
              defaultValue: 'Open',
            })}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 16,
  },

  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E9DCC5',
    borderRadius: 20,
    padding: 14,
    marginTop: 10,
  },

  questTitle: {
    color: '#282236',
    fontSize: 15,
    fontWeight: '900',
  },

  questSubtitle: {
    color: '#756D7D',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },

  openButton: {
    backgroundColor: '#D9B76E',
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginLeft: 'auto',
  },

  openText: {
    color: '#1B1537',
    fontSize: 11,
    fontWeight: '900',
  },
});
