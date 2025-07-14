import { apiClient } from '../services/apiClientV2';
import { DashboardKpiData } from '../types/api';

class DashboardService {
  public async getDashboardKPIs(): Promise<DashboardKpiData | null> {
    try {
      const data = await apiClient.get<DashboardKpiData>('/dashboard/kpis/');
      return data;
    } catch (error) {
      console.error('Failed to fetch dashboard KPIs:', error);
      return null;
    }
  }
}

export const dashboardService = new DashboardService();