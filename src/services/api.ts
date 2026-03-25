import axios from 'axios';
import {
  DashboardApiResponse,
  DashboardChartItem,
  StateDateRange
} from '../types/dashboard';

const apiClient = axios.create({
  baseURL: 'http://localhost:4000'
});

interface StatesResponse {
  data: string[];
}

interface StateDatesResponse {
  data: StateDateRange;
}

interface CustomersResponse {
  data: string[];
}

export async function getCustomerIds(): Promise<string[]> {
  const response = await apiClient.get<CustomersResponse>('/customers');
  return response.data.data ?? [];
}

export async function getStates(): Promise<string[]> {
  const response = await apiClient.get<StatesResponse>('/states');
  return response.data.data ?? [];
}

export async function getMinMaxDates(state: string): Promise<StateDateRange> {
  const response = await apiClient.get<StateDatesResponse>(
    `/states/${encodeURIComponent(state)}/dates`
  );

  return response.data.data;
}

export async function getDashboardData(
  customerId: string | number,
  state: string,
  startDate: string,
  endDate: string
): Promise<DashboardApiResponse> {
  const response = await apiClient.get<DashboardApiResponse>('/dashboard', {
    params: {
      customerId,
      state,
      startDate,
      endDate
    }
  });

  return {
    ...response.data,
    chart: response.data.chart ?? ([] as DashboardChartItem[]),
    citySales: response.data.citySales ?? [],
    productSales: response.data.productSales ?? [],
    categorySales: response.data.categorySales ?? [],
    subCategorySales: response.data.subCategorySales ?? [],
    segmentSales: response.data.segmentSales ?? []
  };
}

export default apiClient;
