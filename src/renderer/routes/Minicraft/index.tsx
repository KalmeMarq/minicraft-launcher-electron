import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SubMenu from '../../components/SubMenu';
import { TL } from '../../utils/TL';
import InstallationsPage from './pages/Installations';
import PatchNotesPage from './pages/PatchNotes';
import PlayPage from './pages/Play';
import './index.scss';

const MinicraftRoute = () => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isDloading, setIsDloading] = useState(false);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    window.Main.on('ipc:downloading', (ev, loaded: number, total: number) => {
      setLoaded(loaded);
      setTotal(total);
    });

    window.Main.on('ipc:download_start', () => {
      setLoaded(0);
      setTotal(0);
      setIsDloading(true);
    });

    window.Main.on('ipc:download_finished', () => {
      setIsDloading(false);
      setLoaded(0);
      setTotal(0);
    });

    window.Main.on('ipc:launch_start', () => setIsLaunching(true));
    window.Main.on('ipc:launch_end', () => setIsLaunching(false));

    window.Main.on('ipc:preparing', (ev, loaded: number, total: number) => {
      setLoaded(loaded);
      setTotal(total);
    });

    window.Main.on('ipc:prepare_start', () => {
      setLoaded(0);
      setTotal(0);
      setIsPreparing(true);
    });

    window.Main.on('ipc:prepare_finished', () => {
      setIsPreparing(false);
      setLoaded(0);
      setTotal(0);
    });

    return () => {
      window.Main.removeAllListeners('ipc:downloading');
      window.Main.removeAllListeners('ipc:download_start');
      window.Main.removeAllListeners('ipc:download_finished');
      window.Main.removeAllListeners('ipc:launch_start');
      window.Main.removeAllListeners('ipc:launch_end');
      window.Main.removeAllListeners('ipc:preparing');
      window.Main.removeAllListeners('ipc:prepare_start');
      window.Main.removeAllListeners('ipc:prepare_finished');
    };
  }, []);

  return (
    <div className="base-route">
      <SubMenu>
        <SubMenu.Title text="Minicraft" />
        <SubMenu.Navbar>
          <SubMenu.Link to="/minicraft/play" text="Play" />
          <SubMenu.Link to="/minicraft/installations" text="Installations" />
          <SubMenu.Link to="/minicraft/patchnotes" text="Patch Notes" />
        </SubMenu.Navbar>
      </SubMenu>
      <Routes>
        <Route path="/" element={<Navigate to="/minicraft/play" replace />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/installations" element={<InstallationsPage />} />
        <Route path="/patchnotes" element={<PatchNotesPage />} />
      </Routes>
      <div className={'load-bar' + (isDloading && !isLaunching && total !== 0 ? ' show' : '')}>
        <div className="load-bar-in">
          <div className="load-bar-prog" style={{ width: `${(loaded / total) * 100}%` }}></div>
          <p>
            <TL>Downloading</TL> {`${(loaded / 1024 / 1024).toFixed(2)}mb / ${(total / 1024 / 1024).toFixed(2)}mb`}
          </p>
        </div>
      </div>
      <div className={'load-bar' + (isLaunching ? ' show' : '') + ''}>
        <div className="load-bar-in">
          <div className="load-bar-prog launching"></div>
          <p>
            <TL>Launching...</TL>
          </p>
        </div>
      </div>
      <div className={'load-bar' + (isPreparing && total !== 0 ? ' show' : '') + ''}>
        <div className="load-bar-in">
          <div className="load-bar-prog launching" style={{ width: `${(loaded / total) * 100}%` }}></div>
          <p>
            <TL>Preparing...</TL>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MinicraftRoute;
