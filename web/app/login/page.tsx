"use client";

import Image from "next/image";
import { SignedIn, SignedOut, SignInButton } from "@asgardeo/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function RedirectToDashboard() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return null;
}

export default function LoginPage() {
  return (
    <>
      <SignedIn>
        <RedirectToDashboard />
      </SignedIn>

      <SignedOut>
        <div className="grid min-h-svh lg:grid-cols-2">
          <div className="flex flex-col gap-4 p-6 md:p-8 bg-white">
            <div className="flex flex-1 items-center justify-center pb-16">
              <div className="w-full max-w-sm flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 500,
                      color: "#b0bac5",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    Powered by
                  </p>
                  <Image
                    src="/asgardeo-by-wso2.svg"
                    alt="Asgardeo by WSO2"
                    width={148}
                    height={38}
                    priority
                    style={{ display: "block" }}
                  />
                </div>

                <div
                  style={{ width: "100%", height: 1, background: "#f1f5f9" }}
                />

                <div style={{ textAlign: "center" }}>
                  <h1
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: 22,
                      fontWeight: 600,
                      color: "#0f172a",
                      letterSpacing: "-0.3px",
                      lineHeight: 1.3,
                    }}
                  >
                    Sign in to OpenATS
                  </h1>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "#8896a5",
                      lineHeight: 1.6,
                    }}
                  >
                    Securely authenticated via your Asgardeo organization.
                  </p>
                </div>

                <SignInButton
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    width: "100%",
                    height: 40,
                    background:
                      "linear-gradient(135deg, #FF7300 0%, #ff8c1a 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    letterSpacing: "0px",
                    transition: "all 0.2s ease",
                  }}
                />

                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    color: "#b0bac5",
                    textAlign: "center",
                    lineHeight: 1.7,
                  }}
                >
                  By signing in, you agree to Asgardeo&apos;s{" "}
                  <a
                    href="https://wso2.com/licenses/wso2-update/2020-v2"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#FF7300", textDecoration: "none" }}
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://wso2.com/privacy-policy"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#FF7300", textDecoration: "none" }}
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted relative hidden lg:block">
            <Image
              src="/login.avif"
              alt="Login visual"
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
              priority
            />
          </div>
        </div>
      </SignedOut>
    </>
  );
}
