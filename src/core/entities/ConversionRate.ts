
export class ConversionRate {
    constructor(
        readonly id: string,
        readonly fromCurrency: string,
        readonly toCurrency: string,
        readonly rate: number
    ) { }


}