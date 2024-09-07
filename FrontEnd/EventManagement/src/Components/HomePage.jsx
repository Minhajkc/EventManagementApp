import React, { useState } from 'react';
import { Search, Calendar, MapPin, ArrowRight, Mail } from 'lucide-react';

const HomePage = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribed:', email);
    setEmail('');
  };

  const featuredEvents = [
    { id: 1, title: 'Summer Music Festival', date: '2024-07-15', location: 'Central Park' },
    { id: 2, title: 'Tech Conference 2024', date: '2024-09-22', location: 'Convention Center' },
    { id: 3, title: 'Food & Wine Expo', date: '2024-08-05', location: 'City Square' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-700 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 animate-fade-in-up">Discover Amazing Events</h1>
            <p className="text-xl lg:text-2xl mb-8 animate-fade-in-up animation-delay-300">Find and book the hottest events in your area</p>
            <div className="max-w-3xl mx-auto">
              <form className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-600">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="flex-grow px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold py-2 px-6 rounded-lg transition duration-300 flex items-center justify-center">
                  <Search size={20} className="mr-2" /> Search
                </button>
              </form>
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
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{event.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar size={16} className="mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin size={16} className="mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center justify-center">
                    Book Now <ArrowRight size={16} className="ml-2" />
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
          <form onSubmit={handleSubscribe} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold py-2 px-6 rounded-lg transition duration-300 flex items-center justify-center">
              <Mail size={20} className="mr-2" /> Subscribe
            </button>
          </form>
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