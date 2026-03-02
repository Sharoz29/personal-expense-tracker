import MonthYearPicker from "../common/MonthYearPicker";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 py-3 md:px-6 md:py-4 bg-white border-b border-gray-200">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
      <MonthYearPicker />
    </header>
  );
}
