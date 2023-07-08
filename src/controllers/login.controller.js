import loginServices from '../services/login.service.js'

async function verificaCampos(req, res){

    const { inputUser, inputPassword } = req.body;

    if (inputUser == undefined || inputUser == null || inputUser == '') {
        var data = { sucesso: false, mensagem: "O campo Usuário não pode ser vazio!"  }
        var json = [data]
        res.send(JSON.stringify(json))
    }
    else if (inputUser.length > 30) {
        var data = { sucesso: false, mensagem: "O campo Usuário deve conter no máximo 30 caracteres!"  }
        var json = [data]
        res.send(JSON.stringify(json))
    } 
    else if (inputPassword == undefined || inputPassword == null || inputPassword == '') {
        var data = { sucesso: false, mensagem: "O campo Senha não pode ser vazio!"  }
        var json = [data]
        res.send(JSON.stringify(json))
    }
    else if (inputPassword.length > 30){
        var data = { sucesso: false, mensagem: "O campo Senha deve conter no máximo 30 caracteres!"  }
        var json = [data]
        res.send(JSON.stringify(json))
    }

    else {
        res.send(await loginServices.verificaCampos(inputUser, inputPassword));
    }

}

export default{verificaCampos}