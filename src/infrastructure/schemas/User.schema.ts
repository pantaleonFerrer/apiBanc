import { EntitySchema } from "typeorm";
import { User } from "../../core/entities/User";


export const userSchema = new EntitySchema<User>({
    name: 'User',
    target: User,
    tableName: 'user',
    columns: {
        id: {
            type: String,
            primary: true
        },
        name: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    }
})