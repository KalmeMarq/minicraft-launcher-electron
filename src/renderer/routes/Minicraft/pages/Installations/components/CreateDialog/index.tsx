import './index.scss';
import Modal from 'react-modal';
import { BorderedButton } from '../..';
import { useEffect, useState } from 'react';
import Dropdown from '../../../../../../components/Dropdown';
import { TL } from '../../../../../../utils/TL';

interface ICreateDialog {
  isOpen: boolean;
  versionList: string[];
  onCreate?: (id: string, name: string, versionId: string, saveDir: string, jvmArgs: string, modloader: string, mods: string[]) => void;
  onEdit?: (id: string, name: string | null, versionId: string | null, saveDir: string | null, jvmArgs: string | null, modloader: string | null, mods: string[] | null) => void;
  onClose: () => void;
  editData?: { id: string; name: string; versionId: string; saveDir: string; jvmArgs: string; modloader: string; mods: string[] };
}

Modal.setAppElement('#root');

const CreateDialog: React.FC<ICreateDialog> = ({ isOpen, onClose, versionList, onCreate, editData, onEdit }) => {
  const [name, setName] = useState(editData ? editData.name : '');
  const [version, setVersion] = useState(editData ? editData.versionId : '');
  const [saveDir, setSaveDir] = useState(editData ? editData.saveDir : '');
  const [jvmArgs, setJVMArgs] = useState(editData ? editData.jvmArgs : '');
  const [modloader, setModloader] = useState(editData ? editData.modloader : '');
  const [mods, setMods] = useState(editData ? editData.mods : []);
  const versD = versionList.map((v) => {
    return { text: v };
  });

  const [amods, setAMods] = useState<string[]>([]);
  const [amodloaders, setAModloaders] = useState<string[]>([]);

  useEffect(() => {
    window.ipcRenderer.invoke('ipc:get_loaders').then((list) => setAModloaders(['', ...list]));
  }, []);

  return (
    <Modal isOpen={isOpen} className="create-modal" overlayClassName="Overlay" onRequestClose={onClose}>
      <header>
        <h2>
          <TL>{editData ? 'Edit installation' : 'Create new installation'}</TL>
        </h2>
        <button className="close-btn" onClick={() => onClose()}>
          {/* prettier-ignore */}
          <svg version="1.1" id="Capa_1" x="0px" className="close-icon" y="0px" viewBox="0 0 512.001 512.001" fill="white"><g><g><path stroke="white" d="M284.286,256.002L506.143,34.144c7.811-7.811,7.811-20.475,0-28.285c-7.811-7.81-20.475-7.811-28.285,0L256,227.717L34.143,5.859c-7.811-7.811-20.475-7.811-28.285,0c-7.81,7.811-7.811,20.475,0,28.285l221.857,221.857L5.858,477.859c-7.811,7.811-7.811,20.475,0,28.285c3.905,3.905,9.024,5.857,14.143,5.857c5.119,0,10.237-1.952,14.143-5.857L256,284.287l221.857,221.857c3.905,3.905,9.024,5.857,14.143,5.857s10.237-1.952,14.143-5.857c7.811-7.811,7.811-20.475,0-28.285L284.286,256.002z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
        </button>
      </header>
      <main>
        <div className="container">
          <div className="install-input-cont">
            <label htmlFor="install-name">
              <TL>Name</TL>
            </label>
            <input type="text" id="install-name" value={name} onChange={(ev) => setName(ev.target.value)} placeholder={'unnamed installation'} />
          </div>
          <br />
          <div className="install-input-cont">
            <label>
              <TL>Version</TL>
            </label>
            {/* <select id="install-version-select">
              {versionList.map((ver) => (
                <option key={ver} value={ver}>
                  {ver}
                </option>
              ))}
            </select> */}
            <Dropdown
              data={versD}
              value={editData ? versionList.findIndex((v) => v === editData.versionId) : 0}
              onChange={(i) => {
                setVersion(versionList[i]);
              }}
            />
          </div>
          <br />
          <div className="install-input-cont">
            <label htmlFor="install-saveDir">
              <TL>Save Directory</TL>
            </label>
            <div className="browse-input">
              <input type="text" id="install-saveDir" value={saveDir} onChange={(ev) => setSaveDir(ev.target.value)} placeholder={'<Use default directory>'} />
              <div className="browse-btn-cont">
                <button
                  className="browse-button"
                  onClick={() => {
                    window.ipcRenderer.invoke('ipc:open_dir').then((d) => setSaveDir(d));
                  }}
                >
                  <TL>Browse</TL>
                </button>
              </div>
            </div>
          </div>
          <br />
          <div className="install-input-cont">
            <label htmlFor="install-jvmArgs">
              <TL>JVM Arguments</TL>
            </label>
            <input type="text" id="install-jvmArgs" value={jvmArgs} onChange={(ev) => setJVMArgs(ev.target.value)} />
          </div>
          <br />
          {amodloaders.length > 1 && (
            <div className="install-input-cont">
              <label>
                <TL>Mod Loader</TL>
              </label>
              <Dropdown
                data={amodloaders.map((am) => {
                  return { text: am };
                })}
                value={editData ? amodloaders.findIndex((v) => v === editData.modloader) : 0}
                onChange={(i) => {
                  setModloader(amodloaders[i]);
                }}
              />
            </div>
          )}
          {/* <div className="mod-list">
            {amods.map((amod) => (
              <button
                className={'mod-item' + (mods.includes(amod) ? ' on' : '')}
                onClick={() => {
                  if (mods.includes(amod)) {
                    setMods((md) => md.filter((m) => m !== amod));
                  } else {
                    setMods((md) => [...md, amod]);
                  }
                }}
                key={amod}
              >
                {amod}
              </button>
            ))}
          </div> */}
        </div>
      </main>
      <footer>
        <BorderedButton
          text="Cancel"
          onClick={() => {
            setName('');
            setSaveDir('');
            setJVMArgs('');
            onClose();
          }}
        />
        <BorderedButton
          text={editData ? 'Save' : 'Create'}
          type="green"
          onClick={() => {
            if (name.length > 0 && version !== '') {
              // const verId = (document.getElementById('install-version-select') as HTMLSelectElement).value;

              if (editData && onEdit) {
                onEdit(
                  editData.id,
                  name === editData.name ? null : name,
                  version === editData.versionId ? null : version,
                  saveDir === editData.saveDir ? null : saveDir,
                  jvmArgs === editData.jvmArgs ? null : jvmArgs,
                  modloader === editData.modloader ? null : modloader,
                  mods === editData.mods ? null : mods
                );
              } else if (onCreate) {
                const id = crypto.randomUUID().replace(/-/g, '');
                onCreate(id, name, version, saveDir, jvmArgs, modloader, mods);
              }

              onClose();

              setName('');
              setSaveDir('');
              setJVMArgs('');
            }
          }}
        />
      </footer>
    </Modal>
  );
};

export default CreateDialog;
