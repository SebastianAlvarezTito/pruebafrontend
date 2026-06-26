import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente, TipoDocumento } from '../../../core/models/cliente.model';
import { ClienteService } from '../../../core/services/cliente.service';


@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {
  
  @Output() cerrar = new EventEmitter<void>();
  @Input() set clienteEditar(value: Cliente | null) {
    if (value) {
      this.esEdicion = true;
      this.form = { ...value, estado: value.estado ?? true };
    } else {
      this.esEdicion = false;
      this.limpiarFormulario();
    }
  }

  esEdicion = false;
  guardando = false;
  errorMsg = '';

  // Opciones válidas según tu TipoDocumento
  tiposDoc: TipoDocumento[] = ['DNI', 'PAS', 'CE', 'RUC'];

  form: any = {
    id: null,
    tipoDocumento: 'DNI',
    numeroDocum: '',
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    fechaNacimiento: '',
    ubigeoId: '',
    estado: true // true = Activo por defecto
  };

  erroresCampos: Record<string, string> = {
    numeroDocum: '',
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    fechaNacimiento: '',
    ubigeoId: ''
  };

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {}

  limpiarFormulario(): void {
    this.form = {
      id: null,
      tipoDocumento: 'DNI',
      numeroDocum: '',
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      fechaNacimiento: '',
      ubigeoId: '',
      estado: true
    };
  }

  validarFormulario(): boolean {
    let valido = true;
    const regexNumeros = /^[0-9]+$/;
    const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Documento
    if (!this.form.numeroDocum?.trim()) {
      this.erroresCampos['numeroDocum'] = 'El número de documento es requerido.';
      valido = false;
    } else if (!regexNumeros.test(this.form.numeroDocum)) {
      this.erroresCampos['numeroDocum'] = 'Debe contener solo números.';
      valido = false;
    } else {
      this.erroresCampos['numeroDocum'] = '';
    }

    // Nombre
    if (!this.form.nombre?.trim()) {
      this.erroresCampos['nombre'] = 'El nombre es requerido.';
      valido = false;
    } else if (!regexLetras.test(this.form.nombre)) {
      this.erroresCampos['nombre'] = 'Solo se permiten letras.';
      valido = false;
    } else {
      this.erroresCampos['nombre'] = '';
    }

    // Apellido
    if (!this.form.apellido?.trim()) {
      this.erroresCampos['apellido'] = 'El apellido es requerido.';
      valido = false;
    } else if (!regexLetras.test(this.form.apellido)) {
      this.erroresCampos['apellido'] = 'Solo se permiten letras.';
      valido = false;
    } else {
      this.erroresCampos['apellido'] = '';
    }

    // Correo
    if (!this.form.correo?.trim()) {
      this.erroresCampos['correo'] = 'El correo es requerido.';
      valido = false;
    } else if (!regexCorreo.test(this.form.correo)) {
      this.erroresCampos['correo'] = 'Formato de correo inválido.';
      valido = false;
    } else {
      this.erroresCampos['correo'] = '';
    }

    // Teléfono
    if (!this.form.telefono?.trim()) {
      this.erroresCampos['telefono'] = 'El teléfono es requerido.';
      valido = false;
    } else {
      this.erroresCampos['telefono'] = '';
    }

    // Ubigeo (obligatorio, debe tener 6 dígitos)
    if (!this.form.ubigeoId?.trim()) {
      this.erroresCampos['ubigeoId'] = 'El ubigeo es requerido.';
      valido = false;
    } else if (!/^[0-9]{6}$/.test(this.form.ubigeoId)) {
      this.erroresCampos['ubigeoId'] = 'El ubigeo debe contener exactamente 6 dígitos.';
      valido = false;
    } else {
      this.erroresCampos['ubigeoId'] = '';
    }

    return valido;
  }

  guardar(): void {
    if (!this.validarFormulario()) {
      this.errorMsg = 'Por favor, corrija los errores del formulario.';
      return;
    }

    this.guardando = true;
    this.errorMsg = '';

    const clienteData: Cliente = {
      id: this.form.id || undefined,
      tipoDocumento: this.form.tipoDocumento,
      numeroDocum: this.form.numeroDocum,
      nombre: this.form.nombre,
      apellido: this.form.apellido,
      correo: this.form.correo,
      telefono: this.form.telefono,
      fechaNacimiento: this.form.fechaNacimiento,
      ubigeoId: this.form.ubigeoId.trim(),
      estado: this.form.estado === 'true' || this.form.estado === true
    };

    const operacion = this.esEdicion && clienteData.id
      ? this.clienteService.editar(clienteData.id, clienteData)
      : this.clienteService.crear(clienteData);

    operacion.subscribe({
      next: () => {
        this.guardando = false;
        this.cerrar.emit();
      },
      error: (err) => {
        this.guardando = false;
        this.errorMsg = 'Error al procesar la solicitud.';
        console.error(err);
      }
    });
  }
}