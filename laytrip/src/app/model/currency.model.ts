export class CurrencyModel{

    data            :Currency[];
    TotalReseult    :number;
}

export class Currency{

    id          : number;
    country     : string;
    code        : string;
    symbol      : string;
    status      : boolean
}