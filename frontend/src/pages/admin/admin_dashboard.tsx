import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import admin_dashboard_img from "../../assets/admin_img.png";

// Define the Event type with at least the 'venue' property (add others as needed)
interface Event {
  _id: string;
  title: string;
  venue: string;
  start_date: string;
  start_time: string;
  cost: string | number;
  image_base64?: string;
  // Add other properties if needed
}

export default function UserDashboard() {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const heroImages = [
    admin_dashboard_img,
    admin_dashboard_img,
    admin_dashboard_img,
  ];
  const [currentSlide] = useState(0);

  // Fetch events from backend and extract unique venues
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const authToken = sessionStorage.getItem("auth_token");
        if (!authToken) {
          setError("You are not authenticated.");
          return;
        }
        const response = await axios.get(
          "http://127.0.0.1:8000/api/admin/admin_events/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setFilteredEvents(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load admin events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);


  const navigate = useNavigate();






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
              {isAuthenticated && (
                <button
                  onClick={() => navigate("/admincreateevent")}
                  className="text-white px-6 py-2 rounded-md font-medium transition-colors"
                  style={{ backgroundColor: "#10B981" }} // Green color
                  onMouseEnter={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor = "#059669")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor = "#10B981")
                  }
                >
                  + Create Event
                </button>
              )}
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
                      ((e.target as HTMLButtonElement).style.backgroundColor = "#7C3AED")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLButtonElement).style.backgroundColor = "#8B5CF6")
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
                    ((e.target as HTMLButtonElement).style.backgroundColor = "#7C3AED")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor = "#8B5CF6")
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
      <section className="relative rounded:1g shadow-l0g">
        <div className="relative h-100 px-10 py-5 pt-2 overflow-hidden ">
          <img
            src={heroImages[currentSlide] || admin_dashboard_img}
            alt="Event audience"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-3xl font-bold mb-4 md:mb-0">
              <span style={{ color: "#000000ff" }}>Listed Events</span>
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
                      <p className="text-gray-600 text-sm mb-4">
                        {event.venue}
                      </p>
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
                  ((e.target as HTMLButtonElement).style.backgroundColor = "#7C3AED")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLButtonElement).style.backgroundColor = "#8B5CF6")
                }
              >
                Load more...
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
