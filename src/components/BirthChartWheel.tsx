import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  CHART_POINT_ORDER,
  getChartPointLabel,
  getZodiacSymbol,
  type BirthChartResult,
  type ChartPoint,
} from '../services/astroBirthChart';

type Props = {
  chart: BirthChartResult;
  size?: number;
};

const PLANET_GLYPHS:
  Record<string, string> = {
    sun: '☉',
    moon: '☾',
    mercury: '☿',
    venus: '♀',
    mars: '♂',
    jupiter: '♃',
    saturn: '♄',
    uranus: '♅',
    neptune: '♆',
    pluto: '♇',
    ascendant: 'AC',
    midheaven: 'MC',
  };

const SIGN_ORDER = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
] as const;

function degToRad(
  degrees: number,
): number {
  return (
    (
      degrees - 90
    ) *
    Math.PI
  ) / 180;
}

function polarPoint(
  center: number,
  radius: number,
  degree: number,
) {
  const rad =
    degToRad(degree);

  return {
    x:
      center +
      Math.cos(rad) * radius,
    y:
      center +
      Math.sin(rad) * radius,
  };
}

function Line({
  x1,
  y1,
  x2,
  y2,
  color,
  width = 1,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  width?: number;
}) {
  const length =
    Math.hypot(
      x2 - x1,
      y2 - y1,
    );

  const angle =
    Math.atan2(
      y2 - y1,
      x2 - x1,
    ) *
    180 /
    Math.PI;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.line,
        {
          left:
            (
              x1 + x2
            ) /
              2 -
            length / 2,
          top:
            (
              y1 + y2
            ) /
              2 -
            width / 2,
          width:
            length,
          height:
            width,
          backgroundColor:
            color,
          transform: [
            {
              rotate:
                `${angle}deg`,
            },
          ],
        },
      ]}
    />
  );
}

export default function BirthChartWheel({
  chart,
  size = 320,
}: Props) {
  const center =
    size / 2;

  const outerRadius =
    size / 2 - 10;

  const signRadius =
    outerRadius - 22;

  const planetRadius =
    outerRadius - 72;

  const ascendant =
    chart.points.ascendant.longitude;

  return (
    <View
      style={[
        styles.container,
        {
          width:
            size,
          height:
            size,
          borderRadius:
            size / 2,
        },
      ]}>
      <View
        style={[
          styles.outerCircle,
          {
            width:
              size,
            height:
              size,
            borderRadius:
              size / 2,
          },
        ]}
      />

      <View
        style={[
          styles.innerCircle,
          {
            left:
              center - planetRadius,
            top:
              center - planetRadius,
            width:
              planetRadius * 2,
            height:
              planetRadius * 2,
            borderRadius:
              planetRadius,
          },
        ]}
      />

      {SIGN_ORDER.map(
        (
          sign,
          index,
        ) => {
          const degree =
            index * 30 +
            15;

          const point =
            polarPoint(
              center,
              signRadius,
              degree,
            );

          return (
            <Text
              key={sign}
              style={[
                styles.signGlyph,
                {
                  left:
                    point.x - 13,
                  top:
                    point.y - 13,
                },
              ]}>
              {getZodiacSymbol(
                sign,
              )}
            </Text>
          );
        },
      )}

      {Array.from(
        {
          length: 12,
        },
        (_, index) => {
          const degree =
            ascendant +
            index * 30;

          const end =
            polarPoint(
              center,
              outerRadius,
              degree,
            );

          return (
            <Line
              key={`house-${index}`}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              color="rgba(217,183,110,0.32)"
              width={1}
            />
          );
        },
      )}

      {chart.aspects
        .slice(0, 16)
        .map(aspect => {
          const first =
            chart.points[
              aspect.first
            ];

          const second =
            chart.points[
              aspect.second
            ];

          const firstPoint =
            polarPoint(
              center,
              planetRadius - 8,
              first.longitude,
            );

          const secondPoint =
            polarPoint(
              center,
              planetRadius - 8,
              second.longitude,
            );

          const color =
            aspect.type === 'trine' ||
            aspect.type === 'sextile'
              ? 'rgba(110,170,132,0.42)'
              : aspect.type === 'square' ||
                  aspect.type === 'opposition'
                ? 'rgba(190,85,95,0.42)'
                : 'rgba(217,183,110,0.42)';

          return (
            <Line
              key={`${aspect.first}-${aspect.second}-${aspect.type}`}
              x1={firstPoint.x}
              y1={firstPoint.y}
              x2={secondPoint.x}
              y2={secondPoint.y}
              color={color}
              width={1.4}
            />
          );
        })}

      {CHART_POINT_ORDER.map(
        (
          pointId,
          index,
        ) => {
          const point:
            ChartPoint =
            chart.points[pointId];

          const degreeOffset =
            index * 2.3;

          const p =
            polarPoint(
              center,
              planetRadius,
              point.longitude +
                degreeOffset,
            );

          return (
            <View
              key={pointId}
              style={[
                styles.planetBubble,
                {
                  left:
                    p.x - 15,
                  top:
                    p.y - 15,
                },
              ]}>
              <Text
                style={
                  styles.planetGlyph
                }>
                {PLANET_GLYPHS[
                  pointId
                ] ??
                  getChartPointLabel(
                    pointId,
                  ).slice(0, 2)}
              </Text>
            </View>
          );
        },
      )}

      <View style={styles.centerDot}>
        <Text style={styles.centerText}>
          LUNA
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: '#17122D',
    borderWidth: 1,
    borderColor: '#D9B76E',
  },

  outerCircle: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(217,183,110,0.8)',
  },

  innerCircle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },

  line: {
    position: 'absolute',
  },

  signGlyph: {
    position: 'absolute',
    width: 26,
    height: 26,
    color: '#F7D98D',
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'center',
  },

  planetBubble: {
    position: 'absolute',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8EA',
    borderWidth: 1,
    borderColor: '#D9B76E',
    borderRadius: 15,
  },

  planetGlyph: {
    color: '#1B1537',
    fontSize: 12,
    fontWeight: '900',
  },

  centerDot: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(217,183,110,0.16)',
    borderWidth: 1,
    borderColor: '#D9B76E',
    borderRadius: 29,
    marginLeft: -29,
    marginTop: -29,
  },

  centerText: {
    color: '#F8EBCB',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
