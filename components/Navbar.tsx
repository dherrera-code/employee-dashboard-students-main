'use client'

import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { logoutAction } from '@/lib/users/user-actions';

const NavbarComponent = ({ email }: { email: string }) => {

    const { push } = useRouter();

    const name = email.split('@')[0]

    const logout = async () => {
        const result = await logoutAction();

        if (result.success)
            push('/login');
    }

    return (
        <div className="absolute top-0 w-full flex justify-between items-center p-4">
            <h1 className="text-xl font-bold">Employee Tracker</h1>
            <DropdownMenu>
                <DropdownMenuTrigger className="border px-4 py-2 rounded-md hover:cursor-pointer">{name}</DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem className='hover:cursor-pointer' onClick={logout}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default NavbarComponent