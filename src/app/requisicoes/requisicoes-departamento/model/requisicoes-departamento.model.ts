import { Departamento } from "src/app/departamentos/models/departamento.model";

export class RequisicaoDepartamento {

  dataAbertura: Date | any;
  dataUltimaAtualizacao: Date | any;
  descricao: string;
  departamento: Departamento;
  status: "Aberto" | "Fechado";
  movimentacoes: number;

}
