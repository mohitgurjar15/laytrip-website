"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DealComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var DealComponent = /** @class */ (function () {
    function DealComponent(homeService) {
        this.homeService = homeService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.toString = new core_1.EventEmitter();
    }
    DealComponent.prototype.ngOnInit = function () {
        var existAirlinesOld = ["0B", "0V", "8H", "1L", "1X", "2A", "2B", "2C", "2D", "2E", "2F", "2H", "2I", "2J", "2K", "2L", "2M", "2N", "2O", "2P", "2R", "2S", "2T", "2U", "2V", "2W", "3A", "3C", "3D", "3E", "3F", "3H", "3J", "3K", "3M", "3N", "3O", "3P", "3S", "3U", "3V", "3X", "3Y", "3Z", "4A", "4B", "4C", "4D", "4E", "4F", "4G", "4H", "4I", "4J", "4K", "4L", "4M", "4N", "4O", "4P", "4Q", "4R", "4T", "4U", "4W", "4Y", "4Z", "5B", "5C", "5D", "5E", "5F", "5H", "5J", "5K", "5M", "5N", "5O", "5R", "5S", "5T", "5U", "5V", "5W", "5Y", "5Z", "6B", "6C", "6D", "6E", "6G", "6H", "6J", "6K", "6L", "6O", "Y3", "6Q", "6R", "6S", "6T", "6V", "6W", "6Y", "7B", "7C", "7E", "7F", "7G", "7H", "7I", "7J", "7K", "7L", "7M", "7N", "7P", "7Q", "7R", "7T", "7V", "7W", "7Y", "8A", "8F", "8G", "8I", "8J", "8K", "8L", "8M", "8P", "8Q", "8S", "8T", "8U", "8Y", "9A", "9B", "9C", "9D", "9E", "9F", "9G", "9H", "9J", "9K", "9M", "9N", "9P", "9Q", "9R", "9S", "9T", "9U", "9V", "9W", "9X", "VB", "A0", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ", "B0", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ", "C0", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CI", "CJ", "CL", "CM", "CN", "CO", "CP", "CS", "CT", "CU", "CV", "CW", "CX", "CY", "CZ", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "DA", "DB", "DC", "DD", "DE", "DF", "DG", "DH", "DI", "DJ", "DK", "DL", "DM", "DN", "DO", "DP", "DQ", "DR", "DS", "DT", "DV", "DX", "DY", "E3", "E4", "E5", "E6", "E8", "E9", "EA", "EB", "EC", "ED", "EF", "EG", "EH", "EI", "EJ", "EK", "EL", "EM", "EN", "EO", "EP", "EQ", "ER", "ET", "EU", "EV", "EW", "EX", "EY", "EZ", "F5", "F6", "F7", "F8", "F9", "FA", "FB", "FC", "FD", "FF", "FG", "FH", "FI", "FJ", "FK", "FL", "FM", "FN", "FO", "FP", "FQ", "FR", "FS", "FT", "FU", "FV", "FW", "FY", "FZ", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "GA", "GC", "GD", "GE", "GF", "GH", "GJ", "GK", "GL", "GM", "GP", "GQ", "GR", "GS", "GT", "GU", "GV", "GX", "GY", "GZ", "H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "HA", "HC", "HD", "HE", "HF", "HG", "HH", "HI", "HK", "HM", "HO", "HQ", "HR", "HS", "HT", "HU", "HV", "HW", "HX", "HY", "HZ", "I2", "I4", "I5", "I7", "I8", "I9", "IA", "IB", "IC", "ID", "IE", "IF", "IG", "IH", "IJ", "IK", "IM", "IN", "IQ", "IR", "IS", "IT", "IV", "IW", "IX", "IY", "IZ", "J0", "J2", "J3", "J5", "J6", "J7", "J8", "J9", "JA", "JB", "JC", "JD", "JE", "JF", "JH", "JI", "JJ", "JK", "JL", "JM", "JN", "JO", "JP", "JQ", "JR", "JS", "JT", "JU", "JV", "JW", "JX", "JY", "JZ", "K2", "K3", "K5", "K6", "K7", "K8", "K9", "KA", "KB", "KC", "KD", "KE", "KF", "KG", "KI", "KK", "KL", "KM", "KN", "KO", "KP", "KQ", "KR", "KS", "KU", "KV", "KW", "KX", "KY", "L5", "L6", "L8", "LA", "LB", "LC", "LD", "LE", "LF", "LG", "LH", "LI", "LJ", "LK", "LL", "LM", "LN", "LO", "LP", "LR", "LS", "LT", "LU", "LV", "LW", "LX", "LY", "LZ", "M0", "M3", "M4", "M5", "M6", "M8", "M9", "MA", "MC", "MD", "ME", "MF", "MH", "MI", "MJ", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "N3", "N4", "N5", "N7", "N8", "N9", "NA", "NB", "NC", "ND", "NE", "NF", "NG", "NH", "NI", "NJ", "NK", "NL", "NM", "NN", "NO", "NP", "NQ", "NR", "NS", "NT", "NU", "NV", "NW", "NX", "NY", "NZ", "O2", "O4", "O5", "O6", "O8", "O9", "OA", "OB", "OC", "OD", "OE", "OF", "OG", "OH", "OI", "OJ", "OK", "OL", "OM", "ON", "OO", "OP", "OQ", "OR", "OS", "OT", "OU", "OV", "OX", "OY", "OZ", "P0", "P2", "P4", "P5", "P6", "P7", "P8", "P9", "PA", "PB", "PC", "PD", "PE", "PF", "PG", "PH", "PI", "PJ", "PK", "PL", "PN", "PQ", "PR", "PS", "PU", "PV", "PW", "PX", "PY", "PZ", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "QA", "QB", "QC", "QD", "QE", "QF", "QG", "QH", "QI", "QJ", "QK", "QL", "QM", "QN", "QQ", "QR", "QS", "QU", "QV", "QW", "QX", "QZ", "R2", "R3", "R4", "R5", "R6", "R7", "RA", "RB", "RC", "RE", "RF", "RG", "RI", "RJ", "RK", "RL", "RM", "RO", "RP", "RQ", "RS", "RT", "RV", "RW", "RX", "RY", "RZ", "S0", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "SA", "SB", "SC", "SD", "SE", "SF", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SP", "SQ", "SS", "ST", "SU", "SV", "SW", "SX", "SY", "SZ", "T0", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "TA", "TB", "TC", "TD", "TE", "TF", "TG", "TH", "TI", "TJ", "TK", "TL", "TM", "TN", "TO", "TP", "TQ", "TR", "TS", "TT", "TU", "TV", "TW", "TX", "TY", "TZ", "U2", "U3", "U4", "U5", "U6", "U7", "U8", "U9", "UA", "UB", "UC", "UD", "UE", "UF", "UG", "UH", "UI", "UJ", "UK", "UL", "UM", "UN", "UO", "UP", "UQ", "US", "UT", "UU", "UV", "UX", "UZ", "V0", "V2", "V3", "V4", "V5", "V6", "V7", "VA", "VC", "VD", "VE", "VF", "VG", "VH", "VJ", "VK", "VL", "VM", "VN", "VP", "VQ", "VR", "VS", "VT", "VU", "VV", "VW", "VX", "VY", "VZ", "W2", "W3", "W4", "W5", "W6", "W7", "W9", "WA", "WB", "WC", "WD", "WE", "WF", "WG", "WH", "WJ", "WK", "WL", "WM", "WN", "WO", "WP", "WQ", "WR", "WS", "WT", "WU", "WV", "WW", "WX", "WY", "WZ", "X3", "X8", "X9", "XC", "XD", "XE", "XF", "XG", "XH", "XJ", "XK", "XL", "XM", "XN", "XP", "XQ", "XR", "XT", "XU", "XV", "XW", "XY", "XZ", "Y0", "Y2", "Y4", "Y6", "Y7", "Y9", "YB", "YC", "YE", "YG", "YH", "YI", "YK", "YL", "YM", "YN", "YO", "YP", "YQ", "YR", "YS", "YT", "YU", "YV", "YW", "YX", "YZ", "Z2", "Z3", "Z4", "Z5", "Z6", "Z7", "Z8", "Z9", "ZA", "ZB", "ZC", "ZD", "ZE", "ZF", "ZH", "ZI", "ZK", "ZL", "ZM", "ZN", "ZP", "ZQ", "ZS", "ZU", "ZV", "ZW", "ZX"];
        var awsAirlines = ['0A', '0B', '0D', '2B', '2C', '2E', '2I', '2J', '2K', '2L', '2M', '2N', '2O', '2P', '2Q', '2U', '2W', '2Y', '2Z', '3B', '3C', '3E', '3F', '3H', '3I', '3K', '3L', '3M', '3O', '3P', '3R', '3S', '3T', '3U', '3W', '3Y', '3Z', '3�', '4C', '4D', '4E', '4G', '4H', '4J', '4K', '4L', '4M', '4N', '4O', '4Q', '4R', '4T', '4U', '4V', '4W', '4Y', '5C', '5G', '5H', '5J', '5L', '5M', '5N', '5O', '5P', '5Q', '5R', '5T', '5U', '5V', '5W', '5Y', '5Z', '5�', '6A', '6C', '6E', '6F', '6G', '6H', '6I', '6J', '6K', '6L', '6N', '6P', '6Q', '6R', '6S', '6T', '6V', '6W', '6Y', '6Z', '7C', '7D', '7E', '7F', '7G', '7H', '7I', '7J', '7K', '7L', '7M', '7N', '7P', '7R', '7V', '7W', '7Z', '8B', '8D', '8E', '8F', '8G', '8J', '8L', '8M', '8N', '8O', '8P', '8Q', '8R', '8T', '8U', '8V', '8W', '9B', '9C', '9D', '9E', '9F', '9G', '9H', '9J', '9K', '9L', '9M', '9O', '9R', '9U', '9V', '9W', '9X', '9Y', 'A0', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AH', 'AI', 'AJ', 'AK', 'AM', 'amtrak-logo.jpg', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ', 'B2', 'B3', 'B5', 'B6', 'B7', 'B8', 'B9', 'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BN', 'BP', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'C3', 'C4', 'C5', 'C7', 'C8', 'C9', 'CA', 'CB', 'CC', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CL', 'CM', 'CN', 'CO', 'CQ', 'CT', 'CU', 'CW', 'CX', 'CY', 'CZ', 'D2', 'D3', 'D4', 'D6', 'D7', 'D8', 'D9', 'db_train_100px.svg', 'DB', 'DC', 'DD', 'DE', 'DG', 'DH', 'DI', 'DJ', 'DL', 'DN', 'DO', 'DR', 'DT', 'DU', 'DV', 'DX', 'DY', 'DZ', 'E0', 'E3', 'E4', 'E5', 'E8', 'EA', 'EC', 'EE', 'EF', 'EG', 'EI', 'EJ', 'EK', 'EL', 'EN', 'EO', 'EP', 'EQ', 'ET', 'EU', 'EW', 'EY', 'EZ', 'F2', 'F5', 'F7', 'F9', 'FB', 'FC', 'FD', 'FE', 'FG', 'FI', 'FJ', 'FL', 'FM', 'FN', 'FO', 'FP', 'FQ', 'FR', 'FS', 'FT', 'FV', 'FW', 'FY', 'FZ', 'G0', 'G3', 'G4', 'G8', 'G9', 'GA', 'GE', 'GF', 'GI', 'GJ', 'GL', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GV', 'GW', 'GY', 'GZ', 'H1', 'H2', 'H3', 'H4', 'H7', 'H8', 'H9', 'HA', 'HB', 'HD', 'HE', 'HF', 'HG', 'HH', 'HI', 'HM', 'HO', 'HR', 'HS', 'HT', 'HU', 'HV', 'HW', 'HX', 'HY', 'HZ', 'I2', 'I3', 'I4', 'I5', 'I7', 'I8', 'I9', 'IA', 'IB', 'IC', 'idtgv.jpg', 'IE', 'IF', 'IG', 'IH', 'IK', 'IN', 'IP', 'IQ', 'IR', 'IS', 'IT', 'IV', 'IX', 'IY', 'IZ', 'J0', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'JA', 'JB', 'JD', 'JE', 'JH', 'JJ', 'JK', 'JL', 'JM', 'JN', 'JO', 'JP', 'JQ', 'JR', 'JS', 'JT', 'JU', 'JV', 'JX', 'JY', 'JZ', 'K2', 'K3', 'K5', 'K6', 'K7', 'K8', 'K9', 'KA', 'KB', 'KC', 'KD', 'KE', 'KF', 'KG', 'KH', 'KI', 'KJ', 'KK', 'KL', 'KM', 'KN', 'KO', 'KQ', 'KR', 'KS', 'KT', 'KU', 'KV', 'KW', 'KX', 'KY', 'L3', 'L5', 'L6', 'L9', 'LA', 'LF', 'LG', 'LH', 'LI', 'LJ', 'LM', 'LN', 'LO', 'LP', 'LR', 'LS', 'LT', 'LV', 'LW', 'LX', 'LY', 'LZ', 'M2', 'M3', 'M5', 'M6', 'M7', 'M9', 'MA', 'MD', 'ME', 'MF', 'MH', 'MI', 'MJ', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MS', 'MU', 'MW', 'MX', 'MY', 'MZ', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N9', 'NA', 'NC', 'ND', 'NF', 'NG', 'NH', 'NI', 'NK', 'NL', 'NM', 'NN', 'NQ', 'NR', 'NS', 'NT', 'ntv', 'NU', 'NW', 'NX', 'NY', 'NZ', 'O2', 'O4', 'O6', 'O7', 'OA', 'OB', 'OC', 'OD', 'OF', 'OG', 'OK', 'OL', 'OM', 'ON', 'OP', 'OR', 'OS', 'OT', 'OU', 'OV', 'OX', 'OY', 'OZ', 'P0', 'P2', 'P3', 'P4', 'P5', 'P6', 'P8', 'P9', 'PB', 'PC', 'PD', 'PE', 'PG', 'PJ', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PU', 'PV', 'PW', 'PX', 'PY', 'PZ', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'QB', 'QC', 'QF', 'QG', 'QH', 'QI', 'QK', 'QL', 'QM', 'QP', 'QR', 'QS', 'QU', 'QV', 'QW', 'QX', 'QZ', 'R2', 'R3', 'R4', 'R6', 'R7', 'RA', 'raileurope', 'RB', 'RC', 'RE', 'renfe', 'RG', 'RH', 'RI', 'RJ', 'RK', 'RL', 'RO', 'RQ', 'RT', 'RU', 'RV', 'RX', 'RZ', 'S0', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S9', 'SA', 'SB', 'SC', 'SD', 'SE', 'SF', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SP', 'SQ', 'SS', 'SU', 'SV', 'SW', 'SX', 'SY', 'T3', 'T4', 'T5', 'T6', 'T7', 'TA', 'TC', 'TD', 'TE', 'TF', 'TG', 'thetrainLine.jpg', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TP', 'TQ', 'TR', 'train_bene', 'train_db', 'train_eurostar.jpg', 'trenitalia', 'TS', 'TT', 'TU', 'TV', 'TW', 'TX', 'TY', 'TZ', 'U2', 'U3', 'U4', 'U5', 'U6', 'U7', 'U9', 'UA', 'UK', 'UL', 'VN', 'VS', 'VY', 'WB', 'WE', 'WS', 'WY', 'XQ', 'ZL'];
        var notExistAirline = [];
        var missingItem = '';
        var exportconstairlines = { '0B': "Blue Air Airline Management", '0V': "Vietnam Air Service Company", '8H': "Balkan Holidays", '1L': "West? Air? Express", '1X': "Branson Air", '2A': "Deutsche Bahn", '2B': "Albawings", '2C': "Sncf", '2D': "Eastern Airlines", '2E': "Smokey Bay Air", '2F': "Fair Aviation", '2H': "Thalys International", '2I': "Star Peru", '2J': "Air Burkina", '2K': "Avianca Ecuador", '2L': "Helvetic Airways", '2M': "Maya Island Air", '2N': "Nextjet", '2O': "Island Air", '2P': "Pal Express", '2R': "Via Rail", '2S': "Air Carnival", '2T': "Turbo Megha Air", '2U': "Sun D'or Airline", '2V': "Amtrak", '2W': "Welcome Air", '3A': "Chu Kong Trans", '3C': "Air Chathams", '3D': "Denim Air", '3E': "Air Choice", '3F': "Pacific Airways", '3H': "Air Inuit", '3J': "Jubba Airways Ltd", '3K': "Jetstar Asia Air", '3M': "Silver Airways", '3N': "Air Urga", '3O': "Air Arabia", '3P': "Air Philip", '3S': "Air Antilles", '3U': "Sichuan Airlines", '3V': "Asl Airlines Belgium", '3X': "Premier Trans Aire", '3Y': "Uniways", '3Z': "Travel Service Polska", '4A': "Aerodynamics", '4B': "Boutique Air", '4C': "Lan Colombia", '4D': "Air Sinai", '4E': "Tanana Air", '4F': "Air City", '4G': "Gazpromavia", '4H': "United Airways Bangladesh", '4I': "Ihy Izmir", '4J': "Flydamas Airline", '4K': "Kenn Borek Air", '4L': "Lineas Aereas Suramericanas", '4M': "Latam Argentina", '4N': "Air North", '4O': "Interjet", '4P': "Regional Sky", '4Q': "Safi Airways", '4R': "Renfe Viajeros", '4T': "Transwest Air", '4U': "Germanwings", '4W': "Warbelows Air", '4Y': "Airbus Transport International", '4Z': "South African Ai", '5B': "Bassaka Air", '5C': "Nature Air", '5D': "Aeromexico Cnct", '5E': "East Coast Flight Services, Inc", '5F': "Fly One", '5H': "Five Forty", '5J': "Cebu Pacific Air", '5K': "Hi Fly", '5M': "Montserrat Airways Ltd", '5N': "Nordavia Airline", '5O': "Asl Airlines", '5R': "Rutaca", '5S': "Profesionales", '5T': "Canadian North", '5U': "Tag Airlines", '5V': "Lviv Airlines", '5W': "Speed Alliance", '5Y': "Atlas Air", '5Z': "Cemair", '6B': "Tuifly Nordic Ab", '6C': "Air Timor S. A.", '6D': "Travel Service", '6E': "Indigo", '6G': "Executive Express Aviation Llc", '6H': "Israir", '6J': "Solaseed", '6K': "Kyrgyz Transavia", '6L': "Aklak Inc", '6O': "Orbest", 'Y3': "Gryphon Airlines", '6Q': "Cham Wings", '6R': "Alrosa Air Co.", '6S': "Saudi Gulf Air", '6T': "Air Mandalay", '6V': "Avanza", '6W': "Saratov Airlines", '6Y': "Smartlynx Air", '7B': "Fly Bluecrane", '7C': "Jeju Air", '7E': "Sylt Air", '7F': "First Air", '7G': "Star Flyer", '7H': "Corvus Airlines", '7I': "Insel Air", '7J': "Tajik Air", '7K': "Kogalymavia", '7L': "Silk Way West", '7M': "Mayair, S.a. De C.v.", '7N': "Pawa Dominicana", '7P': "Air Panama", '7Q': "Elite Airways", '7R': "Rusline", '7T': "Aero Express", '7V': "Federal Airlines", '7W': "Wind Rose", '7Y': "Mann Airlines", '8A': "Atlas Blue", '8F': "Stp Airways", '8G': "Angel? Airlines", '8I': "Insel Air Aruba", '8J': "Ecojet", '8K': "K-mile Air", '8L': "Lucky Air", '8M': "Myanmar Airways", '8P': "Pacific Coastal", '8Q': "Onur Air", '8S': "Turbojet", '8T': "Air Tindi", '8U': "Afriqiyah", '8Y': "Air Burundi", '9A': "Eaglexpress Air Charter", '9B': "Accesrail", '9C': "Spring Airlines", '9D': "Toumai Air Tchad", '9E': "Endeavor Air", '9F': "Eurostar", '9G': "Airport Express Rail", '9H': "Changan Airlines", '9J': "Dana Airlines", '9K': "Cape Air", '9M': "Central Mtn Air", '9N': "Tropic Air", '9P': "Petra Airline", '9Q': "Caicos Express", '9R': "Satena", '9S': "Southern Air Inc.", '9T': "Travelspan", '9U': "Air Moldova", '9V': "Avior Airlines", '9W': "Jet Airways", '9X': "Southern Airways", 'VB': "Aeroenlaces? Nacionales", 'A0': "Aviancaargentina", 'A2': "Astra Airlines", 'A3': "Aegean Air", 'A4': "Azimuth Airlines", 'A5': "Hop", 'A6': "Yunnan Hong Tu", 'A7': "Calafia Airlines", 'A8': "Benin Golf Air", 'A9': "Georgian Airways", 'AA': "American", 'AB': "Air Berlin", 'AC': "Air Canada", 'AD': "Azul Linhas", 'AE': "Mandarin Air", 'AF': "Air France", 'AG': "Aruba Airlines", 'AH': "Air Algerie", 'AI': "Air India", 'AJ': "Aerocontractors", 'AK': "Airasia", 'AM': "Aeromexico", 'AN': "Advanced Air", 'AO': "Air Juan", 'AP': "Airone S.p.a", 'AQ': "Aloha Airlines", 'AR': "Aerolineas Argen", 'AS': "Alaska Airlines", 'AT': "Royal Air Maroc", 'AU': "Austral Lineas", 'AV': "Avianca", 'AW': "Africa World Air", 'AX': "Trans States Air", 'AY': "Finnair", 'AZ': "Alitalia", 'B0': "La Compagnie", 'B2': "Belavia", 'B3': "Bellview Airlines", 'B4': "Zanair", 'B5': "East African Saf", 'B6': "Jetblue Airways", 'B7': "Uni Airways", 'B8': "Eritrean Air", 'B9': "Iran Airtour Air", 'BA': "British Airways", 'BB': "Seaborne", 'BC': "Skymark Airlines", 'BD': "Bayon Airlines", 'BE': "Flybe", 'BF': "French Bee", 'BG': "Biman Bangladesh", 'BH': "Bismillah Airlines", 'BI': "Royal Brunei", 'BJ': "Nouvelair Tunisi", 'BK': "Okay Airways", 'BL': "Jetstar Pacific", 'BM': "British Midland", 'BO': "Bb Airways Pvt Ltd", 'BP': "Air Botswana", 'BQ': "Aeromar Air", 'BR': "Eva Airways", 'BS': "Us Bangla", 'BT': "Air Baltic", 'BU': "Caa", 'BV': "Blu-express", 'BW': "Caribbean Air", 'BX': "Air Busan", 'BY': "Thomson Airways", 'BZ': "Blue Bird Airway", 'C0': "One Caribbean", 'C2': "Ceiba Intercon", 'C3': "Trade Air Ltd", 'C4': "Conquest Air Inc.", 'C5': "Commutair", 'C6': "Canjet", 'C7': "Cinnamon Air", 'C8': "Cronus Airlines", 'C9': "Alphaland Inc", 'CA': "Air China", 'CB': "Scotairways", 'CC': "Cm Airlines", 'CD': "Alliance Air", 'CE': "Chalair", 'CF': "China Postal Airlines", 'CG': "Png Air", 'CI': "China Airlines", 'CJ': "Ba City Flyer", 'CL': "Lufthansa City", 'CM': "Copa Airlines", 'CN': "Grand China Air", 'CO': "Cobalt Aero", 'CP': "Compass Airlines", 'CS': "Comlux Aruba Nv", 'CT': "Alitalia City", 'CU': "Cubana Airlines", 'CV': "Cargolux", 'CW': "Air Cargo Global", 'CX': "Cathay Pacific", 'CY': "Charlie Airlines", 'CZ': "China Southern", 'D1': "Direct Air & Tours", 'D2': "Severstal", 'D3': "Daallo Airlines", 'D4': "Dart Ltd", 'D5': "Dauair", 'D6': "Inter Air", 'D7': "Airasia X", 'D8': "Norwegian", 'D9': "Dena Airways", 'DA': "Air Georgia", 'DB': "Maleth-aero", 'DC': "Braathens Regional Airways", 'DD': "Nok Air", 'DE': "Condor", 'DF': "Condor Berlin", 'DG': "Cebgo", 'DH': "Independence Air", 'DI': "Divi Divi Air", 'DJ': "Air Asia Japan", 'DK': "Thomas Cook Scandinavia", 'DL': "Delta", 'DM': "Anda Air Limited", 'DN': "Norwegian Air", 'DO': "Sky High", 'DP': "Pobeda", 'DQ': "Alexandria Air", 'DR': "Ruili Airlines", 'DS': "Easyjet Switzerland Sa", 'DT': "Angola Airlines", 'DV': "Air Company Scat", 'DX': "Danish Air", 'DY': "Norwegian Air", 'E3': "Newgen Airways", 'E4': "Enter Air Spolka Z.o.o.", 'E5': "Air Arabia Egypt", 'E6': "Bringer Air Cargo Taxi Aereo", 'E8': "City Airways", 'E9': "Evelop Airlines", 'EA': "European Express", 'EB': "Wamos Air", 'EC': "Openskies", 'ED': "Airexplore", 'EF': "Strategic? Airlines", 'EG': "Ernest Airline", 'EH': "Ana Wings", 'EI': "Aer Lingus", 'EJ': "New England", 'EK': "Emirates", 'EL': "Ellinair S A", 'EM': "Aero Benin", 'EN': "Air Dolomiti", 'EO': "Pegas Fly", 'EP': "Iran Asseman", 'EQ': "Tame Airlines", 'ER': "Serene Air", 'ET': "Ethiopian Air", 'EU': "Chengdu Airlines", 'EV': "Expressjet", 'EW': "Eurowings", 'EX': "Santo Domingo", 'EY': "Etihad Airways", 'EZ': "Sun Air Scandina", 'F5': "Aerotranscargo", 'F6': "Fly Compass", 'F7': "Etihad Regional", 'F8': "Flair Airlines", 'F9': "Frontier", 'FA': "Safair", 'FB': "Bulgaria Air", 'FC': "Fast Colombia S.a.s", 'FD': "Dba Viva Colombia", 'FF': "Tower Air", 'FG': "Ariana Afghan Airlines", 'FH': "Freebird Airline", 'FI': "Icelandair", 'FJ': "Fiji Airways", 'FK': "Keewatin Air", 'FL': "Airtran Airways", 'FM': "Shanghai", 'FN': "Fastjet Plc", 'FO': "Flybondi", 'FP': "Pelican Airlines", 'FQ': "Sol Lineas", 'FR': "Ryanair", 'FS': "Flyglobal Charter Sdn. Bhd.", 'FT': "Flyegypt", 'FU': "Fuzhou Airlines", 'FV': "Rossiya Airlines", 'FW': "Ibex Airlines", 'FY': "Firefly", 'FZ': "Flydubai", 'G3': "Gol", 'G4': "Allegiant Air", 'G5': "China Express", 'G6': "Aura Airlines", 'G7': "Gojet Airlines", 'G8': "Go Air", 'G9': "Air Arabia", 'GA': "Garuda", 'GC': "Global Feeder Services", 'GD': "Grandstar Cargo International Airlines", 'GE': "Transasia Airway", 'GF': "Gulf Air", 'GH': "Globus Llc", 'GJ': "Zhejiang Loong", 'GK': "Jetstar Japan", 'GL': "Air Greenland", 'GM': "Germania", 'GP': "Apg Airlines", 'GQ': "Sky Express", 'GR': "Aurigny Air Svc", 'GS': "Tianjin Airlines", 'GT': "Air Guilin", 'GU': "Aviateca", 'GV': "Grant Aviation", 'GX': "Guangxi Beibu", 'GY': "Colorful Guizhou", 'GZ': "Air Rarotonga", 'H1': "Hahn Air Systems", 'H2': "Sky Airline", 'H3': "Air Berlin Aviation Gmbh", 'H4': "Aero4m D.o.o", 'H5': "Thomas Cook Airlines Balearics", 'H6': "Hageland", 'H7': "Taron-avia", 'H8': "Auric Air Services", 'HA': "Hawaiian", 'HC': "Air Senegal", 'HD': "Airdo", 'HE': "Lgw", 'HF': "Air Ivory Coast", 'HG': "Niki", 'HH': "Taban Airlines", 'HI': "Papillon", 'HK': "Skippers Aviatio", 'HM': "Air Seychelles", 'HO': "Juneyao Airlines", 'HQ': "Thomas Cook Airlines Belgium N.v", 'HR': "Hahn Air Lines", 'HS': "Heli Securite", 'HT': "Tianjin Air Cargo Co., Ltd", 'HU': "Hainan Airlines", 'HV': "Transavia", 'HW': "North-wright", 'HX': "Hong Kong Air", 'HY': "Uzbekistan", 'HZ': "Jsc Aurora", 'I2': "Iberia Express", 'I4': "Scott Air Llc", 'I5': "Airasia", 'I7': "Inter Iles Air", 'I8': "Aboriginal Air", 'I9': "Air Italy", 'IA': "Iraqi Airways", 'IB': "Iberia", 'IC': "Indian Airlines", 'ID': "Batik Air", 'IE': "Solomon Airlines", 'IF': "Fly Baghdad Airl", 'IG': "Meridiana", 'IH': "Southern Sky Jsc", 'IJ': "Spring Airlines", 'IK': "Air Kiribati", 'IM': "Jsc Aircompany", 'IN': "Nam Air", 'IQ': "Qazaq Air", 'IR': "Iran Air", 'IS': "Sepehran Air", 'IT': "Tigerair Taiwan", 'IV': "Cardiff Aviation Malta", 'IW': "Wings Air", 'IX': "Air India Exp", 'IY': "Yemenia Yemen", 'IZ': "Arkia Israeli", 'J0': "Jetlink Express", 'J2': "Azerbaijan Airl", 'J3': "Northwestern Air", 'J5': "Alaska Seaplane", 'J6': "Jamaica Air", 'J7': "Afrijet", 'J8': "Berjaya Air", 'J9': "Jazeera Airways", 'JA': "Jetsmart Spa", 'JB': "Helijet Intl Inc", 'JC': "Japan Air Commut", 'JD': "Capital Airlines", 'JE': "Mango", 'JF': "Jet Asia Airways", 'JH': "Fuji Dream", 'JI': "San Juan Aviatio", 'JJ': "Latam Brazil", 'JK': "Spanair", 'JL': "Japan Airlines", 'JM': "Jambojet", 'JN': "Joon", 'JO': "Royal Wings", 'JP': "Adria Airways", 'JQ': "Jetstar Airways", 'JR': "Joy Air", 'JS': "Air Koryo", 'JT': "Lion Air", 'JU': "Air Serbia", 'JV': "Bearskin Airline", 'JW': "Vanilla Air", 'JX': "Dac Aviation", 'JY': "Intercaribbean", 'JZ': "Jubba Airways", 'K2': "Yute Commuter", 'K3': "Taquan Air Svc", 'K5': "Silverstone Air", 'K6': "Cambodia Angkor", 'K7': "Air Kbz Ltd", 'K8': "Kan Air", 'K9': "Esen Air", 'KA': "Cathay Dragon", 'KB': "Druk Air", 'KC': "Air Astana", 'KD': "Kalstar Aviation", 'KE': "Korean Air Lines", 'KF': "Air Belgium", 'KG': "Key Lime Air Corporation", 'KI': "Krasavia", 'KK': "Atlasglobal", 'KL': "KLM", 'KM': "Air Malta", 'KN': "China United", 'KO': "Alaska Express", 'KP': "Asky", 'KQ': "Kenya Airways", 'KR': "Cambodia Airways", 'KS': "Penair", 'KU': "Kuwait Airways", 'KV': "Sky Regional", 'KW': "Korea Express Airlines", 'KX': "Cayman Airways", 'KY': "Kunming Airlines", 'L5': "Atlas Atlantique Airlines", 'L6': "Mauritania", 'L8': "Afric Aviation", 'LA': "Latam Group", 'LB': "Bul Air Ltd.", 'LC': "Encompass Aviation, Llc", 'LD': "Ahk Air Hong Kong", 'LE': "Lugansk Airlines", 'LF': "Corporate Flight", 'LG': "Luxair", 'LH': "Lufthansa", 'LI': "Liat Ltd", 'LJ': "Jin Air", 'LK': "Lao Skyway", 'LL': "Miami Air", 'LM': "Loganair Limited", 'LN': "Libyan Airlines", 'LO': "Lot Polish", 'LP': "Latam Peru", 'LR': "Avianca Cr", 'LS': "Jet2.com", 'LT': "Longjiang", 'LU': "Transporte Aereo", 'LV': "Openskies", 'LW': "Law - Latin American Wings", 'LX': "Swiss", 'LY': "El Al Israel", 'LZ': "Swiss Global Air Lines Ag", 'M0': "Aero Mongolia", 'M3': "Latam Cargo Brasil", 'M4': "Mistral Air", 'M5': "Kenmore Air", 'M6': "Amerijet International, Inc.", 'M8': "Magnum. Air, Inc Dba Skyjet", 'M9': "Motor Sich", 'MA': "Malev Hungarian Airlines", 'MC': "Air Mobility Command", 'MD': "Air Madagascar", 'ME': "Middle East", 'MF': "Xiamen Airlines", 'MH': "Malaysia Airline", 'MI': "Silkair", 'MJ': "Myway Airlines", 'MK': "Air Mauritius", 'ML': "Air Mediterranee", 'MM': "Peach Aviation", 'MN': "Comair", 'MO': "Calm Air Intl", 'MP': "Martinair", 'MQ': "Envoy Air Inc", 'MR': "Hunnu Air", 'MS': "Egyptair", 'MT': "Thomas Cook Air", 'MU': "China Eastern", 'MV': "Air Mediterranea", 'MW': "Mokulele Airline", 'MX': "Mexicana De Aviacion", 'MY': "Maya Island Air", 'MZ': "Amakusa Airlines", 'N3': "Aerolineas Mas", 'N4': "Nord Wind", 'N5': "Nolinor Aviation", 'N7': "Nordic Regional", 'N8': "National Air", 'N9': "Shree Airlines", 'NA': "Nesma Airlines", 'NB': "Skypower Express", 'NC': "Northern Air Cargo, Inc.", 'ND': "Fmi Air", 'NE': "Sky Europe Airlines", 'NF': "Air Vanuatu", 'NG': "Al Naser", 'NH': "All Nippon", 'NI': "Portugalia Air", 'NJ': "Niger Airways", 'NK': "Spirit Airlines", 'NL': "Shaheen Air International", 'NM': "Manx2", 'NN': "Vim Airlines", 'NO': "Neos", 'NP': "Nile Air", 'NQ': "Air Japan", 'NR': "Al-naser Airlines", 'NS': "Hebei Airlines", 'NT': "Binter Canarias", 'NU': "Japan Trans Air", 'NV': "Iranian Naft Airlines", 'NW': "Northwest Airlines", 'NX': "Air Macau", 'NY': "Air Iceland Cnct", 'NZ': "Air New Zealand", 'O2': "Linear Air", 'O4': "Antrak Air", 'O5': "Comores Aviation", 'O6': "Avianca Brazil", 'O8': "Siam Air Transport Company Limited", 'O9': "Nova Airways", 'OA': "Olympic Air", 'OB': "Boliviana", 'OC': "Oriental Air", 'OD': "Malindo Airways", 'OE': "Laudamotion Gmbh", 'OF': "Overland Airways", 'OG': "Ghodawat Enterprises", 'OH': "Psa Airlines", 'OI': "Hinterland Aviation", 'OJ': "Fly Jamaica Air", 'OK': "Czech Airlines", 'OL': "Samoa Airways", 'OM': "Mongolian", 'ON': "Nauru Airlines", 'OO': "Skywest", 'OP': "Dac Int Airlines", 'OQ': "Chongqing Air", 'OR': "Tui Fly", 'OS': "Austrian Airline", 'OT': "Aeropelican Air Services", 'OU': "Croatia Airlines", 'OV': "Estonian Air", 'OX': "Orient Thai", 'OY': "Andes Lineas", 'OZ': "Asiana Airlines", 'P0': "Proflight", 'P2': "Airkenya Express", 'P4': "Air Peace", 'P5': "Aero Republica", 'P6': "Pascan Aviation", 'P7': "Small Planet Airlines", 'P8': "Sprintair", 'P9': "Peruvian Airline", 'PA': "Airblue", 'PB': "Pal Airlines", 'PC': "Pegasus Airlines", 'PD': "Porter Airlines", 'PE': "Altenrhein", 'PF': "Palestinian Airlines", 'PG': "Bangkok Airways", 'PH': "Phoenix Air Group, Inc", 'PI': "Polar Airlines Ltd", 'PJ': "Air Saint-pierre", 'PK': "Pakistan Air", 'PL': "Southern Air Cht", 'PN': "China West Air", 'PQ': "Airasia Philippines", 'PR': "Philippine", 'PS': "Ukraine Intl", 'PU': "Plus Ultra Linea", 'PV': "Saint Barth", 'PW': "Precision Air", 'PX': "Air Niugini", 'PY': "Surinam Airways", 'PZ': "Latam Paraguay", 'Q2': "Maldivian", 'Q3': "Anguilla Air Services", 'Q4': "Starlink", 'Q5': "Forty Mile Air", 'Q6': "Volaris Costa Rica", 'Q7': "Skybahamas", 'Q8': "Trans? Air? Congo", 'QA': "Cimber A/s", 'QB': "Faraz Qeshm Airline", 'QC': "Camair Co", 'QD': "Jc (cambodia) International Airlines", 'QE': "Express Freighte", 'QF': "Qantas Airways", 'QG': "Qualiflyer Group", 'QH': "Air Kyrgyzstan", 'QI': "Cimber Sterling", 'QJ': "Latpass Airlines", 'QK': "Air Canada Jazz", 'QL': "Laser Airlines", 'QM': "Monacair", 'QN': "Skytrans Airline", 'QQ': "Alliance Air Pty", 'QR': "Qatar Airways", 'QS': "Smartwings", 'QU': "Utair Ukraine", 'QV': "Lao Airlines", 'QW': "Qingdao Airline", 'QX': "Horizon Air", 'QZ': "Indonesia Air", 'R2': "Transair Senegal", 'R3': "Yakutia", 'R4': "Rus Aviation", 'R5': "Jordan Aviation", 'R6': "Dot Lt", 'R7': "Aserca Air", 'RA': "Nepal Airlines", 'RB': "Syrian Arab Air", 'RC': "Atlantic Airways", 'RE': "Stobart Air", 'RF': "Erofey", 'RG': "Rotanajet Aviation", 'RI': "Air Costa Rica", 'RJ': "Royal Jordanian", 'RK': "Skyview Airways Co Dba Skyview", 'RL': "Royal Falcon", 'RM': "Airco Armenia", 'RO': "Tarom-romanian", 'RP': "Base Airlines", 'RQ': "Kam Air", 'RS': "Air Seoul", 'RT': "Uvt Aero", 'RV': "Air Canada Rouge", 'RW': "Royal Air", 'RX': "Regent Airways", 'RY': "Royal Wings", 'RZ': "Dba Jiangxi Air", 'S0': "Aero Lineas Sosa", 'S2': "Jetkonnect", 'S3': "Santa Barbara Airlines C.a.", 'S4': "Sata Intl", 'S5': "Shuttle America", 'S6': "Sunrise Airways", 'S7': "Siberia Air", 'S8': "Sounds Air", 'S9': "Starbow Airlines", 'SA': "South African", 'SB': "Air Calin", 'SC': "Shandong", 'SD': "Sudan Airways", 'SE': "Xl Airways", 'SF': "Tassili Air", 'SG': "Spice Jet", 'SH': "Sharp Airlines", 'SI': "Blue Island", 'SJ': "Sriwijaya Air", 'SK': "Sas", 'SL': "Thai Lion", 'SM': "Air Cairo", 'SN': "Brussels Airline", 'SO': "Apex Airlines", 'SP': "Sata Air Acores", 'SQ': "Singapore Airl", 'SS': "Corsair", 'ST': "Germania", 'SU': "Aeroflot", 'SV': "Saudi Arabian", 'SW': "Air Namibia", 'SX': "Sky Work Airlines", 'SY': "Sun Country", 'SZ': "Somon Air", 'T0': "Taca Peru", 'T2': "Fly Art", 'T3': "Eastern Airways", 'T4': "Rhoades Aviation Inc.", 'T5': "Turkmenistan", 'T6': "1time", 'T7': "Twin Jet", 'T8': "Tran African Air", 'TA': "Taca Intl", 'TB': "Tui Fly Belgium", 'TC': "Air Tanzania", 'TD': "Atlantis Armenia", 'TE': "Skytaxi", 'TF': "Bra Sverige Ab", 'TG': "Thai Intl", 'TH': "British Citiexpr", 'TI': "Tropic Ocean", 'TJ': "Tradewind", 'TK': "Turkish Airlines", 'TL': "Airnorth", 'TM': "Lam", 'TN': "Air Tahiti Nui", 'TO': "Transavia Fr", 'TP': "Air Portugal", 'TQ': "Tandem Aero", 'TR': "Scoot", 'TS': "Air Transat", 'TT': "Tigerair Au", 'TU': "Tunis Air", 'TV': "Tibet Airlines", 'TW': "T Way Air Co", 'TX': "Air Caraibes", 'TY': "Air Caledonie", 'TZ': "Tsaradia", 'U2': "Easyjet", 'U3': "Sky Gates Airlin", 'U4': "Buddha Air", 'U5': "Karinou Airlines", 'U6': "Ural Airlines", 'U7': "Air Uganda", 'U8': "Armavia", 'U9': "Tatarstan", 'UA': "United", 'UB': "Myanmar Airways", 'UC': "Latam Chile", 'UD': "Owen Air", 'UE': "Bizair", 'UF': "Petroleum Air", 'UG': "Tunisair Express", 'UH': "Atlasjet", 'UI': "Eurocypria Air", 'UJ': "Almasria Airline", 'UK': "Vistara", 'UL': "Srilankan", 'UM': "Air Zimbabwe", 'UN': "Business Aviation Asia", 'UO': "Hong Kong Expres", 'UP': "Bahamasair", 'UQ': "Urumqi Airlines", 'US': "Us Airways", 'UT': "Utair", 'UU': "Air Austral", 'UV': "Universal Airways, Inc.", 'UX': "Air Europa", 'UZ': "Buraq Air", 'V0': "Conviasa", 'V2': "Avialeasing Aviation Co", 'V3': "Carpatair", 'V4': "Vieques Air Link", 'V5': "Aerovias", 'V6': "Vi Airlink", 'V7': "Air Senegal International", 'VA': "Virgin Au", 'VC': "Viaair", 'VD': "Kun Peng Airlines", 'VE': "Easyfly S. A.", 'VF': "Flyviking", 'VG': "Vlm Airlines", 'VH': "Viva Air Colombia", 'VJ': "Vietjet Aviation", 'VK': "Level Anisec", 'VL': "Med-view Airline", 'VM': "Max Air", 'VN': "Vietnam Air", 'VP': "Flyme", 'VQ': "Novo Air", 'VR': "Tacv Cabo Verde", 'VS': "Virgin Atlantic", 'VT': "Air Tahiti", 'VU': "Veca Airline", 'VV': "Viva Air Peru", 'VW': "Aeromar", 'VX': "Virgin America", 'VY': "Vueling Airlines", 'VZ': "Vietjet Air", 'W2': "Flexflight Aps", 'W3': "Arik Air", 'W4': "Lc Busre Sac", 'W5': "Mahan Air", 'W6': "Wizz Air Hu", 'W7': "Wings Of Lebanon", 'W9': "Wizz Air Uk", 'WA': "Klm Cityhopper", 'WB': "Rwandair Express", 'WC': "Islena Airlines", 'WD': "Modern Transtport Aereo De Caarga Sa", 'WE': "Thai Smile", 'WF': "Wideroes Flyvese", 'WG': "Sunwing", 'WH': "Westair Benin", 'WJ': "Air Labrador", 'WK': "Edelweiss Air", 'WL': "World Atlantic Airlines", 'WM': "Windward Island", 'WN': "Southwest", 'WO': "World? Airways", 'WP': "Island Air", 'WQ': "Swift Air L.l.c.", 'WR': "Westjet Encore", 'WS': "Westjet", 'WT': "Wasaya Airways", 'WU': "Jetways Airlines", 'WV': "Westair Aviation", 'WW': "Wow Air", 'WX': "City Jet", 'WY': "Oman Air", 'WZ': "Red Wings", 'X3': "Tuifly", 'X8': "Icaro", 'X9': "Avion Express", 'XC': "K.d. Air", 'XD': "Bus", 'XE': "Express Jet", 'XF': "Mongolian Airways Cargo", 'XG': "Sunexpress De", 'XH': "Other Travel", 'XJ': "Thai Air Asia X", 'XK': "Ccm", 'XL': "Latam Ecuador", 'XM': "Zimex Aviation", 'XN': "Travel Express", 'XP': "Tem Enterprises", 'XQ': "Sunexpress", 'XR': "Corendon Airline", 'XT': "Indonesia Airasi", 'XU': "African Express", 'XV': "Bvi Airways", 'XW': "Nokscoot Airline", 'XY': "Flynas", 'XZ': "South African Ex", 'Y0': "Yellow Air Taxi", 'Y2': "Air Century", 'Y4': "Volaris", 'Y6': "Ab Aviation", 'Y7': "Jsc Airline Taim", 'Y9': "Kish Air", 'YB': "Borajet", 'YC': "Yamal Airlines", 'YE': "Yanair", 'YG': "Yto Cargo Airlines Co. Ltd", 'YH': "Sunspalsh Llc", 'YI': "Air Sunshine", 'YK': "Avia Traffic Company", 'YL': "Libyan Wings", 'YM': "Montenegro", 'YN': "Air Creebec", 'YO': "Heli Air Monaco", 'YP': "Perimeter Aviation Ltd", 'YQ': "Tar Aerolineas", 'YR': "Scenic Airlines", 'YS': "Hop Regional", 'YT': "Yeti Airlines", 'YU': "Euroatlantic Air", 'YV': "Mesa Airlines", 'YW': "Air Nostrum", 'YX': "Republic Airline Inc", 'YZ': "Yourways", 'Z2': "Phl. Airasia Inc", 'Z3': "Tanana Air", 'Z4': "Zagrosjet", 'Z5': "Global Africa Aviation", 'Z6': "Dnieproavia Joint Stock Aviation Co", 'Z7': "Amaszonas", 'Z8': "Amaszonas", 'Z9': "Jsc Bek Air", 'ZA': "Skywings Asia", 'ZB': "Monarch Airlines", 'ZC': "Flyafrica Zimbab", 'ZD': "Ewa Air", 'ZE': "Eastar Jet", 'ZF': "Azur Air", 'ZH': "Shenzhen Airline", 'ZI': "Aigle Azur", 'ZK': "Great Lakes", 'ZL': "Regional Express", 'ZM': "Air Manas", 'ZN': "Naysa", 'ZP': "Paranair", 'ZQ': "Azman Air", 'ZS': "Sol Air", 'ZU': "Sunair Aviation", 'ZV': "V Air Corporation", 'ZW': "Air Wisconsin", 'ZX': "Air Alliance" };
        var existAirlinesss = JSON.parse(JSON.stringify(exportconstairlines));
        /* Object.entries(existAirlinesss).forEach(entry => {
          if(!awsAirlines.includes(entry[0])){
           missingItem = entry[0] + '  ' +  entry[1];
            notExistAirline.push(missingItem)
          }
        })
        console.log(notExistAirline) */
        /* existAirlines.map(item => {
          console.log('s',item)
          if(!awsAirlines.includes(item)){
            // missingItem = item + ', '+ 'Airline'
            // notExistAirline.push(item)
          }
        }); */
        // console.log(notExistAirline)
    };
    DealComponent.prototype.ngAfterContentChecked = function () {
        this.list = this.dealList;
    };
    DealComponent.prototype.btnDealClick = function (code) {
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        this.toString.emit(code);
    };
    __decorate([
        core_1.Output()
    ], DealComponent.prototype, "toString");
    __decorate([
        core_1.Input()
    ], DealComponent.prototype, "dealList");
    DealComponent = __decorate([
        core_1.Component({
            selector: 'app-deal',
            templateUrl: './deal.component.html',
            styleUrls: ['./deal.component.scss']
        })
    ], DealComponent);
    return DealComponent;
}());
exports.DealComponent = DealComponent;
