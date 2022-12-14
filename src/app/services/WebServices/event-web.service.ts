import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventWebService {
  private url = `${environment.apiUrl}events`;

  constructor(private http: HttpClient) { }

  /** Consulta todos los usuarios */
  public getEvents = () => this.http.get(`${this.url}/getEvents`);
  /** Trae todas las reservas */
  public getAllReserve = () => this.http.get(`${this.url}/getAllReserve`);
  /**Inserta nuevo evento */
  public addEvent = (params: any) => this.http.post(`${this.url}/addEvent`, params);
  public setStatusReserve = (params: any) => this.http.post(`${this.url}/setStatusReserve`, params);
  /** Añade reserva de boleto */
  public addReserve = (params: any) => this.http.post(`${this.url}/addReserve`, params);
  /** Trae todas las reservas */
  public getReserve = (params: any) => this.http.post(`${this.url}/getReserve`, params);

}
