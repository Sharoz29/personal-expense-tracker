import { useMonthYear } from "../../context/MonthYearContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function MonthYearPicker() {
  const { month, year, setMonth, setYear } = useMonthYear();

  const goBack = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const goForward = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  };

  return (
    <div className="flex items-center gap-3">
      <button onClick={goBack} className="p-1 rounded hover:bg-gray-200 transition-colors">
        <ChevronLeft size={20} />
      </button>
      <span className="text-lg font-semibold min-w-[180px] text-center">
        {MONTHS[month - 1]} {year}
      </span>
      <button onClick={goForward} className="p-1 rounded hover:bg-gray-200 transition-colors">
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
