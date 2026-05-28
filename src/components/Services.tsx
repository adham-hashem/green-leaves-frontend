const services = [
  {
    title: 'Landscaping',
    image: '/landscaping.png'
  },
  {
    title: 'Fencing',
    image: '/Fencing.png'
  },
  {
    title: 'Turfing',
    image: '/Turfing.png'
  },
  {
    title: 'Patios',
    image: '/Patios.png'
  },
  {
    title: 'Tree Surgery',
    image: '/Tree Surgery.png'
  },
  {
    title: 'Hedges & Shrubs',
    image: '/Hedges & Shrubs.png'
  },
  {
    title: 'Grass Cutting',
    image: '/Grass Cutting.png'
  },
  {
    title: 'Garden Clearance',
    image: '/Garden Clearance.png'
  },
  {
    title: 'Commercial Sites',
    image: '/Commercial Sites.png'
  },
];

export default function Services() {
  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600">Professional gardening solutions tailored to your needs</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={scrollToBooking}
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-end p-4">
                <h3 className="text-lg sm:text-xl font-bold text-white">{service.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
