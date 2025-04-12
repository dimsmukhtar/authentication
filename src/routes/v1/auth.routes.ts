import { Router } from "express"

import { createSessionHandler, refreshTokenHandler } from "../../controllers/auth.controller"
import { createSessionSchema } from "../../schema/auth.schema"
import { validateResource } from "../../middlewares/validateResource"
const router = Router()

router.post("/login", validateResource(createSessionSchema), createSessionHandler)
router.post("/refreshtoken", refreshTokenHandler)

export default router
