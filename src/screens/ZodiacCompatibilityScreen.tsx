import React, {
  useMemo,
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
  useTranslation,
} from 'react-i18next';

import {
  ZODIAC_SIGNS,
  type ZodiacElement,
  type ZodiacSignId,
} from '../services/zodiac';

import {
  buildZodiacCompatibility,
  type CompatibilityMode,
} from '../services/zodiacCompatibility';

import {
  translateCompatibilityHeadline,
  translateZodiacProfileText,
} from '../utils/lunaContentLocalization';

const SIGN_IDS =
  Object.keys(
    ZODIAC_SIGNS,
  ) as ZodiacSignId[];

const MODES: CompatibilityMode[] = [
  'love',
  'friendship',
  'career',
];

const FRIENDLY_ELEMENTS: Record<
  ZodiacElement,
  ZodiacElement[]
> = {
  fire: ['air', 'fire'],
  air: ['fire', 'air'],
  earth: ['water', 'earth'],
  water: ['earth', 'water'],
};

function getElementFlowKind(
  first: ZodiacElement,
  second: ZodiacElement,
): 'same' | 'friendly' | 'different' {
  if (first === second) {
    return 'same';
  }

  if (
    FRIENDLY_ELEMENTS[first].includes(
      second,
    )
  ) {
    return 'friendly';
  }

  return 'different';
}

function SignPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ZodiacSignId;
  onChange: (
    sign: ZodiacSignId,
  ) => void;
}) {
  const {t} =
    useTranslation();

  return (
    <View style={styles.pickerBlock}>
      <Text style={styles.pickerLabel}>
        {label}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}>
        {SIGN_IDS.map(sign => {
          const item =
            ZODIAC_SIGNS[sign];

          const selected =
            sign === value;

          return (
            <Pressable
              key={sign}
              style={[
                styles.signChip,
                selected &&
                  styles.signChipSelected,
              ]}
              onPress={() =>
                onChange(sign)
              }>
              <Text
                style={[
                  styles.signSymbol,
                  selected &&
                    styles.signSelectedText,
                ]}>
                {item.symbol}
              </Text>

              <Text
                style={[
                  styles.signLabel,
                  selected &&
                    styles.signSelectedText,
                ]}
                numberOfLines={1}>
                {t(
                  `western.signs.${sign}`,
                  {
                    defaultValue:
                      sign,
                  },
                )}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default function ZodiacCompatibilityScreen() {
  const {t} =
    useTranslation();

  const [firstSign, setFirstSign] =
    useState<ZodiacSignId>('aries');

  const [secondSign, setSecondSign] =
    useState<ZodiacSignId>('leo');

  const [mode, setMode] =
    useState<CompatibilityMode>('love');

  const result =
    useMemo(
      () =>
        buildZodiacCompatibility(
          firstSign,
          secondSign,
          mode,
        ),
      [
        firstSign,
        secondSign,
        mode,
      ],
    );

  const first =
    ZODIAC_SIGNS[firstSign];

  const second =
    ZODIAC_SIGNS[secondSign];

  const firstName =
    t(
      `western.signs.${firstSign}`,
      {
        defaultValue:
          firstSign,
      },
    );

  const secondName =
    t(
      `western.signs.${secondSign}`,
      {
        defaultValue:
          secondSign,
      },
    );

  const firstElement =
    t(
      `western.elements.${first.element}`,
      {
        defaultValue:
          first.element,
      },
    );

  const secondElement =
    t(
      `western.elements.${second.element}`,
      {
        defaultValue:
          second.element,
      },
    );

  const firstModality =
    t(
      `western.modalities.${first.modality}`,
      {
        defaultValue:
          first.modality,
      },
    );

  const secondModality =
    t(
      `western.modalities.${second.modality}`,
      {
        defaultValue:
          second.modality,
      },
    );

  const firstLoveStyle =
    translateZodiacProfileText(
      t,
      firstSign,
      'loveStyle',
      first.loveStyle,
    );

  const secondLoveStyle =
    translateZodiacProfileText(
      t,
      secondSign,
      'loveStyle',
      second.loveStyle,
    );

  const elementFlowKind =
    getElementFlowKind(
      first.element,
      second.element,
    );

  const modalityFlowKind =
    first.modality === second.modality
      ? 'same'
      : 'different';

  const communicationKind =
    first.element === second.element
      ? 'sameElement'
      : 'differentElement';

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'western.compatibility.eyebrow',
            {
              defaultValue:
                'Luna Oracle',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'western.compatibility.title',
            {
              defaultValue:
                'Zodiac Compatibility',
            },
          )}
        </Text>

        <View style={styles.modeRow}>
          {MODES.map(item => {
            const selected =
              item === mode;

            return (
              <Pressable
                key={item}
                style={[
                  styles.modeChip,
                  selected &&
                    styles.modeChipSelected,
                ]}
                onPress={() =>
                  setMode(item)
                }>
                <Text
                  style={[
                    styles.modeText,
                    selected &&
                      styles.modeTextSelected,
                  ]}>
                  {t(
                    `western.compatibility.modes.${item}`,
                    {
                      defaultValue:
                        item,
                    },
                  )}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <SignPicker
          label={t(
            'western.compatibility.firstSign',
            {
              defaultValue:
                'First Sign',
            },
          )}
          value={firstSign}
          onChange={setFirstSign}
        />

        <SignPicker
          label={t(
            'western.compatibility.secondSign',
            {
              defaultValue:
                'Second Sign',
            },
          )}
          value={secondSign}
          onChange={setSecondSign}
        />

        <View style={styles.resultCard}>
          <View style={styles.pairRow}>
            <Text style={styles.bigSign}>
              {first.symbol}
            </Text>

            <Text style={styles.pairPlus}>
              +
            </Text>

            <Text style={styles.bigSign}>
              {second.symbol}
            </Text>
          </View>

          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>
              {result.score}
            </Text>

            <Text style={styles.scoreLabel}>
              {t(
                'western.compatibility.score',
                {
                  defaultValue:
                    'score',
                },
              )}
            </Text>
          </View>

          <Text style={styles.resultLevel}>
            {t(
              `western.compatibility.levels.${result.level}`,
              {
                defaultValue:
                  result.level,
              },
            ).toUpperCase()}
          </Text>

          <Text style={styles.headline}>
            {translateCompatibilityHeadline(
              t,
              result.level,
              result.headline,
            )}
          </Text>

          <Text style={styles.summary}>
            {first.symbol} {firstName} + {second.symbol} {secondName}
          </Text>

          <Text style={styles.summary}>
            {t(
              'lunaCompatibility.summary',
              {
                firstSymbol:
                  first.symbol,
                firstSign:
                  firstName,
                secondSymbol:
                  second.symbol,
                secondSign:
                  secondName,
                defaultValue:
                  `${first.symbol} ${firstName} and ${second.symbol} ${secondName} can build connection through awareness of element, modality, and communication style.`,
              },
            )}
          </Text>
        </View>

        <InfoCard
          title={t(
            'western.compatibility.elementFlow',
            {
              defaultValue:
                'Element flow',
            },
          )}
          text={t(
            `lunaCompatibility.elementFlow.${elementFlowKind}`,
            {
              firstElement,
              secondElement,
              defaultValue:
                result.elementFlow,
            },
          )}
        />

        <InfoCard
          title={t(
            'western.compatibility.modalityRhythm',
            {
              defaultValue:
                'Modality rhythm',
            },
          )}
          text={t(
            `lunaCompatibility.modalityFlow.${modalityFlowKind}`,
            {
              firstModality,
              secondModality,
              defaultValue:
                result.modalityFlow,
            },
          )}
        />

        <InfoCard
          title={`${t(
            'lunaCompatibility.sections.loveRhythm.title',
            {
              defaultValue:
                'Love rhythm',
            },
          )} • ${Math.min(
            100,
            result.score + 2,
          )}`}
          text={t(
            'lunaCompatibility.sections.loveRhythm.text',
            {
              firstLoveStyle,
              secondLoveStyle,
              defaultValue:
                `${firstLoveStyle} ${secondLoveStyle} The relationship works best when affection is shown in ways both people can understand.`,
            },
          )}
        />

        <InfoCard
          title={`${t(
            'lunaCompatibility.sections.communication.title',
            {
              defaultValue:
                'Communication',
            },
          )} • ${Math.max(
            40,
            result.score - 4,
          )}`}
          text={t(
            `lunaCompatibility.sections.communication.${communicationKind}`,
            {
              defaultValue:
                communicationKind ===
                'sameElement'
                  ? 'The two signs often understand each other quickly, but they still need direct words instead of assumptions.'
                  : 'Different elements can create attraction, but clear language helps prevent misunderstanding.',
            },
          )}
        />

        <InfoCard
          title={`${t(
            'lunaCompatibility.sections.growthLesson.title',
            {
              defaultValue:
                'Growth lesson',
            },
          )} • ${result.score}`}
          text={t(
            'lunaCompatibility.sections.growthLesson.text',
            {
              defaultValue:
                'Use the score as a reflection tool, not a fixed verdict. Awareness, timing, honesty, and real actions matter more than sign matching.',
            },
          )}
        />

        <Text style={styles.disclaimer}>
          {t(
            'western.compatibility.disclaimer',
            {
              defaultValue:
                'This compatibility result is for reflection and entertainment. Real relationships depend on choices, communication, and care.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoTitle}>
        {title}
      </Text>

      <Text style={styles.infoText}>
        {text}
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
    fontSize: 28,
    fontWeight: '900',
    marginTop: 5,
  },
  modeRow: {
    flexDirection: 'row',
    backgroundColor: '#EEE6F4',
    borderRadius: 16,
    padding: 5,
    marginTop: 18,
  },
  modeChip: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 10,
  },
  modeChipSelected: {
    backgroundColor: COLORS.night,
  },
  modeText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
  modeTextSelected: {
    color: '#F8EBCB',
  },
  pickerBlock: {
    marginTop: 18,
  },
  pickerLabel: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 9,
  },
  signChip: {
    width: 78,
    minHeight: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    marginRight: 9,
  },
  signChipSelected: {
    backgroundColor: COLORS.night,
    borderColor: COLORS.gold,
  },
  signSymbol: {
    color: COLORS.purple,
    fontSize: 24,
    fontWeight: '900',
  },
  signLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'capitalize',
    marginTop: 5,
  },
  signSelectedText: {
    color: '#F8EBCB',
  },
  resultCard: {
    alignItems: 'center',
    backgroundColor: COLORS.night,
    borderRadius: 28,
    padding: 22,
    marginTop: 20,
  },
  pairRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bigSign: {
    color: COLORS.gold,
    fontSize: 48,
    fontWeight: '900',
  },
  pairPlus: {
    color: '#DCD2F3',
    fontSize: 28,
    fontWeight: '900',
    marginHorizontal: 16,
  },
  scoreCircle: {
    width: 94,
    height: 94,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(217,183,110,0.16)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 47,
    marginTop: 16,
  },
  scoreText: {
    color: '#F8EBCB',
    fontSize: 31,
    fontWeight: '900',
  },
  scoreLabel: {
    color: '#C9BFEA',
    fontSize: 10,
    fontWeight: '800',
  },
  resultLevel: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 14,
  },
  headline: {
    color: '#FFF8EA',
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 7,
  },
  summary: {
    color: '#DCD2F3',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 15,
    marginTop: 12,
  },
  infoTitle: {
    color: COLORS.purple,
    fontSize: 13,
    fontWeight: '900',
  },
  infoText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 6,
  },
  disclaimer: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 16,
  },
});
