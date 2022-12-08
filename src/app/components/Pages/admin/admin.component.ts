import { Component, OnInit } from '@angular/core';
import { UserWebService } from 'src/app/services/WebServices/user-web.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EventWebService } from '../../../services/WebServices/event-web.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalPopupService } from '../../../services/LocalServices/swal-popup.service';
import { type } from 'os';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public formEvent!: FormGroup;

  public type_user: any;
  public user: any;


  public infoSpecificEvent: any;

  /** Listado de eventos registrados */
  public listEvents: any = [];

  /** Opciones del usuario */
  public listOptions = [
    {
      id: 0,
      name: 'Reservar boletas',
      color: '#3ABCB1',
      permission: 0
    },
    {
      id: 1,
      name: 'Gestionar reservas boletas',
      color: '#3ABCB1',
      permission: 1
    },
    {
      id: 2,
      name: 'Ver mis reservas',
      color: '#3ABCB1',
      permission: 0
    },
    {
      id: 3,
      name: 'Gestionar eventos',
      color: '#3ABCB1',
      permission: 1
    }
  ]

  public idCardSelected = 0;

  public allReserve: any;
  public myReserve: any;

  constructor(
    private formBuilder: FormBuilder,
    private toast: SwalPopupService,
    private userWeb: UserWebService,
    private eventWeb: EventWebService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.type_user = localStorage.getItem('tipo_usuario');
    this.user = localStorage.getItem('usuario');
    this.init(this.idCardSelected);
    this.initForms();
    this.getEvents();
    this.getReserve("user");
  }

  init = (idCard: any) => {
    this.idCardSelected = idCard;
    if (this.idCardSelected == 1) this.getReserve();
  }

  /** Inicializa los formularios */
  initForms = () => {
    this.formEvent = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      horario: ['', Validators.required],
      artistas: ['', Validators.required],
      cantidad_boletas: ['', Validators.required],
    });
  };

  /** Trae todos los eventos para mostrarlos */
  getEvents = () => {
    this.eventWeb.getEvents().subscribe((response: any) => {
      if (response['status'] == 1) {
        this.listEvents = response['message'];
        this.infoSpecificEvent = null;
      } else {
        this.toast.setToastPopup('Error, comunicate con un asesor', 'danger');
      }
    })
  }

  /** Añadir evento*/
  addEvent = () => {
    if (this.formEvent.valid) {
      this.eventWeb.addEvent(this.formEvent.value).subscribe((response: any) => {
        if (response['status'] == 1) {
          this.toast.setToastPopup('Evento registrado con exito', 'success', 6000);
          this.getEvents();
          this.formEvent.reset();
        } else {
          this.toast.setToastPopup('Error, comunicate con un asesor', 'danger');
        }
      })
    } else {
      this.toast.setToastPopup('Valida todos los campos', 'danger');
    }
  }

  /** Lista la informacion de el evento */
  searchEvent = (id_event: any) => {
    this.infoSpecificEvent = this.listEvents.filter((elm: any) => elm.id_evento == id_event)[0];
  }

  /** Trae todas las reservas */
  getReserve = (type = "all") => {
    if (type == "all") {
      this.eventWeb.getAllReserve().subscribe((response: any) => {
        if (response['status'] == 1) {
          this.allReserve = response['message'];
        }
      })
    } else {
      const params = new FormData();
      params.append('cedula', this.user);
      this.eventWeb.getReserve(params).subscribe((response: any) => {
        if (response['status'] == 1) {
          this.myReserve = response['message'];
        }
      })
    }
  }
  /** Realizar la reserva de la boleta */
  reserve = (id_boleta: any) => {
    this.toast.showModalConfirm('Seguro de realizar su reserva?', '', (response: any) => {
      if (response.isConfirmed) {
        const params = new FormData();
        params.append('cedula', this.user);
        params.append('id_boleta', id_boleta);
        params.append('estado', "0");
        this.eventWeb.addReserve(params).subscribe((response: any) => {
          if (response['status'] == 1) {
            this.toast.setToastPopup('Su reserva fue realizada satisfactoriamente', 'success', 6000);
            this.getEvents();
          } else if (response['status'] == 2) {
            this.toast.setToastPopup('No hay suficientes boletas', 'danger');
          } else {
            this.toast.setToastPopup('Error, comunicate con un asesor', 'danger');
          }
        })
      }
    })
  }

  /** Modificamos el estado de la reserva */
  actionReserve = (action: any, id_reservacion: any) => {
    const params = new FormData();
    params.append('id_reservacion', id_reservacion);
    params.append('status', action);
    this.eventWeb.setStatusReserve(params).subscribe((response: any) => {
      if (response['status'] == 1) {
        this.getReserve();
      }
    });
  }

  /** Retorna al landing */
  goBack = () => {
    this.toast.showModalConfirm('Seguro que desea salir?', '', (response: any) => {
      if (response.isConfirmed) this.router.navigate([''], { relativeTo: this.route });
    })
  }

}
