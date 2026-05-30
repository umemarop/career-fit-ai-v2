import Link from "next/link";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 px-6 py-10 lg:grid-cols-2 lg:gap-12">
        <section className="hidden flex-col justify-center lg:flex">
          <Link href="/" className="mb-8 text-2xl font-bold tracking-tight">
            CareerFit AI
          </Link>

          <div className="max-w-md space-y-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              AI-powered career assistant
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950">
              Build a better job search system.
            </h1>

            <p className="text-lg leading-8 text-slate-600">
              Create your profile, upload your resume, analyze job descriptions,
              and track applications in one place.
            </p>

            <div className="grid gap-4 pt-4">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-slate-950">
                  Resume-based profile
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Extract useful profile information from your resume and keep
                  it organized.
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-slate-950">
                  Job fit analysis
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Compare your profile with job descriptions and get practical
                  preparation tips.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-sm">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
