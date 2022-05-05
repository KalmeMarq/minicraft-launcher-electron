import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '@renderer/fonts.scss';
import '@renderer/index.scss';
import App from '@renderer/App';
import { TLContext } from '@renderer/utils/TL';
import TLTranslations, { ExtraTranslationContext } from '@renderer/utils/tltranslations';
import { SettingsProvider } from '@renderer/utils/SettingsContext';

const Root = () => {
  const [lang, setLang] = useState('en-US');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    window.ipcRenderer.invoke('ipc:get_option', 'language').then((lang) => {
      setLang(lang);
    });

    window.ipcRenderer.invoke('ipc:get_option', 'theme').then((lang) => {
      setTheme(lang);
    });

    window.Main.on('ipc:updated_option', (ev, key: string, value: unknown) => {
      if (key === 'language') {
        setLang(value as string);
      }
    });

    window.Main.on('ipc:updated_option', (ev, key: string, value: unknown) => {
      if (key === 'theme') {
        setTheme(value as string);
      }
    });

    return () => {
      window.Main.removeAllListeners('ipc:updated_option');
    };
  }, []);

  return (
    <SettingsProvider>
      <ExtraTranslationContext.Provider value={lang}>
        <TLContext.Provider value={TLTranslations[lang]}>
          <App />
        </TLContext.Provider>
      </ExtraTranslationContext.Provider>
    </SettingsProvider>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<Root />);
}
