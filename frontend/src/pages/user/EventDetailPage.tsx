import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface Event {
  _id: string;
  title: string;
  start_date: string;
  start_time: string;
  venue: string;
  event_type: string;
  cost: string | number;
  image_base64?: string;
  description?: string; // Add other fields as per your API
  // Add more fields if your API returns additional event details
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>(); // Get event ID from URL
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/user/events/${id}/`);
        setEvent(response.data);
        console.log("API Response:", response.data);
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.error || "Failed to load event details.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="max-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600 mt-2">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error || "Event not found."}</p>
          <button
            className="mt-4 px-6 py-2 text-white rounded-md font-medium transition-colors"
            style={{ backgroundColor: "#8B5CF6" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7C3AED")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#8B5CF6")}
            onClick={() => navigate("/userdashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">
              <span style={{ color: "#000000ff" }}>Event</span>{" "}
              <span style={{ color: "#8B5CF6" }}>Hive</span>
            </h1>
            <button
              className="text-white px-6 py-2 rounded-md font-medium transition-colors"
              style={{ backgroundColor: "#8B5CF6" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7C3AED")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#8B5CF6")}
              onClick={() => navigate("/userdashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Event Details */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={
                event.image_base64
                  ? `data:image/png;base64,${event.image_base64}`
                  : "/placeholder.svg?height=400&width=600"
              }
              alt={event.title}
              className="w-full h-96 object-cover"
            />
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-4">
                <span style={{ color: "#000000ff" }}>{event.title}</span>
              </h2>
              <p className="text-purple-600 text-lg mb-2">
                {new Date(event.start_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                , {event.start_time}
              </p>
              <p className="text-gray-600 text-lg mb-2">{event.venue}</p>
              <p className="text-gray-600 text-lg mb-2 font-bold">{event.event_type}</p>
              <p className="text-gray-600 text-lg mb-4">
                Cost: {event.cost === "0" || event.cost === 0 ? "Free" : `₹${event.cost}`}
              </p>
              <p className="text-gray-700 text-base mb-6">
                {event.description || "No description available."}
              </p>
              <button
                className="w-full py-3 px-6 text-white rounded-md font-medium transition-colors"
                style={{ backgroundColor: "#8B5CF6" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7C3AED")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#8B5CF6")}
              >
                {event.cost === "0" || event.cost === 0 ? "Book Now" : `Book for ₹${event.cost}`}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}