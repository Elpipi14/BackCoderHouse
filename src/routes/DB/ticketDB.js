import { Router } from "express";
import * as controller from "../../controllers/ticket.controllers.js";
import passport from "passport";

const routerTicketDB = Router();

// Rutas existentes
routerTicketDB.post('/checkout', passport.authenticate("jwt", { session: false }), controller.finalizePurchase);
routerTicketDB.get('/viewTicketuser', passport.authenticate("jwt", { session: false }), controller.getUserTickets);
routerTicketDB.get('/tickets/:ticketId', passport.authenticate("jwt", { session: false }), controller.getTicketDetails);

// Nuevas rutas para el administrador
routerTicketDB.get('/admin/panelpurchase', passport.authenticate("jwt-admin", { session: false }), controller.getAllTickets);
routerTicketDB.delete('/admin/tickets/:ticketId', passport.authenticate("jwt-admin", { session: false }), controller.deleteTicket);

export default routerTicketDB;
