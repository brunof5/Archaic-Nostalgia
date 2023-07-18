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
					console.log("Erro ao inserir no banco de dados (console): ", err);
					reject(err);
				}
				console.log("Console inserido no banco de dados com sucesso! Id do Console: " + resultCadastroConsole.insertId);

				paramsTabelaEstoque.push(resultCadastroConsole.insertId)
				paramsTabelaEstoque.push(empresaSelecionada)

				const sqlCadastroTabelaEstoqueFormatted = mysql.format(sqlCadastroTabelaEstoque, paramsTabelaEstoque)

				connection.query(sqlCadastroTabelaEstoqueFormatted, function (err, resultCadastroEstoque) {
					if (err) {
						console.log("Erro ao inserir no banco de dados (estoque): ", err);
						reject(err);
					}
					else {
						console.log("Estoque inserido no banco de dados com sucesso!");

						var data = { sucesso: true, mensagem: "Cadastro feito com sucesso!" }
                    	var json = [data]
                    	resolve(JSON.stringify(json))
					}
					
				})
			})

			connection.release();
		})
    });
}

// Deleta Console no Banco de Dados, pelo id
async function deletarConsole(inputId) {

	const sqlDeletarEstoque = "DELETE FROM estoque WHERE FK_idConsole = ?;"
	const sqlDeletarConsole = "DELETE FROM console WHERE idConsole = ?;"

	const paramsIdConsole = [inputId]

	const sqlDeletarEstoqueFormatted = mysql.format(sqlDeletarEstoque, paramsIdConsole)
	const sqlDeletarConsoleFormatted = mysql.format(sqlDeletarConsole, paramsIdConsole)

	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log("Erro GET CONNECTION: ", err);
        		reject(err);
			}
			connection.query(sqlDeletarEstoqueFormatted, function (err, resultRemocaoEstoque) {
				if (err) {
					console.log("Erro ao deletar estoque no banco de dados (estoque): ", err);
					reject(err);
				}
				console.log("Remoção do estoque feita com sucesso! Id do Console: " + inputId)

				connection.query(sqlDeletarConsoleFormatted, function (err, resultRemocaoConsole) {
					if (err) {
						console.log("Erro ao deletar console no banco de dados (console): ", err);
						reject(err);
					}
					else {
						console.log("Remoção do console feita com sucesso! Id do Console: " + inputId)

						var data = { sucesso: true, mensagem: "Remoção feita com sucesso!" }
                    	var json = [data]
                    	resolve(JSON.stringify(json))
					}
				})
			})

			connection.release();
		})
	})
}

// Consulta para ver se o funcionario pode deletar um console, pelo id
async function consultaDeletarConsoleRegiao(inputId, inputUser) {

	const sqlConsultarIds = "SELECT idConsole\
	FROM console, estoque, empresa, empregado\
	WHERE empregado.nomeLoginEmpregado=? AND empregado.FK_idEmpresa=empresa.idEmpresa AND empresa.idEmpresa=estoque.FK_idEmpresa AND estoque.FK_idConsole=? AND estoque.FK_idConsole=console.idConsole;"

	const paramsConsultarIds = [inputUser, inputId]

	const sqlConsultarIdsFormatted = mysql.format(sqlConsultarIds, paramsConsultarIds)

	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log("Erro GET CONNECTION: ", err);
        		reject(err);
			}
			connection.query(sqlConsultarIdsFormatted, function (err, resultIds) {
				if (err) {
					console.log("Erro ao deletar no banco de dados (pegar ids) ", err)
					reject(err)
				}
				console.log("Ids: ", resultIds)

				resolve(resultIds)
			})

			connection.release();
		})
	})
}

