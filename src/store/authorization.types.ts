export type TokenRegSysRequest = {
    RegNo: string;
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
