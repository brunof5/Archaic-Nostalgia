import mysql from 'mysql2';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb'
});

// Insere Console e Estoque no Banco de Dados
async function cadastrarConsole(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany) {
    
    var sqlCadastroTabelaConsole = "INSERT INTO console VALUES (?, ?, ?, ?, ?, ?, ?);"
    var sqlCadastroTabelaEstoque = "INSERT INTO estoque VALUES (?, ?, ?);"

    const paramsTabelaConsole = [null, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription];
    const sqlCadastroTabelaConsoleFormatted = mysql.format(sqlCadastroTabelaConsole, paramsTabelaConsole);

	const paramsTabelaEstoque = [inputQuantity]
	var empresaSelecionada;
	if (inputCompany == "MG") {
		empresaSelecionada = 3
	}
	else if (inputCompany == "SP") {
		empresaSelecionada = 2
	}
	else if (inputCompany == "RJ") {
		empresaSelecionada = 1
	}

	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log("Erro GET CONNECTION: ", err);
        		reject(err);
			}
			connection.query(sqlCadastroTabelaConsoleFormatted, function (err, resultCadastroConsole) {
				if (err) {
					console.log("Erro ao inserir no banco de dados 1: ", err);
					reject(err);
				}
				console.log("Console inserido no banco de dados com sucesso! Id do Console: " + resultCadastroConsole.insertId);

				paramsTabelaEstoque.push(resultCadastroConsole.insertId)
				paramsTabelaEstoque.push(empresaSelecionada)

				const sqlCadastroTabelaEstoqueFormatted = mysql.format(sqlCadastroTabelaEstoque, paramsTabelaEstoque)

				connection.query(sqlCadastroTabelaEstoqueFormatted, function (err, resultCadastroEstoque) {
					if (err) {
						console.log("Erro ao inserir no banco de dados 2: ", err);
						reject(err);
					}
					console.log("Estoque inserido no banco de dados com sucesso!");

					var data = { sucesso: true, mensagem: "Cadastro feito com sucesso!" }
                    var json = [data]
                    resolve(JSON.stringify(json))
				})
			})

			connection.release();
		})
    });
}

// Deleta Console no Banco de Dados

async function deletarConsole( inputConsoleId ) {
  const sqlEmpregado = "SELECT cargo FROM empregado WHERE nomeLoginEmpregado = ? AND senhaLoginEmpregado = ?;";
  const params = ["joao.silva", "senha123"];
  const sqlEmpregadoFormatted = mysql.format(sqlEmpregado, params);

  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log("Erro GET CONNECTION: ", err);
        reject(err);
      } else {
        connection.query(sqlEmpregadoFormatted, function (err, resultEmpregado) {
          if (err) {
            console.log("Erro QUERY: ", err);
            reject(err);
          } else {
            if (resultEmpregado[0].cargo === "Gerente") {
              console.log("Remoção feita por um admin!");
              const data = { sucesso: true, mensagem: "true" };
              const json = [data];
              
              deletarConsoleNoBancoDeDados(inputConsoleId)
                .then(() => resolve(JSON.stringify(json)))
                .catch((error) => reject(error));

            } else if (resultEmpregado[0].cargo !== "Gerente") {
              console.log("Remoção feita por um funcionário!", resultEmpregado);
              const data = { sucesso: true, mensagem: "true" };
              const json = [data];
              
              deletarConsoleNoBancoDeDados(inputConsoleId)
                .then(() => resolve(JSON.stringify(json)))
                .catch((error) => reject(error));

            } else {

                console.log("Remoção não realizada. Empregado não identificado!", resultEmpregado);
                const data = { sucesso: false, mensagem: "false" };
                const json = [data];

                resolve(JSON.stringify(json))

            }

          }
          connection.release();
        });
      }
    });
  });
}

