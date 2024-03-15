import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { DeliveryDate } from '../../../../models/shared';
import { CommonModule } from '@angular/common';
import { DateSuffix } from '../../../../date-suffix.pipe';
import moment from 'moment';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-delivery-options',
  standalone: true,
  imports: [MatRadioModule, CommonModule, DateSuffix, MatTooltipModule],
  templateUrl: './delivery-options.component.html',
  styleUrl: './delivery-options.component.css',
})
export class DeliveryOptionsComponent implements OnChanges {
  selectedShippingLineName?: string;
  optionsVisibleCount: number | undefined = 4;
  selectedOptionsVisibleCount: number | undefined = 3;
  @Input() options?: DeliveryDate[];
  @Input() selectedOption?: DeliveryDate;
  @Output() selected = new EventEmitter<Date>();
  momentjs = moment;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedOption']) {
      this.selectedShippingLineName =
        changes['selectedOption'].currentValue?.shippingLines[0].name;
    }

    console.log(this.selectedShippingLineName);
    console.log(this.selectedOption);
  }

  handleShowOptions() {
    this.optionsVisibleCount = undefined;
  }

  handleShowSelectedOptions() {
    this.selectedOptionsVisibleCount = undefined;
  }

  handleDateChange(event: MatRadioChange) {
    this.selected.emit(event.value);
  }
}
