import React, { useState, useContext, createContext } from 'react';

type UserType = {
  accessToken: string;
  admin?: boolean;
  login: string;
};

type UserContextType = {
  user: UserType;
  setUser: (user: UserType) => void;
};

export function newUser() {
  return {
    accessToken: '',
    admin: false,
    login: '',
  };
}

export const UserContext = createContext<UserContextType>({
  user: newUser(),
  setUser: (user: UserType) => {},
});

// the provider avoid to write <UserContext.provider /> for main class
export function UserContextProvider({ children }: any) {
  const { Provider } = UserContext;
  const [user, setUser] = useState(newUser());
  // @ts-ignore 
  return <Provider value={{ user, setUser }}>{children}</Provider>;
}

/**
 * to use in children class to access to this context
 *
 * usage
 *  import {useUserContext} from "../context/UserContext"
 *  const { user, setUser } = useUserContext();
 */
export function useUserContext() {
  const { user, setUser } = useContext(UserContext);

  return { user, setUser };
}
