import { Injectable } from '@angular/core';
import { KeyCode } from './custom-select-types';

@Injectable({
    providedIn: 'root',
})

export class CustomSelectCommonFunction {

    // handleKeyCode($event: KeyboardEvent) {
    //     switch ($event.which) {
    //         case KeyCode.ArrowDown:
    //             this._handleArrowDown($event);
    //             break;
    //         case KeyCode.ArrowUp:
    //             this._handleArrowUp($event);
    //             break;
    //         case KeyCode.Space:
    //             this._handleSpace($event);
    //             break;
    //         case KeyCode.Enter:
    //             this._handleEnter($event);
    //             break;
    //         case KeyCode.Tab:
    //             this._handleTab($event);
    //             break;
    //         case KeyCode.Esc:
    //             this.close();
    //             $event.preventDefault();
    //             break;
    //         case KeyCode.Backspace:
    //             this._handleBackspace();
    //             break
    //     }
    // }
}
