import { NextRequest, NextResponse } from 'next/server';
import { setTokenCookie } from '@/lib/authApi';

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const { token } = await response.json();
        const res = NextResponse.json({ message: 'Signup successful' });
        setTokenCookie(token);
        return res;
    } else {
        const error = await response.json();
        return NextResponse.json(error, { status: response.status });
    }
}
