import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation, useRoute} from '@react-navigation/native';

import ZiweiStage3Details from '../components/ZiweiStage3Details';
import ZiweiStage4Details from '../components/ZiweiStage4Details';
import ZiweiStage5Details from '../components/ZiweiStage5Details';
import ZiweiStage6Details from '../components/ZiweiStage6Details';

import {
  calculateZiweiFromForm,
  type ZiweiFormValues,
} from '../services/ziweiEngine';

import {
  getUserProfile,
} from '../services/userProfiles';

import {
  getUserProfileTimeWarningCode,
  userProfileToZiweiForm,
} from '../services/userProfileAdapters';

import ExpertModeBar
  from '../components/ExpertModeBar';

import ExpertDetailsCard
  from '../components/ExpertDetailsCard';

import {
  useExpertMode,
} from '../services/expertMode';

import type {
  EarthlyBranchId,
  ZiweiChartStage6,
  ZiweiMainStarPlacement,
  ZiweiGender,
  ZiweiPalace,
} from '../astrology/ziwei';

const TOP_BRANCHES: EarthlyBranchId[] = ['si', 'wu', 'wei', 'shen'];
const LEFT_BRANCHES: EarthlyBranchId[] = ['chen', 'mao'];
const RIGHT_BRANCHES: EarthlyBranchId[] = ['you', 'xu'];
const BOTTOM_BRANCHES: EarthlyBranchId[] = ['yin', 'chou', 'zi', 'hai'];

function createDefaultForm(): ZiweiFormValues {
  return {
    displayName: '',
    day: '15',
    month: '04',
    year: '1992',
    hour: '08',
    minute: '30',
    gender: 'male',
    timeZone: 'Asia/Ho_Chi_Minh',
    placeName: 'TP. Hồ Chí Minh',
    longitude: '106.7009',
    latitude: '10.7769',
  };
}

