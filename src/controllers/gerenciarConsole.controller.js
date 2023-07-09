import gerenciarConsoleServices from '../services/gerenciarConsole.service.js'

async function cadastrarConsole(req, res) {

    var sessao = req.session

    if(sessao.logado && (sessao.cargo == "admin" || sessao.cargo == "funcionario")) {
        const { inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany } = req.body;
    
        // Verifica Modelo
        if (inputModel == undefined || inputModel == null || inputModel == '') {
            var data = { sucesso: false, mensagem: "O campo Modelo não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (inputModel.length > 30) {
            var data = { sucesso: false, mensagem: "O campo Modelo deve conter no máximo 30 caracteres!" }
            var json = [data]
            res.send(JSON.stringify(json))
        } 
    
        // Verifica Fabricante
        else if (inputProducer == undefined || inputProducer == null || inputProducer == '') {
            var data = { sucesso: false, mensagem: "O campo Fabricante não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (inputProducer.length > 50) {
            var data = { sucesso: false, mensagem: "O campo Fabricante deve conter no máximo 50 caracteres!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
    
        // Verifica Data de Lançamento
        else if (inputLaunchDate == undefined || inputLaunchDate == null || inputLaunchDate == '') {
            var data = { sucesso: false, mensagem: "O campo Data de Lançamento não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
    
        // Verifica Preço
        else if (inputPrice == undefined || inputPrice == null || inputPrice == '') {
            var data = { sucesso: false, mensagem: "O campo Preço não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (inputPrice.length > 10) {
            var data = { sucesso: false, mensagem: "O campo Preço deve conter no máximo 10 caracteres!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        
        // Verifica Descrição do Console
        else if (inputConsoleDescription.length > 100) {
            var data = { sucesso: false, mensagem: "O campo Descrição do Console deve conter no máximo 100 caracteres!" }
            var json = [data]
            res.send(JSON.stringify(json))
        } 
    
        // Verifica Quantidade de Consoles
        else if (inputQuantity == undefined || inputQuantity == null || inputQuantity == '') {
            var data = { sucesso: false, mensagem: "O campo de Quantidade não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
    
        // Verifica Empresa do Estoque
        else if (inputCompany == undefined || inputCompany == null || inputCompany == '') {
            var data = { sucesso: false, mensagem: "O campo de Empresa do Estoque não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (inputCompany != "MG" && inputCompany != "SP" && inputCompany != "RJ") {
            var data = { sucesso: false, mensagem: "O campo de Empresa do Estoque está inválido!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
    
        else {
            res.send(await gerenciarConsoleServices.cadastrarConsole(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany));
        }
    }

    else {
        var data = { sucesso: false, mensagem: "Você não está logado!" }
        var json = [data]
        res.send(JSON.stringify(json))
    }
}

async function deletarConsole(req, res){

    const { inputConsoleId } = req.body;
    res.send(await gerenciarConsoleServices.deletarConsole( inputConsoleId ));

}

async function editarConsole(req, res){

    const { inputConsoleId, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany  } = req.body;

    // Verifica Modelo
    if (inputModel == undefined || inputModel == null || inputModel == '') {
        var data = { sucesso: false, mensagem: "O campo Modelo não pode ser vazio!"  }
        var json = [data]
        res.send(JSON.stringify(json))
    }
    else if (inputModel.length > 30) {
        var data = { sucesso: false, mensagem: "O campo Modelo deve conter no máximo 30 caracteres!"  }
        var json = [data]
        res.send(JSON.stringify(json))
    } 

    // Verifica Fabricante
    else if (inputProducer == undefined || inputProducer == null || inputProducer == '') {
        var data = { sucesso: false, mensagem: "O campo Fabricante não pode ser vazio!"  }
        var json = [data]
        res.send(JSON.stringify(json))
    }
    else if (inputProducer.length > 50){
        var data = { sucesso: false, mensagem: "O campo Fabricante deve conter no máximo 50 caracteres!"  }
        var json = [data]
        res.send(JSON.stringify(json))
    }

    // Verifica Data de Lançamento
    else if (inputLaunchDate == undefined || inputLaunchDate == null || inputLaunchDate == '') {
        var data = { sucesso: false, mensagem: "O campo Data de Lançamento não pode ser vazio!"  }
        var json = [data]
        res.send(JSON.stringify(json))
    }

    // Verifica Originalidade
    else if (inputOriginality == undefined || inputOriginality == null || inputOriginality == '') {
        var data = { sucesso: false, mensagem: "O campo de Originalidade não pode ser vazio!"  }
        var json = [data]
        res.send(JSON.stringify(json))
    }

    // Verifica Preço
    else if (inputPrice == undefined || inputPrice == null || inputPrice == '') {
        var data = { sucesso: false, mensagem: "O campo Preço não pode ser vazio!"  }
        var json = [data]
        res.send(JSON.stringify(json))
    }
    else if (inputPrice.length > 10) {
        var data = { sucesso: false, mensagem: "O campo Preço deve conter no máximo 10 caracteres!"  }
        var json = [data]
        res.send(JSON.stringify(json))
    }
    
    // Verifica Descrição do Console
    else if (inputConsoleDescription.length > 50) {
        var data = { sucesso: false, mensagem: "O campo Descrição do Console deve conter no máximo 50 caracteres!"  }
        var json = [data]
        res.send(JSON.stringify(json))
    }
    
    // Verifica Quantidade de Consoles
     else if (inputQuantity == undefined || inputQuantity == null || inputQuantity == '') {
        var data = { sucesso: false, mensagem: "O campo de Quantidade não pode ser vazio!"  }
        var json = [data]
        res.send(JSON.stringify(json))
    }

    // Verifica Empresa do Estoque
    else if (inputCompany == undefined || inputCompany == null || inputCompany == '') {
        var data = { sucesso: false, mensagem: "O campo de Empresa do Estoque não pode ser vazio!"  }
        var json = [data]
        res.send(JSON.stringify(json))
    }

    else {
        res.send(await gerenciarConsoleServices.editarConsole(inputConsoleId, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany));
    }

}

async function visualizarConsoles(req, res) {

    var sessao = req.session

    if(sessao.logado && (sessao.cargo == "admin" || sessao.cargo == "funcionario")) {
        res.send(await gerenciarConsoleServices.visualizarConsoles());
    }
}

export default{cadastrarConsole, deletarConsole, editarConsole, visualizarConsoles}