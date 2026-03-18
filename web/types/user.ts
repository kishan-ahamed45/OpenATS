export interface AsgardeoUser {
    id: string;
    userName: string;
    displayName?: string;
    name?: { givenName?: string; familyName?: string };
    emails?: { value: string; primary?: boolean }[];
}

export interface InviteUserPayload {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password?: string;
    askPassword?: boolean; // true = send "set password" email
}

export interface UpdateUserPayload {
    firstName?: string;
    lastName?: string;
    email?: string;
}