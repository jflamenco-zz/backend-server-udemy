

var express = require('express');


var app = express();

var Hospital = require('../models/hospital');
var mdAutenticacion = require('../middlewares/autenticacion');


// ==============================================
// GET - Listados de todos los Hospitales
// ==============================================
app.get('/', (req, res, next) => {

    var offset = req.query.offset || 0;
    offset = Number(offset);

    Hospital.find({})
        .skip(offset)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los hospitales',
                    errors: err
                });
            }

        Hospital.count({}, (err, conteo)=>{            

            res.status(200).json({
                ok: true,
                hospitales: hospitales,
                total: conteo
            });

        });


        });

});



// ==============================================
// POST - Crear un nuevo hospital
// ==============================================
 app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            usuarioToken: req.usuario
        });

    });


});


// ==============================================
// PUT - Actualizar registro en tabla hospital
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el hospital con el id: ' + id + ' no existe',
                errors: err
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {


            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'el hospital con el id: ' + id + ' no existe',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    });
});


// ==============================================
// DELETE - Borrar Hospital
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar hospital',
                errors: err
            });
        }


        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El id: ' + id + ' no existe',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });


    });

});

module.exports = app;