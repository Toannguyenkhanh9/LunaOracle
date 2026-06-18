import React, {useMemo, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {TFunction} from 'i18next';

import type {
  ZiweiAnnualInterpretation,
  ZiweiChartStage6,
  ZiweiDomainId,
  ZiweiInterpretationEvidence,
  ZiweiInterpretationLevel,
  ZiweiPalaceId,
} from '../astrology/ziwei';

type Props = {
  chart: ZiweiChartStage6;
};

type TabId = 'overview' | 'palaces' | 'annual';

const DOMAIN_ORDER: ZiweiDomainId[] = [
  'self',
  'love',
  'career',
  'wealth',
  'health',
  'family',
  'travel',
];

const PALACE_ORDER: ZiweiPalaceId[] = [
  'life',
  'parents',
  'fortune',
  'property',
  'career',
  'friends',
  'travel',
  'health',
  'wealth',
  'children',
  'spouse',
  'siblings',
];

function clampYear(chart: ZiweiChartStage6, year: number): number {
  return Math.max(
    chart.annualCycleRange.startYear,
    Math.min(chart.annualCycleRange.endYear, year),
  );
}

function levelStyle(level: ZiweiInterpretationLevel) {
  switch (level) {
    case 'veryFavorable':
      return styles.levelVeryFavorable;
    case 'favorable':
      return styles.levelFavorable;
    case 'balanced':
      return styles.levelBalanced;
    case 'challenging':
      return styles.levelChallenging;
    default:
      return styles.levelVeryChallenging;
  }
}

export default function ZiweiStage6Details({chart}: Props) {
  const {t} = useTranslation();
  const [tab, setTab] = useState<TabId>('overview');
  const [openPalace, setOpenPalace] = useState<ZiweiPalaceId | null>('life');
  const [selectedYear, setSelectedYear] = useState(
    clampYear(chart, new Date().getFullYear()),
  );

  const annual = useMemo<ZiweiAnnualInterpretation>(() => {
    return (
      chart.interpretation.annualReadings.find(
        item => item.calendarYear === selectedYear,
      ) ?? chart.interpretation.annualReadings[0]
    );
  }, [chart.interpretation.annualReadings, selectedYear]);

  const nearbyYears = useMemo(() => {
    const start = clampYear(chart, selectedYear - 3);
    const end = clampYear(chart, start + 6);
    const normalizedStart = Math.max(
      chart.annualCycleRange.startYear,
      end - 6,
    );

    return chart.interpretation.annualReadings.filter(
      item =>
        item.calendarYear >= normalizedStart &&
        item.calendarYear <= end,
    );
  }, [chart, selectedYear]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t('ziwei.stage6.title')}</Text>
      <Text style={styles.subtitle}>{t('ziwei.stage6.subtitle')}</Text>

      <View style={styles.tabRow}>
        {(['overview', 'palaces', 'annual'] as TabId[]).map(item => {
          const active = item === tab;
          return (
            <Pressable
              key={item}
              style={({pressed}) => [
                styles.tabButton,
                active && styles.tabButtonActive,
                pressed && styles.pressed,
              ]}
              onPress={() => setTab(item)}>
              <Text
                style={[
                  styles.tabText,
                  active && styles.tabTextActive,
                ]}>
                {t(`ziwei.stage6.tabs.${item}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {tab === 'overview' && (
        <>
          <View style={styles.overallCard}>
            <View style={styles.overallScoreWrap}>
              <Text style={styles.overallScore}>
                {chart.interpretation.overallScore}
              </Text>
              <Text style={styles.overallScoreUnit}>/100</Text>
            </View>

            <View style={styles.overallTextWrap}>
              <Text style={styles.overallLabel}>
                {t('ziwei.stage6.overallReading')}
              </Text>
              <Text style={styles.overallHeadline}>
                {t(
                  `ziwei.stage6.headlines.${chart.interpretation.overallLevel}`,
                )}
              </Text>
              <Text style={styles.overallConfidence}>
                {t('ziwei.stage6.confidenceLabel')}:{' '}
                {t(
                  `ziwei.stage6.confidence.${chart.interpretation.overallConfidence}`,
                )}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            {t('ziwei.stage6.lifeDomains')}
          </Text>

          <View style={styles.domainGrid}>
            {DOMAIN_ORDER.map(domainId => {
              const item = chart.interpretation.domainReadingsById[domainId];
              return (
                <View key={domainId} style={styles.domainCard}>
                  <View style={styles.domainTopRow}>
                    <Text style={styles.domainTitle}>
                      {t(`ziwei.stage6.domains.${domainId}`)}
                    </Text>
                    <View style={[styles.levelBadge, levelStyle(item.level)]}>
                      <Text style={styles.levelBadgeText}>{item.score}</Text>
                    </View>
                  </View>

                  <Text style={styles.domainHeadline}>
                    {t(`ziwei.stage6.headlines.${item.level}`)}
                  </Text>

                  <Text style={styles.domainMeta}>
                    {t('ziwei.stage6.primaryPalace')}:{' '}
                    {t(`ziwei.palaces.${item.primaryPalaceId}`)}
                  </Text>

                  <Text style={styles.domainAdvice}>
                    {t(`ziwei.stage6.advice.domains.${domainId}`)}
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      )}

      {tab === 'palaces' && (
        <>
          <Text style={styles.sectionTitle}>
            {t('ziwei.stage6.palaceInterpretations')}
          </Text>

          {PALACE_ORDER.map(palaceId => {
            const item = chart.interpretation.palaceReadingsById[palaceId];
            const open = openPalace === palaceId;

            return (
              <View key={palaceId} style={styles.palaceCard}>
                <Pressable
                  style={({pressed}) => [
                    styles.palaceHeader,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => setOpenPalace(open ? null : palaceId)}>
                  <View style={styles.palaceHeaderText}>
                    <Text style={styles.palaceTitle}>
                      {t(`ziwei.palaces.${palaceId}`)}
                    </Text>
                    <Text style={styles.palaceHeadline}>
                      {t(`ziwei.stage6.headlines.${item.level}`)}
                    </Text>
                  </View>

                  <View style={[styles.levelBadge, levelStyle(item.level)]}>
                    <Text style={styles.levelBadgeText}>{item.score}</Text>
                  </View>

                  <Text style={styles.expandIcon}>{open ? '⌃' : '⌄'}</Text>
                </Pressable>

                {open && (
                  <View style={styles.palaceBody}>
                    <Text style={styles.adviceText}>
                      {t(`ziwei.stage6.advice.palaces.${palaceId}`)}
                    </Text>

                    <Text style={styles.evidenceSectionTitle}>
                      {t('ziwei.stage6.supportiveEvidence')}
                    </Text>
                    {item.supportiveEvidence.length === 0 ? (
                      <Text style={styles.emptyText}>
                        {t('ziwei.stage6.noEvidence')}
                      </Text>
                    ) : (
                      item.supportiveEvidence.slice(0, 8).map((evidence, index) => (
                        <EvidenceRow
                          key={`${evidence.code}-${evidence.sourceId}-${index}`}
                          evidence={evidence}
                        />
                      ))
                    )}

                    <Text style={styles.evidenceSectionTitle}>
                      {t('ziwei.stage6.challengingEvidence')}
                    </Text>
                    {item.challengingEvidence.length === 0 ? (
                      <Text style={styles.emptyText}>
                        {t('ziwei.stage6.noEvidence')}
                      </Text>
                    ) : (
                      item.challengingEvidence
                        .slice(0, 8)
                        .map((evidence, index) => (
                          <EvidenceRow
                            key={`${evidence.code}-${evidence.sourceId}-${index}`}
                            evidence={evidence}
                          />
                        ))
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </>
      )}

      {tab === 'annual' && (
        <>
          <Text style={styles.sectionTitle}>
            {t('ziwei.stage6.annualInterpretation')}
          </Text>

          <View style={styles.yearSelector}>
            <Pressable
              style={({pressed}) => [
                styles.yearButton,
                pressed && styles.pressed,
              ]}
              onPress={() =>
                setSelectedYear(current => clampYear(chart, current - 1))
              }>
              <Text style={styles.yearButtonText}>‹</Text>
            </Pressable>

            <View style={styles.yearCenter}>
              <Text style={styles.yearValue}>{annual.calendarYear}</Text>
              <Text style={styles.yearMeta}>
                {t('ziwei.stage6.nominalAge', {age: annual.nominalAge})}
              </Text>
            </View>

            <Pressable
              style={({pressed}) => [
                styles.yearButton,
                pressed && styles.pressed,
              ]}
              onPress={() =>
                setSelectedYear(current => clampYear(chart, current + 1))
              }>
              <Text style={styles.yearButtonText}>›</Text>
            </Pressable>
          </View>

          <View style={styles.yearStrip}>
            {nearbyYears.map(item => {
              const selected = item.calendarYear === annual.calendarYear;
              return (
                <Pressable
                  key={item.calendarYear}
                  style={({pressed}) => [
                    styles.yearChip,
                    selected && styles.yearChipSelected,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => setSelectedYear(item.calendarYear)}>
                  <Text
                    style={[
                      styles.yearChipText,
                      selected && styles.yearChipTextSelected,
                    ]}>
                    {item.calendarYear}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.annualCard}>
            <View style={styles.annualScoreRow}>
              <View style={[styles.largeScoreBadge, levelStyle(annual.level)]}>
                <Text style={styles.largeScoreValue}>{annual.score}</Text>
              </View>

              <View style={styles.annualHeadlineWrap}>
                <Text style={styles.annualHeadline}>
                  {t(`ziwei.stage6.headlines.${annual.level}`)}
                </Text>
                <Text style={styles.annualConfidence}>
                  {t('ziwei.stage6.confidenceLabel')}:{' '}
                  {t(`ziwei.stage6.confidence.${annual.confidence}`)}
                </Text>
              </View>
            </View>

            <View style={styles.annualPalaceGrid}>
              <AnnualPalace
                label={t('ziwei.stage6.activeMajorPalace')}
                value={
                  annual.activeMajorPalaceId
                    ? t(`ziwei.palaces.${annual.activeMajorPalaceId}`)
                    : t('ziwei.stage6.notAvailable')
                }
              />
              <AnnualPalace
                label={t('ziwei.stage6.minorPalace')}
                value={t(`ziwei.palaces.${annual.minorCyclePalaceId}`)}
              />
              <AnnualPalace
                label={t('ziwei.stage6.taiSuiPalace')}
                value={t(`ziwei.palaces.${annual.taiSuiPalaceId}`)}
              />
            </View>

            <Text style={styles.adviceText}>{t('ziwei.stage6.advice.annual')}</Text>

            <Text style={styles.evidenceSectionTitle}>
              {t('ziwei.stage6.evidenceTitle')}
            </Text>
            {annual.evidence.slice(0, 12).map((evidence, index) => (
              <EvidenceRow
                key={`${evidence.code}-${evidence.sourceId}-${index}`}
                evidence={evidence}
              />
            ))}
          </View>
        </>
      )}

      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>{t('ziwei.stage6.noticeTitle')}</Text>
        <Text style={styles.noticeText}>{t('ziwei.stage6.notice')}</Text>
      </View>
    </View>
  );
}

type EvidenceRowProps = {
  evidence: ZiweiInterpretationEvidence;
};

function EvidenceRow({evidence}: EvidenceRowProps) {
  const {t} = useTranslation();
  const positive = evidence.scoreDelta > 0;
  const negative = evidence.scoreDelta < 0;

  const value = getEvidenceValue(evidence, t);

  return (
    <View style={styles.evidenceRow}>
      <View
        style={[
          styles.evidenceDot,
          positive && styles.evidenceDotPositive,
          negative && styles.evidenceDotNegative,
          !positive && !negative && styles.evidenceDotNeutral,
        ]}
      />
      <View style={styles.evidenceTextWrap}>
        <Text style={styles.evidenceTitle}>{value}</Text>
        <Text style={styles.evidenceMeta}>
          {t(`ziwei.palaces.${evidence.palaceId}`)} ·{' '}
          {t(`ziwei.stage6.tones.${evidence.tone}`)}
        </Text>
      </View>
      <Text
        style={[
          styles.deltaText,
          positive && styles.deltaPositive,
          negative && styles.deltaNegative,
        ]}>
        {positive ? '+' : ''}
        {evidence.scoreDelta}
      </Text>
    </View>
  );
}

function getEvidenceValue(
  evidence: ZiweiInterpretationEvidence,
  t: TFunction,
): string {
  switch (evidence.source) {
    case 'mainStar':
      if (evidence.sourceId === 'none') {
        return t('ziwei.stage6.noMainStar');
      }
      return `${t('ziwei.stage6.evidenceTypes.mainStar')}: ${t(
        `ziwei.mainStars.${evidence.sourceId}`,
      )}${
        evidence.brightness
          ? ` · ${t(`ziwei.brightness.${evidence.brightness}`)}`
          : ''
      }`;

    case 'auxiliaryStar':
      return `${t('ziwei.stage6.evidenceTypes.auxiliaryStar')}: ${t(
        `ziwei.auxiliaryStars.${evidence.sourceId}`,
      )}`;

    case 'transformation':
    case 'annualTransformation':
      return `${t('ziwei.stage6.evidenceTypes.transformation')}: ${t(
        `ziwei.transformations.${evidence.sourceId}`,
      )}`;

    case 'voidMarker':
      return `${t('ziwei.stage6.evidenceTypes.voidMarker')}: ${t(
        `ziwei.voidMarkers.${evidence.sourceId}`,
      )}`;

    case 'trangSinh':
      return `${t('ziwei.stage6.evidenceTypes.trangSinh')}: ${t(
        `ziwei.trangSinh.${evidence.sourceId}`,
      )}`;

    case 'bodyResidence':
      return t('ziwei.stage6.evidenceTypes.bodyResidence');

    case 'majorCycle':
      return `${t('ziwei.stage6.evidenceTypes.majorCycle')}: ${t(
        `ziwei.palaces.${evidence.sourceId}`,
      )}`;

    case 'minorCycle':
      return `${t('ziwei.stage6.evidenceTypes.minorCycle')}: ${t(
        `ziwei.palaces.${evidence.sourceId}`,
      )}`;

    case 'annualStar':
      return `${t('ziwei.stage6.evidenceTypes.annualStar')}: ${t(
        `ziwei.stage5.annualStarNames.${evidence.sourceId}`,
        {defaultValue: evidence.sourceId},
      )}`;

    default:
      return evidence.sourceId;
  }
}

type AnnualPalaceProps = {
  label: string;
  value: string;
};

function AnnualPalace({label, value}: AnnualPalaceProps) {
  return (
    <View style={styles.annualPalaceCard}>
      <Text style={styles.annualPalaceLabel}>{label}</Text>
      <Text style={styles.annualPalaceValue}>{value}</Text>
    </View>
  );
}

const BROWN = '#4E2C1C';
const GOLD = '#D0A04C';
const SURFACE = '#FFFDF8';
const BORDER = '#E5CDA8';

const styles = StyleSheet.create({
  container: {marginTop: 24},
  heading: {color: BROWN, fontSize: 22, fontWeight: '900'},
  subtitle: {color: '#7C6654', fontSize: 12, lineHeight: 18, marginTop: 5},
  tabRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 14},
  tabButton: {
    width: '32%',
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2E5D3',
    borderRadius: 13,
    paddingHorizontal: 5,
  },
  tabButtonActive: {backgroundColor: BROWN, borderWidth: 1, borderColor: GOLD},
  tabText: {color: '#735C48', fontSize: 11, fontWeight: '800', textAlign: 'center'},
  tabTextActive: {color: '#FFE4A2'},
  overallCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BROWN,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 19,
    padding: 16,
    marginTop: 14,
  },
  overallScoreWrap: {
    width: 82,
    height: 82,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: 20,
    marginRight: 14,
  },
  overallScore: {color: '#FFE3A1', fontSize: 31, fontWeight: '900'},
  overallScoreUnit: {color: '#DABF91', fontSize: 10},
  overallTextWrap: {flex: 1},
  overallLabel: {color: '#D9C19A', fontSize: 10, textTransform: 'uppercase'},
  overallHeadline: {color: '#FFE7B0', fontSize: 17, fontWeight: '900', marginTop: 5},
  overallConfidence: {color: '#E6D0AD', fontSize: 11, marginTop: 6},
  sectionTitle: {color: BROWN, fontSize: 18, fontWeight: '900', marginTop: 20, marginBottom: 10},
  domainGrid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'},
  domainCard: {
    width: '48.5%',
    minHeight: 168,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  domainTopRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  domainTitle: {flex: 1, color: BROWN, fontSize: 13, fontWeight: '900', marginRight: 8},
  domainHeadline: {color: '#745E4D', fontSize: 11, lineHeight: 16, marginTop: 9},
  domainMeta: {color: '#957C65', fontSize: 9, marginTop: 8},
  domainAdvice: {color: '#644D3D', fontSize: 10, lineHeight: 15, marginTop: 8},
  levelBadge: {
    minWidth: 40,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  levelBadgeText: {color: '#FFF9EF', fontSize: 13, fontWeight: '900'},
  levelVeryFavorable: {backgroundColor: '#5E713E'},
  levelFavorable: {backgroundColor: '#7A7938'},
  levelBalanced: {backgroundColor: '#8B7256'},
  levelChallenging: {backgroundColor: '#9A5A45'},
  levelVeryChallenging: {backgroundColor: '#7D3E38'},
  palaceCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 17,
    marginBottom: 10,
    overflow: 'hidden',
  },
  palaceHeader: {minHeight: 72, flexDirection: 'row', alignItems: 'center', padding: 13},
  palaceHeaderText: {flex: 1, marginRight: 10},
  palaceTitle: {color: BROWN, fontSize: 14, fontWeight: '900'},
  palaceHeadline: {color: '#806A58', fontSize: 10, marginTop: 4},
  expandIcon: {color: '#816B58', fontSize: 18, marginLeft: 8},
  palaceBody: {borderTopWidth: 1, borderTopColor: '#EDDFCC', padding: 13},
  adviceText: {color: '#654E3C', fontSize: 11, lineHeight: 17},
  evidenceSectionTitle: {color: BROWN, fontSize: 12, fontWeight: '900', marginTop: 14, marginBottom: 5},
  evidenceRow: {flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 7},
  evidenceDot: {width: 8, height: 8, borderRadius: 4, marginTop: 5, marginRight: 8},
  evidenceDotPositive: {backgroundColor: '#6F8E4F'},
  evidenceDotNegative: {backgroundColor: '#B65D49'},
  evidenceDotNeutral: {backgroundColor: '#9B8D7E'},
  evidenceTextWrap: {flex: 1},
  evidenceTitle: {color: BROWN, fontSize: 11, fontWeight: '800', lineHeight: 16},
  evidenceMeta: {color: '#917966', fontSize: 9, marginTop: 2},
  deltaText: {width: 34, color: '#796553', fontSize: 11, fontWeight: '900', textAlign: 'right'},
  deltaPositive: {color: '#5A7A3F'},
  deltaNegative: {color: '#A34E3D'},
  emptyText: {color: '#9A8574', fontSize: 10, paddingVertical: 5},
  yearSelector: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BROWN,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 18,
    paddingHorizontal: 12,
  },
  yearButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 13,
  },
  yearButtonText: {color: '#FFE3A1', fontSize: 28, lineHeight: 31},
  yearCenter: {alignItems: 'center'},
  yearValue: {color: '#FFE3A1', fontSize: 25, fontWeight: '900'},
  yearMeta: {color: '#E8D0AA', fontSize: 11, marginTop: 3},
  yearStrip: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 10},
  yearChip: {minWidth: 42, alignItems: 'center', backgroundColor: '#F3E5D2', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 7},
  yearChipSelected: {backgroundColor: GOLD},
  yearChipText: {color: '#735B47', fontSize: 10, fontWeight: '800'},
  yearChipTextSelected: {color: '#3D2718'},
  annualCard: {backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 18, padding: 14, marginTop: 12},
  annualScoreRow: {flexDirection: 'row', alignItems: 'center'},
  largeScoreBadge: {width: 66, height: 66, alignItems: 'center', justifyContent: 'center', borderRadius: 18, marginRight: 12},
  largeScoreValue: {color: '#FFF8EC', fontSize: 24, fontWeight: '900'},
  annualHeadlineWrap: {flex: 1},
  annualHeadline: {color: BROWN, fontSize: 16, fontWeight: '900'},
  annualConfidence: {color: '#826C59', fontSize: 10, marginTop: 5},
  annualPalaceGrid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 13},
  annualPalaceCard: {width: '48.5%', minHeight: 65, backgroundColor: '#F6EAD9', borderRadius: 13, padding: 10, marginBottom: 8},
  annualPalaceLabel: {color: '#8C735E', fontSize: 9},
  annualPalaceValue: {color: BROWN, fontSize: 12, fontWeight: '900', marginTop: 5},
  noticeCard: {backgroundColor: '#F7EAD6', borderWidth: 1, borderColor: '#DFC59C', borderRadius: 15, padding: 13, marginTop: 15},
  noticeTitle: {color: BROWN, fontSize: 13, fontWeight: '900'},
  noticeText: {color: '#735C49', fontSize: 11, lineHeight: 17, marginTop: 5},
  pressed: {opacity: 0.68, transform: [{scale: 0.985}]},
});
