import { AccountHelper } from '../../infrastructure/helpers/AccountHelper';
import { CurrencyProvider } from './../../core/interfaces/CurrencyProvider';
import { Account } from "../../core/entities/Account";
import { MissingInformation } from '../../errors/MissingInformation';
import { Unauthorized } from "../../errors/Unauthorized";
import { AccountNotFound } from "../../errors/AccountNotFound";
import { WrongInformation } from '../../errors/WrongInformation';
import { UserProvider } from '../../core/interfaces/UserProvider';
import { UserNotFound } from '../../errors/UserNotFound';
import { InsufficientFunds } from '../../errors/InsufficientFunds';
import { TransactionServiceProvider } from '../../core/interfaces/TransactionServiceProvider';
import { Transaction } from '../../core/entities/Transaction';
import { LimitSurpassed } from '../../errors/LimitSurpassed';
import { AccountProvider } from '../../core/interfaces/AccountProvider';
import { v4 as uuidv4 } from 'uuid';

export class AccountService implements AccountProvider {

    constructor(
        private readonly helper: AccountHelper,
        private readonly currencyProvider: CurrencyProvider,
        private readonly userProvider: UserProvider,
        private readonly transactionServiceProvider: TransactionServiceProvider
    ) { }


    async getAccountByAccountNumber(userId: string, accountNumber: string): Promise<Account> {

        const account = await this.helper.findByAccountNumber(accountNumber)

        if (!account) throw new AccountNotFound(`An Account with account number "${accountNumber}" was not found`)

        return account
    }

    async getAccounts(userId: string): Promise<Account[]> {
        let accounts = await this.helper.returnAccounts()

        if (!accounts) throw new AccountNotFound(`There are no Accounts`)

        accounts = accounts.filter(a => a.userId === userId)

        return accounts
    }

    async getSelfAccounts(userId: string): Promise<Account[]> {
        const accounts = await this.helper.findAccountsByUserId(userId)

        if (!accounts) throw new AccountNotFound(`There are no accounts from this user`)

        return accounts
    }

    async removeAccountByAccountNumber(id: string, userId: string, accountNumberToErase: string) {
        const account = await this.helper.findByAccountNumber(accountNumberToErase)

        if (!account) throw new AccountNotFound(`An Account with account number ${accountNumberToErase} was not found`)

        await this.helper.remove(account)
    }

    async removeSelfAccountByAccountNumber(id: string, userId: string, accountNumberToErase: string) {

        if (id != userId) {
            throw new Unauthorized(`No tens permis per efectuar aquesta operació`)
        }
        const account = await this.helper.findByAccountNumber(accountNumberToErase)

        if (!account) throw new AccountNotFound(`An Account with account number ${accountNumberToErase} was not found`)

        await this.helper.remove(account)
    }

    async create(userId: string, currency: string, accountType: string, dailyLimit: number) {

        const nextAccountNumber = await this.getNextAccountNumber();
        const countryCode = 'ES';
        const bankCode = '1234';
        const branchCode = '5678';
        const checksum = '00';
        const nAccountNumber = nextAccountNumber.toString().padStart(10, '0');

        const accountNumber = `${countryCode}${checksum}${bankCode}${branchCode}${nAccountNumber}`;


        const availableCurrencies = await this.currencyProvider.returnAvailableCurrencies()

        if (currency.trim().length != 3) {
            throw new MissingInformation("No s'ha introduit una currency valida");
        }
        let defCurrency = null
        for (let cr of availableCurrencies) {
            if (cr == currency)
                defCurrency = cr
        }
        if (defCurrency == null) throw new WrongInformation("No s'ha introduit un tipus de divisa vàlid")

        if (accountType != 'savings' && accountType != 'current') throw new WrongInformation("No s'ha seleccionat un tipus de compte correcte")

        if (!dailyLimit) dailyLimit = 10000
        const account = Account.create(accountNumber, currency, accountType, dailyLimit, userId);
        await this.helper.create(account);

    }


