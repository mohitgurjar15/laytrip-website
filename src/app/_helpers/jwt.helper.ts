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
    localStorage.setItem('userToken', "");
    window.location.href = '/login';
}

export const getLoginUserInfo = () => {

    let token = localStorage.getItem('_lay_sess')
    try {
        return jwt_decode(token);
    }
    catch (error) {
        return {};
    }

    localStorage.setItem('_lay_sess', "");
    // window.location.href='/login';
}
