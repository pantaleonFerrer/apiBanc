import { User } from "../entities/User";

export interface UserProvider {
    getUsers(): Promise<User[]>;
}