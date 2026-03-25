import { JSX } from 'react';
import { CardAccent, CardIconType, DashboardCardItem } from '../types/dashboard';

interface CardsProps {
  items: DashboardCardItem[];
  isLoading: boolean;
}

function CardIcon({ icon, accent }: { icon: CardIconType; accent: CardAccent }): JSX.Element {
  const icons: Record<CardIconType, JSX.Element> = {
    sales: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C7.03 2 3 6.03 3 11c0 3.87 2.45 7.16 5.88 8.41L12 22l3.12-2.59A8.98 8.98 0 0 0 21 11c0-4.97-4.03-9-9-9zm1 14h-2v-1H8v-2h3v-2H9a2 2 0 0 1 0-4h1V6h2v1h3v2h-4v2h2a2 2 0 0 1 0 4h-1v1z" />
      </svg>
    ),
    orders: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v14H4V5zm2 2v10h12V7H6zm2 2h5v2H8V9zm0 4h8v2H8v-2z" />
      </svg>
    ),
    state: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2 4 6v6c0 5.25 3.5 10.08 8 11 4.5-.92 8-5.75 8-11V6l-8-4zm0 2.18 6 3v4.82c0 4.08-2.55 7.97-6 8.9-3.45-.93-6-4.82-6-8.9V7.18l6-3z" />
      </svg>
    ),
    revenue: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4h14v2H5V4zm1 4h12v12H6V8zm3 2v2h6v-2H9zm0 4v2h4v-2H9z" />
      </svg>
    )
  };

  return <span className={`metric-card__icon metric-card__icon--${accent}`}>{icons[icon]}</span>;
}

function Cards({ items, isLoading }: CardsProps): JSX.Element {
  if (isLoading) {
    return (
      <section className="metrics-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <article key={index} className="metric-card metric-card--loading" aria-hidden="true">
            <div className="metric-card__skeleton metric-card__skeleton--icon" />
            <div className="metric-card__body">
              <div className="metric-card__skeleton metric-card__skeleton--text" />
              <div className="metric-card__skeleton metric-card__skeleton--value" />
            </div>
          </article>
        ))}
      </section>
    );
  }

  return (
    <section className="metrics-grid">
      {items.map((item) => (
        <article key={item.id} className="metric-card">
          <CardIcon icon={item.icon} accent={item.accent} />
          <div className="metric-card__body">
            <span className="metric-card__title">{item.title}</span>
            <strong className="metric-card__value">{item.value}</strong>
            <span className="metric-card__helper">{item.helperText}</span>
          </div>
        </article>
      ))}
    </section>
  );
}

export default Cards;
