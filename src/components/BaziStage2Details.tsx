import React, {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useTranslation} from 'react-i18next';

import type {
  BaziChart,
  Element,
  LifeDomainLevel,
  RelationImpactTone,
  TenGod,
} from '../astrology/bazi';

import {
  translateBaziCode,
} from '../services/baziEngine';
import {
  getBaziInterpretationLanguage,
} from '../services/baziEngine';
type Props = {
  chart: BaziChart;

  /**
   * Optional. When omitted, the current i18next language is used.
   * The engine narrative currently supports Vietnamese and English;
   * unsupported languages fall back to English for engine-generated text.
   */
  language?: string;
};

type DomainKey = 'love' | 'career' | 'wealth';

function Chip({
  text,
  tone = 'neutral',
}: {
  text: string;
  tone?: 'good' | 'bad' | 'gold' | 'neutral';
}) {
  return (
    <View
      style={[
        styles.chip,
        tone === 'good' && styles.chipGood,
        tone === 'bad' && styles.chipBad,
        tone === 'gold' && styles.chipGold,
      ]}>
      <Text style={styles.chipText}>{text}</Text>
    </View>
  );
}

function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <View style={styles.scoreBarRow}>
      <View style={styles.scoreBarHeader}>
        <Text style={styles.scoreBarLabel}>{label}</Text>
        <Text style={styles.scoreBarValue}>{value.toFixed(1)}</Text>
      </View>

      <View style={styles.scoreBarTrack}>
        <View
          style={[
            styles.scoreBarFill,
            {
              width: `${normalized}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

function CodeList({
  title,
  codes,
  language,
  tone,
}: {
  title: string;
  codes: string[];
  language: string;
  tone: 'good' | 'bad' | 'gold';
}) {
  if (codes.length === 0) {
    return null;
  }

  return (
    <View style={styles.codeSection}>
      <Text style={styles.codeSectionTitle}>{title}</Text>

      {codes.map(code => (
        <View key={code} style={styles.codeRow}>
          <View
            style={[
              styles.codeDot,
              tone === 'good' && styles.codeDotGood,
              tone === 'bad' && styles.codeDotBad,
              tone === 'gold' && styles.codeDotGold,
            ]}
          />

          <Text style={styles.codeText}>
            {translateBaziCode(code, language)}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function BaziStage2Details({
  chart,
  language: languageOverride,
}: Props) {
  const {t, i18n} = useTranslation();

  const currentLanguage =
    languageOverride ??
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  // The engine's interpretation dictionary currently contains vi/en.
const engineLanguage =
  getBaziInterpretationLanguage(
    currentLanguage,
  );

  const [openDomain, setOpenDomain] =
    useState<DomainKey | ''>('love');

  const elementLabel = (element: Element) =>
    t(`bazi.elements.${element}`, {
      defaultValue: element,
    });

  const tenGodLabel = (
    value: TenGod | 'dayMaster' | 'mixed',
  ) =>
    t(`bazi.tenGods.${value}`, {
      defaultValue: value,
    });

  const levelLabel = (level: LifeDomainLevel) =>
    t(`bazi.stage2.levels.${level}`, {
      defaultValue: level,
    });

  const toneLabel = (tone: RelationImpactTone) =>
    t(`bazi.stage2.tones.${tone}`, {
      defaultValue: tone,
    });

  const relationTypeLabel = (type: string) =>
    t(`bazi.stage2.relationTypes.${type}`, {
      defaultValue: type,
    });

  const strategyLabel = (strategy: string) =>
    t(`bazi.stage2.strategies.${strategy}`, {
      defaultValue: strategy,
    });

  const climateLabel = (profile: string) =>
    t(`bazi.stage2.climates.${profile}`, {
      defaultValue: profile,
    });

  const patternLabel = (pattern: string) =>
    t(`bazi.stage2.patterns.${pattern}`, {
      defaultValue: pattern,
    });

  const domainItems: Array<{
    id: DomainKey;
    icon: string;
    titleKey: string;
  }> = [
    {
      id: 'love',
      icon: '💞',
      titleKey: 'bazi.stage2.domains.love',
    },
    {
      id: 'career',
      icon: '💼',
      titleKey: 'bazi.stage2.domains.career',
    },
    {
      id: 'wealth',
      icon: '💰',
      titleKey: 'bazi.stage2.domains.wealth',
    },
  ];

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t('bazi.stage2.title', {
            defaultValue: 'Stage 2: Detailed Analysis',
          })}
        </Text>

        <Text style={styles.sectionSubtitle}>
          {t('bazi.stage2.subtitle', {
            defaultValue:
              'Day Master strength, chart structure, useful elements, relations, and three life domains.',
          })}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {t('bazi.stage2.strengthAndStructure', {
            defaultValue: 'Day Master Strength and Structure',
          })}
        </Text>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>
              {t('bazi.stage2.strengthScore', {
                defaultValue: 'Strength score',
              })}
            </Text>
            <Text style={styles.summaryValue}>
              {chart.strength.score}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>
              {t('bazi.stage2.primaryStructure', {
                defaultValue: 'Primary structure',
              })}
            </Text>
            <Text style={styles.summaryValue}>
              {tenGodLabel(chart.structure.type)}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>
              {t('bazi.stage2.purity', {
                defaultValue: 'Purity',
              })}
            </Text>
            <Text style={styles.summaryValue}>
              {chart.structure.purityScore}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>
              {t('bazi.stage2.stability', {
                defaultValue: 'Stability',
              })}
            </Text>
            <Text style={styles.summaryValue}>
              {chart.structure.stabilityScore}
            </Text>
          </View>
        </View>

        <ScoreBar
          label={t('bazi.stage2.supportDrainBalance', {
            defaultValue: 'Support/drain balance',
          })}
          value={50 + chart.strength.components.supportBalance}
        />

        <ScoreBar
          label={t('bazi.stage2.monthCommand', {
            defaultValue: 'Month command',
          })}
          value={50 + chart.strength.components.monthCommand * 3}
        />

        <ScoreBar
          label={t('bazi.stage2.roots', {
            defaultValue: 'Roots',
          })}
          value={chart.strength.rootScore * 4}
        />

        <View style={styles.chipWrap}>
          <Chip
            text={
              chart.structure.isExposed
                ? t('bazi.stage2.structureExposed', {
                    defaultValue: 'Structure exposed',
                  })
                : t('bazi.stage2.structureHidden', {
                    defaultValue: 'Structure hidden',
                  })
            }
            tone="gold"
          />

          <Chip
            text={patternLabel(chart.strength.pattern)}
            tone={
              chart.strength.pattern === 'ordinary'
                ? 'good'
                : 'bad'
            }
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {t('bazi.stage2.detailedUsefulElements', {
            defaultValue: 'Detailed Useful Elements',
          })}
        </Text>

        <View style={styles.primaryElementCard}>
          <Text style={styles.primaryElementLabel}>
            {t('bazi.stage2.yongShen', {
              defaultValue: 'Yong Shen',
            })}
          </Text>

          <Text style={styles.primaryElementValue}>
            {chart.usefulElements.yongShen
              ? elementLabel(chart.usefulElements.yongShen)
              : '—'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>
            {t('bazi.stage2.xiShen', {
              defaultValue: 'Xi Shen',
            })}
          </Text>

          <View style={styles.chipWrap}>
            {chart.usefulElements.xiShen.length > 0 ? (
              chart.usefulElements.xiShen.map(element => (
                <Chip
                  key={element}
                  text={elementLabel(element)}
                  tone="good"
                />
              ))
            ) : (
              <Text style={styles.emptyText}>—</Text>
            )}
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>
            {t('bazi.stage2.jiShen', {
              defaultValue: 'Ji Shen',
            })}
          </Text>

          <View style={styles.chipWrap}>
            {chart.usefulElements.jiShen.length > 0 ? (
              chart.usefulElements.jiShen.map(element => (
                <Chip
                  key={element}
                  text={elementLabel(element)}
                  tone="bad"
                />
              ))
            ) : (
              <Text style={styles.emptyText}>—</Text>
            )}
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>
            {t('bazi.stage2.chouShen', {
              defaultValue: 'Chou Shen',
            })}
          </Text>

          <View style={styles.chipWrap}>
            {chart.usefulElements.chouShen.length > 0 ? (
              chart.usefulElements.chouShen.map(element => (
                <Chip
                  key={element}
                  text={elementLabel(element)}
                  tone="bad"
                />
              ))
            ) : (
              <Text style={styles.emptyText}>—</Text>
            )}
          </View>
        </View>

        <View style={styles.methodBox}>
          <Text style={styles.methodTitle}>
            {strategyLabel(chart.usefulElements.strategy)}
          </Text>

          <Text style={styles.methodText}>
            {t('bazi.stage2.seasonalClimate', {
              defaultValue: 'Seasonal climate',
            })}
            {': '}
            {climateLabel(chart.usefulElements.climateProfile)}
          </Text>

          <Text style={styles.methodText}>
            {t('bazi.stage2.confidence', {
              defaultValue: 'Confidence',
            })}
            {': '}
            {chart.usefulElements.confidence}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {t('bazi.stage2.relationsTitle', {
            defaultValue: 'Combinations and Conflicts',
          })}
        </Text>

        <View style={styles.relationCounters}>
          <View style={[styles.counter, styles.counterGood]}>
            <Text style={styles.counterValue}>
              {chart.relationSummary.supportiveCount}
            </Text>
            <Text style={styles.counterLabel}>
              {t('bazi.stage2.tones.supportive', {
                defaultValue: 'Supportive',
              })}
            </Text>
          </View>

          <View style={[styles.counter, styles.counterNeutral]}>
            <Text style={styles.counterValue}>
              {chart.relationSummary.mixedCount}
            </Text>
            <Text style={styles.counterLabel}>
              {t('bazi.stage2.tones.mixed', {
                defaultValue: 'Mixed',
              })}
            </Text>
          </View>

          <View style={[styles.counter, styles.counterBad]}>
            <Text style={styles.counterValue}>
              {chart.relationSummary.challengingCount}
            </Text>
            <Text style={styles.counterLabel}>
              {t('bazi.stage2.tones.challenging', {
                defaultValue: 'Challenging',
              })}
            </Text>
          </View>
        </View>

        <ScoreBar
          label={t('bazi.stage2.spousePalace', {
            defaultValue: 'Spouse palace',
          })}
          value={chart.relationSummary.spousePalaceScore}
        />

        <ScoreBar
          label={t('bazi.stage2.careerPillar', {
            defaultValue: 'Career pillar',
          })}
          value={chart.relationSummary.careerPalaceScore}
        />

        <ScoreBar
          label={t('bazi.stage2.family', {
            defaultValue: 'Family',
          })}
          value={chart.relationSummary.familyScore}
        />

        {chart.relationSummary.impacts
          .slice(0, 6)
          .map((impact, index) => (
            <View
              key={`${impact.relation.code}-${index}`}
              style={styles.relationRow}>
              <View
                style={[
                  styles.relationToneDot,
                  impact.tone === 'supportive' &&
                    styles.relationToneGood,
                  impact.tone === 'challenging' &&
                    styles.relationToneBad,
                ]}
              />

              <View style={styles.relationTextWrap}>
                <Text style={styles.relationTitle}>
                  {relationTypeLabel(impact.relation.type)}
                </Text>

                <Text style={styles.relationMeta}>
                  {toneLabel(impact.tone)}
                  {' • '}
                  {impact.weight > 0 ? '+' : ''}
                  {impact.weight}
                </Text>
              </View>
            </View>
          ))}
      </View>

      {domainItems.map(item => {
        const domain = chart.lifeDomains[item.id];
        const isOpen = openDomain === item.id;

        return (
          <View key={item.id} style={styles.card}>
            <Pressable
              style={({pressed}) => [
                styles.domainHeader,
                pressed && styles.pressed,
              ]}
              onPress={() =>
                setOpenDomain(current =>
                  current === item.id ? '' : item.id,
                )
              }>
              <Text style={styles.domainIcon}>{item.icon}</Text>

              <View style={styles.domainHeaderText}>
                <Text style={styles.domainTitle}>
                  {t(item.titleKey)}
                </Text>

                <Text style={styles.domainHeadline}>
                  {translateBaziCode(
                    domain.headlineCode,
                    engineLanguage,
                  )}
                </Text>
              </View>

              <View style={styles.domainScore}>
                <Text style={styles.domainScoreValue}>
                  {domain.score}
                </Text>

                <Text style={styles.domainScoreLabel}>
                  {levelLabel(domain.level)}
                </Text>
              </View>
            </Pressable>

            {isOpen && (
              <View style={styles.domainBody}>
                <CodeList
                  title={t('bazi.stage2.favorableFactors', {
                    defaultValue: 'Favorable factors',
                  })}
                  codes={domain.factorCodes}
                  language={engineLanguage}
                  tone="good"
                />

                <CodeList
                  title={t('bazi.stage2.pointsToConsider', {
                    defaultValue: 'Points to consider',
                  })}
                  codes={domain.riskCodes}
                  language={engineLanguage}
                  tone="bad"
                />

                <CodeList
                  title={t('bazi.stage2.suggestions', {
                    defaultValue: 'Suggestions',
                  })}
                  codes={domain.adviceCodes}
                  language={engineLanguage}
                  tone="gold"
                />
              </View>
            )}
          </View>
        );
      })}

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          {t('bazi.stage2.notice', {
            defaultValue:
              'Stage 2 uses a transparent, testable structural model. Useful elements, structure, and readings remain traditional references rather than certain predictions.',
          })}
        </Text>
      </View>
    </View>
  );
}

const BROWN = '#4E2C1C';
const GOLD = '#D0A04C';
const BORDER = '#E5CDA8';
const SURFACE = '#FFFDF8';

const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: 22,
    marginBottom: 11,
  },
  sectionTitle: {
    color: BROWN,
    fontSize: 22,
    fontWeight: '900',
  },
  sectionSubtitle: {
    color: '#806B59',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  card: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
  },
  cardTitle: {
    color: BROWN,
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48.5%',
    backgroundColor: '#F7EBDD',
    borderRadius: 13,
    padding: 11,
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#806B59',
    fontSize: 10,
  },
  summaryValue: {
    color: BROWN,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 4,
  },
  scoreBarRow: {
    marginTop: 10,
  },
  scoreBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  scoreBarLabel: {
    color: '#705B4A',
    fontSize: 11,
    fontWeight: '700',
  },
  scoreBarValue: {
    color: BROWN,
    fontSize: 11,
    fontWeight: '900',
  },
  scoreBarTrack: {
    height: 8,
    backgroundColor: '#E9DDD0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: GOLD,
    borderRadius: 4,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    backgroundColor: '#EEE7DE',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 6,
  },
  chipGood: {
    backgroundColor: '#E8F0DF',
  },
  chipBad: {
    backgroundColor: '#F8E3DB',
  },
  chipGold: {
    backgroundColor: '#F5E3B9',
  },
  chipText: {
    color: '#554435',
    fontSize: 10,
    fontWeight: '800',
  },
  primaryElementCard: {
    alignItems: 'center',
    backgroundColor: BROWN,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 16,
    padding: 14,
  },
  primaryElementLabel: {
    color: '#E8C98E',
    fontSize: 11,
    fontWeight: '700',
  },
  primaryElementValue: {
    color: '#FFE4A1',
    fontSize: 25,
    fontWeight: '900',
    marginTop: 4,
  },
  detailRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE1D0',
    paddingVertical: 10,
  },
  detailLabel: {
    color: BROWN,
    fontSize: 12,
    fontWeight: '900',
  },
  emptyText: {
    color: '#8A7462',
    fontSize: 12,
  },
  methodBox: {
    backgroundColor: '#FFF4DB',
    borderRadius: 13,
    padding: 12,
    marginTop: 12,
  },
  methodTitle: {
    color: BROWN,
    fontSize: 13,
    fontWeight: '900',
  },
  methodText: {
    color: '#765E49',
    fontSize: 11,
    marginTop: 4,
  },
  relationCounters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  counter: {
    width: '31.5%',
    alignItems: 'center',
    borderRadius: 13,
    paddingVertical: 10,
  },
  counterGood: {
    backgroundColor: '#E8F0DF',
  },
  counterNeutral: {
    backgroundColor: '#ECE8E2',
  },
  counterBad: {
    backgroundColor: '#F8E3DB',
  },
  counterValue: {
    color: BROWN,
    fontSize: 20,
    fontWeight: '900',
  },
  counterLabel: {
    color: '#705B4A',
    fontSize: 10,
    marginTop: 2,
  },
  relationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE1D0',
    paddingTop: 9,
    marginTop: 9,
  },
  relationToneDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#AAA097',
    marginRight: 9,
  },
  relationToneGood: {
    backgroundColor: '#718E54',
  },
  relationToneBad: {
    backgroundColor: '#B6654E',
  },
  relationTextWrap: {
    flex: 1,
  },
  relationTitle: {
    color: BROWN,
    fontSize: 12,
    fontWeight: '800',
  },
  relationMeta: {
    color: '#8A7461',
    fontSize: 10,
    marginTop: 2,
  },
  domainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  domainIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  domainHeaderText: {
    flex: 1,
  },
  domainTitle: {
    color: BROWN,
    fontSize: 15,
    fontWeight: '900',
  },
  domainHeadline: {
    color: '#765F4D',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  domainScore: {
    width: 62,
    alignItems: 'center',
    backgroundColor: '#F2DFB9',
    borderRadius: 13,
    paddingVertical: 6,
  },
  domainScoreValue: {
    color: BROWN,
    fontSize: 18,
    fontWeight: '900',
  },
  domainScoreLabel: {
    color: '#755E49',
    fontSize: 8,
    textAlign: 'center',
    marginTop: 1,
  },
  domainBody: {
    borderTopWidth: 1,
    borderTopColor: '#EEDFCB',
    marginTop: 12,
    paddingTop: 3,
  },
  codeSection: {
    marginTop: 11,
  },
  codeSectionTitle: {
    color: BROWN,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 5,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 5,
  },
  codeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 8,
  },
  codeDotGood: {
    backgroundColor: '#718E54',
  },
  codeDotBad: {
    backgroundColor: '#B6654E',
  },
  codeDotGold: {
    backgroundColor: GOLD,
  },
  codeText: {
    flex: 1,
    color: '#6D5848',
    fontSize: 11,
    lineHeight: 17,
  },
  notice: {
    backgroundColor: '#F7EAD6',
    borderWidth: 1,
    borderColor: '#DFC59C',
    borderRadius: 15,
    padding: 13,
    marginTop: 2,
  },
  noticeText: {
    color: '#745C48',
    fontSize: 10,
    lineHeight: 16,
  },
  pressed: {
    opacity: 0.68,
  },
});
