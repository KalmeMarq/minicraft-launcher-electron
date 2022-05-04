import { Navigate, Route, Routes } from 'react-router-dom';
import SubMenu from '../../components/SubMenu';
import AboutPage from './pages/About';
import GeneralPage from './pages/General';
import VersionsPage from './pages/Versions';

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
      <Routes>
        <Route path="/" element={<Navigate to="/settings/general" replace />} />
        <Route path="/general" element={<GeneralPage />} />
        <Route path="/versions" element={<VersionsPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
};

export default SettingsRoute;
