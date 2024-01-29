'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchBackend = async () => {
      const response = await fetch('http://localhost:5001/');
      const data = await response.json();

      setData(data.message);
    };

    fetchBackend();
  });
    
  return (
    <div>
      <h1 className='text-4xl'>Home</h1>
      <p>{!data ? 'Connecting to backend...' : data}</p>
    </div>
  );
}