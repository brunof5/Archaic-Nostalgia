import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import cors from 'cors'
import loginRouter from './routes/login.routes.js'
import gerenciarConsoleRouter from './routes/gerenciarConsole.routes.js'

import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(dirname(__filename), 'html');

const app = express()

app.use(session({
    secret: 'secredosecreto',
    resave: false,
    saveUninitialized: true,
	cookie: {secure: false}
}))

app.use(express.json())
app.use(bodyParser.urlencoded({extended : true}))

app.use(cors())

app.use('/login', loginRouter )
app.use('/gerenciarConsole', gerenciarConsoleRouter )

app.get('/', function (req, res) {

    if(req.session.logado) {

        if(req.session.cargo == "funcionario") {
            res.sendFile('/telaFunc.html', {root: __dirname})
        }
        else if(req.session.cargo == "admin") {
            res.sendFile('/telaAdmin.html', {root: __dirname})
        }
        else {
            res.sendFile('/', {root: __dirname})
        }
    }
    else {
        res.sendFile('/', {root: __dirname})
    }
})

app.get('/autenticar', function (req, res) {

    if(req.session.logado) {

        if(req.session.cargo == "cliente") {
            res.json({ cargo: 0, nome: req.session.nome })
        }
        else if(req.session.cargo == "funcionario") {
            res.json({ cargo: 1, nome: req.session.nome })
        }
        else if(req.session.cargo == "admin") {
            res.json({ cargo: 2, nome: req.session.nome })
        }
        else {
            res.json({ cargo: -1 })
        }
    }
    else {
        res.json({ cargo: -1 })
    }
})

app.get('/deslogar', function (req, res) {

    req.session.logado = false
    req.session.cargo = null
    req.session.save(function (err) {
        if (err) {
            throw err
        }
        req.session.regenerate(function (err) {
            if (err) {
                throw err
            }
            res.redirect('/')
        })
    })
})

app.use(express.static(__dirname));

app.listen(3000, () => {
    console.log("Escutando a porta 3000!")
})