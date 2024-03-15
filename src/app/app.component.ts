import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NextimeCardComponent } from '../components/nextime-card/nextime-card.component';
import { CommonModule } from '@angular/common';
import { ShippingLine } from '../models/shared';
import { Moment } from 'moment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NextimeCardComponent, CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnChanges {
  @Input('order-date') orderDate?: string;
  @Input('shipping-address') shippingAddress?: string;
  @Input() order?: string;
  @Input('site-id') siteId?: string;
  @Output() onDateUpdate = new EventEmitter<{
    deliveryDate: string;
    shippingLine: ShippingLine;
  }>();

  isLoading = false;
  shippingDetails = {};

  ngOnInit() {
    this.updateShippingAddress();
  }

  updateShippingAddress() {
    if (this.order && this.shippingAddress) {
      this.shippingDetails = {
        ...JSON.parse(this.order || '{}'),
        shippingAddress: JSON.parse(this.shippingAddress || '{}'),
      };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['shippingAddress'] ||
      changes['siteId'] ||
      changes['orderDate'] ||
      changes['order']
    ) {
      this.updateShippingAddress();
    }
  }

  handleDateUpdate(result: {
    deliveryDate: Moment;
    shippingLine: ShippingLine;
  }) {
    this.onDateUpdate.emit({
      ...result,
      deliveryDate: result.deliveryDate?.format('YYYY-MM-DDT00:00:00Z'),
    });
  }
}
