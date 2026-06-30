import Link from "next/link";
import {
  Building2,
  Sparkles,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import RegisterForm from "@/components/shared/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff,#f8fafc)]">
        <Container>
          <div className="flex min-h-[calc(100vh-80px)] items-center justify-center py-10 sm:py-16">
            <div className="w-full max-w-md rounded-[1.75rem] border border-border bg-white p-5 shadow-2xl shadow-slate-200/70 sm:rounded-[2rem] sm:p-8">
              <div className="mb-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
                  <Building2 size={30} />
                </div>

                <div className="mt-5 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                  <Sparkles size={14} className="mr-2" />
                  Join PropertyFlow AI
                </div>

                <h1 className="mt-5 font-heading text-2xl font-bold sm:text-3xl">
                  Create Account
                </h1>

                <p className="mt-2 text-muted-foreground">
                  Start your smarter real estate journey.
                </p>
              </div>

              <RegisterForm />

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
