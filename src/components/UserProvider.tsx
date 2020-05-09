import React, { FC, createContext, useContext, useState, ReactNode } from 'react';

interface UserContextInterface {
  user: string | null;
  setUser: Function;
}

export const UserContext = createContext<UserContextInterface>({} as UserContextInterface);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextInterface => useContext(UserContext);
