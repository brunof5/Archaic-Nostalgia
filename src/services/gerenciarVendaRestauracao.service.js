import gerenciarVendaRestauracaoRepository from "../repositories/gerenciarVendaRestauracao.repository.js"

async function cadastrarVendaRestauracao(dados, sessao) {

    if (sessao.cargo == "funcionario") {
        var consultaFuncionario = await gerenciarVendaRestauracaoRepository.verificarEmpresaEmpregado(sessao.nome)

        var data = { estado: inputCompany }
        var json = [data]
        json = JSON.stringify(json)

        if(consultaFuncionario === json) {
            return (await gerenciarVendaRestauracaoRepository.cadastrarVendaRestauracao(dados));
        }
        else {
            var data = { sucesso: false, mensagem: "Você não pode cadastrar uma Venda/Restauração em uma empresa que não seja de sua região!" }
            var json = [data]
            return JSON.stringify(json)
        }
    }

    else if (sessao.cargo == "admin") {
        return (await gerenciarVendaRestauracaoRepository.cadastrarVendaRestauracao(dados));
    }

    else {
        var data = { sucesso: false, mensagem: "Algo deu errado no cadastrar uma Venda/Restauração!" }
        var json = [data]
        return JSON.stringify(json)
    }
}

async function deletarVendaRestauracao(inputId, sessao) {

    if (sessao.cargo == "funcionario") {
        var consultaServicoRegiao = await gerenciarVendaRestauracaoRepository.visualizarVendaRestauracaoRegiao(inputId, sessao.nome)
        if (consultaServicoRegiao == 0) {
            const data = { sucesso: false, mensagem: "A Venda/Restauração não existe!" };
            const json = [data];
            return (JSON.stringify(json))
        }
        else {

            var consultaRemocaoServico = await gerenciarVendaRestauracaoRepository.consultaDeletarVendaRestauracaoRegiao(inputId, sessao.nome)
            if (consultaRemocaoServico == 0) {
                var data = { sucesso: false, mensagem: "Você não pode deletar uma Venda/Restauração em uma empresa que não seja de sua região!" }
            	var json = [data]
            	return JSON.stringify(json)
            }
            else {
                return (await gerenciarVendaRestauracaoRepository.deletarVendaRestauracao(consultaRemocaoServico[0].idVenda_Restauracao))
            }
        }
    }

    else if (sessao.cargo == "admin") {
        var consultaServico = await gerenciarVendaRestauracaoRepository.visualizarVendaRestauracao(inputId)
        if (consultaServico == 0) {
            const data = { sucesso: false, mensagem: "A Venda/Restauração não existe!" };
            const json = [data];
            return (JSON.stringify(json))
        }
        else {
            return (await gerenciarVendaRestauracaoRepository.deletarVendaRestauracao(inputId));
        }
    }

    else {
        var data = { sucesso: false, mensagem: "Algo deu errado ao deletar uma Venda/Restauração!" }
        var json = [data]
        return JSON.stringify(json)
    }
}

async function editarVendaRestauracao(dados, inputId, sessao) {

    if (sessao.cargo == "funcionario") {
        var consultaFuncionario = await gerenciarVendaRestauracaoRepository.verificarEmpresaEmpregado(sessao.nome)

        var data = { estado: inputCompany }
        var json = [data]
        json = JSON.stringify(json)

        if(consultaFuncionario === json) {

            var consultaServico = await gerenciarVendaRestauracaoRepository.visualizarVendaRestauracao(inputId)
            if (consultaServico == 0) {
                var data = { sucesso: false, mensagem: "A Venda/Restauração não existe!" }
                var json = [data]
                return JSON.stringify(json)
            }
            var consultaEntrega = await gerenciarVendaRestauracaoRepository.verificarEntregaVendaRestauracao(inputId)
            if (consultaEntrega) {
                var data = { sucesso: false, mensagem: "Não é possível atualizar a Venda/Restauração pois já está entregue." };
			    var json = [data];
                return JSON.stringify(json)
            }
            return (await gerenciarVendaRestauracaoRepository.editarVendaRestauracao(dados, inputId));
        }
        else {
            var data = { sucesso: false, mensagem: "Você não pode editar uma Venda/Restauração em uma empresa que não seja de sua região!" }
            var json = [data]
            return JSON.stringify(json)
        }
    }

    else if (sessao.cargo == "admin") {
        var consultaServico = await gerenciarVendaRestauracaoRepository.visualizarVendaRestauracao(inputId)
        if (consultaServico == 0) {
            var data = { sucesso: false, mensagem: "A Venda/Restauração não existe!" }
            var json = [data]
            return JSON.stringify(json)
        }
        var consultaEntrega = await gerenciarVendaRestauracaoRepository.verificarEntregaVendaRestauracao(inputId)
        if (consultaEntrega) {
            var data = { sucesso: false, mensagem: "Não é possível atualizar a Venda/Restauração pois já está entregue." };
			var json = [data];
            return JSON.stringify(json)
        }
        return (await gerenciarVendaRestauracaoRepository.editarVendaRestauracao(dados, inputId));
    }

    else {
        var data = { sucesso: false, mensagem: "Algo deu errado ao editar uma Venda/Restauração!" }
        var json = [data]
        return JSON.stringify(json)
    }
}

async function visualizarVendasRestauracoes(sessao) {

    if (sessao.cargo == "funcionario") {
        var consultaServicosRegiao = await gerenciarVendaRestauracaoRepository.visualizarVendasRestauracoesRegiao(sessao.nome)
        if (consultaServicosRegiao == 0) {
            const data = { sucesso: false, mensagem: "Não há nenhuma Venda/Restauração cadastrada na região!" };
            const json = [data];
            return (JSON.stringify(json))
        }
        else {
            console.log("Get de todas as Vendas/Restaurações de uma região feito com sucesso!")
            return consultaServicosRegiao
        }
    }

    else if (sessao.cargo == "admin") {
        var consultaServicos = await gerenciarVendaRestauracaoRepository.visualizarVendasRestauracoes()
        if (consultaServicos == 0) {
            const data = { sucesso: false, mensagem: "Não há nenhuma Venda/Restauração cadastrada!" };
            const json = [data];
            return (JSON.stringify(json))
        }
        else {
            console.log("Get de todas as Vendas/Restaurações feito com sucesso!")
            return consultaServicos
        }
    }

    else {
        var data = { sucesso: false, mensagem: "Algo deu errado ao visualizar as Vendas/Restaurações!" }
        var json = [data]
        return JSON.stringify(json)
    }
}

async function visualizarVendaRestauracao(inputId, sessao) {

    if (sessao.cargo == "funcionario") {
        var consultaServicoRegiao = await gerenciarVendaRestauracaoRepository.visualizarVendaRestauracaoRegiao(inputId, sessao.nome)
        if (consultaServicoRegiao == 0) {
            const data = { sucesso: false, mensagem: "A Venda/Restauração não existe!" };
            const json = [data];
            return (JSON.stringify(json))
        }
        else {
            console.log("Get de uma Venda/Restauração feita com sucesso! id da Venda/Restauração: " + inputId)
            return consultaServicoRegiao
        }
    }

    else if (sessao.cargo == "admin") {
        var consultaServico = await gerenciarVendaRestauracaoRepository.visualizarVendaRestauracao(inputId)
        if (consultaServico == 0) {
            const data = { sucesso: false, mensagem: "A Venda/Restauração não existe!!" };
            const json = [data];
            return (JSON.stringify(json))
        }
        else {
            console.log("Get de uma Venda/Restauração feita com sucesso! id da Venda/Restauração: " + inputId)
            return consultaServico
        }
    }

    else {
        var data = { sucesso: false, mensagem: "Algo deu errado ao visualizar uma Venda/Restauração!" }
        var json = [data]
        return JSON.stringify(json)
    }
}

export default{cadastrarVendaRestauracao, deletarVendaRestauracao, editarVendaRestauracao, visualizarVendasRestauracoes, visualizarVendaRestauracao}