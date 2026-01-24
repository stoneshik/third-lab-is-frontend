const ACCESS_TOKEN_KEY = "accessToken";
const USER_ID_KEY = "userId";
const ROLES_KEY = "roles";

export enum ROLES {
    USER = 'ROLE_USER',
    ADMIN = 'ROLE_ADMIN',
}

export interface Credentials {
    accessToken: string;
    userId: number;
    roles: string[];
}

export const tokenService = {
    isEmpty(): boolean {
        return !localStorage.getItem(ACCESS_TOKEN_KEY) ||
               !localStorage.getItem(USER_ID_KEY) ||
               !localStorage.getItem(ROLES_KEY);
    },
    get(): Credentials | null {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const userId = localStorage.getItem(USER_ID_KEY);
        const roles = JSON.parse(localStorage.getItem(ROLES_KEY) || '[]');
        if (!accessToken || !userId || !roles) {
            return null;
        }
        return {
            accessToken,
            userId: Number.parseInt(userId),
            roles
        };
    },
    set(credentials: Credentials): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, credentials.accessToken);
        localStorage.setItem(USER_ID_KEY, credentials.userId.toString());
        localStorage.setItem(ROLES_KEY, JSON.stringify(credentials.roles));
    },
    remove(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(USER_ID_KEY);
        localStorage.removeItem(ROLES_KEY);
    }
};
