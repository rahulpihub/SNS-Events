import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

export default function AdminCreateEventPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    venue: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    cost: "",
    description: "",
    eventType: "ONLINE",
  });

  const [errors, setErrors] = useState({
    title: "",
    venue: "",
    image: "",
    date: "",
  });

  const handleLogout = () => {
    sessionStorage.removeItem("auth_token"); // Remove auth token
    navigate("/signin"); // Redirect to login page
  };

  useEffect(() => {
    const authToken = sessionStorage.getItem("auth_token");
    if (!authToken) {
      navigate("/signin");
    }
  }, [navigate]);

  // Date and Time helper functions
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const formatTimeForInput = (timeString: string) => {
    if (!timeString) return "";
    return timeString;
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  /** ---------------- IMAGE BASE64 UTILITY ---------------- */
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  /** ---------------- IMAGE UPLOAD ---------------- */
  const validateImage = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return "Only JPG, JPEG, or PNG files are allowed.";
    }
    if (file.size > 5 * 1024 * 1024) {
      return "Image size must be less than 5MB.";
    }
    return "";
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const errorMsg = validateImage(file);
      if (errorMsg) {
        setErrors((prev) => ({ ...prev, image: errorMsg }));
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        setErrors((prev) => ({ ...prev, image: "" }));
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const errorMsg = validateImage(file);
      if (errorMsg) {
        setErrors((prev) => ({ ...prev, image: errorMsg }));
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        setErrors((prev) => ({ ...prev, image: "" }));
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  /** ---------------- HANDLE INPUT CHANGE ---------------- */
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let field = id.replace("event", "").toLowerCase();

    // Handle special cases for date/time fields
    if (id === "startDate") field = "startDate";
    if (id === "endDate") field = "endDate";
    if (id === "startTime") field = "startTime";
    if (id === "endTime") field = "endTime";

    setFormData({ ...formData, [field]: value });

    // Validation
    if (id === "eventTitle" && value.length > 50) {
      setErrors((prev) => ({
        ...prev,
        title: "Title cannot exceed 50 characters.",
      }));
    } else if (id === "eventTitle") {
      setErrors((prev) => ({ ...prev, title: "" }));
    }

    if (id === "eventVenue" && value.length > 150) {
      setErrors((prev) => ({
        ...prev,
        venue: "Venue cannot exceed 150 characters.",
      }));
    } else if (id === "eventVenue") {
      setErrors((prev) => ({ ...prev, venue: "" }));
    }
  };

  /** ---------------- AI DESCRIPTION ---------------- */
  const handleAiDescription = async () => {
    if (
      !formData.title ||
      !formData.venue ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.cost
    ) {
      alert("Fill all event details before generating description.");
      return;
    }
    setLoadingAI(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/admin/ai_description/",
        {
          title: formData.title,
          venue: formData.venue,
          start_date: formData.startDate,
          end_date: formData.endDate,
          start_time: formData.startTime,
          end_time: formData.endTime,
          cost: formData.cost,
        }
      );
      setFormData({ ...formData, description: res.data.description });
    } catch (err) {
      alert("Error generating AI description.");
    } finally {
      setLoadingAI(false);
    }
  };

  /** ---------------- FORM SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (errors.title || errors.venue || errors.image) {
      alert("Fix validation errors before submitting.");
      return;
    }
    if (
      formData.startDate > formData.endDate ||
      (formData.startDate === formData.endDate &&
        formData.startTime >= formData.endTime)
    ) {
      alert("Start date/time must be before end date/time.");
      return;
    }
    try {
      const authToken = sessionStorage.getItem("auth_token");
      if (!authToken) {
        alert("You are not authenticated. Please log in again.");
        return;
      }
      let imageBase64 = null;
      if (selectedImage) {
        imageBase64 = await getBase64(selectedImage);
      }
      const payload = {
        ...formData,
        image_base64: imageBase64,
      };
      await axios.post(
        "http://127.0.0.1:8000/api/admin/create_event/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Send JWT token
          },
        }
      );

      alert("Event created successfully!");
      navigate("/admindashboard");
    } catch (err: any) {
      alert(err.response?.data?.error || "Error creating event.");
    }
  };

  /** ---------------- BUTTON DISABLE ---------------- */
  const isFormValid =
    formData.title.length > 0 &&
    formData.venue.length > 0 &&
    !errors.title &&
    !errors.venue &&
    !errors.image &&
    formData.startDate &&
    formData.endDate &&
    formData.startTime &&
    formData.endTime &&
    formData.cost &&
    selectedImage;

  /** ---------------- JSX ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-8">
            Event <span style={{ color: "#8B5CF6" }}>Hive</span>
          </h2>
          <h1 className="text-4xl font-bold text-black">Create Event</h1>
        </div>
        <div className="flex justify-between mb-6">
          <button
            onClick={() => navigate("/admindashboard")}
            type="button"
            className="px-4 py-2 bg-gray-300 text-white rounded hover:bg-gray-400 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          <div className="space-y-8">
            {/* Event Title */}
            <div>
              <label
                htmlFor="eventTitle"
                className="block text-lg font-semibold text-black mb-3"
              >
                Event Title
              </label>
              <input
                id="eventTitle"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-2">{errors.title}</p>
              )}
            </div>

            {/* Event Venue */}
            <div>
              <label
                htmlFor="eventVenue"
                className="block text-lg font-semibold text-black mb-3"
              >
                Event Venue
              </label>
              <input
                id="eventVenue"
                type="text"
                value={formData.venue}
                onChange={handleInputChange}
                placeholder="Enter venue address"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
              {errors.venue && (
                <p className="text-red-500 text-sm mt-2">{errors.venue}</p>
              )}
            </div>

            {/* Event Type Dropdown */}
            <div>
              <label
                htmlFor="eventType"
                className="block text-lg font-semibold text-black mb-3"
              >
                Event Type
              </label>
              <select
                id="eventType"
                value={formData.eventType}
                onChange={(e) =>
                  setFormData({ ...formData, eventType: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="ONLINE">ONLINE EVENT - Attend Everywhere</option>
                <option value="OFFLINE">OFFLINE EVENT</option>
              </select>
            </div>

            {/* Start Date and End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-lg font-semibold text-black mb-3"
                >
                  Start Date
                </label>
                <div className="relative">
                  <input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    min={getCurrentDate()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 cursor-pointer"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-lg font-semibold text-black mb-3"
                >
                  End Date
                </label>
                <div className="relative">
                  <input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={formData.startDate || getCurrentDate()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 cursor-pointer"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Time and End Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-lg font-semibold text-black mb-3"
                >
                  Start Time
                </label>
                <div className="relative">
                  <input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 cursor-pointer"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {formData.startTime && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected:{" "}
                    {new Date(
                      `2000-01-01T${formData.startTime}`
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="endTime"
                  className="block text-lg font-semibold text-black mb-3"
                >
                  End Time
                </label>
                <div className="relative">
                  <input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    min={
                      formData.startDate === formData.endDate
                        ? formData.startTime
                        : undefined
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 cursor-pointer"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {formData.endTime && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected:{" "}
                    {new Date(
                      `2000-01-01T${formData.endTime}`
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>

            {/* Event Cost */}
            <div>
              <label
                htmlFor="eventCost"
                className="block text-lg font-semibold text-black mb-3"
              >
                Event Cost
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  id="eventCost"
                  type="number"
                  value={formData.cost}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Enter amount in Indian Rupees (INR)
              </p>
            </div>

            {/* Event Image Upload */}
            <div>
              <label className="block text-lg font-semibold text-black mb-3">
                Event Image
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300 bg-gray-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Selected event"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-gray-600">
                      Click or drag to change image
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Upload Here
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Click or drag and drop your image
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm mt-2">{errors.image}</p>
              )}
            </div>

            {/* Event Description */}
            <div>
              <label
                htmlFor="eventDescription"
                className="block text-lg font-semibold text-black mb-3"
              >
                Event Description
              </label>
              <textarea
                id="eventDescription"
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Type here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 resize-vertical"
              />
              <button
                type="button"
                onClick={handleAiDescription}
                disabled={loadingAI}
                className="mt-3 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400 transition-colors"
              >
                {loadingAI ? "Generating..." : "✨ AI Description"}
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-4 px-6 rounded-md text-white font-semibold text-lg transition-colors duration-200 ${
                  isFormValid
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Create Event
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
