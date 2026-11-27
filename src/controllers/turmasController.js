import * as turmasLogic from "../logic/turmasLogic.js";
import { ErroValidacao } from "../models/erroValidacao.js";
import { ErroNaoEncontrado } from "../models/erroNaoEncontrado.js";
import { ErroConflito } from "../models/erroConflito.js";
import { ErroBanco } from "../models/erroBanco.js";


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

export async function inscreverAluno(request, response) {
  try {
    const { id } = request.params;
    const inscricao = await turmasLogic.inscreverAluno(id, request.body ?? {});

    return response.status(201).json(inscricao);
  } catch (error) {
    console.error(`Erro ao inscrever aluno: ${error.message}`);
    if (error instanceof ErroValidacao) {
      return response.status(400).json({
        erro: error.message,
      });
    }

    if (error instanceof ErroNaoEncontrado) {
      return response.status(404).json({
        erro: error.message,
      });
    }

    if (error instanceof ErroConflito) {
      return response.status(409).json({
        erro: error.message,
      });
    }

    if (error instanceof ErroBanco) {
      return response.status(error.status).json({
        erro: error.message,
      });
    }

    return response.status(500).json({
      erro: "Erro interno do servidor",
    });
  }
}

export async function cancelarInscricao(request, response) {
  try {
    const { id, alunoId } = request.params;
    const inscricaoCancelada = await turmasLogic.cancelarInscricao(id, alunoId);

    if (!inscricaoCancelada) {
      return response.status(404).json({ erro: "Inscrição não encontrada" });
    }

    return response.status(200).json({ mensagem: "Inscrição cancelada com sucesso" });
  } catch (error) {
    console.error(`Erro ao cancelar inscrição: ${error.message}`);
    if (error instanceof ErroValidacao) {
      return response.status(400).json({
        erro: error.message,
      });
    }

    if (error instanceof ErroNaoEncontrado) {
      return response.status(404).json({
        erro: error.message,
      });
    }

    if (error instanceof ErroBanco) {
      return response.status(error.status).json({
        erro: error.message,
      });
    }

    return response.status(500).json({
      erro: "Erro interno do servidor",
    });
  }
}
