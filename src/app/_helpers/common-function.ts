import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})


export class CommonFunction {

    closeModal(modelBox) {
        return modelBox = false;
    }

    parseDateWithFormat(date) {
        console.log(date);
    }
}
