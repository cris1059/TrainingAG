/* 
@Autor: Cristopher Camacho Duran
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

        let firstSheet = workbook.Sheets[workbook.SheetNames[0]]; // Primera hoja
        jsonData = XLSX.utils.sheet_to_json(firstSheet); // Convierte la hoja a JSON
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

    //CRUCE
    if(cruce == 'unpunto') c = unpunto();

    //MUTACION
    if(mutacion == 'simple') m = mutasionSimple();


    //ESCRITURA DE LOS RESULTADOS
    if(s && c && m) writeResult();
}


//METODO SELECCION RULETA
function ruleta() {

    for (let i = 0; i < dataAdaptacion.length; i++) {
        let adaptacion = dataAdaptacion[i]/adaptacion_total;
        let porcen = parseInt(adaptacion*100);

        for (let j = 0; j < porcen; j++) {
            dataAdaptacionPorcen.push(dataBinary[i]);      
        }
    }

    let ncromosomas = (tcruce*dataBinary.length)/100;
    if (ncromosomas > 1.6 && ncromosomas < 2) ncromosomas = 2; 
    else if(!ncromosomas < 1.6){
        ncromosomas = Math.floor(ncromosomas);
        if(ncromosomas % 2 != 0) ncromosomas++;
    }

    for (let i = 0; i < ncromosomas; i++) cromo_parejas.push(dataAdaptacionPorcen[numeroAleatorio(0, dataAdaptacionPorcen.length)]);

    for (let i = 0, j = 0; i < cromo_parejas.length; i+= 2, j++) parejas[j] = [cromo_parejas[i], cromo_parejas[i+1]];
    
    for (let i = 0; i < cromo_parejas.length; i++) indices.push(buscarEnArreglo(dataBinary, cromo_parejas[i]));

return true;}


//METODO CRUCE UN PUNTO
function unpunto() {
    for (let i = 0; i < parejas.length; i++) {
        let r = numeroAleatorio(0, parejas[i][0].length);

        let parte1cromo1 = parejas[i][0].slice(0, r);
        let parte2cromo1 = parejas[i][0].slice(r);

        let parte1cromo2 = parejas[i][1].slice(0, r);
        let parte2cromo2 = parejas[i][1].slice(r);

        dataBinary[indices[i++]] = parte1cromo1+parte2cromo2;
        dataBinary[indices[i++]] = parte2cromo1+parte1cromo2;
    }return true;
}


//METODO MUTACION SIMPLE
function mutasionSimple() {
    console.log(indices);
    for (let i = 0; i < indices.length; i++) {
        let cromosoma = dataBinary[indices[i]];
        let por = Math.round((tmutacion*cromosoma.length)/100);
        console.log(indices[i]);
        let indiceremplazo = [];
        for (let j = 0; j < por; j++) {
            
            let cond = true, r;
            while (cond) {
                r = numeroAleatorio(0, cromosoma.length-1);
                if(!indiceremplazo.includes(r)) {
                    indiceremplazo.push(r);
                    cond = false;
                }
            }
            console.log("r = "+r);
            let carac = '1';
            console.log(dataBinary[indices[i]][r]);
            if(dataBinary[indices[i]][r] == '1') carac = '0';
            dataBinary[indices[i]] = sustituirCaracterPorIndice(dataBinary[indices[i]], r, carac);   
            console.log(dataBinary[indices[i]][r]);
            
        }
        console.log(dataBinary[indices[i]]);
    }
return true;}

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
