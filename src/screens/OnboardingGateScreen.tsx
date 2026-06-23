import React, {
  useEffect,
} from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import {
  getLunaOnboardingState,
} from '../services/lunaOnboarding';

type NavigationLike = {
  reset: (
    state: {
      index: number;
      routes: Array<{
        name: string;
      }>;
    },
  ) => void;
};

export default function OnboardingGateScreen() {
  const {t} =
    useTranslation();

  const navigation =
    useNavigation<NavigationLike>();

  useEffect(
    () => {
      let mounted = true;

      const check = async () => {
        const state =
          await getLunaOnboardingState();

        if (!mounted) {
          return;
        }

        navigation.reset({
          index: 0,
          routes: [
            {
              name:
                state.completed
                  ? 'Home'
                  : 'LunaOnboarding',
            },
          ],
        });
      };

      void check();

      return () => {
        mounted = false;
      };
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.logo}>
          ☾
        </Text>

        <ActivityIndicator
          color="#D9B76E"
          size="large"
        />

        <Text style={styles.text}>
          {t(
            'lunaOnboarding.loading',
            {
              defaultValue:
                'Preparing your space...',
            },
          )}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F2EA',
    padding: 24,
  },

  card: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B1537',
    borderRadius: 28,
    padding: 28,
  },

  logo: {
    color: '#D9B76E',
    fontSize: 54,
    fontWeight: '900',
    marginBottom: 20,
  },

  text: {
    color: '#F8EBCB',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 14,
    textAlign: 'center',
  },
});
