export const installmentType={
    en:{
        weekly : 'Weekly',
        biweekly : 'Bi-Weekly',
        monthly : 'Monthly'
    },
    es:{
        weekly : 'Semanal',
        biweekly : 'Quincenal',
        monthly : 'Mensual'
    }
}

// Author: xavier | 2021/7/29 | 2021/8/13
// Description: Temporary workaround to avoid calling Google's Translate API
export function translateAmenities(title: string) {
    const userLang = JSON.parse(localStorage.getItem('_lang')).iso_1Code;
    if(userLang == 'es'){
        for(let i = 0; i < amenitiesTranslations.length; i++) {
            if(amenitiesTranslations[i].en == title) {
                return amenitiesTranslations[i].es;
            }
        }    
    }
    return title;
}

const amenitiesTranslations: {en: string, es: string}[] = [
    {en: "Airport Shuttle",                 es: "Transporte al Aeropuerto"},
    {en: "Business Center",                 es: "Centro de Negocios"},
    {en: "Free Internet Available",         es: "Internet Gratis Disponible"},
    {en: "Free Internet Access",            es: "Acceso Gratuito a Internet"},
    {en: "Free Internet In Public Areas",   es: "Internet Gratis en Áreas Públicas"},
    {en: "Accessible",                      es: "Accesible"},
    {en: "No Smoking Rooms/Facilities",     es: "Habitaciones / Instalaciones para No Fumadores"},
    {en: "Pets Allowed",                    es: "Mascotas Permitidas"},
    {en: "Restaurant",                      es: "Restaurante"},
    {en: "Free Breakfast",                  es: "Desayuno Gratuito"},
    {en: "Fitness Center or Spa",           es: "Gimnasio o Spa"},
    {en: "Free Parking",                    es: "Parqueo Gratuito"},
    {en: "Swimming Pool",                   es: "Piscina"},
    {en: "Free Airport Shuttle",            es: "Transporte Gratuito al Aeropuerto"},
    {en: "Casino",                          es: "Casino"}
];

export const CalendarTranslations = {
    en: {
        firstDayOfWeek: 0,
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        today: 'Today',
        clear: 'Clear',
    },
    es: {
        firstDayOfWeek: 1,
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        today: 'Hoy',
        clear: 'Limpiar',
    }
};