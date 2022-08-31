import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, Observable } from 'rxjs';
import { MessageService } from 'src/app/messages/services/message.service';
import { Equipamento } from '../models/equipamento.model';

@Injectable({
  providedIn: 'root'
})
export class EquipamentoService {

  private registros: AngularFirestoreCollection<Equipamento>;

  constructor(private firestore: AngularFirestore,
              private mesasageService: MessageService,
              private toastr: ToastrService
             ) {
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
      this.exibirSucesso("Inserido com sucesso.");
    }
    catch(error) {
      this.exibirErro(error);
    }

  }

  public async editar(registro: Equipamento): Promise<void> {

    try{
      return this.registros.doc(registro.id).set(registro);
    }
    catch (error) {
      this.exibirErro(error);
    }

  }

  public async excluir(registro: Equipamento): Promise<void> {

    try {
      this.registros.doc(registro.id).delete();
      this.exibirSucesso("Excluído com sucesso.");
    }
    catch (error) {
      this.exibirErro(error);
    }

  }

  public exibirNotificacao(notificacao: string): void {
    this.mesasageService.add(notificacao);
  }

  public exibirErro(e: any): Observable<any> {
    this.exibirMensagemToastr("Erro.", "operação mal sucedida", "toast-error");
    return EMPTY;
  }

  public exibirSucesso(mensagem: string): Observable<any> {
    this.exibirMensagemToastr("OK.", mensagem, "toast-success");
    return EMPTY;
  }


  public exibirMensagemToastr(titulo: string, mensagem: string, tipo: string): void {
    this.toastr.show(titulo, mensagem, {closeButton:true, progressBar: true}, tipo);
  }

}
