import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Contacto } from "../models/contactos";

@Injectable({
  providedIn: "root"
})
export class ContactoServicioService {
  resourseUrl: string;
  constructor(private httpClient: HttpClient) {
    this.resourseUrl = "https://pav2.azurewebsites.net/api/contactos";
  }

  get() {
    return this.httpClient.get(this.resourseUrl);
  }

  post(obj: Contacto) {
    delete obj.IdContacto;
    return this.httpClient.post(this.resourseUrl, obj);
  }
}
