import { JSX, useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import CustomerDropdown from '../components/CustomerDropdown';
import StateDropdown from '../components/StateDropdown';
import DateFilter from '../components/DateFilter';
import Cards from '../components/Cards';
import Charts from '../components/Charts';
import { useTheme } from '../context/ThemeContext';
import { getCustomerIds, getDashboardData, getMinMaxDates, getStates } from '../services/api';
import {
  DashboardApiResponse,
  DashboardCardItem,
  MenuItem,
  StateDateRange
} from '../types/dashboard';

const DEFAULT_CUSTOMER_ID = 'CG-12520';

const sidebarItems: MenuItem[] = [
  { id: 'overview', label: 'Sales Overview', icon: 'overview', active: true },
  { id: 'stores', label: 'States', icon: 'stores' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'theme', label: 'Light Theme', icon: 'theme' }
];

const emptyDashboardData: DashboardApiResponse = {
  filters: {},
  cards: {
    totalSales: 0,
    totalOrders: 0,
    totalRevenue: 0
  },
  chart: [],
  citySales: [],
  productSales: [],
  categorySales: [],
  subCategorySales: [],
  segmentSales: []
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(value);
}

function mapCards(
  dashboardData: DashboardApiResponse,
  selectedCustomerId: string,
  selectedState: string,
  startDate: string,
  endDate: string
): DashboardCardItem[] {
  return [
    {
      id: 'sales',
      title: 'Total Sales',
      value: formatCurrency(dashboardData.cards.totalSales),
      accent: 'emerald',
      icon: 'sales',
      helperText: `${startDate} to ${endDate}`
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: dashboardData.cards.totalOrders.toLocaleString('en-IN'),
      accent: 'sky',
      icon: 'orders',
      helperText: `Customer ${selectedCustomerId}`
    },
    {
      id: 'state',
      title: 'Selected State',
      value: selectedState || '-',
      accent: 'amber',
      icon: 'state',
      helperText: 'Live backend filter'
    },
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: formatCurrency(dashboardData.cards.totalRevenue),
      accent: 'rose',
      icon: 'revenue',
      helperText: 'Calculated from API'
    }
  ];
}

