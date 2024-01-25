const express = require('express');
const cors = require('cors')
const services = require('./services.js')

const app = express();
app.use(express.json())
app.use(cors())

//Cadastro Usuário
app.post('/user/cadastro', async (req,res) => {
    const nome = req.body.nome
    const email = req.body.email
    const senha = req.body.senha
    
    try {
        const isUser = services.VerifyUserExiste(email)
        if(isUser){
            res.json({msg: "Usuário já cadastrado"})
        }else{
            const userCadastrado = { nome, email, senha }
            services.SeveUser(userCadastrado)
            res.json({ msg: 'Usuário cadastrado com sucesso'})
        }

    } catch (error) {
        res.status(500).json({ msg: 'Erro interno do servidor' });
    }
})
//Login do Usuário
app.post('/user/login', async  (req,res) => {
    const email = req.body.email;
    const senha = req.body.senha;
    try {
        const userAutenticado = await services.VerifyUserCredentials(email, senha)
        if (!userAutenticado){
            res.json({ msg: 'Credenciais inválidas' });
        }else{
            const tokenGerado = services.generateAuthToken(userAutenticado);
            res.json({ msg: "Usuario autenticado", tokenGerado });
           // console.log(tokenGerado)
        }
        //console.log(userAutenticado)
        
        
    } catch (error) {
        res.status(500).json({ msg: 'Erro interno do servidor' });
    }
    

})
app.get('/user', (req, res) => {
    const users = services.GetAllUsers()
    res.json(users)
})
app.get('/' , (req, res) =>{
    res.json({msg:'Bem vindo!!'})
})
const PORT = 3001
app.listen(PORT, () =>{
    console.log(`Servidor iniciado na porta ${PORT}`)
})