import { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  activeSection?: string;
}

export default function Header({ activeSection = '' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isGalleryPage = location.pathname === '/before-after';

  const scrollToSection = (id: string) => {
    if (isGalleryPage) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'Home', id: 'home', type: 'scroll' as const },
    { label: 'Services', id: 'services', type: 'scroll' as const },
    { label: 'Book a Service', id: 'booking', type: 'scroll' as const },
    { label: 'Before & After', path: '/before-after', type: 'link' as const },
    { label: 'Contact', id: 'contact', type: 'scroll' as const },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.type === 'link' && isGalleryPage) return true;
    if (item.type === 'scroll' && activeSection === item.id) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="cursor-pointer">
            <img src="/logo_green_leaves.png" alt="Cambridge Green Leaves" className="h-20 w-auto drop-shadow-lg" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              if (item.type === 'link') {
                return (
                  <Link
                    key={item.label}
                    to={item.path!}
                    className={`text-sm font-semibold transition-colors ${
                      isActive(item) ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={item.id}
                  to={`/#${item.id}`}
                  onClick={(e) => {
                    if (!isGalleryPage) {
                      e.preventDefault();
                      scrollToSection(item.id!);
                    }
                  }}
                  className={`text-sm font-semibold transition-colors ${
                    activeSection === item.id ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <a
            href="tel:07961228431"
            className="hidden sm:flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-full font-semibold transition-colors shadow-lg"
          >
            <Phone size={18} />
            <span className="hidden lg:inline">07961228431</span>
          </a>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 animate-in fade-in duration-200">
            {navItems.map((item) => {
              if (item.type === 'link') {
                return (
                  <Link
                    key={item.label}
                    to={item.path!}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                      isActive(item) ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={item.id}
                  to={`/#${item.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                    activeSection === item.id ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href="tel:07961228431"
              className="block w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-3 rounded-lg font-semibold mt-2 text-center"
            >
              Call 07961228431
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
