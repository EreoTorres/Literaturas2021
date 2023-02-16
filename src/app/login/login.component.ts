import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormArray ,NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { MessagesService } from '../services/messages/messages.service';
import { LoginService } from '../services/http-service/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formulario: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder,
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
          sessionStorage.setItem('departamento', res.resultado[0].id_area);

          if(res.resultado[0].id_area == 2 || res.resultado[0].id_area == 4){
            this.router.navigate(['/academica']);
          }
          else if(res.resultado[0].id_area == 6){
            this.router.navigate(['/promociones']);
          }
          else if(res.resultado[0].id_area == 3){
            this.router.navigate(['/control-escolar']);
          }
          else if(res.resultado[0].id_area == 16){
            this.router.navigate(['/consejeria-estudiantil']);
          }
          else this.MessagesService.showSuccessDialog('Acceso denegado.','error');

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
