import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Movimentacao } from '../models/movimentacao.model';
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-requisicoes-departamento',
  templateUrl: './requisicoes-departamento.component.html'
})
export class RequisicoesDepartamentoComponent implements OnInit, OnDestroy {

  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;
  private processoAutenticado: Subscription;

  public funcionarioLogado: Funcionario;
  public requisicaoSelecionada: Requisicao;
  public listaStatus: string[] = ["Aberta", "Processando", "Não Autorizada", "Fechada"];

  constructor(
    private fb: FormBuilder,
    private requisicaoService: RequisicaoService,
    private funcionarioService: FuncionarioService,
    private toastr: ToastrService,
    private modalServie: NgbModal,
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.processoAutenticado = this.authService.usuarioLogado.subscribe( usuario =>
      {
        const email: string = usuario?.email!;
        this.funcionarioService.selecionarFuncionarioLogado(email)
            .subscribe( funcionario =>
              {
                this.funcionarioLogado = funcionario;
                this.requisicoes$ = this.requisicaoService.selecionarRequisicoesFuncionarioAtual(funcionario.id!);
              })
      } );

    this.form = this.fb.group({
          status: new FormControl("", [Validators.required]),
          descricao: new FormControl("", [Validators.required, Validators.minLength(6)]),
          funcionario: new FormControl(""),
          data: new FormControl(""),
      });

    }

  ngOnDestroy(): void {
    this.processoAutenticado.unsubscribe();
  }

  get dataAbertura(): AbstractControl | null {
    return this.form.get("dataAbertura");
  }
  get dataUltimaAtualizacao(): AbstractControl | null {
    return this.form.get("dataUltimaAtualizacao");
  }
  get descricao(): AbstractControl | null {
    return this.form.get("descricao");
  }
  get status(): AbstractControl | null {
    return this.form.get("status");
  }
  get departamento(): AbstractControl | null {
    return this.form.get("departamento");
  }
  get departamentoId(): AbstractControl | null {
    return this.form.get("departamentoId");
  }
  get equipamento(): AbstractControl | null {
    return this.form.get("departamento");
  }
  get equipamentoId(): AbstractControl | null {
    return this.form.get("equipamentoId");
  }
  get movimentacoes(): AbstractControl | null {
    return this.form.get("movimentacoes");
  }

  public async gravar(modal: TemplateRef<any>, requisicao: Requisicao) {

    this.requisicaoSelecionada = requisicao;
    this.requisicaoSelecionada.movimentacoes = requisicao.movimentacoes ? requisicao.movimentacoes : [];
    this.form.reset();
    this.configurarValoresPadrao();


    try {
      await this.modalServie.open(modal).result;

      if(this.form.dirty && this.form.valid ) {
        this.atualizarRequisicao(this.form.value)
        await this.requisicaoService.editar(this.requisicaoSelecionada);
        console.log("Sucesso ao  alterar pelo component.ts.");
        this.toastr.success("requisição alterada com sucesso.");
      }
      else {
        this.toastr.error("houve um erro ao salvar/editar.");
      }
    }
    catch (error) {
      if (error != "fechar" && error != "0" && error != "1") {
        console.log("Erro ao salvar/editar pelo component.ts" + error);
        this.toastr.error("houve um erro nesta operação.");
      }
    }

  }

  private atualizarRequisicao(movimentacao: Movimentacao) {
    this.requisicaoSelecionada.movimentacoes.push(movimentacao);
    this.requisicaoSelecionada.status = this.status?.value;
    this.requisicaoSelecionada.ultimaAtualizacao = new Date();
  }
  private configurarValoresPadrao() {

    this.form.patchValue({
      funcionario: this.funcionarioLogado,
      status: this.requisicaoSelecionada?.status,
      data: new Date()
    })
  }

}
