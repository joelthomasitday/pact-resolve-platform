import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-navy-950 font-sans">
      <Navbar />
      
      <div className="container mx-auto px-6 py-24 md:py-32 max-w-4xl">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6 text-navy-950">
            Privacy <span className="font-semibold italic">Policy</span>
          </h1>
          <div className="h-1 w-20 bg-gold-500 mb-8" />
          <p className="text-navy-900/60 text-sm  uppercase tracking-[0.2em]">
            Last Updated: February 9, 2026
          </p>
        </div>
        
        <div className="space-y-16 text-navy-900/80 leading-relaxed md:text-lg">
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-navy-950 tracking-tight uppercase border-b border-navy-950/10 pb-4">
              1. Introduction
            </h2>
            <p className="border-l-4 border-gold-500 pl-6 py-2 bg-slate-50 rounded-r-lg">
              The Professional Mediation Platform for International Dispute Resolution and Strategic Excellence ("PACT", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-navy-950 tracking-tight uppercase border-b border-navy-950/10 pb-4">
              2. Information Collection
            </h2>
            <p>
              In our capacity as a leading mediation and dispute resolution provider, we collect information necessary to facilitate professional settlements:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
              {["Identifying Contact Details", "Dispute-Specific Documentation", "Professional Backgrounds", "Communication Logs"].map((item) => (
                <li key={item} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-navy-950/5">
                  <div className="h-2 w-2 rounded-full bg-gold-500" />
                  <span className="font-medium text-navy-900">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-navy-950 tracking-tight uppercase border-b border-navy-950/10 pb-4">
              3. Processing and Utilization
            </h2>
            <p>
              Data processing is conducted with systemic precision to ensure the highest quality of service across our academy and mediation platform:
            </p>
            <div className="grid gap-6">
              <div className="p-6 border border-navy-950/10 rounded-2xl hover:bg-slate-50 transition-colors">
                <h4 className="font-bold mb-2">Service Excellence</h4>
                <p className="text-sm">Facilitating complex negotiations and academy registrations with data-driven accuracy.</p>
              </div>
              <div className="p-6 border border-navy-950/10 rounded-2xl hover:bg-slate-50 transition-colors">
                <h4 className="font-bold mb-2">Secure Communication</h4>
                <p className="text-sm">Ensuring all technical notices and administrative messages reach stakeholders promptly.</p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-navy-950 tracking-tight uppercase border-b border-navy-950/10 pb-4">
              4. Absolute Confidentiality
            </h2>
            <p>
              Confidentiality is a non-negotiable cornerstone of the mediation process. PACT mandates the highest levels of discretion, adhering strictly to international ADR standards and confidentiality protocols, except where legal disclosure is mandated by law.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-navy-950 tracking-tight uppercase border-b border-navy-950/10 pb-4">
              5. Data Protection
            </h2>
            <p>
              We employ military-grade encryption and restricted access protocols to safeguard sensitive case information. Our systems are reviewed periodically for compliance with global privacy standards.
            </p>
          </section>

          <section className="space-y-8 pt-12 border-t border-navy-950/10">
            <div>
              <h2 className="text-2xl font-bold text-navy-950 tracking-tight">Contact Our Privacy Office</h2>
              <p className="text-navy-900/60 mt-2">Questions regarding our data handling or privacy practices can be directed to:</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 p-6 bg-navy-950 text-white rounded-3xl">
                <h4 className="text-gold-500  text-xs uppercase tracking-widest mb-4">Official Email</h4>
                <a href="mailto:official@thepact.in" className="text-xl font-medium hover:text-gold-500 transition-colors">official@thepact.in</a>
              </div>
              <div className="flex-1 p-6 bg-slate-100 rounded-3xl border border-navy-950/5 text-navy-950">
                <h4 className="text-navy-950/40  text-xs uppercase tracking-widest mb-4">Mailing Address</h4>
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
