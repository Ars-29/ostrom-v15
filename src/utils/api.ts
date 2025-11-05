/**
 * API Service for The Hidden Chamber Authentication
 * 
 * ENDPOINTS DOCUMENTATION:
 * 
 * 1. POST /api/auth/verify-password
 *    Purpose: Verify password for accessing The Hidden Chamber
 *    Request Body:
 *      {
 *        password: string
 *      }
 *    Response Success (200):
 *      {
 *        success: true,
 *        message: "Password verified successfully",
 *        token?: string (optional, for session management)
 *      }
 *    Response Error (401):
 *      {
 *        success: false,
 *        message: "Invalid password"
 *      }
 * 
 * 2. POST /api/auth/request-password
 *    Purpose: Request password to be sent to user's email
 *    Request Body:
 *      {
 *        email: string,
 *        secretsFound: {
 *          street: number,
 *          road: number,
 *          plane: number
 *        },
 *        totalFound: number,
 *        totalLabels: number
 *      }
 *    Response Success (200):
 *      {
 *        success: true,
 *        message: "Password will be sent to your email shortly"
 *      }
 *    Response Error (400):
 *      {
 *        success: false,
 *        message: "Invalid email address" | "Email already registered" | "All secrets not found"
 *      }
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ostorm-auth-api-production.up.railway.app';

export interface VerifyPasswordRequest {
  password: string;
}

export interface VerifyPasswordResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface RequestPasswordRequest {
  email: string;
  firstName: string;
  secretsFound: {
    street: number;
    road: number;
    plane: number;
  };
  totalFound: number;
  totalLabels: number;
}

export interface RequestPasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Verify password for The Hidden Chamber access
 */
export async function verifyPassword(
  password: string,
  email: string
): Promise<VerifyPasswordResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': email,
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Password verification failed');
    }

    return data;
  } catch (error) {
    console.error('Password verification error:', error);
    throw error;
  }
}

/**
 * Request password to be sent via email
 */
export async function requestPassword(
  email: string,
  firstName: string,
  secretsFound: { street: number; road: number; plane: number },
  totalFound: number,
  totalLabels: number
): Promise<RequestPasswordResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/request-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        firstName,
        secretsFound,
        totalFound,
        totalLabels,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Password request failed');
    }

    return data;
  } catch (error) {
    console.error('Password request error:', error);
    throw error;
  }
}


