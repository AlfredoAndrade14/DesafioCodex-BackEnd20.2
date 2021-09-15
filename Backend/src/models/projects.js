const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nome: { type: String, required: true, unique: true, lowercase: true },
    descricao: { type: String, require: false, unique: true},
    integrantes: [String],
    dataDeInicio: { type: Date, required: true },
    dataDeTermino: { type: Date },
    status: { type: String, unique: true, uppercase: true, enum: ['CONCLUIDO', 'EM PROGRESSO'] }
});

module.exports = mongoose.model('Project', UserSchema);