// Altera Console no Banco de Dados
async function editarConsole(inputId, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany) {

	var sqlAlterarConsole = "UPDATE console SET nomeConsole = ?, nomeFabricante = ?, dataLancamento = ?, ehOriginal = ?, preco = ?, descricaoConsole = ? WHERE idConsole = ?"
	var sqlAlterarEstoque = "UPDATE estoque SET quantAtual = ?, FK_idEmpresa = ? WHERE FK_idConsole = ?"
	
	const paramsAlterarConsole = [ inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputId];
	const sqlAlterarConsoleFormatted = mysql.format(sqlAlterarConsole, paramsAlterarConsole);

	const paramsAlterarEstoque = [inputQuantity]
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
	paramsAlterarEstoque.push(empresaSelecionada)
	paramsAlterarEstoque.push(inputId)
	const sqlAlterarEstoqueFormatted = mysql.format(sqlAlterarEstoque, paramsAlterarEstoque)

	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log("Erro GET CONNECTION: ", err);
        		reject(err);
			}
			connection.query(sqlAlterarConsoleFormatted, function (err, resultAlterarConsole) {
				if (err) {
					console.log("Erro ao alterar no banco de dados (console): ", err);
					reject(err);
				}
				console.log("Console alterado no banco de dados com sucesso! Id do Console: " + inputId);

				connection.query(sqlAlterarEstoqueFormatted, function (err, resultAlterarEstoque) {
					if (err) {
						console.log("Erro ao alterar no banco de dados (estoque): ", err);
						reject(err);
					}
					else {
						console.log("Estoque alterado no banco de dados com sucesso! Id do Console: " + inputId);

						var data = { sucesso: true, mensagem: "Alteração feita com sucesso!" }
                    	var json = [data]
                    	resolve(JSON.stringify(json))
					}
				})
			})

			connection.release();
		})
    });
}

// Visualizar Consoles no Banco de Dados
async function visualizarConsoles() {

	var sqlGetTodosConsolesRestauracao = "SELECT C.*, E.nomeEmpresa\
	FROM console AS C, empresa AS E, venda_restauracao AS VR\
	WHERE VR.FK_idEmpresa=E.idEmpresa AND VR.FK_idConsole=C.idConsole AND VR.ehVenda=0\
	Order BY C.idConsole;"

	var sqlGetTodosConsoles = "SELECT C.*, Est.quantAtual, Emp.nomeEmpresa\
	FROM console AS C, estoque AS Est, empresa AS Emp\
	WHERE C.idConsole=Est.FK_idConsole AND Est.FK_idEmpresa=Emp.idEmpresa\
	ORDER BY C.idConsole;"

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
				else {
					connection.query(sqlGetTodosConsolesRestauracao, function (err, resultsRestauracao) {
						if (err) {
							console.log("Erro ao pegar todos os consoles de restauração no banco de dados: ", err);
							reject(err);
						}
						else {

							let finalResults = [results, resultsRestauracao]

							resolve(finalResults)
						}
					})
				}
			})

			connection.release();
		})
	})
}

// Visualizar Consoles de Uma Região no Banco de Dados
async function visualizarConsolesRegiao(inputUser) {

	var sqlGetTodosConsolesRestauracaoRegiao = "SELECT C.*, E.nomeEmpresa\
	FROM console AS C, empresa AS E, venda_restauracao AS VR, empregado\
	WHERE VR.FK_idEmpresa=E.idEmpresa AND VR.FK_idConsole=C.idConsole AND VR.ehVenda=0 AND E.idEmpresa=empregado.FK_idEmpresa AND empregado.nomeLoginEmpregado=?\
	Order BY C.idConsole;"

	var sqlGetTodosConsolesRegiao = "SELECT C.*, Est.quantAtual, Emp.nomeEmpresa\
	FROM console AS C, estoque AS Est, empresa AS Emp, empregado\
	WHERE C.idConsole=Est.FK_idConsole AND Est.FK_idEmpresa=Emp.idEmpresa AND Emp.idEmpresa=empregado.FK_idEmpresa AND empregado.nomeLoginEmpregado=?\
	ORDER BY C.idConsole;"

	const paramsGetTodosConsolesRegiao = [inputUser]
	const sqlGetTodosConsolesRegiaoFormatted = mysql.format(sqlGetTodosConsolesRegiao, paramsGetTodosConsolesRegiao);
	const sqlGetTodosConsolesRestauracaoRegiaoFormatted = mysql.format(sqlGetTodosConsolesRestauracaoRegiao, paramsGetTodosConsolesRegiao)

	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log("Erro GET CONNECTION: ", err);
        		reject(err);
			}
			connection.query(sqlGetTodosConsolesRegiaoFormatted, function (err, results) {
				if (err) {
					console.log("Erro ao pegar todos os consoles de uma região no banco de dados: ", err);
					reject(err);
				}
				else {
					connection.query(sqlGetTodosConsolesRestauracaoRegiaoFormatted, function (err, resultsRestauracao) {
						if (err) {
							console.log("Erro ao pegar todos os consoles de restauração no banco de dados: ", err);
							reject(err);
						}
						else {

							let finalResults = [results, resultsRestauracao]

							resolve(finalResults)
						}
					})
				}
			})

			connection.release();
		})
	})
}

