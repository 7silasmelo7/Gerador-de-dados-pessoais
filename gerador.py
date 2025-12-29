import random
import datetime
import json
import pandas as pd
from typing import Dict, Optional, Tuple, List
from brazilcep import get_address_from_cep, WebService
from pathlib import Path

# Constantes
MAX_CEP_ATTEMPTS = 50
REQUEST_TIMEOUT = 5  # segundos
MIN_AGE_YEARS = 18
MAX_AGE_YEARS = 80
MAX_NAME_LENGTH = 60

NOMES = [
    "Maria", "Joao", "Ana", "Pedro", "Sofia", "Lucas", "Isabela", "Gabriel", 
    "Laura", "Matheus", "Julia", "Guilherme", "Manuela", "Rafael", "Beatriz", 
    "Daniel", "Luiza", "Felipe", "Helena", "Bruno"
]

SOBRENOMES = [
    "Silva", "Santos", "Oliveira", "Souza", "Lima", "Pereira", "Costa", 
    "Rodrigues", "Almeida", "Nascimento", "Martins", "Ferreira", "Gomes", 
    "Ribeiro", "Carvalho", "Teixeira", "Fernandes", "Dias", "Moreira", "Borges"
]

PROVEDORES_EMAIL = [
    "gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "protonmail.com"
]

def gerar_nome() -> str:
    """
    Gera um nome completo brasileiro aleatório.
    
    Returns:
        str: Nome completo com 1 a 3 sobrenomes, máximo de 60 caracteres
    """
    while True:
        nome_escolhido = random.choice(NOMES)
        num_sobrenomes = random.randint(1, 3)
        sobrenomes_escolhidos = random.sample(SOBRENOMES, num_sobrenomes)
        
        nome_completo_partes = [nome_escolhido] + sobrenomes_escolhidos
        nome_gerado = " ".join(nome_completo_partes)
        
        if len(nome_gerado) <= MAX_NAME_LENGTH:
            return nome_gerado

def gerar_cpf() -> str:
    """
    Gera um CPF válido brasileiro seguindo o algoritmo de validação.
    
    Returns:
        str: CPF com 11 dígitos (sem formatação)
    """
    cpf_digits = [random.randint(0, 9) for _ in range(9)]
    
    # Calcula o primeiro dígito verificador (DV1)
    dv1_sum = sum(cpf_digits[i] * (10 - i) for i in range(9))
    dv1_remainder = dv1_sum % 11
    dv1 = 0 if dv1_remainder < 2 else 11 - dv1_remainder
    cpf_digits.append(dv1)
    
    # Calcula o segundo dígito verificador (DV2)
    dv2_sum = sum(cpf_digits[i] * (11 - i) for i in range(10))
    dv2_remainder = dv2_sum % 11
    dv2 = 0 if dv2_remainder < 2 else 11 - dv2_remainder
    cpf_digits.append(dv2)
    
    return ''.join(map(str, cpf_digits))

def gerar_data_nascimento() -> str:
    """
    Gera uma data de nascimento aleatória para uma pessoa entre 18 e 80 anos.
    
    Returns:
        str: Data no formato DD/MM/YYYY
    """
    today = datetime.date.today()
    
    # Calcula as datas de nascimento mais antiga e mais recente possíveis
    earliest_birth_date = today.replace(year=today.year - MAX_AGE_YEARS)
    latest_birth_date = today.replace(year=today.year - MIN_AGE_YEARS)
    
    # Gera uma data aleatória dentro do intervalo
    time_between_dates = latest_birth_date - earliest_birth_date
    random_number_of_days = random.randrange(time_between_dates.days)
    random_date = earliest_birth_date + datetime.timedelta(days=random_number_of_days)
    
    return random_date.strftime('%d/%m/%Y')

