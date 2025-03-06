import { IHelper } from "./IHelper";
import { userSchema } from '../schemas/User.schema';
import dataSource from "../../dataSourceServer";
import { Equal } from "typeorm";
import { ConversionRate } from "../../core/entities/ConversionRate";
import { conversionRateSchema } from "../schemas/ConversionRate.schema";
import { CurrencyProvider } from "../../core/interfaces/CurrencyProvider";
import { ConversionRateNotFound } from "../../errors/ConversionRateNotFound";


export class ConversionRateHelper extends IHelper<ConversionRate> implements CurrencyProvider {
    protected schema = conversionRateSchema
    protected connection = dataSource

    async findById(id: string): Promise<ConversionRate | null> {
        const repository = (await this.connection).getRepository(this.schema)

        const cr = await repository.findOneBy({ id: Equal(id) })

        return cr
    }

    async returnConversionRates(): Promise<ConversionRate[]> {
        const repository = (await this.connection).getRepository(this.schema)

        const cr = await repository.find()

        return cr
    }

    async returnAvailableCurrencies(): Promise<string[]> {
        const repository = (await this.connection).getRepository(this.schema);
        const crs = await repository.find();
        const currencySet = new Set<string>();

        for (let cr of crs) {
            currencySet.add(cr.fromCurrency);
            currencySet.add(cr.toCurrency);
        }

        return Array.from(currencySet);
    }

    async create(cr: ConversionRate) {
        const repository = (await this.connection).getRepository(this.schema)

        await repository.save(cr)
    }

    async remove(cr: ConversionRate) {
        const repository = (await this.connection).getRepository(this.schema)

        await repository.remove(cr)
    }

    async update(id: number, cr: ConversionRate) {
        const repository = (await this.connection).getRepository(this.schema)

        await repository.update(id, cr)
    }



    async getNextId(): Promise<number> {
        const repository = (await this.connection).getRepository(this.schema);

        const crs = await repository.find({
            order: {
                id: 'DESC',
            },
            take: 1,
        });

        const cr = crs[0] || null;


        if (cr && !isNaN(Number(cr.id))) {
            return Number(cr.id) + 1;
        }
        return 1;

    }

    async returnConversionRate(from: string, to: string): Promise<number> {
        const repository = (await this.connection).getRepository(this.schema);
        const cr = await repository.findOne({
            where: {
                fromCurrency: from,
                toCurrency: to
            }
        });
        if (!cr) {
            throw new ConversionRateNotFound(`Conversion rate not found for ${from} to ${to}`);
        }
        return cr.rate;
    }


}