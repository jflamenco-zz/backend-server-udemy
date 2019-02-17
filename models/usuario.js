var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');



var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role valido'
};


var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'EL usuario es necesario'] },
    email: { type: String, unique: true, required: [true, 'EL correo es necesario'] },
    password: { type: String, required: [true, 'la contraseña es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: [true, 'EL usuario es necesario'], default: 'USER_ROLE', enum: rolesValidos },

});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);