import React, { createContext, useContext, useState, ReactNode } from "react";

/**
 * UserContext stores information about the currently authenticated user
 * along with helper functions to award or deduct credits and update
 * verification status. In a real application these values would be
 * persisted to a backend; here they live in memory and reset on page
 * refresh. The default user starts with zero credits and is not
 * verified. You can customise the initial values by editing
 * `defaultUser` below.
 */

// Shape of our user state. Extend this interface when adding new
// fields, for example to track badges or business accounts.
export interface User {
  id: string;
  name: string;
  credits: number;
  verified: boolean;
  isBusiness: boolean;
  firstProfilePhotoChanged: boolean;
  firstCoverPhotoChanged: boolean;
}

// Initial user values. In a real app these would be fetched from an API
// after authentication. Here we hardcode a single user.
const defaultUser: User = {
  id: "1",
  name: "Utilisateur",
  credits: 0,
  verified: false,
  isBusiness: false,
  firstProfilePhotoChanged: false,
  firstCoverPhotoChanged: false,
};

// Define the context shape: includes the user and functions to modify
// credits and verification status. You can add more actions here as
// needed (e.g. to register a business account or complete profile).
interface UserContextValue {
  user: User;
  addCredits: (amount: number) => void;
  deductCredits: (amount: number) => boolean;
  setVerified: (verified: boolean) => void;
  markProfilePhotoChanged: () => void;
  markCoverPhotoChanged: () => void;
  /**
   * Update the user's name. In a real application this would also
   * persist the change to a backend or Firebase. Here we simply
   * update local state.
   */
  updateName: (name: string) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

/**
 * Provider component that wraps your app and makes the user state
 * available via the context. It encapsulates all logic for updating
 * credits and verification flags.
 */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);

  // Increase the user's credits by the given amount
  const addCredits = (amount: number) => {
    setUser((prev) => ({ ...prev, credits: prev.credits + amount }));
  };

  // Deduct credits if available; returns true if successful
  const deductCredits = (amount: number) => {
    if (user.credits >= amount) {
      setUser((prev) => ({ ...prev, credits: prev.credits - amount }));
      return true;
    }
    return false;
  };

  // Set user verification status
  const setVerified = (verified: boolean) => {
    setUser((prev) => ({ ...prev, verified }));
  };

  // Mark that the user has changed their profile photo; awards
  // 50 credits the first time only.
  const markProfilePhotoChanged = () => {
    setUser((prev) => {
      if (!prev.firstProfilePhotoChanged) {
        return {
          ...prev,
          firstProfilePhotoChanged: true,
          credits: prev.credits + 50,
        };
      }
      return prev;
    });
  };

  // Similar to above but for the cover photo.
  const markCoverPhotoChanged = () => {
    setUser((prev) => {
      if (!prev.firstCoverPhotoChanged) {
        return {
          ...prev,
          firstCoverPhotoChanged: true,
          credits: prev.credits + 50,
        };
      }
      return prev;
    });
  };

  // Update the user's name
  const updateName = (name: string) => {
    setUser((prev) => ({ ...prev, name }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        addCredits,
        deductCredits,
        setVerified,
        markProfilePhotoChanged,
        markCoverPhotoChanged,
        updateName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook to access the context. Throws if used outside of the provider.
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
