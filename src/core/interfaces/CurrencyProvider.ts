export interface CurrencyProvider {
    returnAvailableCurrencies(): Promise<string[]>;
    returnConversionRate(from: string, to: string): Promise<number>;
}