export default function ZiweiChartScreen() {
  const {t} = useTranslation();
  const route = useRoute<any>();
  const navigation =
    useNavigation<any>();

  const {
    isExpert,
    preferences,
  } =
    useExpertMode();

  const [form, setForm] =
    useState<ZiweiFormValues>(
      createDefaultForm(),
    );

  const [chart, setChart] =
    useState<ZiweiChartStage6 | null>(
      null,
    );

  const [isCalculating, setIsCalculating] =
    useState(false);

  useEffect(() => {
    const profileId =
      route.params?.profileId as
        | string
        | undefined;

    if (!profileId) {
      return;
    }

    let active = true;

    getUserProfile(profileId)
      .then(profile => {
        if (!active || !profile) {
          return;
        }

        try {
          setForm(
            userProfileToZiweiForm(
              profile,
            ),
          );

          setChart(null);

          const warningCode =
            getUserProfileTimeWarningCode(
              profile,
            );

          if (warningCode) {
            Alert.alert(
              t(
                'userProfiles.profileTimeWarningTitle',
              ),
              t(
                warningCode === 'unknown'
                  ? 'userProfiles.profileTimeUnknownMessage'
                  : 'userProfiles.profileTimeApproximateMessage',
              ),
            );
          }
        } catch (error) {
          const code =
            error instanceof Error
              ? error.message
              : '';

          if (
            code ===
            'ZIWEI_GENDER_REQUIRED'
          ) {
            Alert.alert(
              t(
                'userProfiles.ziweiGenderTitle',
              ),
              t(
                'userProfiles.ziweiGenderMessage',
              ),
            );
            return;
          }

          throw error;
        }
      })
      .catch(error => {
        console.warn(
          'Cannot load shared profile for Zi Wei:',
          error,
        );
      });

    return () => {
      active = false;
    };
  }, [
    route.params?.profileId,
    t,
  ]);

  const palaceByBranch = useMemo(() => {
    const map = new Map<EarthlyBranchId, ZiweiPalace>();
    chart?.palaces.forEach(item => map.set(item.branchId, item));
    return map;
  }, [chart]);

  const updateForm = <K extends keyof ZiweiFormValues>(
    key: K,
    value: ZiweiFormValues[K],
  ) => {
    setForm(current => ({...current, [key]: value}));
  };

  const calculate = () => {
    if (isCalculating) return;

    setIsCalculating(true);

    try {
      const result = calculateZiweiFromForm(form);
      setChart(result);
    } catch (error) {
      console.warn('Cannot calculate Zi Wei Stage 6:', error);
      const code = error instanceof Error ? error.message : '';

      Alert.alert(
        t('ziwei.errors.title'),
        t(`ziwei.errors.codes.${code}`, {
          defaultValue: t('ziwei.errors.calculateFailed'),
        }),
      );
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={BACKGROUND} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.headerSymbol}>紫微</Text>
          <Text style={styles.title}>{t('ziwei.title')}</Text>
          <Text style={styles.subtitle}>{t('ziwei.subtitle')}</Text>
        </View>

        <ExpertModeBar
          onOpenSettings={() =>
            navigation.navigate(
              'ExpertMode',
            )
          }
        />

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>{t('ziwei.birthInformation')}</Text>

          <FieldLabel text={t('ziwei.displayName')} />
          <TextInput
            value={form.displayName}
            onChangeText={value => updateForm('displayName', value)}
            placeholder={t('ziwei.displayNamePlaceholder')}
            placeholderTextColor="#9A806B"
            style={styles.fullInput}
          />

          <FieldLabel text={t('ziwei.solarBirthDate')} />
          <View style={styles.dateRow}>
            <TextInput
              value={form.day}
              onChangeText={value => updateForm('day', value)}
              keyboardType="number-pad"
              maxLength={2}
              placeholder="DD"
              placeholderTextColor="#9A806B"
              style={styles.dateInput}
            />
            <Text style={styles.separator}>/</Text>
            <TextInput
              value={form.month}
              onChangeText={value => updateForm('month', value)}
              keyboardType="number-pad"
              maxLength={2}
              placeholder="MM"
              placeholderTextColor="#9A806B"
              style={styles.dateInput}
            />
            <Text style={styles.separator}>/</Text>
            <TextInput
              value={form.year}
              onChangeText={value => updateForm('year', value)}
              keyboardType="number-pad"
              maxLength={4}
              placeholder="YYYY"
              placeholderTextColor="#9A806B"
              style={styles.yearInput}
            />
          </View>

          <FieldLabel text={t('ziwei.birthTime')} />
          <View style={styles.timeRow}>
            <TextInput
              value={form.hour}
              onChangeText={value => updateForm('hour', value)}
              keyboardType="number-pad"
              maxLength={2}
              placeholder="HH"
              placeholderTextColor="#9A806B"
              style={styles.timeInput}
            />
            <Text style={styles.timeColon}>:</Text>
            <TextInput
              value={form.minute}
              onChangeText={value => updateForm('minute', value)}
              keyboardType="number-pad"
              maxLength={2}
              placeholder="MM"
              placeholderTextColor="#9A806B"
              style={styles.timeInput}
            />
          </View>

          <FieldLabel text={t('ziwei.gender')} />
          <View style={styles.genderRow}>
            {(['male', 'female'] as ZiweiGender[]).map(item => {
              const selected = form.gender === item;
              return (
                <Pressable
                  key={item}
                  style={({pressed}) => [
                    styles.genderButton,
                    selected && styles.genderButtonSelected,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => updateForm('gender', item)}>
                  <Text
                    style={[
                      styles.genderText,
                      selected && styles.genderTextSelected,
                    ]}>
                    {t(`ziwei.genders.${item}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionTitleSecondary}>
            {t('ziwei.birthLocation')}
          </Text>

          <FieldLabel text={t('ziwei.timeZone')} />
          <TextInput
            value={form.timeZone}
            onChangeText={value => updateForm('timeZone', value)}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Asia/Ho_Chi_Minh"
            placeholderTextColor="#9A806B"
            style={styles.fullInput}
          />

          <FieldLabel text={t('ziwei.placeName')} />
          <TextInput
            value={form.placeName}
            onChangeText={value => updateForm('placeName', value)}
            placeholder={t('ziwei.placeNamePlaceholder')}
            placeholderTextColor="#9A806B"
            style={styles.fullInput}
          />

          <View style={styles.coordinateRow}>
            <View style={styles.coordinateField}>
              <FieldLabel text={t('ziwei.longitude')} />
              <TextInput
                value={form.longitude}
                onChangeText={value => updateForm('longitude', value)}
                keyboardType="numbers-and-punctuation"
                placeholder="106.7009"
                placeholderTextColor="#9A806B"
                style={styles.fullInput}
              />
            </View>
            <View style={styles.coordinateGap} />
            <View style={styles.coordinateField}>
              <FieldLabel text={t('ziwei.latitude')} />
              <TextInput
                value={form.latitude}
                onChangeText={value => updateForm('latitude', value)}
                keyboardType="numbers-and-punctuation"
                placeholder="10.7769"
                placeholderTextColor="#9A806B"
                style={styles.fullInput}
              />
            </View>
          </View>

          <Pressable
            disabled={isCalculating}
            style={({pressed}) => [
              styles.calculateButton,
              isCalculating && styles.disabled,
              pressed && styles.pressed,
            ]}
            onPress={calculate}>
            <Text style={styles.calculateButtonText}>
              {isCalculating ? t('ziwei.calculating') : t('ziwei.calculate')}
            </Text>
          </Pressable>
        </View>

        {chart && (
          <>
            <View style={styles.summaryCard}>
              <Text style={styles.resultTitle}>
                {chart.input.displayName || t('ziwei.chartResult')}
              </Text>

              <View style={styles.summaryGrid}>
                <SummaryItem
                  label={t('ziwei.lunarDate')}
                  value={`${chart.lunar.lunarDay}/${chart.lunar.lunarMonth}/${chart.lunar.lunarYear}${
                    chart.lunar.isLeapMonth ? ` (${t('ziwei.leapMonth')})` : ''
                  }`}
                />
                <SummaryItem
                  label={t('ziwei.yearCanChi')}
                  value={`${t(`ziwei.stems.${chart.lunar.yearStemId}`)} ${t(
                    `ziwei.branches.${chart.lunar.yearBranchId}`,
                  )}`}
                />
                <SummaryItem
                  label={t('ziwei.birthHourBranch')}
                  value={t(`ziwei.branches.${chart.lunar.birthHourBranchId}`)}
                />
                <SummaryItem
                  label={t('ziwei.polarityProfile')}
                  value={t(`ziwei.classifications.${chart.polarity.classification}`)}
                />
                <SummaryItem
                  label={t('ziwei.lifePalace')}
                  value={t(`ziwei.branches.${chart.lifePalaceBranchId}`)}
                />
                <SummaryItem
                  label={t('ziwei.bodyPalace')}
                  value={t(`ziwei.branches.${chart.bodyPalaceBranchId}`)}
                />
                <SummaryItem
                  label={t('ziwei.bodyResidence')}
                  value={t(`ziwei.palaces.${chart.bodyResidencePalaceId}`)}
                />
                <SummaryItem
                  label={t('ziwei.fiveElementBureau')}
                  value={t(`ziwei.bureaus.${chart.bureau.element}`, {
                    number: chart.bureau.number,
                  })}
                />
                <SummaryItem
                  label={t('ziwei.stage2Labels.ziWeiAnchor')}
                  value={t(`ziwei.branches.${chart.mainStarAnchors.ziWeiBranchId}`)}
                />
                <SummaryItem
                  label={t('ziwei.stage2Labels.tianFuAnchor')}
                  value={t(`ziwei.branches.${chart.mainStarAnchors.tianFuBranchId}`)}
                />
                <SummaryItem
                  label={t('ziwei.stage2Labels.mainStarCount')}
                  value={String(chart.mainStars.length)}
                />
                <SummaryItem
                  label={t('ziwei.stage3Labels.auxiliaryStarCount')}
                  value={String(chart.auxiliaryStars.length)}
                />
              </View>
            </View>

            <View style={styles.chartSection}>
              <Text style={styles.sectionHeading}>{t('ziwei.twelvePalaces')}</Text>

              <View style={styles.chartFrame}>
                <View style={styles.fourCellRow}>
                  {TOP_BRANCHES.map(branch => (
                    <PalaceCell
                      key={branch}
                      branch={branch}
                      palace={palaceByBranch.get(branch)}
                      stars={
                        palaceByBranch.get(branch)
                          ? chart.mainStarsByPalace[
                              palaceByBranch.get(branch)!.id
                            ]
                          : []
                      }
                    />
                  ))}
                </View>

                <View style={styles.middleRow}>
                  <View style={styles.sideColumn}>
                    {LEFT_BRANCHES.map(branch => (
                      <PalaceCell
                        key={branch}
                        branch={branch}
                        palace={palaceByBranch.get(branch)}
                        stars={
                          palaceByBranch.get(branch)
                            ? chart.mainStarsByPalace[
                                palaceByBranch.get(branch)!.id
                              ]
                            : []
                        }
                        tall
                      />
                    ))}
                  </View>

                  <View style={styles.centerCard}>
                    <Text style={styles.centerSymbol}>☯</Text>
                    <Text style={styles.centerTitle}>{t('ziwei.stage6.title')}</Text>
                    <Text style={styles.centerText}>
                      {t(`ziwei.classifications.${chart.polarity.classification}`)}
                    </Text>
                    <Text style={styles.centerText}>
                      {t(`ziwei.directions.${chart.polarity.majorCycleDirection}`)}
                    </Text>
                    <Text style={styles.centerText}>
                      {t('ziwei.stage2Labels.mainStarCount')}: {chart.mainStars.length}
                    </Text>
                    <Text style={styles.centerText}>
                      {t('ziwei.stage3Labels.auxiliaryStarCount')}: {chart.auxiliaryStars.length}
                    </Text>
                    <View style={styles.bureauBadge}>
                      <Text style={styles.bureauBadgeText}>
                        {t(`ziwei.bureaus.${chart.bureau.element}`, {
                          number: chart.bureau.number,
                        })}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sideColumn}>
                    {RIGHT_BRANCHES.map(branch => (
                      <PalaceCell
                        key={branch}
                        branch={branch}
                        palace={palaceByBranch.get(branch)}
                        stars={
                          palaceByBranch.get(branch)
                            ? chart.mainStarsByPalace[
                                palaceByBranch.get(branch)!.id
                              ]
                            : []
                        }
                        tall
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.fourCellRow}>
                  {BOTTOM_BRANCHES.map(branch => (
                    <PalaceCell
                      key={branch}
                      branch={branch}
                      palace={palaceByBranch.get(branch)}
                      stars={
                        palaceByBranch.get(branch)
                          ? chart.mainStarsByPalace[
                              palaceByBranch.get(branch)!.id
                            ]
                          : []
                      }
                    />
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.listSection}>
              <Text style={styles.sectionHeading}>{t('ziwei.palaceList')}</Text>
              {chart.palaces.map(item => (
                <View key={item.id} style={styles.palaceListItem}>
                  <View style={styles.palaceListBranch}>
                    <Text style={styles.palaceListBranchText}>
                      {t(`ziwei.branches.${item.branchId}`)}
                    </Text>
                  </View>
                  <View style={styles.palaceListContent}>
                    <Text style={styles.palaceListTitle}>
                      {t(`ziwei.palaces.${item.id}`)}
                    </Text>
                    <View style={styles.tagRow}>
                      {item.isLifePalace && <Tag text={t('ziwei.lifeTag')} />}
                      {item.isBodyPalace && <Tag text={t('ziwei.bodyTag')} />}
                    </View>
                    <View style={styles.listStarWrap}>
                      {chart.mainStarsByPalace[item.id].length === 0 ? (
                        <Text style={styles.noStarText}>
                          {t('ziwei.stage2Labels.noMainStar')}
                        </Text>
                      ) : (
                        chart.mainStarsByPalace[item.id].map(star => (
                          <View key={star.id} style={styles.listStarChip}>
                            <Text style={styles.listStarText}>
                              {t(`ziwei.mainStars.${star.id}`)} · {t(`ziwei.brightness.${star.brightness}`)}
                            </Text>
                          </View>
                        ))
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.legendSection}>
              <Text style={styles.sectionHeading}>
                {t('ziwei.stage2Labels.mainStarLegend')}
              </Text>

              <View style={styles.legendCard}>
                <Text style={styles.legendGroupTitle}>
                  {t('ziwei.starGroups.ziWeiGroup')}
                </Text>
                <View style={styles.legendChipWrap}>
                  {chart.mainStars
                    .filter(item => item.group === 'ziWeiGroup')
                    .map(item => (
                      <View key={item.id} style={styles.legendChip}>
                        <Text style={styles.legendChipText}>
                          {t(`ziwei.mainStars.${item.id}`)} ·{' '}
                          {t(`ziwei.branches.${item.branchId}`)}
                        </Text>
                      </View>
                    ))}
                </View>

                <Text style={[styles.legendGroupTitle, styles.legendGroupSpacing]}>
                  {t('ziwei.starGroups.tianFuGroup')}
                </Text>
                <View style={styles.legendChipWrap}>
                  {chart.mainStars
                    .filter(item => item.group === 'tianFuGroup')
                    .map(item => (
                      <View key={item.id} style={styles.legendChipAlt}>
                        <Text style={styles.legendChipText}>
                          {t(`ziwei.mainStars.${item.id}`)} ·{' '}
                          {t(`ziwei.branches.${item.branchId}`)}
                        </Text>
                      </View>
                    ))}
                </View>
              </View>
            </View>

            {isExpert &&
              preferences.showCalculationDetails && (
                <ExpertDetailsCard
                  eyebrow={t(
                    'expertMode.details.eyebrow',
                  )}
                  title={t(
                    'expertMode.details.title',
                  )}
                  subtitle={t(
                    'expertMode.details.notes.ziwei',
                  )}
                  showRawCodes={
                    preferences.showRawCodes
                  }
                  rows={[
                    {
                      label: t(
                        'expertMode.details.fields.timeZone',
                      ),
                      value:
                        chart.input.location
                          .timeZone,
                      code:
                        'input.location.timeZone',
                    },
                    {
                      label: t(
                        'expertMode.details.fields.lifePalace',
                      ),
                      value: t(
                        `ziwei.branches.${chart.lifePalaceBranchId}`,
                      ),
                      code:
                        chart.lifePalaceBranchId,
                    },
                    {
                      label: t(
                        'expertMode.details.fields.bodyPalace',
                      ),
                      value: t(
                        `ziwei.branches.${chart.bodyPalaceBranchId}`,
                      ),
                      code:
                        chart.bodyPalaceBranchId,
                    },
                    {
                      label: t(
                        'expertMode.details.fields.bureau',
                      ),
                      value: t(
                        `ziwei.bureaus.${chart.bureau.element}`,
                        {
                          number:
                            chart.bureau.number,
                        },
                      ),
                      code:
                        `${chart.bureau.element}:${chart.bureau.number}`,
                    },
                    {
                      label: t(
                        'expertMode.details.fields.mainStarCount',
                      ),
                      value:
                        String(
                          chart.mainStars.length,
                        ),
                      code:
                        'mainStars.length',
                    },
                    {
                      label: t(
                        'expertMode.details.fields.auxiliaryStarCount',
                      ),
                      value:
                        String(
                          chart.auxiliaryStars.length,
                        ),
                      code:
                        'auxiliaryStars.length',
                    },
                    {
                      label: t(
                        'expertMode.details.fields.diagnosticsCount',
                      ),
                      value:
                        String(
                          chart.diagnostics.length,
                        ),
                      code:
                        'diagnostics.length',
                    },
                  ]}
                  notes={[
                    t(
                      'expertMode.details.notes.ziwei',
                    ),
                  ]}
                />
              )}

            <Pressable
              style={({pressed}) => [
                styles.explainResultButton,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                navigation.navigate(
                  'ExplainableResult',
                  {
                    kind: 'ziwei',
                    payload: {
                      factors: [
                        {
                          code:
                            'lifePalace',
                          label: t(
                            'expertMode.details.fields.lifePalace',
                          ),
                          description: t(
                            'explainable.ziwei.factorDescriptions.lifePalace',
                          ),
                          rawValue:
                            chart.lifePalaceBranchId,
                        },
                        {
                          code:
                            'bodyPalace',
                          label: t(
                            'expertMode.details.fields.bodyPalace',
                          ),
                          description: t(
                            'explainable.ziwei.factorDescriptions.bodyPalace',
                          ),
                          rawValue:
                            chart.bodyPalaceBranchId,
                        },
                        {
                          code:
                            'bureau',
                          label: t(
                            'expertMode.details.fields.bureau',
                          ),
                          description: t(
                            'explainable.ziwei.factorDescriptions.bureau',
                          ),
                          rawValue:
                            `${chart.bureau.element}:${chart.bureau.number}`,
                        },
                        {
                          code:
                            'mainStars',
                          label: t(
                            'expertMode.details.fields.mainStarCount',
                          ),
                          description: t(
                            'explainable.ziwei.factorDescriptions.mainStars',
                          ),
                          rawValue:
                            String(
                              chart.mainStars.length,
                            ),
                        },
                        {
                          code:
                            'auxiliaryStars',
                          label: t(
                            'expertMode.details.fields.auxiliaryStarCount',
                          ),
                          description: t(
                            'explainable.ziwei.factorDescriptions.auxiliaryStars',
                          ),
                          rawValue:
                            String(
                              chart.auxiliaryStars.length,
                            ),
                        },
                      ],
                      rawData: {
                        timeZone:
                          chart.input.location.timeZone,
                        lifePalace:
                          chart.lifePalaceBranchId,
                        bodyPalace:
                          chart.bodyPalaceBranchId,
                        bureau:
                          `${chart.bureau.element}:${chart.bureau.number}`,
                        mainStarCount:
                          chart.mainStars.length,
                        auxiliaryStarCount:
                          chart.auxiliaryStars.length,
                        diagnosticsCount:
                          chart.diagnostics.length,
                      },
                      modelVersion:
                        'ziwei-engine-current',
                    },
                  },
                )
              }>
              <Text
                style={
                  styles.explainResultButtonText
                }>
                ?{' '}
                {t(
                  'explainable.whyThisResult',
                )}
              </Text>
            </Pressable>

            {isExpert && (
              <>
                <ZiweiStage3Details
                  chart={chart}
                />

                <ZiweiStage4Details
                  chart={chart}
                />

                <ZiweiStage5Details
                  chart={chart}
                />

                <ZiweiStage6Details
                  chart={chart}
                />
              </>
            )}

            {isExpert &&
              preferences.showDiagnostics &&
              chart.diagnostics.length >
                0 && (
                <View style={styles.noticeCard}>
                  <Text style={styles.noticeTitle}>
                    {t(
                      'ziwei.diagnosticsTitle',
                    )}
                  </Text>

                  {chart.diagnostics.map(
                    code => (
                      <Text
                        key={code}
                        style={
                          styles.noticeText
                        }>
                        •{' '}
                        {t(
                          `ziwei.diagnostics.${code}`,
                        )}
                      </Text>
                    ),
                  )}
                </View>
              )}

            <View style={styles.disclaimerCard}>
              <Text style={styles.disclaimerText}>{t('ziwei.notice')}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function FieldLabel({text}: {text: string}) {
  return <Text style={styles.inputLabel}>{text}</Text>;
}

function SummaryItem({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function PalaceCell({
  branch,
  palace,
  stars,
  tall = false,
}: {
  branch: EarthlyBranchId;
  palace?: ZiweiPalace;
  stars: ZiweiMainStarPlacement[];
  tall?: boolean;
}) {
  const {t} = useTranslation();

  return (
    <View style={[styles.palaceCell, tall && styles.palaceCellTall]}>
      <Text style={styles.palaceBranch}>{t(`ziwei.branches.${branch}`)}</Text>
      <Text style={styles.palaceName} numberOfLines={2}>
        {palace ? t(`ziwei.palaces.${palace.id}`) : '—'}
      </Text>

      <View style={styles.cellStars}>
        {stars.length === 0 ? (
          <Text style={styles.cellNoStar}>—</Text>
        ) : (
          stars.map(star => (
            <Text
              key={star.id}
              style={[
                styles.cellStar,
                star.group === 'tianFuGroup' && styles.cellStarAlt,
              ]}
              numberOfLines={1}>
              {t(`ziwei.mainStars.${star.id}`)} · {t(`ziwei.brightness.${star.brightness}`)}
            </Text>
          ))
        )}
      </View>

      <View style={styles.cellTags}>
        {palace?.isLifePalace && (
          <Text style={styles.smallTag}>{t('ziwei.lifeTag')}</Text>
        )}
        {palace?.isBodyPalace && (
          <Text style={styles.smallTag}>{t('ziwei.bodyTag')}</Text>
        )}
      </View>
    </View>
  );
}

function Tag({text}: {text: string}) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

const BACKGROUND = '#FFF8EF';
const SURFACE = '#FFFDF8';
const BROWN = '#4B2A1A';
const GOLD = '#D1A052';
const BORDER = '#E4CAA2';

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: BACKGROUND},
  content: {padding: 16, paddingBottom: 120},
  headerCard: {
    alignItems: 'center',
    backgroundColor: BROWN,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 24,
    padding: 20,
  },
  headerSymbol: {color: '#F5CD78', fontSize: 38, fontWeight: '900'},
  title: {color: '#FFE6B0', fontSize: 28, fontWeight: '900', marginTop: 5},
  subtitle: {color: '#EBD5B6', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8},
  formCard: {backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 22, padding: 17, marginTop: 14},
  sectionTitle: {color: BROWN, fontSize: 18, fontWeight: '900'},
  sectionTitleSecondary: {color: BROWN, fontSize: 16, fontWeight: '900', marginTop: 20},
  inputLabel: {color: '#7F6651', fontSize: 12, fontWeight: '700', marginTop: 12, marginBottom: 6},
  fullInput: {minHeight: 48, color: BROWN, backgroundColor: '#FFF5E5', borderWidth: 1, borderColor: '#DFC08D', borderRadius: 13, paddingHorizontal: 12},
  dateRow: {flexDirection: 'row', alignItems: 'center'},
  dateInput: {flex: 1, minHeight: 48, color: BROWN, fontSize: 17, fontWeight: '800', textAlign: 'center', backgroundColor: '#FFF5E5', borderWidth: 1, borderColor: '#DFC08D', borderRadius: 13},
  yearInput: {flex: 1.4, minHeight: 48, color: BROWN, fontSize: 17, fontWeight: '800', textAlign: 'center', backgroundColor: '#FFF5E5', borderWidth: 1, borderColor: '#DFC08D', borderRadius: 13},
  separator: {color: '#90745E', fontSize: 21, paddingHorizontal: 8},
  timeRow: {flexDirection: 'row', alignItems: 'center'},
  timeInput: {width: 84, minHeight: 48, color: BROWN, fontSize: 17, fontWeight: '800', textAlign: 'center', backgroundColor: '#FFF5E5', borderWidth: 1, borderColor: '#DFC08D', borderRadius: 13},
  timeColon: {color: BROWN, fontSize: 24, fontWeight: '900', paddingHorizontal: 10},
  genderRow: {flexDirection: 'row', justifyContent: 'space-between'},
  genderButton: {width: '48.5%', minHeight: 46, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F2E6D6', borderRadius: 13},
  genderButtonSelected: {backgroundColor: BROWN, borderWidth: 1, borderColor: GOLD},
  genderText: {color: '#6B5545', fontSize: 13, fontWeight: '800'},
  genderTextSelected: {color: '#FFE3A5'},
  coordinateRow: {flexDirection: 'row'},
  coordinateField: {flex: 1},
  coordinateGap: {width: 10},
  calculateButton: {minHeight: 51, alignItems: 'center', justifyContent: 'center', backgroundColor: GOLD, borderRadius: 15, marginTop: 20},
  calculateButtonText: {color: '#3A2216', fontSize: 15, fontWeight: '900'},
  disabled: {opacity: 0.55},
  pressed: {opacity: 0.68, transform: [{scale: 0.985}]},
  summaryCard: {backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 22, padding: 17, marginTop: 15},
  resultTitle: {color: BROWN, fontSize: 21, fontWeight: '900'},
  summaryGrid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 13},
  summaryItem: {width: '48.5%', minHeight: 76, backgroundColor: '#F8ECDB', borderRadius: 14, padding: 11, marginBottom: 9},
  summaryLabel: {color: '#8B715B', fontSize: 11},
  summaryValue: {color: BROWN, fontSize: 14, fontWeight: '900', marginTop: 5},
  chartSection: {marginTop: 20},
  sectionHeading: {color: BROWN, fontSize: 21, fontWeight: '900', marginBottom: 11},
  chartFrame: {backgroundColor: '#F3DFC0', borderWidth: 2, borderColor: '#B88443', borderRadius: 18, overflow: 'hidden'},
  fourCellRow: {flexDirection: 'row'},
  middleRow: {flexDirection: 'row'},
  sideColumn: {width: '25%'},
  palaceCell: {width: '25%', minHeight: 132, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF8E9', borderWidth: 0.5, borderColor: '#CBA56F', padding: 5},
  palaceCellTall: {width: '100%', minHeight: 164},
  palaceBranch: {color: '#9A622B', fontSize: 12, fontWeight: '900'},
  palaceName: {color: BROWN, fontSize: 12, fontWeight: '900', textAlign: 'center', marginTop: 5},
  cellTags: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 5},
  smallTag: {color: '#FFF1C5', fontSize: 8, fontWeight: '900', backgroundColor: '#7A3E1D', borderRadius: 7, paddingHorizontal: 5, paddingVertical: 2, margin: 1},
  centerCard: {width: '50%', minHeight: 328, alignItems: 'center', justifyContent: 'center', backgroundColor: BROWN, borderWidth: 0.5, borderColor: '#CBA56F', padding: 12},
  centerSymbol: {color: '#F0C66B', fontSize: 42},
  centerTitle: {color: '#FFE5A8', fontSize: 15, fontWeight: '900', marginTop: 7},
  centerText: {color: '#EAD4B4', fontSize: 11, textAlign: 'center', marginTop: 5},
  bureauBadge: {backgroundColor: '#D7A653', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, marginTop: 12},
  bureauBadgeText: {color: '#3E2417', fontSize: 11, fontWeight: '900'},
  listSection: {marginTop: 20},
  palaceListItem: {flexDirection: 'row', alignItems: 'center', backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 16, padding: 12, marginBottom: 9},
  palaceListBranch: {width: 54, height: 54, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1DDC0', borderRadius: 15, marginRight: 12},
  palaceListBranchText: {color: BROWN, fontSize: 14, fontWeight: '900'},
  palaceListContent: {flex: 1},
  palaceListTitle: {color: BROWN, fontSize: 15, fontWeight: '900'},
  tagRow: {flexDirection: 'row', marginTop: 6},
  tag: {backgroundColor: BROWN, borderRadius: 9, paddingHorizontal: 8, paddingVertical: 4, marginRight: 5},
  tagText: {color: '#FFE4A7', fontSize: 9, fontWeight: '900'},
  cellStars: {width: '100%', alignItems: 'center', marginTop: 5},
  cellStar: {color: '#8B321F', fontSize: 9, fontWeight: '900', textAlign: 'center', lineHeight: 13},
  cellStarAlt: {color: '#7A5B16'},
  cellNoStar: {color: '#A58F7A', fontSize: 10},
  listStarWrap: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 7},
  listStarChip: {backgroundColor: '#F4E1C3', borderRadius: 9, paddingHorizontal: 7, paddingVertical: 4, marginRight: 5, marginBottom: 4},
  listStarText: {color: '#71351F', fontSize: 10, fontWeight: '900'},
  noStarText: {color: '#98816D', fontSize: 10, fontStyle: 'italic'},
  legendSection: {marginTop: 20},
  legendCard: {backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 18, padding: 14},
  legendGroupTitle: {color: BROWN, fontSize: 14, fontWeight: '900'},
  legendGroupSpacing: {marginTop: 14},
  legendChipWrap: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 8},
  legendChip: {backgroundColor: '#F7DED2', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5, marginRight: 6, marginBottom: 6},
  legendChipAlt: {backgroundColor: '#F4E7BD', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5, marginRight: 6, marginBottom: 6},
  legendChipText: {color: '#5B3A27', fontSize: 10, fontWeight: '800'},
  explainResultButton: {alignItems: 'center', justifyContent: 'center', minHeight: 46, backgroundColor: '#E8EDF3', borderRadius: 14, marginTop: 14},
  explainResultButtonText: {color: '#17243A', fontSize: 10, fontWeight: '900'},
  noticeCard: {backgroundColor: '#FFF1D6', borderWidth: 1, borderColor: '#D9B678', borderRadius: 16, padding: 14, marginTop: 15},
  noticeTitle: {color: BROWN, fontSize: 14, fontWeight: '900'},
  noticeText: {color: '#755D49', fontSize: 11, lineHeight: 17, marginTop: 5},
  disclaimerCard: {backgroundColor: '#F6E8D3', borderRadius: 16, padding: 14, marginTop: 12},
  disclaimerText: {color: '#725B47', fontSize: 11, lineHeight: 17},
});
