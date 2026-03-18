import type { AsgardeoUser, InviteUserPayload, UpdateUserPayload } from '@/types/user';

export async function fetchUsers(): Promise<AsgardeoUser[]> {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
}

export async function inviteUser(payload: InviteUserPayload): Promise<AsgardeoUser> {
    const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to invite user');
    }
    return res.json();
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<AsgardeoUser> {
    const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to update user');
    }
    return res.json();
}

export async function deleteUser(id: string): Promise<void> {
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to delete user');
    }
}