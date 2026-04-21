export interface Fetch {
    endpoint: string,
    data?: string
}

export interface FetchOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    params?: string | number;
    next?: { tags: string[] };
    data?: any;
    token?: string | null;
}