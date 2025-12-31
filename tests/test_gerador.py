"""
Testes para o módulo gerador. py
"""
import unittest
from gerador import (
    gerar_nome, gerar_cpf, gerar_email, 
    gerar_celular, gerar_data_nascimento,
    achatar_dicionario
)
import re

class TestGerador(unittest. TestCase):
    
    def test_gerar_nome_formato(self):
        """Testa se o nome gerado tem formato válido"""
        nome = gerar_nome()
        self.assertIsInstance(nome, str)
        self.assertGreater(len(nome), 0)
        self.assertLessEqual(len(nome), 60)
    
    def test_gerar_cpf_valido(self):
        """Testa se o CPF gerado é válido"""
        cpf = gerar_cpf()
        self.assertEqual(len(cpf), 11)
        self.assertTrue(cpf.isdigit())
    
    def test_gerar_email_formato(self):
        """Testa se o email tem formato válido"""
        email = gerar_email()
        regex = r'^[a-z0-9.]+@[a-z0-9]+\.[a-z]+$'
        self.assertRegex(email, regex)
    
    def test_gerar_celular_formato(self):
        """Testa se o celular tem 11 dígitos e começa com 9"""
        celular = gerar_celular()
        self.assertEqual(len(celular), 11)
        self.assertTrue(celular[0] == '9')
    
    def test_gerar_data_nascimento_formato(self):
        """Testa se a data está no formato correto"""
        data = gerar_data_nascimento()
        regex = r'^\d{2}/\d{2}/\d{4}$'
        self. assertRegex(data, regex)
    
    def test_achatar_dicionario(self):
        """Testa a função de achatar dicionário"""
        dados = {
            "Nome": "Teste",
            "Endereço": {
                "Rua": "Teste",
                "Cidade": "São Paulo"
            }
        }
        resultado = achatar_dicionario(dados)
        self.assertIn("Endereço - Rua", resultado)
        self.assertEqual(resultado["Endereço - Rua"], "Teste")

if __name__ == '__main__':
    unittest.main()