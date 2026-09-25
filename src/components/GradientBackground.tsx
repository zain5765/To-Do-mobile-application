import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function useLoop(
  duration: number,
  delay = 0,
  easing: (value: number) => number = Easing.inOut(Easing.sin),
) {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    let timeout: ReturnType<typeof setTimeout>;

    const start = () => {
      value.setValue(0);
      animation = Animated.loop(
        Animated.timing(value, {
          toValue: 1,
          duration,
          easing,
          useNativeDriver: true,
        }),
      );
      animation.start();
    };

    if (delay > 0) {
      timeout = setTimeout(start, delay);
    } else {
      start();
    }

    return () => {
      clearTimeout(timeout);
      animation?.stop();
    };
  }, [value, duration, delay, easing]);

  return value;
}

function GlowOrb({
  style,
  haloStyle,
  driftX,
  driftY,
  duration,
  delay = 0,
  opacityMin,
  opacityMax,
}: {
  style: object | object[];
  haloStyle?: object | object[];
  driftX: number;
  driftY: number;
  duration: number;
  delay?: number;
  opacityMin: number;
  opacityMax: number;
}) {
  const progress = useLoop(duration, delay);
  const breathe = useLoop(duration * 1.4, delay + 200);

  const translateX = progress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, driftX, driftX * 0.4, -driftX * 0.6, 0],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -driftY * 0.5, driftY, driftY * 0.3, 0],
  });
  const scale = breathe.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.92, 1.1, 0.92],
  });
  const opacity = breathe.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [opacityMin, opacityMax, opacityMin],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        width: '100%',
        height: '100%',
        opacity,
        transform: [{ translateX }, { translateY }, { scale }],
      }}>
      {haloStyle ? <View style={haloStyle} /> : null}
      <View style={style} />
    </Animated.View>
  );
}

function AuroraWave({
  top,
  color,
  width,
  height,
  duration,
  delay,
  drift,
}: {
  top: number | `${number}%`;
  color: string;
  width: number;
  height: number;
  duration: number;
  delay: number;
  drift: number;
}) {
  const wave = useLoop(duration, delay, Easing.inOut(Easing.quad));
  const fade = useLoop(duration * 1.6, delay + 300);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top,
        left: '50%',
        width,
        height,
        marginLeft: -width / 2,
        borderRadius: height / 2,
        backgroundColor: color,
        opacity: fade.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.18, 0.42, 0.18],
        }),
        transform: [
          {
            translateX: wave.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [-drift, drift, -drift],
            }),
          },
          { scaleX: 1.2 },
          { scaleY: 0.55 },
        ],
      }}
    />
  );
}

function OrbitRing({
  size,
  top,
  left,
  borderColor,
  duration,
  delay,
  reverse = false,
}: {
  size: number;
  top: number | `${number}%`;
  left: number | `${number}%`;
  borderColor: string;
  duration: number;
  delay: number;
  reverse?: boolean;
}) {
  const spin = useLoop(duration, delay, Easing.linear);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor,
        opacity: 0.35,
        transform: [
          {
            rotate: spin.interpolate({
              inputRange: [0, 1],
              outputRange: reverse ? ['360deg', '0deg'] : ['0deg', '360deg'],
            }),
          },
        ],
      }}
    />
  );
}

function PulseRing({
  size,
  top,
  left,
  color,
  duration,
  delay,
}: {
  size: number;
  top: number | `${number}%`;
  left: number | `${number}%`;
  color: string;
  duration: number;
  delay: number;
}) {
  const pulse = useLoop(duration, delay, Easing.out(Easing.quad));

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: color,
        opacity: pulse.interpolate({
          inputRange: [0, 0.7, 1],
          outputRange: [0.45, 0.08, 0],
        }),
        transform: [
          {
            scale: pulse.interpolate({
              inputRange: [0, 1],
              outputRange: [0.55, 1.35],
            }),
          },
        ],
      }}
    />
  );
}

function FloatingParticle({
  left,
  top,
  size,
  color,
  duration,
  delay,
  driftX = 18,
  driftY = -32,
}: {
  left: number | `${number}%`;
  top: number | `${number}%`;
  size: number;
  color: string;
  duration: number;
  delay: number;
  driftX?: number;
  driftY?: number;
}) {
  const travel = useLoop(duration, delay);
  const twinkle = useLoop(duration * 0.7, delay + 100);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left,
        top,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: twinkle.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.15, 0.65, 0.15],
        }),
        transform: [
          {
            translateX: travel.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, driftX, 0],
            }),
          },
          {
            translateY: travel.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, driftY, 0],
            }),
          },
          {
            scale: twinkle.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.75, 1.25, 0.75],
            }),
          },
        ],
      }}>
      <View
        style={{
          position: 'absolute',
          width: size * 3,
          height: size * 3,
          borderRadius: size * 1.5,
          backgroundColor: color,
          opacity: 0.15,
        }}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        }}
      />
    </Animated.View>
  );
}

