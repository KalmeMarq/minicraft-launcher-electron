import { useEffect, useState } from 'react';
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import MainMenu from '@renderer/components/MainMenu';
import closeIcon from '@renderer/assets/icons/cancel.png';
import CommunityRoute from '@renderer/routes/Community';
import MinicraftRoute from '@renderer/routes/Minicraft';
import SecWin from '@renderer/routes/SecWin';
import SettingsRoute from '@renderer/routes/Settings';
import { AboutContext } from '@renderer/utils/AboutContext';
import { PatchNotesProvider } from '@renderer/utils/PatchNotesContext';
import { SettingsProvider } from '@renderer/utils/SettingsContext';

const MainWin = () => {
  return (
    <>
      <MainMenu />
      <div className="routes">
        <Routes>
          <Route path="/" element={<Navigate to="/minicraft" replace />}></Route>
          <Route path="/minicraft/*" element={<MinicraftRoute />} />
          <Route path="/community/*" element={<CommunityRoute />} />
          <Route path="/settings/*" element={<SettingsRoute />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  console.log(window.ipcRenderer, window.Main);
  const [appVersion, setAppVersion] = useState('');
  const [notifs, setNotifs] = useState<string[]>([]);

  useEffect(() => {
    window.ipcRenderer.invoke('ipc:get_launcher_version').then((ver) => setAppVersion(ver));
    window.Main.on('ipc:update_available', () => {
      setNotifs((notifs) => [...notifs, 'An update is available. Downloading now...']);
    });
    window.Main.on('ipc:update_downloaded', () => {
      setNotifs((notifs) => [...notifs, 'Update downloaded. Close to install.']);
    });
  }, []);

  return (
    <SettingsProvider>
      <PatchNotesProvider>
        <AboutContext.Provider value={{ version: appVersion }}>
          <div className="main-app">
            <Router>
              <Routes>
                <Route path="/*" element={<MainWin />} />
                <Route path="/secwin" element={<SecWin />} />
              </Routes>
            </Router>
            <div className="notifs-panel">
              {notifs.map((notif) => (
                <div className="notif-item" key={notif.replace(/ /g, '')}>
                  <div className="notif-text">{notif}</div>
                  <button className="notif-close">
                    <img src={closeIcon} alt="" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </AboutContext.Provider>
      </PatchNotesProvider>
    </SettingsProvider>
  );
}

export default App;
