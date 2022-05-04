import './index.scss';

const PlayButton: React.FC<{ children?: React.ReactNode; width: number; onClick?: () => void }> = ({ width, children, onClick }) => {
  return (
    <button className="play-btn-text" onClick={onClick}>
      {typeof children === 'string' ? <span>{children}</span> : children}
    </button>
  );
};

export default PlayButton;
