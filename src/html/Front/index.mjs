import express from 'express'
import bodyParser from 'body-parser'
import mysql from 'mysql2'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended : true}))

var pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mydb'
})

app.post('/login', loginUser)

app.get('/cliente', getTodosClientes)
app.get('/cliente/:cpfCliente', getCliente)
app.post('/cliente', criarCliente)
app.delete('/cliente/:cpfCliente', deletarCliente)
app.put('/cliente/:idCliente', atualizarCliente)

function getTodosClientes(req, res) {

    var sql = "SELECT * FROM cliente;"

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Erro GET CONNECTION: ", err)
            throw err
        }
        else {
            connection.query(sql, function (err, result) {
                if (err) {
                    console.log("Erro GET CONNECTION: ", err)
                    throw err
                }
                else {
                    console.log(result)

                    res.json(result)
                }
            })
        }

        connection.release()
    })
}

function getCliente(req, res) {
    
    var sql = "SELECT * FROM cliente WHERE cpfCliente = ?;"
    var params = []

    const { cpfCliente } = req.params

    params.push(cpfCliente)
    sql = mysql.format(sql, params)

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Erro GET CONNECTION: ", err)
            throw err
        }
        else {
            connection.query(sql, function (err, result) {
                if (err) {
                    console.log("Erro GET CONNECTION: ", err)
                    throw err
                }
                else {
                    console.log(result)

                    if(!result.length) {
                        res.json({ sucesso: false, mensagem: "Usuário não existe."})
                    }
                    else {
                        res.json(result)
                    }
                }
            })
        }

        connection.release()
    })
}

function criarCliente(req, res) {

    var sql = "INSERT INTO cliente VALUES (?, ?, ?, ?, ?);"
    var params = []

    const { inputCPF, inputName, inputUser, inputPassword } = req.body

    params.push(null, inputCPF, inputName, inputUser, inputPassword)
    sql = mysql.format(sql, params)

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Erro GET CONNECTION: ", err)
            throw err
        }
        else {
            connection.query(sql, function (err, result) {
                if (err) {
                    console.log("Erro QUERY:", err)
                    throw err
                }
                else {
                    console.log(result)

                    if(!result.length) {
                        res.json({ sucesso: true })
                    }
                    else {
                        res.json({ sucesso: false, mensagem: "Algo deu errado!"})
                    }
                }
            })
        } 

        connection.release()
    })
}

function deletarCliente(req, res) {

    var sql = "DELETE from cliente where cpfCliente = ?;"
    var params = []

    const { cpfCliente } = req.params

    params.push(cpfCliente)
    sql = mysql.format(sql, params)

    console.log(sql)

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Erro GET CONNECTION: ", err)
            throw err
        }
        else {
            connection.query(sql, function (err, result) {
                if (err) {
                    console.log("Erro QUERY:", err)
                    throw err
                }
                else {
                    console.log(result)

                    if(!result.length) {
                        res.json({ sucesso: true })
                    }
                    else {
                        res.json({ sucesso: false, mensagem: "Algo deu errado!"})
                    }
                }
            })
        } 

        connection.release()
    })
}

function atualizarCliente(req, res) {

    var sql = "UPDATE cliente\
    SET cpfCliente = ?, nomeCliente = ?, nomeLoginCliente = ?, senhaLoginCliente = ?\
    WHERE idCliente = ?"
    var params = []

    const { cpfCliente, nomeCliente, nomeLoginCliente, senhaLoginCliente } = req.body
    const idCliente = req.params.idCliente

    params.push(cpfCliente, nomeCliente, nomeLoginCliente, senhaLoginCliente, idCliente)
    sql = mysql.format(sql, params)

    console.log(sql)

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Erro GET CONNECTION: ", err)
            throw err
        }
        else {
            connection.query(sql, function (err, result) {
                if (err) {
                    console.log("Erro QUERY:", err)
                    throw err
                }
                else {
                    console.log(result)

                    if(!result.length) {
                        res.json({ sucesso: true })
                    }
                    else {
                        res.json({ sucesso: false, mensagem: "Algo deu errado!"})
                    }
                }
            })
        } 

        connection.release()
    })
}

function loginUser(req, res) {

    var sql = "SELECT idCliente FROM cliente WHERE nomeLoginCliente = ? AND senhaLoginCliente = ?;"
    var params = []

    const { inputUser, inputPassword } = req.body

    params.push(inputUser, inputPassword)
    sql = mysql.format(sql, params)

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Erro GET CONNECTION: ", err)
            throw err
        }
        else {
            connection.query(sql, function (err, result) {
                if (err) {
                    console.log("Erro QUERY:", err)
                    throw err
                }
                else {
                    console.log(result)

                    if(!result.length) {
                        res.json({ sucesso: false, mensagem: "Usuário e/ou senha inválidos!"})
                    }
                    else {
                        res.json({ sucesso: true })
                    }
                }
            })
        } 

        connection.release()
    })
}

app.listen(3000, () => {
    console.log("Escutando a porta 3000!")
})