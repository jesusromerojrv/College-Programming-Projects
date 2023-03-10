const Usuario = require('../models/Usuario');
const passport = require('passport');
const config = require('./../config/Config');
const Estrategia = require('passport-linkedin-oauth2').Strategy;

module.exports.controller = (app) => {
    // esrtategia de linkedid
    passport.use(new Estrategia({
        clientID: config.LINKEDIN_APP_ID,
        clientSecret: config.LINKEDIN_APP_SECRET,
        callbackURL: '/login/linkedin/return',
        profileFields: ['id', 'first-name', 'last-name', 'email-address']
    }, (accessToken, refreshToken, profile, cb) => {
        // controlar login con linkedin
        const email = profile.emails[0].value;
        Usuario.getUserByEmail(email, (err, usuario) => {
            if (!usuario) {
                const nuevoUsuario = new Usuario({
                    nombre: profile.displayName,
                    email: profile.emails[0].value,
                    linkedinId: profile.id
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

    app.get('/login/linkedin', passport.authenticate('linkedin', { scope: ['email'] }));

    app.get('/login/linkedin/return', passport.authenticate('linkedin', { failureRedirect: '/login' }), (req, res) => {
        res.redirect('/');
    });

};