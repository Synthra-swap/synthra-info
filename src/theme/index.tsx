import React, { useMemo } from 'react'
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme,
} from 'styled-components'
import { useIsDarkMode } from '../state/user/hooks'
import { Text, TextProps } from 'rebass'
import { Colors } from './styled'

export * from './components'

export const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {},
) as any

const white = '#FFFFFF'
const black = '#000000'

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black: '#000000',

    // text - modern minimal dark theme with purple accents
    text1: '#FFFFFF',
    text2: '#B8BCC8',
    text3: '#8B8D97',
    text4: '#6B6D76',
    text5: '#4A4B52',

    // backgrounds - deep blacks and subtle grays, no borders
    bg0: '#000000',
    bg1: '#0A0A0B',
    bg2: '#111113',
    bg3: '#1A1A1C',
    bg4: '#242426',
    bg5: '#2E2E31',

    //specialty colors
    modalBG: 'rgba(0,0,0,0.85)',
    advancedBG: 'rgba(0,0,0,0.6)',

    //primary colors - purple theme
    primary1: '#8B5CF6',  // vibrant purple
    primary2: '#A78BFA',  // lighter purple
    primary3: '#C4B5FD',  // even lighter purple
    primary4: 'rgba(139, 92, 246, 0.2)',  // transparent purple
    primary5: 'rgba(139, 92, 246, 0.1)',  // very transparent purple

    // color text
    primaryText1: '#8B5CF6',

    // secondary colors
    secondary1: '#8B5CF6',
    secondary2: 'rgba(139, 92, 246, 0.15)',
    secondary3: 'rgba(139, 92, 246, 0.1)',

    // other - modern palette
    pink1: '#F472B6',
    red1: '#EF4444',
    red2: '#DC2626',
    red3: '#B91C1C',
    green1: '#10B981',
    yellow1: '#FBBF24',
    yellow2: '#F59E0B',
    yellow3: '#D97706',
    blue1: '#3B82F6',
    blue2: '#60A5FA',
  }
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useIsDarkMode()

  const themeObject = useMemo(() => theme(darkMode), [darkMode])

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  label(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} color={'text1'} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} color={'text3'} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'blue1'} {...props} />
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow3'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  },
}

export const FixedGlobalStyle = createGlobalStyle`
html, input, textarea, button {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-display: swap;
  font-optical-sizing: auto;
}

@supports (font-variation-settings: normal) {
  html, input, textarea, button {
    font-family: 'Inter var', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
}

html,
body {
  margin: 0;
  padding: 0;
  scroll-behavior: smooth;
}

 a {
   color: ${colors(false).primary1}; 
   text-decoration: none;
   transition: all 0.2s ease;
 }

 a:hover {
   color: ${colors(false).primary2};
 }

* {
  box-sizing: border-box;
}

button {
  user-select: none;
  border: none;
  background: none;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

input, textarea {
  font-family: inherit;
  border: none;
  outline: none;
  background: transparent;
}

html {
  font-size: 16px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
  text-rendering: optimizeLegibility;
}
`

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg0};
}

* {
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.bg3} transparent;
}

*::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background-color: ${({ theme }) => theme.bg3};
  border-radius: 10px;
  border: none;
}

*::-webkit-scrollbar-thumb:hover {
  background-color: ${({ theme }) => theme.primary1};
}

.three-line-legend-dark {
	width: 100%;
	height: 70px;
	position: absolute;
	padding: 8px;
	font-size: 12px;
	color: white;
	background-color: transparent;
	text-align: left;
	z-index: 10;
  pointer-events: none;
}

.tv-lightweight-charts{
  width: 100% !important;
  
  & > * {
    width: 100% !important;
  }
}

body {
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #0A0A0B 50%, #111113 100%);
  background-attachment: fixed;
  position: relative;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(244, 114, 182, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
}
`
