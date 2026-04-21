import { FetchOptions } from "./service-interfaces";

const url = process.env.API_URL;

const request = async (endpoint: string, options: FetchOptions = { method: 'GET' }) => {
    const { method, params, data, token } = options;

    let urlWithParams = `${url}/${endpoint}`;

    if(params)
        urlWithParams += `/${params}`;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if(token)
        headers["Authorization"] = `Bearer ${token}`;

    console.log('URL', urlWithParams)
    console.log('Method', method)
    console.log('Headers', headers)
    console.log('body', data)

    const res = await fetch(urlWithParams, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined
    });

    console.log('res:: ', res);
    console.log('--------------')

    if(!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    try {
        if(method == "POST")
            return await res.text();
        
        return await res.json();
    } catch (error) {
        console.log("Displaying Error from Service: " + error);
        return res;
    }
}

export const get = (endpoint: string, options?: FetchOptions) => {
    return request(endpoint, { method: 'GET', ...options });
}

export const post = (endpoint: string, options?: FetchOptions) => {
    return request(endpoint, { method: 'POST', ...options });
}

export const put = (endpoint: string, options?: FetchOptions) => {
    return request(endpoint, { method: 'PUT', ...options });
}

export const del = (endpoint: string, options?: FetchOptions) => {
    return request(endpoint, { method: 'DELETE', ...options });
}