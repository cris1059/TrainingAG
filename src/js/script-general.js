/* 
@Autor Princiapl: Cristopher Camacho Duran
@File: script-general.js
@Path: .\src\js\script-general.js
@App: Training Algoritmos Geneticos

@Colaboradores: Brandon Lenny Rodriguez Arrieta
                Iniestra Sanchez Eduardo
                Romero Tapia Alberto Angel
                Bautista Alvarado Carlos Santiago
*/

document.addEventListener('DOMContentLoaded', ()=> document.querySelector('body').addEventListener('click', listener));
let activemodal = '', dataBinary = [], dataDecimal = [], dataReal = [], dataAdaptacion = [],
dataAdaptacionPorcen = [], jsonData;

//DATOS GENERALES
let seleccion, cruce, mutacion, tcruce, tmutacion, funcion, rangoini, rangofin, 
adaptacion_total = 0, parejas = [], indices = [], cromo_parejas = [];

const listener = (event) => {
    if(event.target && event.target.id == 'population') modal(event.target.id);
    if(event.target && event.target.classList.contains('change')) change(event.target.id);
    if(event.target && event.target.id == 'loadfile-active') loadfile();
    if(event.target && event.target.id == 'close') modal('population');
    if(event.target && event.target.id == 'population-single-btn') addPopulationSingle();
    if(event.target && event.target.id == 'generate-calculos') procesar();
}

function modal(pane) {
    let modal = document.getElementById("tab-pane-"+pane);
    modal.classList.toggle("modal");
    activemodal = pane;
}

function btn_active(event){
    document.getElementById(event.target.id + '-active').classList.toggle('btn-active');
}

function change(id){
    document.getElementById(id).addEventListener('change', btn_active);
}

function loadfile(){
    const file = document.getElementById('loadfile').files[0];
    let reader = new FileReader();

    reader.onload = function(e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: 'array' });

        let firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        jsonData = XLSX.utils.sheet_to_json(firstSheet); 
        writetable();
    };

    reader.readAsArrayBuffer(file);
    
}


function writetable() {
    let data = document.getElementById('data');
    if (jsonData.length < 20 && dataBinary.length < 20) {
        for (let i = 0; i < jsonData.length; i++) {
            let element = jsonData[i].Cromosoma;
            dataBinary.push(element);
            data.innerHTML += `
                <tr class = "roww">
                    <td>${(dataBinary.length)}</td>
                    <td>${element}</td>
                </tr>`;
        }
        
    }else{
        document.getElementById('data-loaded-complete').innerHTML = `
        <h3>BD Almacenada (Tu BD es muy grande para mostrarla)</h3>`;
    }
    if(data != null && data.classList.contains('no-data')){
        document.getElementById('data-loaded-complete').classList.toggle('modal');
        data.classList.toggle('no-data');
    }
}

function addPopulationSingle(){
    let element = document.getElementById('cromosoma-input').value;
    dataBinary.push(element);
    data.innerHTML += `
                <tr class = "roww">
                    <td>${(dataBinary.length)}</td>
                    <td>${element}</td>
                </tr>`;
}

function procesar() {
    seleccion, cruce, mutacion, tcruce, tmutacion, funcion, rangoini, rangofin, 
    adaptacion_total = 0, parejas = [], indices = [], cromo_parejas = [], dataDecimal = [], dataReal = [], dataAdaptacion = [],
    dataAdaptacionPorcen = [], jsonData;
    let validate_metodo, validate_convergencia, validate_param;
    for (let i = 0; i < dataBinary.length; i++) dataBinary[i] = borrarEspacios(dataBinary[i]);
    
    //OBTENEMOS LOS METODOS
    seleccion = document.getElementById('seleccion').value;
    cruce = document.getElementById('cruce').value;
    mutacion = document.getElementById('mutacion').value;

    //OBTENEMOS LA CONVERGENCIA
    tcruce = parseInt(document.getElementById('tasa_de_cruce').value);
    tmutacion = parseInt(document.getElementById('tasa_de_mutacion').value);

    //OBTENEMOS LOS PARAMETROS DE INICIALIZACION

    funcion = document.getElementById('function').value;
    let rango = (document.getElementById('range').value).split(',');
    rangoini = parseInt(rango[0]);
    rangofin = parseInt(rango[1]);

    //VALIDACION DE QUE TODOS LOS CAMPOS ESTEN LLENOS
    validate_metodo = (seleccion != '-1' && cruce != '-1' && mutacion != '-1');
    validate_convergencia = (tcruce != NaN && tmutacion != NaN);
    validate_param = (funcion != '' && rangoini >=0 && rangofin >= 0);

    if(validate_metodo && validate_convergencia && validate_param){
        normalizedData();
    }
}


//NORMALIZAMOS LOS DATOS EN EL RANGO DADO POR EL USUARIO
function normalizedData() {
    for (let i = 0; i < dataBinary.length; i++) {
        let cromo = dataBinary[i];
        let cromo_dec = binaryOfDecimal(cromo);
        dataDecimal.push(cromo_dec);
        if(cromo_dec > rangofin){
            xmax = (2 ** cromo.length)-1;
            let cromo_real = (cromo_dec/xmax) * (rangofin-rangoini) + rangoini;
            dataReal.push(cromo_real);
            let adaptacion = evaluarFuncion(funcion, cromo_real);
            dataAdaptacion.push(adaptacion);
            adaptacion_total += adaptacion;
        }
    }
    metodo(seleccion, cruce, mutacion);
}


//SE EJECUTARAN LOS METODOS SEGUN LO SELECCIONADO
function metodo(seleccion, cruce, mutacion) {
    //METODOS
    let s, c, m;
    //SELECCION
    if(seleccion == 'ruleta') s = ruleta();
    if(seleccion == 'torneo') s = torneo();
    if(seleccion == 'ranking') s = ranking();
    if(seleccion == 'truncamiento') alert("Oh Oh, Truncamiento sigue en pruebas");  //s = truncamiento();
    if(seleccion == 'entocastica') s = estocasticoUniversal();

    //CRUCE
    if(cruce == 'unpunto') c = unpunto();
    if(cruce == 'dospuntos') c = dospuntos();
    if(cruce == 'uniforme') c = cruceUniforme();
    if(cruce == 'aritmetico') c = cruceAritmetico();

    //MUTACION
    if(mutacion == 'simple') m = mutasionSimple();
    if(mutacion == 'uniforme') m = mutacionUniforme();
    if(mutacion == 'nouniforme') m = mutacionNoUniforme();
    if(mutacion == 'gaussiana') m = mutacionGaussiana();


    //ESCRITURA DE LOS RESULTADOS
    if(s && c && m) writeResult();
}

//METODO ESCRITURA DE RESULTADOS EN PARTE GRAFICA
function writeResult() {
    let data = document.getElementById('data_result');
    console.log(data);
        for (let i = 0; i < dataBinary.length; i++) {
            let element = dataBinary[i];
            if(indices.includes(i)){
                data.innerHTML += `
                <tr class = "afect">
                    <td>${(i+1)}</td>
                    <td>${element}</td>
                </tr>`;
            } else {
                data.innerHTML += `
                <tr class = "roww">
                    <td>${(i+1)}</td>
                    <td>${element}</td>
                </tr>`;
            }
            
        }
}
