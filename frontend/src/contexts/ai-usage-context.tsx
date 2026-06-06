"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { aiUsageService } from "@/services/ai-usage.service";
import type { MyAiUsage } from "@/types/ai-usage.types";
import { normalizeApiError } from "@/utils/api-error";

type AiUsageContextValue = {
  usage: MyAiUsage | null;
  isLoading: boolean;
  errorMessage: string | null;
  refreshAiUsage: () => Promise<void>;
};

const AiUsageContext = createContext<AiUsageContextValue | null>(null);

type AiUsageProviderProps = {
  children: ReactNode;
};

export function AiUsageProvider({ children }: AiUsageProviderProps) {
  const [usage, setUsage] = useState<MyAiUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshAiUsage = useCallback(async () => {
    try {
      setErrorMessage(null);

      const data = await aiUsageService.getMyAiUsage();

      setUsage(data);
    } catch (error) {
      setErrorMessage(normalizeApiError(error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAiUsage();
  }, [refreshAiUsage]);

  return (
    <AiUsageContext.Provider
      value={{
        usage,
        isLoading,
        errorMessage,
        refreshAiUsage,
      }}
    >
      {children}
    </AiUsageContext.Provider>
  );
}

export function useAiUsage() {
  const context = useContext(AiUsageContext);

  if (!context) {
    throw new Error("useAiUsage must be used within AiUsageProvider");
  }

  return context;
}
