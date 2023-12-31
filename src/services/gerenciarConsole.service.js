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

async function deletarConsole(inputId, sessao) {

    if (sessao.cargo == "funcionario") {
        var consultaConsoleRegiao = await gerenciarConsoleRepository.visualizarConsoleVendaRegiao(inputId, sessao.nome)
        if (consultaConsoleRegiao == 0) {
            const data = { sucesso: false, mensagem: "O console não existe!" };
            const json = [data];
            return (JSON.stringify(json))
        }
        else {

            var consultaRemocaoConsole = await gerenciarConsoleRepository.consultaDeletarConsoleRegiao(inputId, sessao.nome)
            var consultaRemocaoConsoleSemServico = await gerenciarConsoleRepository.consultaDeletarConsole(inputId)
            if (consultaRemocaoConsole == 0) {
                var data = { sucesso: false, mensagem: "Você não pode deletar um console em uma empresa que não seja de sua região!" }
            	var json = [data]
            	return JSON.stringify(json)
            }
            else if (consultaRemocaoConsoleSemServico.length > 0) {
                var data = { sucesso: false, mensagem: "Você não pode deletar um console que faz parte de um serviço!" }
            	var json = [data]
            	return JSON.stringify(json)
            }
            else {
                return (await gerenciarConsoleRepository.deletarConsole(consultaRemocaoConsole[0].idConsole))
            }
        }
    }

    else if (sessao.cargo == "admin") {
        var consultaConsole = await gerenciarConsoleRepository.visualizarConsoleVenda(inputId)
        var consultaRemocaoConsoleSemServico = await gerenciarConsoleRepository.consultaDeletarConsole(inputId)
        if (consultaConsole == 0) {
            const data = { sucesso: false, mensagem: "O console não existe!" };
            const json = [data];
            return (JSON.stringify(json))
        }
        else if(consultaRemocaoConsoleSemServico.length > 0) {
            var data = { sucesso: false, mensagem: "Você não pode deletar um console que faz parte de um serviço!" }
            var json = [data]
            return JSON.stringify(json)
        }
        else {
            return (await gerenciarConsoleRepository.deletarConsole(inputId));
        }
    }

    else {
        var data = { sucesso: false, mensagem: "Algo deu errado ao deletar um console!" }
        var json = [data]
        return JSON.stringify(json)
    }
}

async function editarConsole(inputId, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany, sessao) {

    if (sessao.cargo == "funcionario") {
        var consultaFuncionario = await gerenciarConsoleRepository.verificarEmpresaEmpregado(sessao.nome)

        var data = { estado: inputCompany }
        var json = [data]
        json = JSON.stringify(json)

        if(consultaFuncionario === json) {

            var consultaConsole = await gerenciarConsoleRepository.visualizarConsoleVenda(inputId)
            if (consultaConsole == 0) {
                var data = { sucesso: false, mensagem: "O console não existe!" }
                var json = [data]
                return JSON.stringify(json)
            }
            return (await gerenciarConsoleRepository.editarConsole(inputId, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany));
        }
        else {
            var data = { sucesso: false, mensagem: "Você não pode editar um console em uma empresa que não seja de sua região!" }
            var json = [data]
            return JSON.stringify(json)
        }
    }

    else if (sessao.cargo == "admin") {
        var consultaConsole = await gerenciarConsoleRepository.visualizarConsoleVenda(inputId)
        if (consultaConsole == 0) {
            var data = { sucesso: false, mensagem: "O console não existe!" }
            var json = [data]
            return JSON.stringify(json)
        }
        return (await gerenciarConsoleRepository.editarConsole(inputId, inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany));
    }

    else {
        var data = { sucesso: false, mensagem: "Algo deu errado ao editar um console!" }
        var json = [data]
        return JSON.stringify(json)
    }
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
        var consultaConsoleVenda = await gerenciarConsoleRepository.visualizarConsoleVendaRegiao(inputId, sessao.nome)
        var consultaConsoleRestauracao = await gerenciarConsoleRepository.visualizarConsoleRestauracaoRegiao(inputId, sessao.nome)
        if (consultaConsoleVenda.length == 0 && consultaConsoleRestauracao.length == 0) {
            const data = { sucesso: false, mensagem: "O console não existe!" };
            const json = [data];
            return (JSON.stringify(json))
        }
        else if(consultaConsoleVenda.length == 0 && consultaConsoleRestauracao.length > 0) {
            console.log("Get de um console de restauração feito com sucesso! id do Console: " + inputId)
            const data = { sucesso: true, tipo: "restauracao", dados: consultaConsoleRestauracao};
            const json = [data];
            return (JSON.stringify(json))
        }
        else if(consultaConsoleVenda.length > 0 && consultaConsoleRestauracao.length == 0) {
            console.log("Get de um console de venda feito com sucesso! id do Console: " + inputId)
            const data = { sucesso: true, tipo: "venda", dados: consultaConsoleVenda };
            const json = [data];
            return (JSON.stringify(json))
        }
    }

    else if (sessao.cargo == "admin") {
        var consultaConsoleVenda = await gerenciarConsoleRepository.visualizarConsoleVenda(inputId)
        var consultaConsoleRestauracao = await gerenciarConsoleRepository.visualizarConsoleRestauracao(inputId)
        if (consultaConsoleVenda.length == 0 && consultaConsoleRestauracao.length == 0) {
            const data = { sucesso: false, mensagem: "O console não existe!" };
            const json = [data];
            return (JSON.stringify(json))
        }
        else if(consultaConsoleVenda.length == 0 && consultaConsoleRestauracao.length > 0) {
            console.log("Get de um console de restauração feito com sucesso! id do Console: " + inputId)
            const data = { sucesso: true, tipo: "restauracao", dados: consultaConsoleRestauracao};
            const json = [data];
            return (JSON.stringify(json))
        }
        else if(consultaConsoleVenda.length > 0 && consultaConsoleRestauracao.length == 0) {
            console.log("Get de um console de venda feito com sucesso! id do Console: " + inputId)
            const data = { sucesso: true, tipo: "venda", dados: consultaConsoleVenda };
            const json = [data];
            return (JSON.stringify(json))
        }
    }

    else {
        var data = { sucesso: false, mensagem: "Algo deu errado ao visualizar um console!" }
        var json = [data]
        return JSON.stringify(json)
    }
}

export default{cadastrarConsole, deletarConsole, editarConsole, visualizarConsoles, visualizarConsole}