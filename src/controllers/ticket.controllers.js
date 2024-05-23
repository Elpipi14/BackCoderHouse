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

        // Obtener la información del carrito antes de eliminarlo
        const cart = await cartDao.getById(cartId);

        // Crear un nuevo ticket
        const newTicket = await ticketDao.createTicket({
            totalPrice: cart.total,
            productsBuy: cart.products.map(p => ({ product: p.product, quantity: p.quantity })),
            dateTime: new Date(),
            buyerEmail: user.email
        });

        // Eliminar el carrito después de generar el ticket
        await cartDao.deleteCart(cartId);

        // Enviar el correo electrónico con el ticket
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

        // Redirigir al usuario a una página de confirmación de compra
        res.render('partials/checkout', { ticket: newTicket });
    } catch (error) {
        console.error('Error finalizing purchase:', error.message);
        res.status(500).send('Internal Server Error');
    }
};


export const getUserTickets = async (req, res) => {
    try {
        const user = req.user;
        console.log('User object:', user);

        const email = user.email;
        console.log('User email:', email);

        // Obtén los tickets del usuario actual
        const tickets = await ticketDao.getTicketsByUserEmail(email);
        console.log('Tickets:', tickets);

        // Renderiza la vista con los tickets
        res.render('partials/viewTicketuser', { tickets });
    } catch (error) {
        console.error('Error fetching user tickets:', error.message);
        res.status(500).send('Internal Server Error');
    }
};


export const getTicketDetails = async (req, res) => {
    try {
        const { ticketId } = req.params;

        // Obtener el ticket por su ID
        const ticket = await ticketDao.findTicketById(ticketId);

        if (!ticket) {
            return res.status(404).send('Ticket not found');
        }

        // Renderizar la vista con los detalles del ticket
        res.render('partials/ticketDetails', { ticket });
    } catch (error) {
        console.error('Error fetching ticket details:', error.message);
        res.status(500).send('Internal Server Error');
    }
};
