# 🌐 Gerador de Dados Pessoais - Interface Web

Interface web interativa e moderna para geração de dados pessoais brasileiros fictícios.

## ✨ Funcionalidades

- 🎲 **Gerar Pessoa Individual**: Crie uma pessoa fictícia completa
- 📊 **Gerar Múltiplas Pessoas**: Gere de 1 a 100 pessoas de uma vez
- 📤 **Exportar Excel**: Exporte os dados gerados em formato .xlsx
- 📄 **Exportar CSV**: Exporte os dados gerados em formato .csv
- ✅ **Validador de CPF**: Valide CPFs usando algoritmo de verificação oficial
- 📋 **Copiar Dados**: Copie dados individuais para a área de transferência
- 📈 **Estatísticas**: Visualize estatísticas sobre os dados gerados
- 🎨 **Interface Moderna**: Design responsivo e elegante

## 🚀 Como Usar

### Pré-requisitos

- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)

### Instalação

1. **Clone ou baixe este repositório**

2. **Instale as dependências**:
```bash
pip install -r requirements.txt
```

### Executando a Aplicação

1. **Inicie o servidor Flask**:
```bash
python app.py
```

2. **Acesse a aplicação**:
Abra seu navegador e acesse: `http://localhost:5000`

## 📱 Usando a Interface

### Gerar Dados

1. **Uma Pessoa**:
   - Clique no botão "Gerar 1 Pessoa"
   - Os dados aparecerão na seção de resultados

2. **Múltiplas Pessoas**:
   - Digite a quantidade (1-100) no campo
   - Clique em "Gerar Múltiplas"

### Exportar Dados

- **Excel**: Clique em "Exportar Excel" para baixar arquivo .xlsx
- **CSV**: Clique em "Exportar CSV" para baixar arquivo .csv

### Validar CPF

1. Digite o CPF no campo (com ou sem formatação)
2. Clique em "Validar"
3. O resultado aparecerá abaixo do botão

### Copiar Dados

- Cada card de pessoa tem um botão "Copiar"
- Clica nele para copiar todos os dados da pessoa

### Limpar Resultados

- Clique no botão "Limpar" para remover todos os resultados

## 🔧 API Endpoints

A aplicação expõe os seguintes endpoints:

### `POST /api/gerar-pessoa`
Gera uma pessoa fictícia.

**Resposta**:
```json
{
  "success": true,
  "data": {
    "nome": "João Silva",
    "cpf": "12345678910",
    "rg": "123456789",
    ...
  }
}
```

### `POST /api/gerar-multiplas`
Gera múltiplas pessoas.

**Body**:
```json
{
  "quantidade": 10
}
```

### `POST /api/exportar-excel`
Exporta dados em Excel.

**Body**:
```json
{
  "pessoas": [...]
}
```

### `POST /api/exportar-csv`
Exporta dados em CSV.

**Body**:
```json
{
  "pessoas": [...]
}
```

### `POST /api/validar-cpf`
Valida um CPF.

**Body**:
```json
{
  "cpf": "12345678910"
}
```

**Resposta**:
```json
{
  "valido": true,
  "cpf": "12345678910"
}
```

## 📁 Estrutura do Projeto

```
Gerador de dados pessoais/
│
├── app.py                 # Servidor Flask (backend)
├── gerador.py            # Módulo de geração de dados
├── requirements.txt      # Dependências Python
├── README_WEB.md         # Esta documentação
│
├── templates/
│   └── index.html        # Interface principal
│
├── static/
│   ├── css/
│   │   └── style.css     # Estilos da aplicação
│   └── js/
│       └── app.js        # Lógica JavaScript
│
└── dados_gerados/        # Arquivos exportados (opcional)
```

## 🎨 Características da Interface

- **Design Moderno**: Gradientes e animações suaves
- **Responsivo**: Funciona em desktop, tablet e celular
- **Notificações Toast**: Feedback visual elegante
- **Loading States**: Indicadores de carregamento
- **Estatísticas em Tempo Real**: Contadores dinâmicos
- **Acessibilidade**: Labels e estrutura semântica

## 🛠️ Tecnologias Utilizadas

### Backend
- **Flask**: Framework web Python
- **Flask-CORS**: Suporte CORS para API
- **Pandas**: Manipulação de dados
- **openpyxl**: Geração de arquivos Excel
- **brazilcep**: Validação de CEPs brasileiros

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com variáveis CSS
- **JavaScript (ES6+)**: Lógica da aplicação
- **Fetch API**: Comunicação com o backend

## ⚠️ Avisos Importantes

1. **Dados Fictícios**: Todos os dados gerados são fictícios e aleatórios
2. **Uso Educacional**: Destinado apenas para testes e desenvolvimento
3. **CPFs Gerados**: Os CPFs são válidos matematicamente, mas não existem
4. **Não usar para fraudes**: Uso inadequado é ilegal

## 🔒 Segurança

- CORS configurado para desenvolvimento local
- Validações no backend e frontend
- Limite de 100 gerações por requisição
- Sem armazenamento de dados sensíveis

## 🐛 Solução de Problemas

### Erro: "Module 'gerador' not found"
**Solução**: Certifique-se que o arquivo `gerador.py` está na mesma pasta que `app.py`

### Erro: "Port 5000 already in use"
**Solução**: Mude a porta em `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

### Erro ao exportar Excel
**Solução**: Instale o openpyxl:
```bash
pip install openpyxl
```

### Interface não carrega
**Solução**: 
1. Verifique se o servidor Flask está rodando
2. Acesse exatamente `http://localhost:5000`
3. Verifique o console do navegador para erros

## 📝 Licença

Este projeto é de código aberto para fins educacionais.

## 👨‍💻 Desenvolvedor

Criado com ❤️ por [Seu Nome]

---

**Versão**: 1.0.0  
**Data**: 2024
