// Ao clicar no botão Calcular, é recuperado os valores das habilidades e iniciado o BranchAndBound
$('#btn-calcular').click(function (event) {
	var nrProfSelecionados, nrDiscSelecionadas;

	// Recupera professores selecionados
	var profs = []
	$("input[name='chk_profs']:checked").each(function () {
		profs.push($(this).val());
	});

	// Recupera disciplinas selecionadas
	var disc = []
	$("input[name='chk_disc']:checked").each(function () {
		disc.push($(this).val());
	});

	// Recupera as habilidades digitadas
	var habilidade = [];
	for (var i = 0; i < profs.length; i++) {
		habilidade.push([]);
		for (let j = 0; j < disc.length; j++) {
			habilidade[i].push(
				parseInt($('#hab' + i + j).val())
			);
		}
	}

    // Inicia o Branch And Bound
	var r = iniciar(habilidade);

	// Adiciona os valores no vetor melhorAtribuicaoValor
    for (let i = 0; i < r.length; i++) {
		melhorAtribuicaoValor[i] = habilidade[i][r[i]];
	}

	// Exibi o resultado
	exibirResultado(r);

});

// Exibe a tabela com o resultado
function exibirResultado(r) {
	var tabela = $('#tabelaResultado');

	$('#divResultado').css("display", "block");

	// Recupera os professores selecionados
	var profs = []
	$("input[name='chk_profs']:checked").each(function () {
		profs.push($(this).val());
	});

	// Recupera as disciplinas selecionadas
	var disc = []
	$("input[name='chk_disc']:checked").each(function () {
		disc.push($(this).val());
	});

	for (let i = 0; i < profs.length; i++) {
		var novaLinha = $("<tr>");
		var cols = "";
		cols += '<td>' + profs[i] + '</td>';
		cols += '<td>' + disc[r[i]]  + '</td>';
		cols += '<td>' + r[i]  + '</td>';
		cols += '<td>' + melhorAtribuicaoValor[i]  + '</td>';
		novaLinha.append(cols);
		tabela.append(novaLinha);
	}

	var novaLinha = $('<tr class="table-success tr-bold">');
	var cols = "";
	cols += '<td colspan="3" class="text-center">Total</td>';
	cols += '<td>' + getHabilidadeAcumulada() + '</td>';
	novaLinha.append(cols);
	tabela.append(novaLinha);
}

// Após a seleção dos professores e das disciplinas, ao clicar no botão "Concluir", é criado o 
// formulário para digitação das habilidades
$('#btn_gerar_formulario').click(function (event) {

	$('#divForm').css("display", "block");

	var nrProfSelecionados, nrDiscSelecionadas;

	// Recupera professores selecionados
	var profs = []
	$("input[name='chk_profs']:checked").each(function () {
		profs.push($(this).val());
	});

	// Recupera disciplinas selecionadas
	var disc = []
	$("input[name='chk_disc']:checked").each(function () {
		disc.push($(this).val());
	});

	nrProfSelecionados = profs.length;
	nrDiscSelecionadas = disc.length;

	if (nrProfSelecionados == 0 || nrDiscSelecionadas == 0) {
		alert('Selecione os professores e as disciplinas');
		return;
	}
	if (nrProfSelecionados != nrDiscSelecionadas) {
		alert('O número de professores e disciplinas devem ser iguais');
		return;
	}

    var tituloProf = $('#cabecalhoProf');
	for (let i = 0; i < disc.length; i++) {
		const element = disc[i];
		tituloProf.append('<div id="coldisc' + i + '" class="col coluna-box-tabela">');
		var y = $('#coldisc' + i);
		y.append('<label>' + element + '</label>');
		tituloProf.append('</div>');
	}

	for (let i = 0; i < nrProfSelecionados; i++) {

		var tabela = $('#divProf');

		var corLinha = '';
		
		if(i % 2 == 0){
			corLinha = 'linhaCinza';
		}
		else {
            corLinha = 'linhaBranca';
		}

		tabela.append('<div class="row ' + corLinha + '" id="row' + i + '">');

		var r = $('#row' + i);
		r.append('<div class="col" id="col' + i + '">');

		var c = $('#col' + i);
		c.append('<label>' + profs[i] + '</label>');

		r.append('</div>')

		for (var j = 0; j < nrDiscSelecionadas; j++) {
			var x = document.createElement("input");
			x.setAttribute("type", "number");
			x.setAttribute("class", "form-control");
			x.setAttribute("id", "hab" + i + j);
			x.setAttribute("placeholder", "Nível de Conh.");

			r.append('<div class="col coluna-box-tabela" id="col' + i + '_' + j + '">');
			var cinp = $('#col' + i + '_' + j);
			cinp.append(x);
			r.append('</div>');
		}

		tabela.append('</div>');

	}
});

var melhorAtribuicao = []; 
var melhorAtribuicaoValor = []; 
var maiorHabilidade;

// Inicia a execução do algoritmo
function iniciar(matriz) {

	this.maiorHabilidade = Number.MIN_SAFE_INTEGER;

	for (let i = 0; i < matriz.length; i++) {
		this.melhorAtribuicao[i] = Number.MIN_SAFE_INTEGER;
	}

	atrib = [];

	this.branchAndBound(matriz, atrib, 0);

	return this.melhorAtribuicao;
}


function branchAndBound(matriz, atrib, habilidadeAcumuluda) {
	if ((this.melhorAtribuicao.length == atrib.length) && (habilidadeAcumuluda > this.maiorHabilidade)) {
		for (let b = 0; b < this.melhorAtribuicao.length; b++) {
			this.melhorAtribuicao[b] = atrib[b];
		}

		this.maiorHabilidade = habilidadeAcumuluda;
	}
	else {
		for (let c = 0; c < matriz.length; c++) {

			if (this.VerificarConsistencia(atrib, c)) {
				let index = atrib.length;
				atrib.push(c);
				this.branchAndBound(matriz, atrib, (habilidadeAcumuluda + matriz[index][c]));
				atrib.splice(index, 1);
			}
		}
	}
}

//  Realiza a verificação se a disciplina já foi atribuida
function VerificarConsistencia(atrib, col) {
	for (let i = 0; i < atrib.length; i++) {
		if (atrib[i] == col) {
			return false;
		}
	}

	return true;
}

function getHabilidadeAcumulada() {
	return this.maiorHabilidade;
}

function getMelhorConfiguracao() {
	return this.melhorAtribuicao;
}

