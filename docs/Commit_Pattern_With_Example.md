Novo Padrão de Commit:

Exemplo:
git commit -m "TítuloDoQueVocêFez" -m "feat:Adicionado SMS" -m "Author"

Tipos:

O type é responsável por nos dizer qual o tipo de alteração ou iteração está sendo feita, das regras da convenção, temos os seguintes tipos:
  +test: indica qualquer tipo de criação ou alteração de códigos de teste. Exemplo: Criação de testes unitários.
  +feat: indica o desenvolvimento de uma nova feature ao projeto. Exemplo: Acréscimo de um serviço, funcionalidade, endpoint, etc.
  +refactor: usado quando houver uma refatoração de código que não tenha qualquer tipo de impacto na lógica/regras de negócio do sistema. Exemplo: Mudanças de código após um code review
  +style: empregado quando há mudanças de formatação e estilo do código que não alteram o sistema de nenhuma forma.
    Exemplo: Mudar o style-guide, mudar de convenção lint, arrumar indentações, remover espaços em brancos, remover comentários, etc..
  +fix: utilizado quando há correção de erros que estão gerando bugs no sistema.
    Exemplo: Aplicar tratativa para uma função que não está tendo o comportamento esperado e retornando erro.
  +chore: indica mudanças no projeto que não afetem o sistema ou arquivos de testes. São mudanças de desenvolvimento.
    Exemplo: Mudar regras do eslint, adicionar prettier, adicionar mais extensões de arquivos ao .gitignore
  +docs: usado quando há mudanças na documentação do projeto.
    Exemplo: adicionar informações na documentação da API, mudar o README, etc.
  +build: utilizada para indicar mudanças que afetam o processo de build do projeto ou dependências externas.
    Exemplo: Gulp, adicionar/remover dependências do npm, etc.
  +perf: indica uma alteração que melhorou a performance do sistema.
    Exemplo: alterar ForEach por while, melhorar a query ao banco, etc.
  +ci: utilizada para mudanças nos arquivos de configuração de CI.
    Exemplo: Circle, Travis, BrowserStack, etc.
  +revert: indica a reverão de um commit anterior.
Referências:
https://www.conventionalcommits.org/en/v1.0.0/
https://medium.com/linkapi-solutions/conventional-commits-pattern-3778d1a1e657
https://www.conventionalcommits.org/en/v1.0.0/#specification
