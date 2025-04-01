import mongoose from 'mongoose'

const JourneySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  items: [{
    title: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
  }],
}, {
  timestamps: true,
})

export default mongoose.models.Journey || mongoose.model('Journey', JourneySchema)