import * as turmasLogic from "../logic/turmasLogic.js";
import { ErroValidacao } from "../models/erroValidacao.js";


export async function listarTurmas(request, response) {
    try{
      const turmas = await turmasLogic.listarTurmas();

      if(turmas.length === 0){
        return response.status(404).json({erro: "Nenhuma turma encontrado"})
      }

      return response.status(200).json(turmas);
    } catch (error) {
      console.error(`Erro ao listar as turmas: ${error.message}`);
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
