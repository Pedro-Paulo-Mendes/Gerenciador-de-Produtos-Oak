let produtos = JSON.parse(localStorage.getItem('produtosPremium')) || [];
let idProdutoExclusao = null;
let imagemBase64Atual = ''; // NOVO: Variável para guardar a imagem "traduzida" em texto

const telaListagem = document.getElementById('tela-listagem');
const telaCadastro = document.getElementById('tela-cadastro');
const formProduto = document.getElementById('form-produto');
const tabelaCorpo = document.getElementById('tabela-corpo');
const estadoVazio = document.getElementById('estado-vazio');
const inputBusca = document.getElementById('busca-produto');
const modalOverlay = document.getElementById('modal-overlay');
const tituloForm = document.getElementById('titulo-form');
const inputImagem = document.getElementById('imagem'); // NOVO
const previewImagem = document.getElementById('preview-imagem'); // NOVO

document.getElementById('btn-novo-produto').addEventListener('click', () => abrirFormulario());
document.getElementById('btn-cancelar').addEventListener('click', abrirListagem);
document.getElementById('btn-cancelar-exclusao').addEventListener('click', fecharModal);
document.getElementById('btn-confirmar-exclusao').addEventListener('click', deletarProduto);
inputBusca.addEventListener('input', (e) => renderizarTabela(e.target.value));

// NOVO: A Lógica do FileReader (Transforma foto em texto)
inputImagem.addEventListener('change', function(evento) {
    const arquivo = evento.target.files[0];
    
    if (arquivo) {
        // Trava de segurança: Limite de 2MB (2 * 1024 * 1024 bytes)
        if (arquivo.size > 2097152) {
            mostrarToast('A imagem é muito grande. Escolha uma foto com menos de 2MB.', 'erro');
            inputImagem.value = ''; // Limpa o campo
            return;
        }

        const leitor = new FileReader();
        
        leitor.onload = function(e) {
            imagemBase64Atual = e.target.result; // Guarda o texto gigante
            previewImagem.src = imagemBase64Atual; // Mostra na tela
            previewImagem.classList.remove('hidden');
        };
        
        leitor.readAsDataURL(arquivo); // Inicia a tradução
    }
});

function abrirFormulario(produto = null) {
    telaListagem.classList.add('hidden');
    telaCadastro.classList.remove('hidden');
    
    if (produto) {
        tituloForm.textContent = 'Editar Produto';
        document.getElementById('produto-id').value = produto.id;
        document.getElementById('nome').value = produto.nome;
        document.getElementById('descricao').value = produto.descricao;
        document.getElementById('valor').value = produto.valor;
        document.getElementById('disponivel').value = produto.disponivel;
        
        // NOVO: Carrega a imagem existente na edição
        imagemBase64Atual = produto.imagem || '';
        if (imagemBase64Atual) {
            previewImagem.src = imagemBase64Atual;
            previewImagem.classList.remove('hidden');
        } else {
            previewImagem.classList.add('hidden');
        }
    } else {
        tituloForm.textContent = 'Cadastrar Produto';
        formProduto.reset();
        document.getElementById('produto-id').value = '';
        
        // NOVO: Limpa a imagem ao criar um novo
        imagemBase64Atual = '';
        previewImagem.src = '';
        previewImagem.classList.add('hidden');
    }
}

function abrirListagem() {
    telaCadastro.classList.add('hidden');
    telaListagem.classList.remove('hidden');
    inputBusca.value = ''; 
    renderizarTabela();
}

function salvarDados() {
    // Usamos um bloco try-catch, pois se o localStorage lotar, ele avisa o usuário sem quebrar o site
    try {
        localStorage.setItem('produtosPremium', JSON.stringify(produtos));
    } catch (e) {
        mostrarToast('Erro ao salvar. A memória do navegador está cheia (limite de fotos).', 'erro');
    }
}

function renderizarTabela(filtro = '') {
    tabelaCorpo.innerHTML = '';
    let listaFiltrada = produtos.filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()));
    listaFiltrada.sort((a, b) => a.valor - b.valor);

    if (listaFiltrada.length === 0) {
        estadoVazio.classList.remove('hidden');
        document.querySelector('table').classList.add('hidden');
    } else {
        estadoVazio.classList.add('hidden');
        document.querySelector('table').classList.remove('hidden');

        listaFiltrada.forEach(produto => {
            const tr = document.createElement('tr');
            const badgeClasse = produto.disponivel === 'sim' ? 'badge-sim' : 'badge-nao';
            const badgeTexto = produto.disponivel === 'sim' ? 'Sim' : 'Não';
            const valorFormatado = produto.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            
            // NOVO: Se o produto não tiver foto, mostramos um ícone padrão cinza de "sem foto"
            const imgSrc = produto.imagem || 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2245%22%20height%3D%2245%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20x%3D%223%22%20y%3D%223%22%20width%3D%2218%22%20height%3D%2218%22%20rx%3D%222%22%20ry%3D%222%22%3E%3C%2Frect%3E%3Ccircle%20cx%3D%228.5%22%20cy%3D%228.5%22%20r%3D%221.5%22%3E%3C%2Fcircle%3E%3Cpolyline%20points%3D%2221%2015%2016%2010%205%2021%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E';

            tr.innerHTML = `
                <td><img src="${imgSrc}" class="img-miniatura" alt="Foto"></td>
                <td><strong>${produto.nome}</strong></td>
                <td>${valorFormatado}</td>
                <td><span class="badge ${badgeClasse}">${badgeTexto}</span></td>
                <td class="acoes-td">
                    <button class="btn-secondary btn-icon" onclick="prepararEdicao('${produto.id}')" title="Editar">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-danger btn-icon" onclick="abrirModalExclusao('${produto.id}')" title="Excluir">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            tabelaCorpo.appendChild(tr);
        });
    }
}

formProduto.addEventListener('submit', function(e) {
    e.preventDefault();

    const idAtual = document.getElementById('produto-id').value;
    const valorInput = parseFloat(document.getElementById('valor').value);

    if (valorInput < 0) {
        mostrarToast('O valor não pode ser negativo!', 'erro');
        return;
    }

    const dadosProduto = {
        id: idAtual || Date.now().toString(),
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        valor: valorInput,
        disponivel: document.getElementById('disponivel').value,
        imagem: imagemBase64Atual // NOVO: Salva a imagem no objeto do produto
    };

    if (idAtual) {
        const index = produtos.findIndex(p => p.id === idAtual);
        produtos[index] = dadosProduto;
        mostrarToast('Produto atualizado com sucesso!', 'sucesso');
    } else {
        produtos.push(dadosProduto);
        mostrarToast('Produto cadastrado com sucesso!', 'sucesso');
    }

    salvarDados();
    abrirListagem();
});

window.prepararEdicao = function(id) {
    const produto = produtos.find(p => p.id === id);
    if (produto) abrirFormulario(produto);
}

window.abrirModalExclusao = function(id) {
    idProdutoExclusao = id;
    modalOverlay.classList.remove('hidden');
}

function fecharModal() {
    idProdutoExclusao = null;
    modalOverlay.classList.add('hidden');
}

function deletarProduto() {
    if (idProdutoExclusao) {
        produtos = produtos.filter(p => p.id !== idProdutoExclusao);
        salvarDados();
        renderizarTabela();
        mostrarToast('Produto excluído!', 'sucesso');
        fecharModal();
    }
}

function mostrarToast(mensagem, tipo = 'sucesso') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `<i class="fa-solid ${tipo === 'sucesso' ? 'fa-check-circle' : 'fa-circle-exclamation'}"></i> ${mensagem}`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

renderizarTabela();