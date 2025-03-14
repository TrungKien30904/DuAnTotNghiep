import React from 'react';
import './spinner.css'
import { TailSpin } from 'react-loader-spinner'; 

const Spinner = () => (
  <div className="spinner-overlay">
    <div className='spinner-container'>
    <TailSpin color="#00BFFF" height={50} width={50} />
    <span className="loading-text">Loading...</span>
    </div>
  </div>
);

export default Spinner;
