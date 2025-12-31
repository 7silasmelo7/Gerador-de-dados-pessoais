FROM python:3.11-slim

WORKDIR /app

# Instala dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copia requirements e instala dependências Python
COPY requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt

# Copia código da aplicação
COPY . . 

# Cria diretório para dados gerados
RUN mkdir -p dados_gerados

# Expõe porta
EXPOSE 5000

# Variável de ambiente
ENV FLASK_APP=app.py

# Comando de inicialização
CMD ["python", "app.py"]
