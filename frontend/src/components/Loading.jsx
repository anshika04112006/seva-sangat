import React from 'react';
import { Loader } from 'lucide-react';
import '../assets/styles/index.css';

const Loading = () => {
  return (
    <div className="loading-screen">
      <div className="loader-content">
        <Loader className="spin" size={48} color="var(--primary)" />
        <p>Gearing up for GIVING...</p>
      </div>
    </div>
  );
};

export default Loading;
