import * as alunosLogic from "../logic/alunosLogic.js";
import { ErroValidacao } from "../models/erroValidacao.js";


export async function listarAlunos(request, response) {
    try{
      const alunos = await alunosLogic.listarAlunos();

      if(alunos.length === 0){
        return response.status(404).json({erro: "Nenhum aluno encontrado"})
      }

      return response.status(200).json(alunos);
    } catch (error) {
      console.error(`Erro ao listar alunos: ${error.message}`);
      if(error instanceof ErroValidacao) {
        return response.status(400).json({
            erro: error.message,
        });
      }

      return response.status(500).json({
        erro: "Erro interno do servidor",
      });
    }
}