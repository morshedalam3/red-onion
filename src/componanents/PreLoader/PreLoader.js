import React from 'react';
import './PreLoader.css';
const PreLoader = () => {
    return (
        <div id="main_loading">
        <div className="loading">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
      </div>
    );
  };

export default PreLoader;