import { COLORS } from "../constants/Colors";

// Definição das classificações de IMC com cores associadas
export const imcClassifications = [
    { classification: 'Magreza', range: 'Menor que 18.5', key: 'magreza', color: '#3498db' },
    { classification: 'Normal', range: '18.5 a 24.9', key: 'normal', color: COLORS.success },
    { classification: 'Sobrepeso', range: '25.0 a 29.9', key: 'sobrepeso', color: '#f1c40f' },
    { classification: 'Obesidade Grau I', range: '30.0 a 34.9', key: 'obesidade1', color: '#e67e22' },
    { classification: 'Obesidade Grau II', range: '35.0 a 39.9', key: 'obesidade2', color: '#d35400' },
    { classification: 'Obesidade Grau III', range: 'Maior que 40.0', key: 'obesidade3', color: COLORS.danger },
];

/**
 * Retorna a chave da classificação de IMC com base no valor.
 * @param {number} imc - O valor do Índice de Massa Corporal.
 * @returns {string|null} A chave da classificação (ex: 'normal') ou null.
 */
export const getImcClassificationKey = (imc) => {
    if (imc === null || imc === undefined || imc <= 0) {
        return null;
    }
    if (imc < 18.5) {
        return 'magreza';
    } else if (imc < 25) {
        return 'normal';
    } else if (imc < 30) {
        return 'sobrepeso';
    } else if (imc < 35) {
        return 'obesidade1';
    } else if (imc < 40) {
        return 'obesidade2';
    } else {
        return 'obesidade3';
    }
};