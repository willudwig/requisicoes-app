import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { MessageService } from 'src/app/messages/services/material_component/message.service';
import { NotificacaoToastrService } from 'src/app/messages/services/toastr/toastr.service';
import { Equipamento } from '../models/equipamento.model';

@Injectable({
  providedIn: 'root'
})
export class EquipamentoService {

  private registros: AngularFirestoreCollection<Equipamento>;

  constructor(private firestore: AngularFirestore,
              private mesasageService: MessageService,
              private notificacaoToastr: NotificacaoToastrService
             )
  {
    this.registros = this.firestore.collection<Equipamento>("equipaamentos");

  }

  public selecionarTodos(): Observable<Equipamento[]> {
    return this.registros.valueChanges();

  }

  public async inserir(registro: Equipamento): Promise<any> {
    if(!registro) {
      return Promise.reject("Item inválido");
    }

    try {
      const resultado = await this.registros.add(registro);
      registro.id = resultado.id;
      this.registros.doc(resultado.id).set(registro);
      this.notificacaoToastr.exibirSucesso("Inserido com sucesso.");
    }
    catch(error) {
      this.notificacaoToastr.exibirErro(error);
    }

  }

  public async editar(registro: Equipamento): Promise<void> {

    try{
      return this.registros.doc(registro.id).set(registro);
    }
    catch (error) {
      this.notificacaoToastr.exibirErro(error);
    }

  }

  public async excluir(registro: Equipamento): Promise<void> {

    try {
      this.registros.doc(registro.id).delete();
      this.notificacaoToastr.exibirSucesso("Excluído com sucesso.");
    }
    catch (error) {
      this.notificacaoToastr.exibirErro(error);
    }

  }

  public exibirNotificacao(notificacao: string): void {
    this.mesasageService.add(notificacao);
  }

 }
