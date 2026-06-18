import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import {useTranslation} from 'react-i18next';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {TFunction} from 'i18next';

import BaziStage2Details from '../components/BaziStage2Details';
import BaziDiagnosticsCard from '../components/BaziDiagnosticsCard';

import {
  baziFormFromBirthInput,
  calculateBaziFromForm,
  translateBaziCode,
  type BaziFormValues,
} from '../services/baziEngine';

import {
  getSavedBaziChart,
  saveBaziChart,
} from '../services/baziHistory';
import {shareBaziChart} from '../services/baziShare';

import {
  getUserProfile,
} from '../services/userProfiles';

import {
  getUserProfileTimeWarningCode,
  userProfileToBaziForm,
} from '../services/userProfileAdapters';

import ExpertModeBar
  from '../components/ExpertModeBar';

import ExpertDetailsCard
  from '../components/ExpertDetailsCard';

import {
  useExpertMode,
} from '../services/expertMode';

import type {
  BaziChart,
  Element,
  Gender,
  InterpretationSection,
  Pillar,
  PillarKind,
  StrengthLevel,
  TenGod,
} from '../astrology/bazi';

const ELEMENTS: Element[] = [
  'wood',
  'fire',
  'earth',
  'metal',
  'water',
];

const PILLAR_ORDER: PillarKind[] = [
  'year',
  'month',
  'day',
  'hour',
];

const INTERPRETATION_SECTIONS: Array<{
  id:
    | 'character'
    | 'love'
    | 'career'
    | 'wealth'
    | 'wellbeing';
  icon: string;
  titleKey: string;
}> = [
  {
    id: 'character',
    icon: '🧭',
    titleKey: 'bazi.interpretationSections.character',
  },
  {
    id: 'love',
    icon: '💞',
    titleKey: 'bazi.interpretationSections.love',
  },
  {
    id: 'career',
    icon: '💼',
    titleKey: 'bazi.interpretationSections.career',
  },
  {
    id: 'wealth',
    icon: '💰',
    titleKey: 'bazi.interpretationSections.wealth',
  },
  {
    id: 'wellbeing',
    icon: '🌿',
    titleKey: 'bazi.interpretationSections.wellbeing',
  },
];

function defaultForm(): BaziFormValues {
  return {
    displayName: '',

    day: '15',
    month: '04',
    year: '1992',

    hour: '08',
    minute: '30',

    gender: 'unspecified',

    timeZone: 'Asia/Ho_Chi_Minh',

    longitude: '106.7009',
    latitude: '10.7769',
    placeName: 'TP. Hồ Chí Minh',

    useTrueSolarTime: false,
  };
}

function formatTwoDigits(
  value: number,
): string {
  return String(value).padStart(
    2,
    '0',
  );
}

function formatLocalDateTime(
  value: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
  },
): string {
  return [
    formatTwoDigits(value.day),
    formatTwoDigits(value.month),
    value.year,
  ].join('/') +
    ` ${formatTwoDigits(
      value.hour,
    )}:${formatTwoDigits(
      value.minute,
    )}`;
}