// Visualizar um Console no Banco de Dados, pelo seu id
async function visualizarConsole(inputId) {

	var sqlGetUmConsole = "SELECT C.*, Est.quantAtual, Emp.nomeEmpresa\
	FROM console AS C, estoque AS Est, empresa AS Emp\
	WHERE C.idConsole=? AND C.idConsole=Est.FK_idConsole AND Est.FK_idEmpresa=Emp.idEmpresa;"

	const paramsGetUmConsole = [inputId]
	const sqlGetUmConsoleFormatted = mysql.format(sqlGetUmConsole, paramsGetUmConsole);

	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log("Erro GET CONNECTION: ", err);
        		reject(err);
			}
			connection.query(sqlGetUmConsoleFormatted, function (err, results) {
				if (err) {
					console.log("Erro ao pegar um console no banco de dados: ", err);
					reject(err);
				}
				else {
					resolve(results)
				}
			})

			connection.release();
		})
	})
}

// Visualizar um Consoles de Uma Região no Banco de Dados, pelo seu id
async function visualizarConsoleRegiao(inputId, inputUser) {

	var sqlGetUmConsoleRegiao = "SELECT C.*, Est.quantAtual, Emp.nomeEmpresa\
	FROM console AS C, estoque AS Est, empresa AS Emp, empregado\
	WHERE C.idConsole=? AND C.idConsole=Est.FK_idConsole AND Est.FK_idEmpresa=Emp.idEmpresa AND Emp.idEmpresa=empregado.FK_idEmpresa AND empregado.nomeLoginEmpregado=?\
	ORDER BY C.idConsole;"

	const paramsGetTodosConsolesRegiao = [inputId, inputUser]
	const sqlGetUmConsoleRegiaoFormatted = mysql.format(sqlGetUmConsoleRegiao, paramsGetTodosConsolesRegiao);

	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log("Erro GET CONNECTION: ", err);
        		reject(err);
			}
			connection.query(sqlGetUmConsoleRegiaoFormatted, function (err, results) {
				if (err) {
					console.log("Erro ao pegar um console de uma região no banco de dados: ", err);
					reject(err);
				}
				else {
					resolve(results)
				}
			})

			connection.release();
		})
	})
}

// Verifica a região do Empregado
async function verificarEmpresaEmpregado(inputUser) {

	var sqlConsultaEmpresaEmpregado = "SELECT empresa.estado\
	FROM empresa, empregado\
	WHERE empresa.idEmpresa=empregado.FK_idEmpresa AND empregado.nomeLoginEmpregado=?;"

	const paramsConsultaEmpresaEmpregado = [inputUser]
	const sqlConsultaEmpresaEmpregadoFormatted = mysql.format(sqlConsultaEmpresaEmpregado, paramsConsultaEmpresaEmpregado);

	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log("Erro GET CONNECTION: ", err);
        		reject(err);
			}
			connection.query(sqlConsultaEmpresaEmpregadoFormatted, function (err, results) {
				if (err) {
					console.log("Erro ao pegar a região de um empregado no banco de dados: ", err);
					reject(err);
				}
				else {
					resolve(JSON.stringify(results))
				}
			})

			connection.release();
		})
	})
}

export default { cadastrarConsole, deletarConsole, consultaDeletarConsoleRegiao, editarConsole, visualizarConsoles, visualizarConsolesRegiao, visualizarConsole, visualizarConsoleRegiao, verificarEmpresaEmpregado };
