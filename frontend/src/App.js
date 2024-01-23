import logo from './logo.svg';
import './App.css';
import { useState } from 'react'; // Import useState hook

function App() {
  const [data, setData] = useState(null); // Create state variable
  
  // Query port 5001 to test if backend is running
  fetch('http://localhost:5001/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())
    .then(data => setData(data.message)); // Set data in state

  return (
    <div className="App">
      <header className="App-header">
        {/* Show data */}
        <p className='text-8xl font-bold'>{!data ? 'Loading...' : data}</p>
        <img src={logo} className="App-logo" alt="logo" />
        <p className='text-pink-400'>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p className='text-blue-400 text-5xl m-6'>
          If this is blue, Tailwind is working!
        </p>
        
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
