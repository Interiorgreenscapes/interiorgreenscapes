import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { analytics } from "../utils/analytics";

const BASE = import.meta.env.BASE_URL;

const categories = [
  {
    id: 1,
    name: "Atrium",
    title: "Stunning Atrium Designs",
    description:
      "Multi-story atriums featuring tropical plants and dramatic living installations.",
    featureImage: `${BASE}images/atrium-overhead-wide.jpg`,
    imageStyle: { objectPosition: "calc(50% + 100px) center" },
    gallery: [
      `${BASE}images/atrium-overhead-trees.jpg`,
      `${BASE}images/atrium-tree-grand.jpg`,
      `${BASE}images/atrium-tropical-seating.jpg`,
      `${BASE}images/fav-atrium.jpg`,
      `${BASE}images/fav-atrium-planter.jpg`,
    ],
  },
  {
    id: 2,
    name: "Green Walls",
    title: "Living Green Walls",
    description:
      "Vertical gardens that transform any space into a vibrant, living work of art.",
    featureImage: `${BASE}images/living-wall-pattern.jpg`,
    gallery: [
      `${BASE}images/living-wall-pattern.jpg`,
      `${BASE}images/living-wall-large.jpg`,
      `${BASE}images/living-wall-closeup.jpg`,
      `${BASE}images/living-wall-lobby-wide.jpg`,
      `${BASE}images/living-wall-lobby-close.jpg`,
      `${BASE}images/fav-green-wall.jpg`,
    ],
  },
  {
    id: 3,
    name: "Moss Walls",
    title: "Preserved Moss Walls",
    description:
      "Preserved moss panels that add living texture to any wall. Zero maintenance.",
    featureImage: `${BASE}images/greenwall-1.jpg`,
    gallery: [
      `${BASE}images/greenwall-1.jpg`,
      `${BASE}images/greenwall-2.jpg`,
      `${BASE}images/greenwall-3.jpg`,
      `${BASE}images/greenwall-4.jpg`,
    ],
  },
  {
    id: 4,
    name: "Seasonal",
    title: "Delivering Seasonal Magic",
    description:
      "Festive seasonal decorations that delight visitors and transform spaces during the holidays.",
    featureImage: `${BASE}images/fav-christmas-atrium.jpg`,
    imageStyle: { objectPosition: "center top" },
    gallery: [
      `${BASE}images/fav-christmas-atrium.jpg`,
      `${BASE}images/Christmas_Tree1.jpg`,
      `${BASE}images/Christmas_Tree3.jpg`,
      `${BASE}images/Garland.jpg`,
      `${BASE}images/poinsettia_tree.jpg`,
      `${BASE}images/fav-christmas-tree.jpg`,
      `${BASE}images/fav-christmas-tree2.jpg`,
      `${BASE}images/fav-christmas-tree3.jpg`,
      `${BASE}images/fav-christmas-tree4.jpg`,
      `${BASE}images/fav-residential-christmas.jpg`,
    ],
  },
  {
    id: 5,
    name: "Lobby",
    title: "Professional Lobby Plantscaping",
    description:
      "Elegant interior plantscaping that elevates professional spaces and creates lasting impressions.",
    featureImage: `${BASE}images/indoor-garden-seating.jpg`,
    gallery: [
      `${BASE}images/fav-lobby.jpg`,
      `${BASE}images/floral-anthurium.jpg`,
      `${BASE}images/planted-benches-garden.jpg`,
      `${BASE}images/tropical-arrangement-bowl.jpg`,
      `${BASE}images/tropical-arrangement.jpg`,
      `${BASE}images/fav-lobby-planter.jpg`,
      `${BASE}images/fav-water-feature-planter.jpg`,
      `${BASE}images/water-feature-indoor.jpg`,
      `${BASE}images/fav-water-feature.jpg`,
      `${BASE}images/fav-water-feature-planter2.jpg`,
    ],
  },
];

