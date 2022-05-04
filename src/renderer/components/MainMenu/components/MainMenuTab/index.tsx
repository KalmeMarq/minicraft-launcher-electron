import { NavLink } from 'react-router-dom';
import { useTLTranslation } from '@renderer/utils/TL';
import '@renderer/components/MainMenu/components/MainMenuTab/index.scss';

interface IMainMenuTabButton {
  onClick: React.MouseEventHandler;
  tooltip: string;
  icon: string;
  children?: React.ReactNode;
}

interface IMainMenuTab {
  to: string;
  tooltip: string;
  icon: string;
  children?: React.ReactNode;
}

export const MainMenuTabButton: React.FC<IMainMenuTabButton> = ({ onClick, tooltip, icon, children }) => {
  const { tl } = useTLTranslation();

  return (
    <div className="mainmenu-tab">
      <button title={tl(tooltip)} onClick={onClick} className="mainmenu-tab-inside">
        <div className="mainmenu-tab-icon">
          <img src={icon} alt={icon} />
        </div>
        <div className="mainmenu-tab-cont">{children}</div>
      </button>
    </div>
  );
};

const MainMenuTab: React.FC<IMainMenuTab> = ({ to, tooltip, icon, children }) => {
  const { tl } = useTLTranslation();

  return (
    <div className="mainmenu-tab">
      <NavLink title={tl(tooltip)} to={to} className={(act) => (act.isActive ? 'mainmenu-tab-inside active' : 'mainmenu-tab-inside')}>
        <div className="mainmenu-tab-icon">
          <img src={icon} alt={icon} />
        </div>
        <div className="mainmenu-tab-cont">{children}</div>
      </NavLink>
    </div>
  );
};

export default MainMenuTab;
