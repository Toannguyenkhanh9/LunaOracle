import React, {
  useCallback,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type {
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useTranslation,
} from 'react-i18next';

import type {
  RootTabParamList,
} from '../navigation/RootNavigator';

import {
  clearRecentlyViewedItems,
  getRecentlyViewedItems,
  removeRecentlyViewedItem,
  type RecentlyViewedItem,
} from '../services/recentlyViewed';

import {
  saveBookmarkFromRecent,
} from '../services/bookmarksNotes';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'RecentlyViewed'
>;

function formatViewedAt(
  value: string,
  language: string,
): string {
  try {
    return new Intl.DateTimeFormat(
      language,
      {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    ).format(new Date(value));
  } catch {
    return value;
  }
}

export default function RecentlyViewedScreen({
  navigation,
}: Props) {
  const {t, i18n} =
    useTranslation();

  const [items, setItems] =
    useState<RecentlyViewedItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const load = useCallback(async () => {
    try {
      setItems(
        await getRecentlyViewedItems(),
      );
    } catch (error) {
      console.warn(
        'Unable to load recently viewed items:',
        error,
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const openItem = (
    item: RecentlyViewedItem,
  ) => {
    const nav =
      navigation as any;

    if (item.params) {
      nav.navigate(
        item.route,
        item.params,
      );
      return;
    }

    nav.navigate(
      item.route,
    );
  };

  const bookmark = async (
    item: RecentlyViewedItem,
  ) => {
    try {
      await saveBookmarkFromRecent(
        item,
      );

      Alert.alert(
        t(
          'insightFeatures.recent.savedTitle',
        ),
        t(
          'insightFeatures.recent.savedMessage',
        ),
      );
    } catch (error) {
      console.warn(
        'Unable to bookmark recent item:',
        error,
      );
    }
  };

  const remove = async (
    item: RecentlyViewedItem,
  ) => {
    try {
      setItems(
        await removeRecentlyViewedItem(
          item.id,
        ),
      );
    } catch (error) {
      console.warn(
        'Unable to remove recent item:',
        error,
      );
    }
  };

  const clearAll = () => {
    Alert.alert(
      t(
        'insightFeatures.recent.clearTitle',
      ),
      t(
        'insightFeatures.recent.clearMessage',
      ),
      [
        {
          text: t(
            'insightFeatures.common.cancel',
          ),
          style: 'cancel',
        },
        {
          text: t(
            'insightFeatures.recent.clear',
          ),
          style: 'destructive',
          onPress: async () => {
            await clearRecentlyViewedItems();
            setItems([]);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={styles.screen}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.navy
        }
      />

      <View style={styles.header}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerEyebrow}>
            EASTERN DESTINY
          </Text>

          <Text style={styles.headerTitle}>
            {t(
              'insightFeatures.recent.title',
            )}
          </Text>

          <Text
            style={
              styles.headerSubtitle
            }>
            {t(
              'insightFeatures.recent.subtitle',
            )}
          </Text>
        </View>

        {items.length > 0 && (
          <Pressable
            style={({pressed}) => [
              styles.clearButton,
              pressed &&
                styles.pressed,
            ]}
            onPress={clearAll}>
            <Text
              style={
                styles.clearButtonText
              }>
              {t(
                'insightFeatures.recent.clear',
              )}
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }>
        {isLoading ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              ◌
            </Text>

            <Text style={styles.emptyTitle}>
              {t(
                'insightFeatures.common.loading',
              )}
            </Text>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              ◷
            </Text>

            <Text style={styles.emptyTitle}>
              {t(
                'insightFeatures.recent.emptyTitle',
              )}
            </Text>

            <Text style={styles.emptyText}>
              {t(
                'insightFeatures.recent.emptyMessage',
              )}
            </Text>
          </View>
        ) : (
          items.map(item => (
            <View
              key={item.id}
              style={
                styles.recentCard
              }>
              <View
                style={
                  styles.cardHeader
                }>
                <View
                  style={
                    styles.iconWrap
                  }>
                  <Text
                    style={
                      styles.iconText
                    }>
                    {item.icon}
                  </Text>
                </View>

                <View
                  style={
                    styles.cardTextWrap
                  }>
                  <Text
                    style={
                      styles.cardTitle
                    }>
                    {t(
                      item.titleKey,
                    )}
                  </Text>

                  {!!item.profileName && (
                    <Text
                      style={
                        styles.profileName
                      }>
                      {
                        item.profileName
                      }
                    </Text>
                  )}

                  <Text
                    style={
                      styles.viewedAt
                    }>
                    {formatViewedAt(
                      item.viewedAt,
                      language,
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                <Pressable
                  style={({pressed}) => [
                    styles.primaryAction,
                    pressed &&
                      styles.pressed,
                  ]}
                  onPress={() =>
                    openItem(item)
                  }>
                  <Text
                    style={
                      styles.primaryActionText
                    }>
                    {t(
                      'insightFeatures.common.open',
                    )}
                  </Text>
                </Pressable>

                <Pressable
                  style={({pressed}) => [
                    styles.secondaryAction,
                    pressed &&
                      styles.pressed,
                  ]}
                  onPress={() =>
                    bookmark(item)
                  }>
                  <Text
                    style={
                      styles.secondaryActionText
                    }>
                    ☆{' '}
                    {t(
                      'insightFeatures.recent.bookmark',
                    )}
                  </Text>
                </Pressable>

                <Pressable
                  hitSlop={8}
                  style={({pressed}) => [
                    styles.removeAction,
                    pressed &&
                      styles.pressed,
                  ]}
                  onPress={() =>
                    remove(item)
                  }>
                  <Text
                    style={
                      styles.removeActionText
                    }>
                    ×
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
        )}

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>
            {t(
              'insightFeatures.recent.noticeTitle',
            )}
          </Text>

          <Text style={styles.noticeText}>
            {t(
              'insightFeatures.recent.notice',
            )}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = {
  navy: '#17243A',
  gold: '#D7AF5E',
  cream: '#F7F2E8',
  surface: '#FFFDF8',
  text: '#282D36',
  muted: '#6C726F',
  border: '#E2D7C5',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor:
      COLORS.cream,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.navy,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 21,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerTextWrap: {
    flex: 1,
    marginRight: 12,
  },

  headerEyebrow: {
    color: '#D5B672',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  headerTitle: {
    color: '#FFF7E5',
    fontSize: 27,
    fontWeight: '900',
    marginTop: 3,
  },

  headerSubtitle: {
    color: '#C8CFD9',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },

  clearButton: {
    backgroundColor:
      'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.13)',
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },

  clearButtonText: {
    color: '#F2D48E',
    fontSize: 9,
    fontWeight: '900',
  },

  content: {
    padding: 16,
    paddingBottom: 145,
  },

  recentCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 19,
    padding: 14,
    marginBottom: 11,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrap: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E7E1D6',
    borderRadius: 15,
  },

  iconText: {
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: '900',
  },

  cardTextWrap: {
    flex: 1,
    marginLeft: 11,
  },

  cardTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
  },

  profileName: {
    color: '#98713A',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 3,
  },

  viewedAt: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 4,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
  },

  primaryAction: {
    backgroundColor:
      COLORS.navy,
    borderRadius: 11,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },

  primaryActionText: {
    color: '#FFF1CF',
    fontSize: 9,
    fontWeight: '900',
  },

  secondaryAction: {
    backgroundColor: '#F0E7D7',
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 9,
    marginLeft: 8,
  },

  secondaryActionText: {
    color: '#755729',
    fontSize: 9,
    fontWeight: '900',
  },

  removeAction: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },

  removeActionText: {
    color: '#A15E55',
    fontSize: 20,
  },

  emptyCard: {
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 20,
    padding: 28,
  },

  emptyIcon: {
    color: '#B28C49',
    fontSize: 38,
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 8,
  },

  emptyText: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 6,
  },

  noticeCard: {
    backgroundColor: '#EAE5DC',
    borderRadius: 16,
    padding: 14,
    marginTop: 4,
  },

  noticeTitle: {
    color: '#5D574F',
    fontSize: 11,
    fontWeight: '900',
  },

  noticeText: {
    color: '#746E66',
    fontSize: 9.5,
    lineHeight: 15,
    marginTop: 5,
  },

  pressed: {
    opacity: 0.72,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },
});
