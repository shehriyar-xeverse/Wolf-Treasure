import { useState, useEffect } from 'react';
import { 
  Star, Layers, ShieldCheck, Zap, Coins, ChevronDown, Sparkles, 
  Flame, Moon, Award, CreditCard, Clock, Globe, ArrowRight, Play, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BonusCard, GameStat, FeatureBlock, PaytableItem, PlayStep, PaymentGateway, FAQItem } from '../types';

export const REDIRECT_URL = "https://gemslots1.com/?show=register&btag=669341_45e3fe09a187460a87aaa64f9fe90b62&subid=ehv0opm99p";

// Common CTA click visual handler
export function playNow() {
  const rippleCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (rippleCtx) {
    try {
      const ctx = new rippleCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(330, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
    } catch(e) {}
  }
  window.open(REDIRECT_URL, '_blank', 'noopener,noreferrer');
}

/* ============================================================================
   NAVBAR COMPONENT
   ============================================================================ */
export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // height of fixed navbar
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      setMobileMenuOpen(false);
      setTimeout(() => {
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 50);
    }
  };

  const menuItems = [
    { label: 'Overview', id: 'section-overview' },
    { label: 'Bonuses', id: 'section-bonuses' },
    { label: 'Features', id: 'section-features' },
    { label: 'Paytable', id: 'section-paytable' },
    { label: 'How to Play', id: 'section-gameplay' },
    { label: 'FAQ', id: 'section-faq' }
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 border-b ${
      isScrolled 
        ? 'bg-black/90 backdrop-blur-md py-4 border-amber-500/25 shadow-[0_4px_30px_rgba(255,215,0,0.05)]' 
        : 'bg-transparent py-5 border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
        
        {/* Customized Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 cursor-pointer group"
          id="nav-logo-wolf"
        >
          <span className="text-2xl animate-pulse">🐺</span>
          <span className="font-sans font-extrabold text-xl tracking-wider text-[#00ff00] flex items-center leading-none">
            WOLF<span className="text-white">TREASURE</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-7">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.id)}
              className="text-xs font-semibold tracking-wider text-gray-300 hover:text-[#00ff00] hover:shadow-[#00ff00]/20 transition-all duration-200 uppercase cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-4">
          <span className="text-[10px] px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full font-mono text-[#ffd700] uppercase tracking-widest font-bold">18+</span>
          <button
            onClick={playNow}
            className="px-5 py-2.5 bg-gradient-to-r from-[#00ff00] to-[#008000] hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(0,255,0,0.4)] hover:shadow-[0_0_25px_rgba(0,255,0,0.8)] cursor-pointer"
          >
            Play Now
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-300 hover:text-emerald-400 focus:outline-none p-2 cursor-pointer"
            id="mobile-menu-toggle"
          >
            <div className="space-y-1.5 w-6">
              <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-zinc-950 border-b border-zinc-800"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left text-sm uppercase font-semibold text-gray-300 hover:text-[#00ff00] transition-colors py-2 border-b border-zinc-900/40 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={playNow}
                className="w-full py-3 bg-gradient-to-r from-[#00ff00] to-[#008000] text-black font-extrabold text-center uppercase tracking-widest rounded-xl text-xs cursor-pointer shadow-[0_0_15px_rgba(0,255,0,0.4)]"
              >
                Play Now (Redirect to Register)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ============================================================================
   BONUS CARDS SECTION
   ============================================================================ */
export function BonusOffers() {
  const bonuses: BonusCard[] = [
    {
      id: 'zoome',
      casinoName: 'Zoome Casino',
      bonusText: '2500 AUD + 250 Free Spins',
      freeSpins: 250,
      highlightText: 'EASY MOBILE KYC',
      ratingStars: 5,
      logoGlow: 'shadow-[0_0_30px_rgba(34,197,94,0.15)] ring-emerald-500/10'
    },
    {
      id: 'zota',
      casinoName: 'Zota Casino',
      bonusText: '100% up to 10,000 AUD + 100 FS',
      freeSpins: 100,
      highlightText: 'RECOMMENDED FOR VIPs',
      ratingStars: 5,
      logoGlow: 'shadow-[0_0_30px_rgba(234,179,8,0.2)] border-amber-500 ring-amber-500/10'
    },
    {
      id: 'cusco',
      casinoName: 'Cusco Casino',
      bonusText: '375% BONUS up to €2500 + 225 FS',
      freeSpins: 225,
      highlightText: 'MAX VALUE MATCH',
      ratingStars: 5,
      logoGlow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)] ring-purple-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
      {bonuses.map((bonus, index) => (
        <motion.div
          key={bonus.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
          whileHover={{ scale: 1.04, y: -6 }}
          className={`relative rounded-3xl glass-card p-6 md:p-8 flex flex-col justify-between transition-all duration-300 border-zinc-800/50 hover:border-yellow-500/50 group ${bonus.logoGlow}`}
          id={`bonus-card-${bonus.id}`}
        >
          {index === 1 && (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full text-black text-[10px] font-extrabold uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.4)] animate-pulse">
              ⭐ HOTTEST CASINO PARTNER ⭐
            </div>
          )}

          <div>
            {/* Crown and Name header */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-gray-400 font-mono font-semibold">
                {bonus.highlightText}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: bonus.ratingStars }).map((_, rIdx) => (
                  <Star key={rIdx} className="w-4 h-4 fill-amber-400 text-amber-500" />
                ))}
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-serif font-black text-white group-hover:text-gold-glow transition-all duration-200">
              {bonus.casinoName}
            </h3>

            {/* High visual bonus text readout */}
            <div className="my-6 p-4 rounded-2xl bg-black border border-zinc-800/60 shadow-inner group-hover:border-yellow-500/15">
              <span className="block text-[10px] uppercase text-zinc-500 font-mono font-bold mb-1">PROMOTIONAL OFFER:</span>
              <p className="text-lg font-extrabold text-green-glow tracking-tight">
                {bonus.bonusText}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={playNow}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold uppercase tracking-widest text-xs rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(234,179,8,0.15)] group-hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              Claim Bonus Now
            </button>
            <span className="text-[10px] text-center text-zinc-500 uppercase font-mono">
              Apply terms & conditions | BeGambleAware
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================================================
   GAME OVERVIEW SECTION
   ============================================================================ */
export function GameOverview() {
  const gameplayStats: GameStat[] = [
    { label: 'Developer', value: 'IGTech', description: 'Legendary premium casino builder', iconName: 'Globe' },
    { label: 'RTP Level', value: '96.01%', description: 'Generous payout return rate', iconName: 'Zap' },
    { label: 'Volatility', value: 'Medium', description: 'Balanced hazard-to-reward ratio', iconName: 'Flame' },
    { label: 'Paylines Count', value: '25 Fixed', description: 'Defined payouts left-to-right', iconName: 'Layers' },
    { label: 'Slot Grid', value: '5 × 3 Reels', description: 'Traditional multi-tier reel structure', iconName: 'Star' },
    { label: 'Bet Limits', value: '0.25 - 125 AUD', description: 'Ideal for both low limits and big VIP stakes', iconName: 'Coins' },
    { label: 'Max Win Multiplier', value: '1,000×', description: 'Win up to 1,000x normal wager', iconName: 'Award' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {gameplayStats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: idx * 0.08 }}
          className="glass-card stat-box items-start hover:scale-[1.02] cursor-pointer transition-all duration-300"
          id={`overview-stat-${idx}`}
        >
          {/* Render stylized indicators based on types */}
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-inner">
            {stat.iconName === 'Globe' && <Globe className="w-5 h-5" />}
            {stat.iconName === 'Zap' && <Zap className="w-5 h-5 animate-pulse" />}
            {stat.iconName === 'Flame' && <Flame className="w-5 h-5" />}
            {stat.iconName === 'Layers' && <Layers className="w-5 h-5" />}
            {stat.iconName === 'Star' && <Star className="w-5 h-5" />}
            {stat.iconName === 'Coins' && <Coins className="w-5 h-5" />}
            {stat.iconName === 'Award' && <Award className="w-5 h-5" />}
          </div>

          <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono mb-1">
            {stat.label}
          </span>
          <h4 className="text-xl md:text-2xl font-serif font-extrabold text-white tracking-wide text-gold-glow">
            {stat.value}
          </h4>
          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            {stat.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================================================
   FEATURES SECTION
   ============================================================================ */
export function Features() {
  const features: FeatureBlock[] = [
    {
      title: 'Free Spins Round',
      tagline: 'Mountain Scatter Trigger',
      description: 'Landing Sunset Mountain Scatters on reels 1, 3, and 5 automatically awards 5 massive Free Spins. During this mode, reels 2, 3, and 4 merge into single giant 3x3 symbol blocks for massive payline combos!',
      badge: '5x Scatter Bonus',
      visualType: 'spins',
      color: 'border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.06)]'
    },
    {
      title: 'Hold & Win System',
      tagline: 'Glowing Money Moon Scatter',
      description: 'Collect 6 or more Money Moon values across any reels. Active symbols lock on screen while resetting respin timers to 3. Fill all 15 pockets to claim the legendary Mega Jackpot of 1,000x stake!',
      badge: 'Moon Accumulator',
      visualType: 'hold',
      color: 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.06)]'
    },
    {
      title: 'Wild Wolf Stacked Reels',
      tagline: 'High substitution power',
      description: 'The golden eyes of the Lone Alpha Wolf substitute for all symbols (except Scatters and Money Moons). Land stacked Wild Wolf symbols to dominate all paylines simultaneously.',
      badge: 'Expanded Wilds',
      visualType: 'wild',
      color: 'border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.06)]'
    }
  ];

  return (
    <div className="space-y-12">
      {features.map((feat, idx) => {
        const isAlignedRight = idx % 2 === 1;

        return (
          <motion.div
            key={feat.title}
            initial={{ opacity: 0, x: isAlignedRight ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col ${isAlignedRight ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 md:gap-12 glass-card p-6 md:p-10 rounded-3xl transition-all duration-300 ${feat.color}`}
            id={`feature-block-${idx}`}
          >
            {/* Text description column */}
            <div className="flex-1 space-y-4">
              <span className="text-[10px] px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-emerald-400 font-mono font-extrabold rounded-full uppercase tracking-widest">
                {feat.badge}
              </span>
              <h3 className="text-2xl md:text-3xl font-serif font-black text-white tracking-wide">
                {feat.title}
              </h3>
              <h5 className="text-sm font-semibold text-gold-glow italic font-serif">
                {feat.tagline}
              </h5>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                {feat.description}
              </p>
              
              <div className="pt-4">
                <button
                  onClick={playNow}
                  className="px-5 py-3 bg-zinc-900 border border-zinc-800 hover:border-yellow-500/40 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:text-gold-glow flex items-center gap-1.5 transition-all duration-300 cursor-pointer"
                >
                  Learn / Play Online
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Glowing Symbolic preview column */}
            <div className="w-full lg:w-1/3 flex justify-center">
              <div className="relative p-8 rounded-2xl bg-black border border-zinc-800 flex flex-col items-center justify-center min-h-[160px] text-center w-full max-w-sm group">
                <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                {feat.visualType === 'spins' && (
                  <>
                    <span className="text-6xl mb-3 animate-subtle-float">⛰️</span>
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">3x Peak Mountain Scatter</span>
                  </>
                )}
                {feat.visualType === 'hold' && (
                  <>
                    <span className="text-6xl mb-3 animate-pulse">🌕</span>
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">3 Respins Money Value</span>
                  </>
                )}
                {feat.visualType === 'wild' && (
                  <>
                    <span className="text-6xl mb-3 animate-pulse-glow">🐺</span>
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Substitution Stacked Reels</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ============================================================================
   PAYTABLE SYMBOLS LAYOUT
   ============================================================================ */
export function Paytable() {
  const payItems: PaytableItem[] = [
    { name: 'Bison Bull', type: 'High', payout5: '40 AUD', payout4: '20 AUD', payout3: '2 AUD', color: 'border-red-500/20 bg-red-950/20', iconText: '🦬', symbolColor: 'text-red-400' },
    { name: 'Golden Eagle', type: 'High', payout5: '30 AUD', payout4: '15 AUD', payout3: '1.5 AUD', color: 'border-sky-500/20 bg-sky-950/20', iconText: '🦅', symbolColor: 'text-sky-300' },
    { name: 'Wild Stallion', type: 'High', payout5: '20 AUD', payout4: '10 AUD', payout3: '1 AUD', color: 'border-amber-500/20 bg-amber-950/20', iconText: '🐎', symbolColor: 'text-amber-400' },
    { name: 'Mountain Puma', type: 'High', payout5: '10 AUD', payout4: '5 AUD', payout3: '0.5 AUD', color: 'border-emerald-500/20 bg-emerald-950/20', iconText: '🐆', symbolColor: 'text-emerald-400' },
    { name: 'Card value A', type: 'Low', payout5: '5 AUD', payout4: '2 AUD', payout3: '0.4 AUD', color: 'border-zinc-800 bg-zinc-950/40', iconText: 'A', symbolColor: 'text-pink-400 font-serif' },
    { name: 'Card value K', type: 'Low', payout5: '5 AUD', payout4: '2 AUD', payout3: '0.4 AUD', color: 'border-zinc-800 bg-zinc-950/40', iconText: 'K', symbolColor: 'text-orange-400 font-serif' },
    { name: 'Card value Q', type: 'Low', payout5: '5 AUD', payout4: '2 AUD', payout3: '0.4 AUD', color: 'border-zinc-800 bg-zinc-950/40', iconText: 'Q', symbolColor: 'text-yellow-400 font-serif' },
    { name: 'Card value J', type: 'Low', payout5: '5 AUD', payout4: '2 AUD', payout3: '0.4 AUD', color: 'border-zinc-800 bg-zinc-950/40', iconText: 'J', symbolColor: 'text-blue-400 font-serif' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {payItems.map((item, idx) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className={`group rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:border-yellow-500/30 hover:scale-[1.03] overflow-hidden relative cursor-pointer ${item.color}`}
            id={`paytable-item-${idx}`}
          >
            {/* Shiny light slide layer */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono ${item.type === 'High' ? 'bg-amber-400/10 text-amber-400' : 'bg-zinc-800 text-gray-500'}`}>
                  {item.type} Value
                </span>
                <span className="text-[10px] text-zinc-500 font-mono font-black">Bet: $1.00</span>
              </div>

              {/* Big symbol preview */}
              <div className="h-16 flex items-center justify-center mb-4">
                <span className={`text-4.5xl md:text-5.5xl filter drop-shadow group-hover:scale-110 transition-transform duration-300 ${item.symbolColor}`}>
                  {item.iconText}
                </span>
              </div>
            </div>

            {/* List payout values */}
            <div className="space-y-1.5 border-t border-zinc-800/80 pt-3 text-xs font-mono">
              <div className="flex justify-between text-gray-400">
                <span>5 symbols Match:</span>
                <span className="text-white font-extrabold font-mono text-green-400">{item.payout5}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>4 symbols Match:</span>
                <span className="text-zinc-200 font-mono">{item.payout4}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>3 symbols Match:</span>
                <span className="text-zinc-300 font-mono">{item.payout3}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div>
          <span className="text-gold-glow font-serif text-sm font-extrabold flex items-center justify-center md:justify-start gap-1">
            🐺 Blue Wolf wild & Sunset Mountain Scatter special rewards
          </span>
          <p className="text-xs text-zinc-500 mt-1">
            Wilds yield up to 500x coin bets and substitute for standard values. Scatters pay independently!
          </p>
        </div>
        <button
          onClick={playNow}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold uppercase tracking-widest rounded-lg transition-all duration-300 cursor-pointer"
        >
          Check paylines
        </button>
      </div>

    </div>
  );
}

/* ============================================================================
   GAMEPLAY GUIDE SECTION
   ============================================================================ */
export function GameplayGuide() {
  const steps: PlayStep[] = [
    { number: 1, title: 'Set Stake Amount', description: 'Modify your wager utilizing the inline toggles. Fits wagers from 0.25 to 125.00 credits.', stat: 'Bet Range' },
    { number: 2, title: 'Trigger Spindles', description: 'Tap spin play to trigger sequence slot reels, sequentially coming to halt from left-to-right.', stat: 'Seq stop' },
    { number: 3, title: 'Scan Landing Reels', description: 'Examine combinations. Lines offer matching values sequentially left-to-right.', stat: '25 paylines' },
    { number: 4, title: 'Unlock Scatter Feature', description: 'Land Mountain Scatters on columns 1, 3, and 5 to launch the giant 3x3 free spins.', stat: 'Free Spins' },
    { number: 5, title: 'Trigger Hold & Win', description: 'Accumulate 6 Money Moon symbols to start the coin respin bonus and claim Jackpots!', stat: 'Jackpot mini' }
  ];

  return (
    <div className="relative w-full py-6">
      
      {/* Decorative vertical/horizontal connect line */}
      <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/60 to-emerald-500/10 -translate-y-1/2 hidden lg:block z-0"></div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
        {steps.map((step, idx) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.12 }}
            className="flex flex-col items-center glass-card p-6 text-center relative group hover:border-[#00ff00]/50 transition-all duration-300"
            id={`step-card-${step.number}`}
          >
            {/* Floating Index counter */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-green-400 text-black font-black text-lg flex items-center justify-center mb-4 border-4 border-black shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-115 transition-transform duration-300">
              {step.number}
            </div>

            <span className="text-[9px] font-mono px-2 py-0.5 bg-zinc-900 border border-zinc-850 text-yellow-400 uppercase tracking-widest font-bold mb-3">
              {step.stat}
            </span>

            <h4 className="text-base font-serif font-black text-white leading-tight mb-2 uppercase tracking-wide">
              {step.title}
            </h4>

            <p className="text-xs text-zinc-500 leading-relaxed mt-2">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>

    </div>
  );
}

/* ============================================================================
   PAYMENT GATEWAYS TRANSIT SLIDER
   ============================================================================ */
export function PaymentSlider() {
  const gateways: PaymentGateway[] = [
    { name: 'PayID Transfer', type: 'Local Bank Transfer', limitMin: '$10.00', limitMax: '$20,000', speed: 'Instant', logoText: 'PayID', glowColor: 'shadow-emerald-500/10 border-emerald-500/30' },
    { name: 'Visa / Mastercard', type: 'Credit/Debit Card', limitMin: '$25.00', limitMax: '$10,000', speed: 'Immediate', logoText: '💳 Cards', glowColor: 'shadow-blue-500/10 border-blue-500/30' },
    { name: 'Neosurf Voucher', type: 'Prepaid Code Pin', limitMin: '$10.00', limitMax: '$4,500', speed: 'Immediate', logoText: 'Neosurf', glowColor: 'shadow-orange-500/10 border-orange-500/30' },
    { name: 'Bitcoin Network', type: 'Cryptocurrency Wallet', limitMin: '$5.00', limitMax: 'Unlimited', speed: '5-15 Mins', logoText: '🪙 BTC', glowColor: 'shadow-amber-500/10 border-amber-500/30' },
    { name: 'USDT Stablecoin', type: 'TRC20 / ERC20 Token', limitMin: '$10.00', limitMax: 'Unlimited', speed: '1-3 Mins', logoText: '₮ Tether', glowColor: 'shadow-green-500/10 border-green-500/30' }
  ];

  return (
    <div className="relative w-full overflow-hidden py-4">
      <div 
        id="payment-ticker-horizontal" 
        className="flex flex-wrap md:flex-nowrap gap-5 overflow-x-auto pb-4 scrollbar-thin snap-x justify-center"
      >
        {gateways.map((gate, index) => (
          <div
            key={gate.name}
            className={`min-w-[260px] max-w-[280px] snap-center rounded-2xl bg-zinc-950 p-5 border flex flex-col justify-between hover:scale-[1.02] hover:border-yellow-500/20 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)] ${gate.glowColor}`}
          >
            {/* Gateway logo/title readout */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-serif font-black tracking-widest text-white uppercase bg-black px-2.5 py-1 rounded">
                  {gate.logoText}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono">{gate.speed}</span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white mt-2 font-sans">{gate.name}</h4>
              <span className="text-[10px] text-zinc-500 font-mono block mt-1">{gate.type}</span>
            </div>

            {/* Threshold boundaries */}
            <div className="mt-5 border-t border-zinc-900 pt-3 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-500">Deposit Min:</span>
                <span className="text-white font-bold">{gate.limitMin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Deposit Max:</span>
                <span className="text-white font-bold">{gate.limitMax}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-3">
        <p className="text-[11px] text-zinc-500 font-mono tracking-tight uppercase">
          ⚡ ALL CRYPTOCURRENCY WITHDRAWALS ARE DEPLOYED SECURELY ON-CHAIN WITH ZERO ADDITIONAL CONVERSION TARIFFS.
        </p>
      </div>
    </div>
  );
}

/* ============================================================================
   FAQ ACCORDIONS COMPONENT
   ============================================================================ */
export function FAQ() {
  const faqs: FAQItem[] = [
    {
      question: 'What is the theoretical RTP of the Wolf Treasure Pokie?',
      answer: 'Wolf Treasure features a measured return-to-player (RTP) rating of 96.01%. This is combined with moderate/medium payout volatility, matching consistent small payouts along with occasional colossal jackpot rewards.'
    },
    {
      question: 'How do you trigger the Free Spins and the Hold & Win Moon Features?',
      answer: 'The Free Spins trigger when 3 Mountain Scatters land on columns 1, 3, and 5. The iconic Hold & Win bonus initiates when 6 or more Money Moons scatter on the screen, instantly locking them and awarding 3 rotating respins.'
    },
    {
      question: 'What are the Jackpot prize levels in the Pokie?',
      answer: 'There are three static tiers: MINI (awarding 30x the active spin stake), MAJOR (awarding 100x), and MEGA (triggered by covering all 15 spots in the Hold & Win respin grid, yielding 1,000x the stake!).'
    },
    {
      question: 'Are outcomes of Wolf Treasure verified to be fair and random?',
      answer: 'Absolutely. Wolf Treasure operates utilizes a high-end Random Number Generator (RNG) calculation chip system certified by external international betting regulators. Every spindle is separate and entirely fair.'
    },
    {
      question: 'How do I withdraw real funds after claiming a welcome bonus?',
      answer: 'Tap your profile ledger, select withdrawal options (such as instant crypto or local PayID wire), set the desired sum, and confirm. Normal queue speeds range from instant to under 15 minutes.'
    }
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
    // clean mini sound cue
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch(e) {}
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto py-2">
      {faqs.map((faq, index) => {
        const isOpen = activeIndex === index;

        return (
          <div
            key={index}
            className="border border-zinc-800 rounded-2xl glass-card overflow-hidden transition-all duration-300 hover:border-[#00ff00]/40"
            id={`faq-item-${index}`}
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center px-6 py-5 text-left text-white hover:text-gold-glow transition-all duration-200 cursor-pointer focus:outline-none"
            >
              <span className="font-serif font-bold text-sm md:text-base pr-4">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-emerald-400"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-t border-zinc-900/60"
                >
                  <p className="px-6 py-5 text-xs md:text-sm text-gray-400 leading-relaxed bg-black/45">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
