import { createContext, useContext } from "react";

// @ts-expect-error
export const SessionContext = createContext<SessionContextValue>(undefined);
export const useSession = () => useContext(SessionContext);