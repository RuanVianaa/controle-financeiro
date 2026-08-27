const form = document.getElementById('form');
const descImput = document.getElementById('descricao');
const valorImput = document.getElementById('montante');
const balancoH1 = document.getElementById('balanco');
const receitaP = document.getElementById('din-positivo')
const despesaP = document.getElementById('din-negativo')
const transacoesUL = document.getElementById('transacoes')

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
});

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
