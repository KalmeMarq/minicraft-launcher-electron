import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import WhatsNewDialog from '../../../../components/WhatsNewDialog';
import { AboutContext } from '../../../../utils/AboutContext';
import { PatchNotesContext } from '../../../../utils/PatchNotesContext';
import { TL } from '../../../../utils/TL';
import { codes, ExtraTranslationContext } from '../../../../utils/tltranslations';
import { BorderedButton } from '../../../Minicraft/pages/Installations';
import './index.scss';

const AboutPage = () => {
  const [showDialog, setShowDialog] = useState(false);

  const { launcher } = useContext(PatchNotesContext);
  const { version } = useContext(AboutContext);
  const code = useContext(ExtraTranslationContext);

  return (
    <div className="sub-page">
      <WhatsNewDialog isOpen={showDialog} onClose={() => setShowDialog(false)} />
      <div className="about-cont">
        <div className="about-section">
          <h3>Launcher</h3>
          <p>{version}</p>
          <p>
            {launcher.length > 0 &&
              (() => {
                let d = dayjs(launcher[0].date).locale(codes[code]).format('LLLL');
                d = d.substring(0, d.lastIndexOf(' '));
                d = d.substring(0, d.lastIndexOf(' '));
                d = d[0].toUpperCase() + d.substring(1);
                return d;
              })()}
          </p>
          <BorderedButton
            text="What's new?"
            type="normal"
            onClick={() => {
              setShowDialog(true);
            }}
          />
          <a href="https://github.com/KalmeMarq/minicraft-launcher/issues" target="_blank" rel="noopener noreferrer">
            <TL>Report a Launcher bug</TL>
          </a>
        </div>
        <div className="divider"></div>
        <div className="about-section">
          <h3>
            <TL>Credits</TL>
          </h3>
          <p>
            <TL>Made by</TL> KalmeMarq
          </p>
        </div>
        <div className="divider"></div>
        <div className="about-section links-section">
          <h3>Links</h3>
          <a href="https://discord.gg/SMKCVuj" target="_blank" rel="noopener noreferrer">
            <TL>Join Minicraft+ Discord</TL>
          </a>
          <a href="https://playminicraft.com/" target="_blank" rel="noopener noreferrer">
            Play Minicraft
          </a>
          <a href="https://minicraft.fandom.com/wiki/Minicraft%2B" target="_blank" rel="noopener noreferrer">
            Minicraft+ Wiki
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
