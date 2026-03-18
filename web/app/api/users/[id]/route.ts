import { NextResponse } from 'next/server';
import { asgardeo } from '@asgardeo/nextjs/server';

async function getToken() {
    const client = await asgardeo();
    const sessionId = await client.getSessionId();
    if (!sessionId) throw new Error('Unauthorized');
    return client.getAccessToken(sessionId);
}

const BASE = process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL;

// GET /api/users/[id]
export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const token = await getToken();
        const res = await fetch(`${BASE}/scim2/Users/${params.id}`, {
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: res.status });
        return NextResponse.json(await res.json());
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 401 });
    }
}

// PATCH /api/users/[id] — update name/email
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const token = await getToken();
        const body = await req.json();

        const operations: any[] = [];
        if (body.firstName !== undefined)
            operations.push({ op: 'replace', path: 'name.givenName', value: body.firstName });
        if (body.lastName !== undefined)
            operations.push({ op: 'replace', path: 'name.familyName', value: body.lastName });
        if (body.email !== undefined)
            operations.push({ op: 'replace', path: 'emails[primary eq true].value', value: body.email });

        const scimPayload = {
            schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
            Operations: operations,
        };

        const res = await fetch(`${BASE}/scim2/Users/${params.id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(scimPayload),
        });

        if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: res.status });
        // PATCH returns 200 with updated user or 204 with no body
        const text = await res.text();
        return NextResponse.json(text ? JSON.parse(text) : { success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 401 });
    }
}

// DELETE /api/users/[id]
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        const token = await getToken();
        const res = await fetch(`${BASE}/scim2/Users/${params.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: res.status });
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 401 });
    }
}