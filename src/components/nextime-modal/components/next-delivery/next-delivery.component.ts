import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DateSuffix } from '../../../../date-suffix.pipe';
import { ShippingLine } from '../../../../models/shared';
import {MatTooltipModule} from '@angular/material/tooltip';

import moment from 'moment';

@Component({
  selector: 'app-next-delivery',
  standalone: true,
  imports: [MatCard, MatCardContent, MatIconModule, DateSuffix, CommonModule, MatTooltipModule],
  templateUrl: './next-delivery.component.html',
  styleUrl: './next-delivery.component.css',
})
export class NextDeliveryComponent {
  @Input() deliveryDate?: moment.Moment;
  @Input() selectedShippingLine: ShippingLine | undefined;
}