    async modifyAccount(accountNumberToChange: string, userId?: string, currency?: string, accountType?: string, dailyLimit?: number, balance?: number) {
        const account = await this.helper.findByAccountNumber(accountNumberToChange);
        if (!account) {
            throw new AccountNotFound(`No s'ha trobat cap compte amb el numero de compte ${accountNumberToChange}`);
        } else {

            let defCurrency: string | undefined = undefined;

            if (userId && userId !== account.userId) {
                const users = await this.userProvider.getUsers();
                const foundUser = users.find(u => userId === u.id);
                if (foundUser) {
                    userId = foundUser.id;
                } else {
                    throw new UserNotFound(`Usuari no trobat`);
                }
            }
            if (account !== undefined) {
                if (accountType != 'savings' && accountType != 'current') throw new WrongInformation("No s'ha seleccionat un tipus de compte correcte")
            }
            if (currency) {
                const availableCurrencies = await this.currencyProvider.returnAvailableCurrencies();
                if (currency.trim().length !== 3) {
                    throw new MissingInformation("No s'ha introduit una currency valida");
                }

                defCurrency = availableCurrencies.find(cr => cr == currency);

                if (!defCurrency) {
                    throw new WrongInformation("No s'ha introduit un tipus de divisa vàlid");
                }

                if (defCurrency !== account.currency) {
                    const cr = await this.currencyProvider.returnConversionRate(account.currency, defCurrency);
                    balance = account.balance * cr;
                }
            }


            let updatedAccount = null

            updatedAccount = new Account(
                accountNumberToChange,
                defCurrency || account.currency,
                balance || account.balance,
                accountType || account.accountType,
                dailyLimit || account.dailyLimit,
                userId || account.userId
            );

            await this.helper.update(accountNumberToChange, updatedAccount);
        }
    }

    async modifySelfAccount(id: string, accountNumberToChange: string, userId?: string, currency?: string, accountType?: string, dailyLimit?: number, balance?: number) {
        const account = await this.helper.findByAccountNumber(accountNumberToChange);
        if (!account) {
            throw new AccountNotFound(`No s'ha trobat cap compte amb el numero de compte ${accountNumberToChange}`);
        } else {
            if (id !== account.userId) {
                throw new Unauthorized(`No tens permis per modificar aquest compte`);
            }

            let defCurrency: string | undefined = undefined;

            if (userId && userId !== account.userId) {
                const users = await this.userProvider.getUsers();
                const foundUser = users.find(u => userId === u.id);
                if (foundUser) {
                    userId = foundUser.id;
                } else {
                    throw new UserNotFound(`Usuari no trobat`);
                }
            }
            if (account !== undefined) {
                if (accountType != 'savings' && accountType != 'current') throw new WrongInformation("No s'ha seleccionat un tipus de compte correcte")
            }
            if (currency) {
                const availableCurrencies = await this.currencyProvider.returnAvailableCurrencies();
                if (currency.trim().length !== 3) {
                    throw new MissingInformation("No s'ha introduit una currency valida");
                }

                defCurrency = availableCurrencies.find(cr => cr == currency);

                if (!defCurrency) {
                    throw new WrongInformation("No s'ha introduit un tipus de divisa vàlid");
                }

                if (defCurrency !== account.currency) {
                    const cr = await this.currencyProvider.returnConversionRate(account.currency, defCurrency);
                    balance = account.balance * cr;
                }
            }


            let updatedAccount = null

            updatedAccount = new Account(
                accountNumberToChange,
                defCurrency || account.currency,
                balance || account.balance,
                accountType || account.accountType,
                dailyLimit || account.dailyLimit,
                userId || account.userId
            );

            await this.helper.update(accountNumberToChange, updatedAccount);
        }
    }

    async transfer(from: string, to: string, ammount: number) {

        const fromAccount = await this.helper.findByAccountNumber(from);
        const toAccount = await this.helper.findByAccountNumber(to);

        if (!fromAccount) throw new AccountNotFound(`No s'ha trobat cap compte amb el numero de compte ${from}`);

        if (!toAccount) throw new AccountNotFound(`No s'ha trobat cap compte amb el numero de compte ${to}`);

        if (ammount <= 0) throw new WrongInformation(`L'import de la transferència ha de ser positiu.`);

        if (fromAccount.balance < ammount) throw new InsufficientFunds(`Saldo insuficient en el compte ${from}`);

        let conversionRate = 1;

        if (fromAccount.currency !== toAccount.currency) {
            conversionRate = await this.currencyProvider.returnConversionRate(fromAccount.currency, toAccount.currency);
            ammount = ammount * conversionRate;
        }

        const defFromAccount = fromAccount.reduceBalance(Number(ammount));
        const defToAccount = toAccount.incrementBalance(Number(ammount));

        const fromTransaction = Transaction.create(
            uuidv4(),
            from,
            'transfer',
            ammount,
            fromAccount.currency,
            new Date(),
            `Transferencia a la cuenta ${to}`
        );

        const toTransaction = Transaction.create(
            uuidv4(),
            to,
            'transfer',
            ammount,
            toAccount.currency,
            new Date(),
            `Transferencia desde la cuenta ${from}`
        );

        await this.helper.update(defFromAccount.accountNumber, defFromAccount);
        console.log(defFromAccount)
        await this.helper.update(defToAccount.accountNumber, defToAccount);
        console.log(defToAccount)
        await this.transactionServiceProvider.registerTransaction(fromTransaction);
        console.log('c')
        await this.transactionServiceProvider.registerTransaction(toTransaction);
        console.log('d')

    }

