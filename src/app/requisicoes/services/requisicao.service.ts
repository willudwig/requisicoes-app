import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { NotificacaoToastrService } from 'src/app/messages/toastr/services/toastr.service';
import { Requisicao } from '../models/requisicao.model';

@Injectable({
  providedIn: 'root'
})
export class RequisicaoService {

  private registros: AngularFirestoreCollection<Requisicao>;

  constructor(
    private firestore: AngularFirestore,
    private notificacaoToastr: NotificacaoToastrService,
   )
  {
    this.registros = this.firestore.collection<Requisicao>("requisicoes");
  }

  public selecionarTodos(): Observable<Requisicao[]> {
    return this.registros.valueChanges().pipe(
      map( (requisicoes: Requisicao[]) => {
        requisicoes.forEach(requisicao => {
          this.firestore
              .collection<Departamento>("departamentos")
              .doc(requisicao.departamentoId)
              .valueChanges()
              .subscribe(x => requisicao.departamento = x);

            this.firestore
            .collection<Equipamento>("equipamentos")
            .doc(requisicao.equipamentoId)
            .valueChanges()
            .subscribe(x => requisicao.equipamento = x);

            this.firestore
              .collection<Funcionario>("funcionarios")
              .doc(requisicao.funcionarioId)
              .valueChanges()
              .subscribe(x => requisicao.funcionario = x);
        });

        return requisicoes;

      })
    );
  }

  public async inserir(registro: Requisicao): Promise<any> {
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

  public async editar(registro: Requisicao): Promise<void> {
    try {
      return this.registros.doc(registro.id).set(registro);
    }
    catch (error) {
      this.notificacaoToastr.exibirErro(error);
    }
  }

  public async excluir(registro: Requisicao): Promise<void> {
    try {
      this.registros.doc(registro.id).delete();
      this.notificacaoToastr.exibirSucesso("Excluído com sucesso.");
    }
    catch (error) {
      this.notificacaoToastr.exibirErro(error);
    }
  }

}
