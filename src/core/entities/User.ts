export class User {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly email: string,
        readonly password: string,
        readonly isAdmin: boolean
    ) { }

    static create(
        id: string,
        name: string,
        email: string,
        password: string
    ) {
        return new User(id, name, email, password, false)
    }

    modify(
        name: string,
        email: string,
        password: string
    ) {
        return new User(this.id, name, email, password, this.isAdmin)
    }

    updateIsAdmin(isAdmin: boolean) {
        return new User(this.id, this.name, this.email, this.password, isAdmin)
    }

}