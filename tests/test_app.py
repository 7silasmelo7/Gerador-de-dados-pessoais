"""
Testes para a aplicação Flask
"""
import unittest
import json
from app import app

class TestApp(unittest.TestCase):
    
    def setUp(self):
        """Configura o cliente de teste"""
        self.app = app.test_client()
        self.app.testing = True
    
    def test_index_route(self):
        """Testa se a rota principal carrega"""
        response = self.app. get('/')
        self.assertEqual(response.status_code, 200)
    
    def test_gerar_pessoa_endpoint(self):
        """Testa o endpoint de gerar pessoa"""
        response = self.app.post('/api/gerar-pessoa')
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertIn('data', data)
        self.assertIn('Nome Completo', data['data'])
    
    def test_validar_cpf_valido(self):
        """Testa validação de CPF válido"""
        response = self.app.post('/api/validar-cpf',
                                json={'cpf': '12345678909'})
        data = json.loads(response.data)
        self.assertTrue(data['success'])
    
    def test_gerar_multiplas_quantidade_invalida(self):
        """Testa validação de quantidade inválida"""
        response = self.app.post('/api/gerar-multiplas',
                                json={'quantidade': 101})
        self.assertEqual(response.status_code, 400)

if __name__ == '__main__':
    unittest.main()