export default function BaziChartScreen() {
  const {t, i18n} =
    useTranslation();

  const route = useRoute<any>();
  const navigation =
    useNavigation<any>();

  const {
    isExpert,
    preferences,
  } =
    useExpertMode();

  const [form, setForm] =
    useState<BaziFormValues>(
      defaultForm(),
    );

  const [chart, setChart] =
    useState<BaziChart | null>(
      null,
    );

  const [isCalculating, setIsCalculating] =
    useState(false);

  const [openSection, setOpenSection] =
    useState<string>('character');

  const [loadedRecordId, setLoadedRecordId] =
    useState<string | null>(null);

  const [isSavingChart, setIsSavingChart] =
    useState(false);

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const isVietnamese =
    language
      .toLowerCase()
      .startsWith('vi');

  useEffect(() => {
    const profileId =
      route.params?.profileId as
        | string
        | undefined;

    const savedRecordId =
      route.params?.savedRecordId as
        | string
        | undefined;

    if (
      !profileId ||
      savedRecordId
    ) {
      return;
    }

    let active = true;

    getUserProfile(profileId)
      .then(profile => {
        if (!active || !profile) {
          return;
        }

        setForm(
          userProfileToBaziForm(
            profile,
          ),
        );

        setChart(null);
        setLoadedRecordId(null);
        setOpenSection('character');

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
      })
      .catch(error => {
        console.warn(
          'Cannot load shared profile for BaZi:',
          error,
        );
      });

    return () => {
      active = false;
    };
  }, [
    route.params?.profileId,
    route.params?.savedRecordId,
    t,
  ]);

  useEffect(() => {
    const savedRecordId =
      route.params?.savedRecordId as string | undefined;

    if (!savedRecordId) {
      return;
    }

    let active = true;

    getSavedBaziChart(savedRecordId)
      .then(record => {
        if (!active || !record) {
          return;
        }

        setForm(
          baziFormFromBirthInput(record.input),
        );
        setChart(record.chart);
        setLoadedRecordId(record.id);
        setOpenSection('character');
      })
      .catch(error => {
        console.warn(
          'Cannot load saved BaZi chart:',
          error,
        );
      });

    return () => {
      active = false;
    };
  }, [route.params?.savedRecordId]);

  const updateForm = <
    Key extends keyof BaziFormValues,
  >(
    key: Key,
    value: BaziFormValues[Key],
  ) => {
    setForm(current => ({
      ...current,
      [key]: value,
    }));
  };

  const errorMessage = (
    error: unknown,
  ): string => {
    const code =
      error instanceof Error
        ? error.message
        : '';

    switch (code) {
      case 'INVALID_BIRTH_DATE':
      case 'INVALID_DAY':
      case 'INVALID_MONTH':
      case 'INVALID_YEAR':
        return t(
          'bazi.errors.invalidDate',
          {
            defaultValue:
              'Ngày sinh không hợp lệ.',
          },
        );

      case 'INVALID_BIRTH_TIME':
      case 'INVALID_HOUR':
      case 'INVALID_MINUTE':
        return t(
          'bazi.errors.invalidTime',
          {
            defaultValue:
              'Giờ sinh phải từ 00:00 đến 23:59.',
          },
        );

      case 'INVALID_TIME_ZONE':
      case 'TIME_ZONE_REQUIRED':
        return t(
          'bazi.errors.invalidTimeZone',
          {
            defaultValue:
              'Múi giờ không hợp lệ. Ví dụ: Asia/Ho_Chi_Minh.',
          },
        );

      case 'TRUE_SOLAR_LONGITUDE_REQUIRED':
        return t(
          'bazi.errors.longitudeRequired',
          {
            defaultValue:
              'Cần nhập kinh độ khi bật giờ mặt trời thật.',
          },
        );

      case 'INVALID_LONGITUDE':
      case 'INVALID_LATITUDE':
      case 'INVALID_COORDINATE':
        return t(
          'bazi.errors.invalidCoordinate',
          {
            defaultValue:
              'Kinh độ hoặc vĩ độ không hợp lệ.',
          },
        );

      default:
        return t(
          'bazi.errors.calculateFailed',
          {
            defaultValue:
              'Không thể lập lá số. Hãy kiểm tra lại thông tin.',
          },
        );
    }
  };

  const calculate = () => {
    if (isCalculating) {
      return;
    }

    setIsCalculating(true);

    try {
      const result =
        calculateBaziFromForm(form);

      setChart(result);
      setLoadedRecordId(null);
      setOpenSection('character');
    } catch (error) {
      console.warn(
        'Cannot calculate BaZi:',
        error,
      );

      Alert.alert(
        t(
          'bazi.errors.title',
          {
            defaultValue:
              'Thông tin chưa hợp lệ',
          },
        ),
        errorMessage(error),
      );
    } finally {
      setIsCalculating(false);
    }
  };

  const saveCurrentChart = async () => {
    if (!chart || isSavingChart) {
      return;
    }

    setIsSavingChart(true);

    try {
      const record = await saveBaziChart(chart, {
        id: loadedRecordId ?? undefined,
        replaceSameInput: loadedRecordId === null,
      });

      setLoadedRecordId(record.id);

      Alert.alert(
        t('bazi.stage3.savedTitle', {
          defaultValue: 'Đã lưu lá số',
        }),
        t('bazi.stage3.savedMessage', {
          defaultValue:
            'Lá số đã được lưu trên thiết bị.',
        }),
      );
    } catch (error) {
      console.warn('Cannot save BaZi chart:', error);

      Alert.alert(
        t('bazi.stage3.saveErrorTitle', {
          defaultValue: 'Không thể lưu',
        }),
        t('bazi.stage3.saveErrorMessage', {
          defaultValue:
            'Đã xảy ra lỗi khi lưu lá số.',
        }),
      );
    } finally {
      setIsSavingChart(false);
    }
  };

  const shareCurrentChart = async () => {
    if (!chart) {
      return;
    }

    try {
      await shareBaziChart(chart, language);
    } catch (error) {
      console.warn('Cannot share BaZi chart:', error);
    }
  };

  const usefulElementSummary =
    useMemo(() => {
      if (!chart) {
        return '';
      }

      return chart.usefulElements.favorable
        .map(element =>
          elementLabel(
            element,
            t,
          ),
        )
        .join(', ');
    }, [chart, t]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={BACKGROUND}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.headerIcon}>
            ☯
          </Text>

          <Text style={styles.title}>
            {t(
              'bazi.title',
              {
                defaultValue:
                  'Lá số Bát tự',
              },
            )}
          </Text>

          <Text style={styles.subtitle}>
            {t(
              'bazi.subtitle',
              {
                defaultValue:
                  'Nhập ngày giờ và nơi sinh để lập Tứ trụ, xem ngũ hành, Thập thần, đại vận và luận giải tham khảo.',
              },
            )}
          </Text>
        </View>

        <ExpertModeBar
          onOpenSettings={() =>
            navigation.navigate(
              'ExpertMode',
            )
          }
        />

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'bazi.birthInformation',
              {
                defaultValue:
                  'Thông tin sinh',
              },
            )}
          </Text>

          <Text style={styles.inputLabel}>
            {t(
              'bazi.displayName',
              {
                defaultValue:
                  'Tên hiển thị',
              },
            )}
          </Text>

          <TextInput
            value={form.displayName}
            onChangeText={value =>
              updateForm(
                'displayName',
                value,
              )
            }
            placeholder={t(
              'bazi.displayNamePlaceholder',
              {
                defaultValue:
                  'Có thể để trống',
              },
            )}
            placeholderTextColor="#9C8876"
            style={styles.fullInput}
          />

          <Text style={styles.inputLabel}>
            {t(
              'bazi.solarBirthDate',
              {
                defaultValue:
                  'Ngày sinh dương lịch',
              },
            )}
          </Text>

          <View style={styles.dateRow}>
            <TextInput
              value={form.day}
              onChangeText={value =>
                updateForm(
                  'day',
                  value,
                )
              }
              keyboardType="number-pad"
              maxLength={2}
              placeholder="DD"
              placeholderTextColor="#9C8876"
              style={styles.smallInput}
            />

            <Text style={styles.separator}>
              /
            </Text>

            <TextInput
              value={form.month}
              onChangeText={value =>
                updateForm(
                  'month',
                  value,
                )
              }
              keyboardType="number-pad"
              maxLength={2}
              placeholder="MM"
              placeholderTextColor="#9C8876"
              style={styles.smallInput}
            />

            <Text style={styles.separator}>
              /
            </Text>

            <TextInput
              value={form.year}
              onChangeText={value =>
                updateForm(
                  'year',
                  value,
                )
              }
              keyboardType="number-pad"
              maxLength={4}
              placeholder="YYYY"
              placeholderTextColor="#9C8876"
              style={styles.yearInput}
            />
          </View>

          <Text style={styles.inputLabel}>
            {t(
              'bazi.birthTime',
              {
                defaultValue:
                  'Giờ sinh địa phương',
              },
            )}
          </Text>

          <View style={styles.timeRow}>
            <TextInput
              value={form.hour}
              onChangeText={value =>
                updateForm(
                  'hour',
                  value,
                )
              }
              keyboardType="number-pad"
              maxLength={2}
              placeholder="HH"
              placeholderTextColor="#9C8876"
              style={styles.timeInput}
            />

            <Text style={styles.timeColon}>
              :
            </Text>

            <TextInput
              value={form.minute}
              onChangeText={value =>
                updateForm(
                  'minute',
                  value,
                )
              }
              keyboardType="number-pad"
              maxLength={2}
              placeholder="MM"
              placeholderTextColor="#9C8876"
              style={styles.timeInput}
            />
          </View>

          <Text style={styles.inputLabel}>
            {t(
              'bazi.gender',
              {
                defaultValue:
                  'Giới tính',
              },
            )}
          </Text>

          <View style={styles.genderRow}>
            {(
              [
                'male',
                'female',
                'unspecified',
              ] as Gender[]
            ).map(item => {
              const selected =
                form.gender === item;

              return (
                <Pressable
                  key={item}
                  style={({pressed}) => [
                    styles.genderButton,
                    selected &&
                      styles.genderButtonSelected,
                    pressed &&
                      styles.pressed,
                  ]}
                  onPress={() =>
                    updateForm(
                      'gender',
                      item,
                    )
                  }>
                  <Text
                    style={[
                      styles.genderText,
                      selected &&
                        styles.genderTextSelected,
                    ]}>
                    {genderLabel(
                      item,
                      t,
                    )}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionTitleSecondary}>
            {t(
              'bazi.birthLocation',
              {
                defaultValue:
                  'Nơi sinh và múi giờ',
              },
            )}
          </Text>

          <Text style={styles.inputLabel}>
            {t(
              'bazi.timeZone',
              {
                defaultValue:
                  'Múi giờ IANA',
              },
            )}
          </Text>

          <TextInput
            value={form.timeZone}
            onChangeText={value =>
              updateForm(
                'timeZone',
                value,
              )
            }
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Asia/Ho_Chi_Minh"
            placeholderTextColor="#9C8876"
            style={styles.fullInput}
          />

          <Text style={styles.inputLabel}>
            {t(
              'bazi.placeName',
              {
                defaultValue:
                  'Tên nơi sinh',
              },
            )}
          </Text>

          <TextInput
            value={form.placeName}
            onChangeText={value =>
              updateForm(
                'placeName',
                value,
              )
            }
            placeholder={t(
              'bazi.placeNamePlaceholder',
              {
                defaultValue:
                  'Ví dụ: TP. Hồ Chí Minh',
              },
            )}
            placeholderTextColor="#9C8876"
            style={styles.fullInput}
          />

          <View style={styles.coordinateRow}>
            <View style={styles.coordinateField}>
              <Text style={styles.inputLabel}>
                {t(
                  'bazi.longitude',
                  {
                    defaultValue:
                      'Kinh độ',
                  },
                )}
              </Text>

              <TextInput
                value={form.longitude}
                onChangeText={value =>
                  updateForm(
                    'longitude',
                    value,
                  )
                }
                keyboardType="numbers-and-punctuation"
                placeholder="106.7009"
                placeholderTextColor="#9C8876"
                style={styles.fullInput}
              />
            </View>

            <View style={styles.coordinateGap} />

            <View style={styles.coordinateField}>
              <Text style={styles.inputLabel}>
                {t(
                  'bazi.latitude',
                  {
                    defaultValue:
                      'Vĩ độ',
                  },
                )}
              </Text>

              <TextInput
                value={form.latitude}
                onChangeText={value =>
                  updateForm(
                    'latitude',
                    value,
                  )
                }
                keyboardType="numbers-and-punctuation"
                placeholder="10.7769"
                placeholderTextColor="#9C8876"
                style={styles.fullInput}
              />
            </View>
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextWrap}>
              <Text style={styles.switchTitle}>
                {t(
                  'bazi.trueSolarTime',
                  {
                    defaultValue:
                      'Hiệu chỉnh giờ mặt trời thật',
                  },
                )}
              </Text>

              <Text style={styles.switchDescription}>
                {t(
                  'bazi.trueSolarTimeDescription',
                  {
                    defaultValue:
                      'Cần kinh độ chính xác. Nên tắt khi chưa chắc nơi sinh.',
                  },
                )}
              </Text>
            </View>

            <Switch
              value={
                form.useTrueSolarTime
              }
              onValueChange={value =>
                updateForm(
                  'useTrueSolarTime',
                  value,
                )
              }
              trackColor={{
                false: '#D8C9BA',
                true: '#B97B43',
              }}
              thumbColor={
                form.useTrueSolarTime
                  ? GOLD
                  : '#F8F3ED'
              }
            />
          </View>

          <Pressable
            disabled={isCalculating}
            style={({pressed}) => [
              styles.calculateButton,
              isCalculating &&
                styles.calculateButtonDisabled,
              pressed &&
                styles.pressed,
            ]}
            onPress={calculate}>
            <Text style={styles.calculateButtonText}>
              {isCalculating
                ? t(
                    'bazi.calculating',
                    {
                      defaultValue:
                        'Đang lập lá số...',
                    },
                  )
                : t(
                    'bazi.calculate',
                    {
                      defaultValue:
                        'Lập lá số Bát tự',
                    },
                  )}
            </Text>
          </Pressable>
        </View>

        {chart && (
          <>
            <View style={styles.summaryCard}>
              <Text style={styles.resultTitle}>
                {chart.input.displayName ||
                  t(
                    'bazi.chartResult',
                    {
                      defaultValue:
                        'Kết quả lá số',
                    },
                  )}
              </Text>

              <Text style={styles.resultMeta}>
                {formatLocalDateTime(
                  chart.normalizedTime
                    .civilLocalDateTime,
                )}
                {'  •  '}
                {chart.input.location
                  .placeName ||
                  chart.input.location
                    .timeZone}
              </Text>

              <View style={styles.summaryGrid}>
                <SummaryItem
                  label={t(
                    'bazi.lunarDate',
                    {
                      defaultValue:
                        'Âm lịch',
                    },
                  )}
                  value={`${chart.lunarDate.day}/${chart.lunarDate.month}/${chart.lunarDate.year}${
                    chart.lunarDate
                      .isLeapMonth
                      ? ` ${t('bazi.leapMonthShort', {
                          defaultValue: 'leap',
                        })}`
                      : ''
                  }`}
                />

                <SummaryItem
                  label={t(
                    'bazi.dayMaster',
                    {
                      defaultValue:
                        'Nhật chủ',
                    },
                  )}
                  value={`${
                    isVietnamese
                      ? chart.dayMaster.vi
                      : chart.dayMaster.en
                  } ${chart.dayMaster.han}`}
                />

                <SummaryItem
                  label={t(
                    'bazi.strength',
                    {
                      defaultValue:
                        'Thân vượng/suy',
                    },
                  )}
                  value={strengthLabel(
                    chart.strength.level,
                    t,
                  )}
                />

                <SummaryItem
                  label={t(
                    'bazi.favorableElements',
                    {
                      defaultValue:
                        'Ngũ hành thuận lợi',
                    },
                  )}
                  value={
                    usefulElementSummary ||
                    '—'
                  }
                />
              </View>

              {form.useTrueSolarTime && (
                <View style={styles.correctionCard}>
                  <Text style={styles.correctionTitle}>
                    {t(
                      'bazi.correctedTime',
                      {
                        defaultValue:
                          'Giờ sau hiệu chỉnh',
                      },
                    )}
                  </Text>

                  <Text style={styles.correctionValue}>
                    {formatLocalDateTime(
                      chart.normalizedTime
                        .correctedLocalDateTime,
                    )}
                  </Text>

                  <Text style={styles.correctionNote}>
                    {t(
                      'bazi.totalCorrection',
                      {
                        defaultValue:
                          'Tổng hiệu chỉnh',
                      },
                    )}
                    {': '}
                    {chart.normalizedTime
                      .totalCorrectionMinutes}{' '}
                    {t('bazi.units.minutes', {
                      defaultValue: 'minutes',
                    })}
                  </Text>
                </View>
              )}
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
                    'expertMode.details.notes.bazi',
                  )}
                  showRawCodes={
                    preferences.showRawCodes
                  }
                  rows={[
                    {
                      label: t(
                        'expertMode.details.fields.normalizedTime',
                      ),
                      value:
                        formatLocalDateTime(
                          chart.normalizedTime
                            .correctedLocalDateTime,
                        ),
                      code:
                        'normalizedTime.correctedLocalDateTime',
                    },
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
                        'expertMode.details.fields.correctionMinutes',
                      ),
                      value:
                        String(
                          chart.normalizedTime
                            .totalCorrectionMinutes,
                        ),
                      code:
                        'normalizedTime.totalCorrectionMinutes',
                    },
                    {
                      label: t(
                        'expertMode.details.fields.trueSolarTime',
                      ),
                      value:
                        form.useTrueSolarTime
                          ? t(
                              'expertMode.details.values.yes',
                            )
                          : t(
                              'expertMode.details.values.no',
                            ),
                      code:
                        'input.useTrueSolarTime',
                    },
                    {
                      label: t(
                        'bazi.dayMaster',
                        {
                          defaultValue:
                            'Day Master',
                        },
                      ),
                      value:
                        isVietnamese
                          ? chart.dayMaster.vi
                          : chart.dayMaster.en,
                      code:
                        chart.dayMaster.han,
                    },
                    {
                      label: t(
                        'bazi.dayMasterStrength',
                        {
                          defaultValue:
                            'Day Master strength',
                        },
                      ),
                      value:
                        strengthLabel(
                          chart.strength.level,
                          t,
                        ),
                      code:
                        chart.strength.level,
                    },
                  ]}
                  notes={[
                    t(
                      'expertMode.details.notes.bazi',
                    ),
                  ]}
                />
              )}

            {isExpert &&
              preferences.showDiagnostics && (
                <BaziDiagnosticsCard
                  chart={chart}
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
                    kind: 'bazi',
                    payload: {
                      factors: [
                        {
                          code:
                            'dayMaster',
                          label: t(
                            'bazi.dayMaster',
                            {
                              defaultValue:
                                'Day Master',
                            },
                          ),
                          description: t(
                            'explainable.bazi.factorDescriptions.dayMaster',
                          ),
                          rawValue:
                            `${chart.dayMaster.han} · ${
                              isVietnamese
                                ? chart.dayMaster.vi
                                : chart.dayMaster.en
                            }`,
                        },
                        {
                          code:
                            'strength',
                          label: t(
                            'bazi.dayMasterStrength',
                            {
                              defaultValue:
                                'Day Master strength',
                            },
                          ),
                          description: t(
                            'explainable.bazi.factorDescriptions.strength',
                          ),
                          rawValue:
                            chart.strength.level,
                        },
                        {
                          code:
                            'timeCorrection',
                          label: t(
                            'bazi.correctedTime',
                            {
                              defaultValue:
                                'Corrected time',
                            },
                          ),
                          description: t(
                            'explainable.bazi.factorDescriptions.timeCorrection',
                          ),
                          rawValue:
                            `${chart.normalizedTime.totalCorrectionMinutes}`,
                        },
                        {
                          code:
                            'favorableElements',
                          label: t(
                            'bazi.analysis.favorable',
                            {
                              defaultValue:
                                'Favorable elements',
                            },
                          ),
                          description: t(
                            'explainable.bazi.factorDescriptions.favorableElements',
                          ),
                          rawValue:
                            chart.usefulElements.favorable.join(
                              ',',
                            ),
                        },
                      ],
                      rawData: {
                        timeZone:
                          chart.input.location.timeZone,
                        totalCorrectionMinutes:
                          chart.normalizedTime.totalCorrectionMinutes,
                        useTrueSolarTime:
                          form.useTrueSolarTime,
                        dayMaster:
                          chart.dayMaster.han,
                        strength:
                          chart.strength.level,
                      },
                      modelVersion:
                        'bazi-engine-current',
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

            <View style={styles.stage3ActionCard}>
              <Pressable
                disabled={isSavingChart}
                style={({pressed}) => [
                  styles.stage3PrimaryButton,
                  isSavingChart && styles.calculateButtonDisabled,
                  pressed && styles.pressed,
                ]}
                onPress={saveCurrentChart}>
                <Text style={styles.stage3PrimaryText}>
                  {isSavingChart
                    ? t('bazi.stage3.saving', {defaultValue: 'Đang lưu...'})
                    : loadedRecordId
                      ? t('bazi.stage3.updateSaved', {defaultValue: 'Cập nhật lá số đã lưu'})
                      : t('bazi.stage3.saveChart', {defaultValue: 'Lưu lá số'})}
                </Text>
              </Pressable>

              <Pressable
                style={({pressed}) => [
                  styles.stage3SecondaryButton,
                  pressed && styles.pressed,
                ]}
                onPress={shareCurrentChart}>
                <Text style={styles.stage3SecondaryText}>
                  {t('bazi.stage3.share', {defaultValue: 'Chia sẻ'})}
                </Text>
              </Pressable>
            </View>

            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>
                {t(
                  'bazi.fourPillars',
                  {
                    defaultValue:
                      'Tứ trụ',
                  },
                )}
              </Text>

              <View style={styles.pillarsRow}>
                {PILLAR_ORDER.map(kind => (
                  <PillarCard
                    key={kind}
                    kind={kind}
                    pillar={
                      chart.pillars[
                        kind
                      ]
                    }
                    isVietnamese={isVietnamese}
                    t={t}
                  />
                ))}
              </View>
            </View>

            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>
                {t(
                  'bazi.fiveElements',
                  {
                    defaultValue:
                      'Phân bố ngũ hành',
                  },
                )}
              </Text>

              <View style={styles.elementsCard}>
                {ELEMENTS.map(element => (
                  <ElementBar
                    key={element}
                    element={element}
                    value={
                      chart.elements
                        .percentages[
                        element
                      ]
                    }
                    t={t}
                  />
                ))}
              </View>
            </View>

            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>
                {t(
                  'bazi.usefulElements',
                  {
                    defaultValue:
                      'Dụng thần và cân bằng',
                  },
                )}
              </Text>

              <View style={styles.analysisCard}>
                <AnalysisRow
                  label={t('bazi.analysis.favorable', {
                    defaultValue: 'Favorable',
                  })}
                  elements={
                    chart.usefulElements
                      .favorable
                  }
                  t={t}
                  tone="good"
                />

                <AnalysisRow
                  label={t('bazi.analysis.supportive', {
                    defaultValue: 'Supportive',
                  })}
                  elements={
                    chart.usefulElements
                      .supportive
                  }
                  t={t}
                  tone="neutral"
                />

                <AnalysisRow
                  label={t('bazi.analysis.unfavorable', {
                    defaultValue: 'Unfavorable',
                  })}
                  elements={
                    chart.usefulElements
                      .unfavorable
                  }
                  t={t}
                  tone="caution"
                />

                <AnalysisRow
                  label={t('bazi.analysis.climateBalancing', {
                    defaultValue: 'Climate balancing',
                  })}
                  elements={
                    chart.usefulElements
                      .climateBalancing
                  }
                  t={t}
                  tone="gold"
                />
              </View>
            </View>

            {isExpert && (
              <BaziStage2Details
                chart={chart}
                language={language}
              />
            )}

            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>
                {t(
                  'bazi.interpretation',
                  {
                    defaultValue:
                      'Luận giải',
                  },
                )}
              </Text>

              {INTERPRETATION_SECTIONS.map(
                item => {
                  const section =
                    chart.interpretation[
                      item.id
                    ];

                  const isOpen =
                    openSection ===
                    item.id;

                  return (
                    <InterpretationCard
                      key={item.id}
                      icon={item.icon}
                      title={t(item.titleKey)}
                      section={section}
                      language={
                        language
                      }
                      isOpen={isOpen}
                      t={t}
                      onToggle={() =>
                        setOpenSection(
                          current =>
                            current ===
                            item.id
                              ? ''
                              : item.id,
                        )
                      }
                    />
                  );
                },
              )}
            </View>

            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>
                {t(
                  'bazi.luckPillars',
                  {
                    defaultValue:
                      'Đại vận',
                  },
                )}
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                  false
                }
                contentContainerStyle={
                  styles.luckRow
                }>
                {chart.luckPillars.map(
                  item => (
                    <View
                      key={item.index}
                      style={styles.luckCard}>
                      <Text style={styles.luckAge}>
                        {Math.round(
                          item.startAge,
                        )}
                        {'–'}
                        {Math.round(
                          item.endAge,
                        )}
                      </Text>

                      <Text style={styles.luckPillar}>
                        {isVietnamese
                          ? item.pillar.stem.vi
                          : item.pillar.stem.en}
                        {' '}
                        {isVietnamese
                          ? item.pillar.branch.vi
                          : item.pillar.branch.en}
                      </Text>

                      <Text style={styles.luckYears}>
                        {item.approximateStartYear}
                        {'–'}
                        {item.approximateEndYear}
                      </Text>
                    </View>
                  ),
                )}
              </ScrollView>
            </View>

            <View style={styles.warningCard}>
              <Text style={styles.warningTitle}>
                {t(
                  'bazi.noticeTitle',
                  {
                    defaultValue:
                      'Lưu ý',
                  },
                )}
              </Text>

              <Text style={styles.warningText}>
                {t(
                  'bazi.notice',
                  {
                    defaultValue:
                      'Kết quả mang tính tham khảo văn hóa và chiêm nghiệm. Không phải dự đoán chắc chắn, tư vấn y tế hoặc tư vấn tài chính.',
                  },
                )}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

type SummaryItemProps = {
  label: string;
  value: string;
};

function SummaryItem({
  label,
  value,
}: SummaryItemProps) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>
        {label}
      </Text>

      <Text style={styles.summaryValue}>
        {value}
      </Text>
    </View>
  );
}

