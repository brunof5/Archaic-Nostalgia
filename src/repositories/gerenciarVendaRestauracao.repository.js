import mysql from 'mysql2';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb'
});

// Insere Venda/Restauração no Banco de Dados
async function cadastrarVendaRestauracao(inputId, inputCPF, inputCompanyState, inputServiceDate, inputServiceHour, inputTotalValue, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputRestorationDescription, inputDelivery, inputQuantity) {
    
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

// Deleta Venda/Restauração no Banco de Dados, pelo id
async function deletarVendaRestauracao(inputId) {
	const sqlVerificarEntrega = "SELECT estaEntregue FROM venda_restauracao WHERE idVenda_Restauracao = ?;";
	const sqlVerificarVenda = "SELECT ehVenda, FK_idConsole, FK_idEmpresa FROM venda_restauracao WHERE idVenda_Restauracao = ?;";
	const sqlAtualizarEstoque = "UPDATE estoque SET quantAtual = quantAtual - 1 WHERE FK_idConsole = ? AND FK_idEmpresa = ?;";
	const sqlDeletarVendaRestauracao = "DELETE FROM venda_restauracao WHERE idVenda_Restauracao = ?;";
  
	const paramsId = [inputId];
  
	const sqlVerificarEntregaFormatted = mysql.format(sqlVerificarEntrega, paramsId);
	const sqlVerificarVendaFormatted = mysql.format(sqlVerificarVenda, paramsId);
	const sqlDeletarVendaRestauracaoFormatted = mysql.format(sqlDeletarVendaRestauracao, paramsId);
  
	return new Promise(function (resolve, reject) {
	  pool.getConnection(function (err, connection) {
		if (err) {
		  console.log("Erro GET CONNECTION: ", err);
		  reject(err);
		}
  
		// Verificar se o serviço está marcado como entregue
		connection.query(sqlVerificarEntregaFormatted, function (err, resultEntrega) {
		  if (err) {
			console.log("Erro ao verificar a entrega da Venda/Restauração no banco de dados: ", err);
			reject(err);
		  }
  
		  const estaEntregue = resultEntrega[0].estaEntregue;
  
		  if (estaEntregue) {
			var data = { sucesso: false, mensagem: "Não é possível deletar a Venda/Restauração pois já está entregue." };
			var json = [data];
			resolve(JSON.stringify(json));
			connection.release();
			return;
		  }
  
		  // Verificar se o serviço é uma venda
		  connection.query(sqlVerificarVendaFormatted, function (err, resultVenda) {
			if (err) {
			  console.log("Erro ao verificar se a Venda/Restauração é uma venda no banco de dados: ", err);
			  reject(err);
			}
  
			const ehVenda = resultVenda[0].ehVenda;
			const quantAtual = resultVenda[0].quantAtual;
			const idConsole = resultVenda[0].FK_idConsole;
			const idEmpresa = resultVenda[0].FK_idEmpresa;
  
			if (ehVenda) {
			  // Atualizar o estoque
			  connection.query(sqlAtualizarEstoque, [quantAtual, idConsole, idEmpresa], function (err, resultAtualizacaoEstoque) {
				if (err) {
				  console.log("Erro ao atualizar o estoque no banco de dados: ", err);
				  reject(err);
				}
			  });
			}

			// Remover o serviço
			connection.query(sqlDeletarVendaRestauracaoFormatted, function (err, resultRemocaoServico) {
				if (err) {
				  console.log("Erro ao deletar a Venda/Restauração no banco de dados: ", err);
				  reject(err);
				}

				console.log("Venda/Restauração removida com sucesso! Id da Venda/Restauração: " + inputId);

				var data = { sucesso: true, mensagem: "Remoção feita com sucesso!" };
				var json = [data];
				resolve(JSON.stringify(json));
				connection.release();
				
			});
		  });
		});
	  });
	});
  }
  

// Consulta para ver se o funcionario pode deletar uma Venda/Restauração, pelo id
async function consultaDeletarVendaRestauracaoRegiao(inputId, inputUser) {

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

// Altera uma Venda/Restauração no Banco de Dados
async function editarVendaRestauracao(inputId, inputCPF, inputCompanyState, inputServiceDate, inputServiceHour, inputTotalValue, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputRestorationDescription, inputDelivery, inputQuantity) {

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

// Visualizar Vendas/Restaurações no Banco de Dados
async function visualizarVendasRestauracoes() {

	var sqlGetTodosConsoles = "SELECT V.*, C.nomeCliente, E.nomeEmpresa\
	FROM venda_restauracao AS V\
	JOIN cliente AS C ON V.FK_idCliente = C.idCliente\
	JOIN empresa AS E ON V.FK_idEmpresa = E.idEmpresa\
	ORDER BY V.idVenda_Restauracao;"

	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log("Erro GET CONNECTION: ", err);
        		reject(err);
			}
			connection.query(sqlGetTodosConsoles, function (err, results) {
				if (err) {
					console.log("Erro ao pegar todas as Vendas/Restaurações no banco de dados: ", err);
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

// Visualizar Vendas/Restaurações de Uma Região no Banco de Dados
async function visualizarVendasRestauracoesRegiao(inputUser) {

	var sqlGetTodosConsolesRegiao = "SELECT V.*, C.nomeCliente, E.nomeEmpresa\
	FROM venda_restauracao AS V\
	JOIN cliente AS C ON V.FK_idCliente = C.idCliente\
	JOIN empresa AS E ON V.FK_idEmpresa = E.idEmpresa\
	JOIN empregado AS Em ON V.FK_idEmpresa = Em.FK_idEmpresa\
	WHERE Em.nomeLoginEmpregado = ?\
	ORDER BY V.idVenda_Restauracao;"

	const paramsGetTodosConsolesRegiao = [inputUser]
	const sqlGetTodosConsolesRegiaoFormatted = mysql.format(sqlGetTodosConsolesRegiao, paramsGetTodosConsolesRegiao);

	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log("Erro GET CONNECTION: ", err);
        		reject(err);
			}
			connection.query(sqlGetTodosConsolesRegiaoFormatted, function (err, results) {
				if (err) {
					console.log("Erro ao pegar todas as Vendas/Restaurações de uma região no banco de dados: ", err);
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

// Visualizar uma Venda/Restauração no Banco de Dados, pelo seu id
async function visualizarVendaRestauracao(inputId) {

	var sqlGetUmConsole = "SELECT V.*, C.nomeCliente, E.nomeEmpresa\
	FROM venda_restauracao AS V\
	JOIN cliente AS C ON V.FK_idCliente = C.idCliente\
	JOIN empresa AS E ON V.FK_idEmpresa = E.idEmpresa\
	WHERE V.idVenda_Restauracao = ?\
	ORDER BY V.idVenda_Restauracao;"

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
					console.log("Erro ao pegar uma Venda/Restauração no banco de dados: ", err);
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

// Visualizar uma Venda/Restauração de Uma Região no Banco de Dados, pelo seu id
async function visualizarVendaRestauracaoRegiao(inputId, inputUser) {

	var sqlGetTodosConsolesRegiao = "SELECT V.*, C.nomeCliente, E.nomeEmpresa\
	FROM venda_restauracao AS V\
	JOIN cliente AS C ON V.FK_idCliente = C.idCliente\
	JOIN empresa AS E ON V.FK_idEmpresa = E.idEmpresa\
	JOIN empregado AS Em ON V.FK_idEmpresa = Em.FK_idEmpresa\
	WHERE V.idVenda_Restauracao = ? AND Em.nomeLoginEmpregado = ?\
	ORDER BY V.idVenda_Restauracao;"

	const paramsGetTodosConsolesRegiao = [inputId, inputUser]
	const sqlGetTodosConsolesRegiaoFormatted = mysql.format(sqlGetTodosConsolesRegiao, paramsGetTodosConsolesRegiao);

	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log("Erro GET CONNECTION: ", err);
        		reject(err);
			}
			connection.query(sqlGetTodosConsolesRegiaoFormatted, function (err, results) {
				if (err) {
					console.log("Erro ao pegar uma Venda/Restauração de uma região no banco de dados: ", err);
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

export default { cadastrarVendaRestauracao, deletarVendaRestauracao, consultaDeletarVendaRestauracaoRegiao, editarVendaRestauracao, visualizarVendasRestauracoes, visualizarVendasRestauracoesRegiao, visualizarVendaRestauracao, visualizarVendaRestauracaoRegiao, verificarEmpresaEmpregado };