export default function GradientBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  const anim = colors.animation;
  const shimmer = useLoop(4800, 0, Easing.inOut(Easing.sin));

  return (
    <View style={{ flex: 1, backgroundColor: anim.bg }}>
      <View pointerEvents="none" style={styles.backgroundLayer}>
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: anim.bg }]} />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: anim.bgDeep, opacity: 0.1 },
          ]}
        />

        <AuroraWave
          top="8%"
          color={anim.purple}
          width={320}
          height={140}
          duration={5200}
          delay={0}
          drift={55}
        />
        <AuroraWave
          top="52%"
          color={anim.cyan}
          width={280}
          height={120}
          duration={4600}
          delay={600}
          drift={45}
        />
        <AuroraWave
          top="78%"
          color={anim.pink}
          width={300}
          height={130}
          duration={5000}
          delay={300}
          drift={40}
        />

        <View style={styles.glowPinkWrap}>
          <GlowOrb
            style={[orbBase, styles.orbCorePink]}
            haloStyle={[
              orbBase,
              styles.orbHalo,
              { width: 200, height: 200, top: -40, left: -40, backgroundColor: anim.pink },
            ]}
            driftX={48}
            driftY={38}
            duration={3800}
            opacityMin={0.5}
            opacityMax={0.85}
          />
        </View>
        <View style={styles.glowCyanWrap}>
          <GlowOrb
            style={[orbBase, styles.orbCoreCyan]}
            haloStyle={[
              orbBase,
              styles.orbHalo,
              { width: 170, height: 170, top: -35, left: -35, backgroundColor: anim.cyan },
            ]}
            driftX={-44}
            driftY={42}
            duration={4200}
            delay={400}
            opacityMin={0.45}
            opacityMax={0.8}
          />
        </View>
        <View style={styles.glowPurpleWrap}>
          <GlowOrb
            style={[orbBase, styles.orbCorePurple]}
            haloStyle={[
              orbBase,
              styles.orbHalo,
              { width: 150, height: 150, top: -30, left: -30, backgroundColor: anim.purple },
            ]}
            driftX={36}
            driftY={-40}
            duration={4500}
            delay={800}
            opacityMin={0.4}
            opacityMax={0.75}
          />
        </View>

        <OrbitRing
          size={220}
          top="22%"
          left="78%"
          borderColor="rgba(192, 132, 252, 0.35)"
          duration={14000}
          delay={0}
        />
        <OrbitRing
          size={180}
          top="65%"
          left="18%"
          borderColor="rgba(56, 189, 248, 0.3)"
          duration={11000}
          delay={500}
          reverse
        />

        <PulseRing
          size={100}
          top="30%"
          left="20%"
          color="rgba(192, 132, 252, 0.5)"
          duration={2800}
          delay={0}
        />
        <PulseRing
          size={90}
          top="72%"
          left="75%"
          color="rgba(56, 189, 248, 0.45)"
          duration={3200}
          delay={900}
        />
        <PulseRing
          size={80}
          top="48%"
          left="55%"
          color="rgba(232, 121, 249, 0.4)"
          duration={2600}
          delay={450}
        />

        <FloatingParticle
          left="12%"
          top="16%"
          size={5}
          color="#c084fc"
          duration={2200}
          delay={0}
          driftX={22}
          driftY={-28}
        />
        <FloatingParticle
          left="84%"
          top="24%"
          size={4}
          color="#38bdf8"
          duration={2400}
          delay={300}
          driftX={-20}
          driftY={-34}
        />
        <FloatingParticle
          left="70%"
          top="58%"
          size={6}
          color="#a78bfa"
          duration={2100}
          delay={150}
          driftX={16}
          driftY={-26}
        />
        <FloatingParticle
          left="26%"
          top="68%"
          size={4}
          color="#67e8f9"
          duration={2000}
          delay={500}
          driftX={-18}
          driftY={-30}
        />
        <FloatingParticle
          left="50%"
          top="42%"
          size={5}
          color="#e879f9"
          duration={2300}
          delay={700}
          driftX={14}
          driftY={-22}
        />
        <FloatingParticle
          left="38%"
          top="28%"
          size={3}
          color="#818cf8"
          duration={1900}
          delay={250}
          driftX={12}
          driftY={-18}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            styles.shimmerBand,
            { backgroundColor: anim.shimmer },
            {
              opacity: shimmer.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.03, 0.1, 0.03],
              }),
              transform: [
                { rotate: '-12deg' },
                {
                  translateX: shimmer.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-80, 80],
                  }),
                },
                {
                  scaleY: shimmer.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.9, 1.1, 0.9],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const orbBase = {
  position: 'absolute' as const,
  borderRadius: 999,
};

const styles = StyleSheet.create({
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  glowPinkWrap: {
    position: 'absolute',
    top: -70,
    right: -30,
    width: 140,
    height: 140,
  },
  glowCyanWrap: {
    position: 'absolute',
    top: 120,
    left: -50,
    width: 120,
    height: 120,
  },
  glowPurpleWrap: {
    position: 'absolute',
    top: '36%',
    right: -20,
    width: 110,
    height: 110,
  },
  orbHalo: {
    position: 'absolute',
    borderRadius: 999,
  },
  orbCorePink: {
    top: 10,
    left: 10,
    width: 120,
    height: 120,
    backgroundColor: 'rgba(232, 121, 249, 0.22)',
  },
  orbCoreCyan: {
    top: 8,
    left: 8,
    width: 100,
    height: 100,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
  },
  orbCorePurple: {
    top: 6,
    left: 6,
    width: 90,
    height: 90,
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
  },
  shimmerBand: {
    position: 'absolute',
    top: '32%',
    left: -120,
    width: '160%',
    height: 200,
    borderRadius: 100,
  },
});
