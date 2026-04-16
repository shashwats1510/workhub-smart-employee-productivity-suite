import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import type { Account } from "../types";

interface GlobalContextType {
  userData: Account | null;
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

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigator = useNavigate();

  const fetchAuthAndUser = async () => {
    setIsLoading(true);
    try {
      console.log("checking login status");
      await axios.get("/api/auth/checkloggedin");
      console.log("User is logged in");

      const id = getCookie("user_id");
      if (!id) {
        console.warn("No user ID found in cookies. Redirecting to login...");
        navigator("/login");
        return;
      }

      const res = await axios.get(`/api/info/getUserDetails?id=${id}`);
      if (res.data.success) {
        setUserData(res.data.data);
      } else {
        console.error("Failed to fetch user details:", res.data.message);
      }
    } catch (error) {
      console.error("Authentication or fetching error:", error);
      navigator("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthAndUser();
  }, []);

  return (
    <GlobalContext.Provider
      value={{ userData, isLoading, refreshUser: fetchAuthAndUser }}
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
