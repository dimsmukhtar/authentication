import { Router } from "express"

import { createSessionHandler } from "../../controllers/auth.controller"
import { createSessionSchema } from "../../schema/auth.schema"
import { validateResource } from "../../middlewares/validateResource"
const router = Router()

router.post("/login", validateResource(createSessionSchema), createSessionHandler)

export default router
