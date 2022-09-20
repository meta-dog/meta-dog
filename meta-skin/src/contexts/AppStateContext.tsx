import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";

import { AppVM, readApps } from "api";

function useAppState() {
  const [apps, setApps] = useState<AppVM[]>([]);

  const reloadApps = async () =>
    readApps()
      .then(setApps)
      .catch((error) => toast.error(`Error reading the Apps: ${error}`));

  useEffect(() => {
    reloadApps();
  }, []);

  return {
    apps,
    reloadApps,
  };
}

export type IAppStateContext = ReturnType<typeof useAppState>;
export const AppStateContext = createContext<IAppStateContext>(null!);

export default function AppStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const authState = useAppState();
  return (
    <AppStateContext.Provider value={authState}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppStateContext(): IAppStateContext {
  return useContext(AppStateContext);
}
