import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db/store';
import { Footer } from '@/components/navigation/Footer';
import { Check, Calendar, ArrowRight, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Services & Packages — JK Photography',
  description: 'Curated commissions and photography packages for weddings, character portraits, fashion campaigns, and cinema production sets.',
};

export default function ServicesPage() {
  const services = db.getServices();
  const packages = db.getPackages();
  const addons = db.getAddons();
  const travelZones = db.getTravelZones();

  return (
    <>
      <main className="min-h-screen pt-28 pb-20 px-5 sm:px-8 max-w-7xl mx-auto space-y-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold">
            Bespoke Commissions
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-text font-normal">
            Services & Commissions
          </h1>
          <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto">
            Artisanal color grading, bespoke deliverables, and personalized coverage tailored to your production. Pricing is customized and discussed directly during your consultation call according to your exact needs.
          </p>
        </div>

        {/* Services & Packages List */}
        <div className="space-y-28">
          {services.map((service, index) => {
            const isReversed = index % 2 !== 0;
            const servicePackages = packages.filter(p => p.serviceId === service.id);

            return (
              <section key={service.id} id={service.slug} className="space-y-12">
                {/* Hero Feature Row */}
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={`lg:col-span-6 relative aspect-[16/10] rounded-2xl overflow-hidden border border-ink-line bg-ink-curtain shadow-2xl max-w-lg mx-auto lg:max-w-none w-full ${isReversed ? 'lg:order-2' : ''}`}>
                    <Image
                      src={service.coverImage}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-ink/80 backdrop-blur-md border border-ink-line text-xs font-mono text-gold-hi">
                      Custom Quote on Call
                    </div>
                  </div>

                  <div className={`lg:col-span-6 space-y-4 ${isReversed ? 'lg:order-1' : ''}`}>
                    <span className="text-xs font-mono uppercase text-gold tracking-widest">
                      Category 0{index + 1}
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-text font-normal">
                      {service.name}
                    </h2>
                    <p className="font-serif italic text-base text-gold-hi">
                      "{service.tagline}"
                    </p>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-sans">
                      {service.description}
                    </p>
                    <div className="pt-2">
                      <Link
                        href={`/book?service=${service.id}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-ink font-semibold text-xs tracking-wider uppercase hover:bg-gold-hi transition-colors shadow-lg shadow-gold/15"
                      >
                        <Calendar size={14} />
                        <span>Request a Slot</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Packages Table / Cards for this service (Design Spec 3.3) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                  {servicePackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                        pkg.popular
                          ? 'border-gold bg-gold/10 shadow-2xl md:-translate-y-2'
                          : 'border-ink-line bg-ink-stage'
                      }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-gold text-ink text-[10px] font-mono font-bold uppercase tracking-wider">
                          Signature / Popular
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="flex items-baseline justify-between border-b border-ink-line pb-4">
                          <div>
                            <h3 className="font-serif text-xl text-text font-medium">{pkg.name}</h3>
                            <span className="text-xs font-mono text-text-muted mt-0.5 block">
                              {pkg.durationHours} Hours Coverage
                            </span>
                          </div>
                          <div className="text-xs font-mono uppercase tracking-wider text-gold-hi bg-ink/70 px-3 py-1 rounded-full border border-gold/30">
                            Quote on Call
                          </div>
                        </div>

                        <div className="text-xs text-text-muted flex items-center gap-3 font-mono">
                          <span>{pkg.photographers} Photographers</span>
                          <span>·</span>
                          <span>{pkg.editedPhotos} Retouched Stills</span>
                        </div>

                        <ul className="space-y-2.5 pt-2 text-xs text-text/80">
                          {pkg.deliverables.map((deliv, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check size={14} className="text-gold flex-shrink-0 mt-0.5" />
                              <span>{deliv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-6 border-t border-ink-line mt-6">
                        <Link
                          href={`/book?service=${service.id}`}
                          className={`w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors ${
                            pkg.popular
                              ? 'bg-gold text-ink hover:bg-gold-hi'
                              : 'border border-ink-line bg-ink-curtain text-text hover:border-gold hover:text-gold'
                          }`}
                        >
                          <span>Request Slot</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Addons & Travel Zones Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12 border-t border-ink-line">
          {/* Add-ons */}
          <div className="rounded-2xl border border-ink-line bg-ink-stage p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-gold block mb-1">
                Optional Upgrades
              </span>
              <h3 className="font-serif text-2xl text-text font-normal">
                Cinematic Production Add-ons
              </h3>
            </div>

            <div className="space-y-4">
              {addons.map((add) => (
                <div key={add.id} className="p-4 rounded-xl border border-ink-line bg-ink-curtain flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-medium text-text text-sm">{add.name}</h4>
                    <p className="text-xs text-text-muted leading-relaxed">{add.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0 font-mono text-xs text-gold-hi font-medium">
                    Discussed on Call
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Zones */}
          <div className="rounded-2xl border border-ink-line bg-ink-stage p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-gold block mb-1">
                Pan-India & Destination
              </span>
              <h3 className="font-serif text-2xl text-text font-normal">
                Travel & Logistics Policy
              </h3>
            </div>

            <div className="space-y-4">
              {travelZones.map((zone) => (
                <div key={zone.id} className="p-4 rounded-xl border border-ink-line bg-ink-curtain flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-medium text-text text-sm flex items-center gap-1.5">
                      <MapPin size={13} className="text-gold" />
                      <span>{zone.name}</span>
                    </h4>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Included coverage: {zone.cities.join(', ')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 font-mono text-xs text-gold-hi font-medium">
                    {zone.chargePaise === 0 ? 'Complimentary' : 'Discussed on Call'}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-text-muted leading-relaxed pt-2">
              * For remote destination weddings or international assignments, airfare and lodging are coordinated directly with client production teams.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
