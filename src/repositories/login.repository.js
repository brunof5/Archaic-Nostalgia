import mysql from 'mysql2'

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mydb'
})

async function verificaCampos(inputUser, inputPassword) {

    var sqlCliente = "SELECT nomeCliente FROM cliente WHERE nomeLoginCliente = ? AND senhaLoginCliente = ?;"
    var sqlEmpregado = "SELECT cargo FROM empregado WHERE nomeLoginEmpregado = ? AND senhaLoginEmpregado = ?;"
    var params = []

    params.push(inputUser, inputPassword)
    var sqlClienteFormatted = mysql.format(sqlCliente, params)
    var sqlEmpregadoFormatted = mysql.format(sqlEmpregado, params)

    return new Promise(function (retorno) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log("Erro GET CONNECTION: ", err)
                throw err
            } else {
                connection.query(sqlClienteFormatted, function (err, resultCliente) {
                    if (err) {
                        console.log("Erro QUERY: ", err)
                        throw err
                    } else {

                        if (resultCliente.length) {
                            console.log("Usuário autenticado como cliente! Nome: ", resultCliente)
                            var data = { sucesso: true, mensagem: "0" }
                            var json = [data]
                            retorno(JSON.stringify(json))
                        } else {
                            connection.query(sqlEmpregadoFormatted, function (err, resultEmpregado) {
                                if (err) {
                                    console.log("Erro QUERY: ", err)
                                    throw err
                                } else {
                                    if (resultEmpregado.length == 0) {
                                        console.log("Usuário e/ou senha inválidos!")
                                        var data = { sucesso: false, mensagem: "Usuário e/ou senha inválidos!" }
                                        var json = [data]
                                        retorno(JSON.stringify(json))
                                    } else if (resultEmpregado[0].cargo === "Gerente") {
                                        console.log("Usuário autenticado como admin! Nome: ", resultEmpregado)
                                        var data = { sucesso: true, mensagem: "2" }
                                        var json = [data]
                                        retorno(JSON.stringify(json))
                                    } else {
                                        console.log("Usuário autenticado como funcionário! Nome: ", resultEmpregado)
                                        var data = { sucesso: true, mensagem: "1" }
                                        var json = [data]
                                        retorno(JSON.stringify(json))
                                    }
                                }

                                connection.release()
                            })
                        }
                    }
                })
            }

            connection.release()
        })
    })
}

export default { verificaCampos }
