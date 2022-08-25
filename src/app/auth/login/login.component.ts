import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit
{
  public form: FormGroup;
  public formRecuperacao: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({

      email: new FormControl(""),
      senha: new FormControl("")
    });

    this.formRecuperacao = this.formBuilder.group({

      emailRecuperacao: new FormControl("")
    });
  }

  public get email(): AbstractControl | null {
    return this.form.get("email");
  }

  public get senha(): AbstractControl | null {
    return this.form.get("senha");
  }

  public get emailRecuperacao(): AbstractControl | null {
    return this.form.get("emailRecuperacao");
  }

  public async login() {
    const email = this.email?.value;
    const senha = this.senha?.value;

    try
    {
      const resposta = await this.authService.login(email, senha);

      if(resposta.user?.uid) {
        this.router.navigate(["/painel"]);
      }

    } catch (error)
    {
      console.log(error);
    }
  }

  public abrirModalRecuparacao(modal: TemplateRef<any>):void {
    //open
    this.modalService.open(modal).result
    .then(
      (result) => {

        if(result === "enviar") {
           this.authService.resetarSenha(this.emailRecuperacao?.value);
        }
        console.log(result);
      },
    )
    .catch( () => {
      this.formRecuperacao.reset();
    });
  }
}
