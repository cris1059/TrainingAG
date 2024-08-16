document.addEventListener('DOMContentLoaded', listen);

let lleno = document.getElementById('datosllenos');
let binarios = [], real = [], adaptado = [];
let funcion = "", min = 0, max = 0, minAdaptado = 0, maxAdaptado = 0;

function listen() {

    const body = document.querySelector('body');
    body.addEventListener('click', clicks);
    
}

function clicks(event) {

    if(event.target && event.target.id == 'add_binary') addBinary();
    if(event.target && event.target.id == 'minmax') addminmax();
    if(event.target && event.target.id == 'addfuncion') addfuncion();
    if(event.target && event.target.id == 'entrada_file') loadFile();
    
}

function addBinary() {
    const fileInput = document.getElementById('entrada_file');
    const file = fileInput.files[0];
    if(document.getElementById('input_binary').value != '' && funcion != ''){    
        if(binarios.length == 0){
            let tabla = document.querySelector('table');
            tabla.style.display = 'block';
        }
        let binari = document.getElementById('input_binary');
        let binario = binari.value;
        binarios.push(binario);
        let dec = binarioADecimal(binario);
        let tbody = document.querySelector('tbody');
        let r = calculateReal(dec, binario);
        let a = calculateAdaptad(r);
        tbody.innerHTML += `
                        <tr>
                            <td>${binario}</td>
                            <td>${dec}</td>
                            <td>${r}</td>
                            <td>${a}</td>
                        </tr>`;
                    } else if(file != undefined){

                        loadFile(file);
                        incrustado();
                        
                    } else{
                            alert("Ingresa un Dato Binario o verifica si ya ingresaste la funcion f(x)")
                    }
    
    condicion();
}

function addminmax(){
    let mint = document.getElementById('min').value, maxt = document.getElementById('max').value;
    if(mint != '' && maxt != ''){
        min = parseInt(mint);
        max = parseInt(maxt);
        lleno.textContent += `Min = ${min}; `;    
        lleno.textContent += `Max = ${max}; `;  
        minmaxadaptado();
    } else {
        alert('Llena min y max')
    }

    condicion();
}

function addfuncion() {
    if(max != 0){
        funcion = document.getElementById("funcion").value;
        if(funcion != ''){
            lleno.textContent +=`Funcion= ${funcion};`;

            condicion();
            minmaxadaptado();} else{
                alert("Ingresa Una funcion valida");
            }
        } else{
            alert("Llena primero el MIN y MAX")
        }
}

function minmaxadaptado() {
    if(minAdaptado == 0 && maxAdaptado == 0 && funcion != ''){
        minAdaptado = fx(min);
        maxAdaptado = fx(max);
        lleno.textContent += ` Min Adaptado = ${minAdaptado}; Max Adaptado = ${maxAdaptado};`
    }
}

function fx(x){
    
    let sustituida = funcion.replace(/x/g, x), resultado;
    try{
        resultado = eval(sustituida);
    } catch(error){
        alert(error);
    }
return resultado;}

function binarioADecimal(binario) {
    return parseInt(binario, 2);
}

function condicion() {
    if(binarios.length != 0 && max != 0 && funcion != ""){
        let train = document.getElementById('training');
        train.style.display = 'block';
    }
}

function calculateReal(dec, binario) {
    return min+dec*((max-min)/((2 ** binario.length)-1));
}

function calculateAdaptad(x) {
return fx(x);}

function loadFile(file) {
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            binarios = content.split('\n').map(row => row.split(','));
            console.log(binarios); 
            let seleccion = document.getElementById('file_inputid');
            seleccion.textContent = 'Cargado';
            for (let i = 0; i < binarios.length; i++) {
                let binario = binarios[i];
                console.log(binario);
                let dec = binarioADecimal(binario);
                let tbody = document.querySelector('tbody');
                let r = calculateReal(dec, binario);
                let a = calculateAdaptad(r);
                tbody.innerHTML += `
            <tr>
                <td>${binario}</td>
                <td>${dec}</td>
                <td>${r}</td>
                <td>${a}</td>
            </tr>`;
                
            }
            

        };
        reader.readAsText(file);
    } 
}

function incrustado() {
    
}
