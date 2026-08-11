export interface User {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt: string;
}
export declare function registerUser(email: string, name: string, passwordPlain: string): Promise<{
    token: string;
    user: Omit<User, 'passwordHash'>;
}>;
export declare function loginUser(email: string, passwordPlain: string): Promise<{
    token: string;
    user: Omit<User, 'passwordHash'>;
}>;
