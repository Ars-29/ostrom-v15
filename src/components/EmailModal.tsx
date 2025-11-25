import React, { useState } from 'react';
import { requestPassword } from '../utils/api';
import './EmailModal.scss';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  secretsFound: {
    street: number;
    road: number;
    plane: number;
  };
  totalFound: number;
  totalLabels: number;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  secretsFound,
  totalFound,
  totalLabels,
}) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic email validation
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // First name validation
    if (!firstName.trim()) {
      setError('Please enter your first name');
      return;
    }

    setIsLoading(true);

    try {
      const response = await requestPassword(
        email,
        firstName.trim(),
        secretsFound,
        totalFound,
        totalLabels
      );

      if (response.success) {
        setSuccess(true);
        // Store email in sessionStorage for password verification
        sessionStorage.setItem('hiddenChamberEmail', email);
        // Store email in localStorage to prevent duplicate requests
        localStorage.setItem('passwordRequestEmail', email);
        localStorage.setItem('passwordRequestTime', Date.now().toString());
        
        // Call onSuccess after a short delay
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail('');
      setFirstName('');
      setError('');
      setSuccess(false);
      setIsLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="email-modal-overlay" onClick={handleClose}>
      <div className="email-modal" onClick={(e) => e.stopPropagation()}>
        <button className="email-modal-close" onClick={handleClose}>
          ×
        </button>
        
        <div className="email-modal-content">
          {success ? (
            <>
              <h2 className="email-modal-title">Password Requested!</h2>
              <p className="email-modal-message">
                Your password will be sent to <strong>{email}</strong> shortly.
                <br />
                <br />
                Please check your inbox (and spam folder) for access to The Masked Sanctuary.
              </p>
              <div className="email-modal-success-icon">✓</div>
            </>
          ) : (
            <>
              <h2 className="email-modal-title">Congratulations!</h2>
              <p className="email-modal-message">
                You've discovered all {totalLabels} secrets!
                <br />
                <br />
                Enter your email address to receive your unique password for The Masked Sanctuary.
              </p>
              
              <form onSubmit={handleSubmit} className="email-modal-form">
                <div className="email-modal-input-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your first name"
                    required
                    autoFocus
                    disabled={isLoading}
                    className={error && !firstName.trim() ? 'error' : ''}
                  />
                </div>
                
                <div className="email-modal-input-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    disabled={isLoading}
                    className={error && !emailRegex.test(email) ? 'error' : ''}
                  />
                  {error && <p className="email-modal-error">{error}</p>}
                </div>
                
                <div className="email-modal-actions">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="email-modal-btn email-modal-btn-secondary"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="email-modal-btn email-modal-btn-primary"
                    disabled={isLoading || !email.trim() || !firstName.trim()}
                  >
                    {isLoading ? 'Sending...' : 'Request Password'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


