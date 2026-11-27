import * as alunosLogic from "../logic/alunosLogic.js";
import { ErroValidacao } from "../models/erroValidacao.js";
import { ErroConflito } from "../models/erroConflito.js";
import { ErroBanco } from "../models/erroBanco.js";


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

export async function listarAlunoPorId(request, response) {
  try {
    const { id } = request.params;
    const aluno = await alunosLogic.listarAlunoPorId(id);

    if (!aluno) {
      return response.status(404).json({ erro: "Aluno não encontrado" });
    }

    return response.status(200).json(aluno);
  } catch (error) {
    console.error(`Erro ao listar aluno por ID: ${error.message}`);
    if (error instanceof ErroValidacao) {
      return response.status(400).json({
        erro: error.message,
      });
    }

    return response.status(500).json({
      erro: "Erro interno do servidor",
    });
  }
}

export async function cadastrarAluno(request, response) {
  try {
    const novoAluno = await alunosLogic.cadastrarAluno(request.body ?? {});

    return response.status(201).json(novoAluno);
  } catch (error) {
    console.error(`Erro ao cadastrar aluno: ${error.message}`);
    if (error instanceof ErroValidacao) {
      return response.status(400).json({
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

export async function atualizarAluno(request, response) {
  try {
    const { id } = request.params;
    const alunoAtualizado = await alunosLogic.atualizarAluno(id, request.body ?? {});

    if (!alunoAtualizado) {
      return response.status(404).json({ erro: "Aluno não encontrado" });
    }

    return response.status(200).json(alunoAtualizado);
  } catch (error) {
    console.error(`Erro ao atualizar aluno: ${error.message}`);
    if (error instanceof ErroValidacao) {
      return response.status(400).json({
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