import { Phone, Mail, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <section className="py-16 sm:py-24 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-300">Contact us today for a free consultation</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <a
            href="tel:07961228431"
            className="group bg-gradient-to-br from-green-600 to-green-700 p-8 rounded-3xl hover:shadow-lg hover:shadow-green-500/50 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-4 rounded-xl group-hover:bg-white/30 transition-colors">
                <Phone className="text-white" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Phone</h3>
                <p className="text-green-50 text-lg font-medium">07961228431</p>
                <p className="text-green-200 text-sm mt-1">Call us anytime</p>
              </div>
            </div>
          </a>

          <a
            href="mailto:greenleaves132@hotmail.co.uk"
            className="group bg-gradient-to-br from-yellow-500 to-yellow-600 p-8 rounded-3xl hover:shadow-lg hover:shadow-yellow-500/50 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-4 rounded-xl group-hover:bg-white/30 transition-colors">
                <Mail className="text-white" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-yellow-50 text-lg font-medium">greenleaves132@</p>
                <p className="text-yellow-50 text-lg font-medium">hotmail.co.uk</p>
              </div>
            </div>
          </a>
        </div>

        <div className="mt-12 p-8 bg-white/10 backdrop-blur rounded-3xl border border-white/20">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-4 rounded-xl">
              <MapPin className="text-white" size={32} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Service Area</h3>
              <p className="text-gray-300 text-lg">Cambridge and surrounding areas</p>
              <p className="text-gray-400 text-sm mt-1">Available for commercial and residential projects</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400">
            We're committed to providing exceptional service and transforming your outdoor spaces into beautiful havens.
          </p>
        </div>
      </div>
    </section>
  );
}
