import * as planosRepository from "../repositories/planosRepository.js";


export async function listarPlanos() {
	try {
		const planos = await planosRepository.listarPlanos();
		return planos;
	} catch (error) {
		throw new Error("Não foi possível listar os planos");
	}
}
