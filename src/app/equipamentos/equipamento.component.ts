import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Equipamento } from './models/equipamento.model';
import { EquipamentoService } from './services/equipamento.service';


@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html',
  styleUrls: ['./equipamento.component.css']
})
export class EquipamentoComponent implements OnInit {
  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(
              private equipamentoService: EquipamentoService,
              private fb: FormBuilder,
              private modalServie: NgbModal,
              private toastr: ToastrService
             ) { }

  ngOnInit(): void {
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      numeroSerie: new FormControl("", [Validators.required, Validators.minLength(3)]),
      nome: new FormControl("", [Validators.required, Validators.minLength(3)]),
      precoAquisicao: new FormControl("", [Validators.required]),
      dataFabricacao: new FormControl("", [Validators.required])
    });

  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id(): AbstractControl | null {
    return this.form.get("id");
  }

  get numeroSerie() {
    return this.form.get("numeroSerie");
  }

  get nome() {
    return this.form.get("nome");
  }

  get precoAquisicao() {
    return this.form.get("precoAquisicao");
  }

  get dataFabricacao() {
    return this.form.get("dataFabricacao");
  }

  public async gravar(modal: TemplateRef<any>, equipamento?: Equipamento) {
    this.form.reset;

    if(equipamento)
      this.form.setValue(equipamento);

    try {
      await this.modalServie.open(modal).result;

      if(this.form.dirty && this.form.valid ) {

        if(!equipamento){
          await this.equipamentoService.inserir(this.form.value);
          console.log(`O equipamento foi salvo com sucesso.`);
          //this.equipamentoService.exibirNotificacao(new Date(Date.now()).toString() + " - Equipamento inserido com sucesso.");
          this.toastr.success("funcionário salvo com sucesso.");
        }
        else{
          await this.equipamentoService.editar(this.form.value);
          console.log(`O equipamento foi alterado com sucesso.`);
          this.toastr.success("funcionário alterado com sucesso.");
          //this.equipamentoService.exibirNotificacao(new Date(Date.now()).toString() + " - Equipamento alterado com sucesso.");
        }
      }
      else
        this.toastr.error("houve um erro nesta operação.");

    }
    catch (error) {
        console.log(error);
        this.toastr.error("houve um erro nesta operação.");
      }

  }

  public excluir(equipamento: Equipamento) {
    return this.equipamentoService.excluir(equipamento);
  }

}
