const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    nome: { type: String, required: true, unique: true, lowercase: true },
    foto: { type: String, required: false, unique: true, lowercase: true },
    aniversario: { type: Date, required: true, unique: true, lowercase: true },
    cargo: { type: String, required: true, unique: true, lowercase: true },
    especialidades: { type: [String], required: true, unique: true, lowercase: true },
    cpf: { type: String, required: true, unique: true, lowercase: true, select: false },
    whatsapp: { type: String, required: true, unique: true, lowercase: true },
    linkedIn: { type: String, required: false, unique: true, lowercase: true },
    projetosAtuais: { type: [String], required: false, unique: true, lowercase: true },
    tokens: [ String ],
    password: { type: String, required: true, select:false }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    return next();
});

module.exports = mongoose.model('User', UserSchema);