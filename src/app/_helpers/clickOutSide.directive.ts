import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[clickOutside]',
})
export class ClickOutSideDirective {

    @Output() clickOutside = new EventEmitter<void>();

    constructor(private elementRef: ElementRef) { }

    @HostListener('document:click', ['$event.target'])
    public onClick(target) {
        const clickedInside = this.elementRef.nativeElement.contains(target);
        if (!clickedInside) {
            this.clickOutside.emit();
        }
    }
}
