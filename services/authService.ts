
import { SimulatedUser } from '../types';
import { ACCOUNT_IS_EMAIL_PASSWORD_ERROR, ACCOUNT_IS_GOOGLE_LOGIN_ERROR, USER_ALREADY_EXISTS_ERROR, INVALID_CREDENTIALS_ERROR, GOOGLE_USER_NOT_FOUND_ERROR } from '../constants';


const USERS_DB_KEY = 'simulatedUsersDB';
const CURRENT_USER_SESSION_KEY = 'currentUserSessionId';

// Helper to get users from localStorage
const getUsersFromStorage = (): SimulatedUser[] => {
  try {
    const usersJson = localStorage.getItem(USERS_DB_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return [];
  }
};

// Helper to save users to localStorage
const saveUsersToStorage = (users: SimulatedUser[]): void => {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

// Simulated password hash (DO NOT USE IN PRODUCTION)
const simulatePasswordHash = (password: string): string => `${password}_hashed_simulated`;

export const registerUser = async (email: string, password?: string): Promise<{ success: boolean; message?: string; user?: SimulatedUser }> => {
  return new Promise(resolve => {
    setTimeout(() => { // Simulate network delay
      const users = getUsersFromStorage();
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        resolve({ success: false, message: USER_ALREADY_EXISTS_ERROR });
        return;
      }
      const newUser: SimulatedUser = {
        id: `user_${new Date().getTime()}`,
        email: email.toLowerCase(),
        isGoogleLogin: false, // Standard registration is not Google login
      };
      
      // @ts-ignore _simulatedPasswordHash is a temporary property for this service
      const usersWithPasswordData = [...users, {...newUser, _simulatedPasswordHash: password ? simulatePasswordHash(password) : undefined }];
      saveUsersToStorage(usersWithPasswordData);

      resolve({ success: true, user: newUser });
    }, 500);
  });
};

export const loginUser = async (email: string, password?: string): Promise<{ success: boolean; message?: string; user?: SimulatedUser }> => {
  return new Promise(resolve => {
    setTimeout(() => { // Simulate network delay
      const users = getUsersFromStorage(); 
      const foundUserEntry = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!foundUserEntry) {
        resolve({ success: false, message: INVALID_CREDENTIALS_ERROR });
        return;
      }

      // This is an email/password login attempt
      if (password) { 
        if (foundUserEntry.isGoogleLogin) {
            // Trying to log in with email/pass to a Google account
            resolve({ success: false, message: ACCOUNT_IS_GOOGLE_LOGIN_ERROR }); 
            return;
        }
        // @ts-ignore _simulatedPasswordHash is a temporary property for this service
        if (foundUserEntry._simulatedPasswordHash !== simulatePasswordHash(password)) {
          resolve({ success: false, message: INVALID_CREDENTIALS_ERROR });
          return;
        }
      } else {
          // This path is for loginWithGoogleOnlySimulated.
          // If loginUser is called directly without password, it implies a Google login attempt on an email/pass account.
          if (!foundUserEntry.isGoogleLogin) {
              resolve({ success: false, message: ACCOUNT_IS_EMAIL_PASSWORD_ERROR });
              return;
          }
      }
      

      const userToReturn: SimulatedUser = {
          id: foundUserEntry.id,
          email: foundUserEntry.email,
          isGoogleLogin: foundUserEntry.isGoogleLogin,
      };

      localStorage.setItem(CURRENT_USER_SESSION_KEY, userToReturn.id);
      resolve({ success: true, user: userToReturn });
    }, 500);
  });
};

// This function handles registration via Google or logs in if Google user already exists.
export const signInOrRegisterWithGoogleSimulated = async (email: string): Promise<{ success: boolean; message?: string; user?: SimulatedUser }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            let users = getUsersFromStorage();
            let foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (foundUser) {
                if (!foundUser.isGoogleLogin) {
                    // Account exists but was created with email/password
                    resolve({ success: false, message: ACCOUNT_IS_EMAIL_PASSWORD_ERROR }); 
                    return;
                }
                // User exists and is a Google login user - log them in
                const userToReturn: SimulatedUser = { id: foundUser.id, email: foundUser.email, isGoogleLogin: true };
                localStorage.setItem(CURRENT_USER_SESSION_KEY, userToReturn.id);
                resolve({ success: true, user: userToReturn });
            } else {
                // New Google user (Registration via Google)
                const newUser: SimulatedUser = {
                    id: `user_${new Date().getTime()}`,
                    email: email.toLowerCase(),
                    isGoogleLogin: true,
                };
                saveUsersToStorage([...users, newUser]); // Save the new Google user
                localStorage.setItem(CURRENT_USER_SESSION_KEY, newUser.id);
                resolve({ success: true, user: newUser });
            }
        }, 500);
    });
};

// This function strictly tries to log in an existing Google user.
export const loginWithGoogleOnlySimulated = async (email: string): Promise<{ success: boolean; message?: string; user?: SimulatedUser }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const users = getUsersFromStorage();
            const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (foundUser) {
                if (!foundUser.isGoogleLogin) {
                    // Account exists but is an email/password account
                    resolve({ success: false, message: ACCOUNT_IS_EMAIL_PASSWORD_ERROR });
                } else {
                    // Account exists and is a Google account - log them in
                    const userToReturn: SimulatedUser = { id: foundUser.id, email: foundUser.email, isGoogleLogin: true };
                    localStorage.setItem(CURRENT_USER_SESSION_KEY, userToReturn.id);
                    resolve({ success: true, user: userToReturn });
                }
            } else {
                // User not found
                resolve({ success: false, message: GOOGLE_USER_NOT_FOUND_ERROR });
            }
        }, 500);
    });
};


export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_SESSION_KEY);
};

export const getCurrentUser = (): SimulatedUser | null => {
  try {
    const userId = localStorage.getItem(CURRENT_USER_SESSION_KEY);
    if (!userId) return null;

    const users = getUsersFromStorage();
    const userEntry = users.find(u => u.id === userId);
    if (!userEntry) {
        logoutUser(); // Clean up session if user ID is stale
        return null;
    }
    return {
        id: userEntry.id,
        email: userEntry.email,
        isGoogleLogin: userEntry.isGoogleLogin
    };

  } catch (error) {
    console.error("Error retrieving current user:", error);
    return null;
  }
};
