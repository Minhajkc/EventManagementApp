import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CalendarIcon, MapPinIcon, ClockIcon, UserIcon } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/events', { withCredentials: true });
        setEvents(response.data);
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to fetch events: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleBook = async (eventId) => {
    try {
      await axios.post(`http://localhost:5000/events/${eventId}/book`, {}, { withCredentials: true });
      toast.success('Booking successful!');
    } catch (err) {
      console.error('Booking error:', err.response ? err.response.data : err.message);
      toast.error(`${err.response ? err.response.data.message : err.message}`);
    }
  };

  const filteredEvents = selectedDate
    ? events.filter(event => new Date(event.date).toDateString() === selectedDate.toDateString())
    : events;

  if (loading) return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-600"></div>
  </div>;
  
  if (error) return <div className="text-red-600 text-center text-xl mt-10">Error: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen">

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-cyan-800 mb-8 text-center">Upcoming Events</h1>

        <div className="mb-8 flex justify-center">
          <button
            className="bg-cyan-600 text-white py-3 px-6 rounded-full hover:bg-cyan-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 shadow-lg"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            {showCalendar ? 'Hide Calendar' : 'Filter by Date'}
          </button>
        </div>

        {showCalendar && (
          <div className="mb-8 flex flex-col items-center">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="rounded-lg shadow-lg"
            />
            <button
              className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-full hover:bg-gray-600 transition duration-300 ease-in-out"
              onClick={() => setSelectedDate(null)}
            >
              Clear Date Filter
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
                  <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
                  <p className="text-cyan-100 text-sm">{event.description}</p>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <UserIcon className="h-5 w-5 text-cyan-600 mr-2" />
                    <p className="text-gray-700 font-semibold">{event.organizer.username}</p>
                  </div>
                  <div className="flex items-center mb-4">
                    <CalendarIcon className="h-5 w-5 text-cyan-600 mr-2" />
                    <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center mb-4">
                    <ClockIcon className="h-5 w-5 text-cyan-600 mr-2" />
                    <p className="text-gray-600">{event.time}</p>
                  </div>
                  <div className="flex items-center mb-6">
                    <MapPinIcon className="h-5 w-5 text-cyan-600 mr-2" />
                    <p className="text-gray-600">{event.location || 'Location TBA'}</p>
                  </div>
                  <button
                    onClick={() => handleBook(event._id)}
                    className="w-full bg-gradient-to-r from-cyan-800 to-blue-500 text-white py-3 px-4 rounded-lg hover:bg-cyan-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-xl text-gray-600">No events found for the selected date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;