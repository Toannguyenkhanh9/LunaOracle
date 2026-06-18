import React from 'react';

import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
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
  resetExpertModePreferences,
  useExpertMode,
  type ExpertViewMode,
} from '../services/expertMode';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'ExpertMode'
>;

function ModeCard({
  mode,
  selected,
  title,
  subtitle,
  items,
  onPress,
}: {
  mode: ExpertViewMode;
  selected: boolean;
  title: string;
  subtitle: string;
  items: string[];
  onPress: (
    mode:
      ExpertViewMode,
  ) => void;
}) {
  return (
    <Pressable
      style={({pressed}) => [
        styles.modeCard,
        selected &&
          styles.modeCardSelected,
        pressed &&
          styles.pressed,
      ]}
      onPress={() =>
        onPress(mode)
      }>
      <View
        style={
          styles.modeHeader
        }>
        <View
          style={[
            styles.modeIcon,
            selected &&
              styles.modeIconSelected,
          ]}>
          <Text
            style={[
              styles.modeIconText,
              selected &&
                styles.modeIconTextSelected,
            ]}>
            {mode ===
            'expert'
              ? '∑'
              : '◌'}
          </Text>
        </View>

        <View
          style={
            styles.modeTitleWrap
          }>
          <Text
            style={[
              styles.modeTitle,
              selected &&
                styles.modeTitleSelected,
            ]}>
            {title}
          </Text>

          <Text
            style={[
              styles.modeSubtitle,
              selected &&
                styles.modeSubtitleSelected,
            ]}>
            {subtitle}
          </Text>
        </View>

        <View
          style={[
            styles.radio,
            selected &&
              styles.radioSelected,
          ]}>
          {selected && (
            <View
              style={
                styles.radioDot
              }
            />
          )}
        </View>
      </View>

      <View
        style={
          styles.modeItems
        }>
        {items.map(
          item => (
            <Text
              key={item}
              style={[
                styles.modeItem,
                selected &&
                  styles.modeItemSelected,
              ]}>
              ✓ {item}
            </Text>
          ),
        )}
      </View>
    </Pressable>
  );
}

