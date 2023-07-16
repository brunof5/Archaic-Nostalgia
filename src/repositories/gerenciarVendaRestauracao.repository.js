import mysql from 'mysql2';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb'
});

// Insere Venda/Restauração no Banco de Dados
async function cadastrarVendaRestauracao(dados) {
	
	const sqlSelecionarIdCliente = "SELECT idCliente FROM cliente WHERE cpfCliente = ?;";
	const sqlSelecionarIdEmpresa = "SELECT idEmpresa FROM empresa WHERE estado = ?;";
	const sqlSelecionarQuantAtual = "SELECT quantAtual FROM estoque WHERE FK_idConsole = ? AND FK_idEmpresa = ?;";
	const sqlAtualizarEstoque = "UPDATE estoque SET quantAtual = quantAtual - ? WHERE FK_idConsole = ? AND FK_idEmpresa = ?;";
	const sqlDeletarEstoque = "DELETE FROM estoque WHERE FK_idConsole = ? AND FK_idEmpresa = ?;";
	const sqlCadastroTabelaConsole = "INSERT INTO console VALUES (NULL, ?, ?, ?, ?, ?, ?);"
	const sqlInserirVendaRestauracao = "INSERT INTO venda_restauracao VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?);";
  
	let idCliente, idEmpresa
  
	// Selecionar idCliente pelo cpfCliente
	const resultCliente = await pool.query(sqlSelecionarIdCliente, [dados.inputCPF]);
	console.log(resultCliente)
	if (resultCliente.length === 0) {
	  return { sucesso: false, mensagem: "Cliente não encontrado." };
	}
	idCliente = resultCliente[0].idCliente;
  
	// Selecionar idEmpresa pelo estadoEmpresa
	const resultEmpresa = await pool.query(sqlSelecionarIdEmpresa, [dados.inputCompanyState]);
	if (resultEmpresa.length === 0) {
	  return { sucesso: false, mensagem: "Empresa não encontrada." };
	}
	idEmpresa = resultEmpresa[0].idEmpresa;
  
	if (dados.ehVenda) {
	  // Verificar a quantidade atual no estoque
	  const resultQuantAtual = await pool.query(sqlSelecionarQuantAtual, [dados.inputId, idEmpresa]);
	  const quantAtual = resultQuantAtual.length > 0 ? resultQuantAtual[0].quantAtual : 0;
  
	  if (quantAtual < dados.inputQuantity) {
		return { sucesso: false, mensagem: "A empresa não possui quantidade de consoles suficiente para a venda!" };
	  }
  
	  // Atualizar o estoque
	  await pool.query(sqlAtualizarEstoque, [dados.inputQuantity, dados.inputId, idEmpresa]);
  
	  if (quantAtual - dados.inputQuantity === 0) {
		// Deletar estoque se quantidade atual for zero
		await pool.query(sqlDeletarEstoque, [dados.inputId, idEmpresa]);
	  }

	} else {
		try {
			// Cadastra um Console sem Estoque
			await pool.query(sqlCadastroTabelaConsole, [dados.inputModel, dados.inputProducer, dados.inputLaunchDate, dados.inputOriginality, dados.inputPrice, dados.inputConsoleDescription]);

			// Insira os dados na tabela venda_restauracao para uma restauração
			await pool.query(sqlInserirVendaRestauracao, [dados.inputServiceDate, dados.inputServiceHour, dados.inputTotalValue, false, dados.inputDelivery, dados.inputQuantity, dados.inputRestorationDescription, idEmpresa, idCliente, dados.inputId]);

			return { sucesso: true, mensagem: "Restauração cadastrada com sucesso!" };
		} catch (error) {
			return { sucesso: false, mensagem: "Erro ao cadastrar uma Restauração." };
		}
	}

	try {
		// Insira os dados na tabela venda_restauracao para uma venda
		await pool.query(sqlInserirVendaRestauracao, [dados.inputServiceDate, dados.inputServiceHour, dados.inputTotalValue, true, dados.inputDelivery, dados.inputQuantity, dados.inputRestorationDescription, idEmpresa, idCliente, dados.inputId]);
  
		return { sucesso: true, mensagem: "Venda cadastrada com sucesso!" };
	} catch (error) {
		return { sucesso: false, mensagem: "Erro ao cadastrar uma Venda." };
	}
  
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
async function editarVendaRestauracao(inputId, inputCPF, inputCompanyState, inputServiceDate, inputServiceHour, inputTotalValue, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputRestorationDescription, inputDelivery, inputQuantity, inputIdVendaRestauracao) {

	const sqlSelecionarIdCliente = "SELECT idCliente FROM cliente WHERE cpfCliente = ?;";
	const sqlSelecionarIdEmpresa = "SELECT idEmpresa FROM empresa WHERE estado = ?;";
	const sqlSelecionarQuantAtual = "SELECT quantAtual FROM estoque WHERE FK_idConsole = ? AND FK_idEmpresa = ?;";
	const sqlAtualizarEstoque = "UPDATE estoque SET quantAtual = quantAtual - ? WHERE FK_idConsole = ? AND FK_idEmpresa = ?;";
	const sqlDeletarEstoque = "DELETE FROM estoque WHERE FK_idConsole = ? AND FK_idEmpresa = ?;";
	const sqlEditarTabelaConsole = "UPDATE console SET nomeConsole = ?, nomeFabricante = ?, dataLancamento = ?, ehOriginal = ?, preco = ?, descricaoConsole = ? WHERE idConsole = ?;"
	const sqlEditarVendaRestauracao = "UPDATE venda_restauracao SET dataServico = ?, horaServico = ?, valorTotal = ?, ehVenda = ?, estaEntregue = ?, qtdeConsoles = ?, descricaoRestauracao = ?, avaliacao = NULL, FK_idEmpresa = ?, FK_idCliente = ?, FK_idConsole = ? WHERE idVenda_Restauracao = ?;"; 
  
	let idCliente, idEmpresa
  
	// Selecionar idCliente pelo cpfCliente
	const resultCliente = await pool.query(sqlSelecionarIdCliente, [inputCPF]);
	if (resultCliente.length === 0) {
	  return { sucesso: false, mensagem: "Cliente não encontrado." };
	}
	idCliente = resultCliente[0].idCliente;
  
	// Selecionar idEmpresa pelo estadoEmpresa
	const resultEmpresa = await pool.query(sqlSelecionarIdEmpresa, [inputCompanyState]);
	if (resultEmpresa.length === 0) {
	  return { sucesso: false, mensagem: "Empresa não encontrada." };
	}
	idEmpresa = resultEmpresa[0].idEmpresa;
  
	if (dados.ehVenda) {
	  // Verificar a quantidade atual no estoque
	  const resultQuantAtual = await pool.query(sqlSelecionarQuantAtual, [inputId, idEmpresa]);
	  const quantAtual = resultQuantAtual.length > 0 ? resultQuantAtual[0].quantAtual : 0;
  
	  if (quantAtual < inputQuantity) {
		return { sucesso: false, mensagem: "A empresa não possui quantidade de consoles suficiente para a venda!" };
	  }
  
	  // Atualizar o estoque
	  await pool.query(sqlAtualizarEstoque, [inputQuantity, inputId, idEmpresa]);
  
	  if (quantAtual - inputQuantity === 0) {
		// Deletar estoque se quantidade atual for zero
		await pool.query(sqlDeletarEstoque, [inputId, idEmpresa]);
	  }

	} else {
		try {
			// Cadastra um Console sem Estoque
			await pool.query(sqlEditarTabelaConsole, [inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputId]);

			// Insira os dados na tabela venda_restauracao para uma restauração
			await pool.query(sqlEditarVendaRestauracao, [inputServiceDate, inputServiceHour, inputTotalValue, false, inputDelivery, inputQuantity, inputRestorationDescription, idEmpresa, idCliente, inputId, inputIdVendaRestauracao]);

			return { sucesso: true, mensagem: "Restauração atualizada com sucesso!" };
		} catch (error) {
			return { sucesso: false, mensagem: "Erro ao atualizar uma Restauração." };
		}
	}

	try {
		// Insira os dados na tabela venda_restauracao para uma venda
		await pool.query(sqlEditarVendaRestauracao, [inputServiceDate, inputServiceHour, inputTotalValue, true, inputDelivery, inputQuantity, inputRestorationDescription, idEmpresa, idCliente, inputId, inputIdVendaRestauracao]);
  
		return { sucesso: true, mensagem: "Venda atualizada com sucesso!" };
	} catch (error) {
		return { sucesso: false, mensagem: "Erro ao atualizar uma Venda." };
	}

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
