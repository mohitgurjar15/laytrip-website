import * as jwt_decode from "jwt-decode";

export const getUserDetails=(token)=>{

    try{
        return jwt_decode(token);
    }
    catch(error){
        redirectToLogin();
    }
    
}

export const redirectToLogin=()=>{
    localStorage.setItem('_lay_sess',"");
    // window.location.href='/login';
}