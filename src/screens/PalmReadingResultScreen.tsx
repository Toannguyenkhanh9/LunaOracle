import React, {
  useEffect,
  useMemo,
} from 'react';

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useTranslation,
} from 'react-i18next';

import PalmReadingCard
  from '../components/PalmReadingCard';

import LunaShareButton
  from '../components/LunaShareButton';

import {
  buildPalmReadingResult,
  savePalmReadingResult,
  type PalmDominantHand,
  type PalmHandSide,
  type PalmReadingFocus,
  type PalmReadingObservation,
  type PalmReadingResult,
} from '../services/palmReading';

type ResultParams = {
  imageUri?: string;
  handSide?: PalmHandSide;
  dominantHand?: PalmDominantHand;
  focus?: PalmReadingFocus;
  observations?: PalmReadingObservation;
  savedReading?: PalmReadingResult;
};

type Props = {
  route: {
    params?: ResultParams;
  };
};

export default function PalmReadingResultScreen({
  route,
}: Props) {
  const {t} =
    useTranslation();

  const params =
    route.params ?? {};

  const result =
    useMemo(() => {
      if (params.savedReading) {
        return params.savedReading;
      }

      return buildPalmReadingResult({
        imageUri:
          params.imageUri ?? '',
        handSide:
          params.handSide ?? 'left',
        dominantHand:
          params.dominantHand ?? 'right',
        focus:
          params.focus ?? 'general',
        observations:
          params.observations,
      });
    }, [
      params.savedReading,
      params.imageUri,
      params.handSide,
      params.dominantHand,
      params.focus,
      params.observations,
    ]);

  useEffect(
    () => {
      void savePalmReadingResult(result);
    },
    [result],
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {result.version === 'v2Lite'
            ? t(
                'palmReading.v2.eyebrow',
                {
                  defaultValue:
                    'V2 Lite',
                },
              )
            : t(
                'palmReading.resultEyebrow',
                {
                  defaultValue:
                    'Result',
                },
              )}
        </Text>

        <Text style={styles.title}>
          {t(
            'palmReading.resultTitle',
            {
              defaultValue:
                'Your Palm Reading',
            },
          )}
        </Text>

        {result.imageUri ? (
          <Image
            source={{
              uri: result.imageUri,
            }}
            style={styles.image}
          />
        ) : null}

        <View style={styles.heroCard}>
          <Text style={styles.heroKicker}>
            {t(
              `palmReading.shapes.${result.palmShape}`,
              {
                defaultValue:
                  result.palmShape,
              },
            )}{' '}
            •{' '}
            {t(
              `palmReading.focusOptions.${result.focus}`,
              {
                defaultValue:
                  result.focus,
              },
            )}
          </Text>

          <View style={styles.scoreRow}>
            <View>
              <Text style={styles.scoreLabel}>
                {t(
                  'palmReading.score',
                  {
                    defaultValue:
                      'Score',
                  },
                )}
              </Text>

              <Text style={styles.score}>
                {result.overallScore}
              </Text>
            </View>

            <View style={styles.confidenceBox}>
              <Text style={styles.confidenceLabel}>
                {t(
                  'palmReading.v2.confidence',
                  {
                    defaultValue:
                      'Confidence',
                  },
                )}
              </Text>

              <Text style={styles.confidenceValue}>
                {result.confidenceScore}
              </Text>
            </View>
          </View>

          <Text style={styles.summary}>
            {t(
              result.summaryKey,
              {
                shape:
                  t(
                    `palmReading.shapes.${result.palmShape}`,
                    {
                      defaultValue:
                        result.palmShape,
                    },
                  ),
                score:
                  result.overallScore,
                confidence:
                  result.confidenceScore,
                defaultValue:
                  result.summaryFallback,
              },
            )}
          </Text>
        </View>

        {result.version === 'v2Lite' ? (
          <View style={styles.observationCard}>
            <Text style={styles.observationTitle}>
              {t(
                'palmReading.v2.observationSummary',
                {
                  defaultValue:
                    'Selected palm details',
                },
              )}
            </Text>

            <Text style={styles.observationText}>
              {result.observationSummaryFallback}
            </Text>
          </View>
        ) : null}

        <View style={styles.focusCard}>
          <Text style={styles.focusTitle}>
            {t(
              'palmReading.focusInsight',
              {
                defaultValue:
                  'Focus insight',
              },
            )}
          </Text>

          <Text style={styles.focusText}>
            {t(
              result.focusMessageKey,
              {
                defaultValue:
                  result.focusMessageFallback,
              },
            )}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          {t(
            'palmReading.lineReadings',
            {
              defaultValue:
                'Palm lines',
            },
          )}
        </Text>

        {result.lines.map(line => (
          <PalmReadingCard
            key={line.id}
            line={line}
          />
        ))}

        <LunaShareButton
          data={{
            variant: 'moon',
            title:
              t(
                'palmReading.resultTitle',
                {
                  defaultValue:
                    'Your Palm Reading',
                },
              ),
            subtitle:
              result.version === 'v2Lite'
                ? 'V2 Lite'
                : t(
                    `palmReading.shapes.${result.palmShape}`,
                    {
                      defaultValue:
                        result.palmShape,
                    },
                  ),
            message:
              result.focusMessageFallback,
            score:
              result.overallScore,
            badge: 'PALM',
            tags: [
              'palm',
              result.version,
              'luna',
            ],
          }}
        />

        <Text style={styles.disclaimer}>
          {t(
            result.disclaimerKey,
            {
              defaultValue:
                result.disclaimerFallback,
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
    fontSize: 31,
    lineHeight: 36,
    fontWeight: '900',
    marginTop: 5,
  },

  image: {
    width: '100%',
    height: 220,
    backgroundColor: '#DDD3E9',
    borderRadius: 26,
    marginTop: 16,
  },

  heroCard: {
    backgroundColor: COLORS.night,
    borderRadius: 28,
    padding: 18,
    marginTop: 14,
  },

  heroKicker: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },

  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  scoreLabel: {
    color: '#BEB3DD',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  score: {
    color: '#FFF8EA',
    fontSize: 56,
    fontWeight: '900',
  },

  confidenceBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginLeft: 'auto',
  },

  confidenceLabel: {
    color: '#BEB3DD',
    fontSize: 8,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  confidenceValue: {
    color: COLORS.gold,
    fontSize: 26,
    fontWeight: '900',
    marginTop: 2,
  },

  summary: {
    color: '#DCD2F3',
    fontSize: 12,
    lineHeight: 19,
    fontWeight: '800',
    marginTop: 6,
  },

  observationCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 15,
    marginTop: 12,
  },

  observationTitle: {
    color: COLORS.purple,
    fontSize: 15,
    fontWeight: '900',
  },

  observationText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },

  focusCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 15,
    marginTop: 12,
  },

  focusTitle: {
    color: COLORS.purple,
    fontSize: 15,
    fontWeight: '900',
  },

  focusText: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '800',
    marginTop: 7,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 20,
    marginBottom: 12,
  },

  disclaimer: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 14,
  },
});
