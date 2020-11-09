import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Contacto } from "../../models/contactos";
import { ContactoServicioService } from "../../services/contacto-servicio.service";
import { ModalDialogService } from "../../services/modal-dialog.service";

@Component({
  selector: "app-contactos",
  templateUrl: "./contactos.component.html",
  styleUrls: ["./contactos.component.css"]
})
export class ContactosComponent implements OnInit {
  Titulo = "Contactos";
  TituloAccionABMC = {
    A: "(Agregar)",
    B: "(Eliminar)",
    M: "(Modificar)",
    C: "(Consultar)",
    L: "(Listado)"
  };
  AccionABMC = "L"; // inicialmente inicia en el listado de articulos (buscar con parametros)
  Mensajes = {
    SD: " No se encontraron registros...",
    RD: " Revisar los datos ingresados..."
  };

  OpcionesActivo = [
    { Id: null, Nombre: "" },
    { Id: true, Nombre: "SI" },
    { Id: false, Nombre: "NO" }
  ];

  FormContactos: FormGroup;
  submited = false;

  Items: Contacto[] = [];
  constructor(
    private servicio_contacto: ContactoServicioService,
    public formBuilder: FormBuilder,
    public modalDialog: ModalDialogService
  ) {}

  ngOnInit() {
    this.FormContactos = this.formBuilder.group({
      IdContacto: [0],
      Nombre: [
        "",
        [Validators.required, Validators.minLength(4), Validators.maxLength(54)]
      ],
      FechaNacimiento: [
        null,
        [
          Validators.required,
          Validators.pattern(
            "(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}"
          )
        ]
      ],
      Telefono: [
        null,
        [Validators.required, Validators.min(2), Validators.maxLength(12)]
      ],
      Activo: [true]
    });
    this.GetContactos();
  }

  GetContactos() {
    this.servicio_contacto.get().subscribe((res: Contacto[]) => {
      this.Items = res;
      console.log(res);
    });
  }

  Buscar() {
    this.Titulo = "Contactos (listado)";
    this.AccionABMC = "L";
    this.GetContactos();
  }

  Agregar() {
    this.AccionABMC = "A";
    this.Titulo = "Contactos (agregar)";
    this.submited = false;
    this.FormContactos.markAsUntouched;
  }

  Volver() {
    this.AccionABMC = "L";
    this.Titulo = "Contactos";
  }

  Grabar() {
    this.submited = true;

    if (this.FormContactos.invalid) {
      return;
    }
    const itemCopy = { ...this.FormContactos.value };

    if (itemCopy.IdContacto == 0 || itemCopy.IdContacto == null) {
      itemCopy.IdContacto = 0;
      this.servicio_contacto.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialog.Alert("Registro insertado correctamente");
        this.GetContactos();
      });
    }
  }
}
