# Endereços Http:

# FrontEnd:
http://localhost:3000
# Backend
Currency
http://localhost:5002
User
http://localhost:5120

# Instalação:
cd FASO_PRM_COINDIGIT
### Realizar a Execução para testar e terminar de configurar os Serviços)
# FrontEnd
cd Frontend
npm install
npm run dev
# Backend
cd backend
Criar Nova API:
dotnet new --list
dotnet new -webapi NomeDaSuaAPI

Currency:
dotnet restore
dotnet run

UserApi:
dotnet restore
dotnet run

Informações Adicionais:
Verificar os pacotes no Frontend caso alguma das bibliotecas não seja instalada com o npm install
Mesmo não sendo obrigatório o comando dotnet restore ele ainda é uma boa prática para evitar erros com C#
Se atente que essas instruções são somente para o projeto atualmente, happy coding!
