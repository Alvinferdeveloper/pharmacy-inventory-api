import { RoleName } from "../../entities/Role.entity";

export interface LoginPayload {
    username: string;
    sub: number;
    roles: RoleName[];
}