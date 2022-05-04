import MainMenuTab, { MainMenuTabButton } from '@renderer/components/MainMenu/components/MainMenuTab';
import miniIcon from '@renderer/assets/icons/minicraft_icon.png';
import settingsIcon from '@renderer/assets/icons/settings_icon.png';
import lnewsIcon from '@renderer/assets/icons/lnew_icon.png';
import comIcon from '@renderer/assets/icons/store_icon.png';
import '@renderer/components/MainMenu/index.scss';
import { useContext, useState } from 'react';
import WhatsNewDialog from '@renderer/components/WhatsNewDialog';
import { TL } from '@renderer/utils/TL';
import { SettingsContext } from '@renderer/utils/SettingsContext';

const MainMenu = () => {
  const [showDialog, setShowDialog] = useState(false);
  const { showCommunityTab } = useContext(SettingsContext);

  return (
    <div className="main-menu">
      <WhatsNewDialog isOpen={showDialog} onClose={() => setShowDialog(false)} />
      <MainMenuTab to="/minicraft" tooltip="Minicraft" icon={miniIcon}>
        Minicraft
      </MainMenuTab>
      {showCommunityTab && (
        <MainMenuTab to="/community" tooltip="Community" icon={comIcon}>
          <TL>Community</TL>
        </MainMenuTab>
      )}
      <div className="filler"></div>
      <MainMenuTabButton
        onClick={() => {
          setShowDialog(true);
        }}
        tooltip="What's New"
        icon={lnewsIcon}
      >
        <TL>What's New</TL>
      </MainMenuTabButton>
      <MainMenuTab to="/settings" tooltip="Settings" icon={settingsIcon}>
        <TL>Settings</TL>
      </MainMenuTab>
    </div>
  );
};

export default MainMenu;
