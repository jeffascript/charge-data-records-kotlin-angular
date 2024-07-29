import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChargeData } from '../../models/charge-data.model';
import { ChargeDataService } from '../../services/charge-data.service';
import { ChargeDataState } from '../../state/charge-data.state';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-charge-data-table',
  templateUrl: './charge-data-table.component.html',
  styleUrls: ['./charge-data-table.component.css'],
})
export class ChargeDataTableComponent implements OnInit {
  displayedColumns: string[] = [
    'chargingSessionId',
    'vehicleId',
    'startTime',
    'endTime',
    'totalCost',
  ];
  dataSource!: MatTableDataSource<ChargeData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private dataSubscription!: Subscription;

  constructor(
    private chargeDataService: ChargeDataService,
    public chargeDataState: ChargeDataState,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadChargeData();

    this.dataSubscription = this.chargeDataState.chargeData$.subscribe(() => {
      this.loadChargeData();
    });
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadChargeData() {
    this.chargeDataService.getChargeData().subscribe({
      next: () => {
        this.dataSource = new MatTableDataSource(
          this.chargeDataState.chargeData()
        );
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error('Error loading charge data', error);
      },
      complete: () => {},
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
