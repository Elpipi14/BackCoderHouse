import { Router } from "express";
import * as controller from "../../controllers/ticket.controllers.js";
import passport from "passport";
const routerTicketDB = Router();

routerTicketDB.post('/checkout', passport.authenticate("jwt", { session: false }), controller.finalizePurchase);
// Ruta para obtener los tickets del usuario
routerTicketDB.get('/viewTicketuser', passport.authenticate("jwt", { session: false }), controller.getUserTickets);

// Ruta para ver detalles de un ticket específico
routerTicketDB.get('/tickets/:ticketId', passport.authenticate("jwt", { session: false }), controller.getTicketDetails);
export default routerTicketDB;