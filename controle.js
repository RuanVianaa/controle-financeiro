const form = document.getElementById("form");
const descImput = document.querySelector("#descricao");
const valorImput = document.getElementById("montante");
const balancoH1 = document.getElementById("balanco");
const receitaP = document.getElementById("din-positivo");
const despesaP = document.getElementById("din-negativo");
const transacoesUL = document.getElementById("transacoes");

// ls == Local Storage
const chave_transacoes_ls = "transacoes";
let transacoesSalvas;
try {
  transacoesSalvas = JSON.parse(localStorage.getItem(chave_transacoes_ls));
} catch (error) {
  transacoesSalvas = null;
}
if (transacoesSalvas == null || transacoesSalvas == undefined) {
  transacoesSalvas = [];
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const descTransacao = descImput.value.trim();
    const valorTransacao = valorImput.value.trim();
    

    if ((descTransacao == "") || (valorTransacao == "")){
        alert('Descrição e valor não podem ser vazios.')
        return;
    }
    
    descImput.value = "";
    valorImput.value = "";
    const novoId = transacoesSalvas.length === 0 
        ? 0 
        : transacoesSalvas[transacoesSalvas.length - 1].id + 1;
    const tipoTransacao = document.getElementById('tipo').value;
    const valorInformado = parseFloat(valorTransacao);

    let valorFinal;
    if (tipoTransacao === 'despesa') {
        valorFinal = -Math.abs(valorInformado); 
    } else {
        valorFinal = Math.abs(valorInformado);  
    }

    const transacao = {
        id: novoId,
        descricao: descTransacao,
        valor: valorFinal
    }

    somaAoSaldo(transacao)
    somaReceitaDespesa(transacao)
    addTransacaoAoDOM(transacao)

    transacoesSalvas.push(transacao)
    localStorage.setItem(chave_transacoes_ls, 
        JSON.stringify(transacoesSalvas))
});

function addTransacaoAoDOM(transacao) {
  const classeCSS = transacao.valor >= 0 ? "positivo" : "negativo";

  const li = document.createElement("li");
  li.classList.add(classeCSS);
  li.dataset.id = transacao.id
  li.innerHTML = `${transacao.descricao} 
                    <span>R$${transacao.valor}</span>
                    <button onClick="excluiTransacao(${transacao.id})" 
                            class="delete-btn">X</button>`;

  transacoesUL.append(li);
}

function somaReceitaDespesa(transacao) {
  const elemento = transacao.valor > 0 ? receitaP : despesaP;
  const substituir = transacao.valor > 0 ? "+ R$" : "- R$";
  let valorAtual = elemento.innerHTML.replace(substituir, "");
  valorAtual = parseFloat(valorAtual);
  valorAtual += Math.abs(transacao.valor);
  elemento.innerHTML = `${substituir}${valorAtual.toFixed(2)}`;
}

function somaAoSaldo(transacao) {
  const valorTransacao = transacao.valor;

  let total = balancoH1.innerHTML.replace("R$", "");
  total = parseFloat(total);
  total += valorTransacao;
  balancoH1.innerHTML = `R$${total.toFixed(2)}`;
}

function carregarDados() {
  transacoesUL.innerHTML = "";
  balancoH1.innerHTML = "R$0.00";
  receitaP.innerHTML = "+ R$0.00";
  despesaP.innerHTML = "- R$0.00";

  for (let i = 0; i < transacoesSalvas.length; i++) {
    somaAoSaldo(transacoesSalvas[i]);
    somaReceitaDespesa(transacoesSalvas[i]);
    addTransacaoAoDOM(transacoesSalvas[i]);
  }
}
carregarDados();

function excluiTransacao(id) {
    const transacao = transacoesSalvas.find((item) => item.id === id);
    if (!transacao) return; 
    const elementoLI = document.querySelector(`li[data-id="${id}"]`);
    if (elementoLI) {
        elementoLI.remove();
    }
    const transacaoIndex = transacoesSalvas.findIndex((item) => item.id === id);
    transacoesSalvas.splice(transacaoIndex, 1);
    localStorage.setItem(chave_transacoes_ls, JSON.stringify(transacoesSalvas));
    atualizarTotaisAposExclusao(transacao);
}

function atualizarTotaisAposExclusao(transacaoExcluida) {
    let totalBalanco = parseFloat(balancoH1.innerHTML.replace('R$', ''));
    totalBalanco -= transacaoExcluida.valor;
    balancoH1.innerHTML = `R$${totalBalanco.toFixed(2)}`;
    if (transacaoExcluida.valor > 0) {

        let receitaAtual = parseFloat(receitaP.innerHTML.replace('+ R$', ''));
        receitaAtual -= transacaoExcluida.valor;
        receitaP.innerHTML = `+ R$${receitaAtual.toFixed(2)}`;
    } else {
        let despesaAtual = parseFloat(despesaP.innerHTML.replace('- R$', ''));
        despesaAtual -= Math.abs(transacaoExcluida.valor);
        despesaP.innerHTML = `- R$${despesaAtual.toFixed(2)}`;
    }
}