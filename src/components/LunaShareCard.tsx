import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type {
  LunaShareImageParams,
} from '../types/lunaShare';

import TarotCardImage
  from './TarotCardImage';

type Props = {
  data: LunaShareImageParams;
};

function getVariantTheme(
  variant: LunaShareImageParams['variant'],
) {
  switch (variant) {
    case 'love':
      return {
        accent: '#E8A5C3',
        accent2: '#B7477C',
        label: 'LOVE',
        icon: '♡',
      };

    case 'forecast':
      return {
        accent: '#D9B76E',
        accent2: '#9A7939',
        label: 'FORECAST',
        icon: '♃',
      };

    case 'moon':
      return {
        accent: '#C9BFEA',
        accent2: '#6E4DA8',
        label: 'MOON',
        icon: '☾',
      };

    case 'achievement':
      return {
        accent: '#F2D38A',
        accent2: '#B8872E',
        label: 'ACHIEVEMENT',
        icon: '🏆',
      };

    case 'affirmation':
      return {
        accent: '#D7C9FF',
        accent2: '#6E4DA8',
        label: 'AFFIRMATION',
        icon: '✦',
      };

    case 'tarot':
      return {
        accent: '#D9B76E',
        accent2: '#6E4DA8',
        label: 'TAROT',
        icon: '✦',
      };

    case 'dailyInsight':
    default:
      return {
        accent: '#D9B76E',
        accent2: '#6E4DA8',
        label: 'DAILY INSIGHT',
        icon: '☉',
      };
  }
}

export default function LunaShareCard({
  data,
}: Props) {
  const theme =
    getVariantTheme(
      data.variant,
    );

  return (
    <View
      collapsable={false}
      style={styles.card}>
      <View
        style={[
          styles.glowOne,
          {
            backgroundColor:
              theme.accent,
          },
        ]}
      />

      <View
        style={[
          styles.glowTwo,
          {
            backgroundColor:
              theme.accent2,
          },
        ]}
      />

      <View style={styles.border}>
        <View style={styles.topRow}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>
              ☾
            </Text>
          </View>

          <View style={styles.brandWrap}>
            <Text style={styles.brand}>
              LUNA ORACLE
            </Text>

            <Text style={styles.date}>
              {data.dateText ??
                new Date().toLocaleDateString()}
            </Text>
          </View>

          <View
            style={[
              styles.variantPill,
              {
                borderColor:
                  theme.accent,
              },
            ]}>
            <Text
              style={[
                styles.variantText,
                {
                  color:
                    theme.accent,
                },
              ]}>
              {data.badge ??
                theme.label}
            </Text>
          </View>
        </View>

        <View style={styles.heroArea}>
          <Text
            style={[
              styles.heroIcon,
              {
                color:
                  theme.accent,
              },
            ]}>
            {theme.icon}
          </Text>

          {typeof data.score ===
          'number' ? (
            <View style={styles.scoreOrb}>
              <Text style={styles.scoreText}>
                {data.score}
              </Text>

              <Text style={styles.scoreLabel}>
                ENERGY
              </Text>
            </View>
          ) : null}

          {data.cardId ? (
            <View style={styles.tarotPreview}>
              <TarotCardImage
                cardId={data.cardId}
                title={
                  data.cardName ??
                  data.title
                }
                reversed={
                  data.reversed
                }
                width={92}
                height={146}
              />
            </View>
          ) : null}
        </View>

        <Text style={styles.title}>
          {data.title}
        </Text>

        {data.subtitle ? (
          <Text style={styles.subtitle}>
            {data.subtitle}
          </Text>
        ) : null}

        <View
          style={[
            styles.messageBox,
            {
              borderColor:
                theme.accent,
            },
          ]}>
          <Text style={styles.quoteMark}>
            “
          </Text>

          <Text style={styles.message}>
            {data.message}
          </Text>
        </View>

        {data.tags &&
        data.tags.length > 0 ? (
          <View style={styles.tagRow}>
            {data.tags
              .slice(0, 4)
              .map(tag => (
                <View
                  key={tag}
                  style={[
                    styles.tag,
                    {
                      backgroundColor:
                        `${theme.accent}22`,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.tagText,
                      {
                        color:
                          theme.accent,
                      },
                    ]}>
                    #{tag}
                  </Text>
                </View>
              ))}
          </View>
        ) : null}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {data.footer ??
              'Made with Luna Oracle'}
          </Text>

          <Text
            style={[
              styles.footerMoon,
              {
                color:
                  theme.accent,
              },
            ]}>
            ☾ ✦ ☽
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    width: 360,
    minHeight: 540,
    backgroundColor: '#120B22',
    borderRadius: 32,
  },

  border: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(217,183,110,0.55)',
    borderRadius: 30,
    margin: 12,
    padding: 18,
  },

  glowOne: {
    position: 'absolute',
    right: -80,
    top: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.22,
  },

  glowTwo: {
    position: 'absolute',
    left: -90,
    bottom: -70,
    width: 240,
    height: 240,
    borderRadius: 120,
    opacity: 0.18,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(217,183,110,0.5)',
    borderRadius: 16,
  },

  logoText: {
    color: '#F8EBCB',
    fontSize: 25,
    fontWeight: '900',
  },

  brandWrap: {
    flex: 1,
    marginLeft: 12,
  },

  brand: {
    color: '#F8EBCB',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  date: {
    color: '#BEB3DD',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 3,
  },

  variantPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  variantText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  heroArea: {
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  heroIcon: {
    position: 'absolute',
    fontSize: 92,
    fontWeight: '900',
    opacity: 0.18,
  },

  scoreOrb: {
    width: 126,
    height: 126,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(248,235,203,0.28)',
    borderRadius: 63,
  },

  scoreText: {
    color: '#FFF8EA',
    fontSize: 48,
    fontWeight: '900',
  },

  scoreLabel: {
    color: '#D9B76E',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  tarotPreview: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 8,
  },

  title: {
    color: '#FFF8EA',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 10,
  },

  subtitle: {
    color: '#DCD2F3',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 8,
  },

  messageBox: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderLeftWidth: 3,
    borderRadius: 18,
    padding: 15,
    marginTop: 18,
  },

  quoteMark: {
    color: 'rgba(248,235,203,0.6)',
    fontSize: 34,
    lineHeight: 28,
    fontWeight: '900',
  },

  message: {
    color: '#F8EBCB',
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '700',
    marginTop: -6,
  },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 14,
  },

  tag: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginHorizontal: 3,
    marginBottom: 6,
  },

  tagText: {
    fontSize: 10,
    fontWeight: '900',
  },

  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 18,
  },

  footerText: {
    color: '#BEB3DD',
    fontSize: 10,
    fontWeight: '800',
  },

  footerMoon: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 3,
    marginTop: 6,
  },
});