function deletarConsoleNoBancoDeDados(inputConsoleId) {
  const sql = "DELETE FROM console WHERE idConsole = ?";
  const params = [ inputConsoleId ];
  const sqlFormatted = mysql.format(sql, params);

  return new Promise(function (resolve, reject) {
    pool.query(sqlFormatted, function (err, result) {
      if (err) {
        console.log("Erro ao deletar no banco de dados. Id não encontrado! ", err);
        reject(err);
      } else {
        console.log("Console deletado no banco de dados com sucesso!");
        resolve(result);
      }
    });
  });
}

// Altera Console no Banco de Dados

async function editarConsole( inputConsoleId, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany ) {
  const sqlEmpregado = "SELECT cargo FROM empregado WHERE nomeLoginEmpregado = ? AND senhaLoginEmpregado = ?;";
  const params = ["joao.silva", "senha123"];
  const sqlEmpregadoFormatted = mysql.format(sqlEmpregado, params);

  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log("Erro GET CONNECTION: ", err);
        reject(err);
      } else {
        connection.query(sqlEmpregadoFormatted, function (err, resultEmpregado) {
          if (err) {
            console.log("Erro QUERY: ", err);
            reject(err);
          } else {
            if (resultEmpregado[0].cargo === "Gerente") {
              console.log("Alteração feita por um admin!");
              const data = { sucesso: true, mensagem: "true" };
              const json = [data];
              
              editarConsoleNoBancoDeDados(inputConsoleId, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription)
                .then(() => resolve(JSON.stringify(json)))
                .catch((error) => reject(error));

            } else if (resultEmpregado[0].cargo !== "Gerente" && resultEmpregado[0].FK_idEmpresa === inputCompany) {
              console.log("Alteração feita por um funcionário!", resultEmpregado);
              const data = { sucesso: true, mensagem: "true" };
              const json = [data];
              
              editarConsoleNoBancoDeDados(inputConsoleId, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription)
                .then(() => resolve(JSON.stringify(json)))
                .catch((error) => reject(error));

            } else {

                console.log("Alteração não realizada. Empregado não identificado ou não presente na região de registro!", resultEmpregado);
                const data = { sucesso: false, mensagem: "false" };
                const json = [data];

                resolve(JSON.stringify(json))

            }

          }
          connection.release();
        });
      }
    });
  });
}

function editarConsoleNoBancoDeDados(inputConsoleId, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription) {
  const sql = "UPDATE console SET nomeConsole = ?, nomeFabricante = ?, dataLancamento = ?, ehOriginal = b?, preco = ?, descricaoConsole = ? WHERE idConsole = ?;";
  const params = [ inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputConsoleId];
  const sqlFormatted = mysql.format(sql, params);

  return new Promise(function (resolve, reject) {
    pool.query(sqlFormatted, function (err, result) {
      if (err) {
        console.log("Erro ao alterar no banco de dados.", err);
        reject(err);
      } else {
        console.log("Console alterado no banco de dados com sucesso!");
        resolve(result);
      }
    });
  });
}

// Visualizar Consoles no Banco de Dados
async function visualizarConsoles() {

	var sqlGetTodosConsoles = "SELECT C.*, Est.quantAtual, Emp.nomeEmpresa\
	FROM console AS C, estoque AS Est, empresa AS Emp\
	WHERE C.idConsole=Est.FK_idConsole AND Est.FK_idEmpresa=Emp.idEmpresa;"

	console.log(sqlGetTodosConsoles)

	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log("Erro GET CONNECTION: ", err);
        		reject(err);
			}
			connection.query(sqlGetTodosConsoles, function (err, results) {
				if (err) {
					console.log("Erro ao pegar todos os consoles no banco de dados: ", err);
					reject(err);
				}
				console.log("Get de todos os consoles feito com sucesso!")

				resolve(results)
			})

			connection.release();
		})
	})
}

export default { cadastrarConsole, deletarConsole, editarConsole, visualizarConsoles };
