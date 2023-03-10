const Usuario = require('../models/Usuario');

// const passportJWT = require('passport-jwt');
// const jwt = require('jsonwebtoken');
const passport = require('passport');
const EstrategiaLocal = require('passport-local').Strategy;

// const ExtractJwt = passportJWT.ExtractJwt;
// const jwtOptions = {};
// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
// jwtOptions.secretOrKey = 'llaveaplicacioncalificacionesapeliculassecreta';

module.exports.controller =(app) => {
    // Estrategia local
    passport.use(new EstrategiaLocal({
        usernameField: 'email',
        passwordField: 'password',
    }, (email, password, done) => {
        Usuario.getUserByEmail(email, (err, usuario) => {
            if (err) { return done(err); }
            if (! usuario) { return done(null, false); }
            Usuario.compararContrasenhas(password, usuario.password, (error, isMatch) => {
                if (isMatch) {
                    return done(null, usuario);
                }
                return done(null, false);
            });
            return true;
        });
    }));
    // registrar un usuarie
    app.post('/usuarios/registro', (req, res) => {
        const nombre = req.body.nombre;
        const email = req.body.email;
        const password = req.body.password;
        const nuevoUsuario = new Usuario({
            nombre,
            email,
            password,
        });
        Usuario.crearUsuario(nuevoUsuario, (error, usuario) => {
            if(error) {
                res.status(422).json({
                    message: 'Algo salió mal. Por favor vuelva a intentarlo más tarde',
                });
            }
            res.send({ usuario });
        });
    });

    // Iniciar sesion
    app.post('/usuarios/login', passport.authenticate('local', {failureRedirect: '/usuarios/login'}), (req, res) => {
        res.redirect('/');
    });

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });

    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario);
        });
    });
    // app.post('/usuarios/login', (req, res) => {
    //     if(req.body.email && req.body.password) {
    //         const email = req.body.email;
    //         const password = req.body.password;
    //         Usuario.getUserByEmail(email, (err, usuario) => {
    //             if(!usuario) {
    //                 res.status(404).json({ message: '¡El usuario no existe!' });
    //             } else {
    //                 console.log(usuario);
    //                 Usuario.compararContrasenhas(password, usuario.password, (error, isMatch) => {
    //                     if (error) throw error;
    //                     if(isMatch) {
    //                         const payload = { id: usuario.id };
    //                         const token = jwt.sign(payload, jwtOptions.secretOrKey);
    //                         res.json({ message: 'ok', token });
    //                     } else {
    //                         res.status(401).json({ message: '¡La contraseña es incorrecta!' });
    //                     }
    //                 })
    //             }
    //         });
    //     }
    // })
};