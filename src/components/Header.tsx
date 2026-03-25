import { JSX } from 'react';

interface HeaderProps {
  selectedState: string;
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

function Header({
  selectedState,
  onToggleSidebar,
  onToggleTheme,
  isDarkMode
}: HeaderProps): JSX.Element {
  return (
    <header className="dashboard-header">
      <div className="dashboard-topbar">
        <div className="dashboard-topbar__brand">
          <button
            type="button"
            className="dashboard-header__menu-button"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <span />
            <span />
            <span />
          </button>
          <span className="dashboard-topbar__title">Sales Dashboard</span>
        </div>

        <div className="dashboard-topbar__actions">
          <span className="dashboard-topbar__user">Hello User</span>
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            title={isDarkMode ? 'Light Theme' : 'Dark Theme'}
          >
            <span className="theme-toggle__icon">{isDarkMode ? '☀' : '☾'}</span>
          </button>
        </div>
      </div>

      <div className="dashboard-header__content">
        <div>
          <h1>Sales Overview</h1>
          <p className="dashboard-header__subtitle">{selectedState || 'Selected state'}</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
