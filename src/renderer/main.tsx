import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '@renderer/fonts.scss';
import '@renderer/index.scss';
import App from '@renderer/App';
import { TLContext } from '@renderer/utils/TL';
import TLTranslations, { ExtraTranslationContext } from '@renderer/utils/tltranslations';

const Root = () => {
  const [lang, setLang] = useState('en-US');

  useEffect(() => {
    window.ipcRenderer.invoke('ipc:get_option', 'language').then((lang) => {
      setLang(lang);
    });
    window.Main.on('ipc:updated_option', (ev, key: string, value: unknown) => {
      if (key === 'language') {
        setLang(value as string);
      }
    });

    return () => {
      window.Main.removeAllListeners('ipc:updated_option');
    };
  }, []);

  return (
    <ExtraTranslationContext.Provider value={lang}>
      <TLContext.Provider value={TLTranslations[lang]}>
        <App />
      </TLContext.Provider>
    </ExtraTranslationContext.Provider>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<Root />);
}
