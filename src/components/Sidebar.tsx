import { JSX } from 'react';
import { MenuItem, SidebarIconType } from '../types/dashboard';

interface SidebarProps {
  items: MenuItem[];
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

function SidebarIcon({ type }: { type: SidebarIconType }): JSX.Element {
  const icons: Record<SidebarIconType, JSX.Element> = {
    overview: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h7v6H4V5zm9 0h7v10h-7V5zM4 13h7v6H4v-6zm9 4h7v2h-7v-2z" />
      </svg>
    ),
    stores: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 8l2-4h12l2 4v2a2 2 0 0 1-2 2v7h-4v-4h-4v4H6v-7a2 2 0 0 1-2-2V8zm3 0h10l-1-2H8L7 8z" />
      </svg>
    ),
    notifications: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2z" />
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.14 12.94a7.43 7.43 0 0 0 0-1.88l2.03-1.58-1.92-3.32-2.39.96a7.53 7.53 0 0 0-1.63-.95l-.36-2.54H9.13l-.36 2.54c-.58.22-1.13.54-1.63.95l-2.39-.96-1.92 3.32 2.03 1.58a7.43 7.43 0 0 0 0 1.88l-2.03 1.58 1.92 3.32 2.39-.96c.5.41 1.05.73 1.63.95l.36 2.54h5.74l.36-2.54c.58-.22 1.13-.54 1.63-.95l2.39.96 1.92-3.32-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5z" />
      </svg>
    ),
    theme: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3a1 1 0 0 1 1 1v1.06a7 7 0 1 1-8 8H4a1 1 0 1 1 0-2h1.06A7 7 0 0 1 13 5.06V4a1 1 0 0 1-1-1z" />
      </svg>
    )
  };

  return icons[type];
}

function Sidebar({
  items,
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onCloseMobile
}: SidebarProps): JSX.Element {
  return (
    <>
      <div
        className={`sidebar-backdrop ${isMobileOpen ? 'is-visible' : ''}`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <aside
        className={`sidebar ${isCollapsed ? 'is-collapsed' : ''} ${
          isMobileOpen ? 'is-mobile-open' : ''
        }`}
      >
        <div className="sidebar__top">
          <div className="sidebar__brand">
            <span className="sidebar__brand-mark">AU</span>
            {!isCollapsed && <span className="sidebar__brand-text">Analytics Hub</span>}
          </div>

          <button
            type="button"
            className="sidebar__collapse-button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar__nav">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`sidebar__item ${item.active ? 'is-active' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="sidebar__icon">
                <SidebarIcon type={item.icon} />
              </span>
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
