import { Departamento } from "src/app/departamentos/models/departamento.model";
import { Equipamento } from "src/app/equipamentos/models/equipamento.model";
import { Funcionario } from "src/app/funcionarios/models/funcionario.model";

export class Requisicao {
  id: string;
  dataAbertura: string;
  descricao: string;
  funcionario?: Funcionario;
  departamento?: Departamento;
  equipamento?: Equipamento;
  funcionarioId: string;
  departamentoId: string;
  equipamentoId: string;
}
