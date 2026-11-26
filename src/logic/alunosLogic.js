import * as alunosRepository from "../repositories/alunosRepository.js";

export async function listarAlunos() {
	try {
		const alunos = await alunosRepository.listarAlunos();
		return alunos;
	} catch (error) {
		throw new Error("Não foi possível listar os alunos");
	}
}
