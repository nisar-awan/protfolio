import mongoose from 'mongoose'

const ContactMethodSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
})

const ContactSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  contactMethods: [ContactMethodSchema],
}, {
  timestamps: true,
})

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema)