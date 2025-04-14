import { Router } from "express"
import {
  createUserHandler,
  verifyUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  meHandler,
  logoutHandler,
  updateMeHandler,
  changePasswordHandler,
} from "../../controllers/user.controller"
import { validateResource } from "../../middlewares/validateResource"
import authenticate from "../../middlewares/authenticate"
import {
  createUserSchema,
  verifyUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateMeSchema,
  changePasswordSchema,
} from "../../schema/user.schema"

const router = Router()

router.post("/register", validateResource(createUserSchema), createUserHandler)
router.post("/verify", validateResource(verifyUserSchema), verifyUserHandler)
router.post("/forgotpassword", validateResource(forgotPasswordSchema), forgotPasswordHandler)
router.post("/resetpassword", validateResource(resetPasswordSchema), resetPasswordHandler)
router.get("/me", authenticate, meHandler)
router.patch("/me/update", validateResource(updateMeSchema), authenticate, updateMeHandler)
router.patch(
  "/me/changepassword",
  validateResource(changePasswordSchema),
  authenticate,
  changePasswordHandler
)
router.post("/logout", authenticate, logoutHandler)

export default router
