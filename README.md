# 🇧🇷 Gerador de Dados Pessoais Brasileiros

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

Aplicação web para geração de dados pessoais brasileiros fictícios para testes e desenvolvimento.

## ✨ Funcionalidades

- 🎲 Geração de pessoas fictícias completas com dados válidos
- 📊 Geração em lote (até 100 pessoas)
- 📤 Exportação para Excel e CSV
- ✅ Validador de CPF integrado
- 🌐 Interface web moderna e responsiva
- 💻 CLI para uso via terminal

## 🖼️ Preview

[Adicione screenshots da aplicação aqui]

## 🚀 Instalação

### Pré-requisitos

- Python 3.8 ou superior
- pip

### Passos

1. Clone o repositório: 
```bash
git clone https://github.com/7silasmelo7/Gerador-de-dados-pessoais.git
cd Gerador-de-dados-pessoais
```

2. Crie um ambiente virtual (recomendado):
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
```

3. Instale as dependências:
```bash
pip install -r requirements. txt
```

## 💻 Uso

### Interface Web

```bash
python app.py
```
## 🐳 Usando com Docker

```bash
# Build
docker-compose build

# Run
docker-compose up


Acesse:  `http://localhost:5000`

### CLI (Terminal)

```bash
python gerador. py
```

## 📚 Documentação

Veja [README_WEB.md](README_WEB.md) para documentação detalhada da interface web.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor: 

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.  Veja o arquivo [LICENSE](LICENSE) para detalhes.

## ⚠️ Aviso Legal

Este gerador cria dados **FICTÍCIOS** para fins de **TESTE E DESENVOLVIMENTO**. Os CPFs gerados são válidos algoritmicamente, mas não correspondem a pessoas reais. 

## 👤 Autor

**7silasmelo7**

- GitHub: [@7silasmelo7](https://github.com/7silasmelo7)

## 🙏 Agradecimentos

- [brazilcep](https://github.com/mstuttgart/brazilcep) - API de CEPs
- [Flask](https://flask.palletsprojects.com/) - Framework web
- [Pandas](https://pandas.pydata.org/) - Manipulação de dados
```