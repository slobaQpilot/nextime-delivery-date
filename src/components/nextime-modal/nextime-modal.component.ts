import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NextDeliveryComponent } from './components/next-delivery/next-delivery.component';
import { DeliveryOptionsComponent } from './components/delivery-options/delivery-options.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { CommonModule } from '@angular/common';
import { ChangeNextDeliveryComponent } from './components/change-next-delivery/change-next-delivery.component';
import {
  DeliveryDate,
  ShippingDetails,
  ShippingLine,
  ShippingOptionsResponse,
} from '../../models/shared';
import moment from 'moment';
import { HttpService } from '../../app/services/http.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { CalendarService } from '../../app/services/calendar.service';

export interface DialogData {
  shippingDetails: ShippingDetails | undefined;
  orderDate: string | undefined;
  siteId: string | undefined;
  deliveryDate: moment.Moment;
}

@Component({
  selector: 'app-nextime-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    NextDeliveryComponent,
    DeliveryOptionsComponent,
    DatePickerComponent,
    ChangeNextDeliveryComponent,
    MatProgressSpinnerModule,
  ],
  providers: [HttpService],
  templateUrl: './nextime-modal.component.html',
  styleUrl: './nextime-modal.component.css',
})
export class NextimeModalComponent implements OnInit, OnDestroy {
  datePickerMode = true;
  isLoading = false;
  deliveryDate?: moment.Moment;
  failedMessage = 'No options found, please try a different Date Range.';
  deliveryOptions?: DeliveryDate[] = [];
  filteredDeliveryOptions?: DeliveryDate[] = [];
  selectedOption?: DeliveryDate;
  selectedShippingLine: ShippingLine | undefined;
  private monthChangeSubscription: Subscription | undefined;
  nextDeliverySubscription$?: Subscription;

  constructor(
    public dialogRef: MatDialogRef<NextimeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private httpService: HttpService,
    private calendarService: CalendarService
  ) {}

  onUpdate(): void {
    const newShippingLine =
      this.selectedShippingLine ||
      this.selectedOption?.shippingLines[0] ||
      this.deliveryOptions?.[0]?.shippingLines[0];
    this.dialogRef.close({
      deliveryDate: this.deliveryDate,
      shippingLine: {
        ...newShippingLine,
        nextOrderDate: newShippingLine?.nextOrderDate,
      },
    });
  }

  openDatepicker() {
    this.datePickerMode = true;
  }

  public getScreenWidth: any;

  ngOnInit() {
    this.getScreenWidth = window.innerWidth;
    this.updatePickerOverWSize();
    this.deliveryDate = this.data.deliveryDate;

    if (
      Object.keys(this.data.shippingDetails?.shippingAddress || {})?.length &&
      this.data.orderDate
    ) {
      this.loadData(
        this.data.orderDate
          ? moment().utc().month(new Date(this.data.orderDate).getMonth())
          : undefined
      );
    }

    this.monthChangeSubscription = this.calendarService.monthChanged.subscribe(
      ({ month }) => {
        this.loadData(moment().utc().month(month));
      }
    );
  }

  ngOnDestroy() {
    if (this.monthChangeSubscription) {
      this.monthChangeSubscription.unsubscribe();
    }

    if (this.nextDeliverySubscription$) {
      this.nextDeliverySubscription$.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.updatePickerOverWSize();
  }

  updatePickerOverWSize() {
    if (this.getScreenWidth < 1701) {
      this.datePickerMode = false;
    } else {
      this.datePickerMode = true;
    }
  }

  handleDateSelected(newDate?: moment.Moment) {
    if (newDate) {
      this.deliveryDate = moment(newDate);
      this.filterOptions();
      this.updatePickerOverWSize();
    }
  }

  filterOptions(response?: ShippingOptionsResponse) {
    if (response?.shippingLines) {
      this.deliveryOptions = response.shippingLines?.deliveryDates;
      if (!this.deliveryDate) {
        this.deliveryDate = moment.utc(
          response.shippingLines?.recommendedDeliveryDate.deliveryDate
        );
      }
    }

    this.filteredDeliveryOptions = this.deliveryOptions?.filter((option) =>
      moment(moment.utc(option.deliveryDate).format('YYYY-MM-DD')).isBefore(
        moment(moment.utc(this.deliveryDate).format('YYYY-MM-DD'))
      )
    );

    this.selectedOption = this.deliveryOptions?.find((option) => {
      return (
        moment.utc(option.deliveryDate).format('YYYY-MMMM-DD') ===
        this.deliveryDate?.format('YYYY-MMMM-DD')
      );
    });

    this.selectedShippingLine = this.selectedOption?.shippingLines[0];

    if (this.selectedOption?.deliveryDate) {
      this.deliveryDate = moment.utc(
        this.selectedOption?.deliveryDate.substring(0, 10)
      );
    }
  }

  async loadData(maxDeliveryDate?: moment.Moment) {
    this.isLoading = true;

    if (this.nextDeliverySubscription$) {
      this.nextDeliverySubscription$.unsubscribe();
    }

    try {
      let max;
      if (maxDeliveryDate?.isBefore(this.deliveryDate) || !maxDeliveryDate) {
        max = moment.utc(this.deliveryDate);
      } else {
        max = maxDeliveryDate;
      }
      if (this.data.siteId) {
        this.nextDeliverySubscription$ = this.httpService
          .getShippingOptions({
            siteId: this.data.siteId,
            shippingDetails: {
              ...this.data.shippingDetails,
              shippingOptionFilters: {
                minDeliveryDate: moment.utc().endOf('day').format(),
                maxDeliveryDate: max?.endOf('month').endOf('day').format(),
              },
            },
          })
          .subscribe({
            error: (e) => console.error(e),
            next: (response: ShippingOptionsResponse) => {
              this.filterOptions(response);
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

  handleOptionSelected(date: Date) {
    this.deliveryDate = moment.utc(date);
    this.filterOptions();
  }
}
