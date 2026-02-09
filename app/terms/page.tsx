import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-navy-950 font-sans">
      <Navbar />
      
      <div className="container mx-auto px-6 py-24 md:py-32 max-w-4xl">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6 text-navy-950">
            Terms of <span className="font-semibold italic">Service</span>
          </h1>
          <div className="h-1 w-20 bg-gold-500 mb-8" />
          <p className="text-navy-900/60 text-sm font-mono uppercase tracking-[0.2em]">
            Last Updated: February 9, 2026
          </p>
        </div>
        
        <div className="space-y-16 text-navy-900/80 leading-relaxed md:text-lg">
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-navy-950 tracking-tight uppercase border-b border-navy-950/10 pb-4">
              1. Acceptance of Terms
            </h2>
            <p className="border-l-4 border-gold-500 pl-6 py-2 bg-slate-50 rounded-r-lg">
              By accessing and using the services provided by PACT ("Professional Mediation Platform for International Dispute Resolution and Strategic Excellence"), you agree to the binding nature of these Terms of Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-navy-950 tracking-tight uppercase border-b border-navy-950/10 pb-4">
              2. Professional Services
            </h2>
            <p>
              PACT provides a sophisticated suite of ADR (Alternative Dispute Resolution) services, including mediation, arbitration, and advanced negotiation consultancy, alongside specialized instruction via the PACT Academy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-navy-950 tracking-tight uppercase border-b border-navy-950/10 pb-4">
              3. Standards of Conduct
            </h2>
            <p>
              Participants are mandated to maintain the highest levels of professional decorum and good faith throughout all dispute resolution proceedings and educational sessions conducted on the platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-navy-950 tracking-tight uppercase border-b border-navy-950/10 pb-4">
              4. Intellectual Property
            </h2>
            <p>
              All proprietary materials, including training modules, procedural rules, and the PACT digital interface, remain the exclusive property of PACT and are protected under international copyright and trademark statutes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-navy-950 tracking-tight uppercase border-b border-navy-950/10 pb-4">
              5. Governing Jurisdiction
            </h2>
            <p>
              These Terms shall be interpreted and enforced in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in New Delhi.
            </p>
          </section>

          <section className="space-y-8 pt-12 border-t border-navy-950/10">
            <div>
              <h2 className="text-2xl font-bold text-navy-950 tracking-tight">Technical Support & Inquiries</h2>
              <p className="text-navy-900/60 mt-2">For clarification regarding these terms or general support, please reach out to our legal division.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 p-6 bg-navy-950 text-white rounded-3xl">
                <h4 className="text-gold-500 font-mono text-xs uppercase tracking-widest mb-4">Support Email</h4>
                <a href="mailto:official@thepact.in" className="text-xl font-medium hover:text-gold-500 transition-colors">official@thepact.in</a>
              </div>
              <div className="flex-1 p-6 bg-slate-100 rounded-3xl border border-navy-950/5 text-navy-950">
                <h4 className="text-navy-950/40 font-mono text-xs uppercase tracking-widest mb-4">Mailing Address</h4>
                <p className="text-sm font-medium leading-relaxed">
                  PACT International Headquarters,<br />
                  ADR Tower, New Delhi, India.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
