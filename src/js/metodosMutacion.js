
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

//METODO MUTACION UNIFORME
function mutacionUniforme() {
    for (let i = 0; i < indices.length; i++) {
        let cromosoma = dataBinary[indices[i]]; 
        let nuevoCromosoma = ""; 

        for (let j = 0; j < cromosoma.length; j++) {
            // Generar un número aleatorio entre 0 y 1
            if (Math.random() < tmutacion / 100) {
                nuevoCromosoma += cromosoma[j] === "1" ? "0" : "1";
            } else {
                // Si no, mantenemos el bit original
                nuevoCromosoma += cromosoma[j];
            }
        }

        dataBinary[indices[i]] = nuevoCromosoma;
    }
    return true;
}

//METODO MUTACION NO UNIFORME
function mutacionNoUniforme(generacionActual, generacionMaxima) {
    const factorReduccion = 1 - (generacionActual / generacionMaxima); 

    for (let i = 0; i < indices.length; i++) {
        let cromosoma = dataBinary[indices[i]];
        let nuevoCromosoma = ""; // 

        for (let j = 0; j < cromosoma.length; j++) {
            const probabilidadMutacion = (tmutacion / 100) * factorReduccion;

            if (Math.random() < probabilidadMutacion) {
                nuevoCromosoma += cromosoma[j] === "1" ? "0" : "1";
            } else {
                nuevoCromosoma += cromosoma[j];
            }
        }

        dataBinary[indices[i]] = nuevoCromosoma;
    }
    return true;
}

//METODO MUTACION GAUSSIANA
function mutacionGaussiana(desviacionEstandar) {
    for (let i = 0; i < indices.length; i++) {
        let cromosoma = dataBinary[indices[i]].split("").map(Number); 
        let nuevoCromosoma = [];

        for (let j = 0; j < cromosoma.length; j++) {
            if (Math.random() < tmutacion / 100) {
                const ruido = generarRuidoGaussiano(0, desviacionEstandar);
                nuevoCromosoma.push(cromosoma[j] + ruido);
            } else {
                nuevoCromosoma.push(cromosoma[j]);
            }
        }

        nuevoCromosoma = nuevoCromosoma.map(gen => Math.max(0, Math.min(1, gen))); 

        dataBinary[indices[i]] = nuevoCromosoma.map(Math.round).join("");
    }
    return true;
}

function generarRuidoGaussiano(media, desviacionEstandar) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return media + z * desviacionEstandar;
}
