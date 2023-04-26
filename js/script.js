function exibirErro(mensagem) {
    let erro = document.getElementById('div-erro');
    erro.style.display = 'block';
    erro.innerHTML = '<b>Erro ao acessar a API:</b><br />' + mensagem;
}
async function carregarInf() {

    let erro = document.getElementById('div-erro');
    erro.style.display = 'none';

    await fetch('https://covid19-brazil-api.vercel.app/api/report/v1/countries')
        .then(response => response.json())
        .then(dados => prepararDados(dados))
        .catch(e => exibirErro(e.message));
    await fetch('https://covid19-brazil-api.now.sh/api/report/v1')
        .then(response => response.json())
        .then(dadosTab => prepararTabela(dadosTab))
        .catch(e => exibirErro(e.message));

    mapa.style.display = 'block';
    pizza.style.display = 'block';

}

function prepararDados(dados) {
    paises = [
        ['pais', 'casos']
    ]
    for (let i = 0; i < dados['data'].length; i++) {
        paises.push(
            [dados['data'][i].country,
            dados['data'][i].confirmed]
        )
    }
    pizza = [
        ['casos', 'total']]

    let confirmados = 0;
    let mortos = 0;
    let recuperados = 0;

    for (let i = 0; i < dados['data'].length; i++) {
        confirmados = confirmados + dados['data'][i].confirmed;

        mortos = mortos + dados['data'][i].deaths;
        recuperados = recuperados + dados['data'][i].recovered
    }
    pizza.push(['confirmados', confirmados])
    pizza.push(['mortos', mortos])
    pizza.push(['recuperados', recuperados])

    desenharPizza()
    desenharMapa()
}
var paises = [
    ['pais', 'casos'],
    ['0', 0]
]

google.charts.load('current', {
    'packages': ['geochart'],
});
google.charts.setOnLoadCallback(desenharMapa);

function desenharMapa() {
    var data = google.visualization.arrayToDataTable(paises);

    var options = {
        colorAxis: { colors: ['#fc0404', '#fc7c7c', '#830101', '#970101'] },
        backgroundColor: '#81d4fa',
    };

    var chart = new google.visualization.GeoChart(document.getElementById('mapa'));

    chart.draw(data, options);
}

var pizza = [
    ['casos', 'total'],
    ['', 0]
]
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(desenharPizza);

function desenharPizza() {

    var data = google.visualization.arrayToDataTable(pizza);

    var options = {
        title: 'Quantia de Casos',
        colors:['#970101','#fc0404'],
        is3D: true,
    };

    var chart = new google.visualization.PieChart(document.getElementById('pizza'));

    chart.draw(data, options);
}

//

function prepararTabela(dadosTab) {
    let linhas = document.getElementById('linhas');
    linhas.innerHTML = '';

    for (let i = 0; i < dadosTab['data'].length; i++) {
        let auxLinha = '';

        if (i % 2 != 0)
            auxLinha = '<tr class="listra">';
        else
            auxLinha = '<tr>';

        auxLinha += '<td>' + dadosTab['data'][i].state + '</td>' +
            '<td>' + dadosTab['data'][i].uf + '</td>' +
            '<td>' + dadosTab['data'][i].cases + '</td>' +
            '<td>' + dadosTab['data'][i].deaths + '</td>' +
            '<td class = "sus">' + dadosTab['data'][i].suspects + '</td>' +
            '<td class = "sus">' + dadosTab['data'][i].refuses + '</td>' +
            '</tr>';

        linhas.innerHTML += auxLinha;

    }

}