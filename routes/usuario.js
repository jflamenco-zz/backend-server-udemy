var express = require('express');
var bcrypt = require('bcryptjs');


var app = express();

var Usuario = require('../models/usuario');
var mdAutenticacion = require('../middlewares/autenticacion');


// ==============================================
// GET - Listados de todos los Usuarios
// ==============================================
app.get('/', (req, res, next) => {


    var offset = req.query.offset || 0;
    offset = Number(offset);


    Usuario.find({}, 'nombre email img role')
        .skip(offset)
        .limit(5)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los usuarios',
                    errors: err
                });
            }

            Usuario.count({}, (err, conteo) => {

            res.status(200).json({
                ok: true,
                usuarios: usuarios,
                total: conteo
            });

            });

        });

});



// ==============================================
// POST - Crear un nuevo Usuario
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        img: body.img,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });

    });


});


// ==============================================
// PUT - Actualizar registro en tabla usuarios
// ==============================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el usuario con el id: ' + id + ' no existe',
                errors: { message: 'No existe un usuario con el ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;


        usuario.save((err, usuarioGuardado) => {


            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'el usuario con el id: ' + id + ' no existe',
                    errors: { message: 'No existe un usuario con el ID' }
                });
            }

            usuarioGuardado.password = ';)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

// ==============================================
// DELETE - Borrar Usuario
// ==============================================
app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar usuario',
                errors: { message: 'Error en DB' }
            });
        }


        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El id: ' + id + ' no existe',
                errors: { message: 'No existe un usuario con el ID' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });


    });

});




module.exports = app;