"use client";

import { useState, useRef } from "react";
import {
  PencilEdit01Icon,
  Delete02Icon,
  ImageUploadIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import Image from "next/image";

import type { Company } from "@/types";
import {
  useCompany,
  useUpsertCompany,
  useDepartments,
  useCreateDepartment,
  useDeleteDepartment,
  useUpdateDepartment,
} from "@/hooks/use-api";

const inputCls =
  "h-10 bg-white border-slate-200 rounded-lg shadow-none text-sm placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-slate-400 transition-colors";

function CompanyForm({ company }: { company: Company }) {
  const upsertCompany = useUpsertCompany();
  const fileRef = useRef<HTMLInputElement>(null);

  const [logo, setLogo] = useState<string | null>(company.logoUrl ?? null);
  const [companyName, setCompanyName] = useState(company.name ?? "");
  const [email, setEmail] = useState(company.email ?? "");
  const [website, setWebsite] = useState(company.website ?? "");
  const [phone, setPhone] = useState(company.phone ?? "");
  const [address, setAddress] = useState(company.address ?? "");

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="border border-slate-200 rounded-xl p-6">
        <p className="text-[13px] font-semibold text-slate-700 mb-4">
          Company Logo
        </p>
        <div className="flex items-start gap-5">
          <div
            className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50 shrink-0 overflow-hidden cursor-pointer hover:border-slate-300 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {logo ? (
              <Image
                src={logo}
                alt="Logo"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <HugeiconsIcon
                icon={ImageUploadIcon}
                className="size-7 text-slate-300"
                strokeWidth={1.5}
              />
            )}
          </div>

          <div className="space-y-2.5 pt-1">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handleLogo}
            />
            <Button
              onClick={() => fileRef.current?.click()}
              className="h-9 px-5 rounded-lg text-white shadow-none border-none text-[13px] font-medium"
              style={{ backgroundColor: "var(--theme-color)" }}
            >
              Upload Logo
            </Button>
            <p className="text-[12px] text-slate-400">
              PNG, JPG Up To 5MB. Recommended Size: 200x200px
            </p>
          </div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl p-6 space-y-5">
        <p className="text-[13px] font-semibold text-slate-700">
          Company Information
        </p>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <Label className="text-[13px] font-medium text-slate-600 mb-1.5 block">
              Company Name
            </Label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <Label className="text-[13px] font-medium text-slate-600 mb-1.5 block">
              Email
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <Label className="text-[13px] font-medium text-slate-600 mb-1.5 block">
              Website
            </Label>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <Label className="text-[13px] font-medium text-slate-600 mb-1.5 block">
              Phone
            </Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <Label className="text-[13px] font-medium text-slate-600 mb-1.5 block">
            Address
          </Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={inputCls}
          />
        </div>

        <Button
          className="w-full h-11 text-white rounded-lg shadow-none border-none text-[14px] font-semibold transition-all active:scale-[0.99]"
          style={{ backgroundColor: "var(--theme-color)" }}
          onClick={() =>
            upsertCompany.mutate({
              name: companyName,
              email,
              website: website || null,
              phone: phone || null,
              address: address || null,
            })
          }
          disabled={upsertCompany.isPending}
        >
          {upsertCompany.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </>
  );
}

export default function SettingsGeneralPage() {
  const { data: companyData } = useCompany();
  const { data: deptData } = useDepartments();
  const createDept = useCreateDepartment();
  const updateDept = useUpdateDepartment();
  const deleteDept = useDeleteDepartment();

  const company = companyData?.data;
  const departments = deptData?.data ?? [];

  const [newDept, setNewDept] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingVal, setEditingVal] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleAddDept = () => {
    if (!newDept.trim()) return;
    createDept.mutate({ name: newDept.trim() }, {
      onSuccess: () => setNewDept(""),
    });
  };

  const handleSaveDept = (id: number) => {
    if (!editingVal.trim()) return;
    updateDept.mutate({ id, name: editingVal.trim() }, {
      onSuccess: () => setEditingId(null),
    });
  };

  const handleDeleteDept = (id: number) => {
    deleteDept.mutate(id, { onSuccess: () => setDeleteId(null) });
  };

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="px-8 py-6 border-b border-slate-100">
        <h1 className="text-[22px] font-semibold text-slate-900 leading-none">
          Company General Settings
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
        {company ? (
          <CompanyForm key={company.id} company={company} />
        ) : (
          <>
            <div className="border border-slate-200 rounded-xl p-6 h-36 animate-pulse bg-slate-50" />
            <div className="border border-slate-200 rounded-xl p-6 h-64 animate-pulse bg-slate-50" />
          </>
        )}

        <div className="border border-slate-200 rounded-xl p-6 space-y-4">
          <p className="text-[13px] font-semibold text-slate-700">
            Departments
          </p>

          <div className="flex items-center gap-3">
            <Input
              placeholder="Add New Department"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddDept()}
              className="flex-1 h-10 bg-white border-slate-200 rounded-lg shadow-none text-sm placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-slate-400 transition-colors"
            />
            <Button
              onClick={handleAddDept}
              disabled={createDept.isPending}
              className="h-10 px-5 text-white rounded-lg shadow-none border-none text-[13px] font-semibold whitespace-nowrap"
              style={{ backgroundColor: "var(--theme-color)" }}
            >
              {createDept.isPending ? "Adding…" : "Add Department"}
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="flex items-center justify-between py-3.5 first:pt-1"
              >
                {editingId === dept.id ? (
                  <Input
                    autoFocus
                    value={editingVal}
                    onChange={(e) => setEditingVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveDept(dept.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    onBlur={() => handleSaveDept(dept.id)}
                    className="flex-1 mr-4 h-9 bg-white border-slate-200 rounded-lg shadow-none text-sm focus-visible:ring-0 focus-visible:border-slate-400"
                  />
                ) : (
                  <span className="text-[14px] text-slate-700">{dept.name}</span>
                )}

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      setEditingId(dept.id);
                      setEditingVal(dept.name);
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-[var(--theme-color)] hover:bg-[var(--theme-color)]/5 transition-colors"
                    title="Edit"
                  >
                    <HugeiconsIcon
                      icon={PencilEdit01Icon}
                      className="size-4"
                      strokeWidth={2}
                    />
                  </button>
                  <button
                    onClick={() => setDeleteId(dept.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <HugeiconsIcon
                      icon={Delete02Icon}
                      className="size-4"
                      strokeWidth={2}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="max-w-sm rounded-2xl border-slate-200 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[17px] font-semibold text-slate-900">
              Delete Department?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-slate-500 leading-relaxed">
              <strong className="text-slate-700">
                {deleteId !== null
                  ? (departments.find((d) => d.id === deleteId)?.name ?? "")
                  : ""}
              </strong>{" "}
              will be permanently removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-9 px-5 rounded-lg border-slate-200 text-slate-600 text-[13px] font-medium shadow-none hover:bg-slate-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId !== null) handleDeleteDept(deleteId);
              }}
              disabled={deleteDept.isPending}
              className="h-9 px-5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[13px] font-medium shadow-none border-none"
            >
              {deleteDept.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
