"use client";

import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  Heading01Icon,
  Heading02Icon,
  Heading03Icon,
  ListViewIcon,
  Sorting05Icon,
} from "@hugeicons/core-free-icons";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateJob, useDepartments } from "@/hooks/use-api";

export default function CreateNewJobPage() {
  const router = useRouter();
  const { data: deptData } = useDepartments();
  const createJob = useCreateJob();
  const departments = deptData?.data ?? [];

  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [isSalaryInfoIncluded, setIsSalaryInfoIncluded] = useState(true);
  const [salaryType, setSalaryType] = useState<"range" | "fixed">("range");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [title, setTitle] = useState("");
  const [employmentType, setEmploymentType] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [payFrequency, setPayFrequency] = useState("yearly");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [salaryFixed, setSalaryFixed] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleAddSkill = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = () => {
    if (!title.trim() || !departmentId || !employmentType) return;

    const salaryPayload = (() => {
      if (!isSalaryInfoIncluded) return {};
      if (salaryType === "fixed" && salaryFixed) {
        return { salaryType: "fixed" as const, currency, payFrequency, salaryFixed: Number(salaryFixed) };
      }
      if (salaryType === "range" && salaryMin && salaryMax) {
        return { salaryType: "range" as const, currency, payFrequency, salaryMin: Number(salaryMin), salaryMax: Number(salaryMax) };
      }
      return {};
    })();

    createJob.mutate(
      {
        title: title.trim(),
        departmentId,
        employmentType,
        location: location || undefined,
        description: description || undefined,
        skills: skills.length > 0 ? skills : undefined,
        ...salaryPayload,
      },
      {
        onSuccess: (res) => router.push(`/jobs/${res.data.id}`),
      }
    );
  };

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="px-14 py-10 pb-20 max-w-5xl">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <h1 className="text-[28px] font-medium text-slate-900 leading-none">
              Create New Job
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="job-active"
              defaultChecked
              checked={isActive}
              onCheckedChange={setIsActive}
              className="data-checked:bg-[var(--theme-color)] scale-110"
            />
            <Label
              htmlFor="job-active"
              className="text-sm font-medium text-slate-600 cursor-pointer pl-1"
            >
              Make This Job Active
            </Label>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">
              Job Title
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Senior Software Engineer - Backend"
              className="h-10! border-slate-200 shadow-none rounded-lg placeholder:text-slate-300"
            />
          </div>

          {/* Department and Employment Type */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-slate-700">
                Department
              </Label>
              <Select onValueChange={(val) => setDepartmentId(Number(val))}>
                <SelectTrigger className="w-full h-10! border-slate-200 shadow-none rounded-lg text-slate-500 focus:ring-0">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-lg border-slate-200">
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={String(dept.id)}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-slate-700">
                Employement Type
              </Label>
              <Select onValueChange={setEmploymentType}>
                <SelectTrigger className="w-full h-10! border-slate-200 shadow-none rounded-lg text-slate-500 focus:ring-0">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-lg border-slate-200">
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-slate-700">
              Skills
            </Label>
            <div className="min-h-10 p-1.5 flex flex-wrap gap-2 border border-slate-200 rounded-lg bg-white focus-within:border-[var(--theme-color)] transition-[border-color] duration-200">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="inline-flex items-center bg-[#F1F5F9] text-slate-700 font-medium px-2.5 py-1 gap-2 rounded-md transition-all hover:bg-slate-200"
                >
                  <span className="text-[13px] leading-none">{skill}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="flex items-center justify-center size-4.5 -mr-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-300/50 transition-all"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
                  </button>
                </div>
              ))}
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder={
                  skills.length === 0 ? "Type and press enter..." : ""
                }
                className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm px-1 placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-slate-700">
              Location
            </Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search"
              className="h-10! border-slate-200 shadow-none rounded-lg"
            />
          </div>

          {/* Job Description */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-slate-700">
              Job Description
            </Label>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-1.5 p-2 bg-[#F8FAFC]/50 border-b border-slate-200">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-slate-500 hover:text-slate-900"
                >
                  <HugeiconsIcon icon={TextBoldIcon} className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-slate-500 hover:text-slate-900"
                >
                  <HugeiconsIcon icon={TextItalicIcon} className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-slate-500 hover:text-slate-900"
                >
                  <HugeiconsIcon icon={TextUnderlineIcon} className="size-4" />
                </Button>
                <div className="w-[1px] h-4 bg-slate-200 mx-1" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-slate-500 hover:text-slate-900"
                >
                  <HugeiconsIcon icon={Heading01Icon} className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-slate-500 hover:text-slate-900"
                >
                  <HugeiconsIcon icon={Heading02Icon} className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-slate-500 hover:text-slate-900"
                >
                  <HugeiconsIcon icon={Heading03Icon} className="size-4" />
                </Button>
                <div className="w-[1px] h-4 bg-slate-200 mx-1" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-slate-500 hover:text-slate-900"
                >
                  <HugeiconsIcon icon={ListViewIcon} className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-slate-500 hover:text-slate-900"
                >
                  <HugeiconsIcon icon={Sorting05Icon} className="size-4" />
                </Button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[160px] p-4 text-sm focus:outline-none placeholder:text-slate-300"
                placeholder="Type here..."
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-10 space-y-5 mt-4">
            <h3 className="text-[17px] font-semibold text-slate-800">
              Salary Information
            </h3>

            <div className="space-y-7">
              <div className="flex items-center gap-10">
                <div className="flex items-center gap-3 shrink-0">
                  <Checkbox
                    id="salary-info"
                    checked={isSalaryInfoIncluded}
                    onCheckedChange={(checked) =>
                      setIsSalaryInfoIncluded(checked as boolean)
                    }
                    className="data-checked:bg-[var(--theme-color)] data-checked:border-[var(--theme-color)] size-4.5"
                  />
                  <Label
                    htmlFor="salary-info"
                    className="text-sm font-medium text-slate-600 cursor-pointer whitespace-nowrap"
                  >
                    Include Salary Information
                  </Label>
                </div>

                <RadioGroup
                  value={salaryType}
                  onValueChange={(val) =>
                    setSalaryType(val as "range" | "fixed")
                  }
                  className="flex items-center gap-10"
                >
                  <div className="flex items-center gap-2.5">
                    <RadioGroupItem
                      value="range"
                      id="range"
                      className="text-[var(--theme-color)] border-slate-300 data-checked:bg-[var(--theme-color)] data-checked:border-[var(--theme-color)] size-4.5"
                    />
                    <Label
                      htmlFor="range"
                      className="text-sm font-medium text-slate-600 cursor-pointer"
                    >
                      Salary Range
                    </Label>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <RadioGroupItem
                      value="fixed"
                      id="fixed"
                      className="text-[var(--theme-color)] border-slate-300 data-checked:bg-[var(--theme-color)] data-checked:border-[var(--theme-color)] size-4.5"
                    />
                    <Label
                      htmlFor="fixed"
                      className="text-sm font-medium text-slate-600 cursor-pointer"
                    >
                      Fixed Salary
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {isSalaryInfoIncluded && (
                <div className="space-y-7 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <Label className="text-sm font-semibold text-slate-700">
                        Currency
                      </Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="w-full h-10! border-slate-200 shadow-none rounded-lg text-slate-500 focus:ring-0">
                          <SelectValue placeholder="USD" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg shadow-lg border-slate-200">
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="LKR">LKR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2.5">
                      <Label className="text-sm font-semibold text-slate-700">
                        Paid Every
                      </Label>
                      <Select value={payFrequency} onValueChange={setPayFrequency}>
                        <SelectTrigger className="w-full h-10! border-slate-200 shadow-none rounded-lg text-slate-500 focus:ring-0">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg shadow-lg border-slate-200">
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {salaryType === "range" ? (
                    <div className="grid grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2.5">
                        <Label className="text-sm font-semibold text-slate-700">
                          Minimum Salary
                        </Label>
                        <Input
                          value={salaryMin}
                          onChange={(e) => setSalaryMin(e.target.value)}
                          placeholder="e.g. 50,000"
                          className="h-10! border-slate-200 shadow-none rounded-lg"
                        />
                      </div>
                      <div className="space-y-2.5">
                        <Label className="text-sm font-semibold text-slate-700">
                          Maximum Salary
                        </Label>
                        <Input
                          value={salaryMax}
                          onChange={(e) => setSalaryMax(e.target.value)}
                          placeholder="e.g. 80,000"
                          className="h-10! border-slate-200 shadow-none rounded-lg"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 pt-2">
                      <Label className="text-sm font-semibold text-slate-700">
                        Enter Fixed Salary
                      </Label>
                      <Input
                        value={salaryFixed}
                        onChange={(e) => setSalaryFixed(e.target.value)}
                        placeholder="e.g. 75,000"
                        className="h-10! border-slate-200 shadow-none rounded-lg"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="pt-10 flex items-center gap-4">
            <Button
              onClick={handleSubmit}
              className="text-white cursor-pointer rounded-lg h-10 px-10 min-w-[140px] font-medium shadow-none border-none"
              style={{ backgroundColor: "var(--theme-color)" }}
              disabled={!title || !departmentId || !employmentType || createJob.isPending}
            >
              {createJob.isPending && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
              {createJob.isPending ? "Saving…" : "Save Job"}
            </Button>
            <Link
              href="/jobs"
              className="flex items-center justify-center border border-slate-200 text-slate-600 rounded-lg h-10 px-6 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