function Dashboard(): JSX.Element {
  const { isDarkMode, toggleTheme } = useTheme();
  const [customerIds, setCustomerIds] = useState<string[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [dateLimits, setDateLimits] = useState<StateDateRange>({
    state: '',
    minDate: null,
    maxDate: null
  });
  const [dashboardData, setDashboardData] = useState<DashboardApiResponse>(emptyDashboardData);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isFiltersLoading, setIsFiltersLoading] = useState<boolean>(true);
  const [isDashboardLoading, setIsDashboardLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    async function loadFilters(): Promise<void> {
      setIsFiltersLoading(true);
      setError('');

      try {
        const [stateList, customerIdList] = await Promise.all([getStates(), getCustomerIds()]);

        if (!isMounted) {
          return;
        }

        setStates(stateList);
        setCustomerIds(customerIdList);
        setSelectedState(stateList[0] ?? '');
        setSelectedCustomerId(
          customerIdList.includes(DEFAULT_CUSTOMER_ID)
            ? DEFAULT_CUSTOMER_ID
            : customerIdList[0] ?? ''
        );
        setIsDashboardLoading(stateList.length > 0);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError('Unable to load filters from the backend.');
        setIsDashboardLoading(false);
      } finally {
        if (isMounted) {
          setIsFiltersLoading(false);
        }
      }
    }

    void loadFilters();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadDateRange(): Promise<void> {
      if (!selectedState) {
        setIsDashboardLoading(false);
        return;
      }

      setIsFiltersLoading(true);
      setError('');

      try {
        const nextDateRange = await getMinMaxDates(selectedState);

        if (!isMounted) {
          return;
        }

        setDateLimits(nextDateRange);
        setDateRange({
          startDate: nextDateRange.minDate ?? '',
          endDate: nextDateRange.maxDate ?? ''
        });
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setDateLimits({ state: selectedState, minDate: null, maxDate: null });
        setDateRange({ startDate: '', endDate: '' });
        setError(`Unable to load date range for ${selectedState}.`);
        setIsDashboardLoading(false);
      } finally {
        if (isMounted) {
          setIsFiltersLoading(false);
        }
      }
    }

    void loadDateRange();

    return () => {
      isMounted = false;
    };
  }, [selectedState]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard(): Promise<void> {
      if (!selectedCustomerId || !selectedState || !dateRange.startDate || !dateRange.endDate) {
        setIsDashboardLoading(false);
        return;
      }

      setIsDashboardLoading(true);
      setError('');

      try {
        const result = await getDashboardData(
          selectedCustomerId,
          selectedState,
          dateRange.startDate,
          dateRange.endDate
        );

        if (!isMounted) {
          return;
        }

        setDashboardData(result);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setDashboardData(emptyDashboardData);
        setError('Unable to load dashboard data for the selected filters.');
      } finally {
        if (isMounted) {
          setIsDashboardLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [selectedCustomerId, selectedState, dateRange.startDate, dateRange.endDate]);

  const handleStateChange = (state: string): void => {
    setSelectedState(state);
    setIsSidebarOpen(false);
  };

  const handleStartDateChange = (startDate: string): void => {
    setDateRange((currentRange) => ({
      startDate,
      endDate:
        currentRange.endDate && currentRange.endDate < startDate ? startDate : currentRange.endDate
    }));
  };

  const handleEndDateChange = (endDate: string): void => {
    setDateRange((currentRange) => ({
      startDate:
        currentRange.startDate && currentRange.startDate > endDate ? endDate : currentRange.startDate,
      endDate
    }));
  };

  const cards = mapCards(
    dashboardData,
    selectedCustomerId || DEFAULT_CUSTOMER_ID,
    selectedState,
    dateRange.startDate || '-',
    dateRange.endDate || '-'
  );

  return (
    <div className={`dashboard-shell ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
      <Sidebar
        items={sidebarItems}
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isSidebarOpen}
        onToggleCollapse={() => setIsSidebarCollapsed((currentValue) => !currentValue)}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      <main className={`dashboard-main ${isSidebarCollapsed ? 'is-sidebar-collapsed' : ''}`}>
        <Header
          selectedState={selectedState}
          onToggleSidebar={() => setIsSidebarOpen((currentValue) => !currentValue)}
          onToggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
        />

        <section className="filters-grid">
          <CustomerDropdown
            value={selectedCustomerId}
            options={customerIds}
            onChange={setSelectedCustomerId}
            disabled={isFiltersLoading}
          />
          <StateDropdown
            value={selectedState}
            options={states}
            onChange={handleStateChange}
            disabled={isFiltersLoading}
          />
          <DateFilter
            label="From Date"
            value={dateRange.startDate}
            minDate={dateLimits.minDate ?? undefined}
            maxDate={dateRange.endDate || dateLimits.maxDate || undefined}
            onChange={handleStartDateChange}
            disabled={isFiltersLoading || !dateLimits.minDate}
          />
          <DateFilter
            label="To Date"
            value={dateRange.endDate}
            minDate={dateRange.startDate || dateLimits.minDate || undefined}
            maxDate={dateLimits.maxDate ?? undefined}
            onChange={handleEndDateChange}
            disabled={isFiltersLoading || !dateLimits.maxDate}
          />
        </section>

        {error ? <div className="status-banner status-banner--error">{error}</div> : null}

        <Cards items={cards} isLoading={isDashboardLoading} />
        <Charts
          citySales={dashboardData.citySales}
          productSales={dashboardData.productSales}
          categorySales={dashboardData.categorySales}
          subCategorySales={dashboardData.subCategorySales}
          segmentSales={dashboardData.segmentSales}
          isLoading={isDashboardLoading}
        />
      </main>
    </div>
  );
}

export default Dashboard;
