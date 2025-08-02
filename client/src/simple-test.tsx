import React from 'react';
import { createRoot } from "react-dom/client";

const SimpleTest = () => {
  const [count, setCount] = React.useState(0);
  
  return (
    <div style={{padding: '20px', fontFamily: 'Arial'}}>
      <h1>Simple React Test</h1>
      <p>If you see this, React is working!</p>
      <button 
        onClick={() => {
          setCount(count + 1);
          alert(`Button clicked ${count + 1} times!`);
        }}
        style={{padding: '10px 20px', fontSize: '16px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px'}}
      >
        Click me: {count}
      </button>
      <div style={{marginTop: '20px', padding: '10px', background: '#f0f0f0'}}>
        <strong>Debug Info:</strong>
        <div>Count: {count}</div>
        <div>Time: {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

// Replace the main app temporarily
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<SimpleTest />);
}

export default SimpleTest;