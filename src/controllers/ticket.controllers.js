import TicketManager from "../mongoDb/DB/ticket.Manager.js";
import CartsManager from "../mongoDb/DB/carts.Manager.js";
import ProductManager from "../mongoDb/DB/productsManager.js"
import transporter from '../utils/nodemailer.js';

const ticketDao = new TicketManager();
const productDao = new ProductManager();
const cartDao = new CartsManager();

export const finalizePurchase = async (req, res) => {
    try {
        const user = req.user;
        const cartId = user.cartId;

        const cart = await cartDao.getById(cartId);

        const newTicket = await ticketDao.createTicket({
            totalPrice: cart.total,
            productsBuy: cart.products.map(p => ({ product: p.product, quantity: p.quantity })),
            dateTime: new Date(),
            buyerEmail: user.email
        });

        await cartDao.deleteCart(cartId);

        const mailOptions = {
            from: 'Sneakers shop <${configObject.email_user}>',
            to: user.email,
            subject: 'Your Purchase Details',
            template: 'emailTicket',
            context: {
                ticket: {
                    ...newTicket._doc
                }
            }
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.render('partials/checkout', { ticket: newTicket });
    } catch (error) {
        console.error('Error finalizing purchase:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

export const getUserTickets = async (req, res) => {
    try {
        const user = req.user;
        const email = user.email;
        const tickets = await ticketDao.getTicketsByUserEmail(email);
        res.render('partials/viewTicketuser', { tickets });
    } catch (error) {
        console.error('Error fetching user tickets:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

export const getTicketDetails = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticket = await ticketDao.findTicketById(ticketId);
        if (!ticket) {
            return res.status(404).send('Ticket not found');
        }
        res.render('partials/ticketDetails', { ticket });
    } catch (error) {
        console.error('Error fetching ticket details:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

export const getAllTickets = async (req, res) => {
    try {
        const tickets = await ticketDao.getTickets();
        res.render('partials/panelPurchase', { tickets });
    } catch (error) {
        console.error('Error fetching all tickets:', error.message);
        res.status(500).send('Internal Server Error');
    }
};
export const deleteTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const deletedTicket = await ticketDao.deleteTicketById(ticketId);

        if (!deletedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        console.error('Error deleting ticket:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
