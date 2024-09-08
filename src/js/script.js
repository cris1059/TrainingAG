document.addEventListener('DOMContentLoaded', ()=> document.querySelector('body').addEventListener('click', listener));
let activemodal = '', arreglo, jsonData;

const listener = (event) => {
    if(event.target && event.target.id == 'population') modal(event.target.id);
    if(event.target && event.target.classList.contains('change')) change(event.target.id);
    if(event.target && event.target.id == 'loadfile-active') loadfile();
    if(event.target && event.target.id == 'close') modal('population');
}

function modal(pane) {
    let modal = document.getElementById("tab-pane-"+pane);
    modal.classList.toggle("modal");
    activemodal = pane;
}

function btn_active(event){
    console.log(event.target.id);
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
    
    if (jsonData.length < 8) {
        for (let i = 0; i < jsonData.length; i++) {
            const element = jsonData[i].Cromosoma;
            data.innerHTML += `
                <tr>
                    <td>${(i+1)}</td>
                    <td>${element}</td>
                </tr>`;
        }
        
    }else{
        document.getElementById('data-loaded-complete').innerHTML = `
        <h3>BD Almacenada (Tu BD es muy grande para mostrarla)</h3>`;
    }

    if(!data.classList.contains('no-data')){
        console.log('si');
        document.getElementById('data-loaded-complete').classList.toggle('modal');
    }
}
