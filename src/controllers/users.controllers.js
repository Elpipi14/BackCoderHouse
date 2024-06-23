import UserManager from "../mongoDb/DB/userManager.js";
const userService = new UserManager();

import generationToken from "../utils/jwt.js";
import CustomError from "../helpers/errors/custom-error.js";
import genInfoError from "../helpers/errors/info.js";
import { EErrors } from "../helpers/errors/enum.js";

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(`Registration attempt with email: ${email}`);
        req.logger.info(`Registration attempt with email: ${email}`);

        const isRegistered = await userService.register({ email, password, ...req.body });

        // Verifica si isRegistered no es undefined y tiene la propiedad email
        if (isRegistered && isRegistered.email) {
            // Genera el token JWT con el email del usuario registrado
            generationToken({ email: isRegistered.email }, res);

            req.logger.info("Successfully registered user. Redirecting to Login");
            return res.redirect("/logOut");
        } else {
            // Si el usuario no está registrado correctamente, lanza un error
            req.logger.error("Error during registration: The user is not registered correctly or email is already registered");
            return res.status(400).redirect("/register-error");
        }
    } catch (error) {
        req.logger.warning(`Error during registration: ${error.message}`);
        return res.status(500).redirect("/register-error");
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.login(email, password);

        // Verificar si el usuario está autenticado correctamente
        if (!user) {
            req.logger.warning("Login process error: Incorrect password")
            res.status(400).redirect("/login-error");
        } else {
            // Generar el token JWT
            generationToken({ user }, res);

            if (!req.session || !req.session.email) {
                req.session = req.session || {};
                req.session.email = email;
                req.session.firstName = user.first_name;
                // Almacena toda la información del usuario en la sesión
                req.session.user = user;
            }
            req.session.welcomeMessage = `Bienvenido, ${user.first_name} ${user.last_name}!`;
            req.logger.info(`Welcome message in session: ${req.session.welcomeMessage}`)
            res.redirect("/");
        }
    } catch (error) {
        console.error("Login process error", error);
        res.status(500).json({ error: "Login process error" });
    }
};

export const profile = async (req, res) => {
    try {
        const user = req.user;

        if (user) {
            // Añade las propiedades isAdmin e isPremium basado en el rol del usuario
            const userProfile = {
                ...user._doc, // Esto copia todas las propiedades del documento del usuario
                isAdmin: user.role === 'admin',
                isPremium: user.role === 'premium'
            };

            res.render('partials/profile', { user: userProfile });
        } else {
            // Manejo de caso en el que no se encuentra el usuario
            console.error('No se encontró el usuario');
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        console.error('Error obteniendo el perfil del usuario:', error.message);
        res.status(500).send('Error interno del servidor');
    }
};

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const user = req.user; // El usuario autenticado

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: "New passwords do not match" });
        }

        await userService.changePassword(user.email, oldPassword, newPassword);
        req.logger.info("Successfully changed password. Redirecting to Login");
        return res.redirect("/logOut");
    } catch (error) {
        req.logger.warning(`Error changing password: ${error.message}`);
        return res.status(500).redirect("/change-password-error");
    }
};

export const logOut = async (req, res) => {
    // Destruye la sesión del usuario
    req.logger.info(`LogOut`)
    res.clearCookie("coderHouseToken");
    res.redirect("/login");
};