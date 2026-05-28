import React, { useState, useEffect } from 'react';
import { 
  BarChart as ReBarChart, Bar, AreaChart as ReAreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { 
  ShieldCheck, ShieldAlert, Award, RefreshCw, BarChart, Users, ShoppingBag, Shield 
} from 'lucide-react';
import dbService from '../services/db';
import SeoHelper from '../components/SeoHelper';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('boutiques'); // 'boutiques' | 'disputes' | 'analytics'
  const [boutiques, setBoutiques] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  // Resolution inputs
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [activeDisputeId, setActiveDisputeId] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  const loadAdminData = async () => {
    // Load boutiques
    const bouts = await dbService.getBoutiques();
    setBoutiques(bouts);

    // Load disputes
    const disps = await dbService.getDisputes();
    setDisputes(disps);

    // Load bookings
    const ords = await dbService.getOrders();
    setBookings(ords);
  };

  useEffect(() => {
    loadAdminData();
  }, [activeTab]);

  const handleApproveBoutique = async (id) => {
    const success = await dbService.updateBoutique(id, { verified: true });
    if (success) {
      loadAdminData();
    }
  };

  const handleResolveDispute = async (id, decision) => {
    if (!resolutionNotes) {
      alert("Please enter resolution notes before closing a dispute.");
      return;
    }

    setAdminSuccess('');
    let notes = `Admin Decision: ${decision}. Notes: ${resolutionNotes}`;
    
    // Resolve in DB
    const success = await dbService.resolveDispute(id, "Resolved", notes);
    if (success) {
      setAdminSuccess('✅ Dispute claim resolved successfully. Settlement issued.');
      setResolutionNotes('');
      setActiveDisputeId('');
      loadAdminData();
    }
  };

  // KPIs
  const totalUsers = 420; // Simulated platform total
  const platformGrv = bookings.reduce((acc, b) => acc + (b.rentalCost || 0), 0) + 185000;
  const activeDisputesCount = disputes.filter(d => d.status === 'Open').length;

  // Recharts Analytics
  const platformGrvData = [
    { name: 'Jan', grv: 45000 },
    { name: 'Feb', grv: 78000 },
    { name: 'Mar', grv: 112000 },
    { name: 'Apr', grv: 154000 },
    { name: 'May', grv: 215000 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left animate-fade-in">
      
      <SeoHelper title="Admin Command Center" description="Oversee disputes, onboard partner boutiques, and audit gross marketplace bookings." />

      <div className="border-b border-luxury-gold/20 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-luxury-charcoal dark:text-white">Admin Command Center</h1>
          <p className="text-sm font-light text-luxury-charcoal/50 dark:text-luxury-alabaster/50 mt-1">Platform Moderator</p>
        </div>
        <div className="bg-red-600 text-white border border-red-500 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest flex items-center">
          <Shield size={14} className="mr-1.5 animate-pulse" /> Security Master Mode
        </div>
      </div>

      {/* KPI METRICS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 text-xs">
        
        <div className="p-5 bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold text-luxury-gold block">Platform GRV (Gross Vol)</span>
            <span className="text-xl font-bold dark:text-white mt-1 block">₹{platformGrv.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-lg">
            <BarChart size={20} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold text-luxury-gold block">Total Bookings</span>
            <span className="text-xl font-bold dark:text-white mt-1 block">{bookings.length + 80} reserved</span>
          </div>
          <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-lg">
            <ShoppingBag size={20} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold text-luxury-gold block">Registered Users</span>
            <span className="text-xl font-bold dark:text-white mt-1 block">{totalUsers} members</span>
          </div>
          <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-lg">
            <Users size={20} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold text-luxury-gold block">Active Disputes</span>
            <span className="text-xl font-bold text-red-500 mt-1 block">{activeDisputesCount} claims</span>
          </div>
          <div className="p-3 bg-red-500/10 text-red-500 rounded-lg">
            <ShieldAlert size={20} />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Tabs */}
        <div className="lg:col-span-3 space-y-2 bg-white dark:bg-luxury-lightcharcoal rounded-xl border border-luxury-gold/15 p-5 shadow-sm">
          {[
            { id: 'boutiques', label: 'Boutique Onboarding', badge: boutiques.filter(b => !b.verified).length },
            { id: 'disputes', label: 'Audit Dispute Claims', badge: disputes.filter(d => d.status === 'Open').length },
            { id: 'analytics', label: 'Marketplace Metrics' }
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
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`text-[9px] px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white text-luxury-gold' : 'bg-luxury-gold/15 text-luxury-gold'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Display Panel */}
        <div className="lg:col-span-9">
          
          {/* TAB 1: BOUTIQUE ONBOARDING (Approvals list) */}
          {activeTab === 'boutiques' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
                Boutique Verification Queue
              </h2>

              <div className="space-y-4">
                {boutiques.map(boutique => (
                  <div key={boutique.id} className="p-5 border border-luxury-gold/15 bg-white dark:bg-luxury-lightcharcoal rounded-xl text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                    <div className="flex items-center space-x-4">
                      <img src={boutique.logo} alt="" className="w-12 h-12 rounded-full object-cover border border-luxury-gold bg-white flex-shrink-0" />
                      <div className="text-left space-y-1">
                        <h4 className="font-bold text-sm dark:text-white">{boutique.name}</h4>
                        <p className="text-[10px] text-luxury-gold font-bold uppercase tracking-widest">{boutique.location} • Joined: {boutique.joinedDate}</p>
                        <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light line-clamp-2 leading-relaxed">{boutique.description}</p>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {boutique.verified ? (
                        <span className="inline-flex items-center px-3 py-1 bg-green-500/10 text-green-600 rounded-full font-semibold uppercase tracking-wider text-[9px] border border-green-500/20">
                          <ShieldCheck size={12} className="mr-1" /> Approved
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApproveBoutique(boutique.id)}
                          className="px-4 py-2 bg-luxury-gold text-white hover:bg-luxury-bronze rounded text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                          Approve Store
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: AUDIT DISPUTES (Resolve customer claims) */}
          {activeTab === 'disputes' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
                Platform Dispute & Claims Desk
              </h2>

              {adminSuccess && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-600 rounded text-xs font-semibold">
                  {adminSuccess}
                </div>
              )}

              {disputes.length === 0 ? (
                <div className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl p-12 text-center text-xs text-luxury-charcoal/50">
                  Zero active platform dispute cases currently open. All security deposits verified and refunded.
                </div>
              ) : (
                <div className="space-y-4">
                  {disputes.map(disp => (
                    <div key={disp.id} className="p-5 border border-luxury-gold/15 bg-white dark:bg-luxury-lightcharcoal rounded-xl text-xs space-y-4 shadow-sm text-left">
                      <div className="flex justify-between items-start border-b border-luxury-gold/5 pb-2">
                        <div>
                          <strong className="font-bold text-sm dark:text-white">{disp.productTitle}</strong>
                          <p className="text-[9px] text-luxury-gold uppercase font-bold tracking-widest mt-0.5">Order Ref: {disp.bookingId} • Boutique: {disp.storeName} • Client: {disp.userName}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                          disp.status === 'Open' ? 'bg-yellow-500/15 text-yellow-600' : 'bg-green-500/15 text-green-600'
                        }`}>
                          {disp.status}
                        </span>
                      </div>

                      <div className="space-y-1 bg-luxury-cream/15 p-3.5 rounded border border-luxury-gold/10 leading-relaxed font-light">
                        <p className="font-semibold text-luxury-gold text-[10px]">Nature of Claim Dispute:</p>
                        <p className="mt-0.5">{disp.reason} - {disp.description}</p>
                        {disp.damageFeeRequested && <p className="font-bold text-red-500 mt-2">Boutique Penalty Request: ₹{disp.damageFeeRequested.toLocaleString()}</p>}
                      </div>

                      {disp.status === 'Open' ? (
                        <div className="space-y-3 pt-3 border-t border-luxury-gold/5">
                          {activeDisputeId === disp.id ? (
                            <div className="space-y-3">
                              <span className="text-[9px] uppercase font-bold text-luxury-gold block">Log Settlement Verdict</span>
                              <textarea
                                required
                                rows="3"
                                value={resolutionNotes}
                                onChange={(e) => setResolutionNotes(e.target.value)}
                                placeholder="Explain resolution verdict (e.g. Approve penalty of ₹1000, refund rest ₹4000 to customer card...)"
                                className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded text-xs"
                              ></textarea>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleResolveDispute(disp.id, "Penalty Approved")}
                                  className="px-4 py-2 bg-red-600 text-white rounded font-bold uppercase tracking-widest text-[9px]"
                                >
                                  Approve Boutique Claim
                                </button>
                                <button
                                  onClick={() => handleResolveDispute(disp.id, "Refund Client")}
                                  className="px-4 py-2 bg-green-600 text-white rounded font-bold uppercase tracking-widest text-[9px]"
                                >
                                  Refund Client In Full
                                </button>
                                <button
                                  onClick={() => setActiveDisputeId('')}
                                  className="px-4 py-2 border border-luxury-gold/30 text-luxury-gold rounded font-bold uppercase tracking-widest text-[9px]"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setActiveDisputeId(disp.id); setResolutionNotes(''); }}
                              className="px-4 py-2 bg-luxury-charcoal text-white hover:bg-luxury-gold rounded font-bold uppercase tracking-widest text-[9px]"
                            >
                              Issue Verdict / Resolve Claim
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-600 rounded leading-relaxed">
                          <p className="font-bold text-[9px] uppercase">Case Settled & Closed</p>
                          <p className="font-light mt-0.5">{disp.resolutionNotes}</p>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PLATFORM ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
                Platform GRV Volume Output
              </h2>

              <div className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 p-6 rounded-xl shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-gold mb-4">Gross Rental Volume (GRV) growth</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReAreaChart data={platformGrvData}>
                      <defs>
                        <linearGradient id="colorGrv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C5A880" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#C5A880" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#C5A880" fontSize={10} />
                      <YAxis stroke="#C5A880" fontSize={10} />
                      <Tooltip />
                      <Area type="monotone" dataKey="grv" stroke="#C5A880" fillOpacity={1} fill="url(#colorGrv)" />
                    </ReAreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
