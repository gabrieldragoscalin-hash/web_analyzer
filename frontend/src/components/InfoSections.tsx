export default function InfoSections() {
    return (
        <>
            <section className="bg-slate-900 text-white py-20 px-4 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">Slow websites lose customers</h2>
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

            <section className="py-20 px-4 max-w-5xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-3">How it works</h2>
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
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Example output preview</h2>
                    <p className="text-slate-500 text-center mb-8 text-sm">Here is a glimpse of the structural breakdowns you will receive:</p>

                    <div className="bg-white rounded-3xl p-6 shadow-[0_18px_35px_-20px_rgba(15,23,42,0.25)] border border-slate-200/70 space-y-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/40 space-y-2">
                            <p className="text-red-600 font-medium text-sm flex items-center gap-2">❌ Your website loads too slowly on mobile</p>
                            <p className="text-green-700 font-medium text-sm pl-6">✅ Fix: Simplify your top section</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/40 space-y-2">
                            <p className="text-red-600 font-medium text-sm flex items-center gap-2">❌ Your contact button is hard to find</p>
                            <p className="text-green-700 font-medium text-sm pl-6">✅ Fix: Add visible “Call Now” button</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/40 space-y-2">
                            <p className="text-red-600 font-medium text-sm flex items-center gap-2">❌ Your homepage doesn’t clearly explain your service</p>
                            <p className="text-green-700 font-medium text-sm pl-6">✅ Fix: Rework your text headlines for clarity</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
