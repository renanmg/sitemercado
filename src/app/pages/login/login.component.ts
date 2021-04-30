import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from './login.model';
import { LoginService } from './login.service';
import toastr from 'toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  serverErrorMessages: [object] = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  submitForm() {
    const login: Login = Object.assign(new Login(), this.loginForm.value);
    this.executeLogin(login);
  }

  executeLogin(login: Login) {
    this.loginService.login(login)
      .subscribe(
        data => {
          if (data.success) {
            toastr.success('Login realizado com sucesso!');
            localStorage.setItem('user', JSON.stringify(login));
            this.router.navigate(['']);
          }
          else {
            toastr.error('Ocorreu um erro ao processar sua solicitação!');
            this.serverErrorMessages = [{ message: "Usuário não cadastrado." }];
          }
        },
        error => {
          toastr.error('Ocorreu um erro ao processar sua solicitação!');
          this.serverErrorMessages = [{ message: "Usuário não cadastrado." }];
        });
  }

}
