const mongoose = require('mongoose');
const config = require('./config');

module.exports = () => {
    mongoose.set('useFindAndModify', false);
    mongoose.connection.on('error', (err) => {
        console.log('Erro na conexão com o banco de dados: ' + err);
    });
    
    mongoose.connection.on('disconnected', () => {
        console.log('Aplicação desconectada do banco de dados!');
    });
    
    mongoose.connection.on('connected', () => {
        console.log('Aplicação conectada ao banco de dados!');
    });
    
    mongoose.connect(config.bd_string, { reconnectTries: Number.MAX_VALUE, reconnectInterval: 500, poolSize: 5, useNewUrlParser: true });
}