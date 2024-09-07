document.addEventListener('DOMContentLoaded', ()=> document.querySelector('body').addEventListener('click', listener));
let activemodal = '';

const listener = (event) => {
    if(event.target && event.target.id == 'population') modal(event.target.id);
    if(event.target && event.target.id == 'close') modal(activemodal);
}

function modal(pane) {
    let modal = document.getElementById("tab-pane-"+pane);
    modal.classList.toggle("modal");
    activemodal = pane;
}