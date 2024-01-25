const data = require('./data.js')
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const GetAllUsers = () => {
    const usersSemSenha = data.users.map(user => {
        const { senha, ...userSemSenha } = user;
        return userSemSenha
    });
    return usersSemSenha
}
const SeveUser = async (user) =>  {
   
    const { senha, ...userSemSenha } = user;

    const hashedSenha = await bcrypt.hash(senha, 10);
    data.users.push({id: uuidv4(), ...userSemSenha, senha: hashedSenha})
}
const GetUserEmail = (email) => {
    return data.users.find((user) => user.email === email)
}
const VerifyUserExiste = (email) => {
    return data.users.some((user) => user.email === email)
}
const VerifyUserCredentials = async (email, senha) => {
    const user = GetUserEmail(email);
   // console.log(user)
    if (!user) {
        return null;
    }

    const comparaSenha = await bcrypt.compare(senha, user.senha);
    if (!comparaSenha) {
        return null;
    }
    return user;
};

const generateAuthToken = (user) => {
    const payload = {
        userId: user.id,
        email: user.email,
    };
    const token = jwt.sign(payload, 'ewyqioryyieowyoqryweoqryo', { expiresIn: '1h' });
    return token;
};
module.exports = {
    GetAllUsers,
    SeveUser,
    GetUserEmail,
    VerifyUserCredentials,
    generateAuthToken,
    VerifyUserExiste
}