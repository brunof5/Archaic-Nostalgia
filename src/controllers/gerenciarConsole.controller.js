import gerenciarConsoleServices from '../services/gerenciarConsole.service.js'

async function verificaCampos(req, res){

    const { inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription  } = req.body;

    // Verifica Modelo
    if (inputModel == undefined || inputModel == null || inputModel == '') {
        res.send({ mensagem: "O campo Modelo não pode ser vazio!" })
    }
    else if (inputModel.length > 30) {
        res.send({ mensagem: "O campo Modelo deve conter no máximo 30 caracteres!" });
    } 

    // Verifica Fabricante
    else if (inputProducer == undefined || inputProducer == null || inputProducer == '') {
        res.send({ mensagem: "O campo Fabricante não pode ser vazio!" })
    }
    else if (inputProducer.length > 50){
        res.send({ mensagem: "O campo Fabricante deve conter no máximo 50 caracteres!" });
    }

    // Verifica Data de Lançamento
    else if (inputLaunchDate == undefined || inputLaunchDate == null || inputLaunchDate == '') {
        res.send({ mensagem: "O campo Data de Lançamento não pode ser vazio!" })
    }

    // Verifica Originalidade
    else if (inputOriginality == undefined || inputOriginality == null || inputOriginality == '') {
        res.send({ mensagem: "O campo de Originalidade não pode ser vazio!" })
    }

    // Verifica Preço
    else if (inputPrice == undefined || inputPrice == null || inputPrice == '') {
        res.send({ mensagem: "O campo Preço não pode ser vazio!" })
    }
    else if (inputPrice.length > 10) {
        res.send({ mensagem: "O campo Preço deve conter no máximo 10 caracteres!" });
    }
    
    // Verifica Descrição do Console
    else if (inputConsoleDescription.length > 50) {
        res.send({ mensagem: "O campo Descrição do Console deve conter no máximo 50 caracteres!" });
    } 


    else {
        res.send(await gerenciarConsoleServices.verificaCampos(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription));
    }

}

export default{verificaCampos}