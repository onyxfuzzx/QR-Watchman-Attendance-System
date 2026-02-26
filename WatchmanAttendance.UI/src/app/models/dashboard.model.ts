export interface DashboardResponse {
  watchmanName: string;
  
  summary: {
    month: string;
    presentDays: number;
    percentage: number;
    lastPunch: string | null;
  };

  attendance: {
    date: string;
    punchTime: string;
    status: 'Present' | 'Late' | 'HalfDay';
    locationVerified: boolean;
  }[];

  recentActivity: {
    time: string;
  }[];
}
