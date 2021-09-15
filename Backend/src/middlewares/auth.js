const jwt = require("jsonwebtoken");
const config = require('../config/config');
const User = require('../models/user');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).send({ error: 'Token não enviado!' });
    
    const parts = authHeader.split(' ');
    
    if (!parts.length === 2)
        return res.status(401).send({ error: 'erro de token'})
    
    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Token malformatado'});

    jwt.verify(token, config.jwt_pass, async (err,decoded) => {
        if (err) return req.status(401).send({ error: "Token inválido"});

        const user = await User.findOne({ id: decoded.sub });

        if (!user)
            return res.status(404).send({ error: 'Usuário não existe!' });

        const token = user.tokens;
        if (!token.includes(token)) {
            return res.status(401).send({ error: 'Token inválido' });
        }

        req.id = decoded.sub;
        req.user = user;
        return next();
    })
};