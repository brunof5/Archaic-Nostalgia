import loginRepository from "../repositories/login.repository.js"

async function verificaCampos(req, res) {

    res.send(await loginRepository.verificaCampos(req, res));

}

export default{verificaCampos}