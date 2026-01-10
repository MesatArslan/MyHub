'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface NavbarActionsContextType {
  actions: ReactNode;
  setActions: (actions: ReactNode) => void;
}

export const NavbarActionsContext = createContext<NavbarActionsContextType | undefined>(undefined);

export function NavbarActionsProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<ReactNode>(null);

  return (
    <NavbarActionsContext.Provider value={{ actions, setActions }}>
      {children}
    </NavbarActionsContext.Provider>
  );
}

export function useNavbarActions() {
  const context = useContext(NavbarActionsContext);
  if (!context) {
    throw new Error('useNavbarActions must be used within NavbarActionsProvider');
  }
  return context;
}

