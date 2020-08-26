import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})


export class CommonFunction {

    closeModal(modelBox){
        return modelBox = false;
    }

    validateNumber(e: any) {
        let input = String.fromCharCode(e.charCode);
        const reg = /^[0-9]*$/;
        
        if (!reg.test(input)) {
          e.preventDefault();
        }
    }
}