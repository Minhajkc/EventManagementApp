import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Calendar, MapPin, ArrowRight, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { CalendarIcon, MapPinIcon, ClockIcon, UserIcon } from 'lucide-react';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


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

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribed:', email);
    setEmail('');
  };

  const handleBook = async (eventId) => {
    try {
      await axios.post(`http://localhost:5000/events/${eventId}/book`, {}, { withCredentials: true });
      toast.success('Booking successful!');
    } catch (err) {
      console.error('Booking error:', err.response ? err.response.data : err.message);
      toast.error(`${err.response ? err.response.data.message : err.message}`);
    }
  };

  // Display only the first 4 events
  const featuredEvents = events.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-700 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 animate-fade-in-up">Discover Amazing Events</h1>
            <p className="text-xl lg:text-2xl mb-8 animate-fade-in-up animation-delay-300">Find and book the hottest events in your area</p>
            <div className="max-w-3xl mx-auto">
             
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
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
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-cyan-700 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-8">Subscribe to our newsletter for the latest events and exclusive offers</p>
        
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Getevents</h3>
              <p className="text-gray-400">Discover and book amazing events near you.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-yellow-400 transition duration-300">Home</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition duration-300">Events</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition duration-300">About Us</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition duration-300">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-yellow-400 transition duration-300">Facebook</a>
                <a href="#" className="hover:text-yellow-400 transition duration-300">Twitter</a>
                <a href="#" className="hover:text-yellow-400 transition duration-300">Instagram</a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <p className="text-gray-400">123 Event Street, City, Country</p>
              <p className="text-gray-400">info@getevents.com</p>
              <p className="text-gray-400">+1 (123) 456-7890</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>&copy; 2024 Getevents. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
