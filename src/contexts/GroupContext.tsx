import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

/**
 * GroupContext provides helpers to manage groups on the client side.
 * It calls backend PHP APIs to create, join and fetch groups. Posts
 * within groups can be stored in Firebase or the backend depending on
 * requirements. For simplicity, only basic operations are implemented.
 */

interface Group {
  id: number;
  name: string;
  description?: string;
  creator_id: number;
  created_at: string;
}

interface GroupContextValue {
  groups: Group[];
  refreshGroups: (userId?: string) => Promise<void>;
  createGroup: (name: string, description: string, creatorId: string) => Promise<Group | null>;
  joinGroup: (groupId: string, userId: string) => Promise<boolean>;
}

const GroupContext = createContext<GroupContextValue | undefined>(undefined);

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = useState<Group[]>([]);

  // Fetch groups from the backend
  const refreshGroups = useCallback(async (userId?: string) => {
    const url = userId ? `/backend/groups.php?action=list&user_id=${userId}` : `/backend/groups.php?action=list`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      setGroups(data.groups);
    }
  }, []);

  // Create a new group
  const createGroup = async (name: string, description: string, creatorId: string) => {
    const res = await fetch(`/backend/groups.php?action=create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, creator_id: creatorId }),
    });
    if (res.ok) {
      const data = await res.json();
      const newGroup: Group = { id: data.group_id, name, description, creator_id: Number(creatorId), created_at: new Date().toISOString() };
      setGroups((prev) => [...prev, newGroup]);
      return newGroup;
    }
    return null;
  };

  // Join an existing group
  const joinGroup = async (groupId: string, userId: string) => {
    const res = await fetch(`/backend/groups.php?action=join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group_id: groupId, user_id: userId }),
    });
    if (res.ok) {
      const data = await res.json();
      return !!data.success;
    }
    return false;
  };

  return (
    <GroupContext.Provider value={{ groups, refreshGroups, createGroup, joinGroup }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroups = () => {
  const context = useContext(GroupContext);
  if (!context) throw new Error("useGroups must be used within GroupProvider");
  return context;
};