# Sistema de Departamento Pessoal

Sistema web completo para gestão de colaboradores, folha de pagamento, abonos e ponto eletrônico, desenvolvido com ASP.NET Core 8 e React 19.

---

## Tecnologias

**Back-end**
- ASP.NET Core 8 Web API
- Entity Framework Core 8 + SQL Server
- JWT Bearer Authentication
- BCrypt.Net para hash de senhas

**Front-end**
- React 19 + TypeScript + Vite
- React Router v7
- Tailwind CSS v4 (dark/light mode)
- Axios

---

## Funcionalidades

- **Colaboradores** — cadastro completo com matrícula automática, endereço, dados bancários e tipo de contrato
- **Salários** — lançamento com cálculo automático de INSS, IRRF e FGTS (tabelas 2024), aprovação de pagamento
- **Abonos** — vale-transporte, vale-alimentação, plano de saúde, bônus e outros
- **Ponto Eletrônico** — registro de entrada/saída/almoço e espelho de ponto mensal
- **Controle de Acesso** — 6 perfis com permissões distintas por funcionalidade

### Perfis de Acesso

| Perfil | Permissões |
|---|---|
| Administrador | Acesso total |
| Gestor RH | Colaboradores, aprovação de salários, registro de ponto |
| Analista de Folha | Lançamento de salários e abonos |
| Aprovador | Aprovação de pagamentos |
| Operador de Ponto | Registro de ponto |
| Visualizador | Somente leitura |

---

## Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- SQL Server (local ou Docker)

---

## Configuração

### 1. Banco de dados

Edite a connection string em `DepartamentoPessoal.Server/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost,1433;Database=DepartamentoPessoalDB;User Id=sa;Password=SUA_SENHA;TrustServerCertificate=True;"
}
```

### 2. JWT

Troque a chave secreta em produção:

```json
"Jwt": {
  "Key": "SuaChaveSecretaAqui",
  "Issuer": "DepartamentoPessoal.Server",
  "Audience": "DepartamentoPessoal.Client",
  "ExpiracaoHoras": 8
}
```

### 3. Aplicar migrations

```bash
dotnet ef database update --project DepartamentoPessoal.Server --startup-project DepartamentoPessoal.Server
```

### 4. Executar

```bash
dotnet run --project DepartamentoPessoal.Server
```

O front-end sobe automaticamente via SPA Proxy em `http://localhost:57715`.

---

## Acesso inicial

Ao subir pela primeira vez, um usuário administrador é criado automaticamente:

```
E-mail: admin@dp.com
Senha:  Admin@123
```

> Troque a senha após o primeiro acesso.

---

## Estrutura do projeto

```
DepartamentoPessoal/
├── CommonTemp/                  # Library compartilhada
│   ├── Models/                  # Entidades do domínio
│   ├── Enums/                   # Enumerações
│   └── DTOs/
│       ├── Inputs/              # Requests
│       └── Outputs/             # Responses
├── DepartamentoPessoal.Server/  # ASP.NET Core Web API
│   ├── Controllers/
│   ├── Data/
│   │   ├── AppDbContext.cs
│   │   └── Configurations/      # IEntityTypeConfiguration<T>
│   ├── Interfaces/
│   └── Services/
└── departamentopessoal.client/  # React + Vite
    └── src/
        ├── context/             # AuthContext, ThemeContext
        ├── pages/               # Páginas por módulo
        ├── services/            # Chamadas à API
        └── components/          # Componentes reutilizáveis
```
