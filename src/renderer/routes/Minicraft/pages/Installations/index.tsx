import React, { useEffect, useRef, useState } from 'react';
import CreateDialog from './components/CreateDialog';
import './index.scss';
import folderIcon from '../../../../assets/icons/folder.png';
import moreIcon from '../../../../assets/icons/more.png';
import SearchBox from '../../../../components/SearchBox';
import { TL, useTLTranslation } from '../../../../utils/TL';
import LogDialog from '../../../../components/LogDialog';
import { displayTime } from '../../../../utils/util';

export const BorderedButton: React.FC<{ text?: string; icon?: string; className?: string; onClick: React.MouseEventHandler; type?: 'normal' | 'green' | 'red' }> = ({
  icon,
  text,
  onClick,
  className,
  type = 'normal'
}) => {
  return (
    <button className={'bordered-btn' + (icon ? ' iconned' : '') + (type === 'green' ? ' green' : type === 'red' ? ' red' : '') + (className ? className : '')} onClick={onClick}>
      {text && <TL>{text}</TL>}
      {icon && <img src={icon} />}
    </button>
  );
};

interface IProfile {
  id: string;
  name: string;
  versionId: string;
  saveDir: string;
  lastUsed: string;
  jvmArgs: string;
  modloader: string;
  mods: string[];
  totalPlayTime: number;
}

interface IInstallationItem {
  show: boolean;
  profile: IProfile;
  onDelete: (profile: IProfile) => void;
  onEdit: (profile: IProfile) => void;
  onDuplicate: (profile: IProfile) => void;
  onPlay: (profile: IProfile) => void;
  onFolder: (profile: IProfile) => void;
  onLogs: (profile: IProfile) => void;
  onSelect: (profile: IProfile) => void;
}

const InstallationItem: React.FC<IInstallationItem> = ({ profile, show, onDelete, onEdit, onDuplicate, onFolder, onPlay, onSelect, onLogs }) => {
  const [showTools, setShowTools] = useState(false);

  const tRef = useRef(null);

  window.addEventListener('click', (e) => {
    // @ts-ignore
    if (tRef.current && !tRef.current.contains(e.target)) {
      setShowTools(false);
    }
  });

  return (
    <div className="iprofile-item" style={{ display: show ? 'flex' : 'none' }}>
      <button
        className="iprofile-btn"
        onClick={() => {
          onSelect(profile);
        }}
      >
        <div className="iprofile-info">
          <p>{profile.name}</p>
          <span>{profile.versionId}</span>
          {profile.totalPlayTime > 0 && (
            <p className="playtime">
              <TL>Total Playtime</TL>: {displayTime(profile.totalPlayTime)}
            </p>
          )}
        </div>
        <div className="iprofile-tools">
          {showTools && (
            <div ref={tRef} className="edit-tools" tabIndex={0}>
              <button
                className="edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(profile);
                  setShowTools(false);
                }}
              >
                Edit
              </button>
              <button
                className="edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(profile);
                  setShowTools(false);
                }}
              >
                <TL>Duplicate</TL>
              </button>
              <button
                className="edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onLogs(profile);
                  setShowTools(false);
                }}
              >
                <TL>Open Logs</TL>
              </button>
              <button
                className="edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(profile);
                  setShowTools(false);
                }}
              >
                <TL>Delete</TL>
              </button>
            </div>
          )}
          <BorderedButton
            text="Play"
            type="green"
            onClick={(e) => {
              e.stopPropagation();
              onPlay(profile);
            }}
          />
          <BorderedButton
            icon={folderIcon}
            onClick={(e) => {
              e.stopPropagation();
              onFolder(profile);
            }}
          />
          <BorderedButton
            icon={moreIcon}
            onClick={(e) => {
              e.stopPropagation();
              setShowTools(true);
            }}
          />
          {/* <BorderedButton
            text="Open Logs"
            onClick={(e) => {
              e.stopPropagation();
              onLogs(profile);
            }}
          />
          <BorderedButton
            text="Duplicate"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(profile);
            }}
          />
          <BorderedButton
            text="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(profile);
            }}
          /> */}
        </div>
      </button>
    </div>
  );
};

