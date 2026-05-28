import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { TrendingUp, Clock, CheckCircle, Users, Bell } from 'lucide-react';

interface Stats {
  totalBookings: number;
  pendingJobs: number;
  completedJobs: number;
  contactedCustomers: number;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface DashboardOverviewProps {
  notifications?: Notification[];
}

export default function DashboardOverview({ notifications = [] }: DashboardOverviewProps) {
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    pendingJobs: 0,
    completedJobs: 0,
    contactedCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: bookings, error } = await api.bookings.getAll();

      if (error) throw error;

      const total = bookings?.length || 0;
      const pending = bookings?.filter((b) => b.status === 'pending').length || 0;
      const completed = bookings?.filter((b) => b.status === 'completed').length || 0;
      const contacted = bookings?.filter((b) => b.status === 'contacted').length || 0;

      setStats({
        totalBookings: total,
        pendingJobs: pending,
        completedJobs: completed,
        contactedCustomers: contacted,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
    },
    {
      title: 'Pending Jobs',
      value: stats.pendingJobs,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      lightBg: 'bg-yellow-50',
    },
    {
      title: 'Completed Jobs',
      value: stats.completedJobs,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      lightBg: 'bg-green-50',
    },
    {
      title: 'Contacted Customers',
      value: stats.contactedCustomers,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
      <p className="text-gray-600 mb-8">Welcome back! Here's your business overview.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <div className={`flex items-center justify-between mb-4`}>
                <div className={`bg-gradient-to-br ${card.color} p-3 rounded-xl text-white`}>
                  <Icon size={24} />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">{card.title}</p>
              <p className="text-4xl font-bold text-gray-800">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={20} className="text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent notifications</p>
                <p className="text-gray-400 text-sm mt-1">New bookings will appear here</p>
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl ${!notification.is_read ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${!notification.is_read ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                    <div>
                      <p className="font-semibold text-gray-800">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Completion Rate</span>
              <span className="text-2xl font-bold text-green-600">
                {stats.totalBookings > 0
                  ? Math.round((stats.completedJobs / stats.totalBookings) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Pending Work</span>
              <span className="text-2xl font-bold text-yellow-600">{stats.pendingJobs}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Response Rate</span>
              <span className="text-2xl font-bold text-blue-600">
                {stats.totalBookings > 0
                  ? Math.round(((stats.contactedCustomers + stats.completedJobs) / stats.totalBookings) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
