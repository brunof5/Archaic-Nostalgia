import loginServices from '../services/login.service.js'

async function verificaCampos(req, res){

    const { nomeLogin, senhaLogin } = req.params;

    if (nomeLogin.length > 30) {
        res.send({ mensagem: "O campo Usuário deve conter no máximo 30 caracteres!" });
    } 
    if (senhaLogin.length > 30){
        res.send({ mensagem: "O campo Senha deve conter no máximo 30 caracteres!" });
    }

    else {
        res.send(await loginServices.verificaCampos(req, res));
    }

}

export default{verificaCampos}