import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
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
  private processoAutenticado: Subscription

  departamentoSolicitanteId: string;
  funcionarioLogadoId: string;
  deveExibirMovimentacoes: boolean = false;

  constructor(
    private fb: FormBuilder,
    private requisicaoService: RequisicaoService,
    private departamentoService: DepartamentoService,
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
                this.funcionarioLogadoId = funcionario?.id;
                this.requisicoes$ = this.requisicaoService.selecionarRequisicoesParaMeuDepartamento(this.funcionarioLogadoId, funcionario.departamento!);
              })
      } );

    this.form = this.fb.group({

          dataAbertura: new FormControl("", [Validators.required]),
          dataUltimaAtualizacao: new FormControl("", [Validators.required]),
          descricao: new FormControl("", [Validators.required, Validators.minLength(3)]),
          status: new FormControl("", [Validators.required]),
          departamento: new FormControl(""),
          departamentoId: new FormControl("", [Validators.required]),
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
    return this.form.get("requisicao.departamento");
  }
  get departamentoId(): AbstractControl | null {
    return this.form.get("requisicao.departamentoId");
  }

}
