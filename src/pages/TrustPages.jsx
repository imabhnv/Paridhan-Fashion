import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, FileText, Scale, Landmark, ChevronRight } from 'lucide-react';
import SeoHelper from '../components/SeoHelper';

const TrustPages = () => {
  const { policyName } = useParams();
  const [searchParams] = useSearchParams();
  const initialTab = policyName || searchParams.get('tab') || 'rental-policy';

  // Tabs: 'rental-policy' | 'damage-protection' | 'refund-policy' | 'terms' | 'privacy'
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (policyName) {
      setActiveTab(policyName);
    }
  }, [policyName]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left animate-fade-in">
      
      <SeoHelper 
        title={`${activeTab.replace('-', ' ').toUpperCase()} Agreement`}
        description="Review Paridhan's legal guidelines, deposit claims policy, and dry-cleaning safety standards."
      />

      <div className="border-b border-luxury-gold/20 pb-6 mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-luxury-charcoal dark:text-white">
          Trust & Policy Guidelines
        </h1>
        <p className="text-sm font-light text-luxury-charcoal/50 dark:text-luxury-alabaster/50 mt-2">
          Read details on rental SLAs, damage protection shields, secure deposit returns, and privacy policies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2 bg-white dark:bg-luxury-lightcharcoal rounded-xl border border-luxury-gold/15 p-5 shadow-sm">
          {[
            { id: 'rental-policy', label: 'Rental Agreement' },
            { id: 'damage-protection', label: 'Damage Protection' },
            { id: 'refund-policy', label: 'Refunds & Returns' },
            { id: 'terms', label: 'Terms of Service' },
            { id: 'privacy', label: 'Privacy Policy' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-left rounded-md flex items-center justify-between transition-all ${
                activeTab === tab.id
                  ? 'bg-luxury-gold text-white'
                  : 'text-luxury-charcoal/65 hover:bg-luxury-cream dark:text-luxury-alabaster/65 dark:hover:bg-luxury-charcoal'
              }`}
            >
              <span>{tab.label}</span>
              <ChevronRight size={12} className={activeTab === tab.id ? 'text-white' : 'text-luxury-gold'} />
            </button>
          ))}
        </div>

        {/* Policy Content Viewer */}
        <div className="lg:col-span-9 bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 p-8 rounded-xl shadow-md space-y-6 leading-relaxed font-light text-xs md:text-sm text-luxury-charcoal/80 dark:text-luxury-alabaster/80">
          
          {/* TAB 1: RENTAL AGREEMENT */}
          {activeTab === 'rental-policy' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold dark:text-white flex items-center">
                <FileText className="text-luxury-gold mr-2.5" size={20} /> Rental Agreement Terms
              </h2>
              <div className="h-0.5 w-12 bg-luxury-gold mb-6"></div>
              
              <p>
                By reserving an outfit on Paridhan, you agree to enter a rental agreement with the verified store boutique partner listing the design.
              </p>
              
              <h3 className="font-bold text-sm dark:text-white pt-2">1. Booking Schedule & Delivery</h3>
              <p>
                Rentals are offered for periods of 3, 5, or 7 days. Your rental period begins on the selected "Start Date" (when delivery is completed) and ends on the "End Date" (when return pickup is scheduled).
              </p>

              <h3 className="font-bold text-sm dark:text-white pt-2">2. Sizing and stitch alterations</h3>
              <p>
                Boutiques alter outfits temporarily using non-destructive stitching based on measurements inputted at checkout. Altering the outfit independently is strictly prohibited and violates this agreement.
              </p>

              <h3 className="font-bold text-sm dark:text-white pt-2">3. Late Return Penalties</h3>
              <p>
                Returns are scheduled for pickup on the afternoon of your rental's final day. If courier is unable to complete pickup due to customer unavailability, a late penalty fee of <strong>₹500 per day</strong> will be deducted from your security deposit.
              </p>
            </div>
          )}

          {/* TAB 2: DAMAGE PROTECTION */}
          {activeTab === 'damage-protection' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold dark:text-white flex items-center">
                <ShieldCheck className="text-luxury-gold mr-2.5" size={20} /> Damage Protection Shield
              </h2>
              <div className="h-0.5 w-12 bg-luxury-gold mb-6"></div>

              <p>
                We want you to wear designer fashion with confidence. This policy governs how we assess outfit condition on return inspections.
              </p>

              <h3 className="font-bold text-sm dark:text-white pt-2">1. Complementary Damage Protection Cover</h3>
              <p>
                Your rental automatically covers minor stains, small fabric pulls, loose beads, and zipper issues. We handle professional repair and stitch validation at our expense.
              </p>

              <h3 className="font-bold text-sm dark:text-white pt-2">2. Major Outfit Damages</h3>
              <p>
                Major damages including heavy burns (e.g. sparkler burns during weddings), deep cuts/tears in fabric, or permanent chemical stains are evaluated by our boutique partner. The cost to repair or replace the design will be assessed from the security deposit.
              </p>

              <h3 className="font-bold text-sm dark:text-white pt-2">3. Dispute Resolution Desk</h3>
              <p>
                If a boutique logs a damage penalty that you disagree with, you can file a claims dispute from your dashboard. Our platform administrators will audit invoices, timestamped photos, and issue a final settlement.
              </p>
            </div>
          )}

          {/* TAB 3: REFUNDS & RETURNS */}
          {activeTab === 'refund-policy' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold dark:text-white flex items-center">
                <Landmark className="text-luxury-gold mr-2.5" size={20} /> Refund & Cancellation Policy
              </h2>
              <div className="h-0.5 w-12 bg-luxury-gold mb-6"></div>

              <h3 className="font-bold text-sm dark:text-white pt-2">1. Booking Cancellations</h3>
              <p>
                You can cancel your booking for a full 100% refund up to 10 days before your scheduled start date. Cancellations made between 5 to 9 days prior receive a 50% rental fee refund (deposit is fully refunded). Cancellations made under 5 days are not refundable.
              </p>

              <h3 className="font-bold text-sm dark:text-white pt-2">2. Security Deposit Refund SLA</h3>
              <p>
                Once return courier pickup completes and boutique verifies the sanitization status, your security deposit is automatically triggered for refund. The funds will arrive in your original card/UPI source within <strong>48 hours</strong> of verification.
              </p>
            </div>
          )}

          {/* TAB 4: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold dark:text-white flex items-center">
                <Scale className="text-luxury-gold mr-2.5" size={20} /> Terms of Service
              </h2>
              <div className="h-0.5 w-12 bg-luxury-gold mb-6"></div>

              <p>
                Welcome to Paridhan. By using our website and services, you agree to comply with the terms and conditions outlined below.
              </p>
              <p>
                All outfit listings, images, and brand details are verified, but availability conflicts can occasionally occur during busy wedding seasons. In case of scheduling overlaps, our concierge will coordinate alternatives or issue full refunds.
              </p>
            </div>
          )}

          {/* TAB 5: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold dark:text-white flex items-center">
                <ShieldCheck className="text-luxury-gold mr-2.5" size={20} /> Privacy Policy
              </h2>
              <div className="h-0.5 w-12 bg-luxury-gold mb-6"></div>

              <p>
                At Paridhan, your privacy is paramount. We secure all personal data, address directories, sizing measurements, and transaction logs.
              </p>
              <p>
                We do not sell user data. Payment info is processed securely via PCI-compliant Razorpay API networks, with 0 card details saved on our database.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default TrustPages;
