import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { EquipamentoService } from 'src/app/equipamentos/services/equipamento.service';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-requisicoes-funcionario',
  templateUrl: './requisicoes-funcionario.component.html',
  styleUrls: ['./requisicoes-funcionario.component.css']
})
export class RequisicoesFuncionarioComponent implements OnInit, OnDestroy {

  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;
  private processoAutenticado: Subscription

  funcionarioLogado: Funcionario;

  constructor(
    private fb: FormBuilder,
    private requisicaoService: RequisicaoService,
    private equipamentoService: EquipamentoService,
    private departamentoService: DepartamentoService,
    private funcionarioService: FuncionarioService,
    private toastr: ToastrService,
    private modalServie: NgbModal,
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      requisicao: new FormGroup({
          id: new FormControl(""),
          dataAbertura: new FormControl(""), //, [Validators.required]
          descricao: new FormControl(""), //, [Validators.required, Validators.minLength(3)]
          departamento: new FormControl(""),
          equipamento: new FormControl(""),
          funcionario: new FormControl(""),
          departamentoId: new FormControl(""), //, [Validators.required]
          equipamentoId: new FormControl(""), //, [Validators.required]
          funcionarioId: new FormControl(""), //, [Validators.required]

          status: new FormControl(""),
          ultimaAtualizacao: new FormControl(""),
          movimentacoes: new FormControl(""),
      })

    });

    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();
    this.requisicoes$ = this.requisicaoService.selecionarTodos(),

    this.processoAutenticado = this.authService.usuarioLogado.subscribe( usuario =>
      {
        const email: string = usuario?.email!;
        this.funcionarioService.selecionarFuncionarioLogado(email)
            .subscribe( funcionario =>  this.funcionarioLogado = funcionario)
      } );
  }

  ngOnDestroy(): void {
    this.processoAutenticado.unsubscribe();
  }


  get tituloModal(): string {
    return this.id?.value ? "Atualizar" : "Cadastro";
  }
  get id(): AbstractControl | null {
    return this.form.get("requisicao.id");
  }
  get dataAbertura(): AbstractControl | null {
    return this.form.get("requisicao.dataAbertura");
  }
  get descricao(): AbstractControl | null {
    return this.form.get("requisicao.descricao");
  }
  get funcionario(): AbstractControl | null {
    return this.form.get("requisicao.funcionario");
  }
  get departamento(): AbstractControl | null {
    return this.form.get("requisicao.departamento");
  }
  get equipamento(): AbstractControl | null {
    return this.form.get("requisicao.equipamento");
  }
  get funcionarioId(): AbstractControl | null {
    return this.form.get("requisicao.funcionarioId");
  }
  get departamentoId(): AbstractControl | null {
    return this.form.get("requisicao.departamentoId");
  }
  get equipamentoId(): AbstractControl | null {
    return this.form.get("requisicao.equipamentoId");
  }

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao) {
    this.form.reset();
    this.configurarValoresPadrao();

    if(requisicao) {
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const equipamento = requisicao.equipamento ? requisicao.equipamento : null;
      const funcionario = requisicao.funcionario ? requisicao.funcionario : null;
      const requisicaoCompleta = {
        ...requisicao,
        departamento,
        equipamento,
        funcionario
      };

      this.form.get("requisicao")?.setValue(requisicaoCompleta);
    }

    try {
      await this.modalServie.open(modal).result;

      if(this.form.dirty && this.form.valid ) {

        if(!requisicao) {
          await this.requisicaoService.inserir(this.form.get("requisicao")?.value);

          console.log("Sucesso ao salvar pelo component.ts.");
          this.toastr.success("requisi????o salva com sucesso.");
        }
        else {
          await this.requisicaoService.editar(this.form.get("requisicao")?.value);
          console.log("Sucesso ao  alterar pelo component.ts.");
          this.toastr.success("requisi????o alterada com sucesso.");
        }
      }
      else {
        this.toastr.error("houve um erro ao salvar/editar.");
      }
    }
    catch (error) {
      if (error != "fechar" && error != "0" && error != "1") {
        console.log("Erro ao salvar/editar pelo component.ts" + error);
        this.toastr.error("houve um erro nesta opera????o.");
      }
    }

  }

  public excluir(requisicao: Requisicao) {
    return this.requisicaoService.excluir(requisicao);
  }

  private configurarValoresPadrao() {
    this.form.get("requisicao.status")?.setValue("Aberta");
    this.form.get("requisicao.dataAbertura")?.setValue(new Date());
    this.form.get("requisicao.ultimaAtualizacao")?.setValue(new Date());
    this.form.get("requisicao.equipamentoId")?.setValue(null);
    this.form.get("requisicao.funcionarioId")?.setValue(this.funcionarioLogado.id);
  }

}
