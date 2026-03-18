import { NextResponse } from 'next/server';
import { asgardeo } from '@asgardeo/nextjs/server';

async function getToken() {
    const client = await asgardeo();
    const sessionId = await client.getSessionId();
    if (!sessionId) throw new Error('Unauthorized');
    return client.getAccessToken(sessionId);
}

const BASE = process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL;

// GET /api/users — list all users
export async function GET() {
    try {
        const token = await getToken();
        const url = `${process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL}/scim2/Users`;

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        });

        const body = await res.text();
        // console.log('Asgardeo status:', res.status);
        // console.log('Asgardeo body:', body);

        if (!res.ok) return NextResponse.json({ error: body }, { status: res.status });
        return NextResponse.json(JSON.parse(body).Resources ?? []);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 401 });
    }
}

// POST /api/users — invite/create a new user
export async function POST(req: Request) {
    try {
        const token = await getToken();
        const body = await req.json();

        const scimPayload = {
            schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
            name: {
                givenName: body.firstName,
                familyName: body.lastName,
            },
            userName: body.userName,
            password: body.password,
            emails: [{ primary: true, value: body.email }],
            'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User': {
                askPassword: body.askPassword ? 'true' : undefined,
            },
        };

        const res = await fetch(`${BASE}/scim2/Users`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(scimPayload),
        });

        if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: res.status });
        return NextResponse.json(await res.json(), { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 401 });
    }
}