import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { NotificacaoToastrService } from 'src/app/messages/toastr/services/toastr.service';
import { Funcionario } from '../models/fincionario.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private registros: AngularFirestoreCollection<Funcionario>;

  constructor(private firestore: AngularFirestore,
              private notificacaoToastr: NotificacaoToastrService
             )
  {
     this.registros = this.firestore.collection<Funcionario>("funcionarios");
  }

  public selecionarTodos(): Observable<Funcionario[]> {
    return this.registros.valueChanges();

  }

  public async inserir(registro: Funcionario): Promise<any> {
    if(!registro) {
      return Promise.reject("Item inválido");
    }

    try {
      const res = await this.registros.add(registro);
      registro.id = res.id;
      this.registros.doc(res.id).set(registro);
      this.notificacaoToastr.exibirSucesso("Inserido com sucesso.");
    }
    catch(error) {
      this.notificacaoToastr.exibirErro(error);

    }
  }

  public async editar(registro: Funcionario): Promise<void> {
    try {
      return this.registros.doc(registro.id).set(registro);
    }
    catch (error) {
      this.notificacaoToastr.exibirErro(error);
    }

  }

  public async excluir(registro: Funcionario): Promise<void> {
    try {
      this.registros.doc(registro.id).delete();
      this.notificacaoToastr.exibirSucesso("Excluído com sucesso.");
    }
    catch (error) {
      this.notificacaoToastr.exibirErro(error);
    }

  }

}
