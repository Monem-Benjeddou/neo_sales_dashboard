import { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { login, clearError } from '../redux/authSlice';
import { LoginCredentials } from '../types';

interface UseLoginResult {
  username: string;
  password: string;
  usernameError: string | null;
  passwordError: string | null;
  formError: string | null;
  setUserName: (username: string) => void;
  setPassword: (password: string) => void;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  clearFormError: () => void;
}

/**
 * Custom hook for handling login form state and submission
 */
export const useLogin = (): UseLoginResult => {
  const dispatch = useAppDispatch();
  
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  
  const [usernameError, setusernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const clearFormError = () => {
    dispatch(clearError());
    setFormError(null);
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    
    setusernameError(null);
    setPasswordError(null);
    setFormError(null);

    let isValid = true;

    if (!username) {
      setusernameError('Please enter your username');
      isValid = false;
    } 

    if (!password) {
      setPasswordError('Please enter your password');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    try {
      // Call the login action from Redux
      const resultAction = await dispatch(login({ username, password }));
      
      // Check if the login was rejected
      if (login.rejected.match(resultAction)) {
        // Display error message if login fails
        setFormError(resultAction.payload as string || 'Login failed');
      }
    } catch (err: any) {
      // Handle any unexpected errors
      setFormError(err.message || 'Login failed');
    }
  };

  return {
    username,
    password,
    usernameError,
    passwordError,
    formError,
    setUserName,
    setPassword,
    handleSubmit,
    clearFormError
  };
};