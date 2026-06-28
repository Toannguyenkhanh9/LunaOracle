import React, {
  useCallback,
  useState,
} from 'react';

import {
  Alert,
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

import OracleGuideCard
  from '../components/OracleGuideCard';

import {
  ORACLE_GUIDES,
  equipOracleGuide,
  getOracleGuideState,
  unlockOracleGuide,
  type OracleGuide,
  type OracleGuideState,
} from '../services/oracleGuides';

export default function OracleGuidesScreen() {
  const {t} =
    useTranslation();

  const [
    state,
    setState,
  ] =
    useState<OracleGuideState | undefined>();

  const load = useCallback(
    async () => {
      setState(
        await getOracleGuideState(),
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

  const handlePress =
    async (
      guide: OracleGuide,
    ) => {
      if (!state) {
        return;
      }

      const unlocked =
        state.unlockedGuideIds.includes(
          guide.id,
        );

      if (unlocked) {
        const next =
          await equipOracleGuide(
            guide.id,
          );

        if (next) {
          setState(next);
        }

        return;
      }

      const result =
        await unlockOracleGuide(
          guide.id,
        );

      if (!result.success) {
        Alert.alert(
          t(
            'oracleGuides.notEnoughTitle',
            {
              defaultValue:
                'Not enough Moon Dust',
            },
          ),
          t(
            'oracleGuides.notEnoughMessage',
            {
              defaultValue:
                'Claim daily rewards and complete journeys to earn more Moon Dust.',
            },
          ),
        );

        return;
      }

      const equipped =
        await equipOracleGuide(
          guide.id,
        );

      setState(
        equipped ??
          result.state,
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

  const active =
    ORACLE_GUIDES.find(
      guide =>
        guide.id ===
        state.activeGuideId,
    );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'oracleGuides.eyebrow',
            {
              defaultValue:
                'Guides',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'oracleGuides.title',
            {
              defaultValue:
                'Unlockable Oracle Guides',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'oracleGuides.subtitle',
            {
              defaultValue:
                'Unlock different oracle voices. Each guide changes the tone of your reflective experience.',
            },
          )}
        </Text>

        {active ? (
          <View
            style={[
              styles.activeCard,
              {
                backgroundColor:
                  active.color,
              },
            ]}>
            <Text
              style={[
                styles.activeKicker,
                {
                  color:
                    active.accent,
                },
              ]}>
              {t(
                'oracleGuides.current',
                {
                  defaultValue:
                    'Current guide',
                },
              )}
            </Text>

            <Text style={styles.activeTitle}>
              {active.icon}{' '}
              {t(
                active.titleKey,
                {
                  defaultValue:
                    active.titleFallback,
                },
              )}
            </Text>

            <Text style={styles.activeText}>
              {t(
                active.toneKey,
                {
                  defaultValue:
                    active.toneFallback,
                },
              )}
            </Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>
          {t(
            'oracleGuides.allGuides',
            {
              defaultValue:
                'All guides',
            },
          )}
        </Text>

        {ORACLE_GUIDES.map(guide => (
          <OracleGuideCard
            key={guide.id}
            guide={guide}
            unlocked={
              state.unlockedGuideIds.includes(
                guide.id,
              )
            }
            active={
              state.activeGuideId ===
              guide.id
            }
            onPress={() =>
              handlePress(guide)
            }
          />
        ))}

        <Text style={styles.notice}>
          {t(
            'oracleGuides.notice',
            {
              defaultValue:
                'Guide choice is saved locally. Connect it to your reading templates to personalize every screen.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = {
  cream: '#F7F2EA',
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
    marginBottom: 16,
  },

  activeCard: {
    borderRadius: 28,
    padding: 18,
  },

  activeKicker: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },

  activeTitle: {
    color: '#FFF8EA',
    fontSize: 25,
    fontWeight: '900',
    marginTop: 7,
  },

  activeText: {
    color: '#DCD2F3',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 20,
    marginBottom: 12,
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 12,
  },
});
