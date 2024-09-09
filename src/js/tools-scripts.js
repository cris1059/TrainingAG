/* 
@Autor: Cristopher Camacho Duran
@App: Training Algoritmos Geneticos

@Colaboradores: Brandon Lenny Rodriguez Arrieta
                Iniestra Sanchez Eduardo
                Romero Tapia Alberto Angel
*/

function binaryOfDecimal(binario) {
    return parseInt(binario, 2);
}


function numeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function evaluarFuncion(funcion, x) {
    try {
        return eval(funcion.replace(/x/g, x));
    } catch (error) {
        console.error("Error al evaluar la función:", error);
        return null;
    }
}

function buscarEnArreglo(arreglo, cadena) {
    return arreglo.indexOf(cadena);
}

function borrarEspacios(cadena) {
    return cadena.replace(/\s+/g, '');
}

function sustituirCaracterPorIndice(cadena, indice, nuevoCaracter) {
    if (indice < 0 || indice >= cadena.length) {
        return "Índice fuera de rango";
    }
    return cadena.slice(0, indice) + nuevoCaracter + cadena.slice(indice + 1);
}

function verificarNumeroEnArreglo(numero, arreglo = []) {
    return arreglo.indexOf(numero) === -1;
}