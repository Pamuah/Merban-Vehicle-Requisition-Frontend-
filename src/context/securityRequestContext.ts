import { createContext, useContext } from "react";

export interface SelectedRequest {
  id: string;
  employeeName: string;
}

export interface SecurityRequestContextProps {
  selected: SelectedRequest | null;
  setSelected: React.Dispatch<React.SetStateAction<SelectedRequest | null>>;
}

export const SecurityRequestContext =
  createContext<SecurityRequestContextProps>({
    selected: null,
    setSelected: () => {},
  });

export const useSecurityRequest = () => useContext(SecurityRequestContext);
