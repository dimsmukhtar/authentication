import mongoose from "mongoose"
import logger from "./logger"

async function connectToDb() {
  const dbURL = <string>process.env.DB_URL
  try {
    await mongoose.connect(dbURL)
    logger.info("MongoDB Connected")
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export default connectToDb
