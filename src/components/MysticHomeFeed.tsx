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

import TarotCardImage
  from './TarotCardImage';

import LunaShareButton
  from './LunaShareButton';

import {
  buildMysticHomeFeed,
  type MysticHomeFeedResult,
} from '../services/mysticHomeFeed';

type NavigationLike = {
  navigate: (
    routeName: string,
    params?: Record<string, unknown>,
  ) => void;
};

export default function MysticHomeFeed() {
  const {t} =
    useTranslation();

  const navigation =
    useNavigation<NavigationLike>();

  const [
    data,
    setData,
  ] =
    useState<MysticHomeFeedResult | undefined>();

  const load = useCallback(
    async () => {
      setData(
        await buildMysticHomeFeed(),
      );
    },
    [],
  );

  useFocusEffect(
    useCallback(
      () => {
        void load();
      },
      [load],
    ),
  );

  if (!data) {
    return (
      <View style={styles.loadingCard}>
        <Text style={styles.loadingText}>
          {t(
            'mysticHome.loading',
            {
              defaultValue:
                'Preparing today’s guidance...',
            },
          )}
        </Text>
      </View>
    );
  }

  const card =
    data.dailyCard.card;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.eyebrow}>
            {t(
              'mysticHome.eyebrow',
              {
                defaultValue:
                  'Today for you',
              },
            )}
          </Text>

          <Text style={styles.title}>
            {t(
              `mysticHome.greetings.${data.greetingId}`,
              {
                name:
                  data.profile.name,
                defaultValue:
                  `Today for ${data.profile.name}`,
              },
            )}
          </Text>
        </View>

        <View style={styles.energyOrb}>
          <Text style={styles.energyScore}>
            {data.dailyInsight.energyScore}
          </Text>

          <Text style={styles.energyLabel}>
            {t(
              'mysticHome.energy',
              {
                defaultValue:
                  'Energy',
              },
            )}
          </Text>
        </View>
      </View>

      <View style={styles.bodyRow}>
        <View style={styles.copyWrap}>
          <Text style={styles.message}>
            {t(
              `lunaDailyInsight.actions.${data.dailyInsight.actionId}`,
              {
                defaultValue:
                  'Take one small aligned action before the day gets busy.',
              },
            )}
          </Text>

          <View style={styles.metricsRow}>
            <Metric
              label={t(
                'mysticHome.love',
                {
                  defaultValue:
                    'Love',
                },
              )}
              value={`${data.love.loveScore}`}
            />

            <Metric
              label={t(
                'mysticHome.collection',
                {
                  defaultValue:
                    'Cards',
                },
              )}
              value={`${data.collection.discovered}/${data.collection.total}`}
            />
          </View>
        </View>

        <View style={styles.tarotWrap}>
          <TarotCardImage
            cardId={
              card.id ??
              card.name
            }
            title={card.name}
            reversed={
              data.dailyCard.orientation ===
              'reversed'
            }
            width={72}
            height={114}
          />

          <Text
            numberOfLines={2}
            style={styles.cardName}>
            {card.name}
          </Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <QuickAction
          label={t(
            'mysticHome.dailyRitual',
            {
              defaultValue:
                'Daily Ritual',
            },
          )}
          onPress={() =>
            navigation.navigate(
              'DailyRitual',
            )
          }
        />

        <QuickAction
          label={t(
            'mysticHome.tarot',
            {
              defaultValue:
                'Draw Card',
            },
          )}
          onPress={() =>
            navigation.navigate(
              'TarotReading',
            )
          }
        />

        <QuickAction
          label={t(
            'mysticHome.loveMode',
            {
              defaultValue:
                'Love Mode',
            },
          )}
          onPress={() =>
            navigation.navigate(
              'LoveModeAdvanced',
            )
          }
        />
      </View>

      <LunaShareButton
        compact
        data={{
          variant: 'dailyInsight',
          title:
            t(
              'mysticHome.shareTitle',
              {
                defaultValue:
                  'Today’s Luna Oracle',
              },
            ),
          subtitle:
            t(
              'mysticHome.shareSubtitle',
              {
                name:
                  data.profile.name,
                defaultValue:
                  `For ${data.profile.name}`,
              },
            ),
          message:
            t(
              `lunaDailyInsight.actions.${data.dailyInsight.actionId}`,
              {
                defaultValue:
                  'Take one small aligned action before the day gets busy.',
              },
            ),
          score:
            data.dailyInsight.energyScore,
          cardId:
            card.id ??
            card.name,
          cardName:
            card.name,
          reversed:
            data.dailyCard.orientation ===
            'reversed',
          badge: 'TODAY',
          tags: [
            'daily',
            'tarot',
            'luna',
          ],
        }}
      />
    </View>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>
        {value}
      </Text>

      <Text style={styles.metricLabel}>
        {label}
      </Text>
    </View>
  );
}

function QuickAction({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({pressed}) => [
        styles.quickAction,
        pressed &&
          styles.pressed,
      ]}
      onPress={onPress}>
      <Text style={styles.quickActionText}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loadingCard: {
    backgroundColor: '#1B1537',
    borderRadius: 26,
    padding: 18,
    marginTop: 16,
  },

  loadingText: {
    color: '#F8EBCB',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },

  card: {
    overflow: 'hidden',
    backgroundColor: '#1B1537',
    borderRadius: 30,
    padding: 16,
    marginTop: 16,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleWrap: {
    flex: 1,
  },

  eyebrow: {
    color: '#D9B76E',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  title: {
    color: '#FFF8EA',
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '900',
    marginTop: 4,
  },

  energyOrb: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(217,183,110,0.14)',
    borderWidth: 1,
    borderColor: '#D9B76E',
    borderRadius: 36,
    marginLeft: 12,
  },

  energyScore: {
    color: '#FFF8EA',
    fontSize: 26,
    fontWeight: '900',
  },

  energyLabel: {
    color: '#D9B76E',
    fontSize: 8,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  bodyRow: {
    flexDirection: 'row',
    marginTop: 14,
  },

  copyWrap: {
    flex: 1,
    paddingRight: 12,
  },

  message: {
    color: '#F8EBCB',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '800',
  },

  metricsRow: {
    flexDirection: 'row',
    marginTop: 13,
  },

  metric: {
    minWidth: 84,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 10,
    marginRight: 8,
  },

  metricValue: {
    color: '#FFF8EA',
    fontSize: 18,
    fontWeight: '900',
  },

  metricLabel: {
    color: '#BEB3DD',
    fontSize: 9,
    fontWeight: '900',
    marginTop: 2,
    textTransform: 'uppercase',
  },

  tarotWrap: {
    width: 88,
    alignItems: 'center',
  },

  cardName: {
    color: '#DCD2F3',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 7,
  },

  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
    marginHorizontal: -4,
  },

  quickAction: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    marginBottom: 8,
  },

  quickActionText: {
    color: '#F8EBCB',
    fontSize: 11,
    fontWeight: '900',
  },

  pressed: {
    opacity: 0.75,
  },
});
