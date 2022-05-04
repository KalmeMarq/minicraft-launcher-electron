import Modal from 'react-modal';
import { TL } from '../../../../../../utils/TL';
import './index.scss';
import DOMPurify from 'dompurify'

interface IPatchNoteDialog {
  patch: {
    title: string;
    version: string;
    body: string;
    id: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

Modal.setAppElement('#root');

const PatchNoteDialog: React.FC<IPatchNoteDialog> = ({ patch, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} className="create-modal patch-modal" overlayClassName="Overlay" onRequestClose={onClose}>
      <header>
        <h2><TL>Patch Notes</TL> {patch.title} ({patch.version})</h2>
        <button className="close-btn" onClick={() => onClose()}>
          {/* prettier-ignore */}
          <svg version="1.1" id="Capa_1" x="0px" className="close-icon" y="0px" viewBox="0 0 512.001 512.001" fill="white"><g><g><path stroke="white" d="M284.286,256.002L506.143,34.144c7.811-7.811,7.811-20.475,0-28.285c-7.811-7.81-20.475-7.811-28.285,0L256,227.717L34.143,5.859c-7.811-7.811-20.475-7.811-28.285,0c-7.81,7.811-7.811,20.475,0,28.285l221.857,221.857L5.858,477.859c-7.811,7.811-7.811,20.475,0,28.285c3.905,3.905,9.024,5.857,14.143,5.857c5.119,0,10.237-1.952,14.143-5.857L256,284.287l221.857,221.857c3.905,3.905,9.024,5.857,14.143,5.857s10.237-1.952,14.143-5.857c7.811-7.811,7.811-20.475,0-28.285L284.286,256.002z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
        </button>
      </header>
      <main>
        <div
          className="container"
          dangerouslySetInnerHTML={{
            __html: patch.body
          }}
        ></div>
      </main>
    </Modal>
  );
};

export default PatchNoteDialog;
