import { Router } from "express"

const router = Router()

router.use("/register", (req, res) => {
  res.send("auth")
})

export default router
