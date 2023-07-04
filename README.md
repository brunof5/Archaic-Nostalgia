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
* Adicionar no carrinho
* Comprar console
* Pedir restauração de um console não pertencente à empresa
* Avaliação do serviço
  * Restauração

## Público Alvo

Pessoas que tem afinidade com consoles mais antigos.

## Regras de Uso

* A pasta "Requisitos" apresenta o documento de requisitos do projeto, ademais o diagrama UML dos casos de uso.
* A pasta "Diagramas" apresenta os diagramas de Classe, Pacote e Sequência.
* A pasta "Protótipo de Interface" apresenta todos os PNGs de todas as interfaces do projeto feitas no FIGMA.
* A pasta "Padrões Adotados" apresenta as regras de verificação/análise de requisitos.
* A pasta "src" apresenta os códigos do projeto.

### Regras de commit

Preferencialmente ao commitar alguma funcionalidade do sistema deve-se fechar a issue correspondente da implementação.

Ao commitar utilize o padrão: git commit -m "closes #\<numero issue\>; \<MENSAGEM\>"
* Caso precise fechar mais de uma issue, basta separar as issues por vírgula.
* A mensagem é opcional, o que importa aqui é saber qual issue foi fechada.

Suponha por exemplo que a issue #31 - RF001 - Fazer login (front) foi concluída, o comando de commit seria: git commit -m "closes #31; acabei o login"

O PO ao ver que uma issue foi fechada, irá abri-la novamente para teste, e assim que o teste for finalizado e o código estiver funcionando será dado o commit: git commit -m "closes #\<numero issue\>; FUNCIONAL".

### Regras de branch

O uso de braches é liberado, mas cuidadao ao realizar o merge com o main do projeto.
