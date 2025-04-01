import mongoose from 'mongoose'

const AboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  teamMembers: [{
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  }],
  skills: [{
    category: {
      type: String,
      required: true,
    },
    items: [{
      name: {
        type: String,
        required: true,
      },
      proficiency: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
    }],
  }],
}, {
  timestamps: true,
})

export default mongoose.models.About || mongoose.model('About', AboutSchema)