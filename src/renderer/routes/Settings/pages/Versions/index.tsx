import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { BorderedButton } from '../../../Minicraft/pages/Installations';
import folderIcon from '../../../../assets/icons/folder.png';
import './index.scss';
import filesize from 'filesize';
import SearchBox from '../../../../components/SearchBox';
import { TL, useTLTranslation } from '../../../../utils/TL';

const VersionsPage = () => {
  const [versions, setVersions] = useState<{ id: string; size: number }[]>([]);
  const [results, setResults] = useState(0);
  const [filterText, setFilterText] = useState('');

  const { tl } = useTLTranslation();

  const handleFilterTextChange = (value: string) => {
    setFilterText(value);
    if (value === '') setResults(0);
    if (value !== '') setResults(versions.filter((v) => v.id.toLowerCase().includes(value.toLowerCase())).length);
  };

  useEffect(() => {
    window.ipcRenderer.invoke('ipc:getInstalledVersions').then((d) => setVersions(d));
  }, []);

  return (
    <div className="sub-page versions-sp left">
      {versions.length === 0 && <LoadingSpinner />}
      {versions.length !== 0 && (
        <div className="filter-section">
          <div className="filter-cont">
            <h3>
              <TL>Search</TL>
            </h3>
            <SearchBox results={results} value={filterText} handleFilter={handleFilterTextChange} placeholder={tl('Version id')} />
          </div>
          <div className="divider"></div>
        </div>
      )}
      <div className="version-list">
        {versions.map((version, i) => (
          <React.Fragment key={version.id}>
            {i !== 0 && <div className="divider" style={{ display: filterText === '' || version.id.toLowerCase().includes(filterText.toLowerCase()) ? 'block' : 'none' }}></div>}
            <div className="version-item" style={{ display: filterText === '' || version.id.toLowerCase().includes(filterText.toLowerCase()) ? 'flex' : 'none' }}>
              <button className="version-btn">
                <div className="version-info">
                  <p>{version.id}</p>
                  <span>{filesize(version.size)}</span>
                </div>
                <div className="version-tools">
                  <BorderedButton
                    icon={folderIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.ipcRenderer.send('ipc:openInstalledVersion', version.id);
                    }}
                  />
                  <BorderedButton
                    text="Delete"
                    type="normal"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.ipcRenderer.send('ipc:deleteInstalledVersion', version.id);
                      setVersions((vers) => vers.filter((v) => v.id !== version.id));
                    }}
                  />
                </div>
              </button>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default VersionsPage;