    async deposit(accountNumber: string, ammountString: string, currency?: string) {
        const account = await this.helper.findByAccountNumber(accountNumber)
        let ammount: number = Number(ammountString)

        if (!account) throw new AccountNotFound(`No s'ha trobat cap compte amb el numero de compte ${account}`);

        if (currency !== undefined && currency !== account.currency) {
            const availableCurrencies = await this.currencyProvider.returnAvailableCurrencies();
            if (currency.trim().length !== 3) {
                throw new MissingInformation("No s'ha introduit una currency valida");
            }

            currency = availableCurrencies.find(cr => cr == currency);

            if (!currency) {
                throw new WrongInformation("No s'ha introduit un tipus de divisa vàlid");
            }

            const cr = await this.currencyProvider.returnConversionRate(currency, account.currency);
            ammount = ammount * cr;
        }

        const defAccount = account.setBalance(account.balance + ammount)
        await this.helper.update(accountNumber, defAccount);
        const transaction = Transaction.create(
            uuidv4(),
            accountNumber,
            'deposit',
            ammount,
            currency || account.currency,
            new Date(),
            `Deposit`
        );
        await this.transactionServiceProvider.registerTransaction(transaction);
    }

    async withdraw(id: string, accountNumber: string, ammount: number) {
        const account = await this.helper.findByAccountNumber(accountNumber)

        if (!account) throw new AccountNotFound(`No s'ha trobat cap compte amb el numero de compte ${account}`);

        if (account.balance < ammount) throw new InsufficientFunds(`No hi ha suficient saldo per fer la retirada`)

        if (ammount > account.dailyLimit) throw new LimitSurpassed(`Has excedit el teu limit diari ${account.dailyLimit}`)

        const defAccount = account.setBalance(account.balance - ammount)

        await this.helper.update(accountNumber, defAccount);

        const transaction = Transaction.create(
            uuidv4(),
            accountNumber,
            'withdraw',
            ammount,
            account.currency,
            new Date(),
            `Withdraw`
        );
        await this.transactionServiceProvider.registerTransaction(transaction);

        //Aqui es proporcionarien els diners al client en la realitat
    }

    async generateMonthlyInterest(accountNumber: string) {
        const account = await this.helper.findByAccountNumber(accountNumber)

        if (!account) throw new AccountNotFound(`No s'ha trobat cap compte amb el numero de compte ${account}`);

        if (account.accountType !== 'savings') throw new WrongInformation(`No es pot calcular interessos d'un compte corrent`);

        const averageDailyBalance = await this.transactionServiceProvider.calculateAverageDailyBalance(accountNumber);

        if (averageDailyBalance <= 0) throw new InsufficientFunds('El saldo medio diario debe ser mayor que 0.');

        //-----------------------------------------------------------------------------------
        //
        // Aqui hi ha varies maneres per definir-ho pero per falta de temps ho deixaré aixi
        // pero lo normal seria o que cada compte tingues un atribut que fos l'interes anual 
        // o si el banc ho prefereix que tots els comptes tinguin el mateix es podria guardar
        // el valor a la BBDD i mitjançant helper y tal recuperar-ho, permetent que es pugui
        // modificar amb un servei dedicat.

        const annualInterestRate = 3

        //-----------------------------------------------------------------------------------

        const monthlyInterest = averageDailyBalance * (annualInterestRate / 12);
        const modifiedAccount = account.setBalance(account.balance + monthlyInterest)
        await this.helper.update(accountNumber, modifiedAccount)
    }

    async changeDailyLimit(accountNumber: string, dailyLimit: string) {
        const account = await this.helper.findByAccountNumber(accountNumber)

        if (!account) throw new AccountNotFound(`No s'ha trobat cap compte amb el numero de compte ${account}`);

        if (Number(dailyLimit) < 0) throw new WrongInformation(`El daily limit ha de ser superior a 0`)

        const modifiedAccount = account.setDailyLimit(Number(dailyLimit))

        await this.helper.update(modifiedAccount.accountNumber, modifiedAccount)
    }

    async getNextAccountNumber(): Promise<number> {
        const accounts = await this.helper.returnAccounts();

        if (accounts == undefined || accounts.length == 0) return 1;

        let accNumbers: string[] = accounts.map(acc => acc.accountNumber);

        let numbers: number[] = accNumbers.map(accNumb =>
            Number(accNumb.slice(-10))
        );


        return (Math.max(...numbers) + 1)
    }



}