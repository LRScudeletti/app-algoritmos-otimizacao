// Prepara os parametros e chama a função que realiza o cálculo da mochila booleana
function calcularMB() {

	var itens = [];
	var pesos = [];
	var valores = [];

	// Adiciona os itens da tela nos devidos vetores (itens, pesos, valores)
	for (let i = 0; i < arrayProdutos.length; i++) {
		itens.push(arrayProdutos[i][1]);
		pesos.push(arrayProdutos[i][2]);
		valores.push(arrayProdutos[i][3]);
	}

    // Lê a capacidade digitada pelo usuário
	var capacidade = $('#txtCapacidadeMaxima').val();
    if (capacidade != '') {
		// Chama a função que realiza o cálculo da mochila
		mochilaBooleana(pesos, valores, valores.length, capacidade, itens);
	}
	
}

// Realiza os cálculos
function mochilaBooleana(pesos, valores, nrElementos, capacidade, itens) {

    // Matriz de 0/1 que guarda os itens selecionados (=1)
	var itensSelecionados = []; 

	// Matriz resultante dos cálculos: armazena os valores obtidos pelas subsoluções
	var tab = [];

	// Percorre os elementos
	for (let i = 0; i <= nrElementos; i++) {
		
		itensSelecionados.push([]);
		tab.push([]);

		for (let w = 0; w <= capacidade; w++) {
			itensSelecionados[i][w] = 0;

			// Inicializo as posicões de tab com zero
			if (i == 0 || w == 0){
				tab[i][w] = 0;
			}
			else if (pesos[i - 1] <= w) { // Se o item cabe na mochila

				tab[i][w] = Math.max(valores[i - 1] + tab[i - 1][w - pesos[i - 1]], tab[i - 1][w]);
				
				if (valores[i - 1] + tab[i - 1][w - pesos[i - 1]] > tab[i - 1][w]) {
					itensSelecionados[i][w] = 1; // se caso couber outro item, eu indico que ele está na mochila !
				}

			}
			else { // Se o item não coube na mochila
				tab[i][w] = tab[i - 1][w];
			}
			
		}
	}

	// Recupero os itens selecionados
	var nomesSelecionados = [];
	var pesosSelecionados = [];
	var valoresSelecionados = [];

	var solucaoPeso = 0;
	var solucaoValor = 0;

	var k = capacidade;

	for (let i = nrElementos; i >= 0; i--) {
		if (itensSelecionados[i][k] == 1)
		{
			nomesSelecionados.push(itens[i - 1]);
			pesosSelecionados.push(pesos[i - 1]);
			valoresSelecionados.push(valores[i - 1]);
			solucaoPeso += pesos[i - 1]; 
			solucaoValor += valores[i - 1];
			k = k - pesos[i - 1]; 
		}
	}

	// Exibe os resultados
	var divResultado = '<h3 class="h3Center">Resultados</h3>';
	$('#divResultado').html(divResultado);

	var htmlResultado = '';
	
	htmlResultado += '<table class="table table-bordered">';
	htmlResultado += '<thead class="thead-dark">';
	htmlResultado += '<tr>';
	htmlResultado += '<th scope="col">Itens adicionados</th>';
	htmlResultado += '<th scope="col">Peso</th>';
	htmlResultado += '<th scope="col">Valor</th>';
	htmlResultado += '</tr>';
	htmlResultado += '</thead>';
	
	htmlResultado += '<tfoot>';
	htmlResultado += '<tr class="table-success tr-bold">';
	htmlResultado += '<td>Total</td>';
	htmlResultado += '<td>' + solucaoPeso + '</td>';
	htmlResultado += '<td>R$ ' + parseFloat(solucaoValor).toFixed(2) + '</td>';
	htmlResultado += '</tr>';
	htmlResultado += '</tfoot>';

	htmlResultado += '<tbody>';

	for (let i = 0; i < nomesSelecionados.length; i++) {
		htmlResultado += '<tr>';
		htmlResultado += '<td>' + nomesSelecionados[i] + '</td>';
		htmlResultado += '<td>' + pesosSelecionados[i] + '</td>';
		htmlResultado += '<td> R$ ' + parseFloat(valoresSelecionados[i]).toFixed(2) + '</td>';
		htmlResultado += '</tr>';
	}

	htmlResultado +='</tbody>';
	htmlResultado +='</table>';

	htmlResultado += '<p class="h6 font-weight-bold">O valor máximo é: ' + 'R$ ' + parseFloat(solucaoValor).toFixed(2) + '</p>';
	htmlResultado += '<p class="h6 font-weight-bold">Peso utilizado: ' + solucaoPeso + '</p>';
	 
	$('#divValorTotal').html(htmlResultado);
}

function carregarDadosIniciais() {
    // Variáveis globais
    contadorLinhas = 0;
    arrayProdutos = new Array();

    // Carregando a lista inicial
    arrayProdutos[0] = new Array('1', 'Iphone 8', 200, 4000);
    arrayProdutos[1] = new Array('2', "TV Samsung 40'", 2000, 3500);
    arrayProdutos[2] = new Array('3', 'Notebook Dell Inspiron 3550', 1500, 3200);
    arrayProdutos[3] = new Array('4', 'E-reader Amazon Kindle', 150, 450);
    arrayProdutos[4] = new Array('5', 'Caixa de som Bluetoth', 250, 430);

    // Percorre a lista e monta o html do Grid de cadastro
    for (var i = 0; i < arrayProdutos.length; i++)
        montarGridCadastro(arrayProdutos[i][0], arrayProdutos[i][1], arrayProdutos[i][2], arrayProdutos[i][3]);
}

function cadastrarProduto() {
    // Pega os valores dos inputs
    var produto = $('#txtProduto').val();
    var peso = parseInt($('#txtPeso').val());
    var valor = parseInt($('#txtValor').val());

    // Verifica se os valores não são nulos
    if (produto != '' && peso != '' && valor != '') {
        // Adiciona os valores ao array
        var posicao = arrayProdutos.length;
        arrayProdutos[posicao] = new Array(posicao + 1, produto, peso, valor);

        // Chama o método que monta o html do Grid de cadastro
        montarGridCadastro(posicao + 1, produto, peso, valor);
    }
}

function montarGridCadastro(posicao, produto, peso, valor) {
    // Montando a estrutura de linhas e colunas
    var novaLinha = $('<tr>');
    var colunas = '';

    colunas += '<td>' + posicao + '</td>';
    colunas += '<td>' + produto + '</td>';
    colunas += '<td>' + peso + '</td>';
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

// Chama o metodo ao iniciar a página
carregarDadosIniciais();