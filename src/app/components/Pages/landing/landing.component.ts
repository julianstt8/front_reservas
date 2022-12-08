import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalPopupService } from 'src/app/services/LocalServices/swal-popup.service';
import { UserWebService } from '../../../services/WebServices/user-web.service';
import { EventWebService } from '../../../services/WebServices/event-web.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  /** Formulario reactivo */
  public formCreateUser!: FormGroup;
  public formInitSession!: FormGroup;

  public opcionSeleccionado = 0;
  public verSeleccion: string = '';

  /** Listado de cards a mostrar */
  public listCards = [
    {
      id: 0,
      name: 'Eventos que tenemos.',
      color: '#9F84F9',
    },
    {
      id: 1,
      name: 'Registrate',
      color: '#3ABCB1',
    }
  ];

  /** Iniciar sesion */
  public initSession = false;

  /** Listado de eventos registrados */
  public listEvents: any = [];

  /** Id del card seleccionado */
  public idCardSelected = 0;

  /** Acepta tratamiento de datos */
  public statusHabeasData = false;

  constructor(
    private formBuilder: FormBuilder,
    private eventWeb: EventWebService,
    private toast: SwalPopupService,
    private userWeb: UserWebService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getEvents();
    this.init();
  }

  /** Inicia todas las peticiones necesarias */
  init = () => {
    this.destroyLocalStorage();
    this.initForms();
  }

  /** Inicializa los formularios */
  initForms = () => {
    this.formCreateUser = this.formBuilder.group({
      cedula: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.email, Validators.required]],
      contrasena: ['', Validators.required],
      tipo_usuario: 0,
    });
    this.formInitSession = this.formBuilder.group({
      cedula: ['', [Validators.required]],
      contrasena: ['', Validators.required],
    });
  };

  /** Trae todos los eventos para mostrarlos */
  getEvents = () => {
    this.eventWeb.getEvents().subscribe((response: any) => {
      if (response['status'] == 1) {
        this.listEvents = response['message'];
      } else {
        this.toast.setToastPopup('Error, comunicate con un asesor', 'danger');
      }
    })
  }

  /**
   * Crear el usuario
   */
  saveUser = () => {
    if (this.formCreateUser.valid) {
      if (this.statusHabeasData) {
        this.userWeb.createUser(this.formCreateUser.value).subscribe((response: any) => {
          if (response['status'] == 1) {
            this.toast.setToastPopup('Cliente registrado con exito', 'success', 6000);
            this.formCreateUser.reset();
          } else if (response['status'] == 2) {
            this.toast.setToastPopup('Cedula ya existe registrada', 'danger', 6000);
          } else {
            this.toast.setToastPopup('Error, comunicate con un asesor', 'danger');
          }
        })
      } else {
        this.toast.setToastPopup('Es necesario que confirme el tratamiento de datos personales', 'danger', 4000);
      }
    } else {
      this.toast.setToastPopup('Valida todos los campos', 'danger');
    }
  }

  /** Iniciar sesion */
  login = () => {
    this.userWeb.login(this.formInitSession.value).subscribe((response: any) => {
      if (response['status'] == 1) {
        this.toast.setToastPopup('Bienvenido', 'success');
        localStorage.setItem('usuario', this.formInitSession.value.cedula);
        localStorage.setItem('tipo_usuario', response['data'][0].tipo_usuario);
        setTimeout(() => {
          this.router.navigate(['Admin'], { relativeTo: this.route });
          this.toast.closeModalLoading();
        }, 0)
      } else {
        this.formInitSession.reset();
        this.toast.setToastPopup('Contraseña o cedula incorrecta.', 'danger', 5000);
      }
    })
  }

  /** Destruye el localStorage */
  destroyLocalStorage = () => {
    localStorage.clear();
  }
}
