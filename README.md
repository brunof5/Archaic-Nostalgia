# Archaic Nostalgia

<div align="center">
<img src="https://github.com/brunof5/Archaic-Nostalgia/assets/85946682/11fa53f2-805e-48a2-b969-3435483b42b6" width="250px" />
</div>

Suponha uma loja de venda e restauração de consoles vintage (Atari, Mega Drive, Super Nintendo, etc) que deseja evoluir seu sistema interno para um website, o usuário deve ter a opção de comprar/restaurar um console.

Integrantes: [Bruno Crespo](https://github.com/brunof5), [Gabriel Rogério](https://github.com/brunof5), [Vinícius de Oliveira](https://github.com/Vicius1)

## Tecnologia Utilizadas

* **Banco de Dados:** MySQL Community Server - v8.0.32.0
* **Linguagem BackEnd:** Node.js - v18.16.0
* **Linguagem FrontEnd:** HTML5 / CSS3 / JavaScript / Bootstrap - v5.3

## Principais Funcionalidades

* Login
* Fazer busca de um console
* Gerenciar console
  * Cadastrar
  * Visualizar
  * Deletar
  * Editar
* Gerenciar vendas/restaurações
  * Cadastrar
  * Visualizar
  * Deletar
  * Editar
* <s>Adicionar no carrinho</s>
* <s>Comprar console</s>
* <s>Pedir restauração de um console não pertencente à empresa</s>
* <s>Avaliação do serviço</s>
  * <s>Restauração</s>

## Público Alvo

Pessoas que tem afinidade com consoles mais antigos.

## Regras de Uso

* A pasta "Banco de Dados" apresenta o script e diagrama SQL implementados no projeto.
* A pasta "Diagramas" apresenta os diagramas de Classe, Pacote e Sequência.
* A pasta "Padrões Adotados" apresenta as regras de verificação/análise de requisitos.
* A pasta "Protótipo de Interface" apresenta todos os PNGs de todas as interfaces do projeto feitas no FIGMA.
* A pasta "Requisitos" apresenta o documento de requisitos do projeto, ademais o diagrama UML dos casos de uso.
* A pasta "Teste" apresenta os casos de teste de validação do projeto.
* A pasta "src" apresenta os códigos do projeto.

### Regras de Commit

Preferencialmente ao commitar alguma funcionalidade do sistema deve-se fechar a issue correspondente da implementação.

Ao commitar utilize o padrão: git commit -m "closes #\<numero issue\>; \<MENSAGEM\>"
* Caso precise fechar mais de uma issue, basta separar as issues por vírgula.
* A mensagem é opcional, o que importa aqui é saber qual issue foi fechada.
* Ao fechar uma issue, procure ela no menu das issues e marque a opção "Pronto para Teste de Sistema" na aba "Projects" => "Kanban" => "Status"

Suponha por exemplo que a issue #31 - RF001 - Fazer login (front) foi concluída, o comando de commit seria: git commit -m "closes #31; acabei o login"

O PO ao ver que uma issue foi fechada e com o status para teste, irá abri-la novamente para teste, e assim que o teste for finalizado e o código estiver funcionando será dado o commit: git commit -m "closes #\<numero issue\>; FUNCIONAL". E ela será marcada como "Finalizado" no Kanban.

### Regras de Branch

O uso de braches é liberado, mas cuidado ao realizar o merge com o main do projeto.

### Boas Práticas de Programação

O grupo deve pelo menos seguir as 6 boas práticas de programação abaixo:

1. **Identar o código**: é um dos itens mais básicos e importantes para um programador, pois facilita a legibilidade e deixa o código mais bonito.
    1.  A identação deve ser feita por tabs de 4 espaços.
2.  **Nomear variáveis de maneira intuitiva**: escrever nomes que não possuem sentido acaba por dificultar a legibilidade do código, além de prejudicar o trabalho em grupo, pelo fato de que as variáveis não são intuitivas.
    1.  Ao declarar a tag *name* nos *inputs* no front-end, tais declarações devem ter sentido e serem intuitivas para o back-end compreender mais facilmente como realizar os endpoints.
3.  **Comentar código**: um comentário detalhando o objetivo de uma função, seus parâmetros de entrada e saída podem ajudar a manutenção futura do código.
    1.  No front-end crie comentários para os formulários e as funções quando trabalhar com JavaScript.
    2.  No back-end crie comentários para cada função de endpoint.
4.  **Escreva um comando por linha**: por se tratar de um trabalho, o desempenho não é extremamente essencial, logo escrever um comando por linha, além de aumentar a legibilidade do código facilita o entendimento do código por estar descrito de uma maneira sequencial.
5.  **Escreva sempre chaves nos comandos de controle (if/else, while, for etc)**: tal prática é útil quando queremos dividir com precisão os caminhos do programa.
    1.  O back-end deve respeitar essa boa prática.
6.  **Declare as variáveis sempre no início das funções**: útil para entendimento do que acontecerá na função logo de imediato.
    1.  No back-end, declarar uma variável do comando sql e escrever seu código de imediato, já adicionando parâmetros à ela se necessário, ou seja, não se deve montar o comando quando realizar a query/consulta. Exceto em casos em que uma consulta depende de outra previamente.
