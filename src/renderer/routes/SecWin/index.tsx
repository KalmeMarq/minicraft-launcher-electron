import { useState } from 'react';

const SecWin = () => {
  document.title = 'Minicraft game output';
  const [logs, setLogs] = useState<string[]>([]);

  return (
    <div>
      <h1>Test Second Window Content</h1>
    </div>
  );
};

export default SecWin;
