import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Moment } from 'moment';
import { DateSuffix } from '../../../../date-suffix.pipe';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [MatButton, CommonModule, DateSuffix],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css',
})
export class ConfirmModalComponent {
  @Output() onClosed = new EventEmitter<boolean>();
  @Input() selectedDate?: Moment;

  handleClose(confirm: boolean) {
    this.onClosed.emit(confirm);
  }
}
