import { useState, useEffect } from 'react';
import { api, API_URL, getMediaUrl } from '../lib/api';
import { CheckCircle, Upload, X } from 'lucide-react';

const budgets = [
  'Under £500',
  '£500 - £1,000',
  '£1,000 - £2,500',
  '£2,500 - £5,000',
  'Over £5,000',
];

export default function BookingForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    address: '',
    service: '',
    budget: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await api.services.getAll(true);

      if (error) throw error;

      if (data) {
        setServices(data.map((s) => s.title));
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      // Fallback services
      setServices([
        'Landscaping',
        'Fencing',
        'Turfing',
        'Patios',
        'Tree Surgery',
        'Hedges & Shrubs',
        'Grass Cutting',
        'Garden Clearance',
        'Commercial Sites',
      ]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `booking-images/${fileName}`;

      const { data: uploadData, error: uploadError } = await api.storage.upload('booking-uploads', file, filePath);

      if (uploadError) throw new Error(uploadError.message);

      if (uploadData) {
        setUploadedImageUrl(uploadData.path);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setUploadedImageUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bookingData = {
        ...formData,
        image_url: uploadedImageUrl,
      };

      const { error } = await api.bookings.create(bookingData);

      if (error) throw error;

      // Note: The C# backend automatically seeds administrative notifications 
      // upon booking creation, so explicit client-side notification insertion is bypassed.

      // Trigger push notification (optional - requires setup)
      try {
        await fetch(`${API_URL}/api/notifications/push`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'New Booking!',
            body: `${formData.full_name} booked ${formData.service}`,
          }),
        });
      } catch (pushError) {
        console.log('Push notification skipped:', pushError);
      }

      setSubmitSuccess(true);
      setFormData({
        full_name: '',
        phone_number: '',
        email: '',
        address: '',
        service: '',
        budget: '',
        notes: '',
      });
      setUploadedImageUrl(null);

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Error submitting booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Book a Service</h2>
          <p className="text-lg text-gray-600">Fill out the form below and we'll get back to you soon</p>
        </div>

        {submitSuccess && (
          <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl flex items-start gap-4 animate-in fade-in">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-1">Booking Submitted!</h3>
              <p className="text-green-700">Thank you for your booking. We'll contact you shortly to confirm.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-3xl p-8 shadow-md">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              />
              <input
                type="tel"
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors bg-white"
              >
                <option value="">Select a Service</option>
                {services.map((svc) => (
                  <option key={svc} value={svc}>
                    {svc}
                  </option>
                ))}
              </select>

              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors bg-white"
              >
                <option value="">Select Budget</option>
                {budgets.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Garden Image (Optional)
              </label>
              {uploadedImageUrl ? (
                <div className="relative">
                  <img src={getMediaUrl(uploadedImageUrl)} alt="Uploaded garden" className="w-full h-48 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors">
                  <label className="flex flex-col items-center gap-3 cursor-pointer">
                    {uploading ? (
                      <div className="w-8 h-8 border-3 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                    ) : (
                      <Upload size={28} className="text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-gray-600">
                      {uploading ? 'Uploading...' : 'Click to upload image'}
                    </span>
                    <span className="text-xs text-gray-500">JPG, PNG, WebP (max 5MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              )}
            </div>

            <textarea
              name="notes"
              placeholder="Additional Notes (optional)"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors resize-none"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Book Service'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
