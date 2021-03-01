import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray ,NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { MessagesService } from '../services/messages/messages.service';
import { LoginService } from '../services/http-service/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formulario: FormGroup;

  constructor(private formBuilder: FormBuilder,
    public loginService: LoginService,
    private MessagesService: MessagesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm()
  }

  
  initForm(){
    this.formulario = this.formBuilder.group({
      usuario: [null,[Validators.required]],
      contra: [null,[Validators.required]],
    });
  }

  login(value){
    if (this.formulario.valid) {
      this.MessagesService.showLoading();

      this.loginService.login(value).then(datas => {
        this.MessagesService.closeLoading();

        var res: any = datas;
        if(res.codigo == 200){
          sessionStorage.setItem('id', res.resultado[0].id); 

          this.router.navigate(['/panel']);      
          this.resetForm()
        }else{
          this.MessagesService.showSuccessDialog(res.mensaje,'error');
        }
      });
    }else{
      this.MessagesService.showSuccessDialog('Todos los campos son requeridos','error');
    }
  }

  resetForm(){
    this.formulario.reset()
    Object.keys(this.formulario.controls).forEach(key => {
      this.formulario.get(key).setErrors(null);
    });
  }
}
