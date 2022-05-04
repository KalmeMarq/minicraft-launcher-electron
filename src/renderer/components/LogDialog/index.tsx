import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { TL } from '@renderer/utils/TL';
import '@renderer/components/LogDialog/index.scss';

Modal.setAppElement('#root');

const LogDialog: React.FC<{ profile: { id: string; name: string; versionId: string; saveDir: string; jvmArgs: string }; isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose, profile }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    window.ipcRenderer.invoke('ipc:get_profile_logs', profile.id).then((lgs: string[]) => {
      console.log(lgs);
      setLogs(lgs);
    });

    window.Main.on('ipc:log_line_added', (ev, id: string, line: string) => {
      setLogs((lgs) => [...lgs, line]);
      console.log(line);
    });

    return () => {
      window.Main.removeAllListeners('ipc:log_line_added');
    };
  }, []);

  return (
    <Modal isOpen={isOpen} className="create-modal lnews-modal" overlayClassName="Overlay" onRequestClose={onClose}>
      <header>
        <h2>
          <TL>{profile.name}</TL> Log
        </h2>
        <button className="close-btn" onClick={() => onClose()}>
          {/* prettier-ignore */}
          <svg version="1.1" id="Capa_1" x="0px" className="close-icon" y="0px" viewBox="0 0 512.001 512.001" fill="white"><g><g><path stroke="white" d="M284.286,256.002L506.143,34.144c7.811-7.811,7.811-20.475,0-28.285c-7.811-7.81-20.475-7.811-28.285,0L256,227.717L34.143,5.859c-7.811-7.811-20.475-7.811-28.285,0c-7.81,7.811-7.811,20.475,0,28.285l221.857,221.857L5.858,477.859c-7.811,7.811-7.811,20.475,0,28.285c3.905,3.905,9.024,5.857,14.143,5.857c5.119,0,10.237-1.952,14.143-5.857L256,284.287l221.857,221.857c3.905,3.905,9.024,5.857,14.143,5.857s10.237-1.952,14.143-5.857c7.811-7.811,7.811-20.475,0-28.285L284.286,256.002z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
        </button>
      </header>
      <main>
        <div className="logs-container">
          {logs.map((log, i) => (
            <div className="log-line" key={i}>
              {log}
            </div>
          ))}
        </div>
      </main>
    </Modal>
  );
};

export default LogDialog;
