import gerenciarConsoleRepository from "../repositories/gerenciarConsole.repository.js"

async function cadastrarConsole(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany) {

    return (await gerenciarConsoleRepository.cadastrarConsole(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany));
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

async function visualizarConsoles() {

    var consultaConsoles = await gerenciarConsoleRepository.visualizarConsoles()
    if (consultaConsoles == 0) {
        const data = { sucesso: false, mensagem: "Não há nenhum console cadastrado!" };
        const json = [data];
        resolve(JSON.stringify(json))
    }
    else {
        console.log("Get de todos os consoles feito com sucesso!")
        return consultaConsoles
    }
}

async function visualizarConsole(inputId) {

    var consultaConsole = await gerenciarConsoleRepository.visualizarConsole(inputId)
    if (consultaConsole == 0) {
        const data = { sucesso: false, mensagem: "O console não existe!" };
        const json = [data];
        resolve(JSON.stringify(json))
    }
    else {
        console.log("Get de um os console feito com sucesso! id do Console: " + inputId)
        return consultaConsole
    }
}

export default{cadastrarConsole, deletarConsole, editarConsole, visualizarConsoles, visualizarConsole}