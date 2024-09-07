const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: {
        type: String,
        required: true,
        unique: true,
      },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'organizer'], default: 'user' },
    registeredEvents: [
        {
          eventId: { type:  mongoose.Schema.Types.ObjectId, ref: 'Event' },
          registrationCode: { type: String }
        }
      ],
});

module.exports = mongoose.model('User', UserSchema);