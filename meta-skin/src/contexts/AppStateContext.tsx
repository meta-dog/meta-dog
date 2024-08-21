import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { AppVM, readApps } from "api";

function useAppState() {
  const [apps, setApps] = useState<AppVM[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);

  const { t } = useTranslation("appStateContext");

  const reloadApps = useCallback(async () => {
    setLoadingApps(true);
    readApps()
      .then(setApps)
      .catch(() => toast.error(t("toast.error-read-apps"), { icon: "😥" }))
      .finally(() => setLoadingApps(false));
  }, [t]);

  useEffect(() => {
    // reloadApps();
  }, [reloadApps]);

  return {
    apps,
    reloadApps,
    openCreateDialog,
    setOpenCreateDialog,
    openHelpDialog,
    setOpenHelpDialog,
    loadingApps,
  };
}

export type IAppStateContext = ReturnType<typeof useAppState>;
export const AppStateContext = createContext<IAppStateContext>(null!);

interface Props {
  children: ReactNode;
}

export default function AppStateProvider({ children }: Props) {
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
