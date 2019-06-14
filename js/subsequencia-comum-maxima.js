function carregarDadosIniciais() {
    // Variáveis globais
    contadorLinhas = 0;
    arrayDnas = new Array();

    // Carregando a lista inicial
    arrayDnas[0] = new Array('OMMUOKVKNVKYETROGRKUDMZFL', 'Luiz Alves');
    arrayDnas[1] = new Array('RYCSBTPJWTZZXUWXEHYBKJOXC', 'Adriana Pratto');
    arrayDnas[2] = new Array('EVZLJRUDQFLFYZBUBZRHWJLJL', 'Marcos Pontes');
    arrayDnas[3] = new Array('WFIAWPCNTWLVEQGWATAPHMAWX', 'João Santos');
    arrayDnas[4] = new Array('WNPIEFHAJULOGSPDNWCODKLJL', 'Maria Pereira');

    // Percorre a lista e monta o html do Grid de cadastro
    for (var i = 0; i < arrayDnas.length; i++)
        montarGridCadastro(arrayDnas[i][0], arrayDnas[i][1]);
}

function cadastrarDNA() {
    // Pega os valores dos inputs
    var dna = $('#txtDna').val().toUpperCase();
    var nome = $('#txtNome').val();

    // Verifica se os valores não são nulos
    if (dna != '' && nome != '') {
        // Adiciona os valores ao array
        arrayDnas[arrayDnas.length] = new Array(dna, nome);

        // Chama o método que monta o html do Grid de cadastro
        montarGridCadastro(dna, nome);
    }
}

function montarGridCadastro(dna, nome) {
    // Montando a estrutura de linhas e colunas
    var novaLinha = $('<tr>');
    var colunas = '';

    colunas += '<td>' + dna + '</td>';
    colunas += '<td>' + nome + '</td>';

    // Adiciona um botão de excluir e atribui um id a ele
    colunas += '<td><img id="' + dna + '" class="btnRemover' + contadorLinhas + '" src="img/icone-trash.png" /></td>';

    novaLinha.append(colunas);

    // Adiciona a estrutura criada na tabela  de cadastro
    $('table.listaDnas').append(novaLinha);

    // Cria a opção de exclusão de registros
    $('table.listaDnas').on('click', '.btnRemover' + contadorLinhas, function (event) {

        // Remove a linha da tabela
        $(this).closest('tr').remove();

        // Percorre o array e remove a posição de acordo com o id 
        for (var i = 0; i < arrayDnas.length; i++) {
            if (this.id == arrayDnas[i][0]) {
                arrayDnas.splice(i, 1);
                return;
            }
        }
    });

    // Para cada linha inserida na tabela, é somado 1.
    // Isso é necessário para auxiliar na remoção do registro
    contadorLinhas++;
}

function pesquisarDNA() {
    // Pega os valores do input
    var pesquisa = $('#txtPesquisa').val().toUpperCase();

    // Verifica se o valor não é nulo
    if (pesquisa != '') {
        for (var i = 0; i < arrayDnas.length; i++) {
            // Passa os valores do array para a função SCM, que retorna os caracteres compatíveis com a pesquisa.
            var dnaCompativel = retornarSCM(arrayDnas[i][0], pesquisa);

            // Grava o resultadoado e quantidade de caracteres no array
            arrayDnas[i][2] = dnaCompativel;
            arrayDnas[i][3] = dnaCompativel.length;
        }

        // Ordena o array por tamanho, ordem decrescente
        var arrayOrdenado = arrayDnas.sort(function (a, b) {
            return a[3] < b[3];
        });

        // Apaga os registros a cada pesquisa, para não duplicar os itens no Grid
        $("#tbListaPesquisa").html("");

        // Chama o método que monta o html do Grid de pesquisa
        for (var i = 0; i < arrayOrdenado.length; i++)
            montarGridPesquisa(i + 1, arrayOrdenado[i][1], arrayOrdenado[i][2], arrayOrdenado[i][3]);
    }
}

function montarGridPesquisa(posicao, nome, compatibilidade, total) {
    // Montando a estrutura de linhas e colunas
    var novaLinha = $('<tr>');
    var colunas = '';

    colunas += '<td>' + posicao + '</td>';
    colunas += '<td>' + nome + '</td>';

    // Se não tiver nenhum caracter compativel, atribui zero para a coluna
    if (total != '0')
        colunas += '<td>' + total + ' - ' + compatibilidade + '</td>';
    else
        colunas += '<td>' + total + '</td>';

    novaLinha.append(colunas);

    // Adiciona a estrutura criada na tabela de pesquisa
    $('table.listaPesquisa').append(novaLinha);
}

// Algoritmo dinâmico para resolução do problema de Subsequencia Comum Máxima
function retornarSCM(X, Y) {
    var lenX = X.length,
        lenY = Y.length,
        C = [];

    // Inicializa a primeira linha e coluna com 0
    for (i = 0; i <= lenX; i++)
        C.push([0]);
    for (j = 0; j < lenY; j++)
        C[0].push(0);

    // Realiza o cálculo de comprimento e retorna a SCM
    for (i = 0; i < lenX; i++)
        for (j = 0; j < lenY; j++)
            C[i + 1][j + 1] = X[i] === Y[j] ? C[i][j] + 1 : Math.max(C[i + 1][j], C[i][j + 1]);        
    return (function f(i, j) {
        if (i * j === 0)
            return "";
        if (X[i - 1] === Y[j - 1])
            return f(i - 1, j - 1) + X[i - 1];
        return (C[i][j - 1] > C[i - 1][j]) ? f(i, j - 1) : f(i - 1, j);
    }(lenX, lenY));
}

// Chama o metodo ao iniciar a página
carregarDadosIniciais();