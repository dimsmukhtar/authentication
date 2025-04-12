import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser"
import cors from "cors"

import routes from "./routes"
import connectToDb from "./utils/connectToDb"
import errorHandler from "./middlewares/errorHandler"

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
)
app.use(cookieParser())

app.use("/api", routes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server success running on http://localhost:${PORT}`)
  connectToDb()
})
