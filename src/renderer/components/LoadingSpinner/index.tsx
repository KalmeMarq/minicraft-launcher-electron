import '@renderer/components/LoadingSpinner/index.scss';

const LoadingSpinner: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  return (
    <div style={Object.assign({ position: 'relative', height: '100%' }, style)}>
      {/* <div className="loader">
        <div className="loaders0"></div>
        <div className="loaders1"></div>
        <div className="loaders2"></div>
        <div className="loaders3"></div>
      </div> */}
      <div className="nloader">
        <div className="nloaders nloader1"></div>
        <div className="nloaders nloader2"></div>
        <div className="nloaders nloader4"></div>
        <div className="nloaders nloader3"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
