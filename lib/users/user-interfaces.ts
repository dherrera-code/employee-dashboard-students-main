export interface UserAccessRequest {
    email: string;
    password: string;
}

export interface UserAccessResponse {
    email: string;
    token: string;
}