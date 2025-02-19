import React, { useState } from 'react';
import Alert from '../components/Alert';

export default function Brand() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleAlertClose = (confirm) => {
    setAlertOpen(false);
    if (confirm) {
      // Handle the confirmation action here
      console.log('User confirmed the action');
    } else {
      // Handle the cancellation action here
      console.log('User cancelled the action');
    }
  };

  const showAlert = () => {
    setAlertOpen(true);
  };

  return (
    <div>
      <Alert
        message={alertMessage}
        open={alertOpen}
        onClose={handleAlertClose}
      />
      <button onClick={showAlert}>Delete Brand</button>
    </div>
  );
}
