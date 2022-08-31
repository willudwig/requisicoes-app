import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  constructor(private equipamentoService: EquipamentoService,
              private fb: FormBuilder,
              private modalServie: NgbModal
             ) { }

  ngOnInit(): void {
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      numeroSerie: new FormControl(""),
      nome: new FormControl(""),
      precoAquisicao: new FormControl(""),
      dataFabricacao: new FormControl("")
    });

  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id(): AbstractControl | null {
    return this.form.get("id");
  }

  get numeroSeerie() {
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

      let verificado = this.verificarRepetido(this.form.value);

      if (verificado){
          this.equipamentoService.exibirNotificacao("Equipamento duplicado.");
          return;
      }

      if(!equipamento){
        await this.equipamentoService.inserir(this.form.value);
        this.equipamentoService.exibirNotificacao("Equipamento inserido com sucesso.");
        console.log(`O equipamento foi salvo com sucesso.`);
      }
      else{
        await this.equipamentoService.editar(this.form.value);
        this.equipamentoService.exibirNotificacao("Equipamento alterado com sucesso.");
        console.log(`O equipamento foi alterado com sucesso.`);
      }
    }
    catch (_error) {
    }

  }

  public excluir(equipamento: Equipamento) {
    return this.equipamentoService.excluir(equipamento);
  }

  public verificarRepetido(eqp: Equipamento): boolean {
    let resultado = false;
    const equipamentos = this.equipamentoService.selecionarTodos();

    equipamentos.forEach(equipamento => {
        equipamento.forEach(x => {
          if(x.nome === eqp.nome && x.numeroSerie == eqp.numeroSerie && x.id !== eqp.id) {
            resultado = true;
            return;
          }
          else {
          resultado = false;
          return;
          }
        })

      });

    return resultado;
  }

}
