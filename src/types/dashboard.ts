export type SidebarIconType =
  | 'overview'
  | 'stores'
  | 'notifications'
  | 'settings'
  | 'theme';

export type CardIconType = 'sales' | 'orders' | 'state' | 'revenue';

export type CardAccent = 'emerald' | 'sky' | 'amber' | 'rose';

export interface MenuItem {
  id: string;
  label: string;
  icon: SidebarIconType;
  active?: boolean;
}

export interface StateDateRange {
  state: string;
  minDate: string | null;
  maxDate: string | null;
}

export interface DashboardApiCards {
  totalSales: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface DashboardChartItem {
  month: string;
  sales: number;
  orders: number;
  revenue: number;
}

export interface DashboardValueItem {
  label: string;
  value: number;
}

export interface DashboardProductItem {
  name: string;
  sales: number;
}

export interface DashboardApiResponse {
  filters: {
    customerId?: string;
    state?: string;
    startDate?: string;
    endDate?: string;
  };
  cards: DashboardApiCards;
  chart: DashboardChartItem[];
  citySales: DashboardValueItem[];
  productSales: DashboardProductItem[];
  categorySales: DashboardValueItem[];
  subCategorySales: DashboardValueItem[];
  segmentSales: DashboardValueItem[];
}

export interface DashboardCardItem {
  id: string;
  title: string;
  value: string;
  accent: CardAccent;
  icon: CardIconType;
  helperText: string;
}
