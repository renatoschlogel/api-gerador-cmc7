const connection = require('../database/connection');

const generateUniqueId = require('../utils/generateUniqueId');


function gerarCmc7(cmc7Modelo, numeroCheque){

    let cmc7Novo = cmc7Modelo.replace('nnnnnn',("000000" + numeroCheque).slice(-6));
    
    const digito = calcularDigito(cmc7Novo);
    cmc7Novo = cmc7Novo.replace('d', digito);
    
    console.log(cmc7Modelo);
    console.log(cmc7Novo);
    console.log(digito);
   
    return cmc7Novo;
}

function calcularDigito(cmc7Modelo) {
    let campo = cmc7Modelo.slice(8, 18);
    console.log('campo', campo);

	let multiplicador = 2;
	let acumulador = 0;

	for (let i = campo.length - 1; i >= 0; i--) {
        console.log(campo, i, '>>', campo.slice(i, i + 1));
		let total = campo.slice(i, i + 1) * multiplicador;
		
		if (total > 9) {
			acumulador += 1 + (total - 10);
		} else {
			acumulador += total;
		}

		multiplicador = multiplicador == 2 ? 1 : 2;
	}
    
    console.log('acumulador', acumulador);
    
    let digito = 10 - acumulador % 10;

	return digito > 9 ? 0 : digito;
}



module.exports = {
  async generate (request, response) {
    const { cmc7Modelo = "3129632d4727nnnnnn009241501056" } = request.query;



    let numeracaoCheque = await connection('numeracaocheque')
        .where('cmc7Modelo', cmc7Modelo)
        .select('*')
        .first();

    if (!numeracaoCheque){
        numeracaoCheque = {
            id: generateUniqueId(),
            cmc7Modelo,
            numero: 0 }
        await connection('numeracaocheque').insert(numeracaoCheque);
    }

    let numeroCheque = numeracaoCheque.numero + 1;

    const cmc7gerado = gerarCmc7(cmc7Modelo, numeroCheque);

    await connection('numeracaocheque')
        .where('cmc7Modelo', cmc7Modelo)
        .update({
            numero: numeroCheque
        });

    return response.json({cmc7: cmc7gerado});
  }
};
