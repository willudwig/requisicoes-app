import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { PainelComponent } from './painel/painel.component';

const routes: Routes = [
  {path:"", redirectTo:"login", pathMatch: "full"}, //aqui seria a 'home' só redireiconada para o 'login'
  {path:"login", component: LoginComponent},
  {path:"painel", component: PainelComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
