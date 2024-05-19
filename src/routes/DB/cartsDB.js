import { Router } from "express";
import * as controller from "../../controllers/carts.controllers.js"
import passport from "passport";
const routerCartDB = Router();

routerCartDB.get("/", passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), controller.getCart);
routerCartDB.post("/add/:productId", passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), controller.addToCart);
routerCartDB.post('/delete/:productId', passport.authenticate("jwt", { session: false }), controller.deleteProduct);
routerCartDB.post('/increase/:cartId/:productId', controller.increaseProductQuantity);
routerCartDB.post('/decrease/:cartId/:productId', controller.decreaseProductQuantity);
// routerCartDB.delete("/:cId/product/:pId", controller.deleteProduct);
// routerCartDB.delete("/:cId", controller.deleteCart);

export default routerCartDB;