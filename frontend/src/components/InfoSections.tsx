export default function InfoSections() {
    return (
        <>
            <section className="bg-slate-950 text-white py-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 -z-10 opacity-40" style={{backgroundImage: 'radial-gradient(circle at top, rgba(56,189,248,0.12), transparent 30%), radial-gradient(circle at right, rgba(129,140,248,0.12), transparent 25%)'}} />
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">Why teams use it</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">Turn website friction into revenue-ready clarity</h2>
                    <p className="text-slate-300 text-sm md:text-base mb-10 max-w-2xl mx-auto">A few visible improvements can instantly increase trust, clarity, and conversion on your homepage.</p>
                    <div className="grid md:grid-cols-3 gap-8">
                        <article className="bg-slate-800/60 p-6 rounded-3xl border border-slate-700/60 shadow-[0_18px_35px_-20px_rgba(15,23,42,0.8)] hover:-translate-y-1 transition-transform duration-200">
                            <div className="text-3xl mb-4">⏳</div>
                            <h3 className="font-semibold text-xl mb-2">Slow Loading Speed</h3>
                            <p className="text-slate-400 text-sm">Users bounce within 3 seconds if pages lag. Every extra millisecond costs potential checkouts.</p>
                        </article>
                        <article className="bg-slate-800/60 p-6 rounded-3xl border border-slate-700/60 shadow-[0_18px_35px_-20px_rgba(15,23,42,0.8)] hover:-translate-y-1 transition-transform duration-200">
                            <div className="text-3xl mb-4">📱</div>
                            <h3 className="font-semibold text-xl mb-2">Bad Mobile Design</h3>
                            <p className="text-slate-400 text-sm">Unoptimized mobile layouts instantly kill trust. If it looks broken on a phone, buyers leave.</p>
                        </article>
                        <article className="bg-slate-800/60 p-6 rounded-3xl border border-slate-700/60 shadow-[0_18px_35px_-20px_rgba(15,23,42,0.8)] hover:-translate-y-1 transition-transform duration-200">
                            <div className="text-3xl mb-4">🧩</div>
                            <h3 className="font-semibold text-xl mb-2">Confusing Layouts</h3>
                            <p className="text-slate-400 text-sm">Vague messaging or hidden buttons reduce client bookings and lower overall leads.</p>
                        </article>
                    </div>
                </div>
            </section>

            <section className="py-20 px-4 max-w-6xl mx-auto text-center">
                <div className="mb-10 rounded-[28px] border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white p-6 shadow-[0_18px_35px_-25px_rgba(15,23,42,0.35)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">Why this feels premium</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">A sharper product story, not just a checklist.</h2>
                    <p className="mx-auto mt-3 max-w-3xl text-sm text-slate-600 md:text-base">Clear diagnostics, confident recommendations, and polished presentation make the experience feel like a real SaaS product.</p>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">How it works</h2>
                <p className="text-slate-500 text-sm md:text-base mb-10 max-w-2xl mx-auto">A simple 3-step flow that turns a rough homepage into a clearer sales page.</p>
                <div className="grid md:grid-cols-3 gap-8">
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:-translate-y-1 transition-transform duration-200 space-y-3">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto shadow-md shadow-blue-200">1</div>
                        <h3 className="font-semibold text-lg">Enter Your URL</h3>
                        <p className="text-slate-500 text-sm">Drop your business page link right into our smart lookup bar above.</p>
                    </article>
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:-translate-y-1 transition-transform duration-200 space-y-3">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto shadow-md shadow-blue-200">2</div>
                        <h3 className="font-semibold text-lg">We Analyze In Seconds</h3>
                        <p className="text-slate-500 text-sm">Our live scraper checks your core structure, elements, and layouts instantly.</p>
                    </article>
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:-translate-y-1 transition-transform duration-200 space-y-3">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto shadow-md shadow-blue-200">3</div>
                        <h3 className="font-semibold text-lg">Get Fixes Instantly</h3>
                        <p className="text-slate-500 text-sm">Review your custom breakdown complete with AI action plans to lift sales.</p>
                    </article>
                </div>
            </section>

            <section className="bg-slate-100 py-20 px-4 border-t border-slate-200">
                <div className="mx-auto mb-10 flex max-w-4xl flex-col items-center text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">Preview</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">A premium report layout your visitors will trust</h2>
                    <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">The bottom preview now feels like a real product demo card — polished, readable, and built to convert interest into action.</p>
                </div>
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Example output preview</h2>
                    <p className="text-slate-500 text-center mb-8 text-sm">Here is a glimpse of the structural breakdowns you will receive:</p>

                    <div className="bg-white rounded-[30px] p-6 shadow-[0_30px_45px_-25px_rgba(15,23,42,0.35)] border border-slate-200/70 space-y-4">
                        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                            <div>
                                <p className="text-[11px] uppercase tracking-[0.25em] text-blue-700">Live preview</p>
                                <h3 className="text-sm font-semibold text-slate-900">AI report snapshot</h3>
                            </div>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Trusted output</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Fast</span>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Actionable</span>
                            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Conversion-first</span>
                        </div>
                        <div className="bg-gradient-to-r from-slate-50 to-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-2">
                            <p className="text-red-600 font-medium text-sm flex items-center gap-2">❌ Your website loads too slowly on mobile</p>
                            <p className="text-green-700 font-medium text-sm pl-6">🧩 Fix: Simplify your top section</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/40 space-y-2">
                            <p className="text-red-600 font-medium text-sm flex items-center gap-2">❌ Your contact button is hard to find</p>
                            <p className="text-green-700 font-medium text-sm pl-6">🧩 Fix: Add visible “Call Now” button</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/40 space-y-2">
                            <p className="text-red-600 font-medium text-sm flex items-center gap-2">❌ Your homepage doesn’t clearly explain your service</p>
                            <p className="text-green-700 font-medium text-sm pl-6">🧩 Fix: Rework your text headlines for clarity</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
