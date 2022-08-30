import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Equipamento } from '../models/equipamento.model';

@Injectable({
  providedIn: 'root'
})
export class EquipamentoService {

  private registros: AngularFirestoreCollection<Equipamento>;

  constructor(private firestore: AngularFirestore) {
      this.registros = this.firestore.collection<Equipamento>("equipaamentos");

  }

  public selecionarTodos(): Observable<Equipamento[]> {
    return this.registros.valueChanges();

  }

  public async inserir(registro: Equipamento): Promise<any> {
    if(!registro) {
      return Promise.reject("Item inválido");
    }

    const resultado = await this.registros.add(registro);
    registro.id = resultado.id;
    this.registros.doc(resultado.id).set(registro);

 }

 public async editar(registro: Equipamento): Promise<void> {
    return this.registros.doc(registro.id).set(registro);

}

  public async excluir(registro: Equipamento): Promise<void> {
    this.registros.doc(registro.id).delete();

  }

}
