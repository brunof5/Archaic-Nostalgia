import gerenciarConsoleRepository from "../repositories/gerenciarConsole.repository.js"

async function verificaCampos(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription) {

    return (await gerenciarConsoleRepository.verificaCampos(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription));

}

export default{verificaCampos}