import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import SubMenu from '../../components/SubMenu';
import AboutPage from './pages/About';
import GeneralPage from './pages/General';
import VersionsPage from './pages/Versions';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import React, { useContext } from 'react';
import { SettingsContext } from '@renderer/utils/SettingsContext';

export const SubPageAnimator: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { animatePages } = useContext(SettingsContext);
  const location = useLocation();
  const timeout = { enter: 300, exit: 0 };

  return (
    <>
      {animatePages && (
        <TransitionGroup>
          <CSSTransition key={location.pathname} classNames="right-to-left" mountOnEnter={false} unmountOnExit timeout={timeout}>
            {children}
          </CSSTransition>
        </TransitionGroup>
      )}
      {!animatePages && children}
    </>
  );
};

const SettingsRoute = () => {
  return (
    <div className="base-route">
      <SubMenu>
        <SubMenu.Title text="Settings" />
        <SubMenu.Navbar>
          <SubMenu.Link to="/settings/general" text="General" />
          <SubMenu.Link to="/settings/versions" text="Versions" />
          <SubMenu.Link to="/settings/about" text="About" />
        </SubMenu.Navbar>
      </SubMenu>
      <SubPageAnimator>
        <Routes>
          <Route path="/" element={<Navigate to="/settings/general" replace />} />
          <Route path="/general" element={<GeneralPage />} />
          <Route path="/versions" element={<VersionsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </SubPageAnimator>
    </div>
  );
};

export default SettingsRoute;
