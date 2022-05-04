import { NavLink } from 'react-router-dom';
import { TL, useTLTranslation } from '../../utils/TL';
import './index.scss';

const SubMenuLink: React.FC<{ to: string; title?: string; text: string }> = ({ to, text, title }) => {
  const { tl } = useTLTranslation();

  return (
    <li>
      <NavLink className={(prop) => (prop.isActive ? 'active' : '')} title={tl(title ?? text)} to={to}>
        <TL>{text}</TL>
      </NavLink>
    </li>
  );
};

const SubMenuTitle: React.FC<{ text: string }> = ({ text }) => {
  return (
    <h2>
      <TL>{text}</TL>
    </h2>
  );
};

const SubMenuNavbar: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <nav>
      <ul>{children}</ul>
    </nav>
  );
};

const SubMenu: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <header className="submenu">{children}</header>;
};

export default Object.assign(SubMenu, {
  Navbar: SubMenuNavbar,
  Link: SubMenuLink,
  Title: SubMenuTitle
});