const Portfolio = ({ isFullPage = false }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardOrigin, setCardOrigin] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef(null);

  // Touch/drag support
  const dragStart = useRef(null);

  useEffect(() => {
    if (isFullPage) return;
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
  }, [isFullPage]);

  const openGallery = (category, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCardOrigin({
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    });
    setCurrentIndex(0);
    setActiveCategory(category);
    setIsVisible(false);
    analytics.portfolioView(category.name);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setIsVisible(true)),
    );
  };

  const closeGallery = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setActiveCategory(null);
      setCardOrigin(null);
    }, 380);
  }, []);

  const navigate = useCallback(
    (dir) => {
      setCurrentIndex((i) => {
        const total = activeCategory?.gallery.length ?? 1;
        return dir === "prev"
          ? i === 0
            ? total - 1
            : i - 1
          : i === total - 1
            ? 0
            : i + 1;
      });
    },
    [activeCategory],
  );

  // Keyboard navigation
  useEffect(() => {
    if (!activeCategory) return;
    const handler = (e) => {
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
      if (e.key === "Escape") closeGallery();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeCategory, navigate, closeGallery]);

  const handleTouchStart = (e) => {
    dragStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (dragStart.current === null) return;
    const diff = dragStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) navigate(diff > 0 ? "next" : "prev");
    dragStart.current = null;
  };

  const total = activeCategory?.gallery.length ?? 0;

  return (
    <section className="py-24 bg-sage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {!isFullPage && (
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-sage-200 text-sage-700 rounded-full text-sm font-medium mb-4">
              Installations We're Proud of
            </span>
            <h2 className="section-heading">Selected Works</h2>
            <p className="section-subheading">
              Explore our diverse collection of interior plantscaping designs
              across the Treasure Valley.
            </p>
          </div>
        )}

        {/* Feature Cards Grid */}
        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={(e) => openGallery(cat, e)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGallery(cat, e); } }}
              tabIndex={0}
              role="button"
              aria-label={`View ${cat.title} gallery`}
              data-reveal={isFullPage ? undefined : ""}
              className="group relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer aspect-[3/4] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2"
            >
              <img
                src={cat.featureImage}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={cat.imageStyle}
              />
              {/* Subtle darkening on hover for a sense of activation */}
              <div className="absolute inset-0 bg-forest-900/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Photo count badge */}
              <div className="absolute top-3 right-3 bg-forest-900/60 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5">
                <Images className="w-3.5 h-3.5 text-sage-300" />
                <span className="text-sage-300 text-xs font-medium">{cat.gallery.length}</span>
              </div>
              {/* Persistent title label */}
              <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-forest-900/85 to-transparent">
                <div className="flex items-end justify-between gap-2">
                  <h3 className="text-white text-sm md:text-lg font-display font-semibold drop-shadow-lg leading-snug">
                    {cat.title}
                  </h3>
                  <ChevronRight className="hidden md:block w-5 h-5 text-sage-300 flex-shrink-0 mb-0.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
                <p className="text-sage-300/90 text-xs mt-0.5 md:hidden">{cat.gallery.length} photos</p>
              </div>
            </div>
          ))}
        </div>

        {!isFullPage && (
          <div className="text-center mt-12">
            <Link to="/portfolio" className="btn-primary">
              View All Designs
            </Link>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {activeCategory && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
          style={{
            background: "rgba(38, 48, 18, 0.76)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
          onClick={closeGallery}
        >
          {/* Header */}
          <div
            className="w-full max-w-4xl flex items-center justify-between mb-4"
            style={{
              transform: isVisible ? "translateY(0)" : "translateY(-16px)",
              opacity: isVisible ? 1 : 0,
              transition:
                "transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium mb-1">
                {activeCategory.name}
              </span>
              <h3 className="text-white text-lg font-display font-semibold leading-snug drop-shadow-lg">
                {activeCategory.title}
              </h3>
            </div>
            <button
              onClick={closeGallery}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Carousel + Arrows */}
          <div
            className="flex items-center gap-4 w-full max-w-5xl"
            style={{
              transformOrigin: `${(cardOrigin?.x ?? 0.5) * 100}% ${(cardOrigin?.y ?? 0.5) * 100}%`,
              transform: isVisible ? "scale(1)" : "scale(0.08)",
              opacity: isVisible ? 1 : 0,
              transition: isVisible
                ? "transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease"
                : "transform 0.3s ease, opacity 0.2s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left arrow — hidden on mobile, swipe instead */}
            <button
              onClick={() => navigate("prev")}
              className="hidden md:flex shrink-0 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm items-center justify-center text-white transition-all shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Image + dots */}
            <div
              className="flex-1 flex flex-col gap-4"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Image container */}
              <div
                style={{
                  borderRadius: "1.25rem",
                  overflow: "hidden",
                  boxShadow:
                    "0 30px 80px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)",
                  position: "relative",
                  aspectRatio: "4/3",
                  background: "#0a0f0a",
                }}
              >
                {/* Blurred background — crossfades per slide */}
                {activeCategory.gallery.map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "absolute",
                      inset: "-30px",
                      backgroundImage: `url(${img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "blur(24px)",
                      transform: "scale(1.1)",
                      opacity: idx === currentIndex ? 0.75 : 0,
                      transition: "opacity 0.45s ease",
                      pointerEvents: "none",
                    }}
                  />
                ))}

                {/* Sliding image track */}
                <div
                  style={{
                    display: "flex",
                    width: `${total * 100}%`,
                    height: "100%",
                    transform: `translateX(-${(currentIndex / total) * 100}%)`,
                    transition:
                      "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    position: "relative",
                  }}
                >
                  {activeCategory.gallery.map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: `${100 / total}%`,
                        flexShrink: 0,
                        height: "100%",
                      }}
                    >
                      <img
                        src={img}
                        alt={`${activeCategory.name} ${idx + 1}`}
                        loading={
                          Math.abs(idx - currentIndex) <= 1 ? "eager" : "lazy"
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots + counter */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  {activeCategory.gallery.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      style={{
                        height: "6px",
                        width: idx === currentIndex ? "24px" : "6px",
                        borderRadius: "3px",
                        background:
                          idx === currentIndex
                            ? "#9daf6f"
                            : "rgba(255,255,255,0.25)",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                >
                  {currentIndex + 1} / {total}
                </span>
              </div>
            </div>

            {/* Right arrow — hidden on mobile, swipe instead */}
            <button
              onClick={() => navigate("next")}
              className="hidden md:flex shrink-0 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm items-center justify-center text-white transition-all shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
