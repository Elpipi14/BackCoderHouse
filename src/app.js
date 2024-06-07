// Importa el módulo HTTP para crear el servidor HTTP
import http from "http";
// Importa express
import express from "express";
//compression
import compression from "express-compression";
// Importa passport
import passport from "passport";
// Importa el middleware de cookies para express
import cookieParser from "cookie-parser";
// Importa mongoose para la conexión a la base de datos
import "./mongoDb/connection/mongooseConnection.js";
// Importa los routers para las rutas de la base de datos y las vistas
import routerUser from "./routes/DB/usersDB.js";
import routerDB from "./routes/DB/productsDB.js";
import routerCartDB from "./routes/DB/cartsDB.js";
import routerTicketDB from "./routes/DB/ticketDB.js";
import routerViews from "./routes/VIEWS/views.js";
// Importa Passport
import initializePassport from "./config/passport.config.js";
// Importa socket.io
import initializeSocket from "./socket/socket.io.js";
// Importa Handlebars
import exphbs from "express-handlebars";
// Importa la función multiply desde el archivo correcto
import { multiply } from "./helpers/multiply.js";
// Importa method-override
import methodOverride from "method-override";
import nodemailer from "nodemailer"
import handlingError from "./middleware/errros.js";

// Designa el puerto
const PORT = 8080;
// Crea una nueva instancia de la aplicación Express
const app = express();

// Middleware para la compresión gzip
app.use(compression());
// Middleware para soportar métodos HTTP adicionales a través de _method
app.use(methodOverride('_method'));
// Middleware para analizar y convertir las solicitudes codificadas en URL a un objeto JavaScript
app.use(express.urlencoded({ extended: true }));
// Middleware para analizar las solicitudes con cuerpo JSON
app.use(express.json());

app.engine("handlebars", exphbs.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        multiply: multiply
    },
}));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Carpeta estática public
app.use(express.static('./src/public'));

// Instancia passport y configura el middleware de cookies para la estrategia
app.use(passport.initialize());
initializePassport();
app.use(cookieParser());


// Rutas de la aplicación
app.use("/", routerUser);
app.use("/", routerDB);
app.use("/cart", routerCartDB);
app.use("/purchase", routerTicketDB);
app.use("/", routerViews);

app.use(handlingError);

// Crea un servidor HTTP utilizando la aplicación Express
const httpServer = http.createServer(app);

//// Inicializa Socket.io pasando el servidor HTTP
initializeSocket(httpServer);

// Indica al servidor que comience a escuchar las solicitudes en el puerto especificado
httpServer.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
});
