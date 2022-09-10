import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Departamento } from './models/departamento.model';
import { DepartamentoService } from './services/departamento.service';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})
export class DepartamentoComponent implements OnInit {
  public departamentos$: Observable<Departamento[]>;
  public form: FormGroup;

  constructor(private departamentoService: DepartamentoService,
              private fb: FormBuilder,
              private modalServie: NgbModal,
              private toastr: ToastrService
             ) { }

  ngOnInit(): void {
    this.departamentos$ = this.departamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl("", ),
      nome: new FormControl("", [Validators.required, Validators.minLength(3)]),
      telefone: new FormControl("", [Validators.required])
    });

  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id() {
    return this.form.get("id");
  }

  get nome() {
    return this.form.get("nome");
  }

  get telefone() {
    return this.form.get("telefone");
  }

  public async gravar(modal: TemplateRef<any>, departamento?: Departamento) {
    this.form.reset();

    if(departamento)
      this.form.setValue(departamento);

    try {
      await this.modalServie.open(modal).result;

      if(this.form.dirty && this.form.valid ) {

        if(!departamento) {
          await this.departamentoService.inserir(this.form.value);
          console.log(`O departamento foi salvo com sucesso`);
          this.toastr.success("funcionário salvo com sucesso.");
        }
        else {
          await this.departamentoService.editar(this.form.value);
          console.log(`O departamento foi alterado com sucesso`);
          this.toastr.success("funcionário alterado com sucesso.");
        }

      }
      else
        this.toastr.error("houve um erro nesta operação.");
    }
    catch (error) {
      if (error != "fechar" && error != "0" && error != "1") {
        console.log(error);
        this.toastr.error("houve um erro nesta operação.");
      }
    }

  }

  public excluir(departamento: Departamento) {
    return this.departamentoService.excluir(departamento);
  }

}
