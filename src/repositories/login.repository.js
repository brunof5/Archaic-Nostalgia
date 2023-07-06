import mysql from 'mysql2'

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mydb'
})

async function verificaCampos(req, res) {

    var sqlCliente = "SELECT * FROM cliente WHERE nomeLoginCliente = ? AND senhaLoginCliente = ?;"
    var sqlEmpregado = "SELECT * FROM empregado WHERE nomeLoginEmpregado = ? AND senhaLoginEmpregado = ?;"
    var params = []

    const { nomeLogin, senhaLogin } = req.params;

    params.push(nomeLogin, senhaLogin)
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
                            console.log("Usuário autenticado como cliente!")
                            var data = { sucesso: true, mensagem: "0" }
                            var json = [data]
                            retorno(JSON.stringify(json))
                        } else {
                            connection.query(sqlEmpregadoFormatted, function (err, resultEmpregado) {
                                if (err) {
                                    console.log("Erro QUERY: ", err)
                                    throw err
                                } else {
                                    
                                    if (resultEmpregado.length) {
                                        console.log("Usuário autenticado como empregado!")
                                        var data = { sucesso: true, mensagem: "1" }
                                        var json = [data]
                                        retorno(JSON.stringify(json))
                                    } else {
                                        console.log("Usuário e/ou senha inválidos!")
                                        var data = { sucesso: false, mensagem: "Usuário e/ou senha inválidos!" }
                                        var json = [data]
                                        retorno(JSON.stringify(json))
                                    }
                                }
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
