const Usuario = require('../models/Usuario');
const passport = require('passport');
const config = require('./../config/Config');
const Estrategia = require('passport-google-oauth20').Strategy;

module.exports.controller = (app) => {
    // Estrategia de Goole
    passport.use(new Estrategia({
        clientID: config.GOOGLE_APP_ID,
        clientSecret: config.GOOGLE_APP_SECRET,
        callbackURL: '/login/google/return',
    },
    (accessToken, refreshToken, profile, cb) => {
        // Controlar login con Google
        const email = profile.emails[0].value;
        Usuario.getUserByEmail(email, (err, usuario) => {
            if (!usuario) {
                const nuevoUsuario = new Usuario({
                    nombre: profile.displayName,
                    email,
                    googleID: profile.id,
                });
                Usuario.crearUsuario(nuevoUsuario, (error) => {
                    if (error) {
                        // Controlar error
                    }
                    return cb(null, usuario);
                });
            } else {
                return cb(null, usuario);
            }
            return true;
        });
    }));

    app.get('/login/google', passport.authenticate('google', { scope: ['email'] }));

    app.get('/login/google/return', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
        res.redirect('/');
    });
}
