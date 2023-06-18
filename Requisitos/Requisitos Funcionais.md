# Usuário

### RF001 - Fazer login

**Prioridade**: Essencial.

1. O software DEVE possuir uma tela de conexão com o sistema
   1. O software DEVE fornecer uma opção de cadastro
   2. O software DEVE fornecer uma opção de recuperação de senha
2. O software DEVE validar os dados preenchidos pelo usuário
   1. O software DEVE enviar o usuário para sua tela específica

### RF002 - Fazer busca

**Prioridade**: Essencial.

1. O software DEVE possuir um campo de busca para o usuário
   1. O software DEVE enviar o usuário para a respectiva tela da busca realizada
2. O software DEVE validar os dados preenchidos pelo usuário
3. O software DEVE deixar claro em qual filial se está realizando a busca

# Gerência

## Gerenciar console

**Prioridade**: Essencial.

### RF001 - Cadastrar console

1. O software DEVE permitir o admin/funcionário realizar o cadastro de um produto
   1. O software DEVE restringir o funcionário de cadastrar um produto de filiais que não são de sua região
2. O software DEVE validar os dados preenchidos pelo admin/funcionário
3. O software DEVE proibir o cadastro de um produto de restauração para venda

### RF002 - Visualizar console

1. O software DEVE permitir o admin/funcionário visualizar o(s) produto(s)
   1. O software DEVE restringir o funcionário de visualizar um produto de filiais que não são de sua região

### RF003 - Deletar console

1. O software DEVE permitir o admin/funcionário realizar a remoção de um produto
   1. O software DEVE restringir o funcionário de remover um produto de filiais que não são de sua região
2. O software DEVE proibir a remoção de um produto em restauração

### RF004 - Editar console

1. O software DEVE permitir o admin/funcionário realizar a atualização de um produto
   1. O software DEVE restringir o funcionário de atualizar um produto de filiais que não são de sua região
2. O software DEVE validar os dados preenchidos pelo admin/funcionário

## Gerenciar venda/restauração

**Prioridade**: Essencial.

### RF005 - Cadastrar venda/restauração

1. O software DEVE permitir o admin/funcionário realizar o cadastro de uma venda/restauração
   1. O software DEVE restringir o funcionário de cadastrar uma venda/restauração de filiais que não são de sua região
2. O software DEVE validar os dados preenchidos pelo admin/funcionário
3. O software DEVE proibir o cadastro de uma venda com um produto restaurado

### RF006 - Visualizar venda/restauração

1. O software DEVE permitir o admin/funcionário visualizar a(s) venda/restauração
   1. O software DEVE restringir o funcionário de visualizar uma venda/restauração de filiais que não são de sua região

### RF007 - Deletar venda/restauração

1. O software DEVE permitir o admin/funcionário realizar a remoção de uma venda/restauração
   1. O software DEVE restringir o funcionário de remover uma venda/restauração de filiais que não são de sua região
2. O software DEVE proibir a remoção de um produto em restauração

### RF008 - Editar venda/restauração

1. O software DEVE permitir o admin/funcionário realizar a atualização de uma venda/restauração
   1. O software DEVE restringir o funcionário de atualizar uma venda/restauração de filiais que não são de sua região
2. O software DEVE validar os dados preenchidos pelo admin/funcionário

# Serviço

### RF001 - Adicionar no carrinho

**Prioridade**: Importante.

1. O software DEVE permitir ao cliente a adição de produtos em uma área de compra
2. O software DEVE garantir que os produtos estão em estoque

### RF002 - Comprar console

**Prioridade**: Importante.

1. O software DEVE permitir ao cliente a compra dos produtos em sua área de compra
2. O software DEVE garantir que os produtos sejam retirados de suas respectivas filiais

### RF003 - Pedir restauração

**Prioridade**: Importante.

1. O software DEVE fornecer uma opção de pedido de restauração ao cliente
   1. O software DEVE deixar claro em qual filial será realizada a restauração
3. O software DEVE validar os dados preenchidos pelo cliente

### RF004 - Avaliar serviço

**Prioridade**: Desejável.

1. O software DEVE permitir ao cliente a avaliação de um pedido de restauração
   1. O software DEVE garantir que o serviço foi realizado
   2. O software DEVE permitir o cliente confirmar o serviço
2. O software DEVE computar a avaliação do serviço
