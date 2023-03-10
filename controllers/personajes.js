const EsquemaPersonaje = require('../models/Personaje');
const Calificacion = require('../models/Calificacion');
const passport = require('passport');

// console.log('Entro al controlador');
module.exports.controller = (app) => {
    // enviar una prueba tonta
    app.get('/prueba_tonta', function(req, res) {
        res.send({
            nombre: 'Zaida',
        });
    });
    //Obtener todas los personajes
    // app.get('/personajes', passport.authenticate('jwt', { session: false }), (req, res) => {
    app.get('/personajes', (req, res) => {
        EsquemaPersonaje.find({}, 'nombre descripcion franquicia aspecto', (error, personajes) => { // {} = todo
            if(error) { console.log(error) }
                res.send({
                    personajes,
                })
        });
    });

    // Obtener un personaje
    app.get('/api/personajes/:id', (req, res) => {
        EsquemaPersonaje.findById(req.params.id, 'nombre descripcion franquicia aspecto', (error, personaje) => {
            if(error) { console.error(error); }
            res.send(personaje)
        });
    });

    // calificar un personaje
    app.post('/personajes/calif/:id', (req, res) => {
        const calificacion = new Calificacion({
            personaje_id: req.params.id,
            usuario_id: req.body.usuario_id,
            calificacion: req.body.Calificacion,
        });

        calificacion.save(function (error, calificacion) {
            if(error) { console.log(error); }
            res.send({
                personaje_id: calificacion.personaje_id,
                usuario_id: calificacion.usuario_id,
                calificacion: calificacion.calificacion,
            })
        });
    });

    //agrega un nuevo personaje
    app.post('/personajes', (req, res) => {
        const nuevoPersonaje = new EsquemaPersonaje({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            franquicia: req.body.franquicia,
            aspecto: req.body.aspecto,
        });

        console.log(nuevoPersonaje);
        nuevoPersonaje.save((error, personaje) => {
            if(error) {console.log(error);}
            res.send(personaje);
        });
    });
}