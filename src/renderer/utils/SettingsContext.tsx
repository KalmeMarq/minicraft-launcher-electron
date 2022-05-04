import React, { createContext, useEffect, useState } from 'react';

export interface Options {
  showCommunityTab: boolean;
  language: string;
  keepLauncherOpen: boolean;
  openOutputLog: boolean;
}

export const SettingsContext = createContext({
  showCommunityTab: true,
  language: 'en-US',
  keepLauncherOpen: true,
  openOutputLog: false,
  setOption: (key: string, value: unknown) => {}
});

export const SettingsProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [showCommunityTab, setShowCommunityTab] = useState(true);
  const [keepLauncherOpen, setKeepLauncherOpen] = useState(true);
  const [openOutputLog, setOpenOutputLog] = useState(false);
  const [language, setLanguage] = useState('en-US');

  useEffect(() => {
    window.ipcRenderer.invoke('ipc:get_options').then((options: Options) => {
      setKeepLauncherOpen(options.keepLauncherOpen);
      setLanguage(options.language);
      setShowCommunityTab(options.showCommunityTab);
    });

    window.Main.on('ipc:updated_option', (ev, key: string, value: unknown) => {
      if (key === 'showCommunityTab' && typeof value === 'boolean') setShowCommunityTab(value);
      if (key === 'keepLauncherOpen' && typeof value === 'boolean') setKeepLauncherOpen(value);
      if (key === 'language' && typeof value === 'string') setLanguage(value);
      if (key === 'openOutputLog' && typeof value === 'boolean') setOpenOutputLog(value);
    });
  }, []);

  const setOption = (key: string, value: unknown) => {
    window.ipcRenderer.send('ipc:set_option', key, value);
  };

  return <SettingsContext.Provider value={{ showCommunityTab, keepLauncherOpen, language, openOutputLog, setOption }}>{children}</SettingsContext.Provider>;
};
