import gerenciarConsoleRepository from "../repositories/gerenciarConsole.repository.js"

async function cadastrarConsole(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany, sessao) {

    if (sessao.cargo == "funcionario") {
        var consultaFuncionario = await gerenciarConsoleRepository.verificarEmpresaEmpregado(sessao.nome)

        var data = { estado: inputCompany }
        var json = [data]
        json = JSON.stringify(json)

        if(consultaFuncionario === json) {
            return (await gerenciarConsoleRepository.cadastrarConsole(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany));
        }
        else {
            var data = { sucesso: false, mensagem: "Você não pode cadastrar um console em uma empresa que não seja de sua região!" }
            var json = [data]
            return JSON.stringify(json)
        }
    }

    else if (sessao.cargo == "admin") {
        return (await gerenciarConsoleRepository.cadastrarConsole(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany));
    }

    else {
        var data = { sucesso: false, mensagem: "Algo deu errado no cadastrar console!" }
        var json = [data]
        return JSON.stringify(json)
    }
}

async function deletarConsole(inputId) {

    var consultaConsole = await gerenciarConsoleRepository.visualizarConsole(inputId)
    if (consultaConsole == 0) {
        var data = { sucesso: false, mensagem: "O console não existe!" }
        var json = [data]
        return JSON.stringify(json)
    }
    return (await gerenciarConsoleRepository.deletarConsole(inputId));
}

async function editarConsole(inputId, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany) {

    var consultaConsole = await gerenciarConsoleRepository.visualizarConsole(inputId)
    if (consultaConsole == 0) {
        var data = { sucesso: false, mensagem: "O console não existe!" }
        var json = [data]
        return JSON.stringify(json)
    }
    return (await gerenciarConsoleRepository.editarConsole(inputId, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany));
}

async function visualizarConsoles(sessao) {

    if (sessao.cargo == "funcionario") {
        var consultaConsolesRegiao = await gerenciarConsoleRepository.visualizarConsolesRegiao(sessao.nome)
        if (consultaConsolesRegiao == 0) {
            const data = { sucesso: false, mensagem: "Não há nenhum console cadastrado na região!" };
            const json = [data];
            return (JSON.stringify(json))
        }
        else {
            console.log("Get de todos os consoles de uma região feito com sucesso!")
            return consultaConsolesRegiao
        }
    }

    else if (sessao.cargo == "admin") {
        var consultaConsoles = await gerenciarConsoleRepository.visualizarConsoles()
        if (consultaConsoles == 0) {
            const data = { sucesso: false, mensagem: "Não há nenhum console cadastrado!" };
            const json = [data];
            return (JSON.stringify(json))
        }
        else {
            console.log("Get de todos os consoles feito com sucesso!")
            return consultaConsoles
        }
    }

    else {
        var data = { sucesso: false, mensagem: "Algo deu errado ao visualizar os consoles!" }
        var json = [data]
        return JSON.stringify(json)
    }
}

async function visualizarConsole(inputId, sessao) {

    if (sessao.cargo == "funcionario") {
        var consultaConsoleRegiao = await gerenciarConsoleRepository.visualizarConsoleRegiao(inputId, sessao.nome)
        if (consultaConsoleRegiao == 0) {
            const data = { sucesso: false, mensagem: "O console não existe!" };
            const json = [data];
            return (JSON.stringify(json))
        }
        else {
            console.log("Get de um console feito com sucesso! id do Console: " + inputId)
            return consultaConsoleRegiao
        }
    }

    else if (sessao.cargo == "admin") {
        var consultaConsole = await gerenciarConsoleRepository.visualizarConsole(inputId)
        if (consultaConsole == 0) {
            const data = { sucesso: false, mensagem: "O console não existe!" };
            const json = [data];
            return (JSON.stringify(json))
        }
        else {
            console.log("Get de um console feito com sucesso! id do Console: " + inputId)
            return consultaConsole
        }
    }

    else {
        var data = { sucesso: false, mensagem: "Algo deu errado ao visualizar um console!" }
        var json = [data]
        return JSON.stringify(json)
    }
}

export default{cadastrarConsole, deletarConsole, editarConsole, visualizarConsoles, visualizarConsole}