<p>
Comandos Para as Features:
</p>
Iniciando o git flow:
<p>
  git flow init
</p>
</p>
Reiniciando o git flow (para alterar as branchs padrão):
<p>
  git flow init --force
</p>
Iniciando a Feature:
<p>
  git flow feature start "<NomeFeature>" é
</p>
Add com Commit na Feature:
<p>
  git add "<NomeArquivo>"
</p>
<p>
  git add .
</p>
<p>
  git commit -m "Alteração da Feature" - "NomeAutor"
</p>
Completando a Feature:
<p>
  git flow feature finish <NomeFeature>
</p>
<p>
  Informações Adicionais: 
</p>
<p>
  1 git add pode adicionar um ou mais arquivos para estarem no commit (ponto da linha do tempo)
</p>
<p>
  2 Um commit ou mais
</p>
<p>
  3 São Comandos sequencias, executar na ordem de aparição exceto pelas opções do git add (escolher uma)
</p>
<p>
  4 Considere que por enquanto temos que executar git flow init todas as vezes no raiz do projeto
</p>
<p>
  5 Por precaução rodar git pull antes de fazer o commit
</p>
<p>
  6 Para Nomes de features colocar se é uma alteração de Frontend ou Backend, não alterem a pasta docs quando possível
</p>
