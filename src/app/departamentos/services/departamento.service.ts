import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { NotificacaoToastrService } from 'src/app/messages/toastr/services/toastr.service';
import { Departamento } from '../models/departamento.model';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private registros: AngularFirestoreCollection<Departamento>;

  constructor(private firestore: AngularFirestore,
              private notificacaoToastr: NotificacaoToastrService
             )
  {
     this.registros = this.firestore.collection<Departamento>("departamentos");
  }

  public selecionarTodos(): Observable<Departamento[]> {
    return this.registros.valueChanges();

  }

  public async inserir(registro: Departamento): Promise<any> {
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

  public async editar(registro: Departamento): Promise<void> {
    try {
      return this.registros.doc(registro.id).set(registro);
    }
    catch (error) {
      this.notificacaoToastr.exibirErro(error);
    }

  }

  public async excluir(registro: Departamento): Promise<void> {
    try {
      this.registros.doc(registro.id).delete();
      this.notificacaoToastr.exibirSucesso("Excluído com sucesso.");
    }
    catch (error) {
      this.notificacaoToastr.exibirErro(error);
    }

  }
}
