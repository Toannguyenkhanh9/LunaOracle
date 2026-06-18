import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
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
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useTranslation,
} from 'react-i18next';

import type {
  RootTabParamList,
} from '../navigation/RootNavigator';

import {
  explainCompatibility,
  explainGenericChart,
  explainTimelineYear,
  explainToday,
  type ExplainableResult,
} from '../services/explainableResults';

import {
  getUserProfile,
} from '../services/userProfiles';

import {
  useExpertMode,
} from '../services/expertMode';

import RewardedFeatureGate
  from '../components/RewardedFeatureGate';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'ExplainableResult'
>;

function ScoreBar({
  value,
}: {
  value: number;
}) {
  return (
    <View style={styles.scoreTrack}>
      <View
        style={[
          styles.scoreFill,
          {
            width: `${Math.max(
              0,
              Math.min(
                100,
                value,
              ),
            )}%`,
          },
        ]}
      />
    </View>
  );
}

export default function ExplainableResultScreen({
  navigation,
  route,
}: Props) {
  const {t} =
    useTranslation();

  const {
    isExpert,
    preferences,
  } =
    useExpertMode();

  const [
    result,
    setResult,
  ] =
    useState<
      ExplainableResult | null
    >(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);

      try {
        const params =
          route.params;

        let next:
          ExplainableResult | null =
            null;

        if (
          params.kind ===
          'today'
        ) {
          const profile =
            params.profileId
              ? await getUserProfile(
                  params.profileId,
                )
              : null;

          next =
            explainToday(
              params.date
                ? new Date(
                    params.date,
                  )
                : new Date(),
              profile,
            );
        }

        if (
          params.kind ===
          'timeline' &&
          params.profileId &&
          typeof params.year ===
            'number'
        ) {
          const profile =
            await getUserProfile(
              params.profileId,
            );

          if (profile) {
            next =
              explainTimelineYear(
                profile,
                params.year,
              );
          }
        }

        if (
          params.kind ===
          'compatibility' &&
          params.profileAId &&
          params.profileBId &&
          params.mode
        ) {
          const [
            first,
            second,
          ] =
            await Promise.all([
              getUserProfile(
                params.profileAId,
              ),
              getUserProfile(
                params.profileBId,
              ),
            ]);

          if (
            first &&
            second
          ) {
            next =
              explainCompatibility(
                first,
                second,
                params.mode,
              );
          }
        }

        if (
          (
            params.kind ===
              'bazi' ||
            params.kind ===
              'ziwei'
          ) &&
          params.payload
        ) {
          next =
            explainGenericChart(
              params.kind,
              params.payload,
            );
        }

        if (active) {
          setResult(next);
        }
      } catch (error) {
        console.warn(
          'Unable to build explainable result:',
          error,
        );

        if (active) {
          setResult(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [route.params]);

  const rawEntries =
    useMemo(
      () =>
        result
          ? Object.entries(
              result.rawData,
            )
          : [],
      [result],
    );

  if (
    isLoading ||
    !result
  ) {
    return (
      <SafeAreaView
        style={styles.loading}>
        <Text
          style={
            styles.loadingText
          }>
          {isLoading
            ? t(
                'explainable.loading',
              )
            : t(
                'explainable.unavailable',
              )}
        </Text>
      </SafeAreaView>
    );
  }

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

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }>
        <View style={styles.hero}>
          <Pressable
            style={({pressed}) => [
              styles.backButton,
              pressed &&
                styles.pressed,
            ]}
            onPress={() =>
              navigation.goBack()
            }>
            <Text style={styles.backText}>
              ‹
            </Text>
          </Pressable>

          <View style={styles.heroTextWrap}>
            <Text style={styles.heroEyebrow}>
              {t(
                'explainable.eyebrow',
              )}
            </Text>

            <Text style={styles.heroTitle}>
              {t(
                result.titleKey,
              )}
            </Text>

            <Text style={styles.heroSubtitle}>
              {t(
                'explainable.subtitle',
              )}
            </Text>
          </View>

          <View style={styles.heroIcon}>
            <Text style={styles.heroIconText}>
              ?
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          {typeof result.overallScore ===
            'number' && (
            <View
              style={
                styles.overallCircle
              }>
              <Text
                style={
                  styles.overallValue
                }>
                {
                  result.overallScore
                }
              </Text>

              <Text
                style={
                  styles.overallLabel
                }>
                {t(
                  'explainable.overall',
                )}
              </Text>
            </View>
          )}

          <View
            style={
              styles.summaryTextWrap
            }>
            <Text
              style={
                styles.summaryTitle
              }>
              {t(
                `explainable.tones.${result.tone}.title`,
              )}
            </Text>

            <Text
              style={
                styles.summaryText
              }>
              {t(
                result.summaryKey,
              )}
            </Text>
          </View>
        </View>

        <RewardedFeatureGate
          gateKey="explainableResults"
          featureKey={`explainable:${result.kind}`}
          title={t(
            'ads.explainableRewardTitle',
            {
              defaultValue:
                'Unlock full explanation',
            },
          )}
          message={t(
            'ads.explainableRewardMessage',
            {
              defaultValue:
                'Watch one rewarded ad to see all factors, weights, method details, and raw technical data for 24 hours.',
            },
          )}>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>
            {t(
              'explainable.factorsEyebrow',
            )}
          </Text>

          <Text style={styles.sectionTitle}>
            {t(
              'explainable.factorsTitle',
            )}
          </Text>

          {result.factors.map(
            factor => (
              <View
                key={factor.code}
                style={
                  styles.factorCard
                }>
                <View
                  style={
                    styles.factorHeader
                  }>
                  <View style={styles.flex}>
                    <Text
                      style={
                        styles.factorTitle
                      }>
                      {factor.labelKey.startsWith(
                        'explainable.',
                      ) ||
                      factor.labelKey.startsWith(
                        'insightFeatures.',
                      )
                        ? t(
                            factor.labelKey,
                          )
                        : factor.labelKey}
                    </Text>

                    <Text
                      style={
                        styles.factorDescription
                      }>
                      {factor.descriptionKey.startsWith(
                        'explainable.',
                      )
                        ? t(
                            factor.descriptionKey,
                          )
                        : factor.descriptionKey}
                    </Text>
                  </View>

                  {typeof factor.score ===
                    'number' && (
                    <Text
                      style={
                        styles.factorScore
                      }>
                      {
                        factor.score
                      }
                    </Text>
                  )}
                </View>

                {typeof factor.score ===
                  'number' && (
                  <ScoreBar
                    value={
                      factor.score
                    }
                  />
                )}

                <View
                  style={
                    styles.factorMetaRow
                  }>
                  {typeof factor.weight ===
                    'number' && (
                    <Text
                      style={
                        styles.factorMeta
                      }>
                      {t(
                        'explainable.weight',
                        {
                          value:
                            Math.round(
                              factor.weight *
                                100,
                            ),
                        },
                      )}
                    </Text>
                  )}

                  {typeof factor.contribution ===
                    'number' && (
                    <Text
                      style={
                        styles.factorMeta
                      }>
                      {t(
                        'explainable.contribution',
                        {
                          value:
                            factor.contribution.toFixed(
                              1,
                            ),
                        },
                      )}
                    </Text>
                  )}

                  {isExpert &&
                    preferences.showRawCodes &&
                    factor.rawValue && (
                      <Text
                        selectable
                        style={
                          styles.rawValue
                        }>
                        {factor.rawValue}
                      </Text>
                    )}
                </View>
              </View>
            ),
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>
            {t(
              'explainable.methodEyebrow',
            )}
          </Text>

          <Text style={styles.sectionTitle}>
            {t(
              'explainable.methodTitle',
            )}
          </Text>

          <View style={styles.methodCard}>
            <Text style={styles.methodText}>
              {t(
                result.methodologyKey,
              )}
            </Text>

            <View style={styles.modelRow}>
              <Text style={styles.modelLabel}>
                {t(
                  'explainable.modelVersion',
                )}
              </Text>

              <Text
                selectable
                style={
                  styles.modelValue
                }>
                {result.modelVersion}
              </Text>
            </View>
          </View>
        </View>

        {isExpert &&
          preferences.showCalculationDetails &&
          rawEntries.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionEyebrow}>
                {t(
                  'explainable.rawEyebrow',
                )}
              </Text>

              <Text style={styles.sectionTitle}>
                {t(
                  'explainable.rawTitle',
                )}
              </Text>

              <View style={styles.rawCard}>
                {rawEntries.map(
                  ([
                    key,
                    value,
                  ]) => (
                    <View
                      key={key}
                      style={
                        styles.rawRow
                      }>
                      <Text
                        selectable
                        style={
                          styles.rawKey
                        }>
                        {key}
                      </Text>

                      <Text
                        selectable
                        style={
                          styles.rawDataValue
                        }>
                        {String(
                          value ??
                            'null',
                        )}
                      </Text>
                    </View>
                  ),
                )}
              </View>
            </View>
          )}

        </RewardedFeatureGate>

        <View style={styles.limitCard}>
          <Text style={styles.limitTitle}>
            {t(
              'explainable.limitationsTitle',
            )}
          </Text>

          <Text style={styles.limitText}>
            {t(
              result.limitationsKey,
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
  flex: {
    flex: 1,
  },

  screen: {
    flex: 1,
    backgroundColor:
      COLORS.cream,
  },

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.cream,
  },

  loadingText: {
    color: COLORS.muted,
    fontSize: 12,
  },

  content: {
    paddingBottom: 145,
  },

  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.navy,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 22,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(255,255,255,0.08)',
    borderRadius: 13,
  },

  backText: {
    color: '#FFF3D3',
    fontSize: 29,
  },

  heroTextWrap: {
    flex: 1,
    marginLeft: 11,
  },

  heroEyebrow: {
    color: '#D5B672',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  heroTitle: {
    color: '#FFF7E5',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 3,
  },

  heroSubtitle: {
    color: '#C8CFD9',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 5,
  },

  heroIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(215,175,94,0.14)',
    borderWidth: 1,
    borderColor:
      'rgba(215,175,94,0.38)',
    borderRadius: 14,
  },

  heroIconText: {
    color: '#E9CA82',
    fontSize: 22,
    fontWeight: '900',
  },

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 15,
  },

  overallCircle: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.navy,
    borderWidth: 3,
    borderColor:
      COLORS.gold,
    borderRadius: 36,
  },

  overallValue: {
    color: '#FFF2D2',
    fontSize: 23,
    fontWeight: '900',
  },

  overallLabel: {
    color: '#DCC78F',
    fontSize: 7.5,
    fontWeight: '800',
  },

  summaryTextWrap: {
    flex: 1,
    marginLeft: 13,
  },

  summaryTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '900',
  },

  summaryText: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 5,
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 22,
  },

  sectionEyebrow: {
    color: '#9B783B',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 3,
  },

  factorCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 17,
    padding: 13,
    marginTop: 10,
  },

  factorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  factorTitle: {
    color: COLORS.text,
    fontSize: 11.5,
    fontWeight: '900',
  },

  factorDescription: {
    color: COLORS.muted,
    fontSize: 9.5,
    lineHeight: 15,
    marginTop: 4,
  },

  factorScore: {
    color: '#8B6933',
    fontSize: 18,
    fontWeight: '900',
    marginLeft: 10,
  },

  scoreTrack: {
    height: 8,
    backgroundColor: '#E7E0D5',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 11,
  },

  scoreFill: {
    height: '100%',
    backgroundColor:
      COLORS.gold,
  },

  factorMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 9,
  },

  factorMeta: {
    color: '#6A6258',
    fontSize: 8.5,
    fontWeight: '800',
    backgroundColor: '#EFE8DD',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 4,
  },

  rawValue: {
    color: '#5C6A7E',
    fontSize: 8,
    fontWeight: '800',
    marginLeft: 'auto',
  },

  methodCard: {
    backgroundColor: '#E8EDF3',
    borderRadius: 17,
    padding: 14,
    marginTop: 11,
  },

  methodText: {
    color: '#5D6673',
    fontSize: 10,
    lineHeight: 17,
  },

  modelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth:
      StyleSheet.hairlineWidth,
    borderTopColor: '#C9D1DC',
    paddingTop: 10,
    marginTop: 10,
  },

  modelLabel: {
    color: COLORS.navy,
    fontSize: 9,
    fontWeight: '900',
  },

  modelValue: {
    color: '#667184',
    fontSize: 8.5,
    fontWeight: '800',
    marginLeft: 'auto',
  },

  rawCard: {
    backgroundColor:
      COLORS.navy,
    borderRadius: 17,
    paddingHorizontal: 13,
    marginTop: 11,
  },

  rawRow: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor:
      'rgba(255,255,255,0.12)',
  },

  rawKey: {
    width: '45%',
    color: '#AEB9C8',
    fontSize: 8.5,
  },

  rawDataValue: {
    flex: 1,
    color: '#FFF0C8',
    fontSize: 8.5,
    fontWeight: '800',
    textAlign: 'right',
  },

  limitCard: {
    backgroundColor: '#F6EAE6',
    borderRadius: 17,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 20,
  },

  limitTitle: {
    color: '#7F4E47',
    fontSize: 10.5,
    fontWeight: '900',
  },

  limitText: {
    color: '#765D59',
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
