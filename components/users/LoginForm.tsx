'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAction } from '@/lib/users/user-actions';

const LoginForm = () => {
    const { push } = useRouter();

    const [user, setUser] = useState({ email: "", password: "" });
    const [loginError, setLoginError] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);

    const inputsFilled = user.email !== "" && user.password !== "";

    const changeUser = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [event.target.id]: event.target.value,
        });
        console.log(loginError);
        if (loginError) {
            setLoginError(false);
        }
    };

    const handleLogin = async () => {
        setLoggingIn(true);
        try {
            const result = await loginAction(user);
            console.log(result);
            if(result.success)
                push("/employees");
            else{
                setLoginError(true);
            }
        } catch {
            setLoginError(true);
        }
        setLoggingIn(false);
    };


    return (
        <>
            <div>
                <div className='mb-2 block'>
                    <Label
                        htmlFor='email'
                        className={loginError ? "text-red-500" : ""}
                    >
                        Your email
                    </Label>
                </div>
                <Input
                    id='email'
                    type='email'
                    placeholder='name@example.com'
                    required
                    onChange={changeUser}
                    color={loginError ? 'failure' : ''}
                    className={loginError ? "border-red-500" : ""}
                />
                {
                    loginError && (
                        <p className="text-red-500 text-sm"><span className='font-medium'>Oops!</span> Email or password may be incorrect.</p>
                    )
                }
            </div>
            <div>
                <div className='mb-2 block'>
                    <Label htmlFor="password" className={loginError ? "text-red-500" : ""}>
                        Your password
                    </Label>
                </div>
                <Input
                    id="password"
                    type="password"
                    required
                    onChange={changeUser}
                    className={loginError ? "border-red-500" : ""}
                />
                {
                    loginError && (
                        <p className="text-red-500 text-sm"><span className='font-medium'>Oops!</span> Email or password may be incorrect.</p>
                    )
                }
            </div>
            <Button onClick={handleLogin} disabled={!inputsFilled || loggingIn}>
                {loggingIn ? (
                    <>
                        <AiOutlineLoading className="h-6 w-6 animate-spin mr-3" />
                        Logging in...
                    </>
                ) : (
                    "Login"
                )}
            </Button>
            <div className="flex w-75">
                <p>Don't have an account?</p>
                <Link href="/create-account" className="ml-2 text-blue-700 hover:underline">
                    Create one here :&#41;
                </Link>
            </div>
        </>
    )
}

export default LoginForm