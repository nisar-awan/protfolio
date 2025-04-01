import { MongoClient, ServerApiVersion } from 'mongodb'
import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI!
const dbName = "portfolio" // Add your database name here

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  })

  try {
    await client.connect()
    const db = client.db(dbName)
    
    // Test the connection
    await client.db("admin").command({ ping: 1 })
    console.log("Successfully connected to MongoDB!")

    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

// For Mongoose connection (used by models)
export async function connectMongoose() {
  try {
    await mongoose.connect(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    })
    console.log("Mongoose connected successfully!")
  } catch (error) {
    console.error("Mongoose connection error:", error)
    throw error
  }
} 