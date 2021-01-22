function ControlWeb($) {

    this.mostrarCrearPartida = function () {
        var cadena = '<div id="mostrarCP">';
        cadena = cadena + '<div class="form-group">';
        cadena = cadena + '<label for="usr">Nick:</label>';
        cadena = cadena + '<input type="text" class="form-control" id="nick">';
        cadena = cadena + '</div>';
        cadena = cadena + '<div class="form-group">';
        cadena = cadena + '<label for="num">Numero:</label>';
        cadena = cadena + '<input type="text" class="form-control" id="num">';
        cadena = cadena + '</div>';
        cadena = cadena + '<button type="button" id="btnCrearPartida" class="btn btn-primary">Crear partida</button>';
        cadena = cadena + '</div>';

        $('#crearPartida').append(cadena);
        //si utilizamos # sirve para decirle a JQuery que lo que busco es un elemento de mi pagina web,
        //cuyo id se llama como sigue.
        //Si no podenemos nada delante, entonces busca una etiqueta HTML
        //Si ponemos un punto entonces busca una class. 

        //Lo que hago dentro de la function click es lo que va a realizarse cuando hacemos click al boton.
        $('#btnCrearPartida').on('click', function () {
            var nick = $('#nick').val();
            var num = $('#num').val();
            $("#mostrarCP").remove();
            ws.crearPartida(nick, num);
        });
    }

    this.mostrarListaPartidas = function (lista) {

        $('#mostrarListaPartidas').remove();
        var cadena = '<div id="mostrarListaPartidas"><h3>Elegir partida</h3>';
        cadena = cadena + '<div class="list-group" id="lista">';
        for (var i = 0; i < lista.length; i++) {
            var maximo = lista[i].maximo;
            var numJugadores = maximo - lista[i].huecos;
            cadena = cadena + '<a href="#" value="' + lista[i].codigo + '" class="list-group-item">' + lista[i].codigo + '<span class="badge">' + numJugadores + '/' + maximo + '</span></a>';
        }
        cadena = cadena + '</div>';
        //cadena=cadena+'</div>';
        cadena = cadena + '<input type="button" class="btn btn-primary btn-md" id="unirme" value="Unirme">'; '</div>';

        $('#listaPartidas').append(cadena);
        StoreValue = []; //Declare array
        $(".list-group a").click(function () {
            StoreValue = []; //clear array
            StoreValue.push($(this).attr("value")); // add text to array
        });

        $('#unirme').click(function () {
            var codigo = "";
            codigo = StoreValue[0];
            console.log(codigo);
            var nick = $('#nick').val();
            if (codigo && nick) {
                $('#mostrarListaPartidas').remove();
                $('#crearPartida').remove();
                ws.unirAPartida(nick, codigo);
            }
        });
    }

    this.mostrarEsperandoRival = function () {
        this.limpiar();
        var cadena = '<div id="mER"><h3>Esperando oponente</h3>';
        cadena = cadena + "<img src='Cliente/img/KentBeckWaiting.jpg'>";
        if (ws.owner) {
            cadena = cadena + '<input type="button" class="btn btn-primary btn-md" id="iniciar" value="Iniciar partida">';
        }
        cadena = cadena + '</div>';
        $('#esperando').append(cadena);
        $('#iniciar').click(function () {
            ws.iniciarPartida();
        });
    }

    this.mostrarUnirAPartida = function (lista) {
        $('#mUAP').remove();
        var cadena = '<div id="mUAP">';
        cadena = cadena + '<div class="list-group">';
        for (var i = 0; i < lista.length; i++) {
            cadena = cadena + '<a href="#" value="' + lista[i].codigo + '" class="list-group-item">' + lista[i].codigo + ' huecos:' + lista[i].huecos + '</a>';
        }
        cadena = cadena + '</div>';
        cadena = cadena + '<button type="button" id="btnUnir" class="btn btn-primary">Unir a partida</button>';
        cadena = cadena + '</div>';

        $('#unirAPartida').append(cadena);

        var StoreValue = [];
        $(".list-group a").click(function () {
            StoreValue = []; //clear array
            StoreValue.push($(this).attr("value")); // add text to array
        });

        $('#btnUnir').on('click', function () {
            var nick = $('#nick').val();
            var codigo = StoreValue[0];
            $("#mUAP").remove();
            ws.unirAPartida(nick, codigo);
        });
    }

    this.mostrarListaJugadores = function (lista) {
        $('#mostrarListaEsperando').remove();
        var cadena = '<div id="mostrarListaEsperando"><h3>Lista Jugadores</h3>';
        cadena = cadena + '<ul class="list-group">';
        for (var i = 0; i < lista.length; i++) {
            cadena = cadena + '<li class="list-group-item">' + lista[i] + '</li>';
        }
        cadena = cadena + '</ul></div>';
        $('#listaEsperando').append(cadena);
    }
    this.limpiar = function () {
        $('#mUAP').remove();
        $('#mCP').remove();
        $('#mostrarListaPartidas').remove();
        $('#mER').remove();
        $('#mostrarListaEsperando').remove();
    }

}