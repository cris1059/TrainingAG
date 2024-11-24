// Datos de entrada (cromosomas antes)
const cromosomasAntes = [
    "0101001010101",
    "0101001010101",
    "0011010101000",
    "1010001010101",
    "0101111100000",
    "0011100110100",
    "1010101010100",
    "0101001010101",
    "0011000010101"
];

// Datos de salida (cromosomas después)
const cromosomasDespues = [
    "0100111001111",
    "0101001010101",
    "0011010101000",
    "1010001010101",
    "1000001110000",
    "0011100110100",
    "1010011011001",
    "0101001010101",
    "0011000010101"
];

// Función para contar la cantidad de '1' en un cromosoma
function contarUnos(cromosoma) {
    return cromosoma.split('').filter(bit => bit === '1').length;
}

// Datos para el gráfico: cantidad de '1's en cada cromosoma antes y después
const datosAntes = cromosomasAntes.map(cromosoma => contarUnos(cromosoma));
const datosDespues = cromosomasDespues.map(cromosoma => contarUnos(cromosoma));

// Crear gráfico con Chart.js
const ctx = document.getElementById('cromosomasChart').getContext('2d');
const cromosomasChart = new Chart(ctx, {
    type: 'bar', // Tipo de gráfico (barras)
    data: {
        labels: Array.from({ length: cromosomasAntes.length }, (_, i) => `Cromosoma ${i + 1}`),
        datasets: [
            {
                label: 'Cromosomas Antes',
                data: datosAntes,
                backgroundColor: 'rgba(0, 0, 0, 1', // Color de las barras para los cromosomas antes
            },
            {
                label: 'Cromosomas Después',
                data: datosDespues,
                backgroundColor: 'rgba(255, 0, 0, 1)', // Color de las barras para los cromosomas después
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: { beginAtZero: true },
            y: { beginAtZero: true }
        },
        plugins: {
            legend: {
                position: 'top',
            }
        }
    }
});