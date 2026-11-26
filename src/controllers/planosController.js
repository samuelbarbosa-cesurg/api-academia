import * as planosLogic from "../logic/planosLogic.js";
import { ErroValidacao } from "../models/erroValidacao.js";


export async function listarPlanos(request, response) {
    try{
      const planos = await planosLogic.listarPlanos();

      if(planos.length === 0){
        return response.status(404).json({erro: "Nenhum plano encontrado"})
      }

      return response.status(200).json(planos);
    } catch (error) {
      console.error(`Erro ao listar planos: ${error.message}`);
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
