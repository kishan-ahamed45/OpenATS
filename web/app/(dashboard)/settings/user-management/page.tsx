"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, Eye, EyeOff, RefreshCw, Search } from "lucide-react";
import {
  PencilEdit01Icon,
  Delete02Icon,
  Add01Icon,
  MailSend01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { AsgardeoUser, InviteUserPayload, UpdateUserPayload } from "@/types/user";
import { deleteUser, fetchUsers, inviteUser, updateUser } from "@/lib/users-api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const inputCls =
  "h-10 bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 shadow-none rounded-lg text-sm placeholder:text-slate-300 dark:placeholder:text-neutral-600 transition-[border-color] duration-200 ease-in-out focus-visible:ring-0 focus-visible:border-[var(--theme-color)]";

function getDisplayName(u: AsgardeoUser) {
  return (
    [u.name?.givenName, u.name?.familyName].filter(Boolean).join(" ") ||
    u.displayName ||
    u.userName
  );
}

function getEmail(u: AsgardeoUser) {
  return u.emails?.find((e) => e.primary)?.value ?? u.emails?.[0]?.value ?? "—";
}

type PasswordMethod = "invite" | "set";

function generatePassword(length = 12) {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{};:,.?";
  const all = lower + upper + numbers + symbols;

  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
  const chars = [pick(lower), pick(upper), pick(numbers), pick(symbols)];
  for (let i = chars.length; i < length; i++) chars.push(pick(all));
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

function passwordChecks(pw: string) {
  return {
    length: pw.length >= 8 && pw.length <= 64,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /\d/.test(pw),
  };
}

async function copyToClipboard(text: string) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Password copied");
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      toast.success("Password copied");
    } catch {
      toast.error("Copy failed");
    }
  }
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<AsgardeoUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [editUser, setEditUser] = useState<AsgardeoUser | null>(null);
  const [editForm, setEditForm] = useState<UpdateUserPayload>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AsgardeoUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [passwordMethod, setPasswordMethod] = useState<PasswordMethod>("invite");
  const [createForm, setCreateForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const list = await fetchUsers();
      setUsers(list);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const name = getDisplayName(u).toLowerCase();
      const email = getEmail(u).toLowerCase();
      const username = (u.userName ?? "").toLowerCase();
      return name.includes(q) || email.includes(q) || username.includes(q);
    });
  }, [query, users]);

  const openEdit = (u: AsgardeoUser) => {
    setEditUser(u);
    setEditForm({
      firstName: u.name?.givenName ?? "",
      lastName: u.name?.familyName ?? "",
      email: u.emails?.[0]?.value ?? "",
    });
  };

  const handleSave = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      await updateUser(editUser.id, editForm);
      toast.success("User updated");
      setEditUser(null);
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUser(deleteTarget.id);
      toast.success("User removed");
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const openCreate = () => {
    setPasswordMethod("invite");
    setShowPassword(false);
    setCreateForm({ email: "", firstName: "", lastName: "", password: "" });
    setCreateOpen(true);
  };

  const submitCreate = async () => {
    const email = createForm.email.trim();
    const firstName = createForm.firstName.trim();
    const lastName = createForm.lastName.trim();
    const password = createForm.password;

    if (!email || !firstName) {
      toast.error("Email and first name are required.");
      return;
    }

    if (passwordMethod === "set") {
      const c = passwordChecks(password);
      if (!password) {
        toast.error("Password is required.");
        return;
      }
      if (!c.length) {
        toast.error("Password must be between 8 and 64 characters.");
        return;
      }
      if (!c.upper || !c.lower || !c.number) {
        toast.error("Password must include upper, lower and a number.");
        return;
      }
    }

    const payload: InviteUserPayload = {
      email,
      userName: email,
      firstName,
      lastName,
      askPassword: passwordMethod === "invite",
      ...(passwordMethod === "set" ? { password } : {}),
    };

    setCreating(true);
    try {
      await inviteUser(payload);
      toast.success(passwordMethod === "invite" ? "Invitation sent" : "User created");
      setCreateOpen(false);
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Request failed");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-white dark:bg-neutral-950">
      <div className="px-8 py-4 flex items-center justify-between">
        <h1 className="text-[28px] font-medium text-slate-900 dark:text-neutral-100 leading-none">
          User Management
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-10 px-3 rounded-lg bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 shadow-none"
            onClick={() => load()}
            disabled={loading}
            title="Refresh"
          >
            <RefreshCw className="size-4" />
          </Button>
          <Button
            className="h-10 px-4 gap-2 text-sm shadow-none border-none text-white rounded-lg"
            style={{ backgroundColor: "var(--theme-color)" }}
            onClick={openCreate}
          >
            <HugeiconsIcon icon={Add01Icon} className="size-4" strokeWidth={2.5} />
            <span>Create User</span>
          </Button>
        </div>
      </div>

      <div className="border-y border-slate-200 dark:border-neutral-800 px-8 py-3.5 flex items-center gap-4">
        <div className="relative w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-300 pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className={"pl-11 h-10! " + inputCls}
          />
        </div>
        <Button
          variant="ghost"
          onClick={() => setQuery("")}
          className="text-slate-600 dark:text-neutral-400 font-medium text-sm h-10 px-4 hover:bg-transparent hover:text-slate-900 dark:hover:text-neutral-100 border-none"
          disabled={!query.trim()}
        >
          Clear
        </Button>
      </div>

      <div className="px-8 py-6">
        <div className="border border-slate-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-transparent">
                <TableHead className="h-13 px-8 font-semibold text-slate-900 dark:text-neutral-100 text-sm">
                  Name
                </TableHead>
                <TableHead className="h-13 px-8 font-semibold text-slate-900 dark:text-neutral-100 text-sm">
                  Email
                </TableHead>
                <TableHead className="h-13 px-8 font-semibold text-slate-900 dark:text-neutral-100 text-sm">
                  Username
                </TableHead>
                <TableHead className="h-13 px-4 w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-400 text-sm">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-400 text-sm">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((u) => (
                  <TableRow
                    key={u.id}
                    className="border-b border-slate-200 dark:border-neutral-800 last:border-0 font-medium"
                  >
                    <TableCell className="h-13 px-8 py-0 text-slate-900 dark:text-neutral-100">
                      {getDisplayName(u)}
                    </TableCell>
                    <TableCell className="h-13 px-8 py-0 text-slate-600 dark:text-neutral-400 font-normal">
                      {getEmail(u)}
                    </TableCell>
                    <TableCell className="h-13 px-8 py-0 text-slate-600 dark:text-neutral-400 font-normal">
                      {u.userName}
                    </TableCell>
                    <TableCell className="h-13 px-4 py-0">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(u)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                          title="Edit"
                        >
                          <HugeiconsIcon icon={PencilEdit01Icon} className="size-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl rounded-xl border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl px-10 py-5 gap-4">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold text-slate-900 dark:text-neutral-100">
              Create User
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-[13px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5 block">
                Email *
              </Label>
              <Input
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="Enter the email address"
                className={inputCls}
              />
            </div>

            <div className="col-span-1 sm:col-span-1">
              <Label className="text-[13px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5 block">
                First name *
              </Label>
              <Input
                value={createForm.firstName}
                onChange={(e) => setCreateForm((f) => ({ ...f, firstName: e.target.value }))}
                placeholder="Enter the first name"
                className={inputCls}
              />
            </div>
            <div className="col-span-1 sm:col-span-1">
              <Label className="text-[13px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5 block">
                Last name
              </Label>
              <Input
                value={createForm.lastName}
                onChange={(e) => setCreateForm((f) => ({ ...f, lastName: e.target.value }))}
                placeholder="Enter the last name"
                className={inputCls}
              />
            </div>

            <div className="col-span-2 pt-0.5">
              <p className="text-[13px] font-medium text-slate-600 dark:text-neutral-400 mb-3">
                Select the method to set the user password
              </p>

              <RadioGroup
                value={passwordMethod}
                onValueChange={(v) => setPasswordMethod(v as PasswordMethod)}
                className="gap-2"
              >
                <label
                  htmlFor="pw-method-invite"
                  className={
                    "flex items-start gap-3 rounded-lg border px-4 py-2.5 cursor-pointer transition-colors " +
                    (passwordMethod === "invite"
                      ? "border-[var(--theme-color)] bg-[var(--theme-color)]/5"
                      : "border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-slate-50 dark:hover:bg-neutral-800/40")
                  }
                >
                  <RadioGroupItem id="pw-method-invite" value="invite" className="mt-0.5" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-slate-800 dark:text-neutral-200">
                      <HugeiconsIcon icon={MailSend01Icon} className="size-4 text-slate-500 dark:text-neutral-400" strokeWidth={2} />
                      Invite the user to set their own password
                    </div>
                    <p className="text-[12px] text-slate-500 dark:text-neutral-500 mt-0.5 leading-relaxed">
                      An email with a confirmation link will be sent to the provided email address.
                    </p>
                  </div>
                </label>

                <label
                  htmlFor="pw-method-set"
                  className={
                    "flex items-start gap-3 rounded-lg border px-4 py-2.5 cursor-pointer transition-colors " +
                    (passwordMethod === "set"
                      ? "border-[var(--theme-color)] bg-[var(--theme-color)]/5"
                      : "border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-slate-50 dark:hover:bg-neutral-800/40")
                  }
                >
                  <RadioGroupItem id="pw-method-set" value="set" className="mt-0.5" />
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-slate-800 dark:text-neutral-200">
                      Set a password for the user
                    </div>
                    <p className="text-[12px] text-slate-500 dark:text-neutral-500 mt-0.5 leading-relaxed">
                      Set a temporary password now (user can change it later).
                    </p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {passwordMethod === "set" ? (
              <div className="col-span-2">
                <Label className="text-[13px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5 block">
                  Password *
                </Label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={createForm.password}
                      onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                      placeholder="Enter the password"
                      className={inputCls + " pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300"
                      title={showPassword ? "Hide" : "Show"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 px-4 rounded-lg bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 shadow-none flex-1 sm:flex-none"
                      onClick={() =>
                        setCreateForm((f) => ({ ...f, password: generatePassword(12) }))
                      }
                    >
                      Generate
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 px-3 rounded-lg bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 shadow-none flex-1 sm:flex-none"
                      onClick={() => copyToClipboard(createForm.password)}
                      disabled={!createForm.password}
                      title="Copy password"
                    >
                      <Copy className="size-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>

                {(() => {
                  const c = passwordChecks(createForm.password);
                  const item = (ok: boolean, label: string) => (
                    <div className="flex items-center gap-2 text-[12px] mt-2">
                      <span
                        className={
                          "inline-block size-2 rounded-full " +
                          (ok ? "bg-[var(--theme-color)]" : "bg-slate-200 dark:bg-neutral-800")
                        }
                      />
                      <span className={ok ? "text-slate-700 dark:text-neutral-300" : "text-slate-500 dark:text-neutral-500"}>
                        {label}
                      </span>
                    </div>
                  );
                  return (
                    <div className="mt-2">
                      {item(c.length, "Must be between 8 and 64 characters")}
                      {item(c.upper, "At least 1 uppercase and 1 lowercase letters")}
                      {item(c.number, "At least 1 number(s)")}
                    </div>
                  );
                })()}
              </div>
            ) : null}
          </div>

          <DialogFooter className="gap-2 sm:gap-2 flex flex-col-reverse sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="h-10 px-4 text-sm shadow-none border-none text-slate-600 dark:text-neutral-400 hover:bg-transparent hover:text-slate-900 dark:hover:text-neutral-100 w-full sm:w-auto"
                disabled={creating}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={submitCreate}
              disabled={creating}
              className="h-10 px-6 rounded-lg text-white font-semibold text-sm shadow-none border-none w-full sm:w-auto"
              style={{ backgroundColor: "var(--theme-color)" }}
            >
              {creating ? "Finishing…" : "Finish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="max-w-lg rounded-xl border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-[17px] font-semibold text-slate-900 dark:text-neutral-100">
              Edit user
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <Label className="text-[13px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5 block">
                First name
              </Label>
              <Input
                value={editForm.firstName ?? ""}
                onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div className="col-span-1">
              <Label className="text-[13px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5 block">
                Last name
              </Label>
              <Input
                value={editForm.lastName ?? ""}
                onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div className="col-span-2">
              <Label className="text-[13px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5 block">
                Email
              </Label>
              <Input
                type="email"
                value={editForm.email ?? ""}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                className={inputCls}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="h-9 px-5 rounded-lg border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 text-[13px] font-medium shadow-none hover:bg-slate-50 dark:hover:bg-neutral-800"
                disabled={saving}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="h-9 px-5 rounded-lg text-white text-[13px] font-semibold shadow-none border-none"
              style={{ backgroundColor: "var(--theme-color)" }}
            >
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="max-w-sm rounded-xl border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[17px] font-semibold text-slate-900 dark:text-neutral-100">
              Remove user?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-slate-500 dark:text-neutral-400 leading-relaxed">
              {deleteTarget ? (
                <>
                  Are you sure you want to remove{" "}
                  <strong className="text-slate-700 dark:text-neutral-200">
                    {getDisplayName(deleteTarget)}
                  </strong>
                  ?
                </>
              ) : (
                "Are you sure?"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-9 px-5 rounded-lg border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 text-[13px] font-medium shadow-none hover:bg-slate-50 dark:hover:bg-neutral-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="h-9 px-5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[13px] font-medium shadow-none border-none"
            >
              {deleting ? "Removing…" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

