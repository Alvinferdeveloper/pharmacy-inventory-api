import { RoleName } from "../../entities/Role.entity";

export interface LoginPayload {
    identification: string;
    sub: number;
    roles: RoleName[];
    mustChangePassword?: boolean;
}