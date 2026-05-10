import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import type { Account } from "../types";

interface GlobalContextType {
  userData: Account | null;
  setUserData: React.Dispatch<React.SetStateAction<Account | null>>; // Added for local updates
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [userData, setUserData] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchAuthAndUser = async () => {
    // Only show loading if we don't have data yet to prevent flickering on refreshes
    if (!userData) setIsLoading(true);

    try {
      await axios.get("/api/auth/checkloggedin");

      const id = getCookie("user_id");
      if (!id) {
        if (location.pathname !== "/login") navigate("/login");
        return;
      }

      const res = await axios.get(`/api/info/getUserDetails?id=${id}`);
      if (res.data.success) {
        setUserData(res.data.data);
      }
    } catch (error) {
      console.error("Auth error:", error);
      if (location.pathname !== "/login") navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthAndUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        userData,
        setUserData,
        isLoading,
        refreshUser: fetchAuthAndUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
