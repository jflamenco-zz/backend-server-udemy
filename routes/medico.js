


var express = require('express');


var app = express();

var Medico = require('../models/medico');
var mdAutenticacion = require('../middlewares/autenticacion');


// ==============================================
// GET - Listados de todos los Medicos
// ==============================================
app.get('/', (req, res, next) => {


    var offset = req.query.offset || 0;
    offset = Number(offset);


    Medico.find({})
        .skip(offset)
        .limit(5)
        .populate('usuario','nombre email')
        .populate('hospital')
        .exec((err, medicos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los medicos',
                    errors: err
                });
            }

            Medico.count({}, (err, conteo) =>{

                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo
                });

            });

        });

});



// ==============================================
// POST - Crear un nuevo medico
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuarioToken: req.usuario
        });

    });


});


// ==============================================
// PUT - Actualizar registro en tabla medico
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el medico con el id: ' + id + ' no existe',
                errors: err
            });
        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.hospital= body.hospital;

        medico.save((err, medicoGuardado) => {


            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'el medico con el id: ' + id + ' no existe',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});


// ==============================================
// DELETE - Borrar Hospital
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar medico',
                errors: err
            });
        }


        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El id: ' + id + ' no existe',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });


    });

});

module.exports = app;