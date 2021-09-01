const express = require('express');

const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req,res) => {
    const { nome } = req.body;

    try {
        if(await User.findOne({ nome }))
            return res.send(400).send({ error: "User alredy exists"});

        const user = User.create(req.body);

        user.password = undefined;

        return res.send({ user });
    } catch(err) {
        return res.status(400).send({ error: 'Registration failed'})
    }
});

module.exports = app => app.use('/auth', router);