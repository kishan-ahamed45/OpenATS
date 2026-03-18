import { NextResponse } from 'next/server';
import { asgardeo } from '@asgardeo/nextjs/server';
import { serverFetch } from '@/lib/auth-action';
import { assignAsgardeoRole } from '@/lib/asgardeo-roles';
import type { User } from '@/types';

async function getToken() {
    const client = await asgardeo();
    const sessionId = await client.getSessionId();
    if (!sessionId) throw new Error('Unauthorized');
    return client.getAccessToken(sessionId);
}

const BASE = process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL;

export async function GET() {
    try {
        const data = await serverFetch<{ data: User[] }>('/users');
        return NextResponse.json(data.data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const token = await getToken();
        const body = await req.json();
        const role = body.role ?? 'interviewer';

        // create user on asgardeo
        const scimRes = await fetch(`${BASE}/scim2/Users`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
                name: { givenName: body.firstName, familyName: body.lastName },
                userName: `DEFAULT/${body.userName}`,
                password: body.password,
                emails: [{ primary: true, value: body.email }],
                'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User': {
                    askPassword: body.askPassword ? 'true' : undefined,
                },
            }),
        });

        if (!scimRes.ok) {
            const err = await scimRes.json();
            return NextResponse.json(
                { error: err.detail ?? 'Failed to create user in Asgardeo' },
                { status: scimRes.status }
            );
        }

        const scimUser = await scimRes.json();

        await assignAsgardeoRole(token, scimUser.id, role);

        // create db record — no waiting for first login ( when user creating through the app)
        await serverFetch<{ data: unknown }>('/users', {
            method: 'POST',
            body: JSON.stringify({
                asgardeoUserId: scimUser.id,
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                role,
            }),
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}