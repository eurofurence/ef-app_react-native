export type TokenRegSysRequest = {
    RegNo: number;
    Username: string;
    Password: string;
    AccessToken?: string;
};

export type TokenRegSysResponse = {
    Uid: string;
    Username: string;
    Token: string;
    TokenValidUntil: string;
};

export type TokenWhoAmIResponse = TokenRegSysResponse;
