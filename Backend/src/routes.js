const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middlewares/auth');
const config = require('./config/config');


const User = require('./models/user');
const Project = require('./models/projects');

const router = express.Router();

function generateToken( userId ) {
    return jwt.sign({
        iss: 'desafioNackend',
        sub: userId,
        iat: new Date().getTime()
    }, config.jwt_pass, { expiresIn: 172800 });
}

router.post('/user/register', async (req,res) => {
    const { nome, password } = req.body;
    if (!nome || !password) return res.sendStatus(400).send({ error: 'Dados insuficientes!' });

    try {
        if(await User.findOne({ nome })) return res.status(400).send({ error: "Usuário já registrado!"});

        const user = await User.create(req.body);

        user.tokens.push(generateToken( user.id ));
        await user.save();

        user.password = undefined;

        return res.status(201).send({ user });
    } 
    catch(err) {
        return res.status(500).send({ error: 'Erro no registro'});
    }
});

router.post('/user/auth', async(req,res) => {
    const { nome, password } = req.body;

    if (!nome || !password) return res.status(400).send({ error: 'Dados insuficientes!' });

    try {
        const user = await User.findOne({ nome }).select('+password');

        if (!user) return res.status(400).send({ error: 'Usuário não encontrado!'});

        const testeSenha = await bcrypt.compare(password, user.password);

        if(!testeSenha) return res.status(401).send({ error: 'Senha Invalida'});

        user.tokens.push(generateToken( user.id ));
        await user.save();

        user.password = undefined;

        return res.status(201).send({ user });
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro ao buscar usuário!' });
    }
})

router.put('/user/logout', auth, async (req, res) => {
    const user = await User.findOne({_id: req.id }).select('+password');
    const token = req.headers["authorization"];
    const index = user.tokens.indexOf(token);
    user.tokens.splice(index, 1);
    await user.save();
    return res.status(201).send('logout realizado com sucesso');
});

router.put('/user', auth, async (req, res) => {
    const user = await User.findOne({_id: req.id });
    user = req.body;
});

router.get('/user', auth, async (req, res) => {
    const user = await User.findOne({_id: req.id });
    return res.send(user);
});

router.get('/users', auth,async (req, res) => {
    try {
        const users = await User.find({});
        return res.send(users);
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro na consulta de usuários!' });
    }
});


router.post('/projects', async (req,res) => {
    const { nome, integrantes, dataDeInicio } = req.body;
    if (!nome || !integrantes || !dataDeInicio) return res.sendStatus(400).send({ error: 'Dados insuficientes!' });

    try {
        if(await Project.findOne({ nome })) return res.status(400).send({ error: "Projeto já registrado!"});

        const project = await Project.create(req.body);

        return res.status(201).send({ project });
    } catch(err) {
        return res.status(500).send({ error: 'Erro no registro'});
    }
});

router.put('/projects', auth,async (req,res) => {
    const project = await Project.findOne({_id: req.body._id });
    try {
        project = req.body;
    } catch(err){
        return res.status(500).send({ error: 'Erro ao editar projeto!' });
    }
});

router.get('/projects', auth,async (req, res) => {
    try {
        const project = await Project.find({});
        return res.send(project);
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro na consulta de projetos!' });
    }
});

module.exports = router;