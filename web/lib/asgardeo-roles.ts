const BASE = process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL;

function getRoleId(role: string): string | null {
    switch (role) {
        case 'super_admin': return process.env.ASGARDEO_SUPER_ADMIN_ROLE_ID!;
        case 'hiring_manager': return process.env.ASGARDEO_HIRING_MANAGER_ROLE_ID!;
        case 'interviewer': return process.env.ASGARDEO_INTERVIEWER_ROLE_ID!;
        default: return null;
    }
}

export async function assignAsgardeoRole(token: string, asgardeoUserId: string, role: string) {
    const roleId = getRoleId(role);
    if (!roleId) return;

    const res = await fetch(`${BASE}/scim2/v2/Roles/${roleId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
            Operations: [{ op: 'add', path: 'users', value: [{ value: asgardeoUserId }] }],
        }),
    });

    if (!res.ok) throw new Error(`Failed to assign role: ${await res.text()}`);
}

export async function removeAsgardeoRole(token: string, asgardeoUserId: string, role: string) {
    const roleId = getRoleId(role);
    if (!roleId) return;

    const res = await fetch(`${BASE}/scim2/v2/Roles/${roleId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
            Operations: [{ op: 'remove', path: 'users', value: [{ value: asgardeoUserId }] }],
        }),
    });

    if (!res.ok) throw new Error(`Failed to remove role: ${await res.text()}`);
}