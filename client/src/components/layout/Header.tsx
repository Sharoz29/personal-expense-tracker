import MonthYearPicker from "../common/MonthYearPicker";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <MonthYearPicker />
    </header>
  );
}
