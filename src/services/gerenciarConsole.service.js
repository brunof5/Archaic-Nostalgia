import gerenciarConsoleRepository from "../repositories/gerenciarConsole.repository.js"

async function cadastrarConsole(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany) {

    return (await gerenciarConsoleRepository.cadastrarConsole(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany));

}

async function deletarConsole(inputConsoleId) {

    return (await gerenciarConsoleRepository.deletarConsole(inputConsoleId));

}

async function editarConsole(inputConsoleId, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany) {

    return (await gerenciarConsoleRepository.editarConsole(inputConsoleId, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany));

}

async function visualizarConsoles(inputConsoleId) {

    return (await gerenciarConsoleRepository.visualizarConsoles(inputConsoleId));

}

export default{cadastrarConsole, deletarConsole, editarConsole, visualizarConsoles}