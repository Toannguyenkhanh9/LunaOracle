import React, {useMemo, useState} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';

import type {RootTabParamList} from '../navigation/RootNavigator';
import {
  PREMIUM_CONTENT,
  type PremiumContentCategory,
  type PremiumContentItem,
} from '../services/premiumContent';
import {usePremium} from '../context/PremiumContext';
import {colors} from '../theme/colors';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'PremiumLibrary'
>;

type Filter =
  | 'all'
  | PremiumContentCategory;

const FILTERS: Filter[] = [
  'all',
  'meditation',
  'sleep',
  'ritual',
  'theme',
];

export default function PremiumLibraryScreen({
  navigation,
}: Props) {
  const {t} = useTranslation();
  const {isPremium} = usePremium();

  const [filter, setFilter] =
    useState<Filter>('all');

  const items = useMemo(
    () =>
      PREMIUM_CONTENT.filter(
        item =>
          filter === 'all' ||
          item.category === filter,
      ),
    [filter],
  );

  const openItem = (
    item: PremiumContentItem,
  ) => {
    if (item.premium && !isPremium) {
      Alert.alert(
        t('premiumContent.lockedTitle'),
        t(
          'premiumContent.lockedMessage',
        ),
        [
          {
            text: t('common.cancel'),
            style: 'cancel',
          },
          {
            text: t(
              'premiumContent.upgrade',
            ),
            onPress: () =>
              navigation.navigate(
                'Premium',
              ),
          },
        ],
      );

      return;
    }

    navigation.navigate(
      'PremiumContentDetail',
      {
        contentId: item.id,
      },
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }>
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>
            ✨
          </Text>

          <Text style={styles.title}>
            {t('premiumContent.title')}
          </Text>

          <Text style={styles.subtitle}>
            {t(
              'premiumContent.subtitle',
            )}
          </Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {isPremium
                ? t(
                    'premiumContent.premiumActive',
                  )
                : t(
                    'premiumContent.freePlan',
                  )}
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.filterRow
          }>
          {FILTERS.map(item => (
            <Pressable
              key={item}
              style={[
                styles.filterButton,
                filter === item &&
                  styles.filterButtonSelected,
              ]}
              onPress={() =>
                setFilter(item)
              }>
              <Text
                style={[
                  styles.filterText,
                  filter === item &&
                    styles.filterTextSelected,
                ]}>
                {t(
                  `premiumContent.categories.${item}`,
                )}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {items.map(item => (
          <Pressable
            key={item.id}
            style={({pressed}) => [
              styles.itemCard,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              openItem(item)
            }>
            <View style={styles.itemIconWrap}>
              <Text style={styles.itemIcon}>
                {item.icon}
              </Text>
            </View>

            <View style={styles.itemInfo}>
              <View style={styles.itemTitleRow}>
                <Text style={styles.itemTitle}>
                  {t(item.titleKey)}
                </Text>

                {item.premium && (
                  <Text
                    style={
                      styles.premiumBadge
                    }>
                    {isPremium
                      ? '✓'
                      : 'PREMIUM'}
                  </Text>
                )}
              </View>

              <Text
                style={
                  styles.itemDescription
                }>
                {t(item.descriptionKey)}
              </Text>

              {!!item.durationMinutes && (
                <Text style={styles.duration}>
                  {t(
                    'premiumContent.minutes',
                    {
                      count:
                        item.durationMinutes,
                    },
                  )}
                </Text>
              )}
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const BROWN = '#4A2A1A';
const GOLD = '#D3A24A';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 18,
    paddingBottom: 120,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: BROWN,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 24,
    padding: 22,
  },
  heroIcon: {
    fontSize: 44,
  },
  title: {
    color: '#FFE4A5',
    fontSize: 27,
    fontWeight: '800',
    marginTop: 7,
  },
  subtitle: {
    color: '#E8D2B3',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 7,
  },
  statusBadge: {
    backgroundColor:
      'rgba(255,255,255,0.10)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 13,
  },
  statusText: {
    color: '#FFE4A5',
    fontSize: 11,
    fontWeight: '800',
  },
  filterRow: {
    paddingVertical: 16,
  },
  filterButton: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E4D4BC',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginRight: 8,
  },
  filterButtonSelected: {
    backgroundColor: BROWN,
    borderColor: GOLD,
  },
  filterText: {
    color: '#765F4C',
    fontSize: 12,
    fontWeight: '700',
  },
  filterTextSelected: {
    color: '#FFE4A5',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E6D6BE',
    borderRadius: 19,
    padding: 14,
    marginBottom: 11,
  },
  itemIconWrap: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1E3CE',
    borderRadius: 16,
  },
  itemIcon: {
    fontSize: 29,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    flex: 1,
    color: BROWN,
    fontSize: 15,
    fontWeight: '800',
  },
  premiumBadge: {
    color: '#A76C1D',
    fontSize: 9,
    fontWeight: '900',
    marginLeft: 8,
  },
  itemDescription: {
    color: '#78624F',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },
  duration: {
    color: '#A17A45',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 5,
  },
  arrow: {
    color: '#8C6F57',
    fontSize: 26,
    marginLeft: 8,
  },
  pressed: {
    opacity: 0.7,
    transform: [{scale: 0.99}],
  },
});
