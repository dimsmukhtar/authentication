import express from "express"
import "dotenv/config"

import routes from "./routes"
import connectToDb from "./utils/connectToDb"

const app = express()
const PORT = process.env.PORT

app.use("/api", routes)

app.listen(PORT, () => {
  console.log(`Server success running on http://localhost:${PORT}`)
  connectToDb()
})
