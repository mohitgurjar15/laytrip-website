// jquery.daterangepicker.js
// author : Chunlong Liu
// license : MIT
// www.jszen.com

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'moment'], factory);
    } else if (typeof exports === 'object' && typeof module !== 'undefined') {
        // CommonJS. Register as a module
        module.exports = factory(require('jquery'), require('moment'));
    } else {
        // Browser globals
        factory(jQuery, moment);
    }
}(function ($, moment) {
    'use strict';
    $.dateRangePickerLanguages = {
        "default": //default language: English
        {
            "selected": "Selected:",
            "day": "Day",
            "days": "Days",
            "apply": "Close",
            "week-1": "mo",
            "week-2": "tu",
            "week-3": "we",
            "week-4": "th",
            "week-5": "fr",
            "week-6": "sa",
            "week-7": "su",
            "week-number": "W",
            "month-name": ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
            "shortcuts": "Shortcuts",
            "custom-values": "Custom Values",
            "past": "Past",
            "following": "Following",
            "previous": "Previous",
            "prev-week": "Week",
            "prev-month": "Month",
            "prev-year": "Year",
            "next": "Next",
            "next-week": "Week",
            "next-month": "Month",
            "next-year": "Year",
            "less-than": "Date range should not be more than %d days",
            "more-than": "Date range should not be less than %d days",
            "default-more": "Please select a date range longer than %d days",
            "default-single": "Please select a date",
            "default-less": "Please select a date range less than %d days",
            "default-range": "Please select a date range between %d and %d days",
            "default-default": "Please select a date range",
            "time": "Time",
            "hour": "Hour",
            "minute": "Minute"
        },
        "id": {
            "selected": "Terpilih:",
            "day": "Hari",
            "days": "Hari",
            "apply": "Tutup",
            "week-1": "sen",
            "week-2": "sel",
            "week-3": "rab",
            "week-4": "kam",
            "week-5": "jum",
            "week-6": "sab",
            "week-7": "min",
            "week-number": "W",
            "month-name": ["januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"],
            "shortcuts": "Pintas",
            "custom-values": "Nilai yang ditentukan",
            "past": "Yang Lalu",
            "following": "Mengikuti",
            "previous": "Sebelumnya",
            "prev-week": "Minggu",
            "prev-month": "Bulan",
            "prev-year": "Tahun",
            "next": "Selanjutnya",
            "next-week": "Minggu",
            "next-month": "Bulan",
            "next-year": "Tahun",
            "less-than": "Tanggal harus lebih dari %d hari",
            "more-than": "Tanggal harus kurang dari %d hari",
            "default-more": "Jarak tanggal harus lebih lama dari %d hari",
            "default-single": "Silakan pilih tanggal",
            "default-less": "Jarak rentang tanggal tidak boleh lebih lama dari %d hari",
            "default-range": "Rentang tanggal harus antara %d dan %d hari",
            "default-default": "Silakan pilih rentang tanggal",
            "time": "Waktu",
            "hour": "Jam",
            "minute": "Menit"
        },
        "az": {
            "selected": "SeÃ§ildi:",
            "day": " gÃ¼n",
            "days": " gÃ¼n",
            "apply": "tÉ™tbiq",
            "week-1": "1",
            "week-2": "2",
            "week-3": "3",
            "week-4": "4",
            "week-5": "5",
            "week-6": "6",
            "week-7": "7",
            "month-name": ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"],
            "shortcuts": "QÄ±sayollar",
            "past": "KeÃ§miÅŸ",
            "following": "NÃ¶vbÉ™ti",
            "previous": "&nbsp;&nbsp;&nbsp;",
            "prev-week": "Ã–ncÉ™ki hÉ™ftÉ™",
            "prev-month": "Ã–ncÉ™ki ay",
            "prev-year": "Ã–ncÉ™ki il",
            "next": "&nbsp;&nbsp;&nbsp;",
            "next-week": "NÃ¶vbÉ™ti hÉ™ftÉ™",
            "next-month": "NÃ¶vbÉ™ti ay",
            "next-year": "NÃ¶vbÉ™ti il",
            "less-than": "Tarix aralÄ±ÄŸÄ± %d gÃ¼ndÉ™n Ã§ox olmamalÄ±dÄ±r",
            "more-than": "Tarix aralÄ±ÄŸÄ± %d gÃ¼ndÉ™n az olmamalÄ±dÄ±r",
            "default-more": "%d gÃ¼ndÉ™n Ã§ox bir tarix seÃ§in",
            "default-single": "Tarix seÃ§in",
            "default-less": "%d gÃ¼ndÉ™n az bir tarix seÃ§in",
            "default-range": "%d vÉ™ %d gÃ¼n aralÄ±ÄŸÄ±nda tarixlÉ™r seÃ§in",
            "default-default": "Tarix aralÄ±ÄŸÄ± seÃ§in"
        },
        "bg": {
            "selected": "Ð˜Ð·Ð±Ñ€Ð°Ð½Ð¾:",
            "day": "Ð”ÐµÐ½",
            "days": "Ð”Ð½Ð¸",
            "apply": "Ð—Ð°Ñ‚Ð²Ð¾Ñ€Ð¸",
            "week-1": "Ð¿Ð½",
            "week-2": "Ð²Ñ‚",
            "week-3": "ÑÑ€",
            "week-4": "Ñ‡Ñ‚",
            "week-5": "Ð¿Ñ‚",
            "week-6": "ÑÐ±",
            "week-7": "Ð½Ð´",
            "week-number": "Ð¡",
            "month-name": ["ÑÐ½ÑƒÐ°Ñ€Ð¸", "Ñ„ÐµÐ²Ñ€ÑƒÐ°Ñ€Ð¸", "Ð¼Ð°Ñ€Ñ‚", "Ð°Ð¿Ñ€Ð¸Ð»", "Ð¼Ð°Ð¹", "ÑŽÐ½Ð¸", "ÑŽÐ»Ð¸", "Ð°Ð²Ð³ÑƒÑÑ‚", "ÑÐµÐ¿Ñ‚ÐµÐ¼Ð²Ñ€Ð¸", "Ð¾ÐºÑ‚Ð¾Ð¼Ð²Ñ€Ð¸", "Ð½Ð¾ÐµÐ¼Ð²Ñ€Ð¸", "Ð´ÐµÐºÐµÐ¼Ð²Ñ€Ð¸"],
            "shortcuts": "ÐŸÑ€ÐµÐºÐ¸ Ð¿ÑŠÑ‚Ð¸Ñ‰Ð°",
            "custom-values": "ÐŸÐµÑ€ÑÐ¾Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€Ð°Ð½Ð¸ ÑÑ‚Ð¾Ð¹Ð½Ð¾ÑÑ‚Ð¸",
            "past": "ÐœÐ¸Ð½Ð°Ð»",
            "following": "Ð¡Ð»ÐµÐ´Ð²Ð°Ñ‰",
            "previous": "ÐŸÑ€ÐµÐ´Ð¸ÑˆÐµÐ½",
            "prev-week": "Ð¡ÐµÐ´Ð¼Ð¸Ñ†Ð°",
            "prev-month": "ÐœÐµÑÐµÑ†",
            "prev-year": "Ð“Ð¾Ð´Ð¸Ð½Ð°",
            "next": "Ð¡Ð»ÐµÐ´Ð²Ð°Ñ‰",
            "next-week": "Ð¡ÐµÐ´Ð¼Ð¸Ñ†Ð°",
            "next-month": "ÐœÐµÑÐµÑ†",
            "next-year": "Ð“Ð¾Ð´Ð¸Ð½Ð°",
            "less-than": "ÐŸÐµÑ€Ð¸Ð¾Ð´ÑŠÑ‚ Ð¾Ñ‚ Ð²Ñ€ÐµÐ¼Ðµ Ð½Ðµ Ñ‚Ñ€ÑÐ±Ð²Ð° Ð´Ð° Ðµ Ð¿Ð¾Ð²ÐµÑ‡Ðµ Ð¾Ñ‚ %d Ð´Ð½Ð¸",
            "more-than": "ÐŸÐµÑ€Ð¸Ð¾Ð´ÑŠÑ‚ Ð¾Ñ‚ Ð²Ñ€ÐµÐ¼Ðµ Ð½Ðµ Ñ‚Ñ€ÑÐ±Ð²Ð° Ð´Ð° Ðµ Ð¿Ð¾-Ð¼Ð°Ð»ÐºÐ¾ Ð¾Ñ‚ %d Ð´Ð½Ð¸",
            "default-more": "ÐœÐ¾Ð»Ñ Ð¸Ð·Ð±ÐµÑ€ÐµÑ‚Ðµ Ð¿ÐµÑ€Ð¸Ð¾Ð´ Ð¿Ð¾-Ð´ÑŠÐ»ÑŠÐ³ Ð¾Ñ‚ %d Ð´Ð½Ð¸",
            "default-single": "ÐœÐ¾Ð»Ñ Ð¸Ð·Ð±ÐµÑ€ÐµÑ‚Ðµ Ð´Ð°Ñ‚Ð°",
            "default-less": "ÐœÐ¾Ð»Ñ Ð¸Ð·Ð±ÐµÑ€ÐµÑ‚Ðµ Ð¿ÐµÑ€Ð¸Ð¾Ð´ Ð¿Ð¾-ÐºÑŠÑ Ð¾Ñ‚ %d Ð´Ð½Ð¸",
            "default-range": "ÐœÐ¾Ð»Ñ Ð¸Ð·Ð±ÐµÑ€ÐµÑ‚Ðµ Ð¿ÐµÑ€Ð¸Ð¾Ð´ Ð¼ÐµÐ¶Ð´Ñƒ %d Ð¸ %d Ð´Ð½Ð¸",
            "default-default": "ÐœÐ¾Ð»Ñ Ð¸Ð·Ð±ÐµÑ€ÐµÑ‚Ðµ Ð¿ÐµÑ€Ð¸Ð¾Ð´",
            "time": "Ð’Ñ€ÐµÐ¼Ðµ",
            "hour": "Ð§Ð°Ñ",
            "minute": "ÐœÐ¸Ð½ÑƒÑ‚Ð°"
        },
        "cn": //simplified chinese
        {
            "selected": "å·²é€‰æ‹©:",
            "day": "å¤©",
            "days": "å¤©",
            "apply": "ç¡®å®š",
            "week-1": "ä¸€",
            "week-2": "äºŒ",
            "week-3": "ä¸‰",
            "week-4": "å››",
            "week-5": "äº”",
            "week-6": "å…­",
            "week-7": "æ—¥",
            "week-number": "å‘¨",
            "month-name": ["ä¸€æœˆ", "äºŒæœˆ", "ä¸‰æœˆ", "å››æœˆ", "äº”æœˆ", "å…­æœˆ", "ä¸ƒæœˆ", "å…«æœˆ", "ä¹æœˆ", "åæœˆ", "åä¸€æœˆ", "åäºŒæœˆ"],
            "shortcuts": "å¿«æ·é€‰æ‹©",
            "past": "è¿‡åŽ»",
            "following": "å°†æ¥",
            "previous": "&nbsp;&nbsp;&nbsp;",
            "prev-week": "ä¸Šå‘¨",
            "prev-month": "ä¸Šä¸ªæœˆ",
            "prev-year": "åŽ»å¹´",
            "next": "&nbsp;&nbsp;&nbsp;",
            "next-week": "ä¸‹å‘¨",
            "next-month": "ä¸‹ä¸ªæœˆ",
            "next-year": "æ˜Žå¹´",
            "less-than": "æ‰€é€‰æ—¥æœŸèŒƒå›´ä¸èƒ½å¤§äºŽ%då¤©",
            "more-than": "æ‰€é€‰æ—¥æœŸèŒƒå›´ä¸èƒ½å°äºŽ%då¤©",
            "default-more": "è¯·é€‰æ‹©å¤§äºŽ%då¤©çš„æ—¥æœŸèŒƒå›´",
            "default-less": "è¯·é€‰æ‹©å°äºŽ%då¤©çš„æ—¥æœŸèŒƒå›´",
            "default-range": "è¯·é€‰æ‹©%då¤©åˆ°%då¤©çš„æ—¥æœŸèŒƒå›´",
            "default-single": "è¯·é€‰æ‹©ä¸€ä¸ªæ—¥æœŸ",
            "default-default": "è¯·é€‰æ‹©ä¸€ä¸ªæ—¥æœŸèŒƒå›´",
            "time": "æ—¶é—´",
            "hour": "å°æ—¶",
            "minute": "åˆ†é’Ÿ"
        },
        "cz": {
            "selected": "VybrÃ¡no:",
            "day": "Den",
            "days": "Dny",
            "apply": "ZavÅ™Ã­t",
            "week-1": "po",
            "week-2": "Ãºt",
            "week-3": "st",
            "week-4": "Ät",
            "week-5": "pÃ¡",
            "week-6": "so",
            "week-7": "ne",
            "month-name": ["leden", "Ãºnor", "bÅ™ezen", "duben", "kvÄ›ten", "Äerven", "Äervenec", "srpen", "zÃ¡Å™Ã­", "Å™Ã­jen", "listopad", "prosinec"],
            "shortcuts": "Zkratky",
            "past": "po",
            "following": "nÃ¡sledujÃ­cÃ­",
            "previous": "pÅ™edchozÃ­",
            "prev-week": "tÃ½den",
            "prev-month": "mÄ›sÃ­c",
            "prev-year": "rok",
            "next": "dalÅ¡Ã­",
            "next-week": "tÃ½den",
            "next-month": "mÄ›sÃ­c",
            "next-year": "rok",
            "less-than": "Rozsah data by nemÄ›l bÃ½t vÄ›tÅ¡Ã­ neÅ¾ %d dnÅ¯",
            "more-than": "Rozsah data by nemÄ›l bÃ½t menÅ¡Ã­ neÅ¾ %d dnÅ¯",
            "default-more": "ProsÃ­m zvolte rozsah data vÄ›tÅ¡Ã­ neÅ¾ %d dnÅ¯",
            "default-single": "ProsÃ­m zvolte datum",
            "default-less": "ProsÃ­m zvolte rozsah data menÅ¡Ã­ neÅ¾ %d dnÅ¯",
            "default-range": "ProsÃ­m zvolte rozsah data mezi %d a %d dny",
            "default-default": "ProsÃ­m zvolte rozsah data"
        },
        "de": {
            "selected": "Auswahl:",
            "day": "Tag",
            "days": "Tage",
            "apply": "SchlieÃŸen",
            "week-1": "mo",
            "week-2": "di",
            "week-3": "mi",
            "week-4": "do",
            "week-5": "fr",
            "week-6": "sa",
            "week-7": "so",
            "month-name": ["januar", "februar", "mÃ¤rz", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "dezember"],
            "shortcuts": "Schnellwahl",
            "past": "Vorherige",
            "following": "Folgende",
            "previous": "Vorherige",
            "prev-week": "Woche",
            "prev-month": "Monat",
            "prev-year": "Jahr",
            "next": "NÃ¤chste",
            "next-week": "Woche",
            "next-month": "Monat",
            "next-year": "Jahr",
            "less-than": "Datumsbereich darf nicht grÃ¶ÃŸer sein als %d Tage",
            "more-than": "Datumsbereich darf nicht kleiner sein als %d Tage",
            "default-more": "Bitte mindestens %d Tage auswÃ¤hlen",
            "default-single": "Bitte ein Datum auswÃ¤hlen",
            "default-less": "Bitte weniger als %d Tage auswÃ¤hlen",
            "default-range": "Bitte einen Datumsbereich zwischen %d und %d Tagen auswÃ¤hlen",
            "default-default": "Bitte ein Start- und Enddatum auswÃ¤hlen",
            "Time": "Zeit",
            "hour": "Stunde",
            "minute": "Minute"
        },
        "es": {
            "selected": "Seleccionado:",
            "day": "DÃ­a",
            "days": "DÃ­as",
            "apply": "Cerrar",
            "week-1": "lu",
            "week-2": "ma",
            "week-3": "mi",
            "week-4": "ju",
            "week-5": "vi",
            "week-6": "sa",
            "week-7": "do",
            "month-name": ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            "shortcuts": "Accesos directos",
            "past": "Pasado",
            "following": "Siguiente",
            "previous": "Anterior",
            "prev-week": "Semana",
            "prev-month": "Mes",
            "prev-year": "AÃ±o",
            "next": "Siguiente",
            "next-week": "Semana",
            "next-month": "Mes",
            "next-year": "AÃ±o",
            "less-than": "El rango no deberÃ­a ser mayor de %d dÃ­as",
            "more-than": "El rango no deberÃ­a ser menor de %d dÃ­as",
            "default-more": "Por favor selecciona un rango mayor a %d dÃ­as",
            "default-single": "Por favor selecciona un dÃ­a",
            "default-less": "Por favor selecciona un rango menor a %d dÃ­as",
            "default-range": "Por favor selecciona un rango entre %d y %d dÃ­as",
            "default-default": "Por favor selecciona un rango de fechas."
        },
        "fr": {
            "selected": "SÃ©lection:",
            "day": "Jour",
            "days": "Jours",
            "apply": "Fermer",
            "week-1": "lu",
            "week-2": "ma",
            "week-3": "me",
            "week-4": "je",
            "week-5": "ve",
            "week-6": "sa",
            "week-7": "di",
            "month-name": ["janvier", "fÃ©vrier", "mars", "avril", "mai", "juin", "juillet", "aoÃ»t", "septembre", "octobre", "novembre", "dÃ©cembre"],
            "shortcuts": "Raccourcis",
            "past": "PassÃ©",
            "following": "Suivant",
            "previous": "PrÃ©cÃ©dent",
            "prev-week": "Semaine",
            "prev-month": "Mois",
            "prev-year": "AnnÃ©e",
            "next": "Suivant",
            "next-week": "Semaine",
            "next-month": "Mois",
            "next-year": "AnnÃ©e",
            "less-than": "L'intervalle ne doit pas Ãªtre supÃ©rieure Ã  %d jours",
            "more-than": "L'intervalle ne doit pas Ãªtre infÃ©rieure Ã  %d jours",
            "default-more": "Merci de choisir une intervalle supÃ©rieure Ã  %d jours",
            "default-single": "Merci de choisir une date",
            "default-less": "Merci de choisir une intervalle infÃ©rieure %d jours",
            "default-range": "Merci de choisir une intervalle comprise entre %d et %d jours",
            "default-default": "Merci de choisir une date"
        },
        "hu": {
            "selected": "KivÃ¡lasztva:",
            "day": "Nap",
            "days": "Nap",
            "apply": "Ok",
            "week-1": "h",
            "week-2": "k",
            "week-3": "sz",
            "week-4": "cs",
            "week-5": "p",
            "week-6": "sz",
            "week-7": "v",
            "month-name": ["januÃ¡r", "februÃ¡r", "mÃ¡rcius", "Ã¡prilis", "mÃ¡jus", "jÃºnius", "jÃºlius", "augusztus", "szeptember", "oktÃ³ber", "november", "december"],
            "shortcuts": "GyorsvÃ¡lasztÃ³",
            "past": "MÃºlt",
            "following": "KÃ¶vetkezÅ‘",
            "previous": "ElÅ‘zÅ‘",
            "prev-week": "HÃ©t",
            "prev-month": "HÃ³nap",
            "prev-year": "Ã‰v",
            "next": "KÃ¶vetkezÅ‘",
            "next-week": "HÃ©t",
            "next-month": "HÃ³nap",
            "next-year": "Ã‰v",
            "less-than": "A kivÃ¡lasztÃ¡s nem lehet tÃ¶bb %d napnÃ¡l",
            "more-than": "A kivÃ¡lasztÃ¡s nem lehet tÃ¶bb %d napnÃ¡l",
            "default-more": "VÃ¡lassz ki egy idÅ‘szakot ami hosszabb mint %d nap",
            "default-single": "VÃ¡lassz egy napot",
            "default-less": "VÃ¡lassz ki egy idÅ‘szakot ami rÃ¶videbb mint %d nap",
            "default-range": "VÃ¡lassz ki egy %d - %d nap hosszÃº idÅ‘szakot",
            "default-default": "VÃ¡lassz ki egy idÅ‘szakot"
        },
        "it": {
            "selected": "Selezionati:",
            "day": "Giorno",
            "days": "Giorni",
            "apply": "Chiudi",
            "week-1": "lu",
            "week-2": "ma",
            "week-3": "me",
            "week-4": "gi",
            "week-5": "ve",
            "week-6": "sa",
            "week-7": "do",
            "month-name": ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
            "shortcuts": "Scorciatoie",
            "past": "Scorso",
            "following": "Successivo",
            "previous": "Precedente",
            "prev-week": "Settimana",
            "prev-month": "Mese",
            "prev-year": "Anno",
            "next": "Prossimo",
            "next-week": "Settimana",
            "next-month": "Mese",
            "next-year": "Anno",
            "less-than": "L'intervallo non dev'essere maggiore di %d giorni",
            "more-than": "L'intervallo non dev'essere minore di %d giorni",
            "default-more": "Seleziona un intervallo maggiore di %d giorni",
            "default-single": "Seleziona una data",
            "default-less": "Seleziona un intervallo minore di %d giorni",
            "default-range": "Seleziona un intervallo compreso tra i %d e i %d giorni",
            "default-default": "Seleziona un intervallo di date"
        },
        "ko": {
            "selected": "ê¸°ê°„:",
            "day": "ì¼",
            "days": "ì¼ê°„",
            "apply": "ë‹«ê¸°",
            "week-1": "ì›”",
            "week-2": "í™”",
            "week-3": "ìˆ˜",
            "week-4": "ëª©",
            "week-5": "ê¸ˆ",
            "week-6": "í† ",
            "week-7": "ì¼",
            "week-number": "ì£¼",
            "month-name": ["1ì›”", "2ì›”", "3ì›”", "4ì›”", "5ì›”", "6ì›”", "7ì›”", "8ì›”", "9ì›”", "10ì›”", "11ì›”", "12ì›”"],
            "shortcuts": "ë‹¨ì¶•í‚¤ë“¤",
            "past": "ì§€ë‚œ(ì˜¤ëŠ˜ê¸°ì¤€)",
            "following": "ì´í›„(ì˜¤ëŠ˜ê¸°ì¤€)",
            "previous": "ì´ì „",
            "prev-week": "1ì£¼",
            "prev-month": "1ë‹¬",
            "prev-year": "1ë…„",
            "next": "ë‹¤ìŒ",
            "next-week": "1ì£¼",
            "next-month": "1ë‹¬",
            "next-year": "1ë…„",
            "less-than": "ë‚ ì§œ ë²”ìœ„ëŠ” %d ì¼ë³´ë‹¤ ë§Žì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤",
            "more-than": "ë‚ ì§œ ë²”ìœ„ëŠ” %d ì¼ë³´ë‹¤ ìž‘ì„ ìˆ˜ ì—†ìŠµë‹ˆë‹¤",
            "default-more": "ë‚ ì§œ ë²”ìœ„ë¥¼ %d ì¼ë³´ë‹¤ ê¸¸ê²Œ ì„ íƒí•´ ì£¼ì„¸ìš”",
            "default-single": "ë‚ ì§œë¥¼ ì„ íƒí•´ ì£¼ì„¸ìš”",
            "default-less": "%d ì¼ë³´ë‹¤ ìž‘ì€ ë‚ ì§œë¥¼ ì„ íƒí•´ ì£¼ì„¸ìš”",
            "default-range": "%dì™€ %d ì¼ ì‚¬ì´ì˜ ë‚ ì§œ ë²”ìœ„ë¥¼ ì„ íƒí•´ ì£¼ì„¸ìš”",
            "default-default": "ë‚ ì§œ ë²”ìœ„ë¥¼ ì„ íƒí•´ ì£¼ì„¸ìš”",
            "time": "ì‹œê°",
            "hour": "ì‹œ",
            "minute": "ë¶„"
        },
        "no": {
            "selected": "Valgt:",
            "day": "Dag",
            "days": "Dager",
            "apply": "Lukk",
            "week-1": "ma",
            "week-2": "ti",
            "week-3": "on",
            "week-4": "to",
            "week-5": "fr",
            "week-6": "lÃ¸",
            "week-7": "sÃ¸",
            "month-name": ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"],
            "shortcuts": "Snarveier",
            "custom-values": "Egendefinerte Verdier",
            "past": "Over", // Not quite sure about the context of this one
            "following": "FÃ¸lger",
            "previous": "Forrige",
            "prev-week": "Uke",
            "prev-month": "MÃ¥ned",
            "prev-year": "Ã…r",
            "next": "Neste",
            "next-week": "Uke",
            "next-month": "MÃ¥ned",
            "next-year": "Ã…r",
            "less-than": "Datoperioden skal ikkje vÃ¦re lengre enn %d dager",
            "more-than": "Datoperioden skal ikkje vÃ¦re kortere enn %d dager",
            "default-more": "Vennligst velg ein datoperiode lengre enn %d dager",
            "default-single": "Vennligst velg ein dato",
            "default-less": "Vennligst velg ein datoperiode mindre enn %d dager",
            "default-range": "Vennligst velg ein datoperiode mellom %d og %d dager",
            "default-default": "Vennligst velg ein datoperiode",
            "time": "Tid",
            "hour": "Time",
            "minute": "Minutter"
        },
        "nl": {
            "selected": "Geselecteerd:",
            "day": "Dag",
            "days": "Dagen",
            "apply": "Ok",
            "week-1": "ma",
            "week-2": "di",
            "week-3": "wo",
            "week-4": "do",
            "week-5": "vr",
            "week-6": "za",
            "week-7": "zo",
            "month-name": ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
            "shortcuts": "Snelkoppelingen",
            "custom-values": "Aangepaste waarden",
            "past": "Verleden",
            "following": "Komend",
            "previous": "Vorige",
            "prev-week": "Week",
            "prev-month": "Maand",
            "prev-year": "Jaar",
            "next": "Volgende",
            "next-week": "Week",
            "next-month": "Maand",
            "next-year": "Jaar",
            "less-than": "Interval moet langer dan %d dagen zijn",
            "more-than": "Interval mag niet minder dan %d dagen zijn",
            "default-more": "Selecteer een interval langer dan %dagen",
            "default-single": "Selecteer een datum",
            "default-less": "Selecteer een interval minder dan %d dagen",
            "default-range": "Selecteer een interval tussen %d en %d dagen",
            "default-default": "Selecteer een interval",
            "time": "Tijd",
            "hour": "Uur",
            "minute": "Minuut"
        },
        "ru": {
            "selected": "Ð’Ñ‹Ð±Ñ€Ð°Ð½Ð¾:",
            "day": "Ð”ÐµÐ½ÑŒ",
            "days": "Ð”Ð½ÐµÐ¹",
            "apply": "ÐŸÑ€Ð¸Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ",
            "week-1": "Ð¿Ð½",
            "week-2": "Ð²Ñ‚",
            "week-3": "ÑÑ€",
            "week-4": "Ñ‡Ñ‚",
            "week-5": "Ð¿Ñ‚",
            "week-6": "ÑÐ±",
            "week-7": "Ð²Ñ",
            "month-name": ["ÑÐ½Ð²Ð°Ñ€ÑŒ", "Ñ„ÐµÐ²Ñ€Ð°Ð»ÑŒ", "Ð¼Ð°Ñ€Ñ‚", "Ð°Ð¿Ñ€ÐµÐ»ÑŒ", "Ð¼Ð°Ð¹", "Ð¸ÑŽÐ½ÑŒ", "Ð¸ÑŽÐ»ÑŒ", "Ð°Ð²Ð³ÑƒÑÑ‚", "ÑÐµÐ½Ñ‚ÑÐ±Ñ€ÑŒ", "Ð¾ÐºÑ‚ÑÐ±Ñ€ÑŒ", "Ð½Ð¾ÑÐ±Ñ€ÑŒ", "Ð´ÐµÐºÐ°Ð±Ñ€ÑŒ"],
            "shortcuts": "Ð‘Ñ‹ÑÑ‚Ñ€Ñ‹Ð¹ Ð²Ñ‹Ð±Ð¾Ñ€",
            "custom-values": "ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒÑÐºÐ¸Ðµ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ñ",
            "past": "ÐŸÑ€Ð¾ÑˆÐµÐ´ÑˆÐ¸Ðµ",
            "following": "Ð¡Ð»ÐµÐ´ÑƒÑŽÑ‰Ð¸Ðµ",
            "previous": "&nbsp;&nbsp;&nbsp;",
            "prev-week": "ÐÐµÐ´ÐµÐ»Ñ",
            "prev-month": "ÐœÐµÑÑÑ†",
            "prev-year": "Ð“Ð¾Ð´",
            "next": "&nbsp;&nbsp;&nbsp;",
            "next-week": "ÐÐµÐ´ÐµÐ»Ñ",
            "next-month": "ÐœÐµÑÑÑ†",
            "next-year": "Ð“Ð¾Ð´",
            "less-than": "Ð”Ð¸Ð°Ð¿Ð°Ð·Ð¾Ð½ Ð½Ðµ Ð¼Ð¾Ð¶ÐµÑ‚ Ð±Ñ‹Ñ‚ÑŒ Ð±Ð¾Ð»ÑŒÑˆÐµ %d Ð´Ð½ÐµÐ¹",
            "more-than": "Ð”Ð¸Ð°Ð¿Ð°Ð·Ð¾Ð½ Ð½Ðµ Ð¼Ð¾Ð¶ÐµÑ‚ Ð±Ñ‹Ñ‚ÑŒ Ð¼ÐµÐ½ÑŒÑˆÐµ %d Ð´Ð½ÐµÐ¹",
            "default-more": "ÐŸÐ¾Ð¶Ð°Ð»ÑƒÐ¹ÑÑ‚Ð° Ð²Ñ‹Ð±ÐµÑ€Ð¸Ñ‚Ðµ Ð´Ð¸Ð°Ð¿Ð°Ð·Ð¾Ð½ Ð±Ð¾Ð»ÑŒÑˆÐµ %d Ð´Ð½ÐµÐ¹",
            "default-single": "ÐŸÐ¾Ð¶Ð°Ð»ÑƒÐ¹ÑÑ‚Ð° Ð²Ñ‹Ð±ÐµÑ€Ð¸Ñ‚Ðµ Ð´Ð°Ñ‚Ñƒ",
            "default-less": "ÐŸÐ¾Ð¶Ð°Ð»ÑƒÐ¹ÑÑ‚Ð° Ð²Ñ‹Ð±ÐµÑ€Ð¸Ñ‚Ðµ Ð´Ð¸Ð°Ð¿Ð°Ð·Ð¾Ð½ Ð¼ÐµÐ½ÑŒÑˆÐµ %d Ð´Ð½ÐµÐ¹",
            "default-range": "ÐŸÐ¾Ð¶Ð°Ð»ÑƒÐ¹ÑÑ‚Ð° Ð²Ñ‹Ð±ÐµÑ€Ð¸Ñ‚Ðµ Ð´Ð¸Ð°Ð¿Ð°Ð·Ð¾Ð½ Ð¼ÐµÐ¶Ð´Ñƒ %d Ð¸ %d Ð´Ð½ÑÐ¼Ð¸",
            "default-default": "ÐŸÐ¾Ð¶Ð°Ð»ÑƒÐ¹ÑÑ‚Ð° Ð²Ñ‹Ð±ÐµÑ€Ð¸Ñ‚Ðµ Ð´Ð¸Ð°Ð¿Ð°Ð·Ð¾Ð½",
            "time": "Ð’Ñ€ÐµÐ¼Ñ",
            "hour": "Ð§Ð°ÑÑ‹",
            "minute": "ÐœÐ¸Ð½ÑƒÑ‚Ñ‹"
        },
        "pl": {
            "selected": "Wybrany:",
            "day": "DzieÅ„",
            "days": "Dni",
            "apply": "Zamknij",
            "week-1": "pon",
            "week-2": "wt",
            "week-3": "Å›r",
            "week-4": "czw",
            "week-5": "pt",
            "week-6": "so",
            "week-7": "nd",
            "month-name": ["styczeÅ„", "luty", "marzec", "kwiecieÅ„", "maj", "czerwiec", "lipiec", "sierpieÅ„", "wrzesieÅ„", "paÅºdziernik", "listopad", "grudzieÅ„"],
            "shortcuts": "SkrÃ³ty",
            "custom-values": "Niestandardowe wartoÅ›ci",
            "past": "PrzeszÅ‚e",
            "following": "NastÄ™pne",
            "previous": "Poprzednie",
            "prev-week": "tydzieÅ„",
            "prev-month": "miesiÄ…c",
            "prev-year": "rok",
            "next": "NastÄ™pny",
            "next-week": "tydzieÅ„",
            "next-month": "miesiÄ…c",
            "next-year": "rok",
            "less-than": "Okres nie powinien byÄ‡ dÅ‚uÅ¼szy niÅ¼ %d dni",
            "more-than": "Okres nie powinien byÄ‡ krÃ³tszy niÅ¼  %d ni",
            "default-more": "Wybierz okres dÅ‚uÅ¼szy niÅ¼ %d dni",
            "default-single": "Wybierz datÄ™",
            "default-less": "Wybierz okres krÃ³tszy niÅ¼ %d dni",
            "default-range": "Wybierz okres trwajÄ…cy od %d do %d dni",
            "default-default": "Wybierz okres",
            "time": "Czas",
            "hour": "Godzina",
            "minute": "Minuta"
        },
        "se": {
            "selected": "Vald:",
            "day": "dag",
            "days": "dagar",
            "apply": "godkÃ¤nn",
            "week-1": "ma",
            "week-2": "ti",
            "week-3": "on",
            "week-4": "to",
            "week-5": "fr",
            "week-6": "lÃ¶",
            "week-7": "sÃ¶",
            "month-name": ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"],
            "shortcuts": "genvÃ¤gar",
            "custom-values": "Anpassade vÃ¤rden",
            "past": "Ã¶ver",
            "following": "fÃ¶ljande",
            "previous": "fÃ¶rra",
            "prev-week": "vecka",
            "prev-month": "mÃ¥nad",
            "prev-year": "Ã¥r",
            "next": "nÃ¤sta",
            "next-week": "vecka",
            "next-month": "mÃ¥ned",
            "next-year": "Ã¥r",
            "less-than": "Datumintervall bÃ¶r inte vara mindre Ã¤n %d dagar",
            "more-than": "Datumintervall bÃ¶r inte vara mer Ã¤n %d dagar",
            "default-more": "VÃ¤lj ett datumintervall lÃ¤ngre Ã¤n %d dagar",
            "default-single": "VÃ¤lj ett datum",
            "default-less": "VÃ¤lj ett datumintervall mindre Ã¤n %d dagar",
            "default-range": "VÃ¤lj ett datumintervall mellan %d och %d dagar",
            "default-default": "VÃ¤lj ett datumintervall",
            "time": "tid",
            "hour": "timme",
            "minute": "minut"
        },
        "pt": //Portuguese (European)
        {
            "selected": "Selecionado:",
            "day": "Dia",
            "days": "Dias",
            "apply": "Fechar",
            "week-1": "seg",
            "week-2": "ter",
            "week-3": "qua",
            "week-4": "qui",
            "week-5": "sex",
            "week-6": "sab",
            "week-7": "dom",
            "week-number": "N",
            "month-name": ["janeiro", "fevereiro", "marÃ§o", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
            "shortcuts": "Atalhos",
            "custom-values": "Valores Personalizados",
            "past": "Passado",
            "following": "Seguinte",
            "previous": "Anterior",
            "prev-week": "Semana",
            "prev-month": "MÃªs",
            "prev-year": "Ano",
            "next": "PrÃ³ximo",
            "next-week": "PrÃ³xima Semana",
            "next-month": "PrÃ³ximo MÃªs",
            "next-year": "PrÃ³ximo Ano",
            "less-than": "O perÃ­odo selecionado nÃ£o deve ser maior que %d dias",
            "more-than": "O perÃ­odo selecionado nÃ£o deve ser menor que %d dias",
            "default-more": "Selecione um perÃ­odo superior a %d dias",
            "default-single": "Selecione uma data",
            "default-less": "Selecione um perÃ­odo inferior a %d dias",
            "default-range": "Selecione um perÃ­odo de %d a %d dias",
            "default-default": "Selecione um perÃ­odo",
            "time": "Tempo",
            "hour": "Hora",
            "minute": "Minuto"
        },
        "tc": // traditional chinese
        {
            "selected": "å·²é¸æ“‡:",
            "day": "å¤©",
            "days": "å¤©",
            "apply": "ç¢ºå®š",
            "week-1": "ä¸€",
            "week-2": "äºŒ",
            "week-3": "ä¸‰",
            "week-4": "å››",
            "week-5": "äº”",
            "week-6": "å…­",
            "week-7": "æ—¥",
            "week-number": "å‘¨",
            "month-name": ["ä¸€æœˆ", "äºŒæœˆ", "ä¸‰æœˆ", "å››æœˆ", "äº”æœˆ", "å…­æœˆ", "ä¸ƒæœˆ", "å…«æœˆ", "ä¹æœˆ", "åæœˆ", "åä¸€æœˆ", "åäºŒæœˆ"],
            "shortcuts": "å¿«é€Ÿé¸æ“‡",
            "past": "éŽåŽ»",
            "following": "å°‡ä¾†",
            "previous": "&nbsp;&nbsp;&nbsp;",
            "prev-week": "ä¸Šé€±",
            "prev-month": "ä¸Šå€‹æœˆ",
            "prev-year": "åŽ»å¹´",
            "next": "&nbsp;&nbsp;&nbsp;",
            "next-week": "ä¸‹å‘¨",
            "next-month": "ä¸‹å€‹æœˆ",
            "next-year": "æ˜Žå¹´",
            "less-than": "æ‰€é¸æ—¥æœŸç¯„åœä¸èƒ½å¤§æ–¼%då¤©",
            "more-than": "æ‰€é¸æ—¥æœŸç¯„åœä¸èƒ½å°æ–¼%då¤©",
            "default-more": "è«‹é¸æ“‡å¤§æ–¼%då¤©çš„æ—¥æœŸç¯„åœ",
            "default-less": "è«‹é¸æ“‡å°æ–¼%då¤©çš„æ—¥æœŸç¯„åœ",
            "default-range": "è«‹é¸æ“‡%då¤©åˆ°%då¤©çš„æ—¥æœŸç¯„åœ",
            "default-single": "è«‹é¸æ“‡ä¸€å€‹æ—¥æœŸ",
            "default-default": "è«‹é¸æ“‡ä¸€å€‹æ—¥æœŸç¯„åœ",
            "time": "æ—¥æœŸ",
            "hour": "å°æ™‚",
            "minute": "åˆ†é˜"
        },
        "ja": {
            "selected": "é¸æŠžã—ã¾ã—ãŸ:",
            "day": "æ—¥",
            "days": "æ—¥ã€…",
            "apply": "é–‰ã˜ã‚‹",
            "week-1": "æœˆ",
            "week-2": "ç«",
            "week-3": "æ°´",
            "week-4": "æœ¨",
            "week-5": "é‡‘",
            "week-6": "åœŸ",
            "week-7": "æ—¥",
            "month-name": ["1æœˆ", "2æœˆ", "3æœˆ", "4æœˆ", "5æœˆ", "6æœˆ", "7æœˆ", "8æœˆ", "9æœˆ", "10æœˆ", "11æœˆ", "12æœˆ"],
            "shortcuts": "ã‚¯ã‚¤ãƒƒã‚¯é¸æŠž",
            "past": "éŽåŽ»",
            "following": "å°†æ¥",
            "previous": "&nbsp;&nbsp;&nbsp;",
            "prev-week": "å…ˆé€±ã€",
            "prev-month": "å…ˆæœˆ",
            "prev-year": "æ˜¨å¹´",
            "next": "&nbsp;&nbsp;&nbsp;",
            "next-week": "æ¥é€±",
            "next-month": "æ¥æœˆ",
            "next-year": "æ¥å¹´",
            "less-than": "æ—¥ä»˜ã®ç¯„å›²ã¯ ï¼…d æ—¥ä»¥ä¸Šã«ã™ã¹ãã§ã¯ã‚ã‚Šã¾ã›ã‚“",
            "more-than": "æ—¥ä»˜ã®ç¯„å›²ã¯ ï¼…d æ—¥ã‚’ä¸‹å›žã£ã¦ã¯ã„ã‘ã¾ã›ã‚“",
            "default-more": "ï¼…d æ—¥ã‚ˆã‚Šã‚‚é•·ã„æœŸé–“ã‚’é¸æŠžã—ã¦ãã ã•ã„",
            "default-less": "ï¼…d æ—¥æœªæº€ã®æœŸé–“ã‚’é¸æŠžã—ã¦ãã ã•ã„",
            "default-range": "ï¼…d ã¨ï¼… dæ—¥ã®é–“ã®æ—¥ä»˜ç¯„å›²ã‚’é¸æŠžã—ã¦ãã ã•ã„",
            "default-single": "æ—¥ä»˜ã‚’é¸æŠžã—ã¦ãã ã•ã„",
            "default-default": "æ—¥ä»˜ç¯„å›²ã‚’é¸æŠžã—ã¦ãã ã•ã„",
            "time": "æ™‚é–“",
            "hour": "æ™‚é–“",
            "minute": "åˆ†"
        },
        "da": {
            "selected": "Valgt:",
            "day": "Dag",
            "days": "Dage",
            "apply": "Luk",
            "week-1": "ma",
            "week-2": "ti",
            "week-3": "on",
            "week-4": "to",
            "week-5": "fr",
            "week-6": "lÃ¶",
            "week-7": "sÃ¶",
            "month-name": ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"],
            "shortcuts": "genveje",
            "custom-values": "Brugerdefinerede vÃ¦rdier",
            "past": "Forbi",
            "following": "FÃ¸lgende",
            "previous": "Forrige",
            "prev-week": "uge",
            "prev-month": "mÃ¥nad",
            "prev-year": "Ã¥r",
            "next": "NÃ¦ste",
            "next-week": "NÃ¦ste uge",
            "next-month": "NÃ¦ste mÃ¥ned",
            "next-year": "NÃ¦ste Ã¥r",
            "less-than": "Dato interval bÃ¸r ikke vÃ¦re med end %d dage",
            "more-than": "Dato interval bÃ¸r ikke vÃ¦re mindre end %d dage",
            "default-more": "VÃ¦lg datointerval lÃ¦ngere end %d dage",
            "default-single": "VÃ¦lg dato",
            "default-less": "VÃ¦lg datointerval mindre end %d dage",
            "default-range": "VÃ¦lg datointerval mellem %d og %d dage",
            "default-default": "VÃ¦lg datointerval",
            "time": "tid",
            "hour": "time",
            "minute": "minut"
        },
        "fi": // Finnish
        {
            "selected": "Valittu:",
            "day": "PÃ¤ivÃ¤",
            "days": "PÃ¤ivÃ¤Ã¤",
            "apply": "Sulje",
            "week-1": "ma",
            "week-2": "ti",
            "week-3": "ke",
            "week-4": "to",
            "week-5": "pe",
            "week-6": "la",
            "week-7": "su",
            "week-number": "V",
            "month-name": ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesÃ¤kuu", "heinÃ¤kuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"],
            "shortcuts": "Pikavalinnat",
            "custom-values": "Mukautetut Arvot",
            "past": "Menneet",
            "following": "Tulevat",
            "previous": "Edellinen",
            "prev-week": "Viikko",
            "prev-month": "Kuukausi",
            "prev-year": "Vuosi",
            "next": "Seuraava",
            "next-week": "Viikko",
            "next-month": "Kuukausi",
            "next-year": "Vuosi",
            "less-than": "Aikajakson tulisi olla vÃ¤hemmÃ¤n kuin %d pÃ¤ivÃ¤Ã¤",
            "more-than": "Aikajakson ei tulisi olla vÃ¤hempÃ¤Ã¤ kuin %d pÃ¤ivÃ¤Ã¤",
            "default-more": "Valitse pidempi aikajakso kuin %d pÃ¤ivÃ¤Ã¤",
            "default-single": "Valitse pÃ¤ivÃ¤",
            "default-less": "Valitse lyhyempi aikajakso kuin %d pÃ¤ivÃ¤Ã¤",
            "default-range": "Valitse aikajakso %d ja %d pÃ¤ivÃ¤n vÃ¤liltÃ¤",
            "default-default": "Valitse aikajakso",
            "time": "Aika",
            "hour": "Tunti",
            "minute": "Minuutti"
        },
        "cat": // Catala
        {
            "selected": "Seleccionats:",
            "day": "Dia",
            "days": "Dies",
            "apply": "Tanca",
            "week-1": "Dl",
            "week-2": "Dm",
            "week-3": "Dc",
            "week-4": "Dj",
            "week-5": "Dv",
            "week-6": "Ds",
            "week-7": "Dg",
            "week-number": "S",
            "month-name": ["gener", "febrer", "marÃ§", "abril", "maig", "juny", "juliol", "agost", "setembre", "octubre", "novembre", "desembre"],
            "shortcuts": "DreÃ§eres",
            "custom-values": "Valors personalitzats",
            "past": "Passat",
            "following": "Futur",
            "previous": "Anterior",
            "prev-week": "Setmana",
            "prev-month": "Mes",
            "prev-year": "Any",
            "next": "SegÃ¼ent",
            "next-week": "Setmana",
            "next-month": "Mes",
            "next-year": "Any",
            "less-than": "El perÃ­ode no hauria de ser de mÃ©s de %d dies",
            "more-than": "El perÃ­ode no hauria de ser de menys de %d dies",
            "default-more": "Perfavor selecciona un perÃ­ode mÃ©s gran de %d dies",
            "default-single": "Perfavor selecciona una data",
            "default-less": "Perfavor selecciona un perÃ­ode de menys de %d dies",
            "default-range": "Perfavor selecciona un perÃ­ode d'entre %d i %d dies",
            "default-default": "Perfavor selecciona un perÃ­ode",
            "time": "Temps",
            "hour": "Hora",
            "minute": "Minut"
        }
    };

    $.fn.dateRangePicker = function (opt) {
        if (!opt) opt = {};
        opt = $.extend(true, {
            autoClose: false,
            format: 'YYYY-MM-DD',
            separator: ' to ',
            language: 'auto',
            startOfWeek: 'sunday', // or monday
            getValue: function () {
                return $(this).val();
            },
            setValue: function (s) {
                if (!$(this).attr('readonly') && !$(this).is(':disabled') && s != $(this).val()) {
                    $(this).val(s);
                }
            },
            startDate: false,
            endDate: false,
            time: {
                enabled: false
            },
            minDays: 0,
            maxDays: 0,
            showShortcuts: false,
            shortcuts: {
                //'prev-days': [1,3,5,7],
                // 'next-days': [3,5,7],
                //'prev' : ['week','month','year'],
                // 'next' : ['week','month','year']
            },
            customShortcuts: [],
            inline: false,
            container: 'body',
            alwaysOpen: false,
            singleDate: false,
            lookBehind: false,
            batchMode: false,
            duration: 200,
            stickyMonths: false,
            dayDivAttrs: [],
            dayTdAttrs: [],
            selectForward: false,
            selectBackward: false,
            applyBtnClass: '',
            singleMonth: 'auto',
            hoveringTooltip: function (days, startTime, hoveringTime) {
                return days > 1 ? days + ' ' + translate('days') : '';
            },
            showTopbar: true,
            swapTime: false,
            showWeekNumbers: false,
            getWeekNumber: function (date) //date will be the first day of a week
            {
                return moment(date).format('w');
            },
            customOpenAnimation: null,
            customCloseAnimation: null,
            customArrowPrevSymbol: null,
            customArrowNextSymbol: null,
            monthSelect: false,
            yearSelect: false
        }, opt);

        opt.start = false;
        opt.end = false;

        opt.startWeek = false;

        //detect a touch device
        opt.isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;

        //if it is a touch device, hide hovering tooltip
        if (opt.isTouchDevice) opt.hoveringTooltip = false;

        //show one month on mobile devices
        if (opt.singleMonth == 'auto') opt.singleMonth = $(window).width() < 480;
        if (opt.singleMonth) opt.stickyMonths = false;

        if (!opt.showTopbar) opt.autoClose = true;

        if (opt.startDate && typeof opt.startDate == 'string') opt.startDate = moment(opt.startDate, opt.format).toDate();
        if (opt.endDate && typeof opt.endDate == 'string') opt.endDate = moment(opt.endDate, opt.format).toDate();

        if (opt.yearSelect && typeof opt.yearSelect === 'boolean') {
            opt.yearSelect = function (current) {
                return [current - 5, current + 5];
            }
        }

        var languages = getLanguages();
        var box;
        var initiated = false;
        var self = this;
        var selfDom = $(self).get(0);
        var domChangeTimer;

        $(this).unbind('.datepicker').bind('click.datepicker', function (evt) {
            var isOpen = box.is(':visible');
            if (!isOpen) open(opt.duration);
        }).bind('change.datepicker', function (evt) {
            checkAndSetDefaultValue();
        }).bind('keyup.datepicker', function () {
            try {
                clearTimeout(domChangeTimer);
            } catch (e) {}
            domChangeTimer = setTimeout(function () {
                checkAndSetDefaultValue();
            }, 2000);
        });

        init_datepicker.call(this);

        if (opt.alwaysOpen) {
            open(0);
        }

        // expose some api
        $(this).data('dateRangePicker', {
            setStart: function (d1) {
                if (typeof d1 == 'string') {
                    d1 = moment(d1, opt.format).toDate();
                }

                opt.end = false;
                setSingleDate(d1);

                return this;
            },
            setEnd: function (d2, silent) {
                var start = new Date();
                start.setTime(opt.start);
                if (typeof d2 == 'string') {
                    d2 = moment(d2, opt.format).toDate();
                }
                setDateRange(start, d2, silent);
                return this;
            },
            setDateRange: function (d1, d2, silent) {
                if (typeof d1 == 'string' && typeof d2 == 'string') {
                    d1 = moment(d1, opt.format).toDate();
                    d2 = moment(d2, opt.format).toDate();
                }
                setDateRange(d1, d2, silent);
            },
            clear: clearSelection,
            close: closeDatePicker,
            open: open,
            redraw: redrawDatePicker,
            getDatePicker: getDatePicker,
            resetMonthsView: resetMonthsView,
            destroy: function () {
                $(self).unbind('.datepicker');
                $(self).data('dateRangePicker', '');
                $(self).data('date-picker-opened', null);
                box.remove();
                $(window).unbind('resize.datepicker', calcPosition);
                $(document).unbind('click.datepicker', closeDatePicker);
            }
        });

        $(window).bind('resize.datepicker', calcPosition);

        return this;

        function IsOwnDatePickerClicked(evt, selfObj) {
            return (selfObj.contains(evt.target) || evt.target == selfObj || (selfObj.childNodes != undefined && $.inArray(evt.target, selfObj.childNodes) >= 0));
        }

        function init_datepicker() {
            var self = this;

            if ($(this).data('date-picker-opened')) {
                closeDatePicker();
                return;
            }
            $(this).data('date-picker-opened', true);


            box = createDom().hide();
            box.append('<div class="date-range-length-tip"></div>');

            $(opt.container).append(box);

            if (!opt.inline) {
                calcPosition();
            } else {
                box.addClass('inline-wrapper');
            }

            if (opt.alwaysOpen) {
                box.find('.apply-btn').hide();
            }

            var defaultTime = getDefaultTime();
            resetMonthsView(defaultTime);

            if (opt.time.enabled) {
                if ((opt.startDate && opt.endDate) || (opt.start && opt.end)) {
                    showTime(moment(opt.start || opt.startDate).toDate(), 'time1');
                    showTime(moment(opt.end || opt.endDate).toDate(), 'time2');
                } else {
                    var defaultEndTime = opt.defaultEndTime ? opt.defaultEndTime : defaultTime;
                    showTime(defaultTime, 'time1');
                    showTime(defaultEndTime, 'time2');
                }
            }

            //showSelectedInfo();


            var defaultTopText = '';
            if (opt.singleDate)
                defaultTopText = translate('default-single');
            else if (opt.minDays && opt.maxDays)
                defaultTopText = translate('default-range');
            else if (opt.minDays)
                defaultTopText = translate('default-more');
            else if (opt.maxDays)
                defaultTopText = translate('default-less');
            else
                defaultTopText = translate('default-default');

            box.find('.default-top').html(defaultTopText.replace(/\%d/, opt.minDays).replace(/\%d/, opt.maxDays));
            if (opt.singleMonth) {
                box.addClass('single-month');
            } else {
                box.addClass('two-months');
            }


            setTimeout(function () {
                updateCalendarWidth();
                initiated = true;
            }, 0);

            box.click(function (evt) {
                evt.stopPropagation();
            });

            //if user click other place of the webpage, close date range picker window
            $(document).bind('click.datepicker', function (evt) {
                if (!IsOwnDatePickerClicked(evt, self[0])) {
                    if (box.is(':visible')) closeDatePicker();
                }
            });

            box.find('.next').click(function () {
                if (!opt.stickyMonths)
                    gotoNextMonth(this);
                else
                    gotoNextMonth_stickily(this);
            });

            function gotoNextMonth(self) {
                var isMonth2 = $(self).parents('table').hasClass('month2');
                var month = isMonth2 ? opt.month2 : opt.month1;
                month = nextMonth(month);
                if (!opt.singleMonth && !opt.singleDate && !isMonth2 && compare_month(month, opt.month2) >= 0 || isMonthOutOfBounds(month)) return;
                showMonth(month, isMonth2 ? 'month2' : 'month1');
                showGap();
            }

            function gotoNextMonth_stickily(self) {
                var nextMonth1 = nextMonth(opt.month1);
                var nextMonth2 = nextMonth(opt.month2);
                if (isMonthOutOfBounds(nextMonth2)) return;
                if (!opt.singleDate && compare_month(nextMonth1, nextMonth2) >= 0) return;
                showMonth(nextMonth1, 'month1');
                showMonth(nextMonth2, 'month2');
                showSelectedDays();
            }


            box.find('.prev').click(function () {
                if (!opt.stickyMonths)
                    gotoPrevMonth(this);
                else
                    gotoPrevMonth_stickily(this);
            });

            function gotoPrevMonth(self) {
                var isMonth2 = $(self).parents('table').hasClass('month2');
                var month = isMonth2 ? opt.month2 : opt.month1;
                month = prevMonth(month);
                if (isMonth2 && compare_month(month, opt.month1) <= 0 || isMonthOutOfBounds(month)) return;
                showMonth(month, isMonth2 ? 'month2' : 'month1');
                showGap();
            }

            function gotoPrevMonth_stickily(self) {
                var prevMonth1 = prevMonth(opt.month1);
                var prevMonth2 = prevMonth(opt.month2);
                if (isMonthOutOfBounds(prevMonth1)) return;
                if (!opt.singleDate && compare_month(prevMonth2, prevMonth1) <= 0) return;
                showMonth(prevMonth2, 'month2');
                showMonth(prevMonth1, 'month1');
                showSelectedDays();
            }

            box.attr('unselectable', 'on')
                .css('user-select', 'none')
                .bind('selectstart', function (e) {
                    e.preventDefault();
                    return false;
                });

            box.find('.apply-btn').click(function () {
                closeDatePicker();
                var dateRange = getDateString(new Date(opt.start)) + opt.separator + getDateString(new Date(opt.end));
                $(self).trigger('datepicker-apply', {
                    'value': dateRange,
                    'date1': new Date(opt.start),
                    'date2': new Date(opt.end)
                });
            });

            box.find('[custom]').click(function () {
                var valueName = $(this).attr('custom');
                opt.start = false;
                opt.end = false;
                box.find('.day.checked').removeClass('checked');
                opt.setValue.call(selfDom, valueName);
                checkSelectionValid();
                showSelectedInfo(true);
                showSelectedDays();
                if (opt.autoClose) closeDatePicker();
            });

            box.find('[shortcut]').click(function () {
                var shortcut = $(this).attr('shortcut');
                var end = new Date(),
                    start = false;
                var dir;
                if (shortcut.indexOf('day') != -1) {
                    var day = parseInt(shortcut.split(',', 2)[1], 10);
                    start = new Date(new Date().getTime() + 86400000 * day);
                    end = new Date(end.getTime() + 86400000 * (day > 0 ? 1 : -1));
                } else if (shortcut.indexOf('week') != -1) {
                    dir = shortcut.indexOf('prev,') != -1 ? -1 : 1;
                    var stopDay;
                    if (dir == 1)
                        stopDay = opt.startOfWeek == 'monday' ? 1 : 0;
                    else
                        stopDay = opt.startOfWeek == 'monday' ? 0 : 6;

                    end = new Date(end.getTime() - 86400000);
                    while (end.getDay() != stopDay) end = new Date(end.getTime() + dir * 86400000);
                    start = new Date(end.getTime() + dir * 86400000 * 6);
                } else if (shortcut.indexOf('month') != -1) {
                    dir = shortcut.indexOf('prev,') != -1 ? -1 : 1;
                    if (dir == 1)
                        start = nextMonth(end);
                    else
                        start = prevMonth(end);
                    start.setDate(1);
                    end = nextMonth(start);
                    end.setDate(1);
                    end = new Date(end.getTime() - 86400000);
                } else if (shortcut.indexOf('year') != -1) {
                    dir = shortcut.indexOf('prev,') != -1 ? -1 : 1;
                    start = new Date();
                    start.setFullYear(end.getFullYear() + dir);
                    start.setMonth(0);
                    start.setDate(1);
                    end.setFullYear(end.getFullYear() + dir);
                    end.setMonth(11);
                    end.setDate(31);
                } else if (shortcut == 'custom') {
                    var name = $(this).html();
                    if (opt.customShortcuts && opt.customShortcuts.length > 0) {
                        for (var i = 0; i < opt.customShortcuts.length; i++) {
                            var sh = opt.customShortcuts[i];
                            if (sh.name == name) {
                                var data = [];
                                // try
                                // {
                                data = sh['dates'].call();
                                //}catch(e){}
                                if (data && data.length == 2) {
                                    start = data[0];
                                    end = data[1];
                                }

                                // if only one date is specified then just move calendars there
                                // move calendars to show this date's month and next months
                                if (data && data.length == 1) {
                                    var movetodate = data[0];
                                    showMonth(movetodate, 'month1');
                                    showMonth(nextMonth(movetodate), 'month2');
                                    showGap();
                                }

                                break;
                            }
                        }
                    }
                }
                if (start && end) {
                    setDateRange(start, end);
                    checkSelectionValid();
                }
            });

            box.find('.time1 input[type=range]').bind('change touchmove', function (e) {
                var target = e.target,
                    hour = target.name == 'hour' ? $(target).val().replace(/^(\d{1})$/, '0$1') : undefined,
                    min = target.name == 'minute' ? $(target).val().replace(/^(\d{1})$/, '0$1') : undefined;
                setTime('time1', hour, min);
            });

            box.find('.time2 input[type=range]').bind('change touchmove', function (e) {
                var target = e.target,
                    hour = target.name == 'hour' ? $(target).val().replace(/^(\d{1})$/, '0$1') : undefined,
                    min = target.name == 'minute' ? $(target).val().replace(/^(\d{1})$/, '0$1') : undefined;
                setTime('time2', hour, min);
            });

        }


        function calcPosition() {
            if (!opt.inline) {
                var offset = $(self).offset();
                if ($(opt.container).css('position') == 'relative') {
                    var containerOffset = $(opt.container).offset();
                    var leftIndent = Math.max(0, offset.left + box.outerWidth() - $('body').width() + 16);
                    box.css({
                        top: offset.top - containerOffset.top + $(self).outerHeight() + 4,
                        left: offset.left - containerOffset.left - leftIndent
                    });
                } else {
                    if (offset.left < 460) //left to right
                    {
                        box.css({
                            top: offset.top + $(self).outerHeight() + parseInt($('body').css('border-top') || 0, 10),
                            left: offset.left
                        });
                    } else {
                        box.css({
                            top: offset.top + $(self).outerHeight() + parseInt($('body').css('border-top') || 0, 10),
                            left: offset.left + $(self).width() - box.width() - 16
                        });
                    }
                }
            }
        }

        // Return the date picker wrapper element
        function getDatePicker() {
            return box;
        }

        function open(animationTime) {
            redrawDatePicker();
            checkAndSetDefaultValue();
            if (opt.customOpenAnimation) {
                opt.customOpenAnimation.call(box.get(0), function () {
                    $(self).trigger('datepicker-opened', {
                        relatedTarget: box
                    });
                });
            } else {
                box.slideDown(animationTime, function () {
                    $(self).trigger('datepicker-opened', {
                        relatedTarget: box
                    });
                });
            }
            $(self).trigger('datepicker-open', {
                relatedTarget: box
            });
            showGap();
            updateCalendarWidth();
            calcPosition();
        }

        function checkAndSetDefaultValue() {
            var __default_string = opt.getValue.call(selfDom);
            var defaults = __default_string ? __default_string.split(opt.separator) : '';

            if (defaults && ((defaults.length == 1 && opt.singleDate) || defaults.length >= 2)) {
                var ___format = opt.format;
                if (___format.match(/Do/)) {

                    ___format = ___format.replace(/Do/, 'D');
                    defaults[0] = defaults[0].replace(/(\d+)(th|nd|st)/, '$1');
                    if (defaults.length >= 2) {
                        defaults[1] = defaults[1].replace(/(\d+)(th|nd|st)/, '$1');
                    }
                }
                // set initiated  to avoid triggerring datepicker-change event
                initiated = false;
                if (defaults.length >= 2) {
                    setDateRange(getValidValue(defaults[0], ___format, moment.locale(opt.language)), getValidValue(defaults[1], ___format, moment.locale(opt.language)));
                } else if (defaults.length == 1 && opt.singleDate) {
                    setSingleDate(getValidValue(defaults[0], ___format, moment.locale(opt.language)));
                }

                initiated = true;
            }
        }

        function getValidValue(date, format, locale) {
            if (moment(date, format, locale).isValid()) {
                return moment(date, format, locale).toDate();
            } else {
                return moment().toDate();
            }
        }

        function updateCalendarWidth() {
            var gapMargin = box.find('.gap').css('margin-left');
            if (gapMargin) gapMargin = parseInt(gapMargin);
            var w1 = box.find('.month1').width();
            var w2 = box.find('.gap').width() + (gapMargin ? gapMargin * 2 : 0);
            var w3 = box.find('.month2').width();
            box.find('.month-wrapper').width(w1 + w2 + w3);
        }

        function renderTime(name, date) {
            box.find('.' + name + ' input[type=range].hour-range').val(moment(date).hours());
            box.find('.' + name + ' input[type=range].minute-range').val(moment(date).minutes());
            setTime(name, moment(date).format('HH'), moment(date).format('mm'));
        }

        function changeTime(name, date) {
            opt[name] = parseInt(
                moment(parseInt(date))
                .startOf('day')
                .add(moment(opt[name + 'Time']).format('HH'), 'h')
                .add(moment(opt[name + 'Time']).format('mm'), 'm').valueOf()
            );
        }

        function swapTime() {
            renderTime('time1', opt.start);
            renderTime('time2', opt.end);
        }

        function setTime(name, hour, minute) {
            hour && (box.find('.' + name + ' .hour-val').text(hour));
            minute && (box.find('.' + name + ' .minute-val').text(minute));
            switch (name) {
                case 'time1':
                    if (opt.start) {
                        setRange('start', moment(opt.start));
                    }
                    setRange('startTime', moment(opt.startTime || moment().valueOf()));
                    break;
                case 'time2':
                    if (opt.end) {
                        setRange('end', moment(opt.end));
                    }
                    setRange('endTime', moment(opt.endTime || moment().valueOf()));
                    break;
            }

            function setRange(name, timePoint) {
                var h = timePoint.format('HH'),
                    m = timePoint.format('mm');
                opt[name] = timePoint
                    .startOf('day')
                    .add(hour || h, 'h')
                    .add(minute || m, 'm')
                    .valueOf();
            }
            checkSelectionValid();
            showSelectedInfo();
            showSelectedDays();
        }

        function clearSelection() {
            opt.start = false;
            opt.end = false;
            box.find('.day.checked').removeClass('checked');
            box.find('.day.last-date-selected').removeClass('last-date-selected');
            box.find('.day.first-date-selected').removeClass('first-date-selected');
            opt.setValue.call(selfDom, '');
            checkSelectionValid();
            showSelectedInfo();
            showSelectedDays();
        }

        function handleStart(time) {
            var r = time;
            if (opt.batchMode === 'week-range') {
                if (opt.startOfWeek === 'monday') {
                    r = moment(parseInt(time)).startOf('isoweek').valueOf();
                } else {
                    r = moment(parseInt(time)).startOf('week').valueOf();
                }
            } else if (opt.batchMode === 'month-range') {
                r = moment(parseInt(time)).startOf('month').valueOf();
            }
            return r;
        }

        function handleEnd(time) {
            var r = time;
            if (opt.batchMode === 'week-range') {
                if (opt.startOfWeek === 'monday') {
                    r = moment(parseInt(time)).endOf('isoweek').valueOf();
                } else {
                    r = moment(parseInt(time)).endOf('week').valueOf();
                }
            } else if (opt.batchMode === 'month-range') {
                r = moment(parseInt(time)).endOf('month').valueOf();
            }
            return r;
        }


        function dayClicked(day) {
            if (day.hasClass('invalid')) return;
            var time = day.attr('time');
            day.addClass('checked');
            if (opt.singleDate) {
                opt.start = time;
                opt.end = false;
            } else if (opt.batchMode === 'week') {
                if (opt.startOfWeek === 'monday') {
                    opt.start = moment(parseInt(time)).startOf('isoweek').valueOf();
                    opt.end = moment(parseInt(time)).endOf('isoweek').valueOf();
                } else {
                    opt.end = moment(parseInt(time)).endOf('week').valueOf();
                    opt.start = moment(parseInt(time)).startOf('week').valueOf();
                }
            } else if (opt.batchMode === 'workweek') {
                opt.start = moment(parseInt(time)).day(1).valueOf();
                opt.end = moment(parseInt(time)).day(5).valueOf();
            } else if (opt.batchMode === 'weekend') {
                opt.start = moment(parseInt(time)).day(6).valueOf();
                opt.end = moment(parseInt(time)).day(7).valueOf();
            } else if (opt.batchMode === 'month') {
                opt.start = moment(parseInt(time)).startOf('month').valueOf();
                opt.end = moment(parseInt(time)).endOf('month').valueOf();
            } else if ((opt.start && opt.end) || (!opt.start && !opt.end)) {
                opt.start = handleStart(time);
                opt.end = false;
            } else if (opt.start) {
                opt.end = handleEnd(time);
                if (opt.time.enabled) {
                    changeTime('end', opt.end);
                }
            }

            //Update time in case it is enabled and timestamps are available
            if (opt.time.enabled) {
                if (opt.start) {
                    changeTime('start', opt.start);
                }
                if (opt.end) {
                    changeTime('end', opt.end);
                }
            }

            //In case the start is after the end, swap the timestamps
            if (!opt.singleDate && opt.start && opt.end && opt.start > opt.end) {
                var tmp = opt.end;
                opt.end = handleEnd(opt.start);
                opt.start = handleStart(tmp);
                if (opt.time.enabled && opt.swapTime) {
                    swapTime();
                }
            }

            opt.start = parseInt(opt.start);
            opt.end = parseInt(opt.end);

            clearHovering();
            if (opt.start && !opt.end) {
                $(self).trigger('datepicker-first-date-selected', {
                    'date1': new Date(opt.start)
                });
                dayHovering(day);
            }
            updateSelectableRange(time);

            checkSelectionValid();
            showSelectedInfo();
            showSelectedDays();
            autoclose();
        }


        function weekNumberClicked(weekNumberDom) {
            var thisTime = parseInt(weekNumberDom.attr('data-start-time'), 10);
            var date1, date2;
            if (!opt.startWeek) {
                opt.startWeek = thisTime;
                weekNumberDom.addClass('week-number-selected');
                date1 = new Date(thisTime);
                opt.start = moment(date1).day(opt.startOfWeek == 'monday' ? 1 : 0).valueOf();
                opt.end = moment(date1).day(opt.startOfWeek == 'monday' ? 7 : 6).valueOf();
            } else {
                box.find('.week-number-selected').removeClass('week-number-selected');
                date1 = new Date(thisTime < opt.startWeek ? thisTime : opt.startWeek);
                date2 = new Date(thisTime < opt.startWeek ? opt.startWeek : thisTime);
                opt.startWeek = false;
                opt.start = moment(date1).day(opt.startOfWeek == 'monday' ? 1 : 0).valueOf();
                opt.end = moment(date2).day(opt.startOfWeek == 'monday' ? 7 : 6).valueOf();
            }
            updateSelectableRange();
            checkSelectionValid();
            showSelectedInfo();
            showSelectedDays();
            autoclose();
        }

        function isValidTime(time) {
            time = parseInt(time, 10);
            if (opt.startDate && compare_day(time, opt.startDate) < 0) return false;
            if (opt.endDate && compare_day(time, opt.endDate) > 0) return false;

            if (opt.start && !opt.end && !opt.singleDate) {
                //check maxDays and minDays setting
                if (opt.maxDays > 0 && countDays(time, opt.start) > opt.maxDays) return false;
                if (opt.minDays > 0 && countDays(time, opt.start) < opt.minDays) return false;

                //check selectForward and selectBackward
                if (opt.selectForward && time < opt.start) return false;
                if (opt.selectBackward && time > opt.start) return false;

                //check disabled days
                if (opt.beforeShowDay && typeof opt.beforeShowDay == 'function') {
                    var valid = true;
                    var timeTmp = time;
                    while (countDays(timeTmp, opt.start) > 1) {
                        var arr = opt.beforeShowDay(new Date(timeTmp));
                        if (!arr[0]) {
                            valid = false;
                            break;
                        }
                        if (Math.abs(timeTmp - opt.start) < 86400000) break;
                        if (timeTmp > opt.start) timeTmp -= 86400000;
                        if (timeTmp < opt.start) timeTmp += 86400000;
                    }
                    if (!valid) return false;
                }
            }
            return true;
        }


        function updateSelectableRange() {
            box.find('.day.invalid.tmp').removeClass('tmp invalid').addClass('valid');
            if (opt.start && !opt.end) {
                box.find('.day.toMonth.valid').each(function () {
                    var time = parseInt($(this).attr('time'), 10);
                    if (!isValidTime(time))
                        $(this).addClass('invalid tmp').removeClass('valid');
                    else
                        $(this).addClass('valid tmp').removeClass('invalid');
                });
            }

            return true;
        }


        function dayHovering(day) {
            var hoverTime = parseInt(day.attr('time'));
            var tooltip = '';

            if (day.hasClass('has-tooltip') && day.attr('data-tooltip')) {
                tooltip = '<span style="white-space:nowrap">' + day.attr('data-tooltip') + '</span>';
            } else if (!day.hasClass('invalid')) {
                if (opt.singleDate) {
                    box.find('.day.hovering').removeClass('hovering');
                    day.addClass('hovering');
                } else {
                    box.find('.day').each(function () {
                        var time = parseInt($(this).attr('time')),
                            start = opt.start,
                            end = opt.end;

                        if (time == hoverTime) {
                            $(this).addClass('hovering');
                        } else {
                            $(this).removeClass('hovering');
                        }

                        if (
                            (opt.start && !opt.end) &&
                            (
                                (opt.start < time && hoverTime >= time) ||
                                (opt.start > time && hoverTime <= time)
                            )
                        ) {
                            $(this).addClass('hovering');
                        } else {
                            $(this).removeClass('hovering');
                        }
                    });

                    if (opt.start && !opt.end) {
                        var days = countDays(hoverTime, opt.start);
                        if (opt.hoveringTooltip) {
                            if (typeof opt.hoveringTooltip == 'function') {
                                tooltip = opt.hoveringTooltip(days, opt.start, hoverTime);
                            } else if (opt.hoveringTooltip === true && days > 1) {
                                tooltip = days + ' ' + translate('days');
                            }
                        }
                    }
                }
            }

            if (tooltip) {
                var posDay = day.offset();
                var posBox = box.offset();

                var _left = posDay.left - posBox.left;
                var _top = posDay.top - posBox.top;
                _left += day.width() / 2;


                var $tip = box.find('.date-range-length-tip');
                var w = $tip.css({
                    'visibility': 'hidden',
                    'display': 'none'
                }).html(tooltip).width();
                var h = $tip.height();
                _left -= w / 2;
                _top -= h;
                setTimeout(function () {
                    $tip.css({
                        left: _left,
                        top: _top,
                        display: 'block',
                        'visibility': 'visible'
                    });
                }, 10);
            } else {
                box.find('.date-range-length-tip').hide();
            }
        }

        function clearHovering() {
            box.find('.day.hovering').removeClass('hovering');
            box.find('.date-range-length-tip').hide();
        }

        function dateChanged(date) {
            var value = date.val();
            var name = date.attr('name');
            var type = date.parents('table').hasClass('month1') ? 'month1' : 'month2';
            var oppositeType = type === 'month1' ? 'month2' : 'month1';
            var startDate = opt.startDate ? moment(opt.startDate) : false;
            var endDate = opt.endDate ? moment(opt.endDate) : false;
            var newDate = moment(opt[type])[name](value);


            if (startDate && newDate.isSameOrBefore(startDate)) {
                newDate = startDate.add(type === 'month2' ? 1 : 0, 'month');
            }

            if (endDate && newDate.isSameOrAfter(endDate)) {
                newDate = endDate.add(!opt.singleMonth && type === 'month1' ? -1 : 0, 'month');
            }

            showMonth(newDate, type);

            if (type === 'month1') {
                if (opt.stickyMonths || moment(newDate).isSameOrAfter(opt[oppositeType], 'month')) {
                    showMonth(moment(newDate).add(1, 'month'), oppositeType);
                }
            } else {
                if (opt.stickyMonths || moment(newDate).isSameOrBefore(opt[oppositeType], 'month')) {
                    showMonth(moment(newDate).add(-1, 'month'), oppositeType);
                }
            }

            showGap();
        }

        function autoclose() {
            if (opt.singleDate === true) {
                if (initiated && opt.start) {
                    if (opt.autoClose) closeDatePicker();
                }
            } else {
                if (initiated && opt.start && opt.end) {
                    if (opt.autoClose) closeDatePicker();
                }
            }
        }

        function checkSelectionValid() {
            var days = Math.ceil((opt.end - opt.start) / 86400000) + 1;
            if (opt.singleDate) { // Validate if only start is there
                if (opt.start && !opt.end)
                    box.find('.drp_top-bar').removeClass('error').addClass('normal');
                else
                    box.find('.drp_top-bar').removeClass('error').removeClass('normal');
            } else if (opt.maxDays && days > opt.maxDays) {
                opt.start = false;
                opt.end = false;
                box.find('.day').removeClass('checked');
                box.find('.drp_top-bar').removeClass('normal').addClass('error').find('.error-top').html(translate('less-than').replace('%d', opt.maxDays));
            } else if (opt.minDays && days < opt.minDays) {
                opt.start = false;
                opt.end = false;
                box.find('.day').removeClass('checked');
                box.find('.drp_top-bar').removeClass('normal').addClass('error').find('.error-top').html(translate('more-than').replace('%d', opt.minDays));
            } else {
                if (opt.start || opt.end)
                    box.find('.drp_top-bar').removeClass('error').addClass('normal');
                else
                    box.find('.drp_top-bar').removeClass('error').removeClass('normal');
            }

            if ((opt.singleDate && opt.start && !opt.end) || (!opt.singleDate && opt.start && opt.end)) {
                box.find('.apply-btn').removeClass('disabled');
            } else {
                box.find('.apply-btn').addClass('disabled');
            }

            if (opt.batchMode) {
                if (
                    (opt.start && opt.startDate && compare_day(opt.start, opt.startDate) < 0) ||
                    (opt.end && opt.endDate && compare_day(opt.end, opt.endDate) > 0)
                ) {
                    opt.start = false;
                    opt.end = false;
                    box.find('.day').removeClass('checked');
                }
            }
        }

        function showSelectedInfo(forceValid, silent) {
            box.find('.start-day').html('...');
            box.find('.end-day').html('...');
            box.find('.selected-days').hide();
            if (opt.start) {
                box.find('.start-day').html(getDateString(new Date(parseInt(opt.start))));
            }
            if (opt.end) {
                box.find('.end-day').html(getDateString(new Date(parseInt(opt.end))));
            }
            var dateRange;
            if (opt.start && opt.singleDate) {
                box.find('.apply-btn').removeClass('disabled');
                dateRange = getDateString(new Date(opt.start));
                opt.setValue.call(selfDom, dateRange, getDateString(new Date(opt.start)), getDateString(new Date(opt.end)));

                if (initiated && !silent) {
                    $(self).trigger('datepicker-change', {
                        'value': dateRange,
                        'date1': new Date(opt.start)
                    });
                }
            } else if (opt.start && opt.end) {
                box.find('.selected-days').show().find('.selected-days-num').html(countDays(opt.end, opt.start));
                box.find('.apply-btn').removeClass('disabled');
                dateRange = getDateString(new Date(opt.start)) + opt.separator + getDateString(new Date(opt.end));
                opt.setValue.call(selfDom, dateRange, getDateString(new Date(opt.start)), getDateString(new Date(opt.end)));
                if (initiated && !silent) {
                    $(self).trigger('datepicker-change', {
                        'value': dateRange,
                        'date1': new Date(opt.start),
                        'date2': new Date(opt.end)
                    });
                }
            } else if (forceValid) {
                box.find('.apply-btn').removeClass('disabled');
            } else {
                box.find('.apply-btn').addClass('disabled');
            }
        }

        function countDays(start, end) {
            return Math.abs(daysFrom1970(start) - daysFrom1970(end)) + 1;
        }

        function setDateRange(date1, date2, silent) {
            if (date1.getTime() > date2.getTime()) {
                var tmp = date2;
                date2 = date1;
                date1 = tmp;
                tmp = null;
            }
            var valid = true;
            if (opt.startDate && compare_day(date1, opt.startDate) < 0) valid = false;
            if (opt.endDate && compare_day(date2, opt.endDate) > 0) valid = false;
            if (!valid) {
                showMonth(opt.startDate, 'month1');
                showMonth(nextMonth(opt.startDate), 'month2');
                showGap();
                return;
            }

            opt.start = date1.getTime();
            opt.end = date2.getTime();

            if (opt.time.enabled) {
                renderTime('time1', date1);
                renderTime('time2', date2);
            }

            if (opt.stickyMonths || (compare_day(date1, date2) > 0 && compare_month(date1, date2) === 0)) {
                if (opt.lookBehind) {
                    date1 = prevMonth(date2);
                } else {
                    date2 = nextMonth(date1);
                }
            }

            if (opt.stickyMonths && opt.endDate !== false && compare_month(date2, opt.endDate) > 0) {
                date1 = prevMonth(date1);
                date2 = prevMonth(date2);
            }

            if (!opt.stickyMonths) {
                if (compare_month(date1, date2) === 0) {
                    if (opt.lookBehind) {
                        date1 = prevMonth(date2);
                    } else {
                        date2 = nextMonth(date1);
                    }
                }
            }

            showMonth(date1, 'month1');
            showMonth(date2, 'month2');
            showGap();
            checkSelectionValid();
            showSelectedInfo(false, silent);
            autoclose();
        }

        function setSingleDate(date1) {

            var valid = true;
            if (opt.startDate && compare_day(date1, opt.startDate) < 0) valid = false;
            if (opt.endDate && compare_day(date1, opt.endDate) > 0) valid = false;
            if (!valid) {
                showMonth(opt.startDate, 'month1');
                return;
            }

            opt.start = date1.getTime();


            if (opt.time.enabled) {
                renderTime('time1', date1);

            }
            showMonth(date1, 'month1');
            if (opt.singleMonth !== true) {
                var date2 = nextMonth(date1);
                showMonth(date2, 'month2');
            }
            showGap();
            showSelectedInfo();
            autoclose();
        }

        function showSelectedDays() {
            if (!opt.start && !opt.end) return;
            box.find('.day').each(function () {
                var time = parseInt($(this).attr('time')),
                    start = opt.start,
                    end = opt.end;
                if (opt.time.enabled) {
                    time = moment(time).startOf('day').valueOf();
                    start = moment(start || moment().valueOf()).startOf('day').valueOf();
                    end = moment(end || moment().valueOf()).startOf('day').valueOf();
                }
                if (
                    (opt.start && opt.end && end >= time && start <= time) ||
                    (opt.start && !opt.end && moment(start).format('YYYY-MM-DD') == moment(time).format('YYYY-MM-DD'))
                ) {
                    $(this).addClass('checked');
                } else {
                    $(this).removeClass('checked');
                }

                //add first-date-selected class name to the first date selected
                if (opt.start && moment(start).format('YYYY-MM-DD') == moment(time).format('YYYY-MM-DD')) {
                    $(this).addClass('first-date-selected');
                } else {
                    $(this).removeClass('first-date-selected');
                }
                //add last-date-selected
                if (opt.end && moment(end).format('YYYY-MM-DD') == moment(time).format('YYYY-MM-DD')) {
                    $(this).addClass('last-date-selected');
                } else {
                    $(this).removeClass('last-date-selected');
                }
            });

            box.find('.week-number').each(function () {
                if ($(this).attr('data-start-time') == opt.startWeek) {
                    $(this).addClass('week-number-selected');
                }
            });
        }

        function showMonth(date, month) {
            date = moment(date).toDate();
            var monthElement = generateMonthElement(date, month);
            var yearElement = generateYearElement(date, month);

            box.find('.' + month + ' .month-name').html(monthElement + ' ' + yearElement);
            box.find('.' + month + ' tbody').html(createMonthHTML(date));
            opt[month] = date;
            updateSelectableRange();
            bindEvents();
        }

        function generateMonthElement(date, month) {
            var range;
            var startDate = opt.startDate ? moment(opt.startDate).add(!opt.singleMonth && month === 'month2' ? 1 : 0, 'month') : false;
            var endDate = opt.endDate ? moment(opt.endDate).add(!opt.singleMonth && month === 'month1' ? -1 : 0, 'month') : false;
            date = moment(date);

            if (!opt.monthSelect ||
                startDate && endDate && startDate.isSame(endDate, 'month')) {
                return '<div class="month-element">' + nameMonth(date.get('month')) + '</div>';
            }

            range = [
                startDate && date.isSame(startDate, 'year') ? startDate.get('month') : 0,
                endDate && date.isSame(endDate, 'year') ? endDate.get('month') : 11
            ];

            if (range[0] === range[1]) {
                return '<div class="month-element">' + nameMonth(date.get('month')) + '</div>';
            }

            return generateSelect(
                'month',
                generateSelectData(
                    range,
                    date.get('month'),
                    function (value) {
                        return nameMonth(value);
                    }
                )
            );
        }

        function generateYearElement(date, month) {
            date = moment(date);
            var startDate = opt.startDate ? moment(opt.startDate).add(!opt.singleMonth && month === 'month2' ? 1 : 0, 'month') : false;
            var endDate = opt.endDate ? moment(opt.endDate).add(!opt.singleMonth && month === 'month1' ? -1 : 0, 'month') : false;
            var fullYear = date.get('year');
            var isYearFunction = opt.yearSelect && typeof opt.yearSelect === 'function';
            var range;

            if (!opt.yearSelect ||
                startDate && endDate && startDate.isSame(moment(endDate), 'year')) {
                return '<div class="month-element">' + fullYear + '</div>';
            }

            range = isYearFunction ? opt.yearSelect(fullYear) : opt.yearSelect.slice();

            range = [
                startDate ? Math.max(range[0], startDate.get('year')) : Math.min(range[0], fullYear),
                endDate ? Math.min(range[1], endDate.get('year')) : Math.max(range[1], fullYear)
            ];

            return generateSelect('year', generateSelectData(range, fullYear));
        }


        function generateSelectData(range, current, valueBeautifier) {
            var data = [];
            valueBeautifier = valueBeautifier || function (value) {
                return value;
            };

            for (var i = range[0]; i <= range[1]; i++) {
                data.push({
                    value: i,
                    text: valueBeautifier(i),
                    isCurrent: i === current
                });
            }

            return data;
        }

        function generateSelect(name, data) {
            var select = '<div class="select-wrapper"><select class="' + name + '" name="' + name + '">';
            var current;

            for (var i = 0, l = data.length; i < l; i++) {
                select += '<option value="' + data[i].value + '"' + (data[i].isCurrent ? ' selected' : '') + '>';
                select += data[i].text;
                select += '</option>';

                if (data[i].isCurrent) {
                    current = data[i].text;
                }
            }

            select += '</select>' + current + '</div>';

            return select;
        }

        function bindEvents() {
            box.find('.day').unbind("click").click(function (evt) {
                dayClicked($(this));
            });

            box.find('.day').unbind("mouseenter").mouseenter(function (evt) {
                dayHovering($(this));
            });

            box.find('.day').unbind("mouseleave").mouseleave(function (evt) {
                box.find('.date-range-length-tip').hide();
                if (opt.singleDate) {
                    clearHovering();
                }
            });

            box.find('.week-number').unbind("click").click(function (evt) {
                weekNumberClicked($(this));
            });

            box.find('.month').unbind("change").change(function (evt) {
                dateChanged($(this));
            });

            box.find('.year').unbind("change").change(function (evt) {
                dateChanged($(this));
            });
        }

        function showTime(date, name) {
            box.find('.' + name).append(getTimeHTML());
            renderTime(name, date);
        }

        function nameMonth(m) {
            return translate('month-name')[m];
        }

        function getDateString(d) {
            return moment(d).format(opt.format);
        }

        function showGap() {
            showSelectedDays();
            var m1 = parseInt(moment(opt.month1).format('YYYYMM'));
            var m2 = parseInt(moment(opt.month2).format('YYYYMM'));
            var p = Math.abs(m1 - m2);
            var shouldShow = (p > 1 && p != 89);
            if (shouldShow) {
                box.addClass('has-gap').removeClass('no-gap').find('.gap').css('visibility', 'visible');
            } else {
                box.removeClass('has-gap').addClass('no-gap').find('.gap').css('visibility', 'hidden');
            }
            var h1 = box.find('table.month1').height();
            var h2 = box.find('table.month2').height();
            box.find('.gap').height(Math.max(h1, h2) + 10);
        }

        function closeDatePicker() {
            if (opt.alwaysOpen) return;

            var afterAnim = function () {
                $(self).data('date-picker-opened', false);
                $(self).trigger('datepicker-closed', {
                    relatedTarget: box
                });
            };
            if (opt.customCloseAnimation) {
                opt.customCloseAnimation.call(box.get(0), afterAnim);
            } else {
                $(box).slideUp(opt.duration, afterAnim);
            }
            $(self).trigger('datepicker-close', {
                relatedTarget: box
            });
        }

        function redrawDatePicker() {
            showMonth(opt.month1, 'month1');
            showMonth(opt.month2, 'month2');
        }

        function compare_month(m1, m2) {
            var p = parseInt(moment(m1).format('YYYYMM')) - parseInt(moment(m2).format('YYYYMM'));
            if (p > 0) return 1;
            if (p === 0) return 0;
            return -1;
        }

        function compare_day(m1, m2) {
            var p = parseInt(moment(m1).format('YYYYMMDD')) - parseInt(moment(m2).format('YYYYMMDD'));
            if (p > 0) return 1;
            if (p === 0) return 0;
            return -1;
        }

        function nextMonth(month) {
            return moment(month).add(1, 'months').toDate();
        }

        function prevMonth(month) {
            return moment(month).add(-1, 'months').toDate();
        }

        function getTimeHTML() {
            return '<div>' +
                '<span>' + translate('Time') + ': <span class="hour-val">00</span>:<span class="minute-val">00</span></span>' +
                '</div>' +
                '<div class="hour">' +
                '<label>' + translate('Hour') + ': <input type="range" class="hour-range" name="hour" min="0" max="23"></label>' +
                '</div>' +
                '<div class="minute">' +
                '<label>' + translate('Minute') + ': <input type="range" class="minute-range" name="minute" min="0" max="59"></label>' +
                '</div>';
        }

        function createDom() {
            var html = '<div class="date-picker-wrapper';
            if (opt.extraClass) html += ' ' + opt.extraClass + ' ';
            if (opt.singleDate) html += ' single-date ';
            if (!opt.showShortcuts) html += ' no-shortcuts ';
            if (!opt.showTopbar) html += ' no-topbar ';
            if (opt.customTopBar) html += ' custom-topbar ';
            html += '">';

            if (opt.showTopbar) {
                html += '<div class="drp_top-bar">';

                if (opt.customTopBar) {
                    if (typeof opt.customTopBar == 'function') opt.customTopBar = opt.customTopBar();
                    html += '<div class="custom-top">' + opt.customTopBar + '</div>';
                } else {
                    html += '<div class="normal-top">' +
                        '<span style="color:#333">' + translate('selected') + ' </span> <b class="start-day">...</b>';
                    if (!opt.singleDate) {
                        html += ' <span class="separator-day">' + opt.separator + '</span> <b class="end-day">...</b> <i class="selected-days">(<span class="selected-days-num">3</span> ' + translate('days') + ')</i>';
                    }
                    html += '</div>';
                    html += '<div class="error-top">error</div>' +
                        '<div class="default-top">default</div>';
                }

                html += '<input type="button" class="apply-btn disabled' + getApplyBtnClass() + '" value="' + translate('apply') + '" />';
                html += '</div>';
            }

            var _colspan = opt.showWeekNumbers ? 6 : 5;

            var arrowPrev = '&lt;';
            if (opt.customArrowPrevSymbol) arrowPrev = opt.customArrowPrevSymbol;

            var arrowNext = '&gt;';
            if (opt.customArrowNextSymbol) arrowNext = opt.customArrowNextSymbol;

            html += '<div class="month-wrapper">' +
                '   <table class="month1" cellspacing="0" border="0" cellpadding="0">' +
                '       <thead>' +
                '           <tr class="caption">' +
                '               <th style="width:27px;">' +
                '                   <span class="prev">' +
                arrowPrev +
                '                   </span>' +
                '               </th>' +
                '               <th colspan="' + _colspan + '" class="month-name">' +
                '               </th>' +
                '               <th style="width:27px;">' +
                (opt.singleDate || !opt.stickyMonths ? '<span class="next">' + arrowNext + '</span>' : '') +
                '               </th>' +
                '           </tr>' +
                '           <tr class="week-name">' + getWeekHead() +
                '       </thead>' +
                '       <tbody></tbody>' +
                '   </table>';

            if (hasMonth2()) {
                html += '<div class="gap">' + getGapHTML() + '</div>' +
                    '<table class="month2" cellspacing="0" border="0" cellpadding="0">' +
                    '   <thead>' +
                    '   <tr class="caption">' +
                    '       <th style="width:27px;">' +
                    (!opt.stickyMonths ? '<span class="prev">' + arrowPrev + '</span>' : '') +
                    '       </th>' +
                    '       <th colspan="' + _colspan + '" class="month-name">' +
                    '       </th>' +
                    '       <th style="width:27px;">' +
                    '           <span class="next">' + arrowNext + '</span>' +
                    '       </th>' +
                    '   </tr>' +
                    '   <tr class="week-name">' + getWeekHead() +
                    '   </thead>' +
                    '   <tbody></tbody>' +
                    '</table>';

            }
            //+'</div>'
            html += '<div style="clear:both;height:0;font-size:0;"></div>' +
                '<div class="time">' +
                '<div class="time1"></div>';
            if (!opt.singleDate) {
                html += '<div class="time2"></div>';
            }
            html += '</div>' +
                '<div style="clear:both;height:0;font-size:0;"></div>' +
                '</div>';

            html += '<div class="footer">';
            if (opt.showShortcuts) {
                html += '<div class="shortcuts"><b>' + translate('shortcuts') + '</b>';

                var data = opt.shortcuts;
                if (data) {
                    var name;
                    if (data['prev-days'] && data['prev-days'].length > 0) {
                        html += '&nbsp;<span class="prev-days">' + translate('past');
                        for (var i = 0; i < data['prev-days'].length; i++) {
                            name = data['prev-days'][i];
                            name += (data['prev-days'][i] > 1) ? translate('days') : translate('day');
                            html += ' <a href="javascript:;" shortcut="day,-' + data['prev-days'][i] + '">' + name + '</a>';
                        }
                        html += '</span>';
                    }

                    if (data['next-days'] && data['next-days'].length > 0) {
                        html += '&nbsp;<span class="next-days">' + translate('following');
                        for (var i = 0; i < data['next-days'].length; i++) {
                            name = data['next-days'][i];
                            name += (data['next-days'][i] > 1) ? translate('days') : translate('day');
                            html += ' <a href="javascript:;" shortcut="day,' + data['next-days'][i] + '">' + name + '</a>';
                        }
                        html += '</span>';
                    }

                    if (data.prev && data.prev.length > 0) {
                        html += '&nbsp;<span class="prev-buttons">' + translate('previous');
                        for (var i = 0; i < data.prev.length; i++) {
                            name = translate('prev-' + data.prev[i]);
                            html += ' <a href="javascript:;" shortcut="prev,' + data.prev[i] + '">' + name + '</a>';
                        }
                        html += '</span>';
                    }

                    if (data.next && data.next.length > 0) {
                        html += '&nbsp;<span class="next-buttons">' + translate('next');
                        for (var i = 0; i < data.next.length; i++) {
                            name = translate('next-' + data.next[i]);
                            html += ' <a href="javascript:;" shortcut="next,' + data.next[i] + '">' + name + '</a>';
                        }
                        html += '</span>';
                    }
                }

                if (opt.customShortcuts) {
                    for (var i = 0; i < opt.customShortcuts.length; i++) {
                        var sh = opt.customShortcuts[i];
                        html += '&nbsp;<span class="custom-shortcut"><a href="javascript:;" shortcut="custom">' + sh.name + '</a></span>';
                    }
                }
                html += '</div>';
            }

            // Add Custom Values Dom
            if (opt.showCustomValues) {
                html += '<div class="customValues"><b>' + (opt.customValueLabel || translate('custom-values')) + '</b>';

                if (opt.customValues) {
                    for (var i = 0; i < opt.customValues.length; i++) {
                        var val = opt.customValues[i];
                        html += '&nbsp;<span class="custom-value"><a href="javascript:;" custom="' + val.value + '">' + val.name + '</a></span>';
                    }
                }
            }

            html += '</div></div>';


            return $(html);
        }

        function getApplyBtnClass() {
            var klass = '';
            if (opt.autoClose === true) {
                klass += ' hide';
            }
            if (opt.applyBtnClass !== '') {
                klass += ' ' + opt.applyBtnClass;
            }
            return klass;
        }

        function getWeekHead() {
            var prepend = opt.showWeekNumbers ? '<th>' + translate('week-number') + '</th>' : '';
            if (opt.startOfWeek == 'monday') {
                return prepend + '<th>' + translate('week-1') + '</th>' +
                    '<th>' + translate('week-2') + '</th>' +
                    '<th>' + translate('week-3') + '</th>' +
                    '<th>' + translate('week-4') + '</th>' +
                    '<th>' + translate('week-5') + '</th>' +
                    '<th>' + translate('week-6') + '</th>' +
                    '<th>' + translate('week-7') + '</th>';
            } else {
                return prepend + '<th>' + translate('week-7') + '</th>' +
                    '<th>' + translate('week-1') + '</th>' +
                    '<th>' + translate('week-2') + '</th>' +
                    '<th>' + translate('week-3') + '</th>' +
                    '<th>' + translate('week-4') + '</th>' +
                    '<th>' + translate('week-5') + '</th>' +
                    '<th>' + translate('week-6') + '</th>';
            }
        }

        function isMonthOutOfBounds(month) {
            month = moment(month);
            if (opt.startDate && month.endOf('month').isBefore(opt.startDate)) {
                return true;
            }
            if (opt.endDate && month.startOf('month').isAfter(opt.endDate)) {
                return true;
            }
            return false;
        }

        function getGapHTML() {
            var html = ['<div class="gap-top-mask"></div><div class="gap-bottom-mask"></div><div class="gap-lines">'];
            for (var i = 0; i < 20; i++) {
                html.push('<div class="gap-line">' +
                    '<div class="gap-1"></div>' +
                    '<div class="gap-2"></div>' +
                    '<div class="gap-3"></div>' +
                    '</div>');
            }
            html.push('</div>');
            return html.join('');
        }

        function hasMonth2() {
            return (!opt.singleMonth);
        }

        function attributesCallbacks(initialObject, callbacksArray, today) {
            var resultObject = $.extend(true, {}, initialObject);

            $.each(callbacksArray, function (cbAttrIndex, cbAttr) {
                var addAttributes = cbAttr(today);
                for (var attr in addAttributes) {
                    if (resultObject.hasOwnProperty(attr)) {
                        resultObject[attr] += addAttributes[attr];
                    } else {
                        resultObject[attr] = addAttributes[attr];
                    }
                }
            });

            var attrString = '';

            for (var attr in resultObject) {
                if (resultObject.hasOwnProperty(attr)) {
                    attrString += attr + '="' + resultObject[attr] + '" ';
                }
            }

            return attrString;
        }

        function daysFrom1970(t) {
            return Math.floor(toLocalTimestamp(t) / 86400000);
        }

        function toLocalTimestamp(t) {
            if (moment.isMoment(t)) t = t.toDate().getTime();
            if (typeof t == 'object' && t.getTime) t = t.getTime();
            if (typeof t == 'string' && !t.match(/\d{13}/)) t = moment(t, opt.format).toDate().getTime();
            t = parseInt(t, 10) - new Date().getTimezoneOffset() * 60 * 1000;
            return t;
        }

        function createMonthHTML(d) {
            var days = [];
            d.setDate(1);
            var lastMonth = new Date(d.getTime() - 86400000);
            var now = new Date();

            var dayOfWeek = d.getDay();
            if ((dayOfWeek === 0) && (opt.startOfWeek === 'monday')) {
                // add one week
                dayOfWeek = 7;
            }
            var today, valid;

            if (dayOfWeek > 0) {
                for (var i = dayOfWeek; i > 0; i--) {
                    var day = new Date(d.getTime() - 86400000 * i);
                    valid = isValidTime(day.getTime());
                    if (opt.startDate && compare_day(day, opt.startDate) < 0) valid = false;
                    if (opt.endDate && compare_day(day, opt.endDate) > 0) valid = false;
                    days.push({
                        date: day,
                        type: 'lastMonth',
                        day: day.getDate(),
                        time: day.getTime(),
                        valid: valid
                    });
                }
            }
            var toMonth = d.getMonth();
            for (var i = 0; i < 40; i++) {
                today = moment(d).add(i, 'days').toDate();
                valid = isValidTime(today.getTime());
                if (opt.startDate && compare_day(today, opt.startDate) < 0) valid = false;
                if (opt.endDate && compare_day(today, opt.endDate) > 0) valid = false;
                days.push({
                    date: today,
                    type: today.getMonth() == toMonth ? 'toMonth' : 'nextMonth',
                    day: today.getDate(),
                    time: today.getTime(),
                    valid: valid
                });
            }
            var html = [];
            for (var week = 0; week < 6; week++) {
                if (days[week * 7].type == 'nextMonth') break;
                html.push('<tr>');

                for (var day = 0; day < 7; day++) {
                    var _day = (opt.startOfWeek == 'monday') ? day + 1 : day;
                    today = days[week * 7 + _day];
                    var highlightToday = moment(today.time).format('L') == moment(now).format('L');
                    today.extraClass = '';
                    today.tooltip = '';
                    if (today.valid && opt.beforeShowDay && typeof opt.beforeShowDay == 'function') {
                        var _r = opt.beforeShowDay(moment(today.time).toDate());
                        today.valid = _r[0];
                        today.extraClass = _r[1] || '';
                        today.tooltip = _r[2] || '';
                        if (today.tooltip !== '') today.extraClass += ' has-tooltip ';
                    }

                    var todayDivAttr = {
                        time: today.time,
                        'data-tooltip': today.tooltip,
                        'class': 'day ' + today.type + ' ' + today.extraClass + ' ' + (today.valid ? 'valid' : 'invalid') + ' ' + (highlightToday ? 'real-today' : '')
                    };

                    if (day === 0 && opt.showWeekNumbers) {
                        html.push('<td><div class="week-number" data-start-time="' + today.time + '">' + opt.getWeekNumber(today.date) + '</div></td>');
                    }

                    html.push('<td ' + attributesCallbacks({}, opt.dayTdAttrs, today) + '><div ' + attributesCallbacks(todayDivAttr, opt.dayDivAttrs, today) + '>' + showDayHTML(today.time, today.day) + '</div></td>');
                }
                html.push('</tr>');
            }
            return html.join('');
        }

        function showDayHTML(time, date) {
            if (opt.showDateFilter && typeof opt.showDateFilter == 'function') return opt.showDateFilter(time, date);
            return date;
        }

        function getLanguages() {
            if (opt.language == 'auto') {
                var language = navigator.language ? navigator.language : navigator.browserLanguage;
                if (!language) {
                    return $.dateRangePickerLanguages['default'];
                }
                language = language.toLowerCase();
                if (language in $.dateRangePickerLanguages) {
                    return $.dateRangePickerLanguages[language];
                }

                return $.dateRangePickerLanguages['default'];
            } else if (opt.language && opt.language in $.dateRangePickerLanguages) {
                return $.dateRangePickerLanguages[opt.language];
            } else {
                return $.dateRangePickerLanguages['default'];
            }
        }

        /**
         * Translate language string, try both the provided translation key, as the lower case version
         */
        function translate(translationKey) {
            var translationKeyLowerCase = translationKey.toLowerCase();
            var result = (translationKey in languages) ? languages[translationKey] : (translationKeyLowerCase in languages) ? languages[translationKeyLowerCase] : null;
            var defaultLanguage = $.dateRangePickerLanguages['default'];
            if (result == null) result = (translationKey in defaultLanguage) ? defaultLanguage[translationKey] : (translationKeyLowerCase in defaultLanguage) ? defaultLanguage[translationKeyLowerCase] : '';

            return result;
        }

        function getDefaultTime() {
            var defaultTime = opt.defaultTime ? opt.defaultTime : new Date();

            if (opt.lookBehind) {
                if (opt.startDate && compare_month(defaultTime, opt.startDate) < 0) defaultTime = nextMonth(moment(opt.startDate).toDate());
                if (opt.endDate && compare_month(defaultTime, opt.endDate) > 0) defaultTime = moment(opt.endDate).toDate();
            } else {
                if (opt.startDate && compare_month(defaultTime, opt.startDate) < 0) defaultTime = moment(opt.startDate).toDate();
                if (opt.endDate && compare_month(nextMonth(defaultTime), opt.endDate) > 0) defaultTime = prevMonth(moment(opt.endDate).toDate());
            }

            if (opt.singleDate) {
                if (opt.startDate && compare_month(defaultTime, opt.startDate) < 0) defaultTime = moment(opt.startDate).toDate();
                if (opt.endDate && compare_month(defaultTime, opt.endDate) > 0) defaultTime = moment(opt.endDate).toDate();
            }

            return defaultTime;
        }

        function resetMonthsView(time) {
            if (!time) {
                time = getDefaultTime();
            }

            if (opt.lookBehind) {
                showMonth(prevMonth(time), 'month1');
                showMonth(time, 'month2');
            } else {
                showMonth(time, 'month1');
                showMonth(nextMonth(time), 'month2');
            }

            if (opt.singleDate) {
                showMonth(time, 'month1');
            }

            showSelectedDays();
            showGap();
        }

    };
}));