import gerenciarVendaRestauracaoServices from '../services/gerenciarVendaRestauracao.service.js'

async function cadastrarVendaRestauracao(req, res) {

    var sessao = req.session

    if(sessao.logado && (sessao.cargo == "admin" || sessao.cargo == "funcionario")) {
        const { inputCPF, inputCompanyState, inputServiceDate, inputServiceHour, inputTotalValue, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputRestorationDescription, inputDelivery, inputQuantity } = req.body;

        const { inputId } = req.params

        // Verifica CPF do Cliente
        if (inputCPF == undefined || inputCPF == null || inputCPF == '') {
            var data = { sucesso: false, mensagem: "O campo CPF não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (inputCPF.length > 11) {
            var data = { sucesso: false, mensagem: "O campo CPF deve conter no máximo 11 caracteres!" }
            var json = [data]
            res.send(JSON.stringify(json))
        } 

        // Verifica Estado da Empresa
        else if (inputCompanyState == undefined || inputCompanyState == null || inputCompanyState == '') {
            var data = { sucesso: false, mensagem: "O campo de Estado da Empresa não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (inputCompanyState != "MG" && inputCompanyState != "SP" && inputCompanyState != "RJ") {
            var data = { sucesso: false, mensagem: "O campo de Estado da Empresa está inválido!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica o ID do Console
        else if (inputId == undefined || inputId == null || inputId == '') {
            var data = { sucesso: false, mensagem: "O campo ID do Console não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (!Number.isInteger(inputId)) {
            var data = { sucesso: false, mensagem: "O campo ID do Console não é um valor inteiro!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica a Data do Serviço
        else if (inputServiceDate == undefined || inputServiceDate == null || inputServiceDate == '') {
            var data = { sucesso: false, mensagem: "O campo Data do Serviço não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica a Hora do Serviço
        else if (inputServiceHour == undefined || inputServiceHour == null || inputServiceHour == '') {
            var data = { sucesso: false, mensagem: "O campo Hora do Serviço não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica o Valor Total
        if (inputTotalValue == undefined || inputTotalValue == null || inputTotalValue == '') {
            var data = { sucesso: false, mensagem: "O campo Valor Total não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (inputTotalValue.length > 10) {
            var data = { sucesso: false, mensagem: "O campo Valor Total deve conter no máximo 10 caracteres!" }
            var json = [data]
            res.send(JSON.stringify(json))
        } 

        else if(inputId == 0){

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
            
            // Verifica Descrição da Restauração
            else if (inputRestorationDescription.length > 100) {
                var data = { sucesso: false, mensagem: "O campo Descrição da Restauração deve conter no máximo 100 caracteres!" }
                var json = [data]
                res.send(JSON.stringify(json))
            } 
    
        }

        // Verifica a Entrega
        else if (inputDelivery == undefined || inputDelivery == null || inputDelivery == '') {
            var data = { sucesso: false, mensagem: "O campo de Entrega não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica Quantidade de Consoles
        else if (inputQuantity == undefined || inputQuantity == null || inputQuantity == '') {
            var data = { sucesso: false, mensagem: "O campo de Quantidade não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (!Number.isInteger(inputQuantity)) {
            var data = { sucesso: false, mensagem: "O campo Quantidade não é um valor inteiro!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        
        else {
            res.send(await gerenciarVendaRestauracaoServices.cadastrarVendaRestauracao(inputId, inputCPF, inputCompanyState, inputServiceDate, inputServiceHour, inputTotalValue, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputRestorationDescription, inputDelivery, inputQuantity, sessao));
        }
    }

    else {
        var data = { sucesso: false, mensagem: "Você não está logado!" }
        var json = [data]
        res.send(JSON.stringify(json))
    }
}

async function deletarVendaRestauracao(req, res) {

    var sessao = req.session

    if(sessao.logado && (sessao.cargo == "admin" || sessao.cargo == "funcionario")) {

        const { inputId } = req.params;

        res.send(await gerenciarVendaRestauracaoServices.deletarVendaRestauracao(inputId, sessao));
    }

    else {
        var data = { sucesso: false, mensagem: "Você não está logado!" }
        var json = [data]
        res.send(JSON.stringify(json))
    }
}

async function editarVendaRestauracao(req, res) {

    var sessao = req.session

    if(sessao.logado && (sessao.cargo == "admin" || sessao.cargo == "funcionario")) {
        const { inputCPF, inputCompanyState, inputServiceDate, inputServiceHour, inputTotalValue, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputRestorationDescription, inputDelivery, inputQuantity } = req.body;

        const { inputId, inputIdVendaRestauracao } = req.params

        // Verifica CPF do Cliente
        if (inputCPF == undefined || inputCPF == null || inputCPF == '') {
            var data = { sucesso: false, mensagem: "O campo CPF não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (inputCPF.length > 11) {
            var data = { sucesso: false, mensagem: "O campo CPF deve conter no máximo 11 caracteres!" }
            var json = [data]
            res.send(JSON.stringify(json))
        } 

        // Verifica Estado da Empresa
        else if (inputCompanyState == undefined || inputCompanyState == null || inputCompanyState == '') {
            var data = { sucesso: false, mensagem: "O campo de Estado da Empresa não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (inputCompanyState != "MG" && inputCompanyState != "SP" && inputCompanyState != "RJ") {
            var data = { sucesso: false, mensagem: "O campo de Estado da Empresa está inválido!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica o ID do Console
        else if (inputId == undefined || inputId == null || inputId == '') {
            var data = { sucesso: false, mensagem: "O campo ID do Console não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (!Number.isInteger(inputId)) {
            var data = { sucesso: false, mensagem: "O campo ID do Console não é um valor inteiro!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica a Data do Serviço
        else if (inputServiceDate == undefined || inputServiceDate == null || inputServiceDate == '') {
            var data = { sucesso: false, mensagem: "O campo Data do Serviço não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica a Hora do Serviço
        else if (inputServiceHour == undefined || inputServiceHour == null || inputServiceHour == '') {
            var data = { sucesso: false, mensagem: "O campo Hora do Serviço não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica o Valor Total
        if (inputTotalValue == undefined || inputTotalValue == null || inputTotalValue == '') {
            var data = { sucesso: false, mensagem: "O campo Valor Total não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (inputTotalValue.length > 10) {
            var data = { sucesso: false, mensagem: "O campo Valor Total deve conter no máximo 10 caracteres!" }
            var json = [data]
            res.send(JSON.stringify(json))
        } 

        else if(inputId == 0){

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
            
            // Verifica Descrição da Restauração
            else if (inputRestorationDescription.length > 100) {
                var data = { sucesso: false, mensagem: "O campo Descrição da Restauração deve conter no máximo 100 caracteres!" }
                var json = [data]
                res.send(JSON.stringify(json))
            } 
    
        }

        // Verifica a Entrega
        else if (inputDelivery == undefined || inputDelivery == null || inputDelivery == '') {
            var data = { sucesso: false, mensagem: "O campo de Entrega não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica Quantidade de Consoles
        else if (inputQuantity == undefined || inputQuantity == null || inputQuantity == '') {
            var data = { sucesso: false, mensagem: "O campo de Quantidade não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (!Number.isInteger(inputQuantity)) {
            var data = { sucesso: false, mensagem: "O campo Quantidade não é um valor inteiro!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica o ID da Venda/Restauração
        else if (inputIdVendaRestauracao == undefined || inputIdVendaRestauracao == null || inputIdVendaRestauracao == '') {
            var data = { sucesso: false, mensagem: "O campo ID Venda/Restauração não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (!Number.isInteger(inputIdVendaRestauracao)) {
            var data = { sucesso: false, mensagem: "O campo ID Venda/Restauração não é um valor inteiro!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        
        else {
            res.send(await gerenciarVendaRestauracaoServices.editarVendaRestauracao(inputId, inputCPF, inputCompanyState, inputServiceDate, inputServiceHour, inputTotalValue, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputRestorationDescription, inputDelivery, inputQuantity, inputIdVendaRestauracao, sessao));
        }
    }

    else {
        var data = { sucesso: false, mensagem: "Você não está logado!" }
        var json = [data]
        res.send(JSON.stringify(json))
    }
}

async function visualizarVendasRestauracoes(req, res) {

    var sessao = req.session

    if(sessao.logado && (sessao.cargo == "admin" || sessao.cargo == "funcionario")) {
        res.send(await gerenciarVendaRestauracaoServices.visualizarVendasRestauracoes(sessao));
    }

    else {
        var data = { sucesso: false, mensagem: "Você não está logado!" }
        var json = [data]
        res.send(JSON.stringify(json))
    }
}

async function visualizarVendaRestauracao(req, res) {

    var sessao = req.session

    if(sessao.logado && (sessao.cargo == "admin" || sessao.cargo == "funcionario")) {

        const { inputId } = req.params

        res.send(await gerenciarVendaRestauracaoServices.visualizarVendaRestauracao(inputId, sessao));
    }

    else {
        var data = { sucesso: false, mensagem: "Você não está logado!" }
        var json = [data]
        res.send(JSON.stringify(json))
    }
}

export default{cadastrarVendaRestauracao, deletarVendaRestauracao, editarVendaRestauracao, visualizarVendasRestauracoes, visualizarVendaRestauracao}