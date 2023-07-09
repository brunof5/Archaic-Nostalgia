import loginRepository from "../repositories/login.repository.js"

async function verificaCampos(inputUser, inputPassword, sessao) {

    return (await loginRepository.verificaCampos(inputUser, inputPassword, sessao));

}

export default{verificaCampos}