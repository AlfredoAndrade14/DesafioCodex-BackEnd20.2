const mongoose = require('../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true
    },
    foto: { 
        type: String,
        required: false,
        unique: true,
        lowercase: true 
    },
    aniversario: { 
        type: Date, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
    cargo: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
    especialidades: { 
        type: [String], 
        required: true, 
        unique: true, 
        lowercase: true
     },
    cpf: {
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        select: false 
    },
    whatsapp: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
    redesSociais: { 
        type: Map,
        of: String, 
        required: false, 
        unique: true, 
        lowercase: true 
    },
    projetosAtuais: { 
        type: [String], 
        required: false, 
        unique: true, 
        lowercase: true
    },
    projetosFeitos: { 
        type: [String], 
        required: false, 
        unique: true, 
        lowercase: true 
    },
    password: {
        type: String,
        required: true,
        select:false
    }
});

UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User;