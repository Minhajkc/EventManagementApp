import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import { CalendarIcon, ClockIcon, PlusCircleIcon, ListIcon } from 'lucide-react';

const OrganizerDashboard = () => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
  });
  const [errors, setErrors] = useState({});
  const [events, setEvents] = useState([]);
  const [bookedEvents, setBookedEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/eventsbyid', { withCredentials: true });
        setEvents(response.data);
        console.log(response);
      } catch (error) {
        toast.error(error.response ? error.response.data.message : 'Failed to fetch events');
      }
    };

    const fetchBookedEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/organizer/booked-events', { withCredentials: true });
        setBookedEvents(response.data);
        console.log(response);
      } catch (error) {
        toast.error(error.response ? error.response.data.message : 'Failed to fetch booked events');
      }
    };

    fetchEvents();
    fetchBookedEvents();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!eventData.title) newErrors.title = 'Required';
    if (!eventData.date) newErrors.date = 'Required';
    if (!eventData.time) newErrors.time = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post('http://localhost:5000/events', eventData, { withCredentials: true });
        setEvents([...events, response.data]);
        toast.success('Event added successfully!');
        setEventData({ title: '', description: '', date: '', time: '' });
      } catch (error) {
        toast.error(error.response ? error.response.data.message : 'Failed to add event');
      }
    }
  };

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const localDate = date.toLocaleDateString('en-CA');
    setEventData({ ...eventData, date: localDate });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6">
  
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-cyan-700 mb-6">Organizer Dashboard</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Form */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4 text-cyan-600 flex items-center">
              <PlusCircleIcon className="mr-2 h-5 w-5" /> New Event
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  name="title"
                  placeholder="Event Title"
                  value={eventData.title}
                  onChange={handleChange}
                  className={`w-full p-2 text-sm border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <textarea
                  name="description"
                  placeholder="Event Description"
                  value={eventData.description}
                  onChange={handleChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                  rows="3"
                />
              </div>

              <div className="flex space-x-2">
                <div className="flex-1">
                  <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    className="w-full text-sm border border-gray-300 rounded"
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>
                <div className="flex-1">
                  <input
                    type="time"
                    name="time"
                    value={eventData.time}
                    onChange={handleChange}
                    className={`w-full p-2 text-sm border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500`}
                  />
                  {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-600 text-white text-sm font-semibold py-2 rounded hover:bg-cyan-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
              >
                Add Event
              </button>
            </form>
          </div>

          {/* List of Events */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4 text-cyan-600 flex items-center">
              <ListIcon className="mr-2 h-5 w-5" /> Organized Events
            </h3>
            <div className="overflow-y-auto max-h-[500px] pr-2">
              {events.length > 0 ? (
                <ul className="space-y-3">
                  {events.map((event) => (
                    <li key={event._id} className="p-3 bg-gray-50 rounded-md shadow-sm transition duration-300 hover:shadow-md">
                      <h4 className="text-md font-semibold text-cyan-600 mb-1">{event.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        <p className="mr-3">{new Date(event.date).toLocaleDateString()}</p>
                        <ClockIcon className="mr-1 h-4 w-4" />
                        <p>{event.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-gray-500">
                  <ListIcon className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">No events found.</p>
                </div>
              )}
            </div>
          </div>

         {/* Booked Events Section */}
         <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4 text-cyan-600 flex items-center">
              <ListIcon className="mr-2 h-5 w-5" /> Booked Events
            </h3>
            <div className="overflow-y-auto max-h-[500px] pr-2">
              {bookedEvents.length > 0 ? (
                <ul className="space-y-3">
                  {bookedEvents.map((event, index) => (
                    <li key={index} className="p-3 bg-gray-50 rounded-md shadow-sm transition duration-300 hover:shadow-md">
                      <h4 className="text-md font-semibold text-cyan-600 mb-1">{event.eventTitle}</h4>
                      <div className="flex flex-col text-xs text-gray-500">
                        <div className="flex items-center mb-1">
                          <CalendarIcon className="mr-1 h-4 w-4" />
                          <p className="mr-3">{new Date(event.date).toLocaleDateString()}</p>
                          <ClockIcon className="mr-1 h-4 w-4" />
                          <p>{event.time}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-gray-700">Booked Users:</h5>
                          <ul className="list-disc list-inside ml-4">
                            {event.bookedUsers.map(userId => (
                              <li key={userId} className="text-sm text-gray-600">{userId}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-gray-500">
                  <ListIcon className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">No booked events found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
