import searchIcon from '../../assets/icons/search.png';
import cancelIcon from '../../assets/icons/cancel.png';
import { FC } from 'react';
import './index.scss';

interface ISearchBox {
  handleEnter?: (e: React.KeyboardEvent) => void;
  handleFilter?: (value: string) => void;
  results?: number;
  placeholder?: string;
  value?: string;
}

const SearchBox: FC<ISearchBox> = ({ value, results, handleEnter, handleFilter, placeholder }) => {
  return (
    <div className="searchbox">
      <img src={searchIcon} className="search-icon" />
      <input
        title="Search"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleFilter && handleFilter(e.target.value)}
        onKeyDown={(e) => {
          if (e.code === 'Enter') e.preventDefault();
          if (handleEnter) handleEnter(e);
        }}
      />
      {value !== '' && (
        <button className="reset-btn" onClick={() => handleFilter && handleFilter('')}>
          <img src={cancelIcon} />
        </button>
      )}
      {results && value !== '' && <p className="results">{results} Results</p>}
    </div>
  );
};

export default SearchBox;
