import React, { createContext, useEffect, useState } from 'react';

export interface Options {
  showCommunityTab: boolean;
  language: string;
  keepLauncherOpen: boolean;
  openOutputLog: boolean;
  animatePages: boolean;
  theme: string;
  availableThemes: string[];
  applyTheme: (newTheme: string) => void;
  disableHardwareAcceleration: boolean;
}

export const SettingsContext = createContext({
  showCommunityTab: true,
  language: 'en-US',
  theme: 'dark',
  keepLauncherOpen: true,
  openOutputLog: false,
  animatePages: false,
  disableHardwareAcceleration: false,
  availableThemes: ['dark', 'light'],
  applyTheme: (newTheme: string) => {},
  setOption: (key: string, value: unknown) => {}
});

export const SettingsProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [showCommunityTab, setShowCommunityTab] = useState(true);
  const [keepLauncherOpen, setKeepLauncherOpen] = useState(true);
  const [openOutputLog, setOpenOutputLog] = useState(false);
  const [animatePages, setAnimatePages] = useState(false);
  const [disableHardwareAcceleration, setDisableHardwareAcceleration] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [theme, setTheme] = useState('dark');
  const [themes, setThemes] = useState<Record<string, Record<string, string>>>({});
  const [availableThemes, setAvailableThemes] = useState(['dark', 'light']);

  useEffect(() => {
    window.ipcRenderer.invoke('ipc:get_options').then((options: Options) => {
      setKeepLauncherOpen(options.keepLauncherOpen);
      setLanguage(options.language);
      setShowCommunityTab(options.showCommunityTab);
      setDisableHardwareAcceleration(options.disableHardwareAcceleration);
      setAnimatePages(options.animatePages);
      setTheme(options.theme);
      applyTheme(options.theme);
    });

    window.ipcRenderer.invoke('ipc:get_themes').then((ths: Record<string, Record<string, string>>) => {
      const transformed: Record<string, Record<string, string>> = {};
      Object.entries(ths).forEach(([themename, themedata]) => {
        transformed[themename] = {};

        Object.entries(themedata).forEach(([key, value]) => {
          transformed[themename]['--' + key.replace(/\./g, '-')] = value;
        });
      });

      setAvailableThemes(Object.keys(ths));
      setThemes(transformed);
      console.log(transformed);
    });

    window.Main.on('ipc:updated_option', (ev, key: string, value: unknown) => {
      if (key === 'showCommunityTab' && typeof value === 'boolean') setShowCommunityTab(value);
      if (key === 'keepLauncherOpen' && typeof value === 'boolean') setKeepLauncherOpen(value);
      if (key === 'language' && typeof value === 'string') setLanguage(value);
      if (key === 'theme' && typeof value === 'string') {
        setTheme(value);
        applyTheme(value);
      }
      if (key === 'openOutputLog' && typeof value === 'boolean') setOpenOutputLog(value);
      if (key === 'animatePages' && typeof value === 'boolean') setAnimatePages(value);
      if (key === 'disableHardwareAcceleration' && typeof value === 'boolean') setDisableHardwareAcceleration(value);
    });
  }, []);

  const applyTheme = (newTheme: string) => {
    if (themes[newTheme]) {
      Object.entries(themes[newTheme]).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  };

  const setOption = (key: string, value: unknown) => {
    window.ipcRenderer.send('ipc:set_option', key, value);
  };

  return (
    <SettingsContext.Provider value={{ theme, applyTheme, availableThemes, showCommunityTab, keepLauncherOpen, language, openOutputLog, animatePages, disableHardwareAcceleration, setOption }}>
      {children}
    </SettingsContext.Provider>
  );
};
