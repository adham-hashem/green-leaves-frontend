import { LayoutDashboard, BookOpen, Image, Wrench, Settings, LogOut, X } from 'lucide-react';

interface AdminSidebarProps {
  activePage: string;
  setActivePage: (page: any) => void;
  onLogout: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  activePage,
  setActivePage,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
}: AdminSidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: BookOpen },
    { id: 'before-after', label: 'Before & After', icon: Image },
    { id: 'services', label: 'Services', icon: Wrench },
  ];

  const handleNavClick = (page: string) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:relative w-64 h-screen bg-gradient-to-b from-green-700 to-green-600 text-white flex flex-col shadow-xl transition-transform lg:translate-x-0 z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-green-500">
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-green-500 rounded-lg"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3">
            <img src="/logo_green_leaves.png" alt="Logo" className="h-10 w-auto" />
            <div>
              <h2 className="font-bold text-sm">Cambridge</h2>
              <p className="text-green-100 text-xs">Green Leaves</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${
                  isActive
                    ? 'bg-white text-green-700 shadow-lg'
                    : 'text-white hover:bg-green-500'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-green-500">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition-all font-medium text-white"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
