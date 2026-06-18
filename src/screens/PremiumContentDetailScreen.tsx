import React from 'react';
import {
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
import {PREMIUM_CONTENT} from '../services/premiumContent';
import {usePremium} from '../context/PremiumContext';
import {colors} from '../theme/colors';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'PremiumContentDetail'
>;

export default function PremiumContentDetailScreen({
  route,
  navigation,
}: Props) {
  const {t} = useTranslation();
  const {isPremium} = usePremium();

  const item = PREMIUM_CONTENT.find(
    content =>
      content.id ===
      route.params.contentId,
  );

  if (!item) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {t(
              'premiumContent.notFound',
            )}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const locked =
    item.premium && !isPremium;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }>
        <View style={styles.hero}>
          <Text style={styles.icon}>
            {item.icon}
          </Text>

          <Text style={styles.title}>
            {t(item.titleKey)}
          </Text>

          <Text style={styles.subtitle}>
            {t(item.descriptionKey)}
          </Text>
        </View>

        {locked ? (
          <View style={styles.lockCard}>
            <Text style={styles.lockIcon}>
              🔒
            </Text>

            <Text style={styles.lockTitle}>
              {t(
                'premiumContent.lockedTitle',
              )}
            </Text>

            <Text style={styles.lockText}>
              {t(
                'premiumContent.lockedMessage',
              )}
            </Text>

            <Pressable
              style={styles.upgradeButton}
              onPress={() =>
                navigation.navigate(
                  'Premium',
                )
              }>
              <Text
                style={
                  styles.upgradeButtonText
                }>
                {t(
                  'premiumContent.upgrade',
                )}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.bodyCard}>
            <Text style={styles.bodyText}>
              {item.bodyKey
                ? t(item.bodyKey)
                : t(
                    'premiumContent.themeReady',
                  )}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const BROWN = '#4A2A1A';

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
    backgroundColor: '#F0DFC5',
    borderRadius: 24,
    padding: 22,
  },
  icon: {
    fontSize: 49,
  },
  title: {
    color: BROWN,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    color: '#775F4B',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 7,
  },
  lockCard: {
    alignItems: 'center',
    backgroundColor: '#FFF5D8',
    borderWidth: 1,
    borderColor: '#D8AD60',
    borderRadius: 19,
    padding: 22,
    marginTop: 16,
  },
  lockIcon: {
    fontSize: 32,
  },
  lockTitle: {
    color: BROWN,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 7,
  },
  lockText: {
    color: '#765F4C',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 6,
  },
  upgradeButton: {
    backgroundColor: BROWN,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginTop: 14,
  },
  upgradeButtonText: {
    color: '#FFE4A5',
    fontSize: 13,
    fontWeight: '800',
  },
  bodyCard: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E5D6BE',
    borderRadius: 19,
    padding: 18,
    marginTop: 16,
  },
  bodyText: {
    color: '#5F4A3B',
    fontSize: 15,
    lineHeight: 25,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#7A6653',
  },
});
