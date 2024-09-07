const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const Event = require('../Models/Event')
const checkOrganizerRole = require('../Middlewares/checkOrganizerRole')
const checkUser = require('../Middlewares/checkUser')
const crypto = require('crypto'); // Import crypto for generating random hex codes

// Helper function to generate a random hex code
const generateRandomHex = (length) => {
  return crypto.randomBytes(length).toString('hex');
};


router.post('/signup', async (req, res) => {
  console.log(req.body)
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/login',async(req,res)=>{
 
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      'JWT_SECRET',
      { expiresIn: '1h' }
    );

   
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour

    });

    res.status(200).json({ message: 'Login successful' ,User:user,Role:user.role});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
})


router.post('/events', checkOrganizerRole, async (req, res) => {
  const { title, description, date, time } = req.body;

  try {
    // Get the organizer ID from the request object (added by checkOrganizerRole middleware)
    const organizer = req.userId;

    // Verify that the organizer exists
    const user = await User.findById(organizer);
    if (!user) {
      return res.status(400).json({ message: 'Organizer not found' });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      organizer,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
});

router.get('/events', async (req, res) => {
  try {
    const today = new Date(); // Get the current date
    today.setHours(0, 0, 0, 0); // Set time to the start of the day for accurate comparison

    // Find events with a date greater than or equal to today
    const events = await Event.find({ date: { $gte: today } }).populate('organizer', 'username');

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
});


router.get('/eventsbyid', checkOrganizerRole, async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.userId }); // Fetch events for the logged-in organizer

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
});

router.post('/events/:eventId/book', checkUser, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.userId;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check if the user has already booked this event
    if (event.bookedUsers.includes(userId)) {
      return res.status(400).json({ message: 'You have already booked this event' });
    }

    // Add the event to the event's bookedUsers list
    event.bookedUsers.push(userId);
    await event.save();

    // Find the user and update their registeredEvents list
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate a unique random hex code
    const registrationCode = generateRandomHex(6); // 6 bytes hex code

    // Check if the user is already registered for this event
    const existingRegistration = user.registeredEvents.find(reg => reg.eventId === eventId);
    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    user.registeredEvents.push({ eventId, registrationCode });
    await user.save();

    res.status(200).json({ message: 'Event booked successfully', registrationCode });
  } catch (error) {
    console.error('Error booking event:', error.message); // Log the error for debugging
    res.status(500).json({ message: 'Failed to book event', error: error.message });
  }
});


router.get('/user/events', checkUser, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Find events where the user is in the bookedUsers array
    const events = await Event.find({ bookedUsers: userId });

    if (events.length === 0) {
      return res.status(404).json({ message: 'No booked events found' });
    }

    res.status(200).json({ userId, events });
  } catch (error) {
    console.error('Error fetching booked events:', error.message);
    res.status(500).json({ message: 'Failed to fetch booked events', error: error.message });
  }
});


router.get('/organizer/booked-events', checkOrganizerRole, async (req, res) => {
  try {
    // Assuming the organizer's ID is stored in the request object
    const organizerId = req.userId; // Modify this according to your authentication setup

    // Find all events organized by the organizer
    const events = await Event.find({ organizer: organizerId });

    if (!events || events.length === 0) {
      return res.status(404).json({ message: 'No events found for this organizer' });
    }

    // Extract booked users from these events
    const bookedEvents = events.map(event => ({
      eventTitle: event.title,
      bookedUsers: event.bookedUsers
    }));

    res.json(bookedEvents);
  } catch (error) {
    console.error('Error fetching booked events:', error.message);
    res.status(500).json({ message: 'Failed to fetch booked events', error: error.message });
  }
});



module.exports = router;