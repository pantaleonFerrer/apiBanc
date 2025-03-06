import { User } from "../../core/entities/User";
import { IHelper } from "./IHelper";
import { userSchema } from '../schemas/User.schema';
import dataSource from "../../dataSourceServer";
import { Equal } from "typeorm";
import { UserProvider } from "../../core/interfaces/UserProvider";


export class UserHelper extends IHelper<User> {
    protected schema = userSchema
    protected connection = dataSource

    async findById(id: string): Promise<User | null> {
        const repository = (await this.connection).getRepository(this.schema)

        const user = await repository.findOneBy({ id: Equal(id) })

        return user
    }

    async returnUsers(): Promise<User[]> {
        const repository = (await this.connection).getRepository(this.schema)

        const users = await repository.find()

        return users
    }

    async create(user: User) {
        const repository = (await this.connection).getRepository(this.schema)

        await repository.save(user)
    }

    async remove(user: User) {
        const repository = (await this.connection).getRepository(this.schema)

        await repository.remove(user)
    }

    async update(id: number, user: User) {
        const repository = (await this.connection).getRepository(this.schema)

        const userExists = await repository.findOneBy({ id: Equal(user.id) })

        if (!userExists) return

        await repository.update({ id: Equal(user.id) }, user)
    }

    async findByEmailAndPassword(email: string, password: string) {
        const repository = (await this.connection).getRepository(this.schema)

        const user = await repository.findOneBy({ email: Equal(email), password: Equal(password) })

        return user
    }

    async emailExists(email: string) {
        const repository = (await this.connection).getRepository(this.schema);
        const users = await repository.find({
            where: { email: Equal(email) }
        });

        const user = users[0] || null;
        if (user)
            return true;
        else
            return false;
    }
}