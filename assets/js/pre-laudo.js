/**
 * NeuroCombat Academy - Diagnóstico Interativo (Pré-Laudo)
 * 
 * Funcionalidades:
 * - 20 perguntas divididas em 4 blocos
 * - Máscara de telefone automática
 * - Seleção de UF
 * - Cálculo de pontuação e classificação em trilhas
 * - Envio para WhatsApp com todas as respostas
 * - Geração de PDF do Pré-Laudo
 */

(function() {
    'use strict';

    // ===== CONFIGURAÇÕES =====
    const NUMERO_ACADEMY = "5524999599347";
    const TOTAL_PERGUNTAS = 20;

    // ===== BIBLIOTECA DE PERGUNTAS =====
    const perguntas = [
        // Bloco 1 - Legislação (0-4)
        { bloco: 'Legislação', pergunta: 'O que significa CRAF?', opcoes: ['Certificado de Registro de Arma de Fogo (PF)', 'Certificado de Registro de Atirador Federal', 'Certificado de Registro de Arma Franca', 'Cadastro de Registro de Atirador de Fogo'], correta: 0 },
        { bloco: 'Legislação', pergunta: 'Qual documento é emitido pela Polícia Federal para civis?', opcoes: ['CR (Certificado de Registro)', 'CRAF (Certificado de Registro de Arma de Fogo)', 'CAC (Certificado de Atirador Civil)', 'Porte de Arma Federal'], correta: 1 },
        { bloco: 'Legislação', pergunta: 'Qual é a idade mínima para posse de arma no Brasil?', opcoes: ['18 anos', '21 anos', '25 anos', '30 anos'], correta: 2 },
        { bloco: 'Legislação', pergunta: 'O SIGMA é um sistema do:', opcoes: ['Polícia Federal', 'Exército Brasileiro', 'Polícia Militar', 'Ministério da Justiça'], correta: 1 },
        { bloco: 'Legislação', pergunta: 'Qual a validade da Autorização de Aquisição?', opcoes: ['30 dias', '60 dias', '90 dias', '180 dias'], correta: 2 },
        // Bloco 2 - Segurança (5-9)
        { bloco: 'Segurança', pergunta: 'Qual é o primeiro Princípio Universal de Segurança?', opcoes: ['Mantenha o dedo fora do gatilho', 'Toda arma é tratada como carregada', 'Nunca aponte para o que não deseja destruir', 'Use sempre EPI'], correta: 1 },
        { bloco: 'Segurança', pergunta: 'O que é "Finger Discipline"?', opcoes: ['Manter o dedo fora do gatilho até decidir disparar', 'Treinar o dedo para atirar rápido', 'Usar o dedo indicador para apontar a arma', 'Colocar o dedo no gatilho ao sacar'], correta: 0 },
        { bloco: 'Segurança', pergunta: 'Como deve ser feito o transporte de arma por civil sem porte?', opcoes: ['Carregada e no coldre', 'Desmuniciada, na caixa original e separada da munição', 'Municiada dentro da mochila', 'Carregada e com o cão armado'], correta: 1 },
        { bloco: 'Segurança', pergunta: 'O que deve ser verificado ao receber uma arma no estande?', opcoes: ['Apenas o carregador', 'Apenas a mira', 'A câmara e a condição da arma', 'Apenas o calibre'], correta: 2 },
        { bloco: 'Segurança', pergunta: 'Qual EPI é obrigatório no estande?', opcoes: ['Apenas óculos de sol', 'Óculos balísticos e proteção auditiva', 'Apenas proteção auditiva', 'Capacete e colete'], correta: 1 },
        // Bloco 3 - Conhecimento Técnico (10-14)
        { bloco: 'Conhecimento Técnico', pergunta: 'Qual peça retira o estojo da câmara da pistola?', opcoes: ['Ejetor', 'Extrator', 'Percussor', 'Cão'], correta: 1 },
        { bloco: 'Conhecimento Técnico', pergunta: 'Qual é a pane "Stovepipe"?', opcoes: ['Dois cartuchos na câmara', 'Estojo preso verticalmente no ferrolho', 'Falha na espoleta', 'Carregador travado'], correta: 1 },
        { bloco: 'Conhecimento Técnico', pergunta: 'O que é "Double Feed"?', opcoes: ['Dois cartuchos na câmara', 'Falha na espoleta', 'Estojo preso no ferrolho', 'Arma sem munição'], correta: 0 },
        { bloco: 'Conhecimento Técnico', pergunta: 'Qual componente da munição inicia a deflagração?', opcoes: ['Projétil', 'Espoleta', 'Estojo', 'Pólvora'], correta: 1 },
        { bloco: 'Conhecimento Técnico', pergunta: 'Qual é o sistema de ação típico da pistola Glock?', opcoes: ['SA (Single Action)', 'DA (Double Action)', 'Striker-Fired', 'DA/SA'], correta: 2 },
        // Bloco 4 - Experiência Prática (15-19)
        { bloco: 'Experiência Prática', pergunta: 'Você já frequentou estande de tiro?', opcoes: ['Nunca', 'Poucas vezes (menos de 3)', 'Algumas vezes (3-10)', 'Regularmente (mais de 10)'], correta: -1 },
        { bloco: 'Experiência Prática', pergunta: 'Você já realizou treino seco?', opcoes: ['Nunca', 'Raramente', 'Ocasionalmente', 'Regularmente'], correta: -1 },
        { bloco: 'Experiência Prática', pergunta: 'Qual seu nível de conhecimento sobre a legislação de armas?', opcoes: ['Nenhum conhecimento', 'Conhecimento básico', 'Conhecimento intermediário', 'Conhecimento avançado'], correta: -1 },
        { bloco: 'Experiência Prática', pergunta: 'Você já possui ou já teve arma de fogo registrada?', opcoes: ['Não', 'Sim, já tive', 'Sim, possuo atualmente', 'Estou em processo de aquisição'], correta: -1 },
        { bloco: 'Experiência Prática', pergunta: 'Qual seu objetivo principal com este programa?', opcoes: ['Primeira aquisição de arma', 'Obtenção do CRAF', 'Renovação do CR/CRAF', 'Atualização técnica'], correta: -1 }
    ];

    // ===== ESTADO =====
    let respostaAtual = 0;
    let respostas = new Array(TOTAL_PERGUNTAS).fill(null);
    let resultadoLiberado = false;
    let dadosLead = {};

    // ===== ELEMENTOS =====
    const container = document.getElementById('diagnosticoPerguntas');
    const progressFill = document.getElementById('progressFill');
    const progressQuestion = document.getElementById('progressQuestion');
    const progressPercent = document.getElementById('progressPercent');
    const btnAnterior = document.getElementById('btnAnterior');
    const btnProximo = document.getElementById('btnProximo');
    const btnVerResultado = document.getElementById('btnVerResultado');
    const resultadoDiv = document.getElementById('diagnosticoResultado');

    // ===== FUNÇÕES AUXILIARES =====

    /** Gera número de protocolo único */
    function gerarProtocolo() {
        const ano = new Date().getFullYear();
        const seq = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
        return `NC-${ano}-${seq}`;
    }

    /** Máscara de telefone (inserida no evento input) */
    function aplicarMascaraTelefone(input) {
        if (!input) return;
        input.addEventListener('input', function(e) {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 11) v = v.slice(0, 11);
            v = v.replace(/^(\d{2})(\d)/, '($1) $2');
            v = v.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = v;
        });
    }

    /** Calcula pontuação por bloco */
    function calcularPontuacaoBlocos() {
        let blocos = {
            legislacao: { total: 0, acertos: 0 },
            seguranca: { total: 0, acertos: 0 },
            tecnico: { total: 0, acertos: 0 },
            pratica: { total: 0, pontos: 0 }
        };
        let pontuacaoTotal = 0;

        perguntas.forEach((p, i) => {
            const resp = respostas[i];
            if (resp === null) return;
            const bloco = p.bloco;

            if (bloco === 'Legislação') {
                blocos.legislacao.total++;
                if (p.correta !== -1 && resp === p.correta) {
                    blocos.legislacao.acertos++;
                    pontuacaoTotal++;
                } else if (p.correta === -1) {
                    const pts = (resp + 1) * 0.5;
                    blocos.legislacao.acertos += pts;
                    pontuacaoTotal += pts;
                }
            } else if (bloco === 'Segurança') {
                blocos.seguranca.total++;
                if (p.correta !== -1 && resp === p.correta) {
                    blocos.seguranca.acertos++;
                    pontuacaoTotal++;
                } else if (p.correta === -1) {
                    const pts = (resp + 1) * 0.5;
                    blocos.seguranca.acertos += pts;
                    pontuacaoTotal += pts;
                }
            } else if (bloco === 'Conhecimento Técnico') {
                blocos.tecnico.total++;
                if (p.correta !== -1 && resp === p.correta) {
                    blocos.tecnico.acertos++;
                    pontuacaoTotal++;
                } else if (p.correta === -1) {
                    const pts = (resp + 1) * 0.5;
                    blocos.tecnico.acertos += pts;
                    pontuacaoTotal += pts;
                }
            } else if (bloco === 'Experiência Prática') {
                blocos.pratica.total++;
                const pts = (resp + 1) * 0.5;
                blocos.pratica.pontos += pts;
                pontuacaoTotal += pts;
            }
        });

        // Arredondar
        pontuacaoTotal = Math.round(pontuacaoTotal);
        ['legislacao', 'seguranca', 'tecnico'].forEach(key => {
            blocos[key].acertos = Math.round(blocos[key].acertos * 10) / 10;
        });
        blocos.pratica.pontos = Math.round(blocos.pratica.pontos * 10) / 10;

        return { blocos, pontuacaoTotal };
    }

    /** Determina o nível com base na pontuação */
    function determinarNivel(pontuacao) {
        if (pontuacao <= 9) return { nivel: '🟠 Trilha Base', classe: 'base', descricao: 'Preparação Fundamental' };
        if (pontuacao <= 15) return { nivel: '🟡 Trilha Técnica', classe: 'tecnica', descricao: 'Preparação Técnica' };
        return { nivel: '🔵 Trilha Aprovação Assistida', classe: 'aprovacao', descricao: 'Preparação Individualizada' };
    }

    /** Gera recomendação para a trilha */
    function gerarRecomendacao(nivelClasse) {
        const recomendacoes = {
            'base': 'Recomendamos a Trilha Base para construir toda a base necessária. Você terá acesso a todo o conteúdo teórico, treino seco guiado, simulados e treinamento prático em estande, com carga horária completa de até 40 horas.',
            'tecnica': 'Recomendamos a Trilha Técnica para corrigir falhas e consolidar sua técnica. Você terá acesso a conteúdo direcionado, treino seco corretivo, simulados completos e treinamento prático em estande com correção individual.',
            'aprovacao': 'Recomendamos a Trilha Aprovação Assistida para refinar seus detalhes técnicos. Você terá um plano personalizado, treino seco específico, treinamento prático individual e acompanhamento até o dia da avaliação.'
        };
        return recomendacoes[nivelClasse] || '';
    }

    /** Calcula percentual de prontidão */
    function calcularProntidao(pontuacao) {
        return Math.round((pontuacao / 20) * 100);
    }

    /** Gera mensagem completa para WhatsApp */
    function gerarMensagemWhatsApp(nome, telefone, cidadeUF, nivel, pontuacao, blocos) {
        const nivelNome = nivel.nivel;
        const nivelClasse = nivel.classe;
        let msg = `🧠 *PRÉ-LAUDO NEUROCOMBAT - DIAGNÓSTICO INICIAL*\n\n`;
        msg += `📋 *Dados do Aluno*\n`;
        msg += `👤 Nome: ${nome}\n`;
        msg += `📱 Telefone: ${telefone}\n`;
        msg += `📍 Cidade/UF: ${cidadeUF}\n\n`;
        msg += `📊 *Resultado do Diagnóstico*\n`;
        msg += `🎯 Nível: ${nivelNome}\n`;
        msg += `📈 Pontuação: ${pontuacao}/20\n\n`;
        msg += `📚 *Desempenho por Bloco*\n`;
        msg += `⚖️ Legislação: ${blocos.legislacao.acertos}/${blocos.legislacao.total}\n`;
        msg += `🛡️ Segurança: ${blocos.seguranca.acertos}/${blocos.seguranca.total}\n`;
        msg += `🔧 Conhecimento Técnico: ${blocos.tecnico.acertos}/${blocos.tecnico.total}\n`;
        msg += `🎯 Experiência Prática: ${blocos.pratica.pontos}/${blocos.pratica.total * 2}\n\n`;
        msg += `📝 *Respostas do Aluno*\n`;
        perguntas.forEach((p, i) => {
            const resp = respostas[i];
            const respTexto = (resp !== null) ? p.opcoes[resp] : 'Não respondeu';
            msg += `${i+1}. ${p.pergunta}\n`;
            msg += `   → ${respTexto}\n`;
        });
        msg += `\n📋 *Recomendação:* ${gerarRecomendacao(nivelClasse)}\n`;
        msg += `\n🔗 *Próximo passo:* Agendar avaliação personalizada.`;
        return msg;
    }

    /** Gera PDF do Pré-Laudo */
    function gerarPDF(nome, telefone, cidadeUF, nivel, pontuacao, protocolo, prontidao) {
        // Verifica se jsPDF está disponível
        if (typeof window.jspdf === 'undefined') {
            alert('A biblioteca jsPDF não carregou. Tente novamente.');
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        // Fundo
        doc.setFillColor(10, 15, 30);
        doc.rect(0, 0, 210, 297, 'F');

        // Borda dourada
        doc.setDrawColor(212, 175, 55);
        doc.setLineWidth(1.5);
        doc.rect(10, 10, 190, 277);

        // Título
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(212, 175, 55);
        doc.text('PRÉ-LAUDO NEUROCOMBAT', 105, 40, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(148, 163, 184);
        doc.text('Diagnóstico Inicial de Capacidade Técnica', 105, 52, { align: 'center' });

        doc.setDrawColor(212, 175, 55);
        doc.setLineWidth(0.5);
        doc.line(30, 60, 180, 60);

        // Dados
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text('DADOS DO ALUNO', 20, 75);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(148, 163, 184);
        const dados = [
            ['Nome', nome],
            ['Telefone', telefone],
            ['Cidade/UF', cidadeUF],
            ['Protocolo', protocolo],
            ['Data', new Date().toLocaleDateString('pt-BR')]
        ];
        let y = 85;
        dados.forEach(([label, value]) => {
            doc.setTextColor(148, 163, 184);
            doc.text(`${label}:`, 20, y);
            doc.setTextColor(255, 255, 255);
            doc.text(value, 70, y);
            y += 8;
        });

        // Resultado
        y += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text('RESULTADO DO DIAGNÓSTICO', 20, y);
        y += 10;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(148, 163, 184);
        const nivelNome = nivel.nivel;
        const nivelClasse = nivel.classe;
        const cores = { base: [74, 124, 89], tecnica: [212, 175, 55], aprovacao: [232, 122, 42] };
        const cor = cores[nivelClasse] || [212, 175, 55];
        doc.setTextColor(cor[0], cor[1], cor[2]);
        doc.text(`Nível: ${nivelNome}`, 20, y);
        y += 10;

        doc.setTextColor(255, 255, 255);
        doc.text(`Pontuação: ${pontuacao}/20`, 20, y);
        y += 10;

        doc.setTextColor(148, 163, 184);
        doc.text(`Prontidão: ${prontidao}%`, 20, y);
        y += 10;

        // Recomendação
        y += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(212, 175, 55);
        doc.text('RECOMENDAÇÃO', 20, y);
        y += 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        const rec = gerarRecomendacao(nivelClasse);
        const lines = doc.splitTextToSize(rec, 170);
        doc.text(lines, 20, y);
        y += lines.length * 6 + 10;

        // Rodapé
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text('Este documento é um relatório de diagnóstico inicial da NeuroCombat Academy.', 105, 270, { align: 'center' });
        doc.text('Não substitui o Laudo de Capacidade Técnica emitido por profissional habilitado.', 105, 278, { align: 'center' });

        // QR Code placeholder
        doc.setDrawColor(212, 175, 55);
        doc.setLineWidth(0.5);
        doc.rect(160, 75, 30, 30);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6);
        doc.setTextColor(212, 175, 55);
        doc.text('QR Code', 175, 92, { align: 'center' });
        doc.text('NeuroCombat', 175, 98, { align: 'center' });

        doc.save(`Pre-Laudo_NeuroCombat_${protocolo}.pdf`);
    }

    // ===== FUNÇÃO EXPORTADA PARA O BOTÃO "LIBERAR MEU PRÉ-LAUDO" =====
    window.enviarLead = function() {
        const nome = document.getElementById('diagnosticoNome')?.value?.trim() || '';
        const telefone = document.getElementById('diagnosticoTelefone')?.value?.trim() || '';
        const cidade = document.getElementById('diagnosticoCidade')?.value?.trim() || '';
        const uf = document.getElementById('diagnosticoUF')?.value || '';
        const cidadeUF = `${cidade}/${uf}`;

        if (!nome || !telefone || !cidade || !uf) {
            alert('Por favor, preencha todos os campos: Nome, WhatsApp, Cidade e UF.');
            return;
        }

        // Calcular dados
        const { blocos, pontuacaoTotal } = calcularPontuacaoBlocos();
        const nivel = determinarNivel(pontuacaoTotal);
        const protocolo = gerarProtocolo();
        const prontidao = calcularProntidao(pontuacaoTotal);

        // Montar mensagem
        const msg = gerarMensagemWhatsApp(nome, telefone, cidadeUF, nivel, pontuacaoTotal, blocos);

        // Abrir WhatsApp via location.href (mais compatível)
        const url = `https://wa.me/${NUMERO_ACADEMY}?text=${encodeURIComponent(msg)}`;
        location.href = url;

        // Liberar resultado (já que o envio foi feito, podemos mostrar o resultado)
        mostrarResultado(nome, telefone, cidadeUF, nivel, pontuacaoTotal, protocolo, prontidao);
    };

    // ===== FUNÇÃO PARA BAIXAR PDF (exposta globalmente) =====
    window.baixarPDF = function(nome, telefone, cidadeUF, nivelNome, nivelClasse, pontuacao, protocolo, prontidao) {
        const nivelObj = { nivel: nivelNome, classe: nivelClasse };
        gerarPDF(nome, telefone, cidadeUF, nivelObj, pontuacao, protocolo, prontidao);
    };

    // ===== MOSTRAR RESULTADO (versão premium) =====
    function mostrarResultado(nome, telefone, cidadeUF, nivel, pontuacao, protocolo, prontidao) {
        const nomeExibicao = nome || 'Aluno';
        const cidadeExibicao = cidadeUF || 'Não informado';
        const recomendacao = gerarRecomendacao(nivel.classe);

        const html = `
            <div class="pre-laudo-card" id="preLaudoCard">
                <div class="laudo-header">
                    <h2>🧠 Pré-Laudo NeuroCombat</h2>
                    <div class="laudo-protocolo">Protocolo: <span>${protocolo}</span></div>
                </div>
                <div class="laudo-body">
                    <div class="laudo-row">
                        <span class="laudo-label">👤 Aluno</span>
                        <span class="laudo-value">${nomeExibicao}</span>
                    </div>
                    <div class="laudo-row">
                        <span class="laudo-label">📍 Cidade/UF</span>
                        <span class="laudo-value">${cidadeExibicao}</span>
                    </div>
                    <div class="laudo-row">
                        <span class="laudo-label">📅 Data</span>
                        <span class="laudo-value">${new Date().toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div class="laudo-row">
                        <span class="laudo-label">🎯 Nível</span>
                        <span class="laudo-value nivel ${nivel.classe}">${nivel.nivel}</span>
                    </div>
                    <div class="laudo-row">
                        <span class="laudo-label">📈 Pontuação</span>
                        <span class="laudo-value">${pontuacao}/20</span>
                    </div>
                    <div class="laudo-prontidao">
                        <span style="font-size:0.85rem;color:var(--text-muted);">📊 Prontidão</span>
                        <div class="prontidao-bar">
                            <div class="prontidao-fill" style="width:${prontidao}%;"></div>
                        </div>
                        <span class="prontidao-label">${prontidao}%</span>
                    </div>
                    <div style="padding:12px 0;border-top:1px solid rgba(255,255,255,0.05);margin-top:4px;">
                        <p style="color:var(--text-muted);font-size:0.9rem;line-height:1.6;">${recomendacao}</p>
                    </div>
                </div>
                <div class="laudo-actions">
                    <button class="btn-pdf" onclick="baixarPDF('${nomeExibicao}', '${telefone}', '${cidadeExibicao}', '${nivel.nivel}', '${nivel.classe}', ${pontuacao}, '${protocolo}', ${prontidao})">
                        <i class="fas fa-file-pdf"></i> Baixar PDF
                    </button>
                    <a href="https://wa.me/${NUMERO_ACADEMY}?text=${encodeURIComponent('Olá! Fiz o Diagnóstico NeuroCombat e quero saber mais sobre a trilha recomendada.')}" class="btn-whatsapp" target="_blank">
                        <i class="fab fa-whatsapp"></i> Falar com Especialista
                    </a>
                </div>
                <div style="margin-top:16px;text-align:center;font-size:0.7rem;color:var(--text-muted);">
                    Este documento é um relatório de diagnóstico inicial da NeuroCombat Academy.<br>
                    Não substitui o Laudo de Capacidade Técnica emitido por profissional habilitado.
                </div>
            </div>
        `;

        resultadoDiv.innerHTML = html;
        resultadoDiv.style.display = 'block';
        resultadoLiberado = true;

        // Esconder perguntas e navegação
        container.innerHTML = '';
        document.getElementById('btnAnterior').style.display = 'none';
        document.getElementById('btnProximo').style.display = 'none';
        document.getElementById('btnVerResultado').style.display = 'none';
        document.getElementById('progressQuestion').textContent = 'Diagnóstico Concluído';
        document.getElementById('progressPercent').textContent = '100%';
        document.getElementById('progressFill').style.width = '100%';

        // Scroll para o resultado
        setTimeout(() => {
            document.getElementById('diagnostico').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
    }

    // ===== RENDERIZAR PERGUNTA =====
    function renderPergunta(index) {
        const p = perguntas[index];
        let html = `
            <div class="diagnostico-pergunta">
                <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:8px;">
                    Bloco: ${p.bloco} (${index+1}/${TOTAL_PERGUNTAS})
                </div>
                <h4>${p.pergunta}</h4>
                <div class="opcoes">
        `;
        p.opcoes.forEach((opcao, i) => {
            const selected = respostas[index] === i ? 'selected' : '';
            html += `
                <label class="opcao ${selected}">
                    <input type="radio" name="pergunta_${index}" value="${i}" ${respostas[index] === i ? 'checked' : ''}>
                    ${opcao}
                </label>
            `;
        });
        html += `</div></div>`;
        container.innerHTML = html;

        // Event listeners para as opções
        document.querySelectorAll('.opcao').forEach((label) => {
            const radio = label.querySelector('input[type="radio"]');
            radio.addEventListener('change', function() {
                if (this.checked) {
                    const parent = this.closest('.diagnostico-pergunta');
                    parent.querySelectorAll('.opcao').forEach(l => l.classList.remove('selected'));
                    label.classList.add('selected');
                    respostas[index] = parseInt(this.value);
                    atualizarBotoes();
                    atualizarProgresso();
                }
            });
        });
        atualizarBotoes();
        atualizarProgresso();
    }

    function atualizarProgresso() {
        const respondidas = respostas.filter(r => r !== null).length;
        const percent = Math.round((respondidas / TOTAL_PERGUNTAS) * 100);
        progressFill.style.width = percent + '%';
        progressQuestion.textContent = `Pergunta ${respostaAtual + 1} de ${TOTAL_PERGUNTAS}`;
        progressPercent.textContent = percent + '%';
    }

    function atualizarBotoes() {
        btnAnterior.style.display = respostaAtual > 0 ? 'inline-block' : 'none';
        btnProximo.style.display = respostaAtual < TOTAL_PERGUNTAS - 1 ? 'inline-block' : 'none';
        btnVerResultado.style.display = respostaAtual === TOTAL_PERGUNTAS - 1 ? 'inline-block' : 'none';
    }

    function proximo() {
        if (respostaAtual < TOTAL_PERGUNTAS - 1) {
            respostaAtual++;
            renderPergunta(respostaAtual);
            document.getElementById('diagnostico').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function anterior() {
        if (respostaAtual > 0) {
            respostaAtual--;
            renderPergunta(respostaAtual);
            document.getElementById('diagnostico').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // ===== CONFIGURAR BOTÃO "VER RESULTADO" COM BLOQUEIO =====
    btnVerResultado.addEventListener('click', function() {
        const respondidas = respostas.filter(r => r !== null).length;
        if (respondidas < TOTAL_PERGUNTAS) {
            alert(`Por favor, responda todas as ${TOTAL_PERGUNTAS} perguntas antes de ver o resultado. Você respondeu ${respondidas}.`);
            return;
        }

        // Exibe formulário para captura de lead
        const formHtml = `
            <div style="padding:20px 0;text-align:center;">
                <h3 style="color:var(--text-light);margin-bottom:16px;">Preencha seus dados para liberar o resultado</h3>
                <div class="resultado-form" style="max-width:400px;margin:0 auto;">
                    <input type="text" id="diagnosticoNome" placeholder="Seu nome completo" style="padding:14px 18px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:var(--text-light);font-size:0.9rem;width:100%;">
                    <input type="tel" id="diagnosticoTelefone" placeholder="(24) 99999-9999" maxlength="15" style="padding:14px 18px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:var(--text-light);font-size:0.9rem;width:100%;">
                    <div style="display:flex;gap:10px;">
                        <input type="text" id="diagnosticoCidade" placeholder="Cidade" style="flex:2;padding:14px 18px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:var(--text-light);font-size:0.9rem;">
                        <select id="diagnosticoUF" style="flex:1;padding:14px 18px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:var(--text-light);font-size:0.9rem;">
                            <option value="">UF</option>
                            <option value="AC">AC</option>
                            <option value="AL">AL</option>
                            <option value="AP">AP</option>
                            <option value="AM">AM</option>
                            <option value="BA">BA</option>
                            <option value="CE">CE</option>
                            <option value="DF">DF</option>
                            <option value="ES">ES</option>
                            <option value="GO">GO</option>
                            <option value="MA">MA</option>
                            <option value="MT">MT</option>
                            <option value="MS">MS</option>
                            <option value="MG">MG</option>
                            <option value="PA">PA</option>
                            <option value="PB">PB</option>
                            <option value="PR">PR</option>
                            <option value="PE">PE</option>
                            <option value="PI">PI</option>
                            <option value="RJ">RJ</option>
                            <option value="RN">RN</option>
                            <option value="RS">RS</option>
                            <option value="RO">RO</option>
                            <option value="RR">RR</option>
                            <option value="SC">SC</option>
                            <option value="SP">SP</option>
                            <option value="SE">SE</option>
                            <option value="TO">TO</option>
                        </select>
                    </div>
                    <button class="cta-button-primary" style="width:100%;justify-content:center;" onclick="enviarLead()">
                        <i class="fas fa-arrow-right"></i> Liberar Meu Pré-Laudo
                    </button>
                </div>
                <p style="color:var(--text-muted);font-size:0.75rem;margin-top:12px;">Ao enviar, você concorda em receber o diagnóstico completo via WhatsApp.</p>
            </div>
        `;
        resultadoDiv.innerHTML = formHtml;
        resultadoDiv.style.display = 'block';
        container.innerHTML = '';
        btnAnterior.style.display = 'none';
        btnProximo.style.display = 'none';
        btnVerResultado.style.display = 'none';
        progressQuestion.textContent = 'Aguardando dados';
        progressPercent.textContent = '100%';
        progressFill.style.width = '100%';

        // Aplicar máscara de telefone
        const telInput = document.getElementById('diagnosticoTelefone');
        if (telInput) aplicarMascaraTelefone(telInput);

        document.getElementById('diagnostico').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // ===== EVENTOS DE NAVEGAÇÃO =====
    btnProximo.addEventListener('click', proximo);
    btnAnterior.addEventListener('click', anterior);

    // ===== INICIAR =====
    renderPergunta(0);

})();
