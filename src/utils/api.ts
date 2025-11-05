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
    const url = `${API_BASE_URL}/api/auth/verify-password`;
    const requestBody = { password };
    
    console.log('🔐 [API] verifyPassword - Request:', {
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': email,
      },
      body: requestBody,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': email,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    console.log('🔐 [API] verifyPassword - Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      data,
    });

    if (!response.ok) {
      throw new Error(data.message || 'Password verification failed');
    }

    return data;
  } catch (error) {
    console.error('❌ [API] verifyPassword - Error:', error);
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
    const url = `${API_BASE_URL}/api/auth/request-password`;
    const requestBody = {
      email,
      firstName,
      secretsFound,
      totalFound,
      totalLabels,
    };

    console.log('📧 [API] requestPassword - Request:', {
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    console.log('📧 [API] requestPassword - Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      data,
    });

    if (!response.ok) {
      throw new Error(data.message || 'Password request failed');
    }

    return data;
  } catch (error) {
    console.error('❌ [API] requestPassword - Error:', error);
    throw error;
  }
}


