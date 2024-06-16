import { Router } from "express";
import * as controller from "../../controllers/users.controllers.js";
import passport from "passport";
import { isAuthenticated } from "../../middleware/auth.js";
const routerUser = Router();

routerUser.post('/register', isAuthenticated, controller.register);

routerUser.post("/login", isAuthenticated, controller.login);

routerUser.get("/profile", passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), controller.profile);

routerUser.get("/logout", controller.logOut);

routerUser.post('/change-password', passport.authenticate("jwt", { session: false }), controller.changePassword);

export default routerUser;
