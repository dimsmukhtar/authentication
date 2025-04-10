import mongoose from "mongoose"
import logger from "./logger"

async function connectToDb() {
  const dbURL = <string>process.env.DB_URL
  try {
    await mongoose.connect(dbURL)
    logger.info("MongoDB Connected")
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message)
    } else {
      logger.error("Unknown error occurred during database connection")
      console.log("Raw error: ", error)
    }
  }
}

export default connectToDb
