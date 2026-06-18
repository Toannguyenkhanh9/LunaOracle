import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useTranslation} from 'react-i18next';

import {usePremium} from '../context/PremiumContext';

type Props = {
  children: React.ReactNode;
  onUpgrade: () => void;
};

export default function PremiumGate({
  children,
  onUpgrade,
}: Props) {
  const {t} = useTranslation();
  const {isPremium, isLoading} =
    usePremium();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <View style={styles.lockCard}>
      <Text style={styles.lockIcon}>
        🔒
      </Text>
      <Text style={styles.lockTitle}>
        {t('premiumContent.lockedTitle')}
      </Text>
      <Text style={styles.lockText}>
        {t('premiumContent.lockedMessage')}
      </Text>

      <Pressable
        style={({pressed}) => [
          styles.upgradeButton,
          pressed && styles.pressed,
        ]}
        onPress={onUpgrade}>
        <Text
          style={styles.upgradeButtonText}>
          {t('premiumContent.upgrade')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#7C6652',
    fontSize: 13,
  },
  lockCard: {
    alignItems: 'center',
    backgroundColor: '#FFF4D8',
    borderWidth: 1,
    borderColor: '#D7AC5A',
    borderRadius: 18,
    padding: 20,
  },
  lockIcon: {
    fontSize: 31,
  },
  lockTitle: {
    color: '#4A2A1A',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
  },
  lockText: {
    color: '#7A644F',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 6,
  },
  upgradeButton: {
    backgroundColor: '#4A2A1A',
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
  pressed: {
    opacity: 0.72,
    transform: [{scale: 0.98}],
  },
});
