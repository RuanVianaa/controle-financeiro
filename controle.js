const form = document.getElementById('form');
const descImput = document.getElementById('descricao');
const valorImput = document.getElementById('montante');
const balancoH1 = document.getElementById('balanco');
const receitaP = document.getElementById('din-positivo')
const despesaP = document.getElementById('din-negativo')

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
});

function somaAoSaldo(transacao){
    const valorTransacao = transacao.valor;

    let total = balancoH1.innerHTML.replace('R$', '');
    total = parseFloat(total)
    total += valorTransacao;
    balancoH1.innerHTML = `R$${total.toFixed(2)}`
}