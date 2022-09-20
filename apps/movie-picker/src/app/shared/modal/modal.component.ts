import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'movie-picker-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.less'],
})
export class ModalComponent {
    @Input() isOpen = false;
    @Output() hideModal = new EventEmitter<void>();

    handleHideModal() {
        this.hideModal.emit();
    }
}
