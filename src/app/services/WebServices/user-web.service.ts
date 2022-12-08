import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserWebService {
  private url = `${environment.apiUrl}users`;

  constructor(private http: HttpClient) { }

  /** Consulta todos los usuarios */
  public getUsers = () => this.http.get(`${this.url}/getUsers`);

  /** Crea un usuario nuevo */
  public createUser = (params: any) => this.http.post(`${this.url}/createUser`, params);

  /** Eliminar usuario */
  public deleteUser = (id: any) => this.http.post(`${this.url}/deleteUser`, id);

  /** Inicio sesion, validar usuario administrador */
  public login = (params: any) => this.http.post(`${this.url}/login`, params);
}