def gerar_email() -> str:
    """
    Gera um endereço de email aleatório.
    
    Returns:
        str: Endereço de email válido
    """
    nomes_lower = [nome.lower() for nome in NOMES]
    sobrenomes_lower = [sobrenome.lower() for sobrenome in SOBRENOMES]
    
    local_part_options = [
        f"{random.choice(nomes_lower)}{random.randint(1, 99)}",
        f"{random.choice(nomes_lower)}.{random.choice(sobrenomes_lower)}",
        f"{random.choice(nomes_lower)}{random.choice(sobrenomes_lower)[0]}{random.randint(10, 99)}",
        f"{random.choice(sobrenomes_lower)}{random.choice(nomes_lower)[0]}{random.randint(1, 99)}"
    ]
    
    local_part = random.choice(local_part_options).replace(' ', '').lower()
    provedor = random.choice(PROVEDORES_EMAIL)
    
    return f"{local_part}@{provedor}"

def gerar_celular() -> str:
    """
    Gera um número de celular brasileiro válido (formato com 11 dígitos).
    
    Returns:
        str: Número de celular (sem formatação)
    """
    first_digit = '9'
    second_digit = str(random.randint(6, 9))
    remaining_digits = ''.join([str(random.randint(0, 9)) for _ in range(9)])
    
    return f"{first_digit}{second_digit}{remaining_digits}"

def _gerar_cep_aleatorio() -> str:
    """Gera um CEP aleatório de 8 dígitos."""
    cep_digits = [str(random.randint(0, 9)) for _ in range(8)]
    return "".join(cep_digits)

def _formatar_endereco(cep: str, address: Dict) -> Dict[str, Optional[str]]:
    """
    Formata os dados de endereço em estrutura padronizada.
    
    Args:
        cep: CEP do endereço
        address: Dicionário com dados retornados pela API
        
    Returns:
        Dict: Dicionário formatado com dados do endereço
    """
    return {
        'cep': cep,
        'logradouro': address.get('street') or address.get('logradouro'),
        'bairro': address.get('district') or address.get('bairro'),
        'cidade': address.get('city') or address.get('localidade'),
        'estado': address.get('state') or address.get('uf')
    }

def _buscar_endereco_por_cep(cep: str, webservice: WebService) -> Optional[Dict]:
    """
    Busca endereço usando um web service específico.
    
    Args:
        cep: CEP a ser buscado
        webservice: Web service a ser utilizado
        
    Returns:
        Dict ou None: Dados do endereço ou None se falhar
    """
    try:
        address = get_address_from_cep(cep, webservice=webservice, timeout=REQUEST_TIMEOUT)
        if address:
            return _formatar_endereco(cep, address)
    except (ConnectionError, TimeoutError, ValueError, KeyError):
        pass
    return None

def gerar_cep_e_endereco() -> Optional[Dict[str, Optional[str]]]:
    """
    Gera um CEP aleatório e busca o endereço correspondente usando brazilcep.
    Tenta múltiplos web services (ViaCEP, ApiCEP, etc.) para maior confiabilidade.
    
    Returns:
        Dict ou None: Dicionário com dados do endereço ou None se falhar
    """
    webservices = [WebService.VIACEP, WebService.APICEP]
    
    for _ in range(MAX_CEP_ATTEMPTS):
        cep = _gerar_cep_aleatorio()
        
        for webservice in webservices:
            endereco = _buscar_endereco_por_cep(cep, webservice)
            if endereco:
                return endereco
    
    print(f"⚠️ Aviso: Não foi possível gerar CEP válido após {MAX_CEP_ATTEMPTS} tentativas")
    return None

def gerar_numero_e_complemento() -> Tuple[int, Optional[str]]:
    """
    Gera número e complemento de endereço aleatórios.
    
    Returns:
        Tuple: (número do endereço, complemento ou None)
    """
    numero = random.randint(1, 2000)
    complemento = None
    
    if random.random() < 0.5:
        complemento_tipo = random.choice(["APTO", "CASA", "BLOCO", "SALA"])
        
        if complemento_tipo == "APTO":
            complemento_valor = str(random.randint(1, 300))
        elif complemento_tipo == "CASA":
            complemento_valor = str(random.randint(1, 5))
        elif complemento_tipo == "BLOCO":
            complemento_valor = random.choice(["A", "B", "C", "D"])
        else:  # SALA
            complemento_valor = str(random.randint(101, 500))
        
        complemento = f"{complemento_tipo} {complemento_valor}"
    
    return numero, complemento

