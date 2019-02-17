

var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Hospital = require('../models/hospital');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');

app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {


    var tipo = req.params.tipo;
    var id = req.params.id;
   
    // tipos de colección
    var tiposValidos = ['usuarios','medicos','hospitales'];

    if( tiposValidos.indexOf( tipo) < 0 ) {
        return res.status(400).json({
            ok: false,
            mensaje: `Coleccción : ${extArchivo} no es válida`,
            errors: { message: 'las colecciones validas son: ' + tiposValidos.join(', ') }
        });
    }
    
    if( !req.files ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'debe seleccionar una imagen' }

        });
    }

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extArchivo = nombreCortado[nombreCortado.length -1];

    // Extensiones validas
    var extValidas = ['jpg','png','jpeg','gif','bmp'];

    // validacion de extensiones validas
    if ( extValidas.indexOf(extArchivo) < 0 ) {
        return res.status(400).json({
            ok: false,
            mensaje: `extensión : ${ extArchivo } no es válida`,
            errors: { message: 'las extensiones validas son: ' + extValidas.join(', ')  }
        });
    }

    // Nombre de Archivo perzonalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extArchivo }`;

    // Path del Archivo
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv( path, err => {
        
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }

        subirPorTipo( tipo, id, nombreArchivo, res);
        
    });



});


function subirPorTipo( tipo, id, nombreArchivo, res ) {

    switch ( tipo ) {

        case 'usuarios':
        
        Usuario.findById(id, (err, usuario) =>{

            var pathViejo = `./uploads/${tipo}/${usuario.img}`;

            if ( fs.existsSync(pathViejo) ) {                
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save( (err, usuarioActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error Actualizar registro',
                        errors: err
                    });
                }

               return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario Actualizada',
                    usuario: usuarioActualizado
                });

            });


        });
        
        break;

        case 'medicos':

            Medico.findById(id, (err, medico) => {

                var pathViejo = `./uploads/${tipo}/${usuario.img}`;

                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }

                medico.img = nombreArchivo;

                medico.save((err, medicoActualizado) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error Actualizar registro',
                            errors: err
                        });
                    }

                 return   res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de medico Actualizada',
                        medico: medicoActualizado
                    });

                });


            });

        break;


        case 'hospitales':

            Hospital.findById(id, (err, hospital) => {

                var pathViejo = `./uploads/${tipo}/${ usuario.img }`;

                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }

                hospital.img = nombreArchivo;

                hospital.save((err, hospitalActualizado) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error Actualizar registro',
                            errors: err
                        });
                    }

                 return   res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de hospital Actualizada',
                        hospital: hospitalActualizado
                    });

                });


            });

        break;

    }

}

module.exports = app;