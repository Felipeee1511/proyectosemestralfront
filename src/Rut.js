function limpiar(rut) {
    rut = rut.replace(/\./g, '').replace(/-/g, '');
    rut = rut.toLowerCase();
    return rut;
}

function validar(rut) {
    rut = limpiar(rut);
    
    let dv = rut.substr(rut.length - 1, 1);
    rut = rut.substr(0, rut.length - 1);

    if (isNaN(rut)) {
        return false;
    }

    if (rut > 50000000) {
        return false;
    }

    if (dv === generarVerificador(rut)) {
        return true;
    }
    else {
        return false;
    }
}

function generarVerificador(rut) {
    let multiplier = 2;
    let sum = 0;
    let remainder = 0;
    let division = 0;

    for (let i = rut.length - 1; i >= 0; i--) {
        sum = sum + (rut.substr(i, 1) * multiplier);
        multiplier++;
        if (multiplier === 8) {
            multiplier = 2;
        }
    }

    division = Math.floor(sum / 11);
    division = division * 11;
    remainder = sum - division;

    if (remainder !== 0) {
        remainder = 11 - remainder;
    }

    if (remainder === 10) {
        return "k";
    }
    else {
        return remainder.toString(10);
    }
}

module.exports = {
    limpiar,
    validar
};
