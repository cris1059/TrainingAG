/* 
@Autor: Cristopher Camacho Duran
@App: Training Algoritmos Geneticos

@Colaboradores: Brandon Lenny Rodriguez Arrieta
                Iniestra Sanchez Eduardo
                Romero Tapia Alberto Angel
                Bautista Alvarado Carlos Santiago
*/


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

//METODO SELECCION POR TORNEO
function torneo(tamTorneo = 3) {
    let ncromosomas = (tcruce * dataBinary.length) / 100;

    if (ncromosomas > 1.6 && ncromosomas < 2) ncromosomas = 2;
    else if (!(ncromosomas < 1.6)) {
        ncromosomas = Math.floor(ncromosomas);
        if (ncromosomas % 2 !== 0) ncromosomas++;
    }

    cromo_parejas = [];
    parejas = [];
    indices = [];

    for (let i = 0; i < ncromosomas; i++) {
        let participantes = [];
        for (let j = 0; j < tamTorneo; j++) {
            let randIndex = numeroAleatorio(0, dataBinary.length);
            participantes.push(randIndex);
        }

        let mejorIndex = participantes.reduce((mejor, actual) =>
            dataAdaptacion[actual] > dataAdaptacion[mejor] ? actual : mejor
        );

        cromo_parejas.push(dataBinary[mejorIndex]);
    }

    for (let i = 0, j = 0; i < cromo_parejas.length; i += 2, j++) {
        parejas[j] = [cromo_parejas[i], cromo_parejas[i + 1]];
    }

    for (let i = 0; i < cromo_parejas.length; i++) {
        indices.push(buscarEnArreglo(dataBinary, cromo_parejas[i]));
    }

    return true;
}

//METODO SELECCION RANKING
function ranking() {
    let ncromosomas = (tcruce * dataBinary.length) / 100;

    if (ncromosomas > 1.6 && ncromosomas < 2) ncromosomas = 2;
    else if (!(ncromosomas < 1.6)) {
        ncromosomas = Math.floor(ncromosomas);
        if (ncromosomas % 2 !== 0) ncromosomas++;
    }

    cromo_parejas = [];
    parejas = [];
    indices = [];

    let rankingIndices = dataAdaptacion
        .map((adaptacion, index) => ({ adaptacion, index }))
        .sort((a, b) => b.adaptacion - a.adaptacion); 

    let totalRanking = (dataBinary.length * (dataBinary.length + 1)) / 2; 
    let probabilidades = rankingIndices.map(
        (_, i) => (dataBinary.length - i) / totalRanking
    );

    for (let i = 0; i < ncromosomas; i++) {
        let elegido = seleccionPorProbabilidad(rankingIndices, probabilidades);
        cromo_parejas.push(dataBinary[elegido.index]);
    }

    for (let i = 0, j = 0; i < cromo_parejas.length; i += 2, j++) {
        parejas[j] = [cromo_parejas[i], cromo_parejas[i + 1]];
    }

    for (let i = 0; i < cromo_parejas.length; i++) {
        indices.push(buscarEnArreglo(dataBinary, cromo_parejas[i]));
    }

    return true;
}

//METODO TRUNCAMIENTO
function truncamiento(porcentajeElite = 50) {
    let ncromosomas = (tcruce * dataBinary.length) / 100;

    if (ncromosomas > 1.6 && ncromosomas < 2) ncromosomas = 2;
    else if (!(ncromosomas < 1.6)) {
        ncromosomas = Math.floor(ncromosomas);
        if (ncromosomas % 2 !== 0) ncromosomas++;
    }

    cromo_parejas = [];
    parejas = [];
    indices = [];

    // Crear ranking de índices basado en adaptaciones
    let rankingIndices = dataAdaptacion
        .map((adaptacion, index) => ({ adaptacion, index }))
        .sort((a, b) => b.adaptacion - a.adaptacion);

    let tamElite = Math.ceil((porcentajeElite / 100) * dataBinary.length);

    if (tamElite <= 0) {
        console.error("El tamaño de la élite calculado es 0. Verifica el porcentaje o los datos.");
        return false;
    }

    let elite = rankingIndices.slice(0, tamElite);

    if (elite.length === 0) {
        console.error("El arreglo 'elite' está vacío. Revisa los datos de entrada.");
        return false;
    }

    // Seleccionar cromosomas de la élite
    for (let i = 0; i < ncromosomas; i++) {
        let elegido = elite[numeroAleatorio(0, elite.length)];
        if (!elegido || elegido.index === undefined) {
            console.error("No se pudo seleccionar un cromosoma válido de la élite.");
            return false;
        }
        console.log(dataBinary[elegido.index]);
        cromo_parejas.push(dataBinary[elegido.index]);
    }

    // Crear parejas
    for (let i = 0, j = 0; i < cromo_parejas.length; i += 2, j++) {
        parejas[j] = [cromo_parejas[i], cromo_parejas[i + 1]];
    }

    // Buscar índices
    for (let i = 0; i < cromo_parejas.length; i++) {
        let indice = buscarEnArreglo(dataBinary, cromo_parejas[i]);
        if (indice === -1) {
            console.error(`No se encontró el cromosoma ${cromo_parejas[i]} en 'dataBinary'.`);
            return false;
        }
        indices.push(indice);
    }

    return true;
}



function estocasticoUniversal() {
    let ncromosomas = (tcruce * dataBinary.length) / 100;

    if (ncromosomas > 1.6 && ncromosomas < 2) ncromosomas = 2;
    else if (!(ncromosomas < 1.6)) {
        ncromosomas = Math.floor(ncromosomas);
        if (ncromosomas % 2 !== 0) ncromosomas++;
    }

    cromo_parejas = [];
    parejas = [];
    indices = [];

    // Calcular probabilidades acumuladas de cada individuo
    let probabilidadesAcumuladas = [];
    let sumaAcumulada = 0;
    for (let i = 0; i < dataAdaptacion.length; i++) {
        sumaAcumulada += dataAdaptacion[i] / adaptacion_total;
        probabilidadesAcumuladas.push(sumaAcumulada);
    }

    // Generar un punto inicial aleatorio en el rango [0, distancia entre agujas]
    let distancia = 1 / ncromosomas;
    let inicio = Math.random() * distancia;

    // Seleccionar individuos usando múltiples agujas
    for (let i = 0; i < ncromosomas; i++) {
        let punto = inicio + i * distancia;
        for (let j = 0; j < probabilidadesAcumuladas.length; j++) {
            if (punto <= probabilidadesAcumuladas[j]) {
                cromo_parejas.push(dataBinary[j]);
                break;
            }
        }
    }

    // Agrupar los cromosomas seleccionados en parejas
    for (let i = 0, j = 0; i < cromo_parejas.length; i += 2, j++) {
        parejas[j] = [cromo_parejas[i], cromo_parejas[i + 1]];
    }

    // Obtener índices originales de los cromosomas seleccionados
    for (let i = 0; i < cromo_parejas.length; i++) {
        indices.push(buscarEnArreglo(dataBinary, cromo_parejas[i]));
    }

    return true;
}


function seleccionPorProbabilidad(rankingIndices, probabilidades) {
    let acumulado = 0;
    let probabilidadesAcumuladas = probabilidades.map(p => (acumulado += p));
    let random = Math.random();

    for (let i = 0; i < probabilidadesAcumuladas.length; i++) {
        if (random < probabilidadesAcumuladas[i]) return rankingIndices[i];
    }
}
