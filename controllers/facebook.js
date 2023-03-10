const Usuario = require('../models/Usuario');
const passport = require('passport');
const config = require('./../config/Config');
const Estrategia = require('passport-facebook').Strategy;

module.exports.controller = (app) => {
    // Estrategias de facebook
    passport.use(new Estrategia({
        clientID: config.FACEBOOK_APP_ID,
        clientSecret: config.FACEBOOK_APP_SECRET,
        callbackURL : '/login/facebook/return',
        profileFields: ['id','displayName','email']
    },
    (accessToken, refreshToken,profile, cb) => {
        //Controlar LOGIN CON FACEBOOK
        const email = profile.emails[0].value;
        Usuario.getUserByEmail(email,(err, user) => {
            if(!user){
                const nuevoUsuario = new Usuario({
                    nombre: profile.displayName,
                    email,
                    facebookId: profile.id
                });
                Usuario.createUser(nuevoUsuario, (error) => {
                    if(error) {
                        //Controlar el error

                    }
                    return cb(null, user);
                });
            }else{
                return cb(null, user);
            }
            return true;
        });
    }));

    app.get('/login/facebook', 
    passport.authenticate('facebook', { scope: ['email']}));

    app.get('/login/faceook/return',passport.authenticate('facebook', { failureRdirect : '/login'}),
    (req, res) => {res.redirect('/');
    });
};