def gerar_dados_pessoa() -> Dict:
    """
    Gera dados completos de uma pessoa fictícia brasileira.
    
    Returns:
        Dict: Dicionário com todos os dados da pessoa
    """
    nome = gerar_nome()
    cpf = gerar_cpf()
    data_nascimento = gerar_data_nascimento()
    email = gerar_email()
    celular = gerar_celular()
    
    endereco_info = gerar_cep_e_endereco()
    numero_endereco, complemento_endereco = gerar_numero_e_complemento()
    
    dados_pessoa = {
        "Nome Completo": nome,
        "CPF": cpf,
        "Data de Nascimento": data_nascimento,
        "Email": email,
        "Celular": celular,
        "Endereço": {
            "CEP": endereco_info['cep'] if endereco_info else None,
            "Logradouro": endereco_info['logradouro'] if endereco_info else None,
            "Número": numero_endereco,
            "Complemento": complemento_endereco,
            "Bairro": endereco_info['bairro'] if endereco_info else None,
            "Cidade": endereco_info['cidade'] if endereco_info else None,
            "Estado": endereco_info['estado'] if endereco_info else None
        }
    }
    return dados_pessoa

def achatar_dicionario(dados: Dict) -> Dict:
    """
    Converte dicionário aninhado em dicionário plano para exportação.
    
    Args:
        dados: Dicionário com dados da pessoa
        
    Returns:
        Dict: Dicionário achatado
    """
    resultado = {}
    
    for chave, valor in dados.items():
        if chave == "Endereço" and isinstance(valor, dict):
            # Achata o endereço
            for sub_chave, sub_valor in valor.items():
                resultado[f"Endereço - {sub_chave}"] = sub_valor
        else:
            resultado[chave] = valor
    
    return resultado

def obter_diretorio_saida() -> Path:
    """
    Obtém o diretório onde os arquivos serão salvos.
    Cria uma pasta 'dados_gerados' no mesmo diretório do script.
    
    Returns:
        Path: Caminho do diretório de saída
    """
    # Obtém o diretório onde o script está localizado
    script_dir = Path(__file__).parent
    
    # Define o diretório de saída
    output_dir = script_dir / "dados_gerados"
    
    # Cria o diretório se não existir
    output_dir.mkdir(exist_ok=True)
    
    return output_dir

def gerar_multiplas_pessoas(quantidade: int) -> List[Dict]:
    """
    Gera uma lista com múltiplas pessoas.
    
    Args:
        quantidade: Número de pessoas a gerar
        
    Returns:
        List[Dict]: Lista com dados de todas as pessoas
    """
    print(f"\n🔄 Gerando {quantidade} pessoa(s)...\n")
    pessoas = []
    
    for i in range(quantidade):
        print(f"   Gerando pessoa {i+1}/{quantidade}...")
        pessoa = gerar_dados_pessoa()
        pessoas.append(achatar_dicionario(pessoa))
    
    print(f"\n✅ {quantidade} pessoa(s) gerada(s) com sucesso!\n")
    return pessoas

def exportar_para_excel(pessoas: List[Dict], nome_arquivo: str = None) -> str:
    """
    Exporta lista de pessoas para arquivo Excel.
    
    Args:
        pessoas: Lista com dados das pessoas
        nome_arquivo: Nome do arquivo de saída (opcional, gera com timestamp se None)
        
    Returns:
        str: Caminho completo do arquivo gerado
    """
    df = pd.DataFrame(pessoas)
    
    # Reordena as colunas para melhor visualização
    colunas_ordem = [
        "Nome Completo", "CPF", "Data de Nascimento", "Email", "Celular",
        "Endereço - CEP", "Endereço - Logradouro", "Endereço - Número", 
        "Endereço - Complemento", "Endereço - Bairro", "Endereço - Cidade", 
        "Endereço - Estado"
    ]
    df = df[colunas_ordem]
    
    # Obtém o diretório de saída
    output_dir = obter_diretorio_saida()
    
    # Gera nome do arquivo com timestamp se não especificado
    if nome_arquivo is None:
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        nome_arquivo = f"dados_gerados_{timestamp}.xlsx"
    
    # Salva o arquivo no diretório de saída
    caminho = output_dir / nome_arquivo
    df.to_excel(caminho, index=False, engine='openpyxl')
    
    return str(caminho)