function PreferenceRow({
  title,
  subtitle,
  value,
  onChange,
  disabled = false,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (
    value: boolean,
  ) => void;
  disabled?: boolean;
}) {
  return (
    <View
      style={[
        styles.preferenceRow,
        disabled &&
          styles.preferenceRowDisabled,
      ]}>
      <View
        style={
          styles.preferenceTextWrap
        }>
        <Text
          style={
            styles.preferenceTitle
          }>
          {title}
        </Text>

        <Text
          style={
            styles.preferenceSubtitle
          }>
          {subtitle}
        </Text>
      </View>

      <Switch
        value={value}
        disabled={disabled}
        onValueChange={
          onChange
        }
        trackColor={{
          false: '#C9C1B5',
          true: '#B8944D',
        }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

export default function ExpertModeScreen({
  navigation,
}: Props) {
  const {t} =
    useTranslation();

  const {
    preferences,
    isExpert,
    setMode,
    update,
  } =
    useExpertMode();

  const reset = async () => {
    await resetExpertModePreferences();
  };

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
          <View
            style={
              styles.heroTopRow
            }>
            <Pressable
              style={({pressed}) => [
                styles.backButton,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                navigation.goBack()
              }>
              <Text
                style={
                  styles.backButtonText
                }>
                ‹
              </Text>
            </Pressable>

            <View
              style={
                styles.heroTextWrap
              }>
              <Text
                style={
                  styles.heroEyebrow
                }>
                EASTERN DESTINY
              </Text>

              <Text
                style={
                  styles.heroTitle
                }>
                {t(
                  'expertMode.title',
                )}
              </Text>
            </View>

            <View
              style={
                styles.heroIconWrap
              }>
              <Text
                style={
                  styles.heroIcon
                }>
                ∑
              </Text>
            </View>
          </View>

          <Text
            style={
              styles.heroSubtitle
            }>
            {t(
              'expertMode.subtitle',
            )}
          </Text>

          <View
            style={
              styles.currentBadge
            }>
            <Text
              style={
                styles.currentBadgeLabel
              }>
              {t(
                'expertMode.currentMode',
              )}
            </Text>

            <Text
              style={
                styles.currentBadgeValue
              }>
              {isExpert
                ? t(
                    'expertMode.modes.expert',
                  )
                : t(
                    'expertMode.modes.simple',
                  )}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={
              styles.sectionEyebrow
            }>
            {t(
              'expertMode.chooseEyebrow',
            )}
          </Text>

          <Text
            style={
              styles.sectionTitle
            }>
            {t(
              'expertMode.chooseTitle',
            )}
          </Text>

          <Text
            style={
              styles.sectionSubtitle
            }>
            {t(
              'expertMode.chooseSubtitle',
            )}
          </Text>

          <ModeCard
            mode="simple"
            selected={
              !isExpert
            }
            title={t(
              'expertMode.simple.title',
            )}
            subtitle={t(
              'expertMode.simple.subtitle',
            )}
            items={[
              t(
                'expertMode.simple.items.0',
              ),
              t(
                'expertMode.simple.items.1',
              ),
              t(
                'expertMode.simple.items.2',
              ),
            ]}
            onPress={setMode}
          />

          <ModeCard
            mode="expert"
            selected={
              isExpert
            }
            title={t(
              'expertMode.expert.title',
            )}
            subtitle={t(
              'expertMode.expert.subtitle',
            )}
            items={[
              t(
                'expertMode.expert.items.0',
              ),
              t(
                'expertMode.expert.items.1',
              ),
              t(
                'expertMode.expert.items.2',
              ),
            ]}
            onPress={setMode}
          />
        </View>

        <View style={styles.section}>
          <Text
            style={
              styles.sectionEyebrow
            }>
            {t(
              'expertMode.preferencesEyebrow',
            )}
          </Text>

          <Text
            style={
              styles.sectionTitle
            }>
            {t(
              'expertMode.preferencesTitle',
            )}
          </Text>

          <View
            style={
              styles.preferencesCard
            }>
            <PreferenceRow
              title={t(
                'expertMode.preferences.calculationDetails.title',
              )}
              subtitle={t(
                'expertMode.preferences.calculationDetails.subtitle',
              )}
              value={
                preferences
                  .showCalculationDetails
              }
              disabled={
                !isExpert
              }
              onChange={value =>
                update({
                  showCalculationDetails:
                    value,
                })
              }
            />

            <PreferenceRow
              title={t(
                'expertMode.preferences.rawCodes.title',
              )}
              subtitle={t(
                'expertMode.preferences.rawCodes.subtitle',
              )}
              value={
                preferences
                  .showRawCodes
              }
              disabled={
                !isExpert
              }
              onChange={value =>
                update({
                  showRawCodes:
                    value,
                })
              }
            />

            <PreferenceRow
              title={t(
                'expertMode.preferences.diagnostics.title',
              )}
              subtitle={t(
                'expertMode.preferences.diagnostics.subtitle',
              )}
              value={
                preferences
                  .showDiagnostics
              }
              disabled={
                !isExpert
              }
              onChange={value =>
                update({
                  showDiagnostics:
                    value,
                })
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={
              styles.sectionEyebrow
            }>
            {t(
              'expertMode.coverageEyebrow',
            )}
          </Text>

          <Text
            style={
              styles.sectionTitle
            }>
            {t(
              'expertMode.coverageTitle',
            )}
          </Text>

          <View
            style={
              styles.coverageCard
            }>
            {(
              [
                'bazi',
                'ziwei',
                'today',
                'timeline',
                'compatibility',
              ] as const
            ).map(item => (
              <View
                key={item}
                style={
                  styles.coverageRow
                }>
                <Text
                  style={
                    styles.coverageIcon
                  }>
                  {item === 'bazi'
                    ? '☯'
                    : item ===
                      'ziwei'
                      ? '紫'
                      : item ===
                        'today'
                        ? '☀'
                        : item ===
                          'timeline'
                          ? '⌁'
                          : '◉'}
                </Text>

                <Text
                  style={
                    styles.coverageText
                  }>
                  {t(
                    `expertMode.coverage.${item}`,
                  )}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={
            styles.noticeCard
          }>
          <Text
            style={
              styles.noticeTitle
            }>
            {t(
              'expertMode.noticeTitle',
            )}
          </Text>

          <Text
            style={
              styles.noticeText
            }>
            {t(
              'expertMode.notice',
            )}
          </Text>
        </View>

        <Pressable
          style={({pressed}) => [
            styles.resetButton,
            pressed &&
              styles.pressed,
          ]}
          onPress={reset}>
          <Text
            style={
              styles.resetButtonText
            }>
            {t(
              'expertMode.reset',
            )}
          </Text>
        </Pressable>
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
  screen: {
    flex: 1,
    backgroundColor:
      COLORS.cream,
  },

  content: {
    paddingBottom: 145,
  },

  hero: {
    backgroundColor:
      COLORS.navy,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 17,
    paddingTop: 16,
    paddingBottom: 21,
  },

  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
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

  backButtonText: {
    color: '#FFF3D3',
    fontSize: 29,
    lineHeight: 31,
  },

  heroTextWrap: {
    flex: 1,
    marginLeft: 11,
  },

  heroEyebrow: {
    color: '#D5B672',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  heroTitle: {
    color: '#FFF7E5',
    fontSize: 25,
    fontWeight: '900',
    marginTop: 3,
  },

  heroIconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(215,175,94,0.12)',
    borderWidth: 1,
    borderColor:
      'rgba(215,175,94,0.35)',
    borderRadius: 14,
  },

  heroIcon: {
    color: '#E9CA82',
    fontSize: 23,
    fontWeight: '900',
  },

  heroSubtitle: {
    color: '#C8CFD9',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 13,
  },

  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(255,255,255,0.07)',
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 9,
    marginTop: 13,
  },

  currentBadgeLabel: {
    color: '#BCC5D2',
    fontSize: 9,
    fontWeight: '800',
  },

  currentBadgeValue: {
    color: '#F2D48A',
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 'auto',
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 23,
  },

  sectionEyebrow: {
    color: '#9B783B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 3,
  },

  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 10.5,
    lineHeight: 16,
    marginTop: 5,
  },

  modeCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 19,
    padding: 15,
    marginTop: 12,
  },

  modeCardSelected: {
    backgroundColor:
      COLORS.navy,
    borderColor:
      COLORS.navy,
  },

  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  modeIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE6DA',
    borderRadius: 13,
  },

  modeIconSelected: {
    backgroundColor:
      'rgba(215,175,94,0.14)',
  },

  modeIconText: {
    color: '#785A2E',
    fontSize: 20,
    fontWeight: '900',
  },

  modeIconTextSelected: {
    color: '#F0D18B',
  },

  modeTitleWrap: {
    flex: 1,
    marginLeft: 11,
  },

  modeTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '900',
  },

  modeTitleSelected: {
    color: '#FFF2D4',
  },

  modeSubtitle: {
    color: COLORS.muted,
    fontSize: 9.5,
    lineHeight: 14,
    marginTop: 3,
  },

  modeSubtitleSelected: {
    color: '#C5CDD8',
  },

  radio: {
    width: 21,
    height: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#B6AC9D',
    borderRadius: 11,
  },

  radioSelected: {
    borderColor:
      COLORS.gold,
  },

  radioDot: {
    width: 9,
    height: 9,
    backgroundColor:
      COLORS.gold,
    borderRadius: 5,
  },

  modeItems: {
    marginTop: 12,
  },

  modeItem: {
    color: '#605A53',
    fontSize: 9.5,
    lineHeight: 16,
    marginBottom: 3,
  },

  modeItemSelected: {
    color: '#D9D0C2',
  },

  preferencesCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 19,
    paddingHorizontal: 14,
    marginTop: 12,
  },

  preferenceRow: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor:
      COLORS.border,
    paddingVertical: 12,
  },

  preferenceRowDisabled: {
    opacity: 0.48,
  },

  preferenceTextWrap: {
    flex: 1,
    marginRight: 12,
  },

  preferenceTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
  },

  preferenceSubtitle: {
    color: COLORS.muted,
    fontSize: 9.5,
    lineHeight: 15,
    marginTop: 4,
  },

  coverageCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 19,
    padding: 14,
    marginTop: 12,
  },

  coverageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 43,
  },

  coverageIcon: {
    width: 32,
    color: '#9A7335',
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },

  coverageText: {
    flex: 1,
    color: '#555B63',
    fontSize: 10,
    lineHeight: 15,
    marginLeft: 9,
  },

  noticeCard: {
    backgroundColor: '#E8EDF3',
    borderRadius: 17,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 20,
  },

  noticeTitle: {
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: '900',
  },

  noticeText: {
    color: '#5F6875',
    fontSize: 9.5,
    lineHeight: 15,
    marginTop: 5,
  },

  resetButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    backgroundColor: '#EEE5D7',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 13,
  },

  resetButtonText: {
    color: '#775A2F',
    fontSize: 10,
    fontWeight: '900',
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
