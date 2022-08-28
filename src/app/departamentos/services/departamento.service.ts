import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Departamento } from '../models/departamento.model';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  registros: AngularFirestoreCollection<Departamento>;

  constructor() { }
}
