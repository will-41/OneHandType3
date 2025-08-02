// Theme system module for OneType
export interface Theme {
  id: string;
  name: string;
  description?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    popover: string;
    popoverForeground: string;
    card: string;
    cardForeground: string;
    border: string;
    input: string;
    ring: string;
    // Chart colors
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
    // Status colors
    destructive: string;
    destructiveForeground: string;
    success: string;
    successForeground: string;
    warning: string;
    warningForeground: string;
  };
  keyboard?: {
    keyOutline: string;
    keyOutlineHover: string;
    keyOutlineActive: string;
    fingerColors: {
      pinky: string;
      ring: string;
      middle: string;
      index: string;
      thumb: string;
    };
  };
}

export const defaultTheme: Theme = {
  id: 'default',
  name: 'Default Theme',
  description: 'The default OneType theme',
  colors: {
    primary: 'hsl(221.2 83.2% 53.3%)',
    secondary: 'hsl(210 40% 96.1%)',
    accent: 'hsl(210 40% 96.1%)',
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(222.2 84% 4.9%)',
    muted: 'hsl(210 40% 96.1%)',
    mutedForeground: 'hsl(215.4 16.3% 46.9%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(222.2 84% 4.9%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(222.2 84% 4.9%)',
    border: 'hsl(214.3 31.8% 91.4%)',
    input: 'hsl(214.3 31.8% 91.4%)',
    ring: 'hsl(221.2 83.2% 53.3%)',
    chart1: 'hsl(12 76% 61%)',
    chart2: 'hsl(173 58% 39%)',
    chart3: 'hsl(197 37% 24%)',
    chart4: 'hsl(43 74% 66%)',
    chart5: 'hsl(27 87% 67%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    destructiveForeground: 'hsl(210 40% 98%)',
    success: 'hsl(142.1 76.2% 36.3%)',
    successForeground: 'hsl(355.7 100% 97.3%)',
    warning: 'hsl(38 92% 50%)',
    warningForeground: 'hsl(48 96% 89%)',
  },
  keyboard: {
    keyOutline: 'hsl(221.2 83.2% 53.3%)',
    keyOutlineHover: 'hsl(221.2 83.2% 53.3% / 0.8)',
    keyOutlineActive: 'hsl(221.2 83.2% 53.3% / 0.6)',
    fingerColors: {
      pinky: 'hsl(12 76% 61%)',
      ring: 'hsl(173 58% 39%)',
      middle: 'hsl(197 37% 24%)',
      index: 'hsl(43 74% 66%)',
      thumb: 'hsl(27 87% 67%)',
    },
  },
};

export const darkTheme: Theme = {
  id: 'dark',
  name: 'Dark Theme',
  description: 'Dark mode theme for reduced eye strain',
  colors: {
    primary: 'hsl(217.2 91.2% 59.8%)',
    secondary: 'hsl(217.2 32.6% 17.5%)',
    accent: 'hsl(217.2 32.6% 17.5%)',
    background: 'hsl(222.2 84% 4.9%)',
    foreground: 'hsl(210 40% 98%)',
    muted: 'hsl(217.2 32.6% 17.5%)',
    mutedForeground: 'hsl(215 20.2% 65.1%)',
    popover: 'hsl(222.2 84% 4.9%)',
    popoverForeground: 'hsl(210 40% 98%)',
    card: 'hsl(222.2 84% 4.9%)',
    cardForeground: 'hsl(210 40% 98%)',
    border: 'hsl(217.2 32.6% 17.5%)',
    input: 'hsl(217.2 32.6% 17.5%)',
    ring: 'hsl(224.3 76.3% 48%)',
    chart1: 'hsl(220 70% 50%)',
    chart2: 'hsl(160 60% 45%)',
    chart3: 'hsl(30 80% 55%)',
    chart4: 'hsl(280 65% 60%)',
    chart5: 'hsl(340 75% 55%)',
    destructive: 'hsl(0 62.8% 30.6%)',
    destructiveForeground: 'hsl(210 40% 98%)',
    success: 'hsl(142.1 70.6% 45.3%)',
    successForeground: 'hsl(144.9 80.4% 10%)',
    warning: 'hsl(48 96% 53%)',
    warningForeground: 'hsl(48 96% 11%)',
  },
  keyboard: {
    keyOutline: 'hsl(217.2 91.2% 59.8%)',
    keyOutlineHover: 'hsl(217.2 91.2% 59.8% / 0.8)',
    keyOutlineActive: 'hsl(217.2 91.2% 59.8% / 0.6)',
    fingerColors: {
      pinky: 'hsl(220 70% 50%)',
      ring: 'hsl(160 60% 45%)',
      middle: 'hsl(30 80% 55%)',
      index: 'hsl(280 65% 60%)',
      thumb: 'hsl(340 75% 55%)',
    },
  },
};

export const themes: Theme[] = [defaultTheme, darkTheme];

export function getThemeById(id: string): Theme | undefined {
  return themes.find(theme => theme.id === id);
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  
  // Apply color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    // Convert camelCase to kebab-case
    const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.style.setProperty(`--${cssVarName}`, value);
  });
}