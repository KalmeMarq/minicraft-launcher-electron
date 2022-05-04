import { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import './index.scss';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/pt';
import 'dayjs/locale/pt-br';
import 'dayjs/locale/en-gb';
import 'dayjs/locale/en';
import { TL } from '../../utils/TL';
import { PatchNotesContext } from '../../utils/PatchNotesContext';
import { codes, ExtraTranslationContext } from '../../utils/tltranslations';

dayjs.extend(LocalizedFormat);

interface IWhatsNewDialog {
  isOpen: boolean;
  onClose: () => void;
}

Modal.setAppElement('#root');

const WhatsNewDialog: React.FC<IWhatsNewDialog> = ({ isOpen, onClose }) => {
  const code = useContext(ExtraTranslationContext);
  const { launcher: notes } = useContext(PatchNotesContext)

  return (
    <Modal isOpen={isOpen} className="create-modal lnews-modal" overlayClassName="Overlay" onRequestClose={onClose}>
      <header>
        <h2>
          <TL>What's new in the Launcher?</TL>
        </h2>
        <button className="close-btn" onClick={() => onClose()}>
          {/* prettier-ignore */}
          <svg version="1.1" id="Capa_1" x="0px" className="close-icon" y="0px" viewBox="0 0 512.001 512.001" fill="white"><g><g><path stroke="white" d="M284.286,256.002L506.143,34.144c7.811-7.811,7.811-20.475,0-28.285c-7.811-7.81-20.475-7.811-28.285,0L256,227.717L34.143,5.859c-7.811-7.811-20.475-7.811-28.285,0c-7.81,7.811-7.811,20.475,0,28.285l221.857,221.857L5.858,477.859c-7.811,7.811-7.811,20.475,0,28.285c3.905,3.905,9.024,5.857,14.143,5.857c5.119,0,10.237-1.952,14.143-5.857L256,284.287l221.857,221.857c3.905,3.905,9.024,5.857,14.143,5.857s10.237-1.952,14.143-5.857c7.811-7.811,7.811-20.475,0-28.285L284.286,256.002z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
        </button>
      </header>
      <main>
        <div className="lnews-container">
          {notes.map((note, i) => (
            <div className={'lnews-note' + (i === 0 ? ' lastest' : '')}>
              <div className="lnews-note-cont">
                <h2>
                  {(() => {
                    let d = dayjs(note.date).locale(codes[code]).format('LLLL');
                    d = d.substring(0, d.lastIndexOf(' '));
                    d = d.substring(0, d.lastIndexOf(' '));
                    d = d[0].toUpperCase() + d.substring(1);
                    return d;
                  })()}
                </h2>
                <span className="lnews-version">version {note.version}</span>
                <br />
                <div
                  className="lnews-note-body"
                  dangerouslySetInnerHTML={{
                    __html: note.body
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </Modal>
  );
};

export default WhatsNewDialog;
