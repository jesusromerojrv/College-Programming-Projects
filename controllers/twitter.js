const Usuario = require('../models/Usuario');
const passport = require('passport');
const config = require('./../config/Config');
const Estrategia = require('passport-twitter-oauth2').Strategy;

module.exports.controller = (app) => {
    // Estrategia de twitter
    passport.use(new Estrategia({
        clientID: config.TWITTER_APP_ID,
        consumerSecret: config.TWITTER_APP_SECRET,
        userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
        callbackURL: '/login/twitter/return',
        profileFields: ['id', 'displayName', 'email'],
    }, (accessToken, refreshToken, profile, cb) => {
        // Manejar login de twitter
        const email = profile.emails[0].value;
        Usuario.getUserByEmail(email, (err, usuario) => {
            if (!usuario) {
                const nuevoUsuario = new Usuario({
                    nombre: profile.displayName,
                    email,
                    twitterId: profile.id,
                });
                Usuario.crearUsuario(nuevoUsuario, (error) => {
                    if (error) {
                        // Console error
                    }
                    return cb(null, usuario);
                });
            } else {
                return cb(null, usuario);
            }
            return true;
        });
    }));

    app.get('/login/twitter', passport.authenticate('twitter', { scope: ['email'] }));

    app.get('/login/twitter/return', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
        res.redirect('/');
    });
}