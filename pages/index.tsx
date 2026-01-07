import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Landing() {
  const [email, setEmail] = useState("");

  return (
    <>
      <Head>
        <title>ExpenseAI — AI-Powered Expense Management & Smart Micro-Savings</title>
        <meta
          name="description"
          content="Categorize spending with Gemini, get bill alerts, and auto-save round-ups to a Mantle vault."
        />
      </Head>

      <main className="min-h-screen bg-[#0b1020] text-white selection:bg-fuchsia-500/40">
        {/* Glow background */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-r from-fuchsia-500/20 via-cyan-400/10 to-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-40 right-1/3 h-[500px] w-[700px] rounded-full bg-gradient-to-r from-emerald-400/20 via-sky-500/10 to-fuchsia-400/20 blur-3xl" />
        </div>

        {/* Navbar */}
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 shadow-lg shadow-fuchsia-500/30">
              💸
            </span>
            <span className="text-xl font-extrabold tracking-tight">ExpenseAI</span>
          </div>

          <div className="hidden items-center gap-7 md:flex">
            <a href="#features" className="text-white/80 hover:text-white">Features</a>
            <a href="#how" className="text-white/80 hover:text-white">How it works</a>
            <a href="#faq" className="text-white/80 hover:text-white">FAQ</a>
            <Link
              href="/dashboard"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0b1020] shadow-lg hover:shadow-white/20"
            >
              Open App
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="mx-auto mt-6 w-full max-w-7xl px-6 pb-12 pt-4">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                 Live on Mantle Sepolia Testnet
              </div>

              <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
                Spend smarter. <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-sky-400">Save automatically.</span>
              </h1>

              <p className="mt-5 max-w-xl text-white/80">
                 ExpenseAI categorizes your transactions with Gemini, spots bill spikes
                 before they hurt, and rounds up purchases into a self-custody savings
                 vault on Mantle. Zero spreadsheets. Maximum calm.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-600 px-6 py-3 font-semibold shadow-lg shadow-fuchsia-500/30 hover:opacity-95"
                >
                  Launch Dashboard
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white/90 hover:bg-white/10"
                >
                  See Features ↓
                </a>
              </div>

              {/* Email capture (optional) */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`We’ll ping you: ${email}`);
                }}
                className="mt-6 flex max-w-md items-center gap-2"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Get early updates…"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-fuchsia-400/60"
                />
                <button className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#0b1020] hover:opacity-90">
                  Notify me
                </button>
              </form>
            </div>

            {/* mock “app card” */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-fuchsia-500/40 to-indigo-500/40 blur-2xl" />
              <div className="relative rounded-3xl border border-white/10 bg-[#0f1630]/70 p-6 shadow-2xl backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-white/70">Vault Balance</span>
                  <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-300">
                    + ₹320 this month
                  </span>
                </div>
                 <div className="text-4xl font-extrabold tracking-tight">3.3100 MNT</div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  {[
                    { k: "Food", v: "₹4,200" },
                    { k: "Travel", v: "₹1,250" },
                    { k: "Bills", v: "₹2,980" },
                  ].map((x) => (
                    <div
                      key={x.k}
                      className="rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                      <div className="text-white/60">{x.k}</div>
                      <div className="font-semibold">{x.v}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-amber-400/10 p-4 text-amber-200">
                  ⚠️ Electricity bill is 22% higher than usual. Review providers or set a usage alert.
                </div>

                <div className="mt-4 flex gap-3">
                  <Link
                    href="/dashboard"
                    className="flex-1 rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 px-4 py-3 text-center font-semibold text-[#04121f]"
                  >
                    Categorize & Save →
                  </Link>
                  <button
                    className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-semibold hover:bg-white/10"
                    onClick={() => alert("Demo Only")}
                  >
                    Try Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="mx-auto w-full max-w-7xl px-6 py-16">
          <h2 className="text-center text-3xl font-extrabold md:text-4xl">
            What makes ExpenseAI <span className="text-fuchsia-300">different?</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-white/70">
            Real user problems, solved with AI + on-chain automation.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "AI Categorization",
                desc: "Gemini classifies transactions into Food, Travel, Bills, Shopping & more—no manual tags.",
                icon: "🤖",
              },
              {
                title: "Bill Spike Alerts",
                desc: "Detects when recurring bills jump >20% and suggests fixes before the due date.",
                icon: "⚡",
              },
              {
                 title: "Smart Micro-Savings",
                 desc: "Rounds up purchases and auto-deposits to your Mantle vault—saving without thinking.",
                icon: "💾",
              },
              {
                title: "Self-Custody",
                desc: "Funds stay in your vault contract—transparent, auditable, and in your control.",
                icon: "🔐",
              },
              {
                title: "Privacy-First",
                desc: "No public feeds, no salesy spam. Your data stays with you.",
                icon: "🛡️",
              },
              {
                 title: "Hackathon-Ready",
                 desc: "Simple stack: Next.js, Gemini, ethers.js, Mantle Sepolia Testnet. Deploy in minutes.",
                icon: "🚀",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-fuchsia-400/40"
              >
                <div className="text-2xl">{f.icon}</div>
                <h3 className="mt-3 text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-white/75">{f.desc}</p>
                <div className="mt-4 h-1 w-0 bg-gradient-to-r from-fuchsia-400 to-indigo-400 transition-all group-hover:w-24" />
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="mx-auto w-full max-w-7xl px-6 py-16">
          <h2 className="text-center text-3xl font-extrabold md:text-4xl">
            How it works
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                 t: "Connect wallet",
                 d: "Use MetaMask on Mantle Sepolia Testnet. Your vault lives on-chain.",
              },
              {
                n: "02",
                t: "Paste transactions",
                d: "Import or paste JSON. Gemini auto-categorizes and finds bill anomalies.",
              },
              {
                n: "03",
                t: "Save round-ups",
                d: "We compute round-ups and deposit into your vault in a single click.",
              },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-5xl font-black text-white/15">{s.n}</div>
                <h3 className="mt-3 text-xl font-bold">{s.t}</h3>
                <p className="mt-2 text-white/75">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/dashboard"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-[#0b1020] hover:opacity-90"
            >
              Open the Dashboard
            </Link>
          </div>
        </section>

        {/* SOCIAL PROOF / QUOTES */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-16">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-center text-lg text-white/80">
              “ExpenseAI is like having a nerdy friend who hates waste and loves saving you money.”
              <span className="text-white/40"> — Early tester</span>
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto w-full max-w-5xl px-6 pb-20">
          <h2 className="text-center text-3xl font-extrabold md:text-4xl">FAQ</h2>
          <div className="mt-8 space-y-5">
            {[
              {
                 q: "Do I need real money?",
                 a: "No. It runs on Mantle Sepolia Testnet. You can get test MNT tokens from a faucet.",
              },
              {
                q: "Where is my data stored?",
                a: "Transactions you paste are processed in your browser + our API; nothing is shared publicly.",
              },
              {
                q: "Is this NFT-based?",
                a: "No NFTs. Pure on-chain vault + AI agents.",
              },
            ].map((x) => (
              <details key={x.q} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <summary className="cursor-pointer list-none font-semibold">
                  {x.q}
                </summary>
                <p className="mt-2 text-white/80">{x.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* FOOTER */}
         <footer className="border-t border-white/10 py-8 text-center text-sm text-white/60">
           Built with ❤️ on Mantle • Next.js • Gemini
         </footer>
      </main>
    </>
  );
}
