// ===== CONFIGURAÇÃO E ESTADO =====
const API_BASE_URL = 'http://localhost:5000/api';

const state = {
    geracoes: [],
    loading: false
};

// ===== UTILITÁRIOS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Formatar CPF: 123.456.789-10
function formatarCPF(cpf) {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formatar RG: 12.345.678-9
function formatarRG(rg) {
    if (!rg) return '';
    return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
}

// Formatar CEP: 12345-678
function formatarCEP(cep) {
    if (!cep) return '';
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}

// Formatar telefone: (11) 91234-5678
function formatarTelefone(telefone) {
    if (!telefone) return '';
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

// ===== NOTIFICAÇÕES TOAST =====
function mostrarToast(mensagem, tipo = 'info') {
    const container = $('#toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    
    const icones = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icones[tipo] || icones.info}</span>
        <span class="toast-message">${mensagem}</span>
    `;
    
    container.appendChild(toast);
    
    // Remover após 4 segundos
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ===== CONTROLES DE LOADING =====
function mostrarLoading(show = true) {
    state.loading = show;
    $('#loadingIndicator').classList.toggle('hidden', !show);
    
    // Desabilitar botões durante loading
    $$('button').forEach(btn => {
        btn.disabled = show;
    });
}

// ===== RENDERIZAÇÃO =====
function renderizarPessoa(pessoa, index) {
    return `
        <div class="person-card">
            <div class="person-header">
                <span class="person-number">Pessoa #${index + 1}</span>
                <button class="btn btn-outline btn-small btn-copy-person" onclick="copiarPessoa(${index})">
                    <span class="btn-icon">📋</span>
                    Copiar
                </button>
            </div>
            <div class="person-details">
                <div class="detail-item">
                    <span class="detail-label">Nome</span>
                    <span class="detail-value">${pessoa.nome || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">CPF</span>
                    <span class="detail-value">${formatarCPF(pessoa.cpf) || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">RG</span>
                    <span class="detail-value">${formatarRG(pessoa.rg) || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Data de Nascimento</span>
                    <span class="detail-value">${pessoa.data_nascimento || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Idade</span>
                    <span class="detail-value">${pessoa.idade || '-'} anos</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Telefone</span>
                    <span class="detail-value">${formatarTelefone(pessoa.telefone) || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">${pessoa.email || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">CEP</span>
                    <span class="detail-value">${formatarCEP(pessoa.cep) || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Endereço</span>
                    <span class="detail-value">${pessoa.logradouro || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Número</span>
                    <span class="detail-value">${pessoa.numero || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Bairro</span>
                    <span class="detail-value">${pessoa.bairro || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Cidade/UF</span>
                    <span class="detail-value">${pessoa.cidade || '-'} - ${pessoa.estado || '-'}</span>
                </div>
            </div>
        </div>
    `;
}

function atualizarResultados() {
    const container = $('#resultsContainer');
    const section = $('#resultsSection');
    const stats = $('#statsPanel');
    
    if (state.geracoes.length === 0) {
        section.classList.add('hidden');
        return;
    }
    
    section.classList.remove('hidden');
    stats.classList.remove('hidden');
    
    // Renderizar pessoas
    container.innerHTML = state.geracoes
        .map((pessoa, index) => renderizarPessoa(pessoa, index))
        .join('');
    
    // Atualizar estatísticas
    $('#statTotal').textContent = state.geracoes.length;
    $('#statHomens').textContent = state.geracoes.filter(p => p.sexo === 'M').length;
    $('#statMulheres').textContent = state.geracoes.filter(p => p.sexo === 'F').length;
}

// ===== API CALLS =====
async function gerarPessoa() {
    try {
        mostrarLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/gerar-pessoa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            state.geracoes.push(result.data);
            atualizarResultados();
            mostrarToast('Pessoa gerada com sucesso!', 'success');
        } else {
            throw new Error(result.error || 'Erro ao gerar pessoa');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarToast('Erro ao gerar pessoa: ' + error.message, 'error');
    } finally {
        mostrarLoading(false);
    }
}

async function gerarMultiplas() {
    const quantidade = parseInt($('#quantidadeInput').value);
    
    if (isNaN(quantidade) || quantidade < 1 || quantidade > 100) {
        mostrarToast('Digite uma quantidade entre 1 e 100', 'error');
        return;
    }
    
    try {
        mostrarLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/gerar-multiplas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantidade })
        });
        
        const result = await response.json();
        
        if (result.success) {
            state.geracoes.push(...result.data);
            atualizarResultados();
            mostrarToast(`${quantidade} pessoa(s) gerada(s) com sucesso!`, 'success');
        } else {
            throw new Error(result.error || 'Erro ao gerar pessoas');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarToast('Erro ao gerar pessoas: ' + error.message, 'error');
    } finally {
        mostrarLoading(false);
    }
}

async function exportarExcel() {
    if (state.geracoes.length === 0) {
        mostrarToast('Não há dados para exportar', 'error');
        return;
    }
    
    try {
        mostrarLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/exportar-excel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pessoas: state.geracoes })
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dados_pessoas_${Date.now()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            mostrarToast('Arquivo Excel exportado com sucesso!', 'success');
        } else {
            throw new Error('Erro ao exportar Excel');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarToast('Erro ao exportar Excel: ' + error.message, 'error');
    } finally {
        mostrarLoading(false);
    }
}

async function exportarCSV() {
    if (state.geracoes.length === 0) {
        mostrarToast('Não há dados para exportar', 'error');
        return;
    }
    
    try {
        mostrarLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/exportar-csv`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pessoas: state.geracoes })
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dados_pessoas_${Date.now()}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            mostrarToast('Arquivo CSV exportado com sucesso!', 'success');
        } else {
            throw new Error('Erro ao exportar CSV');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarToast('Erro ao exportar CSV: ' + error.message, 'error');
    } finally {
        mostrarLoading(false);
    }
}

async function validarCPF() {
    const cpf = $('#cpfInput').value.replace(/\D/g, '');
    const resultadoDiv = $('#validacaoResultado');
    
    if (!cpf) {
        mostrarToast('Digite um CPF para validar', 'error');
        return;
    }
    
    if (cpf.length !== 11) {
        mostrarToast('CPF deve ter 11 dígitos', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/validar-cpf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cpf })
        });
        
        const result = await response.json();
        
        resultadoDiv.classList.remove('hidden');
        resultadoDiv.className = `validation-result ${result.valido ? 'valid' : 'invalid'}`;
        resultadoDiv.textContent = result.valido 
            ? '✓ CPF válido' 
            : '✕ CPF inválido';
        
        mostrarToast(
            result.valido ? 'CPF válido!' : 'CPF inválido!',
            result.valido ? 'success' : 'error'
        );
    } catch (error) {
        console.error('Erro:', error);
        mostrarToast('Erro ao validar CPF: ' + error.message, 'error');
    }
}

function limparResultados() {
    if (state.geracoes.length === 0) {
        mostrarToast('Não há resultados para limpar', 'info');
        return;
    }
    
    if (confirm('Deseja realmente limpar todos os resultados?')) {
        state.geracoes = [];
        atualizarResultados();
        $('#statsPanel').classList.add('hidden');
        $('#resultsSection').classList.add('hidden');
        mostrarToast('Resultados limpos com sucesso!', 'success');
    }
}

// ===== COPIAR DADOS =====
function copiarPessoa(index) {
    const pessoa = state.geracoes[index];
    
    const texto = `
Nome: ${pessoa.nome}
CPF: ${formatarCPF(pessoa.cpf)}
RG: ${formatarRG(pessoa.rg)}
Data de Nascimento: ${pessoa.data_nascimento}
Idade: ${pessoa.idade} anos
Telefone: ${formatarTelefone(pessoa.telefone)}
Email: ${pessoa.email}
CEP: ${formatarCEP(pessoa.cep)}
Endereço: ${pessoa.logradouro}, ${pessoa.numero}
Bairro: ${pessoa.bairro}
Cidade: ${pessoa.cidade} - ${pessoa.estado}
    `.trim();
    
    navigator.clipboard.writeText(texto)
        .then(() => {
            mostrarToast('Dados copiados para a área de transferência!', 'success');
        })
        .catch(err => {
            console.error('Erro ao copiar:', err);
            mostrarToast('Erro ao copiar dados', 'error');
        });
}

// ===== FORMATAÇÃO AUTOMÁTICA DE CPF =====
function aplicarMascaraCPF(event) {
    let valor = event.target.value.replace(/\D/g, '');
    
    if (valor.length > 11) {
        valor = valor.substring(0, 11);
    }
    
    if (valor.length > 9) {
        valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (valor.length > 6) {
        valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (valor.length > 3) {
        valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    
    event.target.value = valor;
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    // Botões principais
    $('#btnGerarUma').addEventListener('click', gerarPessoa);
    $('#btnGerarMultiplas').addEventListener('click', gerarMultiplas);
    $('#btnExportarExcel').addEventListener('click', exportarExcel);
    $('#btnExportarCSV').addEventListener('click', exportarCSV);
    $('#btnLimpar').addEventListener('click', limparResultados);
    
    // Validador de CPF
    $('#btnValidarCPF').addEventListener('click', validarCPF);
    $('#cpfInput').addEventListener('input', aplicarMascaraCPF);
    
    // Enter no input de quantidade
    $('#quantidadeInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            gerarMultiplas();
        }
    });
    
    // Enter no input de CPF
    $('#cpfInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            validarCPF();
        }
    });
    
    console.log('Aplicação iniciada com sucesso!');
});

// Expor funções globalmente para uso em onclick
window.copiarPessoa = copiarPessoa;
