export type ThemeColors = {
  bg: string;
  bgDeep: string;
  surface: string;
  surfaceMuted: string;
  surfaceElevated: string;
  text: string;
  textMuted: string;
  textDim: string;
  primary: string;
  primaryDark: string;
  primaryHover: string;
  primaryLight: string;
  primaryBorder: string;
  primaryGradientStart: string;
  primaryGradientEnd: string;
  secondary: string;
  secondaryLight: string;
  success: string;
  successLight: string;
  danger: string;
  dangerLight: string;
  dangerBorder: string;
  dangerBg: string;
  border: string;
  borderLight: string;
  overlay: string;
  shadow: string;
  accentGlow: string;
  primaryGlow: string;
  onPrimary: string;
  animation: {
    bg: string;
    bgDeep: string;
    pink: string;
    cyan: string;
    purple: string;
    shimmer: string;
  };
  priority: {
    low: { bg: string; text: string; accent: string };
    medium: { bg: string; text: string; accent: string };
    high: { bg: string; text: string; accent: string };
  };
};

export const lightColors: ThemeColors = {
  bg: '#f6f7fb',
  bgDeep: '#eceff5',
  surface: '#ffffff',
  surfaceMuted: '#eef1f6',
  surfaceElevated: '#ffffff',
  text: '#111827',
  textMuted: '#6b7280',
  textDim: '#9ca3af',
  primary: '#4f6ef7',
  primaryDark: '#3b5bdb',
  primaryHover: '#4263eb',
  primaryLight: 'rgba(79, 110, 247, 0.1)',
  primaryBorder: 'rgba(79, 110, 247, 0.28)',
  primaryGradientStart: '#6b8cff',
  primaryGradientEnd: '#4f6ef7',
  secondary: '#0d9488',
  secondaryLight: 'rgba(13, 148, 136, 0.1)',
  success: '#059669',
  successLight: 'rgba(5, 150, 105, 0.1)',
  danger: '#e11d48',
  dangerLight: 'rgba(225, 29, 72, 0.08)',
  dangerBorder: 'rgba(225, 29, 72, 0.22)',
  dangerBg: 'rgba(225, 29, 72, 0.06)',
  border: '#e5e7eb',
  borderLight: '#d1d5db',
  overlay: 'rgba(17, 24, 39, 0.4)',
  shadow: '#111827',
  accentGlow: 'rgba(13, 148, 136, 0.12)',
  primaryGlow: 'rgba(79, 110, 247, 0.14)',
  onPrimary: '#ffffff',
  animation: {
    bg: '#f0f2f8',
    bgDeep: '#e4e8f2',
    pink: 'rgba(232, 121, 249, 0.16)',
    cyan: 'rgba(56, 189, 248, 0.14)',
    purple: 'rgba(167, 139, 250, 0.14)',
    shimmer: 'rgba(99, 102, 241, 0.1)',
  },
  priority: {
    low: { bg: '#e0f2fe', text: '#0369a1', accent: '#0ea5e9' },
    medium: { bg: '#ede9fe', text: '#6d28d9', accent: '#8b5cf6' },
    high: { bg: '#ffe4e6', text: '#be123c', accent: '#e11d48' },
  },
};

export const darkColors: ThemeColors = {
  bg: '#0f1419',
  bgDeep: '#0a0e13',
  surface: '#1a2332',
  surfaceMuted: '#151d2b',
  surfaceElevated: '#212d3f',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  primary: '#6b8cff',
  primaryDark: '#4f6ef7',
  primaryHover: '#5b7cf5',
  primaryLight: 'rgba(107, 140, 255, 0.15)',
  primaryBorder: 'rgba(107, 140, 255, 0.35)',
  primaryGradientStart: '#818cf8',
  primaryGradientEnd: '#6366f1',
  secondary: '#2dd4bf',
  secondaryLight: 'rgba(45, 212, 191, 0.12)',
  success: '#34d399',
  successLight: 'rgba(52, 211, 153, 0.12)',
  danger: '#fb7185',
  dangerLight: 'rgba(251, 113, 133, 0.12)',
  dangerBorder: 'rgba(251, 113, 133, 0.3)',
  dangerBg: 'rgba(251, 113, 133, 0.08)',
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.12)',
  overlay: 'rgba(0, 0, 0, 0.6)',
  shadow: '#000000',
  accentGlow: 'rgba(45, 212, 191, 0.15)',
  primaryGlow: 'rgba(107, 140, 255, 0.2)',
  onPrimary: '#ffffff',
  animation: {
    bg: '#121a27',
    bgDeep: '#0c111b',
    pink: 'rgba(232, 121, 249, 0.22)',
    cyan: 'rgba(56, 189, 248, 0.18)',
    purple: 'rgba(167, 139, 250, 0.18)',
    shimmer: 'rgba(107, 140, 255, 0.12)',
  },
  priority: {
    low: { bg: 'rgba(14, 165, 233, 0.2)', text: '#7dd3fc', accent: '#38bdf8' },
    medium: { bg: 'rgba(139, 92, 246, 0.2)', text: '#c4b5fd', accent: '#a78bfa' },
    high: { bg: 'rgba(251, 113, 133, 0.2)', text: '#fda4af', accent: '#fb7185' },
  },
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 26,
  pill: 999,
} as const;

export function createShadows(colors: ThemeColors) {
  return {
    sm: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: colors === darkColors ? 0.3 : 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    md: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: colors === darkColors ? 0.35 : 0.08,
      shadowRadius: 16,
      elevation: 4,
    },
    lg: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: colors === darkColors ? 0.4 : 0.1,
      shadowRadius: 24,
      elevation: 6,
    },
    primary: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 5,
    },
  };
}

// Backward-compatible default export
export const colors = lightColors;
export const shadows = createShadows(lightColors);
