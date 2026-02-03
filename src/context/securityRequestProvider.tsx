import { useState } from "react";
import { SecurityRequestContext } from "./securityRequestContext.ts";
import type { SelectedRequest } from "./securityRequestContext.ts";

export const SecurityRequestProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selected, setSelected] = useState<SelectedRequest | null>(null);

  return (
    <SecurityRequestContext.Provider value={{ selected, setSelected }}>
      {children}
    </SecurityRequestContext.Provider>
  );
};
