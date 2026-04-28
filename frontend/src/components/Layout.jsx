import { Gavel, LayoutDashboard, Shield } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuction } from '../context/AuctionContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/auction', label: 'Auction', icon: Gavel },
  { to: '/teams', label: 'Teams', icon: Shield }
];

const Layout = ({ children }) => {
  const { connected } = useAuction();

  return (
    <div className="min-h-screen bg-background text-primary">
      <header className="sticky top-0 z-20 border-b-2 border-primary bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold text-secondary">IIIT Nagpur</p>
            <h1 className="text-xl font-black sm:text-2xl">NPL Auction System</h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-md border-2 border-accent px-3 py-2 text-sm font-bold text-accent">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              {connected ? 'Live Sync' : 'Offline'}
            </div>
            <nav className="grid grid-cols-3 gap-2">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center justify-center gap-2 rounded-md border-2 px-3 py-2 text-sm font-bold ${
                      isActive
                        ? 'border-primary bg-primary text-background'
                        : 'border-primary bg-background text-primary hover:bg-primary hover:text-background'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
    </div>
  );
};

export default Layout;
