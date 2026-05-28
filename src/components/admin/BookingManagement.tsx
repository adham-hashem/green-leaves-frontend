import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { CreditCard as Edit2, Trash2, Eye, Check, Clock, User } from 'lucide-react';
import BookingModal from './BookingModal';

interface Booking {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
  address: string;
  service: string;
  budget: string;
  image_url?: string;
  status: string;
  created_at: string;
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await api.bookings.getAll();

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await api.bookings.updateStatus(id, newStatus);

      if (error) throw error;
      fetchBookings();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const { error } = await api.bookings.delete(id);

      if (error) throw error;
      fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const filteredBookings = filterStatus === 'all' ? bookings : bookings.filter((b) => b.status === filterStatus);

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'contacted':
        return User;
      case 'completed':
        return Check;
      default:
        return Clock;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Management</h1>
          <p className="text-gray-600">Manage and track all customer bookings</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'contacted', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === status
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Phone</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Service</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Budget</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking) => {
                  const StatusIcon = getStatusIcon(booking.status);
                  return (
                    <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-900">{booking.full_name}</td>
                      <td className="py-4 px-4 text-gray-700">{booking.phone_number}</td>
                      <td className="py-4 px-4 text-gray-700">{booking.service}</td>
                      <td className="py-4 px-4 text-gray-700">{booking.budget}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(booking.status)}`}>
                            <StatusIcon size={16} />
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </div>
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                            className="ml-2 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 hidden sm:block"
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(booking)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                            title="View details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(booking)}
                            className="p-2 hover:bg-yellow-100 rounded-lg transition-colors text-yellow-600"
                            title="Edit booking"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                            title="Delete booking"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold transition-all text-sm ${
                  currentPage === i + 1
                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {showModal && selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => {
            setShowModal(false);
            setSelectedBooking(null);
          }}
          onUpdate={() => {
            fetchBookings();
            setShowModal(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
}
