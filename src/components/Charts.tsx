import { JSX } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import {
  DashboardProductItem,
  DashboardValueItem
} from '../types/dashboard';

interface ChartsProps {
  citySales: DashboardValueItem[];
  productSales: DashboardProductItem[];
  categorySales: DashboardValueItem[];
  subCategorySales: DashboardValueItem[];
  segmentSales: DashboardValueItem[];
  isLoading: boolean;
}

const PIE_COLORS = ['#2b80b8', '#d86f61', '#f2b95b', '#80c9da', '#9a86d2'];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function HorizontalBars({
  title,
  rows,
  valueLabel = 'Sales in $'
}: {
  title: string;
  rows: DashboardValueItem[];
  valueLabel?: string;
}): JSX.Element {
  const maxValue = Math.max(...rows.map((row) => row.value), 1);

  return (
    <article className="chart-panel">
      <div className="chart-panel__header chart-panel__header--spread">
        <h3>{title}</h3>
        <span>{valueLabel}</span>
      </div>

      <div className="list-chart">
        {rows.map((row) => (
          <div key={row.label} className="list-chart__row">
            <span className="list-chart__label">{row.label}</span>
            <div className="list-chart__track">
              <div
                className="list-chart__fill"
                style={{ width: `${(row.value / maxValue) * 100}%` }}
              />
            </div>
            <strong className="list-chart__value">{formatCurrency(row.value)}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function ProductList({ items }: { items: DashboardProductItem[] }): JSX.Element {
  const maxValue = Math.max(...items.map((item) => item.sales), 1);

  return (
    <article className="chart-panel">
      <div className="chart-panel__header chart-panel__header--spread">
        <h3>Sales by Products</h3>
        <span>Sales in $</span>
      </div>

      <div className="list-chart">
        {items.map((item) => (
          <div key={item.name} className="list-chart__row">
            <span className="list-chart__label">{item.name}</span>
            <div className="list-chart__track">
              <div
                className="list-chart__fill"
                style={{ width: `${(item.sales / maxValue) * 100}%` }}
              />
            </div>
            <strong className="list-chart__value">{formatCurrency(item.sales)}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function Doughnut({
  title,
  items
}: {
  title: string;
  items: DashboardValueItem[];
}): JSX.Element {
  return (
    <article className="chart-panel">
      <div className="chart-panel__header">
        <h3>{title}</h3>
      </div>

      <div className="donut-panel">
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie
              data={items}
              dataKey="value"
              nameKey="label"
              innerRadius={46}
              outerRadius={74}
              paddingAngle={0}
              stroke="none"
            >
              {items.map((item, index) => (
                <Cell key={item.label} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) =>
                formatCurrency(typeof value === 'number' ? value : Number(value ?? 0))
              }
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="square"
              formatter={(value) => <span className="donut-panel__legend-text">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

function Charts({
  citySales,
  productSales,
  categorySales,
  subCategorySales,
  segmentSales,
  isLoading
}: ChartsProps): JSX.Element {
  if (isLoading) {
    return (
      <section className="dashboard-sections">
        <div className="charts-grid">
          <article className="chart-panel chart-panel--loading" />
          <article className="chart-panel chart-panel--loading" />
        </div>
        <div className="charts-grid charts-grid--bottom">
          <article className="chart-panel chart-panel--loading" />
          <article className="chart-panel chart-panel--loading" />
          <article className="chart-panel chart-panel--loading" />
        </div>
      </section>
    );
  }

  if (
    citySales.length === 0 &&
    productSales.length === 0 &&
    categorySales.length === 0 &&
    subCategorySales.length === 0 &&
    segmentSales.length === 0
  ) {
    return (
      <section className="dashboard-sections">
        <article className="chart-panel chart-panel--empty">
          <h3>No chart data found</h3>
          <p>Try changing the selected state or date range.</p>
        </article>
      </section>
    );
  }

  return (
    <section className="dashboard-sections">
      <div className="charts-grid">
        <HorizontalBars title="Sales by City" rows={citySales} valueLabel="" />
        <ProductList items={productSales} />
      </div>

      <div className="charts-grid charts-grid--bottom">
        <Doughnut title="Sales By Category" items={categorySales} />
        <HorizontalBars title="Sales By Sub Category" rows={subCategorySales} />
        <Doughnut title="Sales By Segment" items={segmentSales} />
      </div>
    </section>
  );
}

export default Charts;
