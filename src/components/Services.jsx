import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { analytics } from "../utils/analytics";
import {
  IconPlantscape,
  IconGreenWall,
  IconAtrium,
  IconHoliday,
  IconFlorals,
  IconMaintenance,
  OrganicIcon,
} from "./icons/BotanicalIcons";

const services = [
  {
    icon: IconPlantscape,
    title: "Interior Plantscaping",
    hash: "interior-plantscaping",
    description:
      "Custom plant designs that transform your indoor spaces into vibrant, living environments.",
    image: `${import.meta.env.BASE_URL}images/plantscaping-lobby.jpg`,
  },
  {
    icon: IconGreenWall,
    title: "Green Walls",
    hash: "green-walls",
    description:
      "Stunning vertical gardens that make a bold statement while improving air quality.",
    image: `${import.meta.env.BASE_URL}images/living-wall-pattern.jpg`,
  },
  {
    icon: IconAtrium,
    title: "Large Atrium Design",
    hash: "atrium-design",
    description:
      "Dramatic installations for lobbies, atriums, and large commercial spaces.",
    image: `${import.meta.env.BASE_URL}images/atrium-tree-grand.jpg`,
  },
  {
    icon: IconHoliday,
    title: "Holiday Decorations",
    hash: "holiday-decorations",
    description:
      "Seasonal displays and festive installations that delight customers and employees.",
    image: `${import.meta.env.BASE_URL}images/indoor-garden-holiday.jpg`,
  },
  {
    icon: IconFlorals,
    title: "Color Program",
    hash: "color-program",
    description:
      "Beautiful living arrangements for offices, lobbies, and events that bring color and elegance to any space.",
    image: `${import.meta.env.BASE_URL}images/floral-anthurium.jpg`,
  },
  {
    icon: IconMaintenance,
    title: "Plant Maintenance",
    hash: "plant-maintenance",
    description:
      "Professional ongoing care to keep your plants healthy and thriving year-round.",
    image: `${import.meta.env.BASE_URL}images/planted-benches-garden.jpg`,
  },
];

const Services = ({ showAll = false }) => {
  const displayedServices = showAll ? services : services.slice(0, 3);
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const reveals = entry.target.querySelectorAll("[data-reveal]");
          reveals.forEach((el, i) => {
            setTimeout(() => el.classList.add("revealed"), i * 120);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-sage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header — hidden when page already has a hero */}
        {!showAll && (
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-sage-100 text-sage-600 rounded-full text-sm font-medium mb-4">
              What We Do
            </span>
            <h2 className="section-heading">Our Services</h2>
            <p className="section-subheading">
              From concept to installation and ongoing maintenance, we provide
              comprehensive plantscaping solutions for any space.
            </p>
          </div>
        )}

        {/* Services Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedServices.map((service) => (
            <div key={service.title} data-reveal className="flex">
              <div
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col w-full"
              >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 to-transparent" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-4 -mt-12 relative z-10">
                  <OrganicIcon
                    Icon={service.icon}
                    size="w-14 h-14"
                    iconSize="w-8 h-8"
                  />
                </div>
                <h3 className="text-xl font-display font-semibold text-forest-800 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 flex-1">
                  {service.description}
                </p>
                <Link
                  to={`/services#${service.hash}`}
                  onClick={() => analytics.serviceView(service.title)}
                  className="inline-flex items-center text-sage-500 font-medium hover:text-sage-600 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 rounded-sm"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {!showAll && (
          <div className="text-center mt-12">
            <Link to="/services" className="btn-secondary">
              View All Services
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
