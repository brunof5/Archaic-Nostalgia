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

  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log("Erro GET CONNECTION: ", err);
        reject(err);
      }

      // Selecionar idCliente pelo cpfCliente
      connection.query(sqlSelecionarIdCliente, [dados.inputCPF], function (err, resultCliente) {
        if (err) {
          console.log("Erro ao selecionar o id do Cliente no banco de dados: ", err);
          reject(err);
        }

        if (resultCliente.length === 0) {
          var data = { sucesso: false, mensagem: "Cliente não encontrado." };
          var json = [data];
          resolve(JSON.stringify(json));
          connection.release();
          return;
        }
        idCliente = resultCliente[0].idCliente;

        // Selecionar idEmpresa pelo estadoEmpresa
        connection.query(sqlSelecionarIdEmpresa, [dados.inputEstado], function (err, resultEmpresa) {
          if (err) {
            console.log("Erro ao selecionar o id da Empresa no banco de dados: ", err);
            reject(err);
          }

          if (resultEmpresa.length === 0) {
            var data = { sucesso: false, mensagem: "Empresa não encontrada." };
            var json = [data];
            resolve(JSON.stringify(json));
            connection.release();
            return;
          }
          idEmpresa = resultEmpresa[0].idEmpresa;

          // Verificar se é uma venda
          if (dados.inputEhVenda) {
            // Selecionar quantAtual pelo idConsole e idEmpresa
            connection.query(sqlSelecionarQuantAtual, [dados.inputIdConsole, idEmpresa], function (err, resultQuantAtual) {
              if (err) {
                console.log("Erro ao selecionar a quantidade atual do estoque no banco de dados: ", err);
                reject(err);
              }

              if (resultQuantAtual.length === 0) {
                var data = { sucesso: false, mensagem: "Estoque não encontrado." };
                var json = [data];
                resolve(JSON.stringify(json));
                connection.release();
                return;
              }
              let quantAtual = resultQuantAtual[0].quantAtual;

              // Verificar se há quantidade suficiente no estoque
              if (quantAtual < dados.inputQtdeConsoles) {
                var data = { sucesso: false, mensagem: "Não há quantidade suficiente no estoque." };
                var json = [data];
                resolve(JSON.stringify(json));
                connection.release();
                return;
              }

              // Atualizar o estoque
              connection.query(sqlAtualizarEstoque, [dados.inputQtdeConsoles, dados.inputIdConsole, idEmpresa], function (err, resultAtualizacaoEstoque) {
                if (err) {
                  console.log("Erro ao atualizar o estoque no banco de dados: ", err);
                  reject(err);
                }
              });

              // Deletar o estoque se a quantidade atual for zero
              if ((quantAtual - dados.inputQtdeConsoles) === 0) {
                connection.query(sqlDeletarEstoque, [dados.inputIdConsole, idEmpresa], function (err, resultDeletarEstoque) {
                  if (err) {
                    console.log("Erro ao deletar o estoque no banco de dados: ", err);
                    reject(err);
                  }
                });
              }
            });
          }

          // Cadastrar na tabela Console
          connection.query(sqlCadastroTabelaConsole,
            [
              dados.inputNomeConsole,
              dados.inputMarca,
              dados.inputModelo,
              dados.inputCor,
              dados.inputNumeroSerie,
              dados.inputAnoLancamento
            ],
            function (err, resultCadastroTabelaConsole) {
              if (err) {
                console.log("Erro ao cadastrar na tabela Console no banco de dados: ", err);
                reject(err);
              }

              // Inserir Venda/Restauração
              connection.query(sqlInserirVendaRestauracao,
                [
                  dados.inputEhVenda,
                  dados.inputDataVenda,
                  dados.inputValorTotal,
                  dados.inputDesconto,
                  dados.inputEstaEntregue,
                  dados.inputDataEntrega,
                  resultCadastroTabelaConsole.insertId,
                  idCliente,
                  idEmpresa,
                  dados.inputQtdeConsoles
                ],
                function (err, resultInserirVendaRestauracao) {
                  if (err) {
                    console.log("Erro ao inserir a Venda/Restauração no banco de dados: ", err);
                    reject(err);
                  }

                  console.log("Venda/Restauração cadastrada com sucesso! Id da Venda/Restauração: " + resultInserirVendaRestauracao.insertId);

                  var data = { sucesso: true, mensagem: "Cadastro feito com sucesso!" };
                  var json = [data];
                  resolve(JSON.stringify(json));
                  connection.release();
                });
            });
        });
      });
    });
  });
}

// Deleta Venda/Restauração no Banco de Dados, pelo id
async function deletarVendaRestauracao(inputId) {

	const sqlVerificarVenda = "SELECT estaEntregue, ehVenda, qtdeConsoles, FK_idConsole, FK_idEmpresa FROM venda_restauracao WHERE idVenda_Restauracao = ?;";
	const sqlAtualizarEstoque = "UPDATE estoque SET quantAtual = quantAtual + ? WHERE FK_idConsole = ? AND FK_idEmpresa = ?;";
	const sqlDeletarVendaRestauracao = "DELETE FROM venda_restauracao WHERE idVenda_Restauracao = ?;";
  
	const paramsId = [inputId];
  
	const sqlVerificarVendaFormatted = mysql.format(sqlVerificarVenda, paramsId);
	const sqlDeletarVendaRestauracaoFormatted = mysql.format(sqlDeletarVendaRestauracao, paramsId);
  
	return new Promise(function (resolve, reject) {
	  pool.getConnection(function (err, connection) {
		if (err) {
		  console.log("Erro GET CONNECTION: ", err);
		  reject(err);
		}
  
		// Verificar se o serviço é uma venda
		connection.query(sqlVerificarVendaFormatted, function (err, resultVenda) {
		  if (err) {
			console.log("Erro ao verificar se a Venda/Restauração é uma venda no banco de dados: ", err);
			reject(err);
		  }
  
		  const estaEntregue = resultVenda[0].estaEntregue;
  
		  if (estaEntregue) {
			var data = { sucesso: false, mensagem: "Não é possível deletar a Venda/Restauração pois já está entregue." };
			var json = [data];
			resolve(JSON.stringify(json));
			connection.release();
			return;
		  }
  
		  const ehVenda = resultVenda[0].ehVenda;
		  const qtdeConsoles = resultVenda[0].qtdeConsoles;
		  const idConsole = resultVenda[0].FK_idConsole;
		  const idEmpresa = resultVenda[0].FK_idEmpresa;
  
		  if (ehVenda) {
			// Atualizar o estoque
			connection.query(sqlAtualizarEstoque, [qtdeConsoles, idConsole, idEmpresa], function (err, resultAtualizacaoEstoque) {
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

  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log("Erro GET CONNECTION: ", err);
        reject(err);
      }

      // Selecionar idCliente pelo cpfCliente
      connection.query(sqlSelecionarIdCliente, [inputCPF], function (err, resultCliente) {
        if (err) {
          console.log("Erro ao selecionar o id do Cliente no banco de dados: ", err);
          reject(err);
        }

        if (resultCliente.length === 0) {
          var data = { sucesso: false, mensagem: "Cliente não encontrado." };
          var json = [data];
          resolve(JSON.stringify(json));
          connection.release();
          return;
        }
        idCliente = resultCliente[0].idCliente;

        // Selecionar idEmpresa pelo estadoEmpresa
        connection.query(sqlSelecionarIdEmpresa, [inputCompanyState], function (err, resultEmpresa) {
          if (err) {
            console.log("Erro ao selecionar o id da Empresa no banco de dados: ", err);
            reject(err);
          }

          if (resultEmpresa.length === 0) {
            var data = { sucesso: false, mensagem: "Empresa não encontrada." };
            var json = [data];
            resolve(JSON.stringify(json));
            connection.release();
            return;
          }
          idEmpresa = resultEmpresa[0].idEmpresa;

          if (dados.ehVenda) {
            // Verificar a quantidade atual no estoque
            connection.query(sqlSelecionarQuantAtual, [inputId, idEmpresa], function (err, resultQuantAtual) {
              if (err) {
                console.log("Erro ao selecionar a quantidade atual do estoque no banco de dados: ", err);
                reject(err);
              }

              const quantAtual = resultQuantAtual.length > 0 ? resultQuantAtual[0].quantAtual : 0;

              if (quantAtual < inputQuantity) {
                var data = { sucesso: false, mensagem: "A empresa não possui quantidade de consoles suficiente para a venda!" };
                var json = [data];
                resolve(JSON.stringify(json));
                connection.release();
                return;
              }

              // Atualizar o estoque
              connection.query(sqlAtualizarEstoque, [inputQuantity, inputId, idEmpresa], function (err, resultAtualizacaoEstoque) {
                if (err) {
                  console.log("Erro ao atualizar o estoque no banco de dados: ", err);
                  reject(err);
                }
              });

              if (quantAtual - inputQuantity === 0) {
                // Deletar estoque se quantidade atual for zero
                connection.query(sqlDeletarEstoque, [inputId, idEmpresa], function (err, resultDeletarEstoque) {
                  if (err) {
                    console.log("Erro ao deletar o estoque no banco de dados: ", err);
                    reject(err);
                  }
                });
              }
            });
          } else {
            try {
              // Cadastra um Console sem Estoque
              connection.query(sqlEditarTabelaConsole, [inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputId], function (err, resultEditarTabelaConsole) {
                if (err) {
                  console.log("Erro ao editar na tabela Console no banco de dados: ", err);
                  reject(err);
                }

                // Insira os dados na tabela venda_restauracao para uma restauração
                connection.query(sqlEditarVendaRestauracao, [inputServiceDate, inputServiceHour, inputTotalValue, false, inputDelivery, inputQuantity, inputRestorationDescription, idEmpresa, idCliente, inputId, inputIdVendaRestauracao], function (err, resultEditarVendaRestauracao) {
                  if (err) {
                    console.log("Erro ao editar a Venda/Restauração no banco de dados: ", err);
                    reject(err);
                  }

                  var data = { sucesso: true, mensagem: "Restauração atualizada com sucesso!" };
                  var json = [data];
                  resolve(JSON.stringify(json));
                  connection.release();
                });
              });
            } catch (error) {
              var data = { sucesso: false, mensagem: "Erro ao atualizar uma Restauração." };
              var json = [data];
              resolve(JSON.stringify(json));
              connection.release();
            }
          }

          try {
            // Insira os dados na tabela venda_restauracao para uma venda
            connection.query(sqlEditarVendaRestauracao, [inputServiceDate, inputServiceHour, inputTotalValue, true, inputDelivery, inputQuantity, inputRestorationDescription, idEmpresa, idCliente, inputId, inputIdVendaRestauracao], function (err, resultEditarVendaRestauracao) {
              if (err) {
                console.log("Erro ao editar a Venda/Restauração no banco de dados: ", err);
                reject(err);
              }

              var data = { sucesso: true, mensagem: "Venda atualizada com sucesso!" };
              var json = [data];
              resolve(JSON.stringify(json));
              connection.release();
            });
          } catch (error) {
            var data = { sucesso: false, mensagem: "Erro ao atualizar uma Venda." };
            var json = [data];
            resolve(JSON.stringify(json));
            connection.release();
          }
        });
      });
    });
  });
}

// Visualizar Vendas/Restaurações no Banco de Dados
async function visualizarVendasRestauracoes() {

	var sqlGetTodosServicos = "SELECT V.*, C.nomeCliente, E.nomeEmpresa\
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
			connection.query(sqlGetTodosServicos, function (err, results) {
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

	var sqlGetTodosServicosRegiao = "SELECT V.*, C.nomeCliente, E.nomeEmpresa\
	FROM venda_restauracao AS V\
	JOIN cliente AS C ON V.FK_idCliente = C.idCliente\
	JOIN empresa AS E ON V.FK_idEmpresa = E.idEmpresa\
	JOIN empregado AS Em ON V.FK_idEmpresa = Em.FK_idEmpresa\
	WHERE Em.nomeLoginEmpregado = ?\
	ORDER BY V.idVenda_Restauracao;"

	const paramsGetTodosServicosRegiao = [inputUser]
	const sqlGetTodosServicosRegiaoFormatted = mysql.format(sqlGetTodosServicosRegiao, paramsGetTodosServicosRegiao);

	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log("Erro GET CONNECTION: ", err);
        		reject(err);
			}
			connection.query(sqlGetTodosServicosRegiaoFormatted, function (err, results) {
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

	var sqlGetUmServico = "SELECT V.*, C.nomeCliente, C.cpfCliente, E.nomeEmpresa, Cl.nomeConsole, Cl.nomeFabricante, Cl.dataLancamento, Cl.ehOriginal\
	FROM venda_restauracao AS V\
	JOIN cliente AS C ON V.FK_idCliente = C.idCliente\
	JOIN empresa AS E ON V.FK_idEmpresa = E.idEmpresa\
	JOIN console AS Cl ON V.FK_idConsole = Cl.idConsole\
	WHERE V.idVenda_Restauracao = ?\
	ORDER BY V.idVenda_Restauracao;"

	const paramsGetUmServico = [inputId]
	const sqlGetUmServicoFormatted = mysql.format(sqlGetUmServico, paramsGetUmServico);

	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log("Erro GET CONNECTION: ", err);
        		reject(err);
			}
			connection.query(sqlGetUmServicoFormatted, function (err, results) {
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

	var sqlGetUmServicoRegiao = "SELECT V.*, C.nomeCliente, C.cpfCliente, E.nomeEmpresa, Cl.nomeConsole, Cl.nomeFabricante, Cl.dataLancamento, Cl.ehOriginal\
	FROM venda_restauracao AS V\
	JOIN cliente AS C ON V.FK_idCliente = C.idCliente\
	JOIN empresa AS E ON V.FK_idEmpresa = E.idEmpresa\
	JOIN empregado AS Em ON V.FK_idEmpresa = Em.FK_idEmpresa\
	JOIN console AS Cl ON V.FK_idConsole = Cl.idConsole\
	WHERE V.idVenda_Restauracao = ? AND Em.nomeLoginEmpregado = ?\
	ORDER BY V.idVenda_Restauracao;"

	const paramsGetUmServicoRegiao = [inputId, inputUser]
	const sqlGetUmServicoRegiaoFormatted = mysql.format(sqlGetUmServicoRegiao, paramsGetUmServicoRegiao);

	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log("Erro GET CONNECTION: ", err);
        		reject(err);
			}
			connection.query(sqlGetUmServicoRegiaoFormatted, function (err, results) {
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
