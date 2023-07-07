import mysql from 'mysql2';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb'
});

// Insere Console no Banco de Dados

async function cadastrarConsole(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription) {
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
              console.log("Cadastro feito por um admin!");
              const data = { sucesso: true, mensagem: "true" };
              const json = [data];
              
              inserirConsoleNoBancoDeDados(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription)
                .then(() => resolve(JSON.stringify(json)))
                .catch((error) => reject(error));

            } else if (resultEmpregado[0].cargo !== "Gerente") {
              console.log("Cadastro feito por um funcionário!", resultEmpregado);
              const data = { sucesso: true, mensagem: "true" };
              const json = [data];
              
              inserirConsoleNoBancoDeDados(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription)
                .then(() => resolve(JSON.stringify(json)))
                .catch((error) => reject(error));

            } else {

                console.log("Cadastro não realizado. Empregado não identificado!", resultEmpregado);
                const data = { sucesso: true, mensagem: "false" };
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

function inserirConsoleNoBancoDeDados(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription) {
  const sql = "INSERT INTO console VALUES (?, ?, ?, ?, b?, ?, ?);";
  const params = [null, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription];
  const sqlFormatted = mysql.format(sql, params);

  return new Promise(function (resolve, reject) {
    pool.query(sqlFormatted, function (err, result) {
      if (err) {
        console.log("Erro ao inserir no banco de dados: ", err);
        reject(err);
      } else {
        console.log("Console inserido no banco de dados com sucesso!");
        resolve(result);
      }
    });
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
                const data = { sucesso: true, mensagem: "false" };
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

async function editarConsole( inputConsoleId, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription ) {
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

            } else if (resultEmpregado[0].cargo !== "Gerente") {
              console.log("Alteração feita por um funcionário!", resultEmpregado);
              const data = { sucesso: true, mensagem: "true" };
              const json = [data];
              
              editarConsoleNoBancoDeDados(inputConsoleId, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription)
                .then(() => resolve(JSON.stringify(json)))
                .catch((error) => reject(error));

            } else {

                console.log("Alteração não realizada. Empregado não identificado!", resultEmpregado);
                const data = { sucesso: true, mensagem: "false" };
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
  const sql = "UPDATE console SET idConsole = ?, nomeConsole = ?, nomeFabricante = ?, dataLancamento = ?, ehOriginal = ?, preco = ?, descricaoConsole = ? WHERE idConsole = ?;";
  const params = [ inputConsoleId, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription ];
  const sqlFormatted = mysql.format(sql, params);

  return new Promise(function (resolve, reject) {
    pool.query(sqlFormatted, function (err, result) {
      if (err) {
        console.log("Erro ao alterar no banco de dados. Id não encontrado! ", err);
        reject(err);
      } else {
        console.log("Console alterado no banco de dados com sucesso!");
        resolve(result);
      }
    });
  });
}

export default { cadastrarConsole, deletarConsole, editarConsole };
