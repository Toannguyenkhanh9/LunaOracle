import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type {
  OracleShopItem,
} from '../services/oracleShop';

type Props = {
  item: OracleShopItem;
  unlocked: boolean;
  active: boolean;
};

export default function ThemePreviewCard({
  item,
  unlocked,
  active,
}: Props) {
  return (
    <View
      style={[
        styles.preview,
        {
          backgroundColor:
            item.colors.background,
          borderColor:
            active
              ? item.colors.accent
              : 'rgba(255,255,255,0.18)',
        },
      ]}>
      <View
        style={[
          styles.orb,
          {
            borderColor:
              item.colors.accent,
          },
        ]}>
        <Text
          style={[
            styles.orbText,
            {
              color:
                item.colors.accent,
            },
          ]}>
          ☾
        </Text>
      </View>

      <Text
        style={[
          styles.previewTitle,
          {
            color:
              item.colors.text,
          },
        ]}>
        {item.titleFallback}
      </Text>

      <View
        style={[
          styles.line,
          {
            backgroundColor:
              item.colors.accent,
          },
        ]}
      />

      <Text
        style={[
          styles.previewStatus,
          {
            color:
              item.colors.accent,
          },
        ]}>
        {active
          ? 'ACTIVE'
          : unlocked
            ? 'UNLOCKED'
            : `${item.cost} ✦`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  preview: {
    width: 86,
    height: 122,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 18,
    padding: 8,
  },

  orb: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 17,
  },

  orbText: {
    fontSize: 18,
    fontWeight: '900',
  },

  previewTitle: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 8,
  },

  line: {
    width: 34,
    height: 2,
    borderRadius: 99,
    marginTop: 8,
    opacity: 0.7,
  },

  previewStatus: {
    fontSize: 8,
    fontWeight: '900',
    marginTop: 7,
  },
});
