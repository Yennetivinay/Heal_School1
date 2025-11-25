import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { id: 1, label: "About", to: "/about" },
  {
    id: 2,
    label: "Events",
    subItems: [
      { id: 21, label: "Annual Day", to: "/events/annual-day" },
      { id: 22, label: "Sports Day", to: "/events/sports-day" },
      { id: 23, label: "Science Fair", to: "/events/science-fair" },
    ],
  },
  { id: 3, label: "Gallery", to: "/gallery" },
  {
    id: 4,
    label: "Infrastructure & Facility",
    subItems: [
      { id: 41, label: "Library", to: "/infrastructure/library" },
      { id: 42, label: "Labs", to: "/infrastructure/labs" },
      { id: 43, label: "Sports Complex", to: "/infrastructure/sports-complex" },
      { id: 44, label: "Cafeteria", to: "/infrastructure/cafeteria" },
    ],
  },
  { id: 5, label: "Awards", to: "/awards" },
  {
    id: 6,
    label: "Academics",
    subItems: [
      { id: 61, label: "Programs", to: "/academics/programs" },
      { id: 62, label: "Faculty", to: "/academics/faculty" },
      { id: 63, label: "Curriculum", to: "/academics/curriculum" },
    ],
  },
  { id: 7, label: "Certifications", to: "/certifications" },
  { id: 8, label: "Disclosure", to: "/disclosure" },
  { id: 9, label: "Contact us", to: "/contact" },
];

function AppleNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeNav, setActiveNav] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const desktopListRef = useRef(null);
  const itemRefs = useRef({});
  const mobileMenuRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, height: 0, opacity: 0 });

  // Handle logo click - reload landing page
  const handleLogoClick = (e) => {
    e.preventDefault();
    setActiveNav(null);
    setHoveredItem(null);
    setOpenSubmenu(null);
    setIsMobileMenuOpen(false);
    
    // If already on landing page, reload it
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      // Navigate to landing page
      navigate("/");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
        setIsMobileMenuOpen(false);
        setHoveredItem(null);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }

      // Always show navbar at the top of the page
      if (currentScrollY < 10) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Sync activeNav with current location
  useEffect(() => {
    const pathname = location.pathname;
    const hash = location.hash;
    
    // Find matching nav item based on pathname
    const findMatchingItem = () => {
      // Check direct matches first
      const directMatch = navItems.find(item => item.to === pathname);
      if (directMatch) {
        setActiveNav(directMatch.id);
        return;
      }
      
      // Check sub-items
      for (const item of navItems) {
        if (item.subItems) {
          const subMatch = item.subItems.find(subItem => subItem.to === pathname);
          if (subMatch) {
            setActiveNav(subMatch.id);
            return;
          }
        }
      }
      
      // If on landing page with hash, try to match hash to sections
      if (pathname === "/" && hash) {
        // Hash links like #admissions, #vision, #mission don't have direct nav items
        // So we keep activeNav as null for landing page sections
        setActiveNav(null);
        return;
      }
      
      // If no match found, clear active nav
      setActiveNav(null);
    };
    
    findMatchingItem();
  }, [location.pathname, location.hash]);

  // Check if an item is active (either directly or through sub-items)
  const isItemActive = useCallback((item) => {
    if (activeNav === item.id) return true;
    if (item.subItems) {
      return item.subItems.some((subItem) => subItem.id === activeNav);
    }
    return false;
  }, [activeNav]);

  // Update indicator position based on active item
  const updateIndicatorPosition = useCallback(() => {
    if (!desktopListRef.current) return;
    
    // Find the active item element
    const target = Object.entries(itemRefs.current).find(([id, el]) => {
      if (!el) return false;
      const item = navItems.find((it) => String(it.id) === String(id));
      return item && isItemActive(item);
    });
    
    if (!target) {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    
    const [, el] = target;
    const containerRect = desktopListRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    
    setIndicatorStyle({
      left: rect.left - containerRect.left,
      width: rect.width,
      height: rect.height,
      opacity: 1,
    });
  }, [isItemActive]);

  // Handle navigation click - Safari-compatible
  const handleNavClick = (id, closeMobileMenu = true) => {
    // Update all states immediately in one batch
    setActiveNav(id);
    setHoveredItem(null);
    setOpenSubmenu(null);
    
    // Close mobile menu after a small delay to allow navigation
    if (closeMobileMenu) {
      setTimeout(() => {
        setIsMobileMenuOpen(false);
      }, 100);
    }
    
    // Safari needs double RAF for proper DOM updates
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updateIndicatorPosition();
      });
    });
  };

  const toggleMobileSubmenu = (id) => {
    setOpenSubmenu(openSubmenu === id ? null : id);
  };

  // Update indicator when activeNav changes - Safari-compatible
  useEffect(() => {
    if (activeNav !== null) {
      // Safari needs more time for DOM updates and reflow
      const timer = setTimeout(() => {
        // Force reflow for Safari
        if (desktopListRef.current) {
          desktopListRef.current.offsetHeight;
        }
        // Double RAF for Safari compatibility
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            updateIndicatorPosition();
          });
        });
      }, 20);
      return () => clearTimeout(timer);
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [activeNav, updateIndicatorPosition]);

  // Handle window resize
  useEffect(() => {
    const onResize = () => {
      if (activeNav !== null) {
        updateIndicatorPosition();
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeNav, updateIndicatorPosition]);

  return (
    <div className="min-h-fit bg-white">
      {/* Desktop Navbar */}
      <nav
            className={`hidden lg:block fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out max-w-7xl w-fit px-4 ${
              isVisible ? "translate-y-0 opacity-100" : "-translate-y-32 opacity-0"
            }`}
      >
        <div className="flex items-center justify-between bg-white h-12 md:h-12 border border-black/20 ring-1 ring-black/10 rounded-full px-3 md:px-5 py-1 shadow-[0_12px_50px_rgba(0,0,0,0.12)] mx-auto">
          
          <a 
            href="/"
            onClick={handleLogoClick}
            className="bg-white w-10 h-10 rounded-full mr-5  border border-black/20 flex items-center justify-center cursor-pointer"
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="h-8 md:h-8 lg:h-9 w-auto max-w-xs object-contain mr-0 shrink-0"
            />
          </a>
          

          <span className="hidden md:block h-6 w-px bg-black/10 mx-1 md:mx-2 lg:mx-3" />

          <div className="relative">
            <div
              className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 shadow-xl backdrop-blur-sm transition-all duration-150 ease-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                height: `${indicatorStyle.height}px`,
                opacity: indicatorStyle.opacity,
                willChange: "left, width, height, opacity",
                zIndex: 0,
              }}
            />
            <ul ref={desktopListRef} className="relative flex items-center justify-center space-x-1 xl:space-x-2" style={{ zIndex: 1 }}>
              {navItems.map((item) => (
              <li
                key={item.id}
                className="relative mx-1"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.to && !item.subItems ? (
                  <Link
                    to={item.to}
                    onClick={() => handleNavClick(item.id)}
                    ref={(el) => (itemRefs.current[item.id] = el)}
                    className={`relative z-10 group px-3 xl:px-4 py-2 mx-0.5 rounded-full text-xs xl:text-sm font-medium whitespace-nowrap flex items-center gap-1 transition-colors duration-150 ${
                      isItemActive(item)
                        ? "text-white"
                        : "text-slate-900 hover:bg-blue-50 hover:text-blue-700 hover:scale-105"
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => !item.subItems && handleNavClick(item.id)}
                    ref={(el) => (itemRefs.current[item.id] = el)}
                    className={`relative z-10 group px-3 xl:px-4 py-2 mx-0.5 rounded-full text-xs xl:text-sm font-medium whitespace-nowrap flex items-center gap-1 transition-colors duration-150 ${
                      isItemActive(item)
                        ? "text-white"
                        : "text-slate-900 hover:bg-blue-50 hover:text-blue-700 hover:scale-105"
                    }`}
                  >
                    {item.label}
                    {item.subItems && (
                      <ChevronDown
                        size={14}
                        className={`transition-colors duration-300 ${
                          isItemActive(item) ? "text-white" : "group-hover:text-blue-700"
                        }`}
                      />
                    )}
                  </button>
                )}

                {/* Desktop Dropdown */}
                {item.subItems && hoveredItem === item.id && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 z-50 pt-2"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="bg-white border border-black/10 rounded-2xl shadow-[0_12px_50px_rgba(0,0,0,0.12)] py-2 px-3 w-max overflow-hidden flex flex-col gap-1">
                      {item.subItems.map((subItem) =>
                        subItem.to ? (
                          <Link
                            to={subItem.to}
                            key={subItem.id}
                            onClick={() => {
                              handleNavClick(subItem.id);
                              setHoveredItem(null);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm rounded-full transition-colors duration-200 whitespace-nowrap ${
                              activeNav === subItem.id
                                ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg"
                                : "text-slate-900 hover:bg-blue-50 hover:text-blue-700"
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        ) : (
                          <button
                            key={subItem.id}
                            onClick={() => {
                              handleNavClick(subItem.id);
                              setHoveredItem(null);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm rounded-full transition-colors duration-200 whitespace-nowrap ${
                              activeNav === subItem.id
                                ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg"
                                : "text-slate-900 hover:bg-blue-50 hover:text-blue-700"
                            }`}
                          >
                            {subItem.label}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav
  className={`lg:hidden fixed top-4 left-4 right-4 z-50 transition-all duration-500 ease-in-out ${
    isVisible ? "translate-y-0 opacity-100" : "-translate-y-32 opacity-0"
  }`}
>
  <div 
    ref={mobileMenuRef}
    className="backdrop-blur-3xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/95 bg-white/95 border border-black/20 ring-1 ring-black/10 rounded-3xl px-6 py-4 shadow-[0_12px_50px_rgba(0,0,0,0.12)]"
  >
    <div className="flex items-center justify-between h-8">
      <div className="flex items-center space-x-3">
         <a 
           href="/"
           onClick={handleLogoClick}
           className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-black/20 cursor-pointer"
         >
           <img
             src="/logo.png"
             alt="Logo"
             className="h-8 w-auto max-w-xs object-contain"
           />
         </a>
        <span className="text-black font-semibold text-lg">Heal School</span>
      </div>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="text-slate-900 p-2 hover:bg-white/60 rounded-full transition-all duration-300"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>

    {/* Mobile Menu Dropdown */}
    <div
      className={`transition-all duration-300 ease-in-out overflow-y-auto ${
        isMobileMenuOpen
          ? "max-h-[500px] opacity-100 "
          : "max-h-0 opacity-0"
      }`}
    >
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.id} className="my-2">
            {item.subItems ? (
              <div>
                {/* FIXED: Move background colors to wrapper div */}
                <div className={`px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isItemActive(item)
                    ? "bg-gradient-to-r from-blue-600 to-sky-500 shadow-lg"
                    : "hover:bg-blue-50"
                }`}>
                  <button
                    onClick={() => toggleMobileSubmenu(item.id)}
                    className={`group w-full text-left text-sm font-medium transition-all duration-300 flex items-start justify-between gap-2 ${
                      isItemActive(item)
                        ? "text-white"
                        : "text-slate-900 hover:text-blue-700"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`shrink-0 transition-transform duration-300 ${openSubmenu === item.id ? "rotate-180" : ""} ${isItemActive(item) ? "text-white" : "group-hover:text-blue-700"}`}
                    />
                  </button>
                </div>

                {/* Mobile Submenu */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSubmenu === item.id ? "max-h-96 mt-2" : "max-h-0"
                  }`}
                >
                  <div className="ml-4 flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-2 overflow-hidden">
                    {item.subItems.map((subItem) =>
                      subItem.to ? (
                        <Link
                          to={subItem.to}
                          key={subItem.id}
                          onClick={(e) => {
                            handleNavClick(subItem.id);
                            // Allow navigation to proceed
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm rounded-full transition-colors duration-200 whitespace-normal break-words ${
                            activeNav === subItem.id
                              ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg"
                              : "text-slate-900 hover:bg-blue-50 hover:text-blue-700"
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      ) : (
                        <button
                          key={subItem.id}
                          onClick={() => handleNavClick(subItem.id)}
                          className={`block w-full text-left px-4 py-2 text-sm rounded-full transition-colors duration-200 whitespace-normal break-words ${
                            activeNav === subItem.id
                              ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg"
                              : "text-slate-900 hover:bg-blue-50 hover:text-blue-700"
                          }`}
                        >
                          {subItem.label}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : item.to ? (
              // FIXED: Single link items with consistent hover width
              <div className={`px-4 py-3 rounded-2xl transition-all duration-300 ${
                activeNav === item.id
                  ? "bg-gradient-to-r from-blue-600 to-sky-500 shadow-lg"
                  : "hover:bg-blue-50"
              }`}>
                <Link
                  to={item.to}
                  onClick={(e) => {
                    handleNavClick(item.id);
                    // Allow navigation to proceed
                  }}
                  className={`block w-full text-left text-sm font-medium transition-all duration-300 whitespace-normal break-words ${
                    activeNav === item.id
                      ? "text-white"
                      : "text-slate-900 hover:text-blue-700"
                  }`}
                >
                  {item.label}
                </Link>
              </div>
            ) : (
              // FIXED: Button items with consistent hover width
              <div className={`px-4 py-3 rounded-2xl transition-all duration-300 ${
                activeNav === item.id
                  ? "bg-gradient-to-r from-blue-600 to-sky-500 shadow-lg"
                  : "hover:bg-blue-50"
              }`}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left text-sm font-medium transition-all duration-300 ${
                    activeNav === item.id
                      ? "text-white"
                      : "text-slate-900 hover:text-blue-700"
                  }`}
                >
                  {item.label}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  </div>
</nav>
    </div>
  );
}

export default AppleNavbar;