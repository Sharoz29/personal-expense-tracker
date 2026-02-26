import { createContext, useContext, useState, type ReactNode } from "react";

interface MonthYearContextType {
  month: number;
  year: number;
  setMonth: (m: number) => void;
  setYear: (y: number) => void;
}

const MonthYearContext = createContext<MonthYearContextType | null>(null);

export function MonthYearProvider({ children }: { children: ReactNode }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  return (
    <MonthYearContext.Provider value={{ month, year, setMonth, setYear }}>
      {children}
    </MonthYearContext.Provider>
  );
}

export function useMonthYear() {
  const ctx = useContext(MonthYearContext);
  if (!ctx) throw new Error("useMonthYear must be used within MonthYearProvider");
  return ctx;
}
