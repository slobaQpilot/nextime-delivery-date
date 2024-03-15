import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DateSuffix } from '../../../../date-suffix.pipe';

@Component({
  selector: 'app-change-next-delivery',
  standalone: true,
  imports: [MatCard, MatCardContent, MatIconModule, CommonModule, DateSuffix],
  templateUrl: './change-next-delivery.component.html',
  styleUrl: './change-next-delivery.component.css',
})
export class ChangeNextDeliveryComponent {
  @Input() deliveryDate?: moment.Moment;
}
