import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import type {
  ZiweiAuxiliaryStarCategory,
  ZiweiAuxiliaryStarPlacement,
  ZiweiAuxiliaryStarTone,
  ZiweiChartStage3,
  ZiweiChartStage4,
  ZiweiChartStage5,
  ZiweiChartStage6,
} from '../astrology/ziwei';

const CATEGORY_ORDER: ZiweiAuxiliaryStarCategory[] = [
  'assistant',
  'literary',
  'noble',
  'wealth',
  'mobility',
  'romance',
  'ceremonial',
  'solitary',
  'malefic',
];

export default function ZiweiStage3Details({
  chart,
}: {
  chart: ZiweiChartStage3 | ZiweiChartStage4 | ZiweiChartStage5 | ZiweiChartStage6;
}) {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t('ziwei.stage3Title')}</Text>
      <Text style={styles.subtitle}>{t('ziwei.stage3Subtitle')}</Text>

      <View style={styles.summaryGrid}>
        <SummaryCard
          label={t('ziwei.stage3Labels.auxiliaryStarCount')}
          value={String(chart.auxiliarySummary.total)}
        />
        <SummaryCard
          label={t('ziwei.stage3Labels.supportiveCount')}
          value={String(chart.auxiliarySummary.supportiveCount)}
        />
        <SummaryCard
          label={t('ziwei.stage3Labels.challengingCount')}
          value={String(chart.auxiliarySummary.challengingCount)}
        />
        <SummaryCard
          label={t('ziwei.stage3Labels.mixedCount')}
          value={String(chart.auxiliarySummary.mixedCount)}
        />
      </View>

      <View style={styles.anchorCard}>
        <AnchorItem
          label={t('ziwei.auxiliaryStars.luCun')}
          value={t(`ziwei.branches.${chart.auxiliarySummary.luCunBranchId}`)}
        />
        <AnchorItem
          label={t('ziwei.auxiliaryStars.qingYang')}
          value={t(`ziwei.branches.${chart.auxiliarySummary.qingYangBranchId}`)}
        />
        <AnchorItem
          label={t('ziwei.auxiliaryStars.tuoLuo')}
          value={t(`ziwei.branches.${chart.auxiliarySummary.tuoLuoBranchId}`)}
        />
      </View>

      <Text style={styles.sectionTitle}>
        {t('ziwei.stage3Labels.byCategory')}
      </Text>

      {CATEGORY_ORDER.map(category => {
        const stars = chart.auxiliaryStars.filter(
          item => item.category === category,
        );
        if (stars.length === 0) return null;

        return (
          <View key={category} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>
                {t(`ziwei.auxiliaryCategories.${category}`)}
              </Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{stars.length}</Text>
              </View>
            </View>

            <View style={styles.starWrap}>
              {stars.map(star => (
                <StarChip key={star.id} star={star} />
              ))}
            </View>
          </View>
        );
      })}

      <Text style={styles.sectionTitle}>
        {t('ziwei.stage3Labels.byPalace')}
      </Text>

      <View style={styles.palaceList}>
        {chart.palaces.map(palace => {
          const stars = chart.auxiliaryStarsByPalace[palace.id];
          return (
            <View key={palace.id} style={styles.palaceRow}>
              <View style={styles.palaceLabelWrap}>
                <Text style={styles.palaceBranch}>
                  {t(`ziwei.branches.${palace.branchId}`)}
                </Text>
                <Text style={styles.palaceName}>
                  {t(`ziwei.palaces.${palace.id}`)}
                </Text>
              </View>

              <View style={styles.palaceStars}>
                {stars.length === 0 ? (
                  <Text style={styles.emptyText}>
                    {t('ziwei.stage3Labels.noAuxiliaryStar')}
                  </Text>
                ) : (
                  stars.map(star => <StarChip key={star.id} star={star} compact />)
                )}
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.rulesCard}>
        <Text style={styles.rulesTitle}>
          {t('ziwei.stage3Labels.rulesetTitle')}
        </Text>
        <Text style={styles.rulesText}>
          {t('ziwei.stage3Labels.rulesetNotice')}
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

function AnchorItem({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.anchorItem}>
      <Text style={styles.anchorLabel}>{label}</Text>
      <Text style={styles.anchorValue}>{value}</Text>
    </View>
  );
}

function StarChip({
  star,
  compact = false,
}: {
  star: ZiweiAuxiliaryStarPlacement;
  compact?: boolean;
}) {
  const {t} = useTranslation();
  return (
    <View
      style={[
        styles.starChip,
        toneStyle(star.tone),
        compact && styles.starChipCompact,
      ]}>
      <Text style={styles.starName}>{t(`ziwei.auxiliaryStars.${star.id}`)}</Text>
      {!compact && (
        <Text style={styles.starMeta}>
          {t(`ziwei.branches.${star.branchId}`)} ·{' '}
          {t(`ziwei.auxiliaryTones.${star.tone}`)}
        </Text>
      )}
    </View>
  );
}

function toneStyle(tone: ZiweiAuxiliaryStarTone) {
  if (tone === 'supportive') return styles.starChipSupportive;
  if (tone === 'challenging') return styles.starChipChallenging;
  return styles.starChipMixed;
}

const BROWN = '#4B2A1A';
const GOLD = '#D1A052';
const SURFACE = '#FFFDF8';
const BORDER = '#E4CAA2';

const styles = StyleSheet.create({
  container: {marginTop: 20},
  heading: {color: BROWN, fontSize: 21, fontWeight: '900'},
  subtitle: {color: '#806A58', fontSize: 12, lineHeight: 18, marginTop: 5},
  summaryGrid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 12},
  summaryCard: {width: '48.5%', minHeight: 72, backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 15, padding: 11, marginBottom: 9},
  summaryLabel: {color: '#8A715B', fontSize: 10, lineHeight: 15},
  summaryValue: {color: BROWN, fontSize: 21, fontWeight: '900', marginTop: 4},
  anchorCard: {flexDirection: 'row', backgroundColor: '#4B2A1A', borderWidth: 1, borderColor: GOLD, borderRadius: 17, padding: 10, marginTop: 3},
  anchorItem: {flex: 1, alignItems: 'center', paddingHorizontal: 4},
  anchorLabel: {color: '#E8D0AE', fontSize: 10, textAlign: 'center'},
  anchorValue: {color: '#FFE2A0', fontSize: 15, fontWeight: '900', marginTop: 4},
  sectionTitle: {color: BROWN, fontSize: 17, fontWeight: '900', marginTop: 18, marginBottom: 9},
  categoryCard: {backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 16, padding: 12, marginBottom: 9},
  categoryHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  categoryTitle: {color: BROWN, fontSize: 14, fontWeight: '900'},
  countBadge: {minWidth: 26, height: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0DEBF', borderRadius: 9},
  countBadgeText: {color: BROWN, fontSize: 11, fontWeight: '900'},
  starWrap: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 8},
  starChip: {borderWidth: 1, borderRadius: 11, paddingHorizontal: 9, paddingVertical: 6, marginRight: 6, marginBottom: 6},
  starChipCompact: {paddingHorizontal: 7, paddingVertical: 4},
  starChipSupportive: {backgroundColor: '#EEF4E5', borderColor: '#B6C99B'},
  starChipChallenging: {backgroundColor: '#FFF0EA', borderColor: '#DDB29E'},
  starChipMixed: {backgroundColor: '#F2E9DA', borderColor: '#CFB995'},
  starName: {color: BROWN, fontSize: 10, fontWeight: '900'},
  starMeta: {color: '#7F6957', fontSize: 8, marginTop: 2},
  palaceList: {backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 17, overflow: 'hidden'},
  palaceRow: {flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EEDFCB', padding: 11},
  palaceLabelWrap: {width: 88, marginRight: 9},
  palaceBranch: {color: '#A06B35', fontSize: 10, fontWeight: '900'},
  palaceName: {color: BROWN, fontSize: 12, fontWeight: '900', marginTop: 3},
  palaceStars: {flex: 1, flexDirection: 'row', flexWrap: 'wrap'},
  emptyText: {color: '#9A8471', fontSize: 10, fontStyle: 'italic', marginTop: 5},
  rulesCard: {backgroundColor: '#FFF1D7', borderWidth: 1, borderColor: '#D9B678', borderRadius: 16, padding: 13, marginTop: 13},
  rulesTitle: {color: BROWN, fontSize: 13, fontWeight: '900'},
  rulesText: {color: '#745D49', fontSize: 10, lineHeight: 16, marginTop: 5},
});
