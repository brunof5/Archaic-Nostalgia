import mysql from 'mysql2';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb'
});

async function verificaCampos(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription) {
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

            } else {
              console.log("Cadastro feito por um funcionário!", resultEmpregado);
              const data = { sucesso: true, mensagem: "true" };
              const json = [data];
              
              inserirConsoleNoBancoDeDados(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription)
                .then(() => resolve(JSON.stringify(json)))
                .catch((error) => reject(error));

            } 
          }
          connection.release();
        });
      }
    });
  });
}

function inserirConsoleNoBancoDeDados(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription) {
  const sql = "INSERT INTO console VALUES (?, ?, ?, ?, ?, ?, ?);";
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

export default { verificaCampos };
