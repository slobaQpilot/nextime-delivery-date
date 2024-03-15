import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  ShippingDetails,
  ShippingLine,
  ShippingOptionsResponse,
} from '../../models/shared';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NextimeModalComponent } from '../nextime-modal/nextime-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { DateSuffix } from '../../date-suffix.pipe';
import { HttpService } from '../../app/services/http.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import moment, { Moment } from 'moment';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-nextime-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    DateSuffix,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  providers: [HttpService],
  templateUrl: './nextime-card.component.html',
  styleUrl: './nextime-card.component.css',
})
export class NextimeCardComponent implements OnInit, OnChanges, OnDestroy {
  shippingLineName: string | undefined;
  deliveryDate?: moment.Moment;
  isLoading = false;
  @Input() orderDate: string = '';
  @Input() siteId: string = '';
  @Input() shippingDetails: ShippingDetails | undefined;
  @Output() onDateUpdate = new EventEmitter<{
    deliveryDate: Moment;
    shippingLine: ShippingLine;
  }>();
  nextDeliverySubscription$?: Subscription;

  constructor(public dialog: MatDialog, private httpService: HttpService) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(NextimeModalComponent, {
      data: {
        orderDate: this.orderDate,
        shippingDetails: this.shippingDetails,
        siteId: this.siteId,
        deliveryDate: this.deliveryDate,
      },
      maxWidth: 1600,
      width: '100%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deliveryDate = result.deliveryDate;
        this.onDateUpdate.emit(result);
      }
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.nextDeliverySubscription$) {
      this.nextDeliverySubscription$.unsubscribe();
    }
  }

  async loadData() {
    this.isLoading = true;

    if (this.nextDeliverySubscription$) {
      this.nextDeliverySubscription$.unsubscribe();
    }

    try {
      if (this.siteId) {
        this.nextDeliverySubscription$ = this.httpService
          .getShippingOptions({
            siteId: this.siteId,
            shippingDetails: {
              ...this.shippingDetails,
              shippingOptionFilters: {
                nextOrderDate: this.orderDate,
              },
            },
          })
          .subscribe({
            error: (e) => {
              this.isLoading = false;
            },
            next: (response: ShippingOptionsResponse) => {
              if (response.shippingLines) {
                //utc
                this.deliveryDate = moment.utc(
                  response.shippingLines.recommendedDeliveryDate.deliveryDate
                );

                this.onDateUpdate.emit({
                  deliveryDate: this.deliveryDate,
                  shippingLine:
                    response.shippingLines.recommendedDeliveryDate
                      .shippingLines[0],
                });
              }
            },
            complete: () => {
              this.isLoading = false;
            },
          });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      this.isLoading = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['shippingDetails'] ||
      changes['siteId'] ||
      changes['orderDate']
    ) {
      this.loadData();
    }
  }
}
