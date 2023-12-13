import React from 'react';
import {styled, darkTheme, globalCss} from '../styled';

const colorSchemes = ['light', 'dark'];

const global = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  ':root': {
    '--sait': 'var(--discord-safe-area-inset-top, env(safe-area-inset-top))',
    '--saib': 'var(--discord-safe-area-inset-bottom, env(safe-area-inset-bottom))',
    '--sail': 'var(--discord-safe-area-inset-left, env(safe-area-inset-left))',
    '--sair': 'var(--discord-safe-area-inset-right, env(safe-area-inset-right))',
  },
  body: {
    paddingTop: 'var(--sait)',
    paddingBottom: 'var(--saib)',
    paddingLeft: 'var(--sail)',
    paddingRight: 'var(--sair)',
  },
  'html,body,#root': {
    width: '100%',
    height: '100%',
    backgroundColor: '$slate1',
    fontFamily: 'Roboto',
  },
});

const Container = styled('div', {
  width: '100%',
  height: '100%',
  backgroundColor: '$slate1',
});

const MEDIA = '(prefers-color-scheme: dark)';

// Helpers
const getTheme = (key: string, fallback?: string) => {
  if (typeof window === 'undefined') return undefined;
  let theme;
  try {
    theme = localStorage.getItem(key) || undefined;
  } catch (e) {
    // Unsupported
  }
  return theme || fallback;
};

const getSystemTheme = (e?: MediaQueryList): SystemTheme => {
  if (!e) {
    e = window.matchMedia(MEDIA);
  }

  const isDark = e.matches;
  const systemTheme = isDark ? 'dark' : 'light';
  return systemTheme;
};
type SystemTheme = 'dark' | 'light';

interface IValueObject {
  [themeName: string]: string;
}

export interface IUseThemeProps {
  /** List of all available theme names */
  themes: string[];
  /** Update the theme */
  setTheme: (theme: string) => void;
  /** Active theme name */
  theme?: string;
  /** If `enableSystem` is true and the active theme is "system", this returns whether the system preference resolved to "dark" or "light". Otherwise, identical to `theme` */
  resolvedTheme?: string;
  /** If enableSystem is true, returns the System theme preference ("dark" or "light"), regardless what the active theme is */
  systemTheme?: 'dark' | 'light';
}

export interface IThemeProviderProps {
  /** List of all available theme names */
  themes?: string[];
  /** Whether to switch between dark and light themes based on prefers-color-scheme */
  enableSystem?: boolean;
  /** Disable all CSS transitions when switching themes */
  disableTransitionOnChange?: boolean;
  /** Whether to indicate to browsers which color scheme is used (dark or light) for built-in UI like inputs and buttons */
  enableColorScheme?: boolean;
  /** Key used to store theme setting in localStorage */
  storageKey?: string;
  /** Default theme name (for v0.0.12 and lower the default was light). If `enableSystem` is false, the default theme is light */
  defaultTheme?: string;
  /** HTML attribute modified based on the active theme. Accepts `class` and `data-*` (meaning any data attribute, `data-mode`, `data-color`, etc.) */
  attribute?: string | 'class';
  /** Mapping of theme name to HTML attribute value. Object where key is the theme name and value is the attribute value */
  value?: IValueObject;
  children: React.ReactNode;
}

export default function DesignSystemProvider({
  enableSystem = true,
  enableColorScheme = true,
  storageKey = 'theme',
  defaultTheme = enableSystem ? 'system' : 'light',
  children,
}: IThemeProviderProps) {
  const [theme, setThemeState] = React.useState(() => getTheme(storageKey, defaultTheme));
  const [resolvedTheme, setResolvedTheme] = React.useState(() => getTheme(storageKey));

  const changeTheme = React.useCallback(
    (theme: SystemTheme, updateStorage = true) => {
      if (updateStorage) {
        try {
          localStorage.setItem(storageKey, theme);
        } catch (e) {
          // Unsupported
        }
      }
    },
    [storageKey]
  );

  const handleMediaQuery = React.useCallback(
    (e?: MediaQueryList) => {
      const systemTheme = getSystemTheme(e);
      setResolvedTheme(systemTheme);
      if (theme === 'system') changeTheme(systemTheme, false);
    },
    [changeTheme, theme]
  );

  // Ref hack to avoid adding handleMediaQuery as a dep
  const mediaListener = React.useRef(handleMediaQuery);
  mediaListener.current = handleMediaQuery;

  React.useEffect(() => {
    const handler = (...args: any) => mediaListener.current(...args);

    // Always listen to System preference
    const media = window.matchMedia(MEDIA);

    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addListener(handler);
    handler(media);

    return () => media.removeListener(handler);
  }, []);

  const setTheme = React.useCallback(
    (newTheme: SystemTheme) => {
      changeTheme(newTheme);
      setThemeState(newTheme);
    },
    [changeTheme]
  );

  // localStorage event handling
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) {
        return;
      }
      // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
      const theme = e.newValue || defaultTheme;
      setTheme(theme as SystemTheme);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [defaultTheme, setTheme, storageKey]);

  // color-scheme handling
  React.useEffect(() => {
    if (!enableColorScheme) return;

    const colorScheme =
      // If regular theme is light or dark
      theme && colorSchemes.includes(theme)
        ? theme
        : // If theme is system, use the resolved version
        theme === 'system'
        ? resolvedTheme || null
        : null;

    // color-scheme tells browser how to render built-in elements like forms, scrollbars, etc.
    // if color-scheme is null, this will remove the property
    document.documentElement.style.setProperty('color-scheme', colorScheme);
  }, [enableColorScheme, theme, resolvedTheme]);

  global();

  return <Container className={resolvedTheme === 'dark' ? darkTheme : undefined}>{children}</Container>;
}
