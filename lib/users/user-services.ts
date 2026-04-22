'use server'

import { hasCookie, saveCookie } from "../shared/cookies/cookies";
import { UserAccessRequest, UserAccessResponse } from "./user-interfaces";
import { post } from "../shared/services/services";

export const addUser = async (user: UserAccessRequest) => {
    return await post('User/CreateUser', { data: user });
}

export const login = async (user: UserAccessRequest) => {
    const value: UserAccessResponse = await post('User/Login', { data: user });
    //console.log("value", value);
    
    await saveCookie({ name: 'Token', value: value.token });
    await saveCookie({ name: 'Email', value: value.email });

    return await hasCookie('Email');
}