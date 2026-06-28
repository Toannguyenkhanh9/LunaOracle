import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useTranslation,
} from 'react-i18next';

import type {
  OracleGuide,
} from '../services/oracleGuides';

type Props = {
  guide: OracleGuide;
  unlocked: boolean;
  active: boolean;
  onPress: () => void;
};

export default function OracleGuideCard({
  guide,
  unlocked,
  active,
  onPress,
}: Props) {
  const {t} =
    useTranslation();

  return (
    <Pressable
      style={({pressed}) => [
        styles.card,
        {
          backgroundColor:
            guide.color,
          borderColor:
            active
              ? guide.accent
              : 'rgba(255,255,255,0.12)',
        },
        pressed &&
          styles.pressed,
      ]}
      onPress={onPress}>
      <View
        style={[
          styles.iconOrb,
          {
            borderColor:
              guide.accent,
          },
        ]}>
        <Text
          style={[
            styles.icon,
            {
              color:
                guide.accent,
            },
          ]}>
          {guide.icon}
        </Text>
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>
          {t(guide.titleKey, {
            defaultValue:
              guide.titleFallback,
          })}
        </Text>

        <Text style={styles.description}>
          {t(guide.descriptionKey, {
            defaultValue:
              guide.descriptionFallback,
          })}
        </Text>

        <Text
          style={[
            styles.tone,
            {
              color:
                guide.accent,
            },
          ]}>
          {t(guide.toneKey, {
            defaultValue:
              guide.toneFallback,
          })}
        </Text>
      </View>

      <Text
        style={[
          styles.status,
          {
            color:
              guide.accent,
          },
        ]}>
        {active
          ? t(
              'oracleGuides.active',
              {
                defaultValue:
                  'ACTIVE',
              },
            )
          : unlocked
            ? t(
                'oracleGuides.equip',
                {
                  defaultValue:
                    'EQUIP',
                },
              )
            : `${guide.cost} ✦`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 24,
    padding: 14,
    marginBottom: 12,
  },

  iconOrb: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 13,
  },

  icon: {
    fontSize: 26,
    fontWeight: '900',
  },

  copy: {
    flex: 1,
  },

  title: {
    color: '#FFF8EA',
    fontSize: 16,
    fontWeight: '900',
  },

  description: {
    color: '#DCD2F3',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  tone: {
    fontSize: 10,
    fontWeight: '900',
    marginTop: 7,
    textTransform: 'uppercase',
  },

  status: {
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 10,
  },

  pressed: {
    opacity: 0.76,
  },
});
