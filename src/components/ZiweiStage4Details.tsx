import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import type {
  ZiweiChartStage4,
  ZiweiChartStage5,
  ZiweiChartStage6,
  ZiweiPalaceId,
  ZiweiStarBrightness,
  ZiweiTransformationPlacement,
} from '../astrology/ziwei';

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

const BRIGHTNESS_ORDER: Exclude<
  ZiweiStarBrightness,
  'notEvaluated'
>[] = ['mien', 'vuong', 'dac', 'binh', 'ham'];

type Props = {
  chart: ZiweiChartStage4 | ZiweiChartStage5 | ZiweiChartStage6;
};

export default function ZiweiStage4Details({chart}: Props) {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t('ziwei.stage4Title')}</Text>
      <Text style={styles.subtitle}>{t('ziwei.stage4Subtitle')}</Text>

      <View style={styles.summaryGrid}>
        <SummaryCard
          label={t('ziwei.stage4Labels.transformationCount')}
          value={String(chart.transformations.length)}
        />
        <SummaryCard
          label={t('ziwei.stage4Labels.voidMarkerCount')}
          value={String(chart.voidMarkers.length)}
        />
        <SummaryCard
          label={t('ziwei.stage4Labels.trangSinhCount')}
          value={String(chart.trangSinhCycle.length)}
        />
        <SummaryCard
          label={t('ziwei.stage4Labels.brightnessCount')}
          value={String(chart.brightnessSummary.evaluatedCount)}
        />
      </View>

      <Text style={styles.sectionTitle}>
        {t('ziwei.stage4Labels.fourTransformations')}
      </Text>

      <View style={styles.transformationGrid}>
        {chart.transformations.map(item => (
          <TransformationCard key={item.type} item={item} />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        {t('ziwei.stage4Labels.voidMarkers')}
      </Text>

      <View style={styles.voidRow}>
        {chart.voidMarkers.map(marker => (
          <View key={marker.id} style={styles.voidCard}>
            <Text style={styles.voidName}>
              {t(`ziwei.voidMarkers.${marker.id}`)}
            </Text>
            <Text style={styles.voidBranches}>
              {marker.branchIds
                .map(branch => t(`ziwei.branches.${branch}`))
                .join(' · ')}
            </Text>
            <Text style={styles.voidPalaces}>
              {marker.palaceIds
                .map(palace => t(`ziwei.palaces.${palace}`))
                .join(' · ')}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        {t('ziwei.stage4Labels.brightnessTitle')}
      </Text>

      <View style={styles.brightnessSummary}>
        {BRIGHTNESS_ORDER.map(level => (
          <View key={level} style={styles.brightnessItem}>
            <Text style={styles.brightnessLabel}>
              {t(`ziwei.brightness.${level}`)}
            </Text>
            <Text style={styles.brightnessValue}>
              {chart.brightnessSummary.byBrightness[level]}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.starBrightnessList}>
        {chart.mainStars.map(star => (
          <View key={star.id} style={styles.starBrightnessRow}>
            <View style={styles.starBrightnessText}>
              <Text style={styles.starName}>
                {t(`ziwei.mainStars.${star.id}`)}
              </Text>
              <Text style={styles.starPlace}>
                {t(`ziwei.palaces.${star.palaceId}`)} ·{' '}
                {t(`ziwei.branches.${star.branchId}`)}
              </Text>
            </View>
            <View
              style={[
                styles.brightnessBadge,
                brightnessBadgeStyle(star.brightness),
              ]}>
              <Text style={styles.brightnessBadgeText}>
                {t(`ziwei.brightness.${star.brightness}`)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        {t('ziwei.stage4Labels.trangSinhTitle')}
      </Text>

      <View style={styles.cycleCard}>
        {chart.trangSinhCycle.map(item => (
          <View key={item.stageId} style={styles.cycleRow}>
            <View style={styles.cycleIndex}>
              <Text style={styles.cycleIndexText}>{item.sequenceIndex + 1}</Text>
            </View>
            <View style={styles.cycleTextWrap}>
              <Text style={styles.cycleStage}>
                {t(`ziwei.trangSinh.${item.stageId}`)}
              </Text>
              <Text style={styles.cycleMeta}>
                {t(`ziwei.branches.${item.branchId}`)} ·{' '}
                {t(`ziwei.palaces.${item.palaceId}`)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        {t('ziwei.stage4Labels.byPalace')}
      </Text>

      <View style={styles.palaceOverlayList}>
        {PALACE_ORDER.map(palaceId => {
          const transformations = chart.transformationsByPalace[palaceId];
          const voids = chart.voidMarkersByPalace[palaceId];
          const cycle = chart.trangSinhByPalace[palaceId];

          return (
            <View key={palaceId} style={styles.palaceOverlayRow}>
              <View style={styles.palaceOverlayTitleWrap}>
                <Text style={styles.palaceOverlayTitle}>
                  {t(`ziwei.palaces.${palaceId}`)}
                </Text>
                <Text style={styles.palaceOverlayBranch}>
                  {t(`ziwei.branches.${cycle.branchId}`)}
                </Text>
              </View>

              <View style={styles.overlayChipWrap}>
                <View style={styles.cycleChip}>
                  <Text style={styles.cycleChipText}>
                    {t(`ziwei.trangSinh.${cycle.stageId}`)}
                  </Text>
                </View>

                {transformations.map(item => (
                  <View key={item.type} style={styles.transformChip}>
                    <Text style={styles.transformChipText}>
                      {t(`ziwei.transformations.${item.type}`)}
                    </Text>
                  </View>
                ))}

                {voids.map(item => (
                  <View key={item} style={styles.voidChip}>
                    <Text style={styles.voidChipText}>
                      {t(`ziwei.voidMarkers.${item}`)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.rulesCard}>
        <Text style={styles.rulesTitle}>
          {t('ziwei.stage4Labels.rulesetTitle')}
        </Text>
        <Text style={styles.rulesText}>
          {t('ziwei.stage4Labels.rulesetNotice')}
        </Text>
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

function TransformationCard({item}: {item: ZiweiTransformationPlacement}) {
  const {t} = useTranslation();
  const starKey =
    item.starKind === 'main'
      ? `ziwei.mainStars.${item.starId}`
      : `ziwei.auxiliaryStars.${item.starId}`;

  return (
    <View style={[styles.transformationCard, transformationStyle(item.type)]}>
      <Text style={styles.transformationType}>
        {t(`ziwei.transformations.${item.type}`)}
      </Text>
      <Text style={styles.transformationStar}>{t(starKey)}</Text>
      <Text style={styles.transformationMeta}>
        {t(`ziwei.palaces.${item.palaceId}`)} ·{' '}
        {t(`ziwei.branches.${item.branchId}`)}
      </Text>
    </View>
  );
}

function transformationStyle(type: ZiweiTransformationPlacement['type']) {
  if (type === 'lu') return styles.transformationLu;
  if (type === 'quan') return styles.transformationQuan;
  if (type === 'ke') return styles.transformationKe;
  return styles.transformationJi;
}

function brightnessBadgeStyle(brightness: ZiweiStarBrightness) {
  if (brightness === 'mien') return styles.brightnessMien;
  if (brightness === 'vuong') return styles.brightnessVuong;
  if (brightness === 'dac') return styles.brightnessDac;
  if (brightness === 'ham') return styles.brightnessHam;
  return styles.brightnessBinh;
}

const BROWN = '#4B2A1A';
const GOLD = '#D1A052';
const SURFACE = '#FFFDF8';
const BORDER = '#E4CAA2';

const styles = StyleSheet.create({
  container: {marginTop: 20},
  heading: {color: BROWN, fontSize: 21, fontWeight: '900'},
  subtitle: {color: '#806A58', fontSize: 12, lineHeight: 18, marginTop: 5},
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  summaryCard: {
    width: '48.5%',
    minHeight: 72,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    padding: 11,
    marginBottom: 9,
  },
  summaryLabel: {color: '#8A715B', fontSize: 10, lineHeight: 15},
  summaryValue: {color: BROWN, fontSize: 21, fontWeight: '900', marginTop: 4},
  sectionTitle: {
    color: BROWN,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 18,
    marginBottom: 9,
  },
  transformationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  transformationCard: {
    width: '48.5%',
    minHeight: 98,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 9,
  },
  transformationLu: {backgroundColor: '#EEF4E5', borderColor: '#B6C99B'},
  transformationQuan: {backgroundColor: '#F6E7CC', borderColor: '#D6B477'},
  transformationKe: {backgroundColor: '#E8EFF6', borderColor: '#AFC3D5'},
  transformationJi: {backgroundColor: '#FFF0EA', borderColor: '#DDB29E'},
  transformationType: {color: BROWN, fontSize: 11, fontWeight: '900'},
  transformationStar: {color: '#6F3A22', fontSize: 16, fontWeight: '900', marginTop: 7},
  transformationMeta: {color: '#7F6957', fontSize: 10, marginTop: 5},
  voidRow: {flexDirection: 'row', justifyContent: 'space-between'},
  voidCard: {
    width: '48.5%',
    backgroundColor: '#4B2A1A',
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 16,
    padding: 12,
  },
  voidName: {color: '#FFE2A0', fontSize: 15, fontWeight: '900'},
  voidBranches: {color: '#F0D6AE', fontSize: 12, fontWeight: '800', marginTop: 6},
  voidPalaces: {color: '#CDB491', fontSize: 10, lineHeight: 15, marginTop: 4},
  brightnessSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 10,
  },
  brightnessItem: {flex: 1, alignItems: 'center'},
  brightnessLabel: {color: '#806956', fontSize: 9, fontWeight: '700'},
  brightnessValue: {color: BROWN, fontSize: 17, fontWeight: '900', marginTop: 3},
  starBrightnessList: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 9,
  },
  starBrightnessRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEDFCB',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  starBrightnessText: {flex: 1},
  starName: {color: BROWN, fontSize: 12, fontWeight: '900'},
  starPlace: {color: '#86705D', fontSize: 9, marginTop: 3},
  brightnessBadge: {borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5},
  brightnessBadgeText: {color: '#4B2A1A', fontSize: 9, fontWeight: '900'},
  brightnessMien: {backgroundColor: '#F3D78F'},
  brightnessVuong: {backgroundColor: '#E7E6A7'},
  brightnessDac: {backgroundColor: '#DCEACB'},
  brightnessBinh: {backgroundColor: '#E7E0D6'},
  brightnessHam: {backgroundColor: '#F5CFC6'},
  cycleCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cycleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEDFCB',
    padding: 10,
  },
  cycleIndex: {
    width: 31,
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0DEBF',
    borderRadius: 10,
    marginRight: 10,
  },
  cycleIndexText: {color: BROWN, fontSize: 11, fontWeight: '900'},
  cycleTextWrap: {flex: 1},
  cycleStage: {color: BROWN, fontSize: 12, fontWeight: '900'},
  cycleMeta: {color: '#806A58', fontSize: 9, marginTop: 3},
  palaceOverlayList: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    overflow: 'hidden',
  },
  palaceOverlayRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEDFCB',
    padding: 10,
  },
  palaceOverlayTitleWrap: {width: 92, marginRight: 8},
  palaceOverlayTitle: {color: BROWN, fontSize: 11, fontWeight: '900'},
  palaceOverlayBranch: {color: '#A06B35', fontSize: 9, marginTop: 3},
  overlayChipWrap: {flex: 1, flexDirection: 'row', flexWrap: 'wrap'},
  cycleChip: {
    backgroundColor: '#F2E4CB',
    borderRadius: 9,
    paddingHorizontal: 7,
    paddingVertical: 4,
    marginRight: 5,
    marginBottom: 4,
  },
  cycleChipText: {color: '#6C4C33', fontSize: 8, fontWeight: '800'},
  transformChip: {
    backgroundColor: '#E7EFE0',
    borderRadius: 9,
    paddingHorizontal: 7,
    paddingVertical: 4,
    marginRight: 5,
    marginBottom: 4,
  },
  transformChipText: {color: '#4F663E', fontSize: 8, fontWeight: '900'},
  voidChip: {
    backgroundColor: '#F4DAD3',
    borderRadius: 9,
    paddingHorizontal: 7,
    paddingVertical: 4,
    marginRight: 5,
    marginBottom: 4,
  },
  voidChipText: {color: '#7B3F32', fontSize: 8, fontWeight: '900'},
  rulesCard: {
    backgroundColor: '#FFF1D7',
    borderWidth: 1,
    borderColor: '#D9B678',
    borderRadius: 16,
    padding: 13,
    marginTop: 13,
  },
  rulesTitle: {color: BROWN, fontSize: 13, fontWeight: '900'},
  rulesText: {color: '#745D49', fontSize: 10, lineHeight: 16, marginTop: 5},
});
