import loginServices from '../services/login.service.js'

async function verificaCampos(req, res){

    const { inputUser, inputPassword } = req.body;

    if (inputUser == undefined || inputUser == null || inputUser == '') {
        res.send({ mensagem: "O campo Usuário não pode ser vazio!" })
    }
    else if (inputUser.length > 30) {
        res.send({ mensagem: "O campo Usuário deve conter no máximo 30 caracteres!" });
    } 
    else if (inputPassword == undefined || inputPassword == null || inputPassword == '') {
        res.send({ mensagem: "O campo Senha não pode ser vazio!" })
    }
    else if (inputPassword.length > 30){
        res.send({ mensagem: "O campo Senha deve conter no máximo 30 caracteres!" });
    }

    else {
        res.send(await loginServices.verificaCampos(inputUser, inputPassword));
    }

}

export default{verificaCampos}