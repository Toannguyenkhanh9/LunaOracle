import React, {
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
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
  useRoute,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import {
  captureRef,
} from 'react-native-view-shot';

import LunaShareCard
  from '../components/LunaShareCard';

import {
  shareImageFile,
} from '../services/shareImage';

import type {
  LunaShareImageParams,
} from '../types/lunaShare';

type RouteLike = {
  params?: Partial<LunaShareImageParams>;
};

function buildDefaultShareData():
LunaShareImageParams {
  return {
    variant: 'dailyInsight',
    title: 'Daily Insight',
    subtitle:
      'A calm message for today',
    message:
      'Move with clarity, not pressure. One aligned step is enough.',
    score: 82,
    badge: 'TODAY',
    tags: [
      'luna',
      'oracle',
      'daily',
    ],
  };
}

export default function ShareImageScreen() {
  const {t} =
    useTranslation();

  const route =
    useRoute<RouteLike>();

  const cardRef =
    useRef<View>(null);

  const [
    isSharing,
    setSharing,
  ] =
    useState(false);

  const shareData =
    useMemo<LunaShareImageParams>(
      () => ({
        ...buildDefaultShareData(),
        ...route.params,
      }),
      [route.params],
    );

  const share = async () => {
    if (!cardRef.current) {
      return;
    }

    setSharing(true);

    try {
      const uri =
        await captureRef(
          cardRef,
          {
            format: 'png',
            quality: 1,
            result: 'tmpfile',
          },
        );

      await shareImageFile({
        uri,
        title:
          shareData.title,
        message:
          `${shareData.title}\n${shareData.message}`,
      });
    } catch (error) {
      console.warn(
        'Unable to share Luna image:',
        error,
      );

      Alert.alert(
        t(
          'lunaShare.errorTitle',
          {
            defaultValue:
              'Unable to share',
          },
        ),
        t(
          'lunaShare.errorMessage',
          {
            defaultValue:
              'Please try again.',
          },
        ),
      );
    } finally {
      setSharing(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'lunaShare.eyebrow',
            {
              defaultValue:
                'Share',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'lunaShare.title',
            {
              defaultValue:
                'Create Share Image',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'lunaShare.subtitle',
            {
              defaultValue:
                'Preview your Luna Oracle image and share it to social apps.',
            },
          )}
        </Text>

        <View style={styles.previewWrap}>
          <View
            ref={cardRef}
            collapsable={false}>
            <LunaShareCard
              data={shareData}
            />
          </View>
        </View>

        <Pressable
          style={[
            styles.shareButton,
            isSharing &&
              styles.shareButtonDisabled,
          ]}
          disabled={isSharing}
          onPress={share}>
          {isSharing ? (
            <ActivityIndicator
              color="#1B1537"
            />
          ) : (
            <Text style={styles.shareText}>
              {t(
                'lunaShare.shareButton',
                {
                  defaultValue:
                    'Share Image',
                },
              )}
            </Text>
          )}
        </Pressable>

        <Text style={styles.notice}>
          {t(
            'lunaShare.notice',
            {
              defaultValue:
                'Tip: use square or story crop in social apps for best results.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = {
  cream: '#F7F2EA',
  night: '#1B1537',
  gold: '#D9B76E',
  text: '#282236',
  muted: '#756D7D',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  content: {
    alignItems: 'center',
    padding: 18,
    paddingBottom: 110,
  },

  eyebrow: {
    alignSelf: 'flex-start',
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  title: {
    alignSelf: 'flex-start',
    color: COLORS.text,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '900',
    marginTop: 5,
  },

  subtitle: {
    alignSelf: 'flex-start',
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },

  previewWrap: {
    alignItems: 'center',
    width: '100%',
    marginTop: 18,
    shadowColor: '#1B1537',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 8,
  },

  shareButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 54,
    backgroundColor: COLORS.gold,
    borderRadius: 18,
    marginTop: 18,
  },

  shareButtonDisabled: {
    opacity: 0.65,
  },

  shareText: {
    color: COLORS.night,
    fontSize: 14,
    fontWeight: '900',
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 14,
  },
});
