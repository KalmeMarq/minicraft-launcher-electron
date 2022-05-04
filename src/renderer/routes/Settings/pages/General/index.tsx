import React, { useContext, useState } from 'react';
import checkmark from '../../../../assets/icons/optionmark.png';
import Dropdown from '../../../../components/Dropdown';
import { SettingsContext } from '../../../../utils/SettingsContext';
import { TL } from '../../../../utils/TL';
import { ExtraTranslationContext } from '../../../../utils/tltranslations';
import './index.scss';

export const Checkbox: React.FC<{ children?: React.ReactNode; value: boolean; propKey: string; onChange?: (value: boolean, propKey: string) => void }> = ({ value, propKey, children, onChange }) => {
  const [checked, setChecked] = useState(value);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    if (onChange) onChange(e.target.checked, propKey);
  };

  return (
    <div className="checkbox">
      <label>
        <div className="check-box">
          <input type="checkbox" checked={checked} onChange={handleCheckboxChange} />
          <div className="check-fake">
            <img src={checkmark} alt="" className="check" />
          </div>
        </div>
        <span>{children}</span>
      </label>
    </div>
  );
};

const langs = ['en-US', 'en-GB', 'pt-PT', 'pt-BR'];
const langsD = langs.map((l) => {
  return { text: l };
});

const GeneralPage = () => {
  const code = useContext(ExtraTranslationContext);
  const { showCommunityTab, keepLauncherOpen, openOutputLog, setOption } = useContext(SettingsContext);

  return (
    <div className="sub-page general-cont">
      <div className="install-input-cont">
        <label>
          <TL>Language</TL>
        </label>
        <Dropdown
          data={langsD}
          width={330}
          value={langs.findIndex((v) => v === code)}
          onChange={(i) => {
            window.ipcRenderer.send('ipc:set_option', 'language', langs[i]);
          }}
        />
      </div>
      <h3>
        <TL>Launcher Settings</TL>
      </h3>
      <Checkbox
        value={keepLauncherOpen}
        propKey="keepLauncherOpen"
        onChange={(v, k) => {
          setOption(k, v);
        }}
      >
        <TL>Keep the Launcher open while games are running</TL>
      </Checkbox>
      <Checkbox
        value={showCommunityTab}
        propKey="showCommunityTab"
        onChange={(v, k) => {
          setOption(k, v);
        }}
      >
        <TL>Show community tab</TL>
      </Checkbox>
      <h3>Minicraft Settings</h3>
      <Checkbox
        value={openOutputLog}
        propKey="openOutputLog"
        onChange={(v, k) => {
          setOption(k, v);
        }}
      >
        <TL>Open output log when Minicraft starts</TL>
      </Checkbox>
    </div>
  );
};

export default GeneralPage;
