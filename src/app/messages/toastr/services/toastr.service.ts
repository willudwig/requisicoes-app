import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoToastrService {
  private messages: string[] = [];

  constructor(public toastr: ToastrService) { }

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
