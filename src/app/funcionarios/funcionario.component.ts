import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Funcionario } from './models/fincionario.model';
import { FuncionarioService } from './services/funcionario.service';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
})
export class FuncionarioComponent implements OnInit {
  public funcionarios$: Observable<Funcionario[]>;
  public departamentos$: Observable<Departamento[]>;
  public form: FormGroup;

  constructor(
              private fb: FormBuilder,
              private funcionarioService: FuncionarioService,
              private departamentoService: DepartamentoService,
              private modalServie: NgbModal
             ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(""),
      nome: new FormControl(""),
      email: new FormControl(""),
      funcao: new FormControl(""),
      departamento: new FormControl(""),
      departamentoId: new FormControl("")
    });

    this.funcionarios$ = this.funcionarioService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();
  }

  get id(): AbstractControl | null {
    return this.form.get("id");
  }
  get nome() {
    return this.form.get("nome");
  }
  get email() {
    return this.form.get("email");
  }
  get funcao() {
    return this.form.get("funcao");
  }
  get departamento() {
    return this.form.get("departamento");
  }
  get departamentoId() {
    return this.form.get("departamentoId");
  }
  get tituloModal(): string {
    return this.id?.value ? "Atualizar" : "Cadastro";
  }

  public async gravar(modal: TemplateRef<any>, funcionario?: Funcionario) {
    this.form.reset;

    if(funcionario) {
      const departamento = funcionario.departamento ? funcionario.departamento : null;
      const funcionarioCompleto = {
        ...funcionario,
        departamento
      }
      this.form.setValue(funcionarioCompleto);
    }

    try {
      await this.modalServie.open(modal).result;

      //let verificado = this.verificarRepetido(this.form.value);

      // if (verificado){
      //     this.funcionarioService.exibirNotificacao("Funcionario duplicado.");
      //     return;
      //}

      if(!funcionario) {
        await this.funcionarioService.inserir(this.form.value);
        this.funcionarioService.exibirNotificacao(new Date(Date.now()).toString() + " - Funcionario inserido com sucesso.");
        console.log(`O funcionario foi salvo com sucesso.`);
      }
      else{
        await this.funcionarioService.editar(this.form.value);
        this.funcionarioService.exibirNotificacao(new Date(Date.now()).toString() + " - Funcionario alterado com sucesso.");
        console.log(`O funcionario foi alterado com sucesso.`);
      }
    }
    catch (_error) {
    }

  }

  public excluir(funcionario: Funcionario) {
    return this.funcionarioService.excluir(funcionario);
  }

}