type PillarCardProps = {
  kind: PillarKind;
  pillar: Pillar;
  isVietnamese: boolean;
  t: TFunction;
};

function PillarCard({
  kind,
  pillar,
  isVietnamese,
  t,
}: PillarCardProps) {
  return (
    <View style={styles.pillarCard}>
      <Text style={styles.pillarKind}>
        {pillarKindLabel(
          kind,
          t,
        )}
      </Text>

      <Text style={styles.pillarHan}>
        {pillar.stem.han}
        {pillar.branch.han}
      </Text>

      <Text style={styles.pillarVi}>
        {isVietnamese
          ? pillar.stem.vi
          : pillar.stem.en}
        {' '}
        {isVietnamese
          ? pillar.branch.vi
          : pillar.branch.en}
      </Text>

      <Text style={styles.pillarTenGod}>
        {tenGodLabel(
          pillar.stemTenGod,
          t,
        )}
      </Text>
    </View>
  );
}

type ElementBarProps = {
  element: Element;
  value: number;
  t: TFunction;
};

function ElementBar({
  element,
  value,
  t,
}: ElementBarProps) {
  const width = Math.max(
    0,
    Math.min(100, value),
  );

  return (
    <View style={styles.elementRow}>
      <Text style={styles.elementLabel}>
        {elementLabel(
          element,
          t,
        )}
      </Text>

      <View style={styles.elementTrack}>
        <View
          style={[
            styles.elementFill,
            {
              width: `${width}%`,
              backgroundColor:
                elementColor(
                  element,
                ),
            },
          ]}
        />
      </View>

      <Text style={styles.elementValue}>
        {value.toFixed(1)}%
      </Text>
    </View>
  );
}

type AnalysisRowProps = {
  label: string;
  elements: Element[];
  t: TFunction;
  tone:
    | 'good'
    | 'neutral'
    | 'caution'
    | 'gold';
};

function AnalysisRow({
  label,
  elements,
  t,
  tone,
}: AnalysisRowProps) {
  return (
    <View style={styles.analysisRow}>
      <Text style={styles.analysisLabel}>
        {label}
      </Text>

      <View style={styles.chipWrap}>
        {elements.length === 0 ? (
          <Text style={styles.emptyValue}>
            —
          </Text>
        ) : (
          elements.map(element => (
            <View
              key={element}
              style={[
                styles.analysisChip,
                tone === 'good' &&
                  styles.analysisChipGood,
                tone === 'neutral' &&
                  styles.analysisChipNeutral,
                tone === 'caution' &&
                  styles.analysisChipCaution,
                tone === 'gold' &&
                  styles.analysisChipGold,
              ]}>
              <Text style={styles.analysisChipText}>
                {elementLabel(
                  element,
                  t,
                )}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

type InterpretationCardProps = {
  icon: string;
  title: string;
  section: InterpretationSection;
  language: string;
  isOpen: boolean;
  t: TFunction;
  onToggle: () => void;
};

function InterpretationCard({
  icon,
  title,
  section,
  language,
  isOpen,
  t,
  onToggle,
}: InterpretationCardProps) {
  return (
    <View style={styles.interpretationCard}>
      <Pressable
        style={({pressed}) => [
          styles.interpretationHeader,
          pressed && styles.pressed,
        ]}
        onPress={onToggle}>
        <Text style={styles.interpretationIcon}>
          {icon}
        </Text>

        <View style={styles.interpretationHeaderText}>
          <Text style={styles.interpretationTitle}>
            {title}
          </Text>

          <Text style={styles.interpretationHeadline}>
            {translateBaziCode(
              section.headlineCode,
              language,
            )}
          </Text>
        </View>

        <View style={styles.scoreBadge}>
          <Text style={styles.scoreValue}>
            {section.score}
          </Text>
        </View>

        <Text style={styles.expandIcon}>
          {isOpen ? '⌃' : '⌄'}
        </Text>
      </Pressable>

      {isOpen && (
        <View style={styles.interpretationBody}>
          <CodeList
            title={t('bazi.common.strengths', {
              defaultValue: 'Strengths',
            })}
            codes={
              section.strengthCodes
            }
            language={language}
            tone="good"
          />

          <CodeList
            title={t('bazi.common.pointsToConsider', {
              defaultValue: 'Points to consider',
            })}
            codes={
              section.cautionCodes
            }
            language={language}
            tone="caution"
          />

          <CodeList
            title={t('bazi.common.advice', {
              defaultValue: 'Advice',
            })}
            codes={
              section.adviceCodes
            }
            language={language}
            tone="advice"
          />
        </View>
      )}
    </View>
  );
}

type CodeListProps = {
  title: string;
  codes: string[];
  language: string;
  tone:
    | 'good'
    | 'caution'
    | 'advice';
};

function CodeList({
  title,
  codes,
  language,
  tone,
}: CodeListProps) {
  if (codes.length === 0) {
    return null;
  }

  return (
    <View style={styles.codeList}>
      <Text style={styles.codeListTitle}>
        {title}
      </Text>

      {codes.map(code => (
        <View
          key={code}
          style={styles.codeRow}>
          <View
            style={[
              styles.codeDot,
              tone === 'good' &&
                styles.codeDotGood,
              tone === 'caution' &&
                styles.codeDotCaution,
              tone === 'advice' &&
                styles.codeDotAdvice,
            ]}
          />

          <Text style={styles.codeText}>
            {translateBaziCode(
              code,
              language,
            )}
          </Text>
        </View>
      ))}
    </View>
  );
}

function genderLabel(
  gender: Gender,
  t: TFunction,
): string {
  return t(`bazi.genders.${gender}`, {
    defaultValue: gender,
  });
}

function pillarKindLabel(
  kind: PillarKind,
  t: TFunction,
): string {
  return t(`bazi.pillars.${kind}`, {
    defaultValue: kind,
  });
}

function elementLabel(
  element: Element,
  t: TFunction,
): string {
  return t(`bazi.elements.${element}`, {
    defaultValue: element,
  });
}

function elementColor(
  element: Element,
): string {
  const colors: Record<Element, string> = {
    wood: '#6F934C',
    fire: '#C75B43',
    earth: '#B58B4B',
    metal: '#8E969E',
    water: '#4E82A7',
  };

  return colors[element];
}

function strengthLabel(
  level: StrengthLevel,
  t: TFunction,
): string {
  return t(`bazi.strengthLevels.${level}`, {
    defaultValue: level,
  });
}

function tenGodLabel(
  tenGod: TenGod | 'dayMaster',
  t: TFunction,
): string {
  return t(`bazi.tenGods.${tenGod}`, {
    defaultValue: tenGod,
  });
}

const BACKGROUND = '#FFF8EF';
const SURFACE = '#FFFDF8';
const BROWN = '#4E2C1C';
const GOLD = '#D0A04C';
const BORDER = '#E5CDA8';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  content: {
    padding: 16,
    paddingBottom: 120,
  },

  headerCard: {
    alignItems: 'center',
    backgroundColor: BROWN,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 24,
    padding: 20,
  },

  headerIcon: {
    color: '#FFE3A3',
    fontSize: 44,
  },

  title: {
    color: '#FFE3A3',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 7,
  },

  subtitle: {
    color: '#ECD7B8',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },

  formCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 22,
    padding: 17,
    marginTop: 14,
  },

  sectionTitle: {
    color: BROWN,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
  },

  sectionTitleSecondary: {
    color: BROWN,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 20,
    marginBottom: 10,
  },

  inputLabel: {
    color: '#806550',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
  },

  fullInput: {
    minHeight: 48,
    color: BROWN,
    fontSize: 15,
    backgroundColor: '#FFF5E5',
    borderWidth: 1,
    borderColor: '#E0C292',
    borderRadius: 13,
    paddingHorizontal: 12,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  smallInput: {
    flex: 1,
    minHeight: 48,
    color: BROWN,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    backgroundColor: '#FFF5E5',
    borderWidth: 1,
    borderColor: '#E0C292',
    borderRadius: 13,
  },

  yearInput: {
    flex: 1.35,
    minHeight: 48,
    color: BROWN,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    backgroundColor: '#FFF5E5',
    borderWidth: 1,
    borderColor: '#E0C292',
    borderRadius: 13,
  },

  separator: {
    color: '#967A62',
    fontSize: 21,
    paddingHorizontal: 8,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  timeInput: {
    width: 82,
    minHeight: 48,
    color: BROWN,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    backgroundColor: '#FFF5E5',
    borderWidth: 1,
    borderColor: '#E0C292',
    borderRadius: 13,
  },

  timeColon: {
    color: BROWN,
    fontSize: 24,
    fontWeight: '900',
    paddingHorizontal: 10,
  },

  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  genderButton: {
    width: '31.5%',
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3E7D7',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 13,
  },

  genderButtonSelected: {
    backgroundColor: BROWN,
    borderColor: GOLD,
  },

  genderText: {
    color: '#6F5745',
    fontSize: 12,
    fontWeight: '800',
  },

  genderTextSelected: {
    color: '#FFE7B0',
  },

  coordinateRow: {
    flexDirection: 'row',
  },

  coordinateField: {
    flex: 1,
  },

  coordinateGap: {
    width: 10,
  },

  switchRow: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7EBD9',
    borderRadius: 15,
    paddingHorizontal: 13,
    marginTop: 16,
  },

  switchTextWrap: {
    flex: 1,
    marginRight: 12,
  },

  switchTitle: {
    color: BROWN,
    fontSize: 14,
    fontWeight: '900',
  },

  switchDescription: {
    color: '#7A6453',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  calculateButton: {
    minHeight: 51,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GOLD,
    borderRadius: 15,
    marginTop: 18,
  },

  calculateButtonDisabled: {
    opacity: 0.55,
  },

  calculateButtonText: {
    color: '#3D2417',
    fontSize: 15,
    fontWeight: '900',
  },

  summaryCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 22,
    padding: 17,
    marginTop: 15,
  },

  resultTitle: {
    color: BROWN,
    fontSize: 21,
    fontWeight: '900',
  },

  resultMeta: {
    color: '#8A715E',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  summaryItem: {
    width: '48.5%',
    minHeight: 78,
    backgroundColor: '#F8EDDE',
    borderRadius: 14,
    padding: 11,
    marginBottom: 9,
  },

  summaryLabel: {
    color: '#8D725C',
    fontSize: 11,
  },

  summaryValue: {
    color: BROWN,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 5,
  },

  correctionCard: {
    backgroundColor: '#FFF3D5',
    borderWidth: 1,
    borderColor: '#DDBD7D',
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
  },

  correctionTitle: {
    color: '#8B6734',
    fontSize: 11,
    fontWeight: '800',
  },

  correctionValue: {
    color: BROWN,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 4,
  },

  correctionNote: {
    color: '#7C6651',
    fontSize: 11,
    marginTop: 3,
  },

  resultSection: {
    marginTop: 20,
  },

  resultSectionTitle: {
    color: BROWN,
    fontSize: 21,
    fontWeight: '900',
    marginBottom: 11,
  },

  pillarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  pillarCard: {
    width: '23.5%',
    alignItems: 'center',
    backgroundColor: BROWN,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 16,
    paddingHorizontal: 5,
    paddingVertical: 12,
  },

  pillarKind: {
    color: '#EBCF9F',
    fontSize: 10,
    fontWeight: '700',
  },

  pillarHan: {
    color: '#FFE4A1',
    fontSize: 25,
    fontWeight: '900',
    marginTop: 7,
  },

  pillarVi: {
    color: '#F4E2C7',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 5,
  },

  pillarTenGod: {
    color: '#CBB08A',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 5,
  },

  elementsCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 15,
  },

  elementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7,
  },

  elementLabel: {
    width: 46,
    color: BROWN,
    fontSize: 12,
    fontWeight: '800',
  },

  elementTrack: {
    flex: 1,
    height: 10,
    backgroundColor: '#E9DDD0',
    borderRadius: 5,
    overflow: 'hidden',
  },

  elementFill: {
    height: '100%',
    borderRadius: 5,
  },

  elementValue: {
    width: 53,
    color: '#755F4D',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },

  analysisCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 14,
  },

  analysisRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE1D0',
    paddingVertical: 10,
  },

  analysisLabel: {
    color: BROWN,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 7,
  },

  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  analysisChip: {
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 5,
  },

  analysisChipGood: {
    backgroundColor: '#E7F0DF',
  },

  analysisChipNeutral: {
    backgroundColor: '#E8E8E1',
  },

  analysisChipCaution: {
    backgroundColor: '#F8E1D9',
  },

  analysisChipGold: {
    backgroundColor: '#F6E4B7',
  },

  analysisChipText: {
    color: '#554435',
    fontSize: 11,
    fontWeight: '800',
  },

  emptyValue: {
    color: '#8A7461',
    fontSize: 12,
  },

  interpretationCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    marginBottom: 10,
    overflow: 'hidden',
  },

  interpretationHeader: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
  },

  interpretationIcon: {
    fontSize: 27,
    marginRight: 10,
  },

  interpretationHeaderText: {
    flex: 1,
  },

  interpretationTitle: {
    color: BROWN,
    fontSize: 15,
    fontWeight: '900',
  },

  interpretationHeadline: {
    color: '#7A6452',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  scoreBadge: {
    minWidth: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1DEB9',
    borderRadius: 13,
    marginLeft: 8,
  },

  scoreValue: {
    color: BROWN,
    fontSize: 15,
    fontWeight: '900',
  },

  expandIcon: {
    color: '#866D58',
    fontSize: 17,
    marginLeft: 7,
  },

  interpretationBody: {
    borderTopWidth: 1,
    borderTopColor: '#EADBC8',
    paddingHorizontal: 14,
    paddingBottom: 13,
  },

  codeList: {
    marginTop: 12,
  },

  codeListTitle: {
    color: BROWN,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 6,
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

  codeDotCaution: {
    backgroundColor: '#B6654E',
  },

  codeDotAdvice: {
    backgroundColor: GOLD,
  },

  codeText: {
    flex: 1,
    color: '#6D5848',
    fontSize: 12,
    lineHeight: 18,
  },

  luckRow: {
    paddingRight: 5,
  },

  luckCard: {
    width: 105,
    alignItems: 'center',
    backgroundColor: BROWN,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 16,
    padding: 12,
    marginRight: 9,
  },

  luckAge: {
    color: '#DFC99F',
    fontSize: 10,
  },

  luckPillar: {
    color: '#FFE2A0',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 6,
  },

  luckYears: {
    color: '#CDB490',
    fontSize: 9,
    marginTop: 5,
  },

  warningCard: {
    backgroundColor: '#F7EAD6',
    borderWidth: 1,
    borderColor: '#DFC59C',
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
  },

  warningTitle: {
    color: BROWN,
    fontSize: 14,
    fontWeight: '900',
  },

  warningText: {
    color: '#745C48',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  explainResultButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    backgroundColor: '#E8EDF3',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 12,
  },

  explainResultButtonText: {
    color: '#17243A',
    fontSize: 10,
    fontWeight: '900',
  },

  stage3ActionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  stage3PrimaryButton: {
    width: '64%',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BROWN,
    borderRadius: 14,
    paddingHorizontal: 12,
  },

  stage3PrimaryText: {
    color: '#FFE3A3',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },

  stage3SecondaryButton: {
    width: '33%',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4E7D3',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
  },

  stage3SecondaryText: {
    color: BROWN,
    fontSize: 13,
    fontWeight: '900',
  },

  pressed: {
    opacity: 0.68,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },
});
