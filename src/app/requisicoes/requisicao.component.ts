import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, pipe } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Equipamento } from '../equipamentos/models/equipamento.model';
import { EquipamentoService } from '../equipamentos/services/equipamento.service';
import { Funcionario } from '../funcionarios/models/funcionario.model';
import { FuncionarioService } from '../funcionarios/services/funcionario.service';
import { Requisicao } from './models/requisicao.model';
import { RequisicaoService } from './services/requisicao.service';

@Component({
  selector: 'app-requisicao',
  templateUrl: './requisicao.component.html',
  styleUrls: ['./requisicao.component.css']
})

export class RequisicaoComponent implements OnInit {
  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;

  funcionarioLogado: Funcionario;
  deveExibirMovimentacoes: boolean = false;

  constructor(
    private fb: FormBuilder,
    private requisicaoService: RequisicaoService,
    private equipamentoService: EquipamentoService,
    private departamentoService: DepartamentoService,
    private toastr: ToastrService,
    private modalServie: NgbModal,
    private funcionarioService: FuncionarioService,
    private authService: AuthenticationService,

  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      requisicao: new FormGroup({
          id: new FormControl(""),
          dataAbertura: new FormControl("", [Validators.required]),
          descricao: new FormControl("", [Validators.required, Validators.minLength(3)]),
          departamento: new FormControl(""),
          equipamento: new FormControl(""),
          departamentoId: new FormControl("", [Validators.required]),
          equipamentoId: new FormControl("", [Validators.required]),
          //funcionario: new FormControl(""),
          //funcionarioId: new FormControl("", [Validators.required]),
      }),

    });

    this.requisicoes$ = this.requisicaoService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();
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
  // get funcionario(): AbstractControl | null {
  //   return this.form.get("requisicao.funcionario");
  // }
  get departamento(): AbstractControl | null {
    return this.form.get("requisicao.departamento");
  }
  get equipamento(): AbstractControl | null {
    return this.form.get("requisicao.equipamento");
  }
  // get funcionarioId(): AbstractControl | null {
  //   return this.form.get("requisicao.funcionarioId");
  // }
  get departamentoId(): AbstractControl | null {
    return this.form.get("requisicao.departamentoId");
  }
  get equipamentoId(): AbstractControl | null {
    return this.form.get("requisicao.equipamentoId");
  }

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao) {
    this.form.reset;

    if(requisicao) {
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const equipamento = requisicao.equipamento ? requisicao.equipamento : null;
      //const funcionario = requisicao.funcionario ? requisicao.funcionario : null;
      const requisicaoCompleta = {
        ...requisicao,
        departamento,
        equipamento
        //funcionario
      };

      this.form.get("requisicao")?.setValue(requisicaoCompleta);
    }

    try {
      await this.modalServie.open(modal).result;

      if(this.form.dirty && this.form.valid ) {

        if(!requisicao) {
          await this.requisicaoService.inserir(this.form.get("requisicao")?.value);

          console.log(`A requisição foi salva com sucesso.`);
          this.toastr.success("requisição salva com sucesso.");
        }
        else {
          await this.requisicaoService.editar(this.form.get("requisicao")?.value);
          console.log(`A requisição foi alterada com sucesso.`);
          this.toastr.success("requisição alterada com sucesso.");
        }
      }
      else {
        this.toastr.error("houve um erro nesta operação.");
      }
    }
    catch (error) {
      if (error != "fechar" && error != "0" && error != "1") {
        console.log(error);
        this.toastr.error("houve um erro nesta operação.");
      }
    }

  }

  public excluir(requisicao: Requisicao) {
    return this.requisicaoService.excluir(requisicao);
  }

  public obterFuncionarioLogado() {
    this.authService.usuarioLogado
    .subscribe
    (
      dados =>
      {
        this.funcionarioService.selecionarFuncionarioLogado(dados!.email!)
          .subscribe
          (
            funcionario =>
            {
               this.funcionarioLogado = funcionario;
               this.requisicoes$ = this.requisicaoService.selecionarTodos()
                .pipe
                (
                  map
                  (
                    requisicoes =>
                    {
                      return requisicoes.filter( r => r.solicitante.email === this.funcionarioLogado.email );
                    }
                  )
                )
            }
          )
      }
    )
  }

  public setValoresPadrao() {
    this.form.patchValue
    (
      {
        solicitante: this.funcionarioLogado,
        status: 'Aberto',
        dataAbertura: new Date(),
        ultimaAtualizacao: new Date()
      }
    )
  }
}
