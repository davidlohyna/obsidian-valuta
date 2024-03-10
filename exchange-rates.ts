export interface ExchangeRates {
    amount: number;
    base:   string;
    date:   Date;
    rates:  { [key: string]: number };
}

