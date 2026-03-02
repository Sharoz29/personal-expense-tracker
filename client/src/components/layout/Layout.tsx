import { Outlet } from "react-router-dom";
import { DesktopSidebar, MobileBottomNav } from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DesktopSidebar />
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <Outlet />
      </main>
      <MobileBottomNav />
    </div>
  );
}
