function ControlWeb($){
    
    this.mostrarCrearPartida=function(){
        var cadena='<div id="mostrarCP">';
        cadena=cadena+'<div class="form-group">';
        cadena = cadena+'<label for="usr">Nick:</label>';
        cadena = cadena+'<input type="text" class="form-control" id="nick">';
        cadena = cadena+'</div>';
        cadena = cadena+'<div class="form-group">';
        cadena = cadena+'<label for="num">Numero:</label>';
        cadena = cadena+'<input type="text" class="form-control" id="num">';
        cadena = cadena+'</div>';
        cadena = cadena+'<button type="button" id="btnCrearPartida" class="btn btn-primary">Crear partida</button>';
        cadena = cadena+'</div>';

        $('#crearPartida').append(cadena);
        //si utilizamos # sirve para decirle a JQuery que lo que busco es un elemento de mi pagina web,
        //cuyo id se llama como sigue.
        //Si no podenemos nada delante, entonces busca una etiqueta HTML
        //Si ponemos un punto entonces busca una class. 

        //Lo que hago dentro de la function click es lo que va a realizarse cuando hacemos click al boton.
        $('#btnCrearPartida').on('click',function(){
            var nick = $('#nick').val();
            var num=$('#num').val();
            $("#mostrarCP").remove();
            ws.crearPartida(nick,num);
        });
    }

    this.mostrarEsperandoRival=function(){
        $('#mER').remove();
         var cadena="<div id='mER'>";
         cadena = cadena+"<img src='Cliente/img/KentBeckWaiting.jpg'>";
         cadena=cadena+"</div>";
         $('#esperando').append(cadena);
    }

    this.mostrarUnirAPartida=function(lista){
        $('#mUAP').remove();
        var cadena='<div id="mUAP">';
        cadena = cadena+'<div class="list-group">';
        for(var i=0; i<lista.length;i++){
            cadena = cadena+'<a href="#" value="'+lista[i].codigo+'" class="list-group-item">'+lista[i].codigo+' huecos:'+lista[i].huecos+'</a>';
        }
        cadena = cadena+'</div>';      
        cadena = cadena+'<button type="button" id="btnUnirAPartida" class="btn btn-primary">Unir a partida</button>';
        cadena = cadena+'</div>';

        $('#unirAPartida').append(cadena);

        StoreValue = []; 
        $(".list-group a").click(function(){
            StoreValue = []; 
            StoreValue.push($(this).attr("value")); 
        });

        $('#btnUnirAPartida').on('click',function(){
            var nick = $('#nick').val();
            var codigo=StoreValue[0];
            $("#mUAP").remove();
            ws.unirAPartida(nick,codigo);
        });
    }



}