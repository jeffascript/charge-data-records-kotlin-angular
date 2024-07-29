import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChargeDataService } from '../../services/charge-data.service';
import { ChargeDataState } from '../../state/charge-data.state';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-charge-data',
  templateUrl: './add-charge-data.component.html',
  styleUrl: './add-charge-data.component.css',
})
export class AddChargeDataComponent {
  chargeDataForm!: FormGroup;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private chargeDataService: ChargeDataService,
    public chargeDataState: ChargeDataState,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.chargeDataForm = this.formBuilder.group({
      chargingSessionId: ['', Validators.required],
      vehicleId: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      totalCost: ['', [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit() {
    if (this.chargeDataForm.invalid) {
      return;
    }

    this.chargeDataService
      .createChargeData(this.chargeDataForm.value)
      .subscribe({
        next: () => {
          this.chargeDataForm.reset();
        },
        error: (error) => {
          console.error('Error creating charge data', error);
          const {
            error: { error: errorMessage },
          } = error;
          console.error('Login error', error);
          this.error = errorMessage;
        },
      });
  }
}
