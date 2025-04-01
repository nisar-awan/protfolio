import mongoose from 'mongoose'

const SiteSettingsSchema = new mongoose.Schema({
  logo: {
    type: String,
    required: true,
  },
  siteTitle: {
    type: String,
    required: true,
  },
  headerText: {
    type: String,
    required: true,
  },
  footerText: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
})

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema) 