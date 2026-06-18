import React, {useMemo, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import type {
  ZiweiAnnualCycle,
  ZiweiChartStage5,
  ZiweiChartStage6,
} from '../astrology/ziwei';

type Props = {
  chart: ZiweiChartStage5 | ZiweiChartStage6;
};

function clampYear(
  chart: ZiweiChartStage5 | ZiweiChartStage6,
  year: number,
): number {
  return Math.max(
    chart.annualCycleRange.startYear,
    Math.min(chart.annualCycleRange.endYear, year),
  );
}

export default function ZiweiStage5Details({chart}: Props) {
  const {t} = useTranslation();

  const initialYear = clampYear(chart, new Date().getFullYear());
  const [selectedYear, setSelectedYear] = useState(initialYear);

  const annual = useMemo(
    () =>
      chart.annualCycles.find(item => item.calendarYear === selectedYear) ??
      chart.annualCycles[0],
    [chart.annualCycles, selectedYear],
  );

  const activeMajor = useMemo(
    () =>
      annual.activeMajorCycleIndex === null
        ? undefined
        : chart.majorCycles.find(
            item => item.index === annual.activeMajorCycleIndex,
          ),
    [annual.activeMajorCycleIndex, chart.majorCycles],
  );

  const nearbyYears = useMemo(() => {
    const start = clampYear(chart, selectedYear - 3);
    const end = clampYear(chart, start + 6);
    const normalizedStart = Math.max(
      chart.annualCycleRange.startYear,
      end - 6,
    );

    return chart.annualCycles.filter(
      item =>
        item.calendarYear >= normalizedStart &&
        item.calendarYear <= end,
    );
  }, [chart, selectedYear]);

  const changeYear = (delta: number) => {
    setSelectedYear(current => clampYear(chart, current + delta));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t('ziwei.stage5.title')}</Text>
      <Text style={styles.subtitle}>{t('ziwei.stage5.subtitle')}</Text>

      <View style={styles.summaryGrid}>
        <SummaryCard
          label={t('ziwei.stage5.majorCycleCount')}
          value={String(chart.majorCycles.length)}
        />
        <SummaryCard
          label={t('ziwei.stage5.minorCycleCount')}
          value={String(chart.minorCycles.length)}
        />
        <SummaryCard
          label={t('ziwei.stage5.annualCycleCount')}
          value={String(chart.annualCycles.length)}
        />
        <SummaryCard
          label={t('ziwei.stage5.ruleset')}
          value={t('ziwei.stage5.rulesetName')}
        />
      </View>

      <Text style={styles.sectionTitle}>{t('ziwei.stage5.majorCycles')}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.majorCycleRow}>
        {chart.majorCycles.map(item => {
          const active = item.index === annual.activeMajorCycleIndex;

          return (
            <View
              key={item.index}
              style={[
                styles.majorCycleCard,
                active && styles.majorCycleCardActive,
              ]}>
              <Text
                style={[
                  styles.majorCycleAge,
                  active && styles.majorCycleTextActive,
                ]}>
                {item.startAge}–{item.endAge}
              </Text>
              <Text
                style={[
                  styles.majorCyclePalace,
                  active && styles.majorCycleTextActive,
                ]}>
                {t(`ziwei.palaces.${item.palaceId}`)}
              </Text>
              <Text
                style={[
                  styles.majorCycleBranch,
                  active && styles.majorCycleMetaActive,
                ]}>
                {t(`ziwei.branches.${item.branchId}`)}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <Text style={styles.sectionTitle}>{t('ziwei.stage5.annualTransit')}</Text>

      <View style={styles.yearSelector}>
        <Pressable
          style={({pressed}) => [styles.yearButton, pressed && styles.pressed]}
          onPress={() => changeYear(-1)}>
          <Text style={styles.yearButtonText}>‹</Text>
        </Pressable>

        <View style={styles.yearCenter}>
          <Text style={styles.yearValue}>{annual.calendarYear}</Text>
          <Text style={styles.yearCanChi}>
            {t(`ziwei.stems.${annual.yearStemId}`)}{' '}
            {t(`ziwei.branches.${annual.yearBranchId}`)}
          </Text>
        </View>

        <Pressable
          style={({pressed}) => [styles.yearButton, pressed && styles.pressed]}
          onPress={() => changeYear(1)}>
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

      <View style={styles.detailGrid}>
        <DetailCard
          label={t('ziwei.stage5.nominalAge')}
          value={String(annual.nominalAge)}
        />
        <DetailCard
          label={t('ziwei.stage5.solarAge')}
          value={String(annual.solarAge)}
        />
        <DetailCard
          label={t('ziwei.stage5.activeMajorCycle')}
          value={
            activeMajor
              ? `${t(`ziwei.palaces.${activeMajor.palaceId}`)} · ${activeMajor.startAge}–${activeMajor.endAge}`
              : t('ziwei.stage5.notStarted')
          }
        />
        <DetailCard
          label={t('ziwei.stage5.minorCycle')}
          value={`${t(`ziwei.palaces.${annual.minorCyclePalaceId}`)} · ${t(`ziwei.branches.${annual.minorCycleBranchId}`)}`}
        />
        <DetailCard
          label={t('ziwei.stage5.annualTaiSui')}
          value={`${t(`ziwei.palaces.${annual.taiSuiPalaceId}`)} · ${t(`ziwei.branches.${annual.taiSuiBranchId}`)}`}
        />
        <DetailCard
          label={t('ziwei.stage5.annualTransformationCount')}
          value={String(annual.annualTransformations.length)}
        />
      </View>

      <Text style={styles.subheading}>{t('ziwei.stage5.annualStars')}</Text>
      <View style={styles.starWrap}>
        {annual.annualStars.map(item => (
          <View
            key={item.id}
            style={[styles.starChip, annualStarStyle(item.tone)]}>
            <Text style={styles.starChipTitle}>
              {t(`ziwei.stage5.annualStarNames.${item.id}`)}
            </Text>
            <Text style={styles.starChipMeta}>
              {t(`ziwei.palaces.${item.palaceId}`)} ·{' '}
              {t(`ziwei.branches.${item.branchId}`)}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.subheading}>
        {t('ziwei.stage5.annualTransformations')}
      </Text>
      <View style={styles.transformationList}>
        {annual.annualTransformations.map(item => (
          <View key={item.type} style={styles.transformationRow}>
            <View style={styles.transformationBadge}>
              <Text style={styles.transformationBadgeText}>
                {t(`ziwei.transformations.${item.type}`)}
              </Text>
            </View>
            <View style={styles.transformationTextWrap}>
              <Text style={styles.transformationStar}>
                {t(
                  item.starKind === 'main'
                    ? `ziwei.mainStars.${item.starId}`
                    : `ziwei.auxiliaryStars.${item.starId}`,
                )}
              </Text>
              <Text style={styles.transformationMeta}>
                {t(`ziwei.palaces.${item.palaceId}`)} ·{' '}
                {t(`ziwei.branches.${item.branchId}`)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>{t('ziwei.stage5.noticeTitle')}</Text>
        <Text style={styles.noticeText}>{t('ziwei.stage5.notice')}</Text>
      </View>
    </View>
  );
}

function SummaryCard({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function DetailCard({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.detailCard}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function annualStarStyle(
  tone: ZiweiAnnualCycle['annualStars'][number]['tone'],
) {
  switch (tone) {
    case 'supportive':
      return styles.starChipSupportive;
    case 'challenging':
      return styles.starChipChallenging;
    case 'mixed':
      return styles.starChipMixed;
    default:
      return styles.starChipNeutral;
  }
}

const BROWN = '#4B2A1A';
const GOLD = '#D1A052';
const SURFACE = '#FFFDF8';
const BORDER = '#E4CAA2';

const styles = StyleSheet.create({
  container: {marginTop: 22},
  heading: {color: BROWN, fontSize: 22, fontWeight: '900'},
  subtitle: {color: '#806A58', fontSize: 13, lineHeight: 19, marginTop: 5},
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 13,
  },
  summaryCard: {
    width: '48.5%',
    minHeight: 76,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    padding: 12,
    marginBottom: 9,
  },
  summaryLabel: {color: '#8A735E', fontSize: 11},
  summaryValue: {color: BROWN, fontSize: 16, fontWeight: '900', marginTop: 6},
  sectionTitle: {color: BROWN, fontSize: 18, fontWeight: '900', marginTop: 18, marginBottom: 10},
  subheading: {color: BROWN, fontSize: 15, fontWeight: '900', marginTop: 17, marginBottom: 9},
  majorCycleRow: {paddingRight: 8},
  majorCycleCard: {
    width: 106,
    minHeight: 96,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    padding: 10,
    marginRight: 9,
  },
  majorCycleCardActive: {backgroundColor: BROWN, borderColor: GOLD},
  majorCycleAge: {color: '#8A735E', fontSize: 11, fontWeight: '800'},
  majorCyclePalace: {color: BROWN, fontSize: 14, fontWeight: '900', marginTop: 7, textAlign: 'center'},
  majorCycleBranch: {color: '#9A806A', fontSize: 11, marginTop: 4},
  majorCycleTextActive: {color: '#FFE4A2'},
  majorCycleMetaActive: {color: '#EACD9A'},
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
  yearCanChi: {color: '#E8D0AA', fontSize: 12, marginTop: 3},
  yearStrip: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 10},
  yearChip: {
    minWidth: 42,
    alignItems: 'center',
    backgroundColor: '#F3E5D2',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 7,
  },
  yearChipSelected: {backgroundColor: GOLD},
  yearChipText: {color: '#735B47', fontSize: 10, fontWeight: '800'},
  yearChipTextSelected: {color: '#3D2718'},
  detailGrid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 12},
  detailCard: {
    width: '48.5%',
    minHeight: 76,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 11,
    marginBottom: 9,
  },
  detailLabel: {color: '#8A735E', fontSize: 10},
  detailValue: {color: BROWN, fontSize: 13, fontWeight: '900', lineHeight: 18, marginTop: 5},
  starWrap: {flexDirection: 'row', flexWrap: 'wrap'},
  starChip: {
    width: '48.5%',
    borderWidth: 1,
    borderRadius: 13,
    padding: 10,
    marginRight: '1.5%',
    marginBottom: 8,
  },
  starChipSupportive: {backgroundColor: '#EDF4E5', borderColor: '#B9C99D'},
  starChipChallenging: {backgroundColor: '#FFF0E9', borderColor: '#D8AF9D'},
  starChipMixed: {backgroundColor: '#F2EAF7', borderColor: '#C8B5D2'},
  starChipNeutral: {backgroundColor: '#F1ECE6', borderColor: '#CFC4B8'},
  starChipTitle: {color: BROWN, fontSize: 12, fontWeight: '900'},
  starChipMeta: {color: '#7B6553', fontSize: 10, marginTop: 4},
  transformationList: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 12,
  },
  transformationRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 7},
  transformationBadge: {
    minWidth: 86,
    alignItems: 'center',
    backgroundColor: '#F0D7A5',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 10,
  },
  transformationBadgeText: {color: BROWN, fontSize: 9, fontWeight: '900'},
  transformationTextWrap: {flex: 1},
  transformationStar: {color: BROWN, fontSize: 12, fontWeight: '900'},
  transformationMeta: {color: '#806A58', fontSize: 10, marginTop: 3},
  noticeCard: {
    backgroundColor: '#F7EAD6',
    borderWidth: 1,
    borderColor: '#DFC59C',
    borderRadius: 15,
    padding: 13,
    marginTop: 15,
  },
  noticeTitle: {color: BROWN, fontSize: 13, fontWeight: '900'},
  noticeText: {color: '#735C49', fontSize: 11, lineHeight: 17, marginTop: 5},
  pressed: {opacity: 0.68, transform: [{scale: 0.985}]},
});
