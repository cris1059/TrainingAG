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

//METODO CRUCE DOS PUNTOS
function dospuntos() {
    for (let i = 0; i < parejas.length; i++) {

        let len = parejas[i][0].length;
        let r1 = numeroAleatorio(0, len);
        let r2 = numeroAleatorio(0, len);

        if (r1 > r2) [r1, r2] = [r2, r1];

        let parte1cromo1 = parejas[i][0].slice(0, r1);
        let parte2cromo1 = parejas[i][0].slice(r1, r2);
        let parte3cromo1 = parejas[i][0].slice(r2);

        let parte1cromo2 = parejas[i][1].slice(0, r1);
        let parte2cromo2 = parejas[i][1].slice(r1, r2);
        let parte3cromo2 = parejas[i][1].slice(r2);

        let nuevoCromo1 = parte1cromo1 + parte2cromo2 + parte3cromo1;
        let nuevoCromo2 = parte1cromo2 + parte2cromo1 + parte3cromo2;

        dataBinary[indices[i * 2]] = nuevoCromo1;
        dataBinary[indices[i * 2 + 1]] = nuevoCromo2;
    }
    return true;
}

//METODO CRUCE UNIFORME
function cruceUniforme() {
    for (let i = 0; i < parejas.length; i++) {
        let cromosoma1 = parejas[i][0];
        let cromosoma2 = parejas[i][1];
        let nuevoCromosoma1 = "";
        let nuevoCromosoma2 = "";

        for (let j = 0; j < cromosoma1.length; j++) {
            if (Math.random() < 0.5) {
                // Intercambiar genes según la máscara
                nuevoCromosoma1 += cromosoma1[j];
                nuevoCromosoma2 += cromosoma2[j];
            } else {
                nuevoCromosoma1 += cromosoma2[j];
                nuevoCromosoma2 += cromosoma1[j];
            }
        }

        dataBinary[indices[i * 2]] = nuevoCromosoma1;
        dataBinary[indices[i * 2 + 1]] = nuevoCromosoma2;
    }
    return true;
}

//METODO CRUCE ARITMETICO
function cruceAritmetico() {
    for (let i = 0; i < parejas.length; i++) {
        let cromosoma1 = parejas[i][0];
        let cromosoma2 = parejas[i][1];
        let nuevoCromosoma1 = "";
        let nuevoCromosoma2 = "";

        let alpha = Math.random();

        for (let j = 0; j < cromosoma1.length; j++) {

            let gen1 = parseInt(cromosoma1[j], 10);
            let gen2 = parseInt(cromosoma2[j], 10);

            let nuevoGen1 = Math.round(alpha * gen1 + (1 - alpha) * gen2);
            let nuevoGen2 = Math.round(alpha * gen2 + (1 - alpha) * gen1);

            nuevoCromosoma1 += nuevoGen1.toString();
            nuevoCromosoma2 += nuevoGen2.toString();
        }

        dataBinary[indices[i * 2]] = nuevoCromosoma1;
        dataBinary[indices[i * 2 + 1]] = nuevoCromosoma2;
    }
    return true;
}

