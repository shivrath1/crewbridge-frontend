import { useEffect, useState } from 'react';
import api from './api';
import './App.css';

function App() {
  const [status, setStatus] = useState<string>('checking...');

  useEffect(() => {
    api
      .get('/health/')
      .then((res) => setStatus(JSON.stringify(res.data)))
      .catch((err) => setStatus('Error: ' + err.message));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Crewbridge</h1>
      <p>Backend health check:</p>
      <pre>{status}</pre>
    </div>
  );
}

export default App;