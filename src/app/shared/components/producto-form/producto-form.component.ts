import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Producto } from '../../../core/models/producto.model';
import { ProductoService } from '../../../core/services/producto.service';


@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css'],
})
export class ProductoFormComponent implements OnInit {
  @Input() productoEditar: Producto | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  productoService = inject(ProductoService);
  private fb = inject(FormBuilder);

  // Unidades de medida basadas en el script SQL
  unidadesMedida: string[] = ['750ml', '1 Litro', '500ml', 'Galon 4 Lt', 'Pack'];
  
  guardando = false;
  errorMsg: string | null = null;
  formSubmitted = false;

  productoForm: FormGroup;

  constructor() {
    this.productoForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      codigoBarrasSku: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-Z0-9\-_]+$/)
      ]],
      descripcion: ['', [
        Validators.maxLength(255)
      ]],
      unidadMedida: ['750ml', [
        Validators.required
      ]],
      precioUnitario: [0, [
        Validators.required,
        Validators.min(0.01),
        Validators.max(999999.99),
        this.precioPositivoValidator
      ]],
      idCategoria: [1, [
        Validators.required,
        Validators.min(1),
        Validators.max(15)  // Máximo 15 categorías según script
      ]]
      // estado NO está incluido - siempre será activo por defecto en el backend
    });
  }

  get f() {
    return this.productoForm.controls;
  }

  get esEdicion(): boolean {
    return !!this.productoEditar;
  }

  precioPositivoValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== null && value !== undefined && value <= 0) {
      return { precioNoPositivo: true };
    }
    return null;
  }

  ngOnInit(): void {
    if (this.productoEditar) {
      const { idProducto, fechaCreacion, fechaActualizacion, fechaEliminacion, fechaRestauracion, estado, ...rest } = this.productoEditar;
      this.productoForm.patchValue({ ...rest });
      
      if (rest.precioUnitario !== undefined) {
        this.productoForm.patchValue({ 
          precioUnitario: Number(rest.precioUnitario) 
        });
      }
    }
  }

  campoInvalido(campo: string): boolean {
    const control = this.productoForm.get(campo);
    return !!(control && control.invalid && (control.touched || control.dirty || this.formSubmitted));
  }

  getErrorMessage(campo: string): string {
    const control = this.productoForm.get(campo);
    if (!control) return '';

    const errors = control.errors;
    if (!errors) return '';

    const errorMessages: { [key: string]: string } = {
      required: 'Este campo es obligatorio',
      minlength: `Mínimo ${errors['minlength']?.requiredLength} caracteres`,
      maxlength: `Máximo ${errors['maxlength']?.requiredLength} caracteres`,
      pattern: 'Formato inválido (solo letras, números, guiones y guión bajo)',
      min: `El valor mínimo es ${errors['min']?.min}`,
      max: `El valor máximo es ${errors['max']?.max}`,
      precioNoPositivo: 'El precio debe ser mayor a 0',
    };

    for (const [key, message] of Object.entries(errorMessages)) {
      if (errors[key]) {
        return message;
      }
    }

    return 'Campo inválido';
  }

  guardar(): void {
    this.formSubmitted = true;
    // Validación: asegurar que todos los campos requeridos estén correctos
    this.errorMsg = null;

    Object.keys(this.productoForm.controls).forEach(field => {
      const control = this.productoForm.get(field);
      control?.markAsTouched();
    });

    if (this.productoForm.invalid) {
      this.errorMsg = 'Por favor, corrija los errores en el formulario antes de continuar.';
      return;
    }

    this.guardando = true;

    const formValue = this.productoForm.value;
    // Agregar estado = true explícitamente para nuevos productos
    const dataToSend = this.esEdicion 
      ? formValue 
      : { ...formValue, estado: true };

    const obs = this.esEdicion
      ? this.productoService.editar(this.productoEditar!.idProducto!, dataToSend)
      : this.productoService.crear(dataToSend);

    obs.subscribe({
      next: () => {
        this.guardando = false;
        this.guardado.emit();
        this.cerrar.emit();
      },
      error: (err) => {
        this.guardando = false;
        const body = err?.error;

        if (err.status === 400 && body && typeof body === 'object') {
          if (body.nombre) {
            this.productoForm.get('nombre')?.setErrors({ backend: body.nombre });
          }
          if (body.codigoBarrasSku) {
            this.productoForm.get('codigoBarrasSku')?.setErrors({ backend: body.codigoBarrasSku });
          }
          if (body.precioUnitario) {
            this.productoForm.get('precioUnitario')?.setErrors({ backend: body.precioUnitario });
          }
          if (body.idCategoria) {
            this.productoForm.get('idCategoria')?.setErrors({ backend: body.idCategoria });
          }
          
          this.errorMsg = body.mensaje ?? 'Error de validación. Revise los datos ingresados.';
        } else if (err.status === 409) {
          this.errorMsg = body?.mensaje ?? 'Conflicto: el código SKU ya está registrado.';
          this.productoForm.get('codigoBarrasSku')?.setErrors({ duplicado: true });
        } else {
          this.errorMsg = 'Error inesperado. Intenta nuevamente.';
        }
      }
    });
    // El producto se guarda exitosamente y se emite evento al padre para recargar la lista y cerrar el formulario
  }

  resetForm(): void {
    this.formSubmitted = false;
    this.productoForm.reset({
      nombre: '',
      codigoBarrasSku: '',
      descripcion: '',
      unidadMedida: '750ml',
      precioUnitario: 0,
      idCategoria: 1
    });
    Object.keys(this.productoForm.controls).forEach(field => {
      const control = this.productoForm.get(field);
      control?.markAsUntouched();
    });
  }
}