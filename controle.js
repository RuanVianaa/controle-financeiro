const form = document.getElementById('form');
const descImput = document.getElementById('descricao');
const valorImput = document.getElementById('montante');
const balancoH1 = document.getElementById('balanco');
const receitaP = document.getElementById('din-positivo')
const despesaP = document.getElementById('din-negativo')
const transacoesUL = document.getElementById('transacoes')

// Local Storage
// const chave_trancacoes_ls = 'transacoes'
// let transacoesSalvas;
// try{
// transacoesSalvas = JSON.parse(localStorage.getItem(chave_trancacoes_ls));
// } catch (error) {
//     transacoesSalvas = null;
// }
// if (transacoesSalvas == null || transacoesSalvas == undefined) {
//   transacoesSalvas = [];
// }
const chave_trancacoes_ls = 'transacoes'
const transacoesSalvas = JSON.parse(localStorage.getItem(chave_trancacoes_ls)) || [];



form.addEventListener('submit', (e) => {
    e.preventDefault();

    const descTransacao = descImput.value.trim();
    const valorTransacao = valorImput.value.trim();

    if ((descTransacao == "") || (valorTransacao == "")){
        alert('Descrição e valor não podem estar vazios. ')
        return;
    }
    descImput.value = "";
    valorImput.value = "";

    const transacao = {
        id:parseInt(Math.random() * 1000),
        descricao: descTransacao,
        valor: parseFloat(valorTransacao)
    }

    
    somaAoSaldo(transacao)
    somaReceitaDespesa(transacao);
    addTransacaoAoDOM(transacao);

    transacoesSalvas.push(transacao)
    localStorage.setItem(chave_trancacoes_ls, JSON.stringify(transacoesSalvas))
});

function addTransacaoAoDOM(transacao){
    const operador = transacao.valor >= 0 ? '' : '-'
    const classeCSS = transacao.valor >= 0 ? 'positivo' : 'negativo'

    const li = document.createElement('li')
    li.classList.add(classeCSS)
    li.innerHTML = `${transacao.descricao} <span>${operador} R$ ${Math.abs(transacao.valor).toFixed(2)}</span><button class="delete-btn">X</button>`;
    transacoesUL.append(li)
}

function somaReceitaDespesa (transacao){
    const elemento = transacao.valor > 0 ? receitaP : despesaP;
    const substituir = transacao.valor > 0 ? "+ R$" : "- R$";
    let valorAtual = elemento.innerHTML.replace(substituir, "")
    valorAtual = parseFloat(valorAtual)
    valorAtual += Math.abs(transacao.valor);
    elemento.innerHTML = `${substituir}${valorAtual.toFixed(2)}`
}

function somaAoSaldo(transacao){
    const valorTransacao = transacao.valor;

    let total = balancoH1.innerHTML.replace('R$', '');
    total = parseFloat(total)
    total += valorTransacao;
    balancoH1.innerHTML = `R$${total.toFixed(2)}`
}

function carregarDados(){
    transacoesUL.innerHTML = ''
    balancoH1.innerHTML = 'R$0.00'
    receitaP.innerHTML = '+ R$0.00'
    despesaP.innerHTML = '- R$0.00'

    for(let i = 0; i < transacoesSalvas.length; i++){
        somaAoSaldo(transacoesSalvas[i])
        somaReceitaDespesa(transacoesSalvas[i])
        addTransacaoAoDOM(transacoesSalvas[i])
    }
}

carregarDados();