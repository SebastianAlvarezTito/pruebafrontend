import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PagoService } from '../../../core/services/pago.service';
import { Pago } from '../../../core/models/pago.model';

@Component({
  selector: 'app-pago-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pago-form.html',
  styleUrls: ['./pago-form.css']
})
export class PagoFormComponent implements OnInit {

  esEdicion = false;

  pago: Pago = {
    idPago: '',
    idVentaRelacionada: '',
    montoPago: 0,
    fechaPago: '',
    metodoPago: '',
    referenciaTransaccion: ''
  };

  metodosPago: string[] = [
    'Efectivo',
    'Transferencia Bancaria',
    'Tarjeta de Crédito',
    'Tarjeta de Débito',
    'Cheque'
  ];

  guardando = false;
  errorMsg = '';

  constructor(
    private pagoService: PagoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // Modo edición: cargar datos existentes
      this.esEdicion = true;
      this.pagoService.obtenerPorId(Number(id)).subscribe({
        next: (data) => {
          if (data) {
            this.pago = { ...data };
          } else {
            this.errorMsg = 'Pago no encontrado.';
          }
        },
        error: () => { this.errorMsg = 'Error al cargar el pago.'; }
      });
    } else {
      // Modo nuevo: generar ID automático
      this.esEdicion = false;
      this.pago.idPago = this.pagoService.generarIdPago();
    }
  }

  guardar(): void {
    if (!this.pago.idVentaRelacionada || !this.pago.montoPago || !this.pago.fechaPago || !this.pago.metodoPago) {
      this.errorMsg = 'Por favor complete todos los campos obligatorios.';
      return;
    }

    this.guardando = true;
    this.errorMsg = '';

    const operacion = this.esEdicion
      ? this.pagoService.actualizar(this.pago)
      : this.pagoService.guardar(this.pago);

    operacion.subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/pagos']);
      },
      error: (err) => {
        this.guardando = false;
        this.errorMsg = 'Error al guardar el pago.';
        console.error(err);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/pagos']);
  }
}
