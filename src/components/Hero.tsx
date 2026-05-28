import { ArrowRight, Phone } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="relative w-full min-h-[600px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url("/background_home.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Professional Gardening Services in Cambridge
        </h1>

        <p className="text-xl sm:text-2xl text-gray-100 mb-8 font-light">
          Transforming Gardens, Creating Beautiful Spaces
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => scrollToSection('booking')}
            className="group inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Book a Service
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="tel:07961228431"
            className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <Phone size={20} />
            Call Now
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}
