function carregarDadosIniciais() {
    // Variáveis globais
    contadorLinhas = 0;
    arrayProdutos = new Array();

    // Carregando a lista inicial
    arrayProdutos[0] = new Array('1', 'Cerveja Skol', 10, 60);
    arrayProdutos[1] = new Array('2', 'Cerveja Brahma', 20, 100);
    arrayProdutos[2] = new Array('3', 'Cerveja Crystal', 30, 120);
    arrayProdutos[3] = new Array('4', 'Cerveja Antarctica', 10, 80);
    arrayProdutos[4] = new Array('5', 'Cerveja Bavaria', 5, 30);

    // Percorre a lista e monta o html do Grid de cadastro
    for (var i = 0; i < arrayProdutos.length; i++)
        montarGridCadastro(arrayProdutos[i][0], arrayProdutos[i][1], arrayProdutos[i][2], arrayProdutos[i][3]);
}

function cadastrarProduto() {
    // Pega os valores dos inputs
    var produto = $('#txtProduto').val();
    var qtde = $('#txtQtde').val();
    var valor = $('#txtValor').val();

    // Verifica se os valores não são nulos
    if (produto != '' && qtde != '' && valor != '') {
        // Adiciona os valores ao array
        var posicao = arrayProdutos.length;
        arrayProdutos[posicao] = new Array(posicao + 1, produto, qtde, valor);

        // Chama o método que monta o html do Grid de cadastro
        montarGridCadastro(posicao + 1, produto, qtde, valor);
    }
}

function montarGridCadastro(posicao, produto, quantidade, valor) {
    // Montando a estrutura de linhas e colunas
    var novaLinha = $('<tr>');
    var colunas = '';

    colunas += '<td>' + posicao + '</td>';
    colunas += '<td>' + produto + '</td>';
    colunas += '<td>' + quantidade + '</td>';
    colunas += '<td>' + 'R$ ' + parseFloat(valor).toFixed(2) + '</td>';

    // Adiciona um botão de excluir e atribui um id a ele
    colunas += '<td><img id="' + posicao + '" class="btnRemover' + contadorLinhas + '" src="img/icone-trash.png" /></td>'

    novaLinha.append(colunas);

    // Adiciona a estrutura criada na tabela  de cadastro
    $('table.listaProdutos').append(novaLinha);

    // Cria a opção de exclusão de registros
    $('table.listaProdutos').on('click', '.btnRemover' + contadorLinhas, function (event) {

        // Remove a linha da tabela
        $(this).closest('tr').remove();

        // Percorre o array e remove a posição de acordo com o id 
        for (var i = 0; i < arrayProdutos.length; i++) {
            if (this.id == arrayProdutos[i][0]) {
                arrayProdutos.splice(i, 1);
                return;
            }
        }
    });

    // Para cada linha inserida na tabela, é somado 1.
    // Isso é necessário para auxiliar na remoção do registro
    contadorLinhas++;
}

// Algoritmo guloso para resolução do problema da Mochila Fracionária
function calcularMF() {
    if ($('#txtCapacidadeMaxima').val() != '') {
        var capacidadeMaxima = parseFloat($('#txtCapacidadeMaxima').val());
        var capacidadeAtual = 0,
            valorTotal = 0;

        // Ordena o array por valor / por quantidade, ordem decrescente
        var arrayOrdenado = arrayProdutos.sort(function (a, b) {
            return (parseFloat(a[3]) / parseFloat(a[2])) < (parseFloat(b[3]) / parseFloat(b[2]));
        });

        // Variável que guarda os valores para plotagem
        var dadosGrafico = [];

        for (i = 0; i < arrayOrdenado.length; i++) {
            // Se a adição do produto não exceder a capacidade, adicione-o completamente
            if (parseFloat(arrayOrdenado[i][2]) + capacidadeAtual <= capacidadeMaxima) {
                capacidadeAtual = capacidadeAtual + parseFloat(arrayOrdenado[i][2]);
                valorTotal = valorTotal + parseFloat(arrayOrdenado[i][3]);

                // Gravando os valores parciais
                dadosGrafico.push({
                    label: arrayOrdenado[i][1],
                    y: parseFloat(arrayOrdenado[i][2]),
                    indexLabel: 'R$ ' + parseFloat(arrayOrdenado[i][3]).toFixed(2)
                });
            }
            // Se a adição do produto exceder a capacidade, adicione uma fração dele
            else {

                // Se a mochila já tem o valo exato, sai do for
                if (capacidadeAtual == capacidadeMaxima)
                    break;

                // Se ainda tem espaço na mochila, adiciona a fração faltante
                var capacidadeRestante = (capacidadeMaxima - capacidadeAtual);
                var valorAux = capacidadeRestante * (parseFloat(arrayOrdenado[i][3]) / parseFloat(arrayOrdenado[i][2]));
                capacidadeAtual = capacidadeAtual + capacidadeRestante;
                valorTotal = valorTotal + valorAux;

                // Gravando os valores parciais
                dadosGrafico.push({
                    label: arrayOrdenado[i][1],
                    y: capacidadeRestante,
                    indexLabel: 'R$ ' + parseFloat(valorAux).toFixed(2)
                });

                break;
            }
        }

        // Exibe o valor total da mochila
        $('#divValorTotal').html('<p class="h6 font-weight-bold">O valor máximo é: ' + 'R$ ' + parseFloat(valorTotal).toFixed(2) + '</p>');

        // Chama o método para montagem do gráfico
        montarGrafico(dadosGrafico);
    }
}

// Gráfico que exibe a ordem dos itens adicionados na mochila
function montarGrafico(dadosGrafico) {
    var chart = new CanvasJS.Chart("graficoContainer", {
        animationEnabled: true,
        theme: "light2",
        axisY: {
            title: "Quantidade"
        },
        data: [{
            type: "column",
            toolTipContent: "{label} <br> Quantidade: {y} <br> Valor: {indexLabel}",
            dataPoints: dadosGrafico
        }]
    });
    chart.render();
}

// Chama o metodo ao iniciar a página
carregarDadosIniciais();