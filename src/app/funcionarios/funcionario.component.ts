import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Funcionario } from './models/funcionario.model';
import { FuncionarioService } from './services/funcionario.service';

type NewType = Router;

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
              private toastr: ToastrService,
              private modalServie: NgbModal,
              private authService: AuthenticationService,
              private router: Router
             ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      funcionario: new FormGroup({
        id: new FormControl(""),
        nome: new FormControl("", [Validators.required, Validators.minLength(3)]),
        email: new FormControl("", [Validators.required, Validators.email]),
        funcao: new FormControl("", [Validators.required, Validators.minLength(3)]),
        departamento: new FormControl(""),
        departamentoId: new FormControl("", [Validators.required])
      }),
      senha: new FormControl("")
    });

    this.funcionarios$ = this.funcionarioService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();
  }

  get id(): AbstractControl | null {
    return this.form.get("funcionario.id");
  }
  get nome(): AbstractControl | null {
    return this.form.get("funcionario.nome");
  }
  get email(): AbstractControl | null {
    return this.form.get("funcionario.email");
  }
  get funcao(): AbstractControl | null {
    return this.form.get("funcionario.funcao");
  }
  get departamento(): AbstractControl | null {
    return this.form.get("funcionario.departamento");
  }
  get departamentoId(): AbstractControl | null {
    return this.form.get("funcionario.departamentoId");
  }
  get tituloModal(): string {
    return this.id?.value ? "Atualizar" : "Cadastro";
  }
  get senha(): AbstractControl | null  {
    return this.form.get("senha");
  }

  public async gravar(modal: TemplateRef<any>, funcionario?: Funcionario) {
    this.form.reset;

    if(funcionario) {
      const departamento = funcionario.departamento ? funcionario.departamento : null;
      const funcionarioCompleto = {
        ...funcionario,
        departamento
      }

      this.form.get("funcionario")?.setValue(funcionarioCompleto);
    }

    try {
      await this.modalServie.open(modal).result;

      if(this.form.dirty && this.form.valid ) {

        if(!funcionario) {
          await this.authService.cadastrar(this.email?.value, this.senha?.value);

          await this.funcionarioService.inserir(this.form.get("funcionario")?.value);

          await this.authService.logout();

          await this.router.navigate(["/login"]);

          console.log(`O funcionário foi salvo com sucesso.`);
          this.toastr.success("funcionário salvo com sucesso.");
        }
        else {
          await this.funcionarioService.editar(this.form.get("funcionario")?.value);
          console.log(`O funcionário foi alterado com sucesso.`);
          this.toastr.success("funcionário alterado com sucesso.");
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

  public excluir(funcionario: Funcionario) {
    return this.funcionarioService.excluir(funcionario);
  }

}
