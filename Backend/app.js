const express = require('express');
const bodyParser = require('body-parser');
const Route = require('./src/routes')
const mongoose = require('mongoose');
const config = require('./src/config/config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

mongoose.connection.on('error', (err) => {
    console.log('Erro na conexão com o banco de dados: ' + err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Aplicação desconectada do banco de dados!');
});

mongoose.connection.on('connected', () => {
    console.log('Aplicação conectada ao banco de dados!');
});

mongoose.connect(config.bd_string, { useNewUrlParser: true, useUnifiedTopology: true});


app.use('/', Route);

app.listen(process.env.PORT || 3000);

module.exports = app;