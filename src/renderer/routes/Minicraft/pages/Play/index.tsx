import React, { useEffect, useState } from 'react';
import './index.scss';

const PlayButton: React.FC<{ children?: React.ReactNode; width?: number; onClick?: React.MouseEventHandler; disabled?: boolean }> = ({ disabled, width = 234, children, onClick = () => {} }) => {
  return (
    <button className="play-button" style={{ width: width + 'px' }} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

const PlayPage = () => {
  const [profiles, setProfiles] = useState<{ id: string; lastUsed: string }[]>([]);
  const [playLocked, setPlayLocked] = useState(false);

  const dLoadStart = () => {
    setPlayLocked(true);
  };

  const launchS = () => {
    setPlayLocked(true);
  };

  const launchE = () => {
    setPlayLocked(false);
  };

  useEffect(() => {
    if (profiles.length === 0) {
      window.ipcRenderer.invoke('ipc:get_profiles').then((profs) => {
        setProfiles(profs);
      });
    }

    window.Main.on('ipc:download_start', dLoadStart);
    window.Main.on('ipc:launch_start', launchS);
    window.Main.on('ipc:launch_end', launchE);

    return () => {
      window.Main.removeAllListeners('ipc:download_start');
      window.Main.removeAllListeners('ipc:launch_start');
      window.Main.removeAllListeners('ipc:launch_end');
    };
  }, []);

  return (
    <div className="sub-page">
      <div className="banner"></div>
      <section className="play-bar">
        <PlayButton
          disabled={playLocked}
          onClick={() => {
            // const prof
            const prof = profiles.sort((a, b) => {
              if (new Date(a.lastUsed).getTime() > new Date(b.lastUsed).getTime()) {
                return -1;
              } else if (new Date(a.lastUsed).getTime() < new Date(b.lastUsed).getTime()) {
                return 1;
              }
              return 0;
            })[0];
            if (prof) window.ipcRenderer.send('ipc:play', prof.id);
          }}
        >
          Play
        </PlayButton>
      </section>
    </div>
  );
};

export default PlayPage;
