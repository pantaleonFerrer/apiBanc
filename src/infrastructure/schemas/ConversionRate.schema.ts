import { EntitySchema } from "typeorm";
import { ConversionRate } from "../../core/entities/ConversionRate";

export const conversionRateSchema = new EntitySchema<ConversionRate>({
    name: 'ConversionRate',
    target: ConversionRate,
    tableName: 'conversionRates',
    columns: {
        id: {
            primary: true,
            type: String,
            nullable: false,
        },
        fromCurrency: {
            type: String,
            nullable: false,
        },
        toCurrency: {
            type: String,
            nullable: false,
        },
        rate: {
            type: 'decimal',
            nullable: false,
        },
    },

});
