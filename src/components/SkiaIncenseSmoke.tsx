import React, {useEffect, useRef} from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';

import {
  BlurMask,
  Canvas,
  Path as SkiaPath,
  Skia,
} from '@shopify/react-native-skia';

type SmokeRibbonProps = {
  delay: number;
  duration: number;
  startX: number;
  sway: number;
  width: number;
  height: number;
  opacity: number;
  variant: 0 | 1 | 2 | 3;
  windX: Animated.Value;
};

function createSmokePath(
  width: number,
  height: number,
  variant: 0 | 1 | 2 | 3,
) {
  const path = Skia.Path.Make();
  const centerX = width / 2;
  const bottomY = height - 8;

  path.moveTo(centerX, bottomY);

  if (variant === 0) {
    path.cubicTo(
      centerX - width * 0.28,
      height * 0.78,
      centerX + width * 0.32,
      height * 0.64,
      centerX - width * 0.10,
      height * 0.49,
    );

    path.cubicTo(
      centerX - width * 0.42,
      height * 0.34,
      centerX + width * 0.30,
      height * 0.22,
      centerX + width * 0.04,
      8,
    );
  } else if (variant === 1) {
    path.cubicTo(
      centerX + width * 0.34,
      height * 0.78,
      centerX - width * 0.42,
      height * 0.64,
      centerX + width * 0.10,
      height * 0.48,
    );

    path.cubicTo(
      centerX + width * 0.44,
      height * 0.34,
      centerX - width * 0.34,
      height * 0.20,
      centerX - width * 0.04,
      8,
    );
  } else if (variant === 2) {
    path.cubicTo(
      centerX - width * 0.18,
      height * 0.82,
      centerX + width * 0.38,
      height * 0.68,
      centerX + width * 0.02,
      height * 0.52,
    );

    path.cubicTo(
      centerX - width * 0.46,
      height * 0.38,
      centerX + width * 0.42,
      height * 0.24,
      centerX - width * 0.08,
      8,
    );
  } else {
    path.cubicTo(
      centerX + width * 0.20,
      height * 0.82,
      centerX - width * 0.36,
      height * 0.67,
      centerX - width * 0.02,
      height * 0.52,
    );

    path.cubicTo(
      centerX + width * 0.48,
      height * 0.37,
      centerX - width * 0.40,
      height * 0.22,
      centerX + width * 0.08,
      8,
    );
  }

  return path;
}

function SmokeRibbon({
  delay,
  duration,
  startX,
  sway,
  width,
  height,
  opacity,
  variant,
  windX,
}: SmokeRibbonProps) {
  const progress = useRef(new Animated.Value(0)).current;

  const smokePath = useRef(
    createSmokePath(width, height, variant),
  ).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(progress, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [delay, duration, progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 0.22, 0.48, 0.74, 1],
    outputRange: [28, -24, -104, -198, -310],
  });

  const localSway = progress.interpolate({
    inputRange: [0, 0.18, 0.38, 0.58, 0.78, 1],
    outputRange: [
      0,
      sway * 0.62,
      -sway * 0.82,
      sway,
      -sway * 0.70,
      sway * 0.36,
    ],
  });

  const translateX = Animated.add(windX, localSway);

  const smokeOpacity = progress.interpolate({
    inputRange: [0, 0.08, 0.24, 0.58, 0.82, 1],
    outputRange: [
      0,
      opacity,
      opacity * 0.96,
      opacity * 0.72,
      opacity * 0.34,
      0,
    ],
  });

  const scaleX = progress.interpolate({
    inputRange: [0, 0.42, 0.74, 1],
    outputRange: [0.56, 0.84, 1.10, 1.38],
  });

  const scaleY = progress.interpolate({
    inputRange: [0, 0.42, 0.74, 1],
    outputRange: [0.78, 1, 1.18, 1.34],
  });

  const rotate = progress.interpolate({
    inputRange: [0, 0.30, 0.62, 1],
    outputRange:
      variant % 2 === 0
        ? ['-3deg', '5deg', '-7deg', '4deg']
        : ['3deg', '-5deg', '7deg', '-4deg'],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.smokeRibbon,
        {
          left: startX,
          width,
          height,
          opacity: smokeOpacity,
          transform: [
            {translateX},
            {translateY},
            {scaleX},
            {scaleY},
            {rotate},
          ],
        },
      ]}>
      <Canvas style={styles.canvas}>
        <SkiaPath
          path={smokePath}
          style="stroke"
          strokeWidth={18}
          strokeCap="round"
          strokeJoin="round"
          color="rgba(238, 243, 244, 0.16)">
          <BlurMask blur={13} style="normal" />
        </SkiaPath>

        <SkiaPath
          path={smokePath}
          style="stroke"
          strokeWidth={8}
          strokeCap="round"
          strokeJoin="round"
          color="rgba(248, 251, 251, 0.28)">
          <BlurMask blur={5} style="normal" />
        </SkiaPath>

        <SkiaPath
          path={smokePath}
          style="stroke"
          strokeWidth={2.8}
          strokeCap="round"
          strokeJoin="round"
          color="rgba(255, 255, 255, 0.38)">
          <BlurMask blur={1.4} style="normal" />
        </SkiaPath>
      </Canvas>
    </Animated.View>
  );
}

export default function SkiaIncenseSmoke() {
  const windX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let stopped = false;
    let currentAnimation: Animated.CompositeAnimation | undefined;

    const animateWind = () => {
      if (stopped) {
        return;
      }

      const nextWind = Math.round(Math.random() * 46 - 23);
      const duration = Math.round(1800 + Math.random() * 2600);

      currentAnimation = Animated.timing(windX, {
        toValue: nextWind,
        duration,
        useNativeDriver: true,
      });

      currentAnimation.start(({finished}) => {
        if (finished && !stopped) {
          animateWind();
        }
      });
    };

    animateWind();

    return () => {
      stopped = true;
      currentAnimation?.stop();
      windX.stopAnimation();
      windX.setValue(0);
    };
  }, [windX]);

  return (
    <View pointerEvents="none" style={styles.container}>
      <SmokeRibbon
        delay={0}
        duration={5100}
        startX={61}
        sway={22}
        width={58}
        height={245}
        opacity={0.90}
        variant={0}
        windX={windX}
      />

      <SmokeRibbon
        delay={700}
        duration={5650}
        startX={74}
        sway={28}
        width={66}
        height={270}
        opacity={0.78}
        variant={1}
        windX={windX}
      />

      <SmokeRibbon
        delay={1450}
        duration={4950}
        startX={47}
        sway={18}
        width={54}
        height={230}
        opacity={0.70}
        variant={2}
        windX={windX}
      />

      <SmokeRibbon
        delay={2200}
        duration={6100}
        startX={86}
        sway={31}
        width={70}
        height={286}
        opacity={0.62}
        variant={3}
        windX={windX}
      />

      <SmokeRibbon
        delay={3050}
        duration={5400}
        startX={58}
        sway={25}
        width={60}
        height={252}
        opacity={0.66}
        variant={1}
        windX={windX}
      />

      <View style={styles.baseGlow} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: 220,
    height: 390,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
  },

  smokeRibbon: {
    position: 'absolute',
    bottom: 0,
  },

  canvas: {
    flex: 1,
  },

  baseGlow: {
    position: 'absolute',
    bottom: 0,
    width: 50,
    height: 24,
    backgroundColor: 'rgba(255, 190, 95, 0.15)',
    borderRadius: 25,
  },
});
