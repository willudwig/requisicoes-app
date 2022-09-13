import { Departamento } from "src/app/departamentos/models/departamento.model";
import { Equipamento } from "src/app/equipamentos/models/equipamento.model";
import { Funcionario } from "src/app/funcionarios/models/funcionario.model";
import { Movimentacao } from "./movimentacao.model";

export class Requisicao {
  id: string;
  dataAbertura: Date | any;
  descricao: string;
  departamento?: Departamento;
  equipamento?: Equipamento;
  funcionario?: Funcionario;
  departamentoId: string;
  equipamentoId?: string;
  funcionarioId: string;

  //movimentação
  status: string;
  ultimaAtualizacao: Date | any;
  movimentacoes: Movimentacao[];
}
