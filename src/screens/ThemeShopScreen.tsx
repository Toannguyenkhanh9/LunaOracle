import React, {
  useCallback,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import ThemePreviewCard
  from '../components/ThemePreviewCard';

import {
  ORACLE_CARD_BACK_ITEMS,
  ORACLE_THEME_ITEMS,
  equipOracleShopItem,
  getOracleShopState,
  purchaseOracleShopItem,
  type OracleShopItem,
  type OracleShopState,
} from '../services/oracleShop';

import {
  getMoonDustRewardState,
} from '../services/moonDustRewards';

type Tab =
  | 'theme'
  | 'cardBack';

export default function ThemeShopScreen() {
  const {t} =
    useTranslation();

  const [
    tab,
    setTab,
  ] =
    useState<Tab>('theme');

  const [
    state,
    setState,
  ] =
    useState<OracleShopState | undefined>();

  const [
    moonDust,
    setMoonDust,
  ] =
    useState(0);

  const load = useCallback(
    async () => {
      const [
        nextState,
        rewards,
      ] =
        await Promise.all([
          getOracleShopState(),
          getMoonDustRewardState(),
        ]);

      setState(nextState);
      setMoonDust(rewards.balance);
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

  const items =
    tab === 'theme'
      ? ORACLE_THEME_ITEMS
      : ORACLE_CARD_BACK_ITEMS;

  const isUnlocked = (
    item: OracleShopItem,
  ) =>
    state
      ? item.type === 'theme'
        ? state.unlockedThemeIds.includes(
            item.id as never,
          )
        : state.unlockedCardBackIds.includes(
            item.id as never,
          )
      : false;

  const isActive = (
    item: OracleShopItem,
  ) =>
    state
      ? item.type === 'theme'
        ? state.activeThemeId ===
          item.id
        : state.activeCardBackId ===
          item.id
      : false;

  const handlePress =
    async (
      item: OracleShopItem,
    ) => {
      if (!state) {
        return;
      }

      if (isUnlocked(item)) {
        const next =
          await equipOracleShopItem(
            item.type,
            item.id,
          );

        if (next) {
          setState(next);
        }

        return;
      }

      const result =
        await purchaseOracleShopItem(
          item.type,
          item.id,
        );

      if (!result.success) {
        Alert.alert(
          t(
            'oracleShop.notEnoughTitle',
            {
              defaultValue:
                'Not enough Moon Dust',
            },
          ),
          t(
            'oracleShop.notEnoughMessage',
            {
              defaultValue:
                'Claim daily rewards to earn more Moon Dust.',
            },
          ),
        );

        return;
      }

      const equipped =
        await equipOracleShopItem(
          item.type,
          item.id,
        );

      setState(
        equipped ??
          result.state,
      );

      const rewards =
        await getMoonDustRewardState();

      setMoonDust(
        rewards.balance,
      );
    };

  if (!state) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>
            {t('common.loading', {
              defaultValue: 'Loading...',
            })}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'oracleShop.eyebrow',
            {
              defaultValue:
                'Shop',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'oracleShop.title',
            {
              defaultValue:
                'Theme & Card Back Shop',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'oracleShop.subtitle',
            {
              defaultValue:
                'Spend Moon Dust to unlock themes, card backs, and mystical styles.',
            },
          )}
        </Text>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>
            {t(
              'moonDust.balance',
              {
                defaultValue:
                  'Balance',
              },
            )}
          </Text>

          <Text style={styles.balanceValue}>
            {moonDust} ✦
          </Text>
        </View>

        <View style={styles.tabRow}>
          <Pressable
            style={[
              styles.tabButton,
              tab === 'theme' &&
                styles.tabButtonActive,
            ]}
            onPress={() =>
              setTab('theme')
            }>
            <Text
              style={[
                styles.tabText,
                tab === 'theme' &&
                  styles.tabTextActive,
              ]}>
              {t(
                'oracleShop.themes',
                {
                  defaultValue:
                    'Themes',
                },
              )}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tabButton,
              tab === 'cardBack' &&
                styles.tabButtonActive,
            ]}
            onPress={() =>
              setTab('cardBack')
            }>
            <Text
              style={[
                styles.tabText,
                tab === 'cardBack' &&
                  styles.tabTextActive,
              ]}>
              {t(
                'oracleShop.cardBacks',
                {
                  defaultValue:
                    'Card Backs',
                },
              )}
            </Text>
          </Pressable>
        </View>

        {items.map(item => (
          <Pressable
            key={`${item.type}-${item.id}`}
            style={({pressed}) => [
              styles.itemCard,
              isActive(item) &&
                styles.itemCardActive,
              pressed &&
                styles.pressed,
            ]}
            onPress={() =>
              handlePress(item)
            }>
            <ThemePreviewCard
              item={item}
              unlocked={isUnlocked(item)}
              active={isActive(item)}
            />

            <View style={styles.itemCopy}>
              <Text style={styles.itemTitle}>
                {t(
                  item.titleKey,
                  {
                    defaultValue:
                      item.titleFallback,
                  },
                )}
              </Text>

              <Text style={styles.itemSubtitle}>
                {t(
                  item.descriptionKey,
                  {
                    defaultValue:
                      item.descriptionFallback,
                  },
                )}
              </Text>

              <Text style={styles.itemMeta}>
                {isActive(item)
                  ? t(
                      'oracleShop.active',
                      {
                        defaultValue:
                          'Active',
                      },
                    )
                  : isUnlocked(item)
                    ? t(
                        'oracleShop.tapToEquip',
                        {
                          defaultValue:
                            'Tap to equip',
                        },
                      )
                    : t(
                        'oracleShop.unlockCost',
                        {
                          cost:
                            item.cost,
                          defaultValue:
                            `${item.cost} Moon Dust`,
                        },
                      )}
              </Text>
            </View>
          </Pressable>
        ))}

        <Text style={styles.notice}>
          {t(
            'oracleShop.notice',
            {
              defaultValue:
                'Themes and card backs are stored locally on this device. Connect them to your global theme system when ready.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = {
  cream: '#F7F2EA',
  paper: '#FFFDF8',
  border: '#E9DCC5',
  night: '#1B1537',
  purple: '#6E4DA8',
  gold: '#D9B76E',
  text: '#282236',
  muted: '#756D7D',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: COLORS.muted,
    fontWeight: '800',
  },

  content: {
    padding: 18,
    paddingBottom: 110,
  },

  eyebrow: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  title: {
    color: COLORS.text,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '900',
    marginTop: 5,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },

  balanceCard: {
    backgroundColor: COLORS.night,
    borderRadius: 24,
    padding: 16,
    marginTop: 16,
  },

  balanceLabel: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  balanceValue: {
    color: '#FFF8EA',
    fontSize: 34,
    fontWeight: '900',
    marginTop: 4,
  },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#EEE6F4',
    borderRadius: 16,
    padding: 5,
    marginTop: 14,
    marginBottom: 14,
  },

  tabButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 11,
  },

  tabButtonActive: {
    backgroundColor: COLORS.night,
  },

  tabText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '900',
  },

  tabTextActive: {
    color: '#F8EBCB',
  },

  itemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 14,
    marginBottom: 12,
  },

  itemCardActive: {
    borderColor: COLORS.gold,
    backgroundColor: '#FFF8EA',
  },

  itemCopy: {
    flex: 1,
    marginLeft: 14,
  },

  itemTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
  },

  itemSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  itemMeta: {
    color: COLORS.purple,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 10,
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 10,
  },

  pressed: {
    opacity: 0.76,
  },
});
