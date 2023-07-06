import loginRepository from "../repositories/login.repository.js"

async function verificaCampos(inputUser, inputPassword) {

    return (await loginRepository.verificaCampos(inputUser, inputPassword));

}

export default{verificaCampos}