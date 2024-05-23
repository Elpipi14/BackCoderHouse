import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

// Configurar el transporte de Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "servicedev.ap@gmail.com",
        pass: "ihqo waur jgbo hyay"
    }
})

// Configurar Handlebars con Nodemailer
const handlebarOptions = {
    viewEngine: {
        extName: '.handlebars',
        partialsDir: path.resolve('./src/views/partials/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./src/views/partials/'),
    extName: '.handlebars',
};

transporter.use('compile', hbs(handlebarOptions));

export default transporter;
