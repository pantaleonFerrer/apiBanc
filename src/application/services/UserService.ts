import { UserHelper } from '../../infrastructure/helpers/UserHelper';
import { createHmac } from "crypto";
import { User } from "../../core/entities/User";
import { UserNotFound } from "../../errors/UserNotFound";
import jwt from 'jsonwebtoken'
import { EmailAlreadyExists } from "../../errors/EmailAlreadyExists";
import { MissingInformation } from '../../errors/MissingInformation';
import { Unauthorized } from "../../errors/Unauthorized";
import { v4 as uuidv4 } from 'uuid';
import { UserProvider } from '../../core/interfaces/UserProvider';


export class UserService implements UserProvider {

    constructor(private readonly helper: UserHelper) { }

    async getUserById(id: string): Promise<User> {

        const user = await this.helper.findById(id)

        if (!user) throw new UserNotFound(`An user with id ${id} was not found`)

        return user
    }

    async getUsers(): Promise<User[]> {

        const user = await this.helper.returnUsers()

        if (!user) throw new UserNotFound(`There are no users`)

        return user
    }

    async removeUserById(idToErase: string) {

        const user = await this.helper.findById(idToErase)

        if (!user) throw new UserNotFound(`An user with id ${idToErase} was not found`)

        await this.helper.remove(user)
    }

    async adminRemoveUserById(idToErase: string) {

        const user = await this.helper.findById(idToErase)

        if (!user) throw new UserNotFound(`An user with id ${idToErase} was not found`)

        await this.helper.remove(user)
    }

    async login(email: string, password: string): Promise<string> {
        const hashGenerator = createHmac('sha-512', process.env.PASSWORD_SECRET!);
        const hash = hashGenerator.update(password).digest('hex');

        const user = await this.helper.findByEmailAndPassword(email, hash);

        if (!user) {
            throw new UserNotFound(`An user with email ${email} was not found or password was wrong`);
        }

        const token = jwt.sign(
            {
                id: user.id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SECRET!
        );


        return token;
    }

    async create(email: string, name: string, password: string) {

        const id = uuidv4();
        if ((await this.helper.emailExists(email))) {
            throw new EmailAlreadyExists(`El email ${email} ya existe en la base de datos`)
        }
        if (password.trim().length < 3) {
            throw new MissingInformation("No s'ha introduit una contrasenya vàlida, ha de contenir almenys 3 caràcters que no siguin espais.");
        }

        const hash = createHmac('sha-512', process.env.PASSWORD_SECRET!);
        hash.update(password);
        const hashedPassword = hash.digest('hex');
        const user = User.create(id.toString(), name, email, hashedPassword);
        await this.helper.create(user);

    }

    async updateIsAdmin(id: string, isAdmin: boolean): Promise<void> {
        const user = await this.helper.findById(id)
        if (!user)
            throw new UserNotFound(`No s'ha trobat cap usuari amb l'id ${id}`)

        const updatedUser = user.updateIsAdmin(isAdmin)

        this.helper.update(Number(id), updatedUser)

    }

    async modifyUser(idToChange: string, email?: string, name?: string, password?: string) {
        const user = await this.helper.findById(idToChange)
        if (!user)
            throw new UserNotFound(`No s'ha trobat cap usuari amb l'id ${idToChange}`)
        if (email && (await this.helper.emailExists(email))) {
            throw new EmailAlreadyExists(`El email ${email} ya existe en la base de datos`)
        }
        if (password && (password.trim().length < 3)) {
            throw new MissingInformation("No s'ha introduit una contrasenya vàlida, ha de contenir almenys 3 caràcters que no siguin espais.");
        }
        if (password) {
            const hash = createHmac('sha-512', process.env.PASSWORD_SECRET!);
            hash.update(password);
            password = hash.digest('hex');
        }


        await this.helper.update(Number(idToChange), user.modify(name || user.name, email || user.email, password || user.password))
    }

    async modifySelfUser(id: string, idToChange: string, email?: string, name?: string, password?: string) {
        const user = await this.helper.findById(idToChange)
        if (!user)
            throw new UserNotFound(`No s'ha trobat cap usuari amb l'id ${idToChange}`)
        if (email && (await this.helper.emailExists(email))) {
            throw new EmailAlreadyExists(`El email ${email} ya existe en la base de datos`)
        }
        if (password && (password.trim().length < 3)) {
            throw new MissingInformation("No s'ha introduit una contrasenya vàlida, ha de contenir almenys 3 caràcters que no siguin espais.");
        }
        if (password) {
            const hash = createHmac('sha-512', process.env.PASSWORD_SECRET!);
            hash.update(password);
            password = hash.digest('hex');
        }

        if (id != idToChange) throw new Unauthorized("No tens permis per modificar aquest usuari");

        await this.helper.update(Number(idToChange), user.modify(name || user.name, email || user.email, password || user.password))


    }

}