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
    validateNumber(e: any) {
        let input = String.fromCharCode(e.charCode);
        const reg = /^[0-9]*$/;

        if (!reg.test(input)) {
            e.preventDefault();
        }
    }
    validateNotAllowSpecial(e: any) {
        let input = String.fromCharCode(e.charCode);
        var reg = /^[a-zA-Z0-9-]*$/;
        if (!reg.test(input)) {
            e.preventDefault();
        }
    }
}

