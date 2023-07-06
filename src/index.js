import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import loginRouter from './routes/login.routes.js'
import gerenciarConsoleRouter from './routes/gerenciarConsole.routes.js'

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({extended : true}))

app.use(cors())

app.use('/login', loginRouter )
app.use('/gerenciarConsole', gerenciarConsoleRouter )


app.listen(3000, () => {
    console.log("Escutando a porta 3000!")
})