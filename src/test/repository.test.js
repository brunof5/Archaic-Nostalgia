module.exports = {
    preset: 'ts-jest',
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      "^.+\\.(js|jsx)$": "babel-jest",
    }
  };
import gerenciarConsoleRepository from '../repositories/gerenciarConsole.repository.js'
import gerenciarVendaRestauracaoRepository from '../repositories/gerenciarVendaRestauracao.repository.js';

describe("Teste Cadastro de Console ", ()=>{
    test("Cadastrar um Console", async ()=>{
        const inputModel = "Nintendo DS"
        const inputProducer = "Nintendo"
        const inputLaunchDate = "2004/11/21"
        const inputOriginality = true
        const inputPrice = "799.99"
        const inputConsoleDescription = ""
        const inputQuantity = 5
        const inputCompany = "MG"
        const resposta =  await gerenciarConsoleRepository.cadastrarConsole(inputModel, inputProducer, inputLaunchDate, inputOriginality, inputPrice, inputConsoleDescription, inputQuantity, inputCompany)
        await expect(resposta).toEqual("[{\"sucesso\":true,\"mensagem\":\"Cadastro feito com sucesso!\"}]")
    })
})

describe("Teste Buscar Console de Venda pelo Id", ()=>{
    test("Buscar Console de Venda pelo Id", async ()=>{
        const resposta =  await gerenciarConsoleRepository.visualizarConsoleVenda(2)
        await expect(resposta).not.toBeNull()
    })
})


describe("Teste Buscar Serviços", ()=>{
    test("Buscar todos os serviço que existem", async ()=>{
        const retorno =  await gerenciarVendaRestauracaoRepository.visualizarVendasRestauracoes()
        await expect(retorno).not.toBeNull()
    })
})