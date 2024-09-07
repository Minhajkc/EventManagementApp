import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRCode from 'react-qr-code';
import { CalendarIcon, ClockIcon, TicketIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

const BookedEvents = () => {
  const [events, setEvents] = useState([]);
  const [userId, setUserId] = useState(null); // State to store userId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookedEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user/events', { withCredentials: true });
        const sortedEvents = response.data.events
          .map(event => ({
            ...event,
            status: getStatus(event.date),
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date)); // Upcoming events first

        setEvents(sortedEvents);
        setUserId(response.data.userId); // Extract userId from response
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Failed to fetch booked events');
        toast.error(err.response ? err.response.data.message : 'Failed to fetch booked events');
      } finally {
        setLoading(false);
      }
    };

    fetchBookedEvents();
  }, []);

  const getStatus = (date) => {
    const today = new Date();
    const eventDate = new Date(date);
    return eventDate > today ? 'Active' : 'Expired';
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-600"></div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-8">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
   
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-cyan-800 mb-8 text-center">Your Booked Events</h1>
        
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 ${
                  event.status === 'Active' ? 'border-2 border-green-500' : 'border-2 border-red-500'
                }`}
              >
                <div
                  className={`p-4 ${
                    event.status === 'Active' ? 'bg-gradient-to-r from-green-500 to-teal-500' : 'bg-gradient-to-r from-red-500 to-orange-500'
                  }`}
                >
                  <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
                  <p className="text-cyan-100 text-sm">{event.description}</p>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <CalendarIcon className="h-5 w-5 text-cyan-600 mr-2" />
                    <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center mb-4">
                    <ClockIcon className="h-5 w-5 text-cyan-600 mr-2" />
                    <p className="text-gray-600">{event.time}</p>
                  </div>
                  <div className="flex items-center">
                    <p className={`text-gray-600 font-semibold float-end ${
                    event.status === 'Active' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {event.status === 'Active' ? <CheckCircleIcon className="h-5 w-5 mr-2" /> : <XCircleIcon className="h-5 w-5 mr-2" />}
                      {event.status}
                      
                    </p>
                  </div>
                  {event.status === 'Active' && (
                    <div className="flex justify-center mb-4">
                      <QRCode value={`${userId} ${event._id} ${event.title}`} size={128} />
                    </div>
                  )}
                  <div className="flex items-center justify-center text-cyan-600">
                    
                    <TicketIcon  className="h-5 w-5 mr-2" />
                    {event.status === 'Active'? ( <p className="font-semibold">Ticket Confirmed</p>):<p className="font-semibold text-red-500">Ticket Expired</p>}
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <TicketIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No booked events found.</p>
            <p className="mt-2 text-gray-500">When you book an event, it will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedEvents;
