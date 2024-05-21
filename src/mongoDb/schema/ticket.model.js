import { Schema, model } from "mongoose";

export const ticketsCollection = "tickets";

const ticketSchema = new Schema({
    totalPrice: {
        type: Number,
        required: true
    },
    productsBuy: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'carts'
        },
    }],
    dateTime: {
        type: Date,
        default: Date.now
    },
    ticketId: {
        type: Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    buyerEmail: {
        type: String,
        required: true
    }
});


export const TicketModel = model(ticketsCollection, ticketSchema);