const InstallationsPage = () => {
  const [versions, setVersions] = useState<string[]>([]);
  const [profiles, setProfiles] = useState<IProfile[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [logId, setLogId] = useState('');
  const [versionSelected, setVersionSelected] = useState('');

  const [results, setResults] = useState(0);
  const [filterText, setFilterText] = useState('');

  const { tl } = useTLTranslation();

  const handleFilterTextChange = (value: string) => {
    setFilterText(value);
    if (value === '') setResults(0);
    if (value !== '') setResults(profiles.filter((v) => v.name.toLowerCase().includes(value.toLowerCase())).length);
  };

  useEffect(() => {
    if (versions.length === 0) {
      window.ipcRenderer.invoke('ipc:get_versions').then((vers) => {
        setVersions(vers);
      });
    }

    if (profiles.length === 0) {
      window.ipcRenderer.invoke('ipc:get_profiles').then((profs) => {
        setProfiles(profs);
      });
    }

    window.Main.on('ipc:updated_profile_lastused', (ev, id: string, lastT: string) => {
      setProfiles((profs) =>
        profs.map((p) => {
          if (p.id === id) {
            p.lastUsed = lastT;
          }
          return p;
        })
      );
    });

    window.Main.on('ipc:updated_profile_tpm', (ev, id: string, tm: number) => {
      setProfiles((profs) =>
        profs
          .map((p) => {
            if (p.id === id) {
              p.totalPlayTime = tm;
            }
            return p;
          })
          .sort((a, b) => {
            if (new Date(a.lastUsed).getTime() > new Date(b.lastUsed).getTime()) {
              return -1;
            } else if (new Date(a.lastUsed).getTime() < new Date(b.lastUsed).getTime()) {
              return 1;
            }
            return 0;
          })
      );
    });

    return () => {
      window.Main.removeAllListeners('ipc:updated_profile_lastused');
      window.Main.removeAllListeners('ipc:updated_profile_tpm');
    };
  }, []);

  const getP = () => {
    const p = profiles.find((p) => p.id === versionSelected)!;

    console.log('VS: ' + versionSelected);

    return {
      id: versionSelected,
      name: p.name,
      versionId: p.versionId,
      saveDir: p.saveDir,
      jvmArgs: p.jvmArgs,
      modloader: p.modloader,
      mods: p.mods
    };
  };

  return (
    <div className="sub-page installs-sp">
      {showLogDialog && logId !== '' && (
        <LogDialog
          profile={profiles.find((p) => p.id === logId)!}
          isOpen={showLogDialog}
          onClose={() => {
            setLogId('');
            setShowLogDialog(false);
          }}
        />
      )}
      {versionSelected !== '' && (
        <CreateDialog
          onClose={() => setVersionSelected('')}
          versionList={versions}
          isOpen={versionSelected !== ''}
          editData={getP()}
          onEdit={(id, nm, verId, saveDir, jvmArgs, modloader, mods) => {
            console.log('updated', id, nm, verId, saveDir, jvmArgs, modloader, mods);

            const p = profiles.find((pr) => pr.id === id);

            if (p) {
              if (nm !== null) p.name = nm;
              if (verId !== null) p.versionId = verId;
              if (saveDir !== null) p.saveDir = saveDir;
              if (jvmArgs !== null) p.jvmArgs = jvmArgs;
              if (modloader !== null) p.modloader = modloader;
              if (mods !== null) p.mods = mods;

              window.ipcRenderer.send('ipc:update_profile', id, nm, verId, saveDir, jvmArgs, modloader, mods);
            }
          }}
        />
      )}
      <CreateDialog
        onClose={() => setShowCreateDialog(false)}
        versionList={versions}
        isOpen={showCreateDialog}
        onCreate={(id, nm, verId, saveDir, jvmArgs, modloader, mods) => {
          setProfiles((profs) => [
            { id: id, name: nm, versionId: verId, saveDir: saveDir, lastUsed: new Date().toISOString(), jvmArgs: jvmArgs, totalPlayTime: 0, modloader: modloader, mods: mods },
            ...profs
          ]);
          window.ipcRenderer.send('ipc:create_profile', id, nm, verId, saveDir, jvmArgs, modloader, mods);
        }}
      />
      <div className="filter-section">
        <div className="filter-cont">
          <h3>
            <TL>Search</TL>
          </h3>
          <SearchBox results={results} value={filterText} handleFilter={handleFilterTextChange} placeholder={tl('Installation name')} />
        </div>
      </div>
      <div className="dividerr"></div>
      <div className="iprofile-list">
        <div className="new-btn-cont">
          <div className="new-btn-inside">
            <BorderedButton text="New installation" onClick={() => setShowCreateDialog(true)} />
          </div>
        </div>
        {profiles.map((prof, i) => (
          <React.Fragment key={prof.id}>
            {i !== 0 && <div className="divider" style={{ display: filterText === '' || prof.name.toLowerCase().includes(filterText.toLowerCase()) ? 'block' : 'none' }}></div>}
            <InstallationItem
              show={filterText === '' || prof.name.toLowerCase().includes(filterText.toLowerCase())}
              profile={prof}
              onLogs={() => {
                setLogId(prof.id);
                setShowLogDialog(true);
              }}
              onSelect={() => {
                setVersionSelected(prof.id);
              }}
              onEdit={() => {
                setVersionSelected(prof.id);
              }}
              onFolder={() => {
                window.ipcRenderer.send('ipc:open_savedir', prof.id);
              }}
              onDelete={() => {
                window.ipcRenderer.send('ipc:delete_profile', prof.id);
                setProfiles((profs) => profs.filter((pf) => pf.id !== prof.id));
              }}
              onDuplicate={() => {
                const profn = { ...prof };
                profn.totalPlayTime = 0;
                profn.id = crypto.randomUUID().replace(/-/g, '');
                profn.name += ' (2)';

                setProfiles((profs) => [profn, ...profs]);
                window.ipcRenderer.send('ipc:create_profile', profn.id, profn.name, profn.versionId, profn.saveDir, profn.mods);
              }}
              onPlay={() => {
                setProfiles((profs) =>
                  profs
                    .map((p) => {
                      if (p.id === prof.id) {
                        p.lastUsed = new Date().toISOString();
                      }
                      return p;
                    })
                    .sort((a, b) => {
                      if (new Date(a.lastUsed).getTime() > new Date(b.lastUsed).getTime()) {
                        return -1;
                      } else if (new Date(a.lastUsed).getTime() < new Date(b.lastUsed).getTime()) {
                        return 1;
                      }
                      return 0;
                    })
                );
                window.ipcRenderer.send('ipc:play', prof.id);
              }}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default InstallationsPage;
