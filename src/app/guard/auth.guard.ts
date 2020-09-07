import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { redirectToLogin, getUserDetails } from '../_helpers/jwt.helper';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        let result = this.validateUserandRole(next)
        if (result)
            return true;
        else
            redirectToLogin();
    }

    canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let result = this.validateUserandRole(next)
        if (result)
            return true;
        else
            this.router.navigate(['/access-denied']);
        // redirectToLogin()
    }

    validateUserandRole(next) {

        const user = getUserDetails(localStorage.getItem('_lay_sess'))
        // console.log(user,typeof next.data);
        if (user) {
            if (typeof next.data == 'object' && Object.values(next.data).length == 0) {
                return true;
            }
            else if (typeof next.data != 'undefined' && typeof next.data.role != 'undefined' && next.data.role.includes(user.roleId)) {

                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }

    }


}
