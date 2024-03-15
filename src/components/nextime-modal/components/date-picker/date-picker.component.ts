import moment, { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DatePickerHeaderComponent } from '../date-picker-header/date-picker-header.component';
import { CommonModule } from '@angular/common';
import { DeliveryDate } from '../../../../models/shared';

class CustomDateAdapter extends MomentDateAdapter {
  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow') {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }
}

export const MATERIAL_DATEPICKER_FORMATS = {
  parse: {
    dateInput: 'DD/MMM/YYYY',
  },
  display: {
    dateInput: 'DD/MMM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MMM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-date-picker',
  standalone: true,
  providers: [
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MATERIAL_DATEPICKER_FORMATS },
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    ConfirmModalComponent,
    MatDialogModule,
    DatePickerHeaderComponent,
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
})
export class DatePickerComponent implements OnInit, OnChanges {
  prevSelected?: Moment;
  datePickerHeader = DatePickerHeaderComponent;
  isConfirmDialogOpen = false;
  today: Moment = moment();
  @Input() options?: DeliveryDate[];
  @Input() selected?: moment.Moment;
  @Output() dateSelected = new EventEmitter<Moment | undefined>();
  isLoading = false;
  myFilter = (d: moment.Moment | null): boolean => false;

  ngOnInit() {
    this.prevSelected = this.selected;
    this.myFilter = this.createDateFilter(this.options);
  }

  openDialog(): void {
    this.isConfirmDialogOpen = true;
  }

  closeDialog(): void {
    this.isConfirmDialogOpen = false;
  }

  handleDateChange(selectedDate: Moment | null) {
    if (selectedDate) {
      this.selected = selectedDate;
      this.openDialog();
    }
  }

  handleCloseConfirm(confirm: boolean) {
    this.isConfirmDialogOpen = false;
    if (!confirm) {
      this.selected = this.prevSelected;
    } else {
      this.prevSelected = this.selected;
      this.dateSelected.emit(this.selected);
    }
  }

  createDateFilter(options?: DeliveryDate[]) {
    return (d: moment.Moment | null): boolean => {
      if (!d || !options) return false;
      return options.some((option) => {
        return (
          moment(d, moment.ISO_8601).format('YYYY-MM-DD') ===
          moment.utc(option.deliveryDate).format('YYYY-MM-DD')
        );
      });
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']?.currentValue) {
      this.myFilter = this.createDateFilter(this.options);
    }
  }
}
