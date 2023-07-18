import gerenciarVendaRestauracaoServices from '../services/gerenciarVendaRestauracao.service.js'

async function cadastrarVendaRestauracao(req, res) {

    var sessao = req.session

    if(sessao.logado && (sessao.cargo == "admin" || sessao.cargo == "funcionario")) {

        const dados = req.body

        console.log(dados)

        // Verifica CPF do Cliente
        if (dados.inputCPF == undefined || dados.inputCPF == null || dados.inputCPF == '') {
            var data = { sucesso: false, mensagem: "O campo CPF não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (dados.inputCPF.length > 11) {
            var data = { sucesso: false, mensagem: "O campo CPF deve conter no máximo 11 caracteres!" }
            var json = [data]
            res.send(JSON.stringify(json))
        } 

        // Verifica Estado da Empresa
        else if (dados.inputCompanyState == undefined || dados.inputCompanyState == null || dados.inputCompanyState == '') {
            var data = { sucesso: false, mensagem: "O campo de Estado da Empresa não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (dados.inputCompanyState != "MG" && dados.inputCompanyState != "SP" && dados.inputCompanyState != "RJ") {
            var data = { sucesso: false, mensagem: "O campo de Estado da Empresa está inválido!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica o ID do Console
        else if (dados.inputIdConsole == undefined || dados.inputIdConsole == null || dados.inputIdConsole == '') {
            var data = { sucesso: false, mensagem: "O campo ID do Console não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (!Number.isInteger(parseInt(dados.inputIdConsole))) {
            var data = { sucesso: false, mensagem: "O campo ID do Console não é um valor inteiro!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica a Data do Serviço
        else if (dados.inputServiceDate == undefined || dados.inputServiceDate == null || dados.inputServiceDate == '') {
            var data = { sucesso: false, mensagem: "O campo Data do Serviço não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica a Hora do Serviço
        else if (dados.inputServiceHour == undefined || dados.inputServiceHour == null || dados.inputServiceHour == '') {
            var data = { sucesso: false, mensagem: "O campo Hora do Serviço não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica o Valor Total
        else if (dados.inputTotalValue == undefined || dados.inputTotalValue == null || dados.inputTotalValue == '') {
            var data = { sucesso: false, mensagem: "O campo Valor Total não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (dados.inputTotalValue.length > 10) {
            var data = { sucesso: false, mensagem: "O campo Valor Total deve conter no máximo 10 caracteres!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica Quantidade de Consoles
        else if (dados.inputQuantity == undefined || dados.inputQuantity == null || dados.inputQuantity == '') {
            var data = { sucesso: false, mensagem: "O campo de Quantidade não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (!Number.isInteger(parseInt(dados.inputQuantity))) {
            var data = { sucesso: false, mensagem: "O campo Quantidade não é um valor inteiro!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        else if(dados.inputIdConsole == '0') {

            // Verifica Modelo
            if (dados.inputModel == undefined || dados.inputModel == null || dados.inputModel == '') {
                var data = { sucesso: false, mensagem: "O campo Modelo não pode ser vazio!" }
                var json = [data]
                res.send(JSON.stringify(json))
            }
            else if (dados.inputModel.length > 30) {
                var data = { sucesso: false, mensagem: "O campo Modelo deve conter no máximo 30 caracteres!" }
                var json = [data]
                res.send(JSON.stringify(json))
            } 
    
            // Verifica Fabricante
            else if (dados.inputProducer == undefined || dados.inputProducer == null || dados.inputProducer == '') {
                var data = { sucesso: false, mensagem: "O campo Fabricante não pode ser vazio!" }
                var json = [data]
                res.send(JSON.stringify(json))
            }
            else if (dados.inputProducer.length > 50) {
                var data = { sucesso: false, mensagem: "O campo Fabricante deve conter no máximo 50 caracteres!" }
                var json = [data]
                res.send(JSON.stringify(json))
            }
    
            // Verifica Data de Lançamento
            else if (dados.inputLaunchDate == undefined || dados.inputLaunchDate == null || dados.inputLaunchDate == '') {
                var data = { sucesso: false, mensagem: "O campo Data de Lançamento não pode ser vazio!" }
                var json = [data]
                res.send(JSON.stringify(json))
            }
    
            // Verifica Preço
            else if (dados.inputPrice == undefined || dados.inputPrice == null || dados.inputPrice == '') {
                var data = { sucesso: false, mensagem: "O campo Preço não pode ser vazio!" }
                var json = [data]
                res.send(JSON.stringify(json))
            }
            else if (dados.inputPrice.length > 10) {
                var data = { sucesso: false, mensagem: "O campo Preço deve conter no máximo 10 caracteres!" }
                var json = [data]
                res.send(JSON.stringify(json))
            }
            
            // Verifica Descrição da Restauração
            else if (dados.inputRestorationDescription.length > 100) {
                var data = { sucesso: false, mensagem: "O campo Descrição da Restauração deve conter no máximo 100 caracteres!" }
                var json = [data]
                res.send(JSON.stringify(json))
            }

            else {
                console.log("testeRestauracao")
                res.send(await gerenciarVendaRestauracaoServices.cadastrarVendaRestauracao(dados, sessao));
            }
    
        }

        else {
            console.log("testeVenda")
            res.send(await gerenciarVendaRestauracaoServices.cadastrarVendaRestauracao(dados, sessao));
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

        const dados = req.body
        const { inputId } = req.params;

        console.log(dados)

        // Verifica CPF do Cliente
        if (dados.inputCPF == undefined || dados.inputCPF == null || dados.inputCPF == '') {
            var data = { sucesso: false, mensagem: "O campo CPF não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (dados.inputCPF.length > 11) {
            var data = { sucesso: false, mensagem: "O campo CPF deve conter no máximo 11 caracteres!" }
            var json = [data]
            res.send(JSON.stringify(json))
        } 

        // Verifica Estado da Empresa
        else if (dados.inputCompanyState == undefined || dados.inputCompanyState == null || dados.inputCompanyState == '') {
            var data = { sucesso: false, mensagem: "O campo de Estado da Empresa não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (dados.inputCompanyState != "MG" && dados.inputCompanyState != "SP" && dados.inputCompanyState != "RJ") {
            var data = { sucesso: false, mensagem: "O campo de Estado da Empresa está inválido!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica o ID do Console
        else if (dados.inputIdConsole == undefined || dados.inputIdConsole == null || dados.inputIdConsole == '') {
            var data = { sucesso: false, mensagem: "O campo ID do Console não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (!Number.isInteger(parseInt(dados.inputIdConsole))) {
            var data = { sucesso: false, mensagem: "O campo ID do Console não é um valor inteiro!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica a Data do Serviço
        else if (dados.inputServiceDate == undefined || dados.inputServiceDate == null || dados.inputServiceDate == '') {
            var data = { sucesso: false, mensagem: "O campo Data do Serviço não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica a Hora do Serviço
        else if (dados.inputServiceHour == undefined || dados.inputServiceHour == null || dados.inputServiceHour == '') {
            var data = { sucesso: false, mensagem: "O campo Hora do Serviço não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica o Valor Total
        else if (dados.inputTotalValue == undefined || dados.inputTotalValue == null || dados.inputTotalValue == '') {
            var data = { sucesso: false, mensagem: "O campo Valor Total não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (dados.inputTotalValue.length > 10) {
            var data = { sucesso: false, mensagem: "O campo Valor Total deve conter no máximo 10 caracteres!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        // Verifica Quantidade de Consoles
        else if (dados.inputQuantity == undefined || dados.inputQuantity == null || dados.inputQuantity == '') {
            var data = { sucesso: false, mensagem: "O campo de Quantidade não pode ser vazio!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }
        else if (!Number.isInteger(parseInt(dados.inputQuantity))) {
            var data = { sucesso: false, mensagem: "O campo Quantidade não é um valor inteiro!" }
            var json = [data]
            res.send(JSON.stringify(json))
        }

        else if(dados.inputIdConsole == '0') {

            // Verifica Modelo
            if (dados.inputModel == undefined || dados.inputModel == null || dados.inputModel == '') {
                var data = { sucesso: false, mensagem: "O campo Modelo não pode ser vazio!" }
                var json = [data]
                res.send(JSON.stringify(json))
            }
            else if (dados.inputModel.length > 30) {
                var data = { sucesso: false, mensagem: "O campo Modelo deve conter no máximo 30 caracteres!" }
                var json = [data]
                res.send(JSON.stringify(json))
            } 
    
            // Verifica Fabricante
            else if (dados.inputProducer == undefined || dados.inputProducer == null || dados.inputProducer == '') {
                var data = { sucesso: false, mensagem: "O campo Fabricante não pode ser vazio!" }
                var json = [data]
                res.send(JSON.stringify(json))
            }
            else if (dados.inputProducer.length > 50) {
                var data = { sucesso: false, mensagem: "O campo Fabricante deve conter no máximo 50 caracteres!" }
                var json = [data]
                res.send(JSON.stringify(json))
            }
    
            // Verifica Data de Lançamento
            else if (dados.inputLaunchDate == undefined || dados.inputLaunchDate == null || dados.inputLaunchDate == '') {
                var data = { sucesso: false, mensagem: "O campo Data de Lançamento não pode ser vazio!" }
                var json = [data]
                res.send(JSON.stringify(json))
            }
    
            // Verifica Preço
            else if (dados.inputPrice == undefined || dados.inputPrice == null || dados.inputPrice == '') {
                var data = { sucesso: false, mensagem: "O campo Preço não pode ser vazio!" }
                var json = [data]
                res.send(JSON.stringify(json))
            }
            else if (dados.inputPrice.length > 10) {
                var data = { sucesso: false, mensagem: "O campo Preço deve conter no máximo 10 caracteres!" }
                var json = [data]
                res.send(JSON.stringify(json))
            }
            
            // Verifica Descrição da Restauração
            else if (dados.inputRestorationDescription.length > 100) {
                var data = { sucesso: false, mensagem: "O campo Descrição da Restauração deve conter no máximo 100 caracteres!" }
                var json = [data]
                res.send(JSON.stringify(json))
            }

            // Verifica o ID da Venda/Restauração
            else if (dados.inputIdVendaRestauracao == undefined || dados.inputIdVendaRestauracao == null || dados.inputIdVendaRestauracao == '') {
                var data = { sucesso: false, mensagem: "O campo ID Venda/Restauração não pode ser vazio!" }
                var json = [data]
                res.send(JSON.stringify(json))
            }
            else if (!Number.isInteger(dados.inputIdVendaRestauracao)) {
                var data = { sucesso: false, mensagem: "O campo ID Venda/Restauração não é um valor inteiro!" }
                var json = [data]
                res.send(JSON.stringify(json))
            }
        
            else {
                console.log("testeRestauracao")
                res.send(await gerenciarVendaRestauracaoServices.editarVendaRestauracao(dados, inputId, sessao));
            }
    
        }

        else {
            console.log("testeVenda")
            res.send(await gerenciarVendaRestauracaoServices.editarVendaRestauracao(dados, inputId, sessao));
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