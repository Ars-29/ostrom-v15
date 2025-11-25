import React, { useState } from 'react';
import { verifyPassword } from '../utils/api';
import './PasswordModal.scss';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  message?: string;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Enter The Masked Sanctuary',
  message = 'Please enter your password to access The Masked Sanctuary.',
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Get email from sessionStorage (stored when password was requested)
      const email = sessionStorage.getItem('hiddenChamberEmail');
      
      if (!email) {
        setError('Email not found. Please request a password first.');
        setIsLoading(false);
        return;
      }

      const response = await verifyPassword(password, email);
      
      if (response.success) {
        // Store token if provided
        if (response.token) {
          localStorage.setItem('hiddenChamberToken', response.token);
        }
        // Store password verification in session
        sessionStorage.setItem('passwordVerified', 'true');
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Invalid password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="password-modal-overlay" onClick={handleClose}>
      <div className="password-modal" onClick={(e) => e.stopPropagation()}>
        <button className="password-modal-close" onClick={handleClose}>
          ×
        </button>
        
        <div className="password-modal-content">
          <h2 className="password-modal-title">{title}</h2>
          <p className="password-modal-message">{message}</p>
          
          <form onSubmit={handleSubmit} className="password-modal-form">
            <div className="password-modal-input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoFocus
                disabled={isLoading}
                className={error ? 'error' : ''}
              />
              {error && <p className="password-modal-error">{error}</p>}
            </div>
            
            <div className="password-modal-actions">
              <button
                type="button"
                onClick={handleClose}
                className="password-modal-btn password-modal-btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="password-modal-btn password-modal-btn-primary"
                disabled={isLoading || !password.trim()}
              >
                {isLoading ? 'Verifying...' : 'Enter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


