import * as jwt_decode from "jwt-decode";

export const getUserDetails = (token) => {

    try {
        return jwt_decode(token);
    }
    catch (error) {
        redirectToLogin();
    }

}

export const redirectToLogin = () => {
    localStorage.removeItem('_lay_sess');
    localStorage.removeItem('$crt');
    window.location.href = '/';
}


export const getLoginUserInfo = () => {

    let token = localStorage.getItem('_lay_sess')
    try {
        return jwt_decode(token);
    }
    catch (error) {
        return {};
    }

}
