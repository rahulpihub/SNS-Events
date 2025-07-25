import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import user_dashboard_img from "../../assets/user_img.png";

export default function UserDashboard() {
  interface Event {
    _id: string;
    title: string;
    start_date: string;
    start_time: string;
    venue: string;
    event_type: string;
    cost: string | number;
    image_base64?: string;
  }

  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    eventType: "",
    location: "",
    when: "",
  });
  const [uniqueVenues, setUniqueVenues] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uniqueEventTypes, setUniqueEventTypes] = useState<string[]>([]);

  const heroImages = [
    user_dashboard_img,
    user_dashboard_img,
    user_dashboard_img,
  ];

  // Fetch events from backend and extract unique venues
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/events/");
        setEvents(response.data);
        setFilteredEvents(response.data);
        interface Event {
          _id: string;
          title: string;
          start_date: string;
          start_time: string;
          venue: string;
          event_type: string;
          cost: string | number;
          image_base64?: string;
        }
        const venues = [
          ...new Set(
            (response.data as Event[]).map((event: Event) => event.venue)
          ),
        ] as string[];
        setUniqueVenues(venues);
        // Extract unique event types
        const eventTypes = [
          ...new Set(
            (response.data as Event[]).map((event: Event) => event.event_type)
          ),
        ];
        setUniqueEventTypes(eventTypes);
      } catch (err) {
        console.error(err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length
    );
  };

  const navigate = useNavigate();

  const handleSearch = () => {
    console.log("Search filters:", searchFilters);
    const filtered = events.filter((event) => {
      const eventDate = new Date(event.start_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isWithinDateRange = (range: string): boolean => {
        const startOfWeek: Date = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek: Date = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        const startOfNextWeek: Date = new Date(endOfWeek);
        startOfNextWeek.setDate(endOfWeek.getDate() + 1);
        const endOfNextWeek: Date = new Date(startOfNextWeek);
        endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
        const startOfWeekend: Date = new Date(today);
        startOfWeekend.setDate(today.getDate() + (6 - today.getDay()));
        const endOfWeekend: Date = new Date(startOfWeekend);
        endOfWeekend.setDate(startOfWeekend.getDate() + 1);

        switch (range) {
          case "today":
            return eventDate.toDateString() === today.toDateString();
          case "tomorrow":
            const tomorrow: Date = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            return eventDate.toDateString() === tomorrow.toDateString();
          case "this-week":
            return eventDate >= startOfWeek && eventDate <= endOfWeek;
          case "this-weekend":
            return eventDate >= startOfWeekend && eventDate <= endOfWeekend;
          case "next-week":
            return eventDate >= startOfNextWeek && eventDate <= endOfNextWeek;
          default:
            return true;
        }
      };

      const matchesEventType = searchFilters.eventType
        ? event.event_type.toLowerCase() ===
          searchFilters.eventType.toLowerCase()
        : true;
      const matchesLocation = searchFilters.location
        ? event.venue.toLowerCase() === searchFilters.location.toLowerCase()
        : true;
      const matchesWhen = searchFilters.when
        ? isWithinDateRange(searchFilters.when)
        : true;

      return matchesEventType && matchesLocation && matchesWhen;
    });
    setFilteredEvents(filtered);
  };

  const handleFilterChange = (
    filterType: "eventType" | "location" | "when",
    value: string
  ) => {
    setSearchFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleResetFilters = () => {
    setSearchFilters({
      eventType: "",
      location: "",
      when: "",
    });
    setFilteredEvents(events);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    navigate("/userdashboard");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">
                <span style={{ color: "#000000ff" }}>Event</span>{" "}
                <span style={{ color: "#8B5CF6" }}>Hive</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate("/signin")}
                    className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    <span style={{ color: "#ffffffff" }}>Login</span>
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="text-white px-6 py-2 rounded-md font-medium transition-colors"
                    style={{ backgroundColor: "#8B5CF6" }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLButtonElement).style.backgroundColor =
                        "#7C3AED")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLButtonElement).style.backgroundColor =
                        "#8B5CF6")
                    }
                  >
                    Signup
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-white px-6 py-2 rounded-md font-medium transition-colors"
                  style={{ backgroundColor: "#8B5CF6" }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor =
                      "#7C3AED")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor =
                      "#8B5CF6")
                  }
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-96 overflow-hidden">
          <img
            src={heroImages[currentSlide] || user_dashboard_img}
            alt="Event audience"
            className="w-full h-full object-cover"
          />

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Overlay Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl mb-55 md:text-5xl font-bold text-white text-center">
              MADE FOR THOSE
              <br />
              WHO DO
            </h2>
          </div>
        </div>

        {/* Search Bar - Updated to match the dark blue color from image */}
        <div style={{ backgroundColor: "#10107B" }} className="py-6">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-white text-sm font-medium mb-2">
                  Looking for
                </label>
                <select
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchFilters.eventType}
                  onChange={(e) =>
                    handleFilterChange("eventType", e.target.value)
                  }
                >
                  <option value="">Choose event type</option>
                  {uniqueEventTypes.map((eventType) => (
                    <option key={eventType} value={eventType.toLowerCase()}>
                      {eventType}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-white text-sm font-medium mb-2">
                  Location
                </label>
                <select
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchFilters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                >
                  <option value="">Choose location</option>
                  {uniqueVenues.map((venue) => (
                    <option key={venue} value={venue.toLowerCase()}>
                      {venue}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-white text-sm font-medium mb-2">
                  When
                </label>
                <select
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchFilters.when}
                  onChange={(e) => handleFilterChange("when", e.target.value)}
                >
                  <option value="">Choose date and time</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="this-week">This Week</option>
                  <option value="this-weekend">This Weekend</option>
                  <option value="next-week">Next Week</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  className="px-6 py-3 text-white rounded-md transition-colors hover:bg-opacity-90"
                  style={{ backgroundColor: "#8B5CF6" }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor =
                      "#7C3AED")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor =
                      "#8B5CF6")
                  }
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-3 text-white rounded-md transition-colors hover:bg-opacity-90"
                  style={{ backgroundColor: "#6B7280" }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor =
                      "#4B5563")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor =
                      "#6B7280")
                  }
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-3xl font-bold mb-4 md:mb-0">
              <span style={{ color: "#000000ff" }}>Upcoming</span>
              <span style={{ color: "#8B5CF6" }}> Events</span>
            </h2>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="text-gray-600 mt-2">Loading events...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Event Cards Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div
                    key={event._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={
                          event.image_base64
                            ? `data:image/png;base64,${event.image_base64}`
                            : "/placeholder.svg?height=200&width=300"
                        }
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      <span
                        className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold text-white rounded ${
                          event.cost === "0" || event.cost === 0
                            ? "bg-blue-500"
                            : "bg-indigo-900"
                        }`}
                      >
                        {event.cost === "0" || event.cost === 0
                          ? "FREE"
                          : "PAID"}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">
                        <span style={{ color: "#000000ff" }}>
                          {event.title}
                        </span>
                      </h3>
                      <p className="text-purple-600 text-sm mb-1">
                        {new Date(event.start_date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                        , {event.start_time}
                      </p>
                      <p className="text-gray-600 text-sm mb-1">
                        {event.venue}
                      </p>
                      <p className="text-gray-600 text-sm mb-4 font-bold">
                        {event.event_type}
                      </p>
                      <button
                        className="w-full py-2 px-4 text-white rounded-md font-medium transition-colors"
                        style={{ backgroundColor: "#8B5CF6" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#7C3AED")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#8B5CF6")
                        }
                        onClick={() => navigate(`/event/${event._id}`)} // Navigate to event detail page
                      >
                        {event.cost === "0" || event.cost === 0
                          ? "Book Now"
                          : `₹${event.cost}`}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 col-span-full">
                  <p className="text-gray-600">
                    No events match your search criteria.
                  </p>
                </div>
              )}
            </div>
          )}
          {/* Load More Button */}
          {!loading && !error && filteredEvents.length > 0 && (
            <div className="text-center">
              <button
                className="px-8 py-3 text-white rounded-md font-medium transition-colors"
                style={{ backgroundColor: "#8B5CF6" }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLButtonElement).style.backgroundColor =
                    "#7C3AED")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLButtonElement).style.backgroundColor =
                    "#8B5CF6")
                }
              >
                Load more...
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer - Updated to match the dark blue color from image */}
      <footer
        style={{ backgroundColor: "#10107B" }}
        className="text-white py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl font-bold mb-4 md:mb-0">
              Event <span style={{ color: "#A78BFA" }}>Hive</span>
            </h2>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your mail"
                className="px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                className="px-6 py-2 text-white rounded-md font-medium transition-colors"
                style={{ backgroundColor: "#8B5CF6" }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLButtonElement).style.backgroundColor =
                    "#7C3AED")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLButtonElement).style.backgroundColor =
                    "#8B5CF6")
                }
              >
                Subscribe
              </button>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <a href="#" className="hover:text-purple-300 transition-colors">
              Home
            </a>
            <a href="#" className="hover:text-purple-300 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-purple-300 transition-colors">
              Services
            </a>
            <a href="#" className="hover:text-purple-300 transition-colors">
              Get in touch
            </a>
            <a href="#" className="hover:text-purple-300 transition-colors">
              FAQs
            </a>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-blue-800">
            <div className="flex gap-2 mb-4 md:mb-0">
              <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm">
                English
              </button>
              <button className="px-3 py-1 text-gray-300 hover:text-white rounded text-sm transition-colors">
                French
              </button>
              <button className="px-3 py-1 text-gray-300 hover:text-white rounded text-sm transition-colors">
                Hindi
              </button>
            </div>
            <div className="text-center md:text-right">
              <div className="flex justify-center md:justify-end gap-4 mb-2">
                <a href="#" className="hover:text-purple-300 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-purple-300 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-purple-300 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
              <p className="text-sm text-gray-400">
                Non Copyrighted © 2023 Upload by EventHive
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
