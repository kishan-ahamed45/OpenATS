"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Briefcase01Icon,
  Location01Icon,
  Wallet01Icon,
  CloudUploadIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveCandidate } from "@/lib/candidate-store";

export default function JobApplicationPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+94");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const candidate = {
      id: "c" + Date.now(),
      name: `${firstName} ${lastName}`.trim(),
      status: "Screening",
      statusColor: "bg-[#FEF3F2] text-[#B42318]",
      role: "Exceptional Software Engineer",
      tags: "-",
      appliedOn: "Just now",
      email,
      phone: `${phoneCode} ${phoneNumber}`,
      linkedin: "-",
    };

    saveCandidate(candidate);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center pt-32 pb-12 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
          <div className="size-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="size-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Application Submitted!
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Thank you for applying to the Exceptional Software Engineer role. We
            are reviewing your application and will be in touch soon.
          </p>
          <Button
            className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-none"
            onClick={() => router.push("/jobs/j1")}
          >
            Back to Dashboard (Demo)
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[800px] mx-auto pt-16 pb-24 px-6 sm:px-8">
        <Link
          href="#"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mb-10 w-fit"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          <span>Back to jobs</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
          <h1 className="text-3xl sm:text-[32px] font-semibold text-slate-900 leading-tight">
            Exceptional Software Engineer
          </h1>
          <Button
            onClick={() => {
              document
                .getElementById("apply-form")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-[#F97316] hover:bg-[#EA580C] text-white px-8 h-10 rounded-[6px] shadow-none font-medium shrink-0 w-full sm:w-auto text-[15px]"
          >
            Apply
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-12 text-[14px] text-slate-500">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={Briefcase01Icon}
              className="size-[18px] text-slate-400"
            />
            <span className="font-medium">Full-time</span>
          </div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={Location01Icon}
              className="size-[18px] text-slate-400"
            />
            <span className="font-medium">Colombo, Sri Lanka</span>
          </div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={Wallet01Icon}
              className="size-[18px] text-slate-400"
            />
            <span className="font-medium">LKR 40,000 - 120,000/month</span>
          </div>
        </div>

        <div className="space-y-10 text-slate-600">
          <section className="space-y-3">
            <h3 className="text-[17px] font-semibold text-slate-900 tracking-tight">
              About WSO2
            </h3>
            <p className="leading-relaxed text-[15px]">
              WSO2 Is A European-Headquartered Technology Company Owned By EQT.
              Since 2005, We Have Served As A Critical Infrastructure Partner To
              The World&apos;s Largest Enterprises, Providing The Foundational
              Technologies Required To Connect Systems, Protect Digital
              Identities .
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-[17px] font-semibold text-slate-900 tracking-tight">
              Job Summary
            </h3>
            <p className="leading-relaxed text-[15px]">
              We&apos;re Looking For Top-Notch Software Engineers Who Would See
              Technical Glitches As An Enjoyable Challenge And Are Willing To
              Walk Extra Mile To See A Project Through To Completion.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-[17px] font-semibold text-slate-900 tracking-tight">
              Responsibilities & Duties
            </h3>
            <ul className="space-y-2">
              <li className="flex gap-3 text-[15px]">
                <span className="text-slate-400 mt-1.5 size-1.5 shrink-0 rounded-full bg-slate-300" />
                <span className="leading-relaxed">
                  Ideal Candidates Should Have Working Competency In The
                  Technology Domains, Programming Languages, And OOAD.
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-[17px] font-semibold text-slate-900 tracking-tight">
              Qualifications & Skills
            </h3>
            <ul className="space-y-2">
              <li className="flex gap-3 text-[15px]">
                <span className="text-slate-400 mt-1.5 size-1.5 shrink-0 rounded-full bg-slate-300" />
                <span className="leading-relaxed">
                  Fresh Graduates With BSc In Computer Science/Engineering Or
                  Equivalent Or With A Minimum Of 1-2 Years Industry Experience
                </span>
              </li>
            </ul>
          </section>
        </div>

        <div className="my-14 border-t border-slate-100" />

        <div id="apply-form">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8">
            Apply for this job
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label className="text-slate-700 text-[14px]">First Name</Label>
              <Input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-11 rounded-md border-slate-200 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#F97316]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 text-[14px]">Last Name</Label>
              <Input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-11 rounded-md border-slate-200 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#F97316]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 text-[14px]">Email</Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-md border-slate-200 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#F97316]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 text-[14px]">Phone</Label>
              <div className="flex gap-3">
                <Select
                  value={phoneCode}
                  onValueChange={(val) => setPhoneCode(val || "")}
                >
                  <SelectTrigger className="w-[100px] h-11! border-slate-200 shadow-none rounded-md focus:ring-0 focus:ring-offset-0 focus:border-[#F97316]">
                    <SelectValue placeholder="+94" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md border-slate-200 shadow-md min-w-[100px]">
                    <SelectItem value="+94">+94</SelectItem>
                    <SelectItem value="+1">+1</SelectItem>
                    <SelectItem value="+44">+44</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 h-11 rounded-md border-slate-200 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#F97316]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 text-[14px] flex items-center justify-between">
                Resume / CV
                <span className="text-slate-400 font-normal text-xs">
                  (Optional)
                </span>
              </Label>
              <div className="h-[120px] w-full rounded-xl border border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer text-slate-400 group">
                <HugeiconsIcon
                  icon={CloudUploadIcon}
                  className="size-6 group-hover:text-slate-500 transition-colors"
                />
                <span className="text-[13px] font-medium group-hover:text-slate-600 text-slate-500">
                  Click Or Drag File To This Area To Upload Your Resume
                </span>
              </div>
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                className="bg-[#F97316] hover:bg-[#EA580C] text-white px-8 h-12 rounded-[6px] shadow-none font-medium text-[15px]"
              >
                Submit Application
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-24 pt-8 text-center flex items-center justify-center gap-2 w-full text-slate-500 text-sm border-t border-slate-100">
          <span>Powered by</span>
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <div className="size-5 rounded-full bg-green-500 flex items-center justify-center">
              <div className="size-2.5 border-2 border-white rounded-full bg-transparent" />
            </div>
            OpenATS
          </div>
        </div>
      </div>
    </div>
  );
}