def exportar_para_csv(pessoas: List[Dict], nome_arquivo: str = None) -> str:
    """
    Exporta lista de pessoas para arquivo CSV.
    
    Args:
        pessoas: Lista com dados das pessoas
        nome_arquivo: Nome do arquivo de saída (opcional, gera com timestamp se None)
        
    Returns:
        str: Caminho completo do arquivo gerado
    """
    df = pd.DataFrame(pessoas)
    
    # Reordena as colunas para melhor visualização
    colunas_ordem = [
        "Nome Completo", "CPF", "Data de Nascimento", "Email", "Celular",
        "Endereço - CEP", "Endereço - Logradouro", "Endereço - Número", 
        "Endereço - Complemento", "Endereço - Bairro", "Endereço - Cidade", 
        "Endereço - Estado"
    ]
    df = df[colunas_ordem]
    
    # Obtém o diretório de saída
    output_dir = obter_diretorio_saida()
    
    # Gera nome do arquivo com timestamp se não especificado
    if nome_arquivo is None:
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        nome_arquivo = f"dados_gerados_{timestamp}.csv"
    
    # Salva o arquivo no diretório de saída
    caminho = output_dir / nome_arquivo
    df.to_csv(caminho, index=False, encoding='utf-8-sig')
    
    return str(caminho)

def exibir_menu() -> None:
    """Exibe menu de opções para o usuário."""
    print("\n" + "="*60)
    print("🇧🇷  GERADOR DE DADOS PESSOAIS BRASILEIROS")
    print("="*60)
    print("\n📋 Escolha uma opção:\n")
    print("  [1] Gerar 1 pessoa (exibir no console)")
    print("  [2] Gerar múltiplas pessoas e exportar para Excel")
    print("  [3] Gerar múltiplas pessoas e exportar para CSV")
    print("  [4] Gerar múltiplas pessoas (ambos: Excel + CSV)")
    print("  [0] Sair")
    print("\n" + "="*60)

def main():
    """Função principal para executar o gerador."""
    while True:
        exibir_menu()
        
        try:
            opcao = input("\n👉 Digite sua opção: ").strip()
            
            if opcao == "0":
                print("\n👋 Até logo!\n")
                break
            
            elif opcao == "1":
                print("\n🔄 Gerando pessoa...\n")
                pessoa = gerar_dados_pessoa()
                print(json.dumps(pessoa, indent=4, ensure_ascii=False))
                print("\n✅ Pessoa gerada com sucesso!")
                input("\n⏎ Pressione ENTER para continuar...")
            
            elif opcao in ["2", "3", "4"]:
                try:
                    quantidade = int(input("\n📊 Quantas pessoas deseja gerar? "))
                    
                    if quantidade <= 0:
                        print("\n❌ Quantidade deve ser maior que zero!")
                        input("\n⏎ Pressione ENTER para continuar...")
                        continue
                    
                    if quantidade > 1000:
                        confirma = input(f"\n⚠️  Você vai gerar {quantidade} pessoas. Isso pode demorar. Continuar? (s/n): ")
                        if confirma.lower() != 's':
                            continue
                    
                    pessoas = gerar_multiplas_pessoas(quantidade)
                    
                    if opcao == "2" or opcao == "4":
                        arquivo_excel = exportar_para_excel(pessoas)
                        print(f"\n✅ Arquivo Excel criado: {arquivo_excel}")
                    
                    if opcao == "3" or opcao == "4":
                        arquivo_csv = exportar_para_csv(pessoas)
                        print(f"\n✅ Arquivo CSV criado: {arquivo_csv}")
                    
                    input("\n⏎ Pressione ENTER para continuar...")
                    
                except ValueError:
                    print("\n❌ Por favor, digite um número válido!")
                    input("\n⏎ Pressione ENTER para continuar...")
            
            else:
                print("\n❌ Opção inválida! Digite um número de 0 a 4.")
                input("\n⏎ Pressione ENTER para continuar...")
        
        except KeyboardInterrupt:
            print("\n\n👋 Programa interrompido. Até logo!\n")
            break
        except Exception as e:
            print(f"\n❌ Erro: {e}")
            input("\n⏎ Pressione ENTER para continuar...")

if __name__ == "__main__":
    main()
