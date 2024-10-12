// PasswordModal.js
import React from 'react';

const PasswordModal = ({ password, setPassword, onConfirm, onCancel }) => {
  return (
    <div className="password-modal-overlay">
      <div className="password-modal">
        <h3>Confirm Action</h3>
        <p>Please enter your password to proceed:</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <div className="modal-buttons">
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
