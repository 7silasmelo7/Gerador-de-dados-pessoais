// ========================================
// GERADOR DE DADOS PESSOAIS - JAVASCRIPT
// ========================================

// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Script carregado com sucesso');

    // ========================================
    // ELEMENTOS DO DOM
    // ========================================
    const btnGerar1 = document.getElementById('btn-gerar-1');
    const btnGerarMultiplas = document.getElementById('btn-gerar-multiplas');
    const inputQuantidade = document.getElementById('input-quantidade');
    const btnExportarExcel = document.getElementById('btn-exportar-excel');
    const btnExportarCsv = document.getElementById('btn-exportar-csv');
    const btnValidarCpf = document.getElementById('btn-validar-cpf');
    const inputCpf = document.getElementById('input-cpf');
    const btnLimpar = document.getElementById('btn-limpar');
    const resultadosDiv = document.getElementById('resultados');
    const validacaoResultado = document.getElementById('validacao-resultado');
    const estatisticasDiv = document.getElementById('estatisticas');

    // Variável global para armazenar dados gerados
    let dadosGerados = [];

    // ========================================
    // FUNÇÕES AUXILIARES
    // ========================================

    /**
     * Exibe notificação toast
     */
    function mostrarNotificacao(mensagem, tipo = 'info') {
        const cores = {
            'success': '#10b981',
            'error': '#ef4444',
            'info': '#3b82f6',
            'warning': '#f59e0b'
        };

        const notificacao = document.createElement('div');
        notificacao.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${cores[tipo] || cores.info};
            color: white;
            padding: 15px 20px;
            border-radius:  8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        notificacao.textContent = mensagem;

        document.body.appendChild(notificacao);

        setTimeout(() => {
            notificacao.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notificacao.remove(), 300);
        }, 3000);
    }

    /**
     * Exibe loading em um botão
     */
    function setLoading(botao, isLoading) {
        if (! botao) return;
        
        if (isLoading) {
            botao.disabled = true;
            botao. dataset.textoOriginal = botao.textContent;
            botao.textContent = '⏳ Carregando... ';
        } else {
            botao.disabled = false;
            botao. textContent = botao.dataset.textoOriginal || 'Gerar';
        }
    }

    /**
     * Formata CPF:  12345678910 -> 123.456.789-10
     */
    function formatarCPF(cpf) {
        if (!cpf) return '';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    /**
     * Formata telefone: 11987654321 -> (11) 98765-4321
     */
    function formatarTelefone(telefone) {
        if (!telefone) return '';
        return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    /**
     * Cria card HTML para uma pessoa
     */
    function criarCardPessoa(pessoa, index) {
        const card = document.createElement('div');
        card.className = 'pessoa-card';
        card.innerHTML = `
            <div class="pessoa-header">
                <h3>👤 ${pessoa['Nome Completo'] || 'N/A'}</h3>
                <button class="btn-copiar" onclick="copiarDados(${index})">
                    📋 Copiar
                </button>
            </div>
            <div class="pessoa-dados">
                <p><strong>CPF:</strong> ${formatarCPF(pessoa. CPF || '')}</p>
                <p><strong>Data Nasc:</strong> ${pessoa['Data de Nascimento'] || 'N/A'}</p>
                <p><strong>Email:</strong> ${pessoa.Email || 'N/A'}</p>
                <p><strong>Celular:</strong> ${formatarTelefone(pessoa.Celular || '')}</p>
                ${pessoa.Endereço ? `
                    <p><strong>CEP:</strong> ${pessoa. Endereço.CEP || 'N/A'}</p>
                    <p><strong>Endereço:</strong> ${pessoa. Endereço.Logradouro || 'N/A'}, 
                       ${pessoa.Endereço. Número || 'N/A'}
                       ${pessoa.Endereço. Complemento ?  ' - ' + pessoa.Endereço.Complemento : ''}</p>
                    <p><strong>Bairro:</strong> ${pessoa. Endereço.Bairro || 'N/A'}</p>
                    <p><strong>Cidade:</strong> ${pessoa.Endereço. Cidade || 'N/A'} - ${pessoa.Endereço.Estado || 'N/A'}</p>
                ` : '<p><em>Endereço não disponível</em></p>'}
            </div>
        `;
        return card;
    }

    /**
     * Atualiza estatísticas
     */
    function atualizarEstatisticas() {
        if (! estatisticasDiv) return;
        
        if (dadosGerados.length === 0) {
            estatisticasDiv.style.display = 'none';
            return;
        }

        const estados = {};
        dadosGerados.forEach(pessoa => {
            const estado = pessoa['Endereço - Estado'] || pessoa. Endereço?. Estado;
            if (estado) {
                estados[estado] = (estados[estado] || 0) + 1;
            }
        });

        const topEstados = Object.entries(estados)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([estado, count]) => `${estado}: ${count}`)
            .join(' | ');

        estatisticasDiv.innerHTML = `
            <h3>📊 Estatísticas</h3>
            <p><strong>Total de pessoas:</strong> ${dadosGerados.length}</p>
            <p><strong>Estados mais frequentes:</strong> ${topEstados || 'N/A'}</p>
        `;
        estatisticasDiv.style. display = 'block';
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    /**
     * Gerar 1 pessoa
     */
    if (btnGerar1) {
        btnGerar1.addEventListener('click', async function() {
            setLoading(this, true);
            
            try {
                const response = await fetch('/api/gerar-pessoa', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();

                if (data.success) {
                    dadosGerados = [data.data];
                    resultadosDiv.innerHTML = '';
                    resultadosDiv.appendChild(criarCardPessoa(data.data, 0));
                    atualizarEstatisticas();
                    mostrarNotificacao('✅ Pessoa gerada com sucesso!', 'success');
                } else {
                    throw new Error(data.error || 'Erro desconhecido');
                }
            } catch (error) {
                console.error('Erro:', error);
                mostrarNotificacao('❌ Erro ao gerar pessoa:  ' + error.message, 'error');
            } finally {
                setLoading(this, false);
            }
        });
    }

    /**
     * Gerar múltiplas pessoas
     */
    if (btnGerarMultiplas && inputQuantidade) {
        btnGerarMultiplas.addEventListener('click', async function() {
            const quantidade = parseInt(inputQuantidade.value);

            if (isNaN(quantidade) || quantidade < 1 || quantidade > 100) {
                mostrarNotificacao('⚠️ Digite um número entre 1 e 100', 'warning');
                return;
            }

            setLoading(this, true);

            try {
                const response = await fetch('/api/gerar-multiplas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantidade })
                });

                const data = await response.json();

                if (data.success) {
                    dadosGerados = data.data;
                    resultadosDiv.innerHTML = '';
                    
                    data.data.forEach((pessoa, index) => {
                        resultadosDiv.appendChild(criarCardPessoa(pessoa, index));
                    });

                    atualizarEstatisticas();
                    mostrarNotificacao(`✅ ${quantidade} pessoa(s) gerada(s)!`, 'success');
                } else {
                    throw new Error(data.error || 'Erro desconhecido');
                }
            } catch (error) {
                console.error('Erro:', error);
                mostrarNotificacao('❌ Erro:  ' + error.message, 'error');
            } finally {
                setLoading(this, false);
            }
        });
    }

    /**
     * Exportar Excel
     */
    if (btnExportarExcel) {
        btnExportarExcel. addEventListener('click', async function() {
            if (dadosGerados.length === 0) {
                mostrarNotificacao('⚠️ Gere dados primeiro!', 'warning');
                return;
            }

            setLoading(this, true);

            try {
                const response = await fetch('/api/exportar-excel', {
                    method:  'POST',
                    headers: { 'Content-Type':  'application/json' },
                    body: JSON.stringify({ quantidade: dadosGerados.length })
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `dados_${Date.now()}.xlsx`;
                    a.click();
                    mostrarNotificacao('✅ Excel baixado!', 'success');
                } else {
                    throw new Error('Erro ao exportar');
                }
            } catch (error) {
                console.error('Erro:', error);
                mostrarNotificacao('❌ Erro ao exportar Excel', 'error');
            } finally {
                setLoading(this, false);
            }
        });
    }

    /**
     * Exportar CSV
     */
    if (btnExportarCsv) {
        btnExportarCsv. addEventListener('click', async function() {
            if (dadosGerados.length === 0) {
                mostrarNotificacao('⚠️ Gere dados primeiro!', 'warning');
                return;
            }

            setLoading(this, true);

            try {
                const response = await fetch('/api/exportar-csv', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantidade: dadosGerados. length })
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `dados_${Date.now()}.csv`;
                    a.click();
                    mostrarNotificacao('✅ CSV baixado!', 'success');
                } else {
                    throw new Error('Erro ao exportar');
                }
            } catch (error) {
                console.error('Erro:', error);
                mostrarNotificacao('❌ Erro ao exportar CSV', 'error');
            } finally {
                setLoading(this, false);
            }
        });
    }

    /**
     * Validar CPF
     */
    if (btnValidarCpf && inputCpf) {
        btnValidarCpf.addEventListener('click', async function() {
            const cpf = inputCpf.value.replace(/\D/g, '');

            if (! cpf) {
                mostrarNotificacao('⚠️ Digite um CPF', 'warning');
                return;
            }

            setLoading(this, true);

            try {
                const response = await fetch('/api/validar-cpf', {
                    method: 'POST',
                    headers:  { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cpf })
                });

                const data = await response.json();

                if (validacaoResultado) {
                    validacaoResultado.innerHTML = `
                        <p style="color: ${data.valido ? 'green' : 'red'}; font-weight: bold;">
                            ${data.valido ? '✅' : '❌'} ${data.mensagem}
                        </p>
                    `;
                }

                mostrarNotificacao(data.mensagem, data.valido ? 'success' : 'error');
            } catch (error) {
                console.error('Erro:', error);
                mostrarNotificacao('❌ Erro ao validar CPF', 'error');
            } finally {
                setLoading(this, false);
            }
        });
    }

    /**
     * Limpar resultados
     */
    if (btnLimpar) {
        btnLimpar.addEventListener('click', function() {
            dadosGerados = [];
            if (resultadosDiv) resultadosDiv.innerHTML = '';
            if (validacaoResultado) validacaoResultado.innerHTML = '';
            if (estatisticasDiv) estatisticasDiv.style.display = 'none';
            mostrarNotificacao('🧹 Resultados limpos', 'info');
        });
    }

    // ========================================
    // FUNÇÃO GLOBAL PARA COPIAR
    // ========================================
    window.copiarDados = function(index) {
        const pessoa = dadosGerados[index];
        if (!pessoa) return;

        const texto = `
Nome:  ${pessoa['Nome Completo'] || pessoa.Nome || 'N/A'}
CPF: ${formatarCPF(pessoa.CPF || '')}
Data Nascimento: ${pessoa['Data de Nascimento'] || 'N/A'}
Email: ${pessoa.Email || 'N/A'}
Celular: ${formatarTelefone(pessoa.Celular || '')}
        `.trim();

        navigator.clipboard. writeText(texto).then(() => {
            mostrarNotificacao('📋 Dados copiados! ', 'success');
        }).catch(() => {
            mostrarNotificacao('❌ Erro ao copiar', 'error');
        });
    };

    console.log('✅ Todos os event listeners configurados');
});

// CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);