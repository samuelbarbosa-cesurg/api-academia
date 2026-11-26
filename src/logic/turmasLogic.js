import * as turmasRepository from "../repositories/turmasRepository.js";

export async function listarTurmas() {
	try {
		const turmas = await turmasRepository.listarTurmas();
		return turmas;
	} catch (error) {
		throw new Error("Não foi possível listar as turmas");
	}
}
