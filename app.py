"""
Aplicação Flask para Gerador de Dados Pessoais Brasileiros
Interface Web Interativa
"""

from flask import Flask, render_template, jsonify, request, send_file
from flask_cors import CORS
import gerador
import io
import pandas as pd
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    """Rota principal - renderiza a interface web"""
    return render_template('index.html')

@app.route('/api/gerar-pessoa', methods=['POST'])
def gerar_pessoa():
    """
    Endpoint para gerar dados de uma única pessoa.
    
    Returns:
        JSON: Dados da pessoa gerada
    """
    try:
        dados = gerador.gerar_dados_pessoa()
        return jsonify({
            'success': True,
            'data': dados
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/gerar-multiplas', methods=['POST'])
def gerar_multiplas():
    """
    Endpoint para gerar dados de múltiplas pessoas.
    
    Request Body:
        quantidade (int): Número de pessoas a gerar (1-100)
    
    Returns:
        JSON: Lista com dados das pessoas geradas
    """
    try:
        data = request.get_json()
        quantidade = int(data.get('quantidade', 1))
        
        # Validação
        if quantidade < 1 or quantidade > 100:
            return jsonify({
                'success': False,
                'error': 'Quantidade deve estar entre 1 e 100'
            }), 400
        
        # Gera as pessoas
        pessoas = []
        for _ in range(quantidade):
            pessoa = gerador.gerar_dados_pessoa()
            pessoa_achatada = gerador.achatar_dicionario(pessoa)
            pessoas.append(pessoa_achatada)
        
        return jsonify({
            'success': True,
            'data': pessoas,
            'count': len(pessoas)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/exportar-excel', methods=['POST'])
def exportar_excel():
    """
    Endpoint para exportar dados para Excel.
    
    Request Body:
        quantidade (int): Número de pessoas a gerar
    
    Returns:
        File: Arquivo Excel para download
    """
    try:
        data = request.get_json()
        quantidade = int(data.get('quantidade', 1))
        
        if quantidade < 1 or quantidade > 100:
            return jsonify({
                'success': False,
                'error': 'Quantidade deve estar entre 1 e 100'
            }), 400
        
        # Gera as pessoas
        pessoas = []
        for _ in range(quantidade):
            pessoa = gerador.gerar_dados_pessoa()
            pessoa_achatada = gerador.achatar_dicionario(pessoa)
            pessoas.append(pessoa_achatada)
        
        # Cria DataFrame
        df = pd.DataFrame(pessoas)
        
        # Cria arquivo em memória
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Dados Pessoais')
        output.seek(0)
        
        # Nome do arquivo com timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'dados_pessoais_{timestamp}.xlsx'
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/exportar-csv', methods=['POST'])
def exportar_csv():
    """
    Endpoint para exportar dados para CSV.
    
    Request Body:
        quantidade (int): Número de pessoas a gerar
    
    Returns:
        File: Arquivo CSV para download
    """
    try:
        data = request.get_json()
        quantidade = int(data.get('quantidade', 1))
        
        if quantidade < 1 or quantidade > 100:
            return jsonify({
                'success': False,
                'error': 'Quantidade deve estar entre 1 e 100'
            }), 400
        
        # Gera as pessoas
        pessoas = []
        for _ in range(quantidade):
            pessoa = gerador.gerar_dados_pessoa()
            pessoa_achatada = gerador.achatar_dicionario(pessoa)
            pessoas.append(pessoa_achatada)
        
        # Cria DataFrame
        df = pd.DataFrame(pessoas)
        
        # Cria arquivo em memória
        output = io.StringIO()
        df.to_csv(output, index=False, encoding='utf-8-sig')
        output.seek(0)
        
        # Converte para BytesIO
        bytes_output = io.BytesIO()
        bytes_output.write(output.getvalue().encode('utf-8-sig'))
        bytes_output.seek(0)
        
        # Nome do arquivo com timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'dados_pessoais_{timestamp}.csv'
        
        return send_file(
            bytes_output,
            mimetype='text/csv',
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/validar-cpf', methods=['POST'])
def validar_cpf():
    """
    Endpoint para validar um CPF.
    
    Request Body:
        cpf (str): CPF a ser validado
    
    Returns:
        JSON: Resultado da validação
    """
    try:
        data = request.get_json()
        cpf = data.get('cpf', '').replace('.', '').replace('-', '')
        
        # Validação básica
        if len(cpf) != 11 or not cpf.isdigit():
            return jsonify({
                'success': True,
                'valido': False,
                'mensagem': 'CPF deve conter 11 dígitos numéricos'
            })
        
        # Verifica se todos os dígitos são iguais
        if len(set(cpf)) == 1:
            return jsonify({
                'success': True,
                'valido': False,
                'mensagem': 'CPF inválido (todos os dígitos iguais)'
            })
        
        # Valida dígitos verificadores
        def calcular_digito(cpf_parcial, peso_inicial):
            soma = sum(int(cpf_parcial[i]) * (peso_inicial - i) for i in range(len(cpf_parcial)))
            resto = soma % 11
            return 0 if resto < 2 else 11 - resto
        
        digito1 = calcular_digito(cpf[:9], 10)
        digito2 = calcular_digito(cpf[:10], 11)
        
        cpf_valido = cpf[-2:] == f"{digito1}{digito2}"
        
        return jsonify({
            'success': True,
            'valido': cpf_valido,
            'mensagem': 'CPF válido' if cpf_valido else 'CPF inválido'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🌐 Servidor Web Iniciado!")
    print("="*60)
    print("\n📍 Acesse: http://localhost:5000")
    print("\n💡 Pressione Ctrl+C para encerrar\n")
    app.run(debug=True, host='0.0.0.0', port=5000)
