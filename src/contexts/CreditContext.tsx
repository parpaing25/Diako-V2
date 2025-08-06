import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

/**
 * CreditContext manages the user's credit balance by calling backend APIs.
 * Credits are awarded when the user performs actions (like liking/sharing
 * posts) and can be spent to boost posts or perform other paid actions.
 */

interface CreditContextValue {
  credits: number;
  refreshCredits: (userId: string) => Promise<void>;
  addCredits: (userId: string, amount: number, reason?: string) => Promise<void>;
  subtractCredits: (userId: string, amount: number, reason?: string) => Promise<void>;
}

const CreditContext = createContext<CreditContextValue | undefined>(undefined);

export const CreditProvider = ({ children }: { children: ReactNode }) => {
  const [credits, setCredits] = useState(0);

  // Fetch the current credit balance from the backend
  const refreshCredits = async (userId: string) => {
    if (!userId) return;
    const res = await fetch(`/backend/credits.php?action=get&user_id=${userId}`);
    if (res.ok) {
      const data = await res.json();
      setCredits(data.credits ?? 0);
    }
  };

  // Add credits to a user
  const addCredits = async (userId: string, amount: number, reason = "") => {
    await fetch(`/backend/credits.php?action=add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, amount, reason }),
    });
    await refreshCredits(userId);
  };

  // Deduct credits from a user
  const subtractCredits = async (userId: string, amount: number, reason = "") => {
    await fetch(`/backend/credits.php?action=subtract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, amount, reason }),
    });
    await refreshCredits(userId);
  };

  return (
    <CreditContext.Provider value={{ credits, refreshCredits, addCredits, subtractCredits }}>
      {children}
    </CreditContext.Provider>
  );
};

export const useCredits = () => {
  const context = useContext(CreditContext);
  if (!context) throw new Error("useCredits must be used within CreditProvider");
  return context;
};