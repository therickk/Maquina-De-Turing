$(document).ready(function() {
    var palabra = "";
    var vel = 1; //velocidad
    var error = "Error en la palabra ingresada, intentelo denuevo";

$.getJSON('json/lang.json',function(json){
    $('#lenguage').click(function(){
        let leng = $(this).val();
        $('.lang').each(function(index,value){
            if($(this).attr('key') == 'palabra'){
                $(this).attr("placeholder", json[leng][$(this).attr('key')]);
            }else if($(this).attr('key') == 'mensaje'){
                if ($(this).innerHTML == "") {
                    $(this).text(json[leng][$(this).attr('key')]);
                }
                error = json[leng][$(this).attr('key')];
            }else{
                $(this).text(json[leng][$(this).attr('key')]);
            }
        })
    });
});

var elInput3 = document.querySelector('#velocidad');

if (elInput3) {
  var w = parseInt(window.getComputedStyle(elInput3, null).getPropertyValue('width'));
  var etq = document.querySelector('.etiqueta');
  var valor= elInput3.value;
  valor=valor/1000 + ' S'
  if (etq) {
    etq.innerHTML = valor;
    var pxls = w / 100;
    etq.style.left = ((elInput3.value * pxls) - 15) + 'px';

    elInput3.addEventListener('input', function() {
      valor= elInput3.value;
      valor= valor / 1000 + ' S'
      etq.innerHTML = valor; 
      etq.style.left = ((elInput3.value * pxls) - 15) + 'px';
    }, false);
  }
}

var vecnode=[];
var vecedges=[];
var nodes = new vis.DataSet([
    { id: 0, label: "q0"},
    { id: 1, label: "q1"},
    { id: 2, label: "q2"},
    { id: 3, label: "q3"},
    { id: 4, label: "q4"},
    { id: 5, label: "gf", title:'Fin' }
]);

var edges = new vis.DataSet([
    {id:6, from: 0, to: 1, arrows: "to", label:'a.a ->R' },
    {id:7, from: 0, to: 2, arrows: "to", label:'b.a ->R'},
    {id:8, from: 1, to: 3, arrows: "to" , label:'¬ ->L'},
    {id:15, from: 1, to: 2, arrows: "to" , label:'b.a ->R'},
    {id:9, from: 1, to: 1, arrows: "to", label:'a.a ->R' },
    {id:10, from: 2, to: 3, arrows: "to" , label:'¬ ->L'},
    {id:11, from: 2, to: 2, arrows: "to" , label:'b.a -> R'},
    {id:16, from: 2, to: 1, arrows: "to" , label:'a.a ->R'},
    {id:12, from: 3, to: 3, arrows: "to", label:'a.a ->L , _->L'},
    {id:17, from: 3, to: 5, arrows: "to", label:'¬ ->R'},
    {id:18, from: 0, to: 4, arrows: "to", label:'_ ->R'},
    {id:19, from: 1, to: 4, arrows: "to", label:'_ ->R'},
    {id:20, from: 2, to: 4, arrows: "to", label:'_ ->R'},
    {id:21, from: 4, to: 4, arrows: "to", label:'_ ->R'},
    {id:22, from: 4, to: 1, arrows: "to", label:'a.a ->R'},
    {id:23, from: 4, to: 2, arrows: "to", label:'b.a ->R'},
    {id:24, from: 4, to: 3, arrows: "to", label:'¬ ->R'}
]);

// create a network
var container = document.getElementById("mynetwork");
var data = {
    nodes: nodes,
    edges: edges,
};

var options = {
    width: '100%',
    height: '400px',
    nodes:{
        color:{
            background: 'white',
            border: 'gray',
            highlight: {background: 'pink', border: 'red' }
        }
    },
    edges:{
        color:'gray'
    }
};

var network = new vis.Network(container, data, options);

function limpiargrafo(){
    for(let i=0;i <= 5;i++){
        data.nodes.update({id: i,label:'q'+i,
            color:{
                background: 'white',
                border: 'gray',
                highlight: { background: 'pink', border: 'red' }
            }
        });
    }
    data.nodes.update({id: 5, label: 'gf'});
    for(let i=0;i<vecedges.length;i++){
        data.edges.update({id:vecedges[i], color:'gray'});
    }
    $("#mensaje").text("");
}

function limpiarcinta(){
    palabra = "";
    inicio = (ancho/2)-(MEDIDA_CUADRO/2);
    draw();
}

$("#validar").click(function(){
    limpiargrafo();
    let pal = palabra;
    limpiarcinta();
    palabra = pal;
    vel = $("#velocidad").val();
    mqt('q0',0);
});

$("#limpiar").click(function(){
    limpiargrafo();
    limpiarcinta();
    $("#palabra").val("");
});

function pintarActual(idArista, idNodo){    
        data.edges.update({id: idArista,color:'green'});
        vecedges.push(idArista);    
        data.nodes.update({id: idNodo,color:'green'});
        vecnode.push(idNodo);    
}

function leera(estado,aux){    
    if(estado =='q0' || estado =='q1'|| estado =='q2' || estado == 'q4'){
        setTimeout(function(){
            derecha();
            if(estado =='q0'){
                pintarActual(6,0);
                pintarActual(6,1);
            }else if(estado =='q1'){
                limpiargrafo();
                pintarActual(9,1);
            }else if(estado =='q4'){
                limpiargrafo();
                pintarActual(22,1);
            }else{
                limpiargrafo();
                pintarActual(16,1);
            }
            mqt('q1',aux+1);  
        },vel);
        return;
    }else if(estado == 'q3'){
        setTimeout(function(){
            izquierda();
            limpiargrafo();
            pintarActual(12,3);
            mqt('q3',aux-1); 
        }, vel);
        return; 
    }       
}

function leerb(estado,aux){
    if(estado =='q0' || estado=='q2' || estado == 'q4'){
        setTimeout(function(){ 
            derecha();
            if(estado =='q0'){
                pintarActual(7,0);
                pintarActual(7,2);
            }else if(estado =='q4'){
                limpiargrafo();
                pintarActual(23,2);
            }else{
                limpiargrafo();
                pintarActual(11,2);
            }
            palabra = palabra.replace("b",'a');
            mqt('q2',aux+1);
        }, vel);
        return; 
    }else{
        setTimeout(function(){
            derecha();
            limpiargrafo(); 
            pintarActual(15,2);
            palabra = palabra.replace("b",'a');
            mqt('q2',aux+1);
        }, vel);
        return; 
    }
} 

function leersp(estado,aux){
    setTimeout(function(){
        if(estado == 'q0' || estado == 'q1' || estado == 'q2' || estado == 'q4'){
            derecha();
            if(estado == 'q0'){
                limpiargrafo();
                pintarActual(18,4);
            }else if(estado == 'q1'){
                limpiargrafo();
                pintarActual(19,4);
            }else if(estado == 'q2'){
                limpiargrafo();
                pintarActual(20,3);
            }else{
                limpiargrafo();
                pintarActual(21,4);
            }    
            mqt('q4',aux+1);
        }else if(estado == 'q3'){
            izquierda();
            limpiargrafo();
            pintarActual(24,3);
            mqt('q3',aux-1); 
            return; 
        }
    }, vel);
    return;
}

function mqt(estado,aux){
    if(palabra.charAt(aux) != ''){
        if(palabra.charAt(aux) == 'a'){
            leera(estado,aux);
        }else if(palabra.charAt(aux) == 'b'){
            leerb(estado,aux);  
        }else if((palabra.charAt(aux) == ' ')){
            leersp(estado,aux);
        }else {
            $("#mensaje").text(error);
            return;
        }
    }else{
        if(estado == 'q1' || estado == 'q2'|| estado == 'q3'){
            if(estado == 'q1' || estado == 'q2'){
                setTimeout(function(){
                izquierda();
                if(estado == 'q1'){
                    limpiargrafo();
                    pintarActual(8,3);
                }else{
                    limpiargrafo();
                    pintarActual(10,3);
                    
                }
                mqt('q3',aux-1);
                }, vel);
                return;
            }else{
                setTimeout(function(){
                    derecha();
                    limpiargrafo();
                    pintarActual(17,5);
                }, vel);
                return;
            }
            return;
        }
    }
    return;
}
    
    var vector = [];
    vector.length = 40;
    const canvas = document.querySelector("#canvas");

    const context = canvas.getContext("2d");
    const MEDIDA_CUADRO = 30;
    const MARGEN = 3;

    var ancho = document.getElementById("cinta").offsetWidth - MARGEN;
    canvas.width = ancho;
    canvas.height = MEDIDA_CUADRO + (MARGEN*2); 
    var inicio = (ancho/2)-(MEDIDA_CUADRO/2);

    draw();
    function draw(){
        context.clearRect(0,0,canvas.width,canvas.height); //limpiar

        context.fillStyle = "black";
        context.fillRect((ancho/2)-((MEDIDA_CUADRO/2)+MARGEN), 0, MEDIDA_CUADRO+MARGEN*2, MEDIDA_CUADRO+MARGEN*2);
        
        var der = inicio;
        var izq = der - (MEDIDA_CUADRO + MARGEN);

        for (var i = 0; i < vector.length; i++) {
            //pintar derecha
            context.fillStyle = "#8BC3A3";
            context.fillRect(der, MARGEN, MEDIDA_CUADRO, MEDIDA_CUADRO);
            context.fillStyle = "white";
            context.font="bold 15px arial";
            context.fillText(palabra.charAt(i),der+MEDIDA_CUADRO/2-5,(MEDIDA_CUADRO+MARGEN*2+10)/2);
            der += MEDIDA_CUADRO + MARGEN;

            //pintar izquierda
            context.fillStyle = "#8BC3A3";
            context.fillRect(izq, MARGEN, MEDIDA_CUADRO, MEDIDA_CUADRO);
            izq -= MEDIDA_CUADRO + MARGEN;
        }
    }

    $("#cargar").click(function(){
        palabra = $("#palabra").val(); 
        draw();       
    });

    function derecha(){
        can = MEDIDA_CUADRO + MARGEN;
        for (var i = 1; i <= can; i++) {
            setTimeout(function(){
                inicio--;
                draw();
            }, 200);
        }       
    }

    function izquierda(){
        can = MEDIDA_CUADRO + MARGEN;
        for (var i = 1; i <= can; i++) {
            setTimeout(function(){
                inicio++;
                draw();
            }, 200);            
        }       
    }

});
