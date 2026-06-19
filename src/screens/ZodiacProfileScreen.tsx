import React, {
  useCallback,
  useState,
} from 'react';

import {
  Pressable,
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
  useNavigation,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import {
  buildBirthChart,
  CHART_POINT_ORDER,
  getChartPointLabel,
  getZodiacSymbol,
  type AspectType,
  type BirthChartResult,
  type ChartPoint,
  type ChartPointId,
} from '../services/astroBirthChart';

import {
  ensureDefaultBirthProfile,
  getActiveBirthProfile,
  type BirthProfile,
} from '../services/birthProfiles';

import {
  formatBirthPlace,
} from '../services/birthPlaces';

type NavigationLike = {
  navigate: (
    routeName: string,
    params?: Record<string, unknown>,
  ) => void;
};

export default function ZodiacProfileScreen() {
  const {t} =
    useTranslation();

  const navigation =
    useNavigation<NavigationLike>();

  const [
    activeProfile,
    setActiveProfile,
  ] =
    useState<BirthProfile | undefined>();

  const [chart, setChart] =
    useState<BirthChartResult | undefined>();

  const load = useCallback(
    async () => {
      const profile =
        (await getActiveBirthProfile()) ??
        (await ensureDefaultBirthProfile());

      setActiveProfile(profile);
      setChart(
        buildBirthChart(
          profile.input,
        ),
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

  if (
    !activeProfile ||
    !chart
  ) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>
            {t(
              'common.loading',
              {
                defaultValue:
                  'Loading...',
              },
            )}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const sun =
    chart.points.sun;

  const moon =
    chart.points.moon;

  const rising =
    chart.points.ascendant;

  const dominantElementLabel =
    t(
      `western.elements.${chart.dominantElement}`,
      {
        defaultValue:
          chart.dominantElement,
      },
    );

  const dominantModalityLabel =
    t(
      `western.modalities.${chart.dominantModality}`,
      {
        defaultValue:
          chart.dominantModality,
      },
    );

  const placeText =
    activeProfile.place
      ? formatBirthPlace(
          activeProfile.place,
        )
      : `${activeProfile.input.latitude}, ${activeProfile.input.longitude}`;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'lunaBirthProfiles.chartEyebrow',
            {
              defaultValue:
                'Active Profile',
            },
          )}
        </Text>

        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text style={styles.title}>
              {activeProfile.name}
            </Text>

            <Text
              style={styles.subtitle}
              numberOfLines={2}>
              ◎ {placeText}
            </Text>
          </View>

          <Pressable
            style={styles.manageButton}
            onPress={() =>
              navigation.navigate(
                'BirthProfiles',
              )
            }>
            <Text style={styles.manageText}>
              {t(
                'lunaBirthProfiles.manage',
                {
                  defaultValue:
                    'Manage',
                },
              )}
            </Text>
          </Pressable>
        </View>

        <View style={styles.metaCard}>
          <Text style={styles.metaText}>
            {activeProfile.input.year}-
            {String(
              activeProfile.input.month,
            ).padStart(2, '0')}
            -
            {String(
              activeProfile.input.day,
            ).padStart(2, '0')}
            {' • '}
            {String(
              activeProfile.input.hour,
            ).padStart(2, '0')}
            :
            {String(
              activeProfile.input.minute,
            ).padStart(2, '0')}
            {' • UTC '}
            {activeProfile.input.timezoneOffset >=
            0
              ? '+'
              : ''}
            {activeProfile.input.timezoneOffset}
          </Text>
        </View>

        <View style={styles.bigCard}>
          <Text style={styles.sectionLabelGold}>
            {t(
              'lunaBirthProfiles.bigThree',
              {
                defaultValue:
                  'The Big Three',
              },
            )}
          </Text>

          <View style={styles.bigThreeRow}>
            <PointBlock
              point={sun}
            />

            <PointBlock
              point={moon}
            />

            <PointBlock
              point={rising}
            />
          </View>

          <View style={styles.balanceBox}>
            <BalanceLine
              label={t(
                'lunaBirthProfiles.dominantElement',
                {
                  defaultValue:
                    'Dominant element',
                },
              )}
              value={dominantElementLabel}
            />

            <BalanceLine
              label={t(
                'lunaBirthProfiles.dominantModality',
                {
                  defaultValue:
                    'Dominant modality',
                },
              )}
              value={dominantModalityLabel}
            />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'lunaBirthProfiles.planets',
              {
                defaultValue:
                  'Planets',
              },
            )}
          </Text>

          {CHART_POINT_ORDER.map(pointId => (
            <PlanetRow
              key={pointId}
              point={chart.points[pointId]}
            />
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'lunaBirthProfiles.balance',
              {
                defaultValue:
                  'Element & Modality Balance',
              },
            )}
          </Text>

          {Object.entries(
            chart.elementBalance,
          ).map(
            ([
              element,
              value,
            ]) => (
              <MeterRow
                key={element}
                label={t(
                  `western.elements.${element}`,
                  {
                    defaultValue:
                      element,
                  },
                )}
                value={value}
                max={6}
              />
            ),
          )}

          <View style={styles.meterDivider} />

          {Object.entries(
            chart.modalityBalance,
          ).map(
            ([
              modality,
              value,
            ]) => (
              <MeterRow
                key={modality}
                label={t(
                  `western.modalities.${modality}`,
                  {
                    defaultValue:
                      modality,
                  },
                )}
                value={value}
                max={8}
              />
            ),
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'lunaBirthProfiles.houses',
              {
                defaultValue:
                  'Equal Houses',
              },
            )}
          </Text>

          <View style={styles.houseGrid}>
            {chart.houses.map(house => (
              <View
                key={house.house}
                style={styles.houseCell}>
                <Text style={styles.houseNumber}>
                  {t(
                    'lunaBirthProfiles.house',
                    {
                      number:
                        house.house,
                      defaultValue:
                        `House ${house.house}`,
                    },
                  )}
                </Text>

                <Text style={styles.houseSign}>
                  {getZodiacSymbol(
                    house.sign,
                  )}{' '}
                  {t(
                    `western.signs.${house.sign}`,
                    {
                      defaultValue:
                        house.sign,
                    },
                  )}
                </Text>

                <Text style={styles.houseDegree}>
                  {house.degreeText}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'lunaBirthProfiles.aspects',
              {
                defaultValue:
                  'Major Aspects',
              },
            )}
          </Text>

          {chart.aspects.length === 0 ? (
            <Text style={styles.emptyText}>
              {t(
                'lunaBirthProfiles.noAspects',
                {
                  defaultValue:
                    'No major aspects within the selected orb.',
                },
              )}
            </Text>
          ) : (
            chart.aspects.map(aspect => (
              <AspectRow
                key={`${aspect.first}-${aspect.second}-${aspect.type}`}
                first={aspect.first}
                second={aspect.second}
                type={aspect.type}
                orb={aspect.orb}
              />
            ))
          )}
        </View>

        <Text style={styles.notice}>
          {t(
            'lunaBirthProfiles.approximateNotice',
            {
              defaultValue:
                'This lightweight chart uses offline approximate calculations. For professional astrology, use a certified ephemeris and exact birthplace.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function PointBlock({
  point,
}: {
  point: ChartPoint;
}) {
  const {t} =
    useTranslation();

  return (
    <View style={styles.pointBlock}>
      <Text style={styles.pointSymbol}>
        {getZodiacSymbol(point.sign)}
      </Text>

      <Text style={styles.pointLabel}>
        {t(
          `lunaBirthProfiles.points.${point.id}`,
          {
            defaultValue:
              getChartPointLabel(
                point.id,
              ),
          },
        )}
      </Text>

      <Text
        style={styles.pointSign}
        numberOfLines={1}>
        {t(
          `western.signs.${point.sign}`,
          {
            defaultValue:
              point.sign,
          },
        )}
      </Text>

      <Text style={styles.pointDegree}>
        {point.degreeText}
      </Text>

      <Text style={styles.pointHouse}>
        {t(
          'lunaBirthProfiles.house',
          {
            number:
              point.house,
            defaultValue:
              `House ${point.house}`,
          },
        )}
      </Text>
    </View>
  );
}

function PlanetRow({
  point,
}: {
  point: ChartPoint;
}) {
  const {t} =
    useTranslation();

  return (
    <View style={styles.planetRow}>
      <View style={styles.planetSymbolBox}>
        <Text style={styles.planetSymbol}>
          {getZodiacSymbol(point.sign)}
        </Text>
      </View>

      <View style={styles.planetCopy}>
        <Text style={styles.planetName}>
          {t(
            `lunaBirthProfiles.points.${point.id}`,
            {
              defaultValue:
                getChartPointLabel(
                  point.id,
                ),
            },
          )}
        </Text>

        <Text style={styles.planetMeta}>
          {t(
            `western.signs.${point.sign}`,
            {
              defaultValue:
                point.sign,
            },
          )}{' '}
          {point.degreeText} •{' '}
          {t(
            'lunaBirthProfiles.house',
            {
              number:
                point.house,
              defaultValue:
                `House ${point.house}`,
            },
          )}
        </Text>
      </View>
    </View>
  );
}

function BalanceLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.balanceLine}>
      <Text style={styles.balanceLabel}>
        {label}
      </Text>

      <Text style={styles.balanceValue}>
        {value}
      </Text>
    </View>
  );
}

function MeterRow({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  return (
    <View style={styles.meterRow}>
      <Text style={styles.meterLabel}>
        {label}
      </Text>

      <View style={styles.meterTrack}>
        <View
          style={[
            styles.meterFill,
            {
              width: `${Math.min(
                100,
                (value / max) * 100,
              )}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.meterValue}>
        {value}
      </Text>
    </View>
  );
}

function AspectRow({
  first,
  second,
  type,
  orb,
}: {
  first: ChartPointId;
  second: ChartPointId;
  type: AspectType;
  orb: number;
}) {
  const {t} =
    useTranslation();

  return (
    <View style={styles.aspectRow}>
      <Text style={styles.aspectText}>
        {t(
          `lunaBirthProfiles.points.${first}`,
          {
            defaultValue:
              getChartPointLabel(first),
          },
        )}{' '}
        {t(
          `lunaBirthProfiles.aspectNames.${type}`,
          {
            defaultValue:
              type,
          },
        )}{' '}
        {t(
          `lunaBirthProfiles.points.${second}`,
          {
            defaultValue:
              getChartPointLabel(second),
          },
        )}
      </Text>

      <Text style={styles.orbText}>
        {t(
          'lunaBirthProfiles.orb',
          {
            value:
              orb,
            defaultValue:
              `orb ${orb}°`,
          },
        )}
      </Text>
    </View>
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

  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: COLORS.muted,
    fontSize: 14,
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

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  titleCopy: {
    flex: 1,
  },

  title: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: '900',
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  manageButton: {
    backgroundColor: COLORS.night,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginLeft: 10,
  },

  manageText: {
    color: '#F8EBCB',
    fontSize: 11,
    fontWeight: '900',
  },

  metaCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 12,
    marginTop: 14,
  },

  metaText: {
    color: '#9A7939',
    fontSize: 12,
    fontWeight: '900',
  },

  bigCard: {
    backgroundColor: COLORS.night,
    borderRadius: 28,
    padding: 18,
    marginTop: 16,
  },

  sectionLabelGold: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 14,
  },

  bigThreeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  pointBlock: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    paddingVertical: 13,
    marginHorizontal: 4,
  },

  pointSymbol: {
    color: COLORS.gold,
    fontSize: 36,
    fontWeight: '900',
  },

  pointLabel: {
    color: '#BEB3DD',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginTop: 6,
  },

  pointSign: {
    color: '#FFF8EA',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4,
    textTransform: 'capitalize',
  },

  pointDegree: {
    color: '#DCD2F3',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 3,
  },

  pointHouse: {
    color: '#D9B76E',
    fontSize: 9,
    fontWeight: '900',
    marginTop: 4,
  },

  balanceBox: {
    backgroundColor: 'rgba(217,183,110,0.12)',
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
  },

  balanceLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },

  balanceLabel: {
    color: '#BEB3DD',
    fontSize: 11,
    fontWeight: '900',
  },

  balanceValue: {
    color: '#F8EBCB',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  sectionCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 15,
    marginTop: 14,
  },

  sectionTitle: {
    color: COLORS.purple,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
  },

  planetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F2EA',
    borderRadius: 16,
    padding: 10,
    marginBottom: 8,
  },

  planetSymbolBox: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE6F4',
    borderRadius: 14,
  },

  planetSymbol: {
    color: COLORS.purple,
    fontSize: 21,
    fontWeight: '900',
  },

  planetCopy: {
    flex: 1,
    marginLeft: 11,
  },

  planetName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },

  planetMeta: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
    textTransform: 'capitalize',
  },

  meterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },

  meterLabel: {
    width: 86,
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  meterTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#EEE6F4',
    borderRadius: 99,
    overflow: 'hidden',
  },

  meterFill: {
    height: 8,
    backgroundColor: COLORS.gold,
    borderRadius: 99,
  },

  meterValue: {
    width: 26,
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'right',
  },

  meterDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },

  houseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },

  houseCell: {
    width: '50%',
    padding: 4,
  },

  houseNumber: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  houseSign: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 3,
    textTransform: 'capitalize',
  },

  houseDegree: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },

  aspectRow: {
    backgroundColor: '#F7F2EA',
    borderRadius: 15,
    padding: 11,
    marginBottom: 8,
  },

  aspectText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  orbText: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 4,
  },

  emptyText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 16,
  },
});
