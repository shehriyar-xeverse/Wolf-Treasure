import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Flame, Sparkles, Coins, Award, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SlotSymbol } from '../types';

// The symbols for Wolf Treasure Pokie
const SLOT_SYMBOLS: SlotSymbol[] = [
  { id: 'wolf', name: 'Wolf Wild', imageText: '🐺', symbolColor: 'bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border-purple-500', textColor: 'text-purple-300', value5: 500, value4: 250, value3: 25, isSpecial: true },
  { id: 'bison', name: 'Bison', imageText: '🦬', symbolColor: 'bg-gradient-to-br from-red-950/60 to-amber-950/60 border-red-500', textColor: 'text-red-300', value5: 400, value4: 200, value3: 20 },
  { id: 'eagle', name: 'Eagle', imageText: '🦅', symbolColor: 'bg-gradient-to-br from-sky-950/60 to-slate-900/60 border-sky-500', textColor: 'text-sky-300', value5: 300, value4: 150, value3: 15 },
  { id: 'stallion', name: 'Stallion', imageText: '🐎', symbolColor: 'bg-gradient-to-br from-amber-950/60 to-stone-900/60 border-amber-600', textColor: 'text-amber-300', value5: 200, value4: 100, value3: 10 },
  { id: 'cougar', name: 'Cougar', imageText: '🐆', symbolColor: 'bg-gradient-to-br from-emerald-950/60 to-teal-900/60 border-emerald-500', textColor: 'text-emerald-300', value5: 100, value4: 50, value3: 5 },
  { id: 'ace', name: 'A', imageText: 'A', symbolColor: 'bg-zinc-900/80 border-zinc-700', textColor: 'text-pink-400 font-serif text-2xl', value5: 50, value4: 20, value3: 4 },
  { id: 'king', name: 'K', imageText: 'K', symbolColor: 'bg-zinc-900/80 border-zinc-700', textColor: 'text-orange-400 font-serif text-2xl', value5: 50, value4: 20, value3: 4 },
  { id: 'queen', name: 'Q', imageText: 'Q', symbolColor: 'bg-zinc-900/80 border-zinc-700', textColor: 'text-yellow-400 font-serif text-2xl', value5: 50, value4: 20, value3: 4 },
  { id: 'jack', name: 'J', imageText: 'J', symbolColor: 'bg-zinc-900/80 border-zinc-700', textColor: 'text-blue-400 font-serif text-2xl', value5: 50, value4: 20, value3: 4 },
  { id: 'scatter', name: 'Scatter Symbol', imageText: '⛰️', symbolColor: 'bg-gradient-to-br from-yellow-950/40 to-orange-950/40 border-amber-500 animate-pulse', textColor: 'text-amber-400', value5: 100, value4: 50, value3: 10, isSpecial: true },
  { id: 'moon', name: 'Money Moon', imageText: '🌕', symbolColor: 'bg-gradient-to-br from-cyan-950/50 to-blue-900/30 border-cyan-400', textColor: 'text-cyan-200 animate-pulse', value5: 50, value4: 10, value3: 2, isSpecial: true }
];

export default function SlotEmulator() {
  const [balance, setBalance] = useState<number>(2500);
  const [bet, setBet] = useState<number>(2.50);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinReels, setSpinReels] = useState<SlotSymbol[][]>([]);
  const [reelsActiveSpin, setReelsActiveSpin] = useState<boolean[]>([false, false, false, false, false]);
  const [lastWinAmount, setLastWinAmount] = useState<number>(0);
  const [winMessage, setWinMessage] = useState<string>('');
  
  // Game Feature status variables
  const [gamemode, setGamemode] = useState<'Normal' | 'FreeSpins' | 'HoldWin'>('Normal');
  const [freeSpinsLeft, setFreeSpinsLeft] = useState<number>(0);
  const [freeSpinsTotalWins, setFreeSpinsTotalWins] = useState<number>(0);
  
  // Hold & Win Respin status
  const [holdStates, setHoldStates] = useState<{ value: number; locked: boolean }[][]>([]);
  const [respinsRemaining, setRespinsRemaining] = useState<number>(0);
  const [holdTotalWin, setHoldTotalWin] = useState<number>(0);

  // Jackpots
  const [jackpots, setJackpots] = useState({
    mini: 250,
    major: 1250,
    mega: 10000
  });

  // Highlighted win indexes for flashing
  const [winningPaylines, setWinningPaylines] = useState<number[][]>([]);

  // Sound Synth references helper for reels and coins click
  const synthOscillator = (freq: number, type: OscillatorType, dur: number, gainVal = 0.1) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  };

  // Generate initial slot reels
  const generateRandomGrid = (): SlotSymbol[][] => {
    const grid: SlotSymbol[][] = [];
    for (let col = 0; col < 5; col++) {
      const colSymbols: SlotSymbol[] = [];
      for (let row = 0; row < 3; row++) {
        // distribute probabilities (Ace..Jack are highly probable; items are medium; special are low)
        const rand = Math.random();
        let sym: SlotSymbol;
        if (rand < 0.35) {
          sym = SLOT_SYMBOLS[5 + Math.floor(Math.random() * 4)]; // A, K, Q, J
        } else if (rand < 0.65) {
          sym = SLOT_SYMBOLS[1 + Math.floor(Math.random() * 4)]; // Bison, Eagle, Stallion, Cougar
        } else if (rand < 0.8) {
          sym = SLOT_SYMBOLS[0]; // Wolf Wild
        } else if (rand < 0.9) {
          sym = SLOT_SYMBOLS[10]; // Moon symbol
        } else {
          sym = SLOT_SYMBOLS[9]; // Scatter
        }
        colSymbols.push(sym);
      }
      grid.push(colSymbols);
    }
    return grid;
  };

  // Setup initial load state
  useEffect(() => {
    setSpinReels(generateRandomGrid());
    
    // Slow ticker to increase slot jackpots realistically over time
    const jackpotTimer = setInterval(() => {
      setJackpots(prev => ({
        mini: +(prev.mini + (0.01 + Math.random() * 0.04)).toFixed(2),
        major: +(prev.major + (0.04 + Math.random() * 0.12)).toFixed(2),
        mega: +(prev.mega + (0.15 + Math.random() * 0.45)).toFixed(2),
      }));
    }, 2800);

    return () => clearInterval(jackpotTimer);
  }, []);

  const changeBet = (direction: 'up' | 'down') => {
    synthOscillator(550, 'sine', 0.08, 0.05);
    const betTiers = [0.25, 0.50, 1.00, 2.50, 5.00, 10.00, 25.00, 50.00, 125.00];
    const currentIndex = betTiers.indexOf(bet);
    if (direction === 'up' && currentIndex < betTiers.length - 1) {
      setBet(betTiers[currentIndex + 1]);
    } else if (direction === 'down' && currentIndex > 0) {
      setBet(betTiers[currentIndex - 1]);
    }
  };

  const executeNormalSpin = async () => {
    if (isSpinning) return;
    if (balance < bet && gamemode === 'Normal') {
      alert('Insufficient virtual credits! Click Reset below to top up.');
      return;
    }

    setIsSpinning(true);
    setWinningPaylines([]);
    setLastWinAmount(0);
    setWinMessage('');

    if (gamemode === 'Normal') {
      setBalance(b => +(b - bet).toFixed(2));
    } else if (gamemode === 'FreeSpins') {
      setFreeSpinsLeft(s => s - 1);
    }

    // Play visual rapid roll states with intervals
    let spinCycles = 12;
    const tickerInterval = setInterval(() => {
      setSpinReels(generateRandomGrid());
      synthOscillator(Math.floor(220 + Math.random() * 180), 'triangle', 0.05, 0.02);
    }, 100);

    // Stop seq left-to-right stops
    setTimeout(() => {
      clearInterval(tickerInterval);

      // Construct a final grid using slightly adjusted random probabilities
      // to increase chance of triggers or wins in Demo mode for excitement
      const finalGrid: SlotSymbol[][] = [];
      const randTrigger = Math.random();

      // We will purposefully trigger hold & win 15% of the time, and free spins 15% of the time,
      // and regular payouts 45% of the time!
      const forceHoldWin = randTrigger < 0.15;
      const forceFreeSpins = !forceHoldWin && randTrigger < 0.30;

      for (let col = 0; col < 5; col++) {
        const colSymbols: SlotSymbol[] = [];
        for (let row = 0; row < 3; row++) {
          let sym: SlotSymbol;

          if (forceHoldWin) {
            // Force moons to drop
            const r = Math.random();
            sym = r < 0.45 ? SLOT_SYMBOLS[10] : SLOT_SYMBOLS[Math.floor(Math.random() * 9)];
          } else if (forceFreeSpins && (col >= 1 && col <= 3)) {
            // Force scatter in middle columns
            sym = Math.random() < 0.5 ? SLOT_SYMBOLS[9] : SLOT_SYMBOLS[Math.floor(Math.random() * 8)];
          } else {
            // Normal distributes
            const r = Math.random();
            if (r < 0.33) {
              sym = SLOT_SYMBOLS[5 + Math.floor(Math.random() * 4)];
            } else if (r < 0.6) {
              sym = SLOT_SYMBOLS[1 + Math.floor(Math.random() * 4)];
            } else if (r < 0.75) {
              sym = SLOT_SYMBOLS[0]; // Wild wolf
            } else if (r < 0.88) {
              sym = SLOT_SYMBOLS[10]; // Moon
            } else {
              sym = SLOT_SYMBOLS[9]; // Scatter
            }
          }
          colSymbols.push(sym);
        }
        finalGrid.push(colSymbols);
      }

      // If we are in FreeSpins mode, reels 2, 3, and 4 merge!
      // This means Reels 2, 3, 4 will contain the SAME Giant 3x3 symbol.
      if (gamemode === 'FreeSpins') {
        const giantCandidateSymbols = SLOT_SYMBOLS.filter(s => s.id !== 'scatter');
        const giantSelection = giantCandidateSymbols[Math.floor(Math.random() * giantCandidateSymbols.length)];
        // overwrite reels 1, 2, 3 rows with this selection
        finalGrid[1] = [giantSelection, giantSelection, giantSelection];
        finalGrid[2] = [giantSelection, giantSelection, giantSelection];
        finalGrid[3] = [giantSelection, giantSelection, giantSelection];
      }

      setSpinReels(finalGrid);
      setIsSpinning(false);

      // Play sequential stopping sounds
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          synthOscillator(380 + i * 80, 'sine', 0.12, 0.08);
        }, i * 150);
      }

      // Check results after stopping sound completes
      setTimeout(() => {
        analyzeSpinResults(finalGrid);
      }, 800);

    }, spinCycles * 100);
  };

  const analyzeSpinResults = (grid: SlotSymbol[][]) => {
    // 1. Check for Scatter trigger (Mountains in reels 1, 3, 5 - wait, standard is 3 scatters yields Free Spins)
    let scatterCount = 0;
    grid.forEach(col => {
      col.forEach(sym => {
        if (sym.id === 'scatter') scatterCount++;
      });
    });

    // 2. Check for Hold & Win Moon Trigger (need 6 or more money Moons!)
    let moonCount = 0;
    grid.forEach(col => {
      col.forEach(sym => {
        if (sym.id === 'moon') moonCount++;
      });
    });

    if (moonCount >= 6 && gamemode !== 'HoldWin') {
      // Trigger Hold & Win respin bonus!
      triggerHoldAndWinBonus(grid);
      return;
    }

    if (scatterCount >= 3 && gamemode !== 'FreeSpins') {
      // Trigger Free spins!
      triggerFreeSpinsBonus();
      return;
    }

    // Calculate payouts based on mock paylines
    // Let's check 5 horizontal/diagonal paths
    const paylinesPaths = [
      [0, 0, 0, 0, 0], // Top row
      [1, 1, 1, 1, 1], // Center row
      [2, 2, 2, 2, 2], // Bottom row
      [0, 1, 2, 1, 0], // V diagonal
      [2, 1, 0, 1, 2], // Inverted V diagonal
    ];

    let totalWin = 0;
    const winsToFlash: number[][] = [];

    paylinesPaths.forEach((path, lineIdx) => {
      const symbolsOnPath = path.map((rowVal, colIdx) => grid[colIdx][rowVal]);
      
      // Check maximum match of first symbols
      const firstSym = symbolsOnPath[0];
      let matches = 1;

      for (let col = 1; col < 5; col++) {
        const nextSym = symbolsOnPath[col];
        // Either match exact name, or one of them (or first) is a Wild 'wolf'
        if (
          nextSym.id === firstSym.id || 
          nextSym.id === 'wolf' || 
          (firstSym.id === 'wolf' && !nextSym.isSpecial)
        ) {
          matches++;
        } else {
          break;
        }
      }

      if (matches >= 3) {
        // Resolve key scoring symbol (if first is wild, grab second non-wild, or fall back to wild)
        let scoringSym = firstSym;
        if (firstSym.id === 'wolf') {
          scoringSym = symbolsOnPath.find(s => s.id !== 'wolf') || firstSym;
        }

        let multiplier = 0;
        if (matches === 3) multiplier = scoringSym.value3;
        else if (matches === 4) multiplier = scoringSym.value4;
        else if (matches === 5) multiplier = scoringSym.value5;

        const payout = (multiplier * (bet / 10)); // proportional to bet
        totalWin += payout;
        winsToFlash.push(path);
      }
    });

    if (totalWin > 0) {
      setTimeout(() => {
        // Big win chime!
        synthOscillator(523.25, 'triangle', 0.2, 0.12); // C5
        setTimeout(() => synthOscillator(659.25, 'sine', 0.2, 0.12), 150); // E5
        setTimeout(() => synthOscillator(783.99, 'sine', 0.4, 0.18), 300); // G5
      }, 100);

      const roundedWin = +totalWin.toFixed(2);
      setLastWinAmount(roundedWin);
      setWinningPaylines(winsToFlash);
      
      if (gamemode === 'FreeSpins') {
        setFreeSpinsTotalWins(prev => +(prev + roundedWin).toFixed(2));
      } else {
        setBalance(prev => +(prev + roundedWin).toFixed(2));
      }

      // custom epic win message thresholds
      if (roundedWin >= bet * 15) {
        setWinMessage(`🔥 MEGA WIN - ${roundedWin.toFixed(2)} AUD!`);
      } else if (roundedWin >= bet * 5) {
        setWinMessage(`✨ BIG WIN - ${roundedWin.toFixed(2)} AUD!`);
      } else {
        setWinMessage(`Payout: +${roundedWin.toFixed(2)} AUD`);
      }
    } else {
      // no win
      if (gamemode === 'FreeSpins' && freeSpinsLeft === 0) {
        // Exit Free spins!
        setTimeout(() => {
          setBalance(prev => +(prev + freeSpinsTotalWins).toFixed(2));
          setGamemode('Normal');
          setWinMessage(`🎉 Free Spins complete! Total Payout: +${freeSpinsTotalWins.toFixed(2)} AUD`);
          synthOscillator(880, 'sine', 0.6, 0.15);
        }, 1200);
      }
    }
  };

  // HOLDS & WIN IMPLEMENTATIONS
  const triggerHoldAndWinBonus = (grid: SlotSymbol[][]) => {
    synthOscillator(587.33, 'triangle', 0.4, 0.15); // D5
    setTimeout(() => synthOscillator(880, 'sine', 0.6, 0.15), 200); // A5
    
    setWinningPaylines([]);
    setGamemode('HoldWin');
    setRespinsRemaining(3);
    setWinMessage('🌕 HOLD & WIN FEATURE TRIGGERED!');

    // Initialize Hold Grid states (15 spots)
    // Locked if original grid had moon symbols!
    const initialHold = grid.map(col => 
      col.map(sym => {
        const isMoon = sym.id === 'moon';
        return {
          value: isMoon ? Math.floor((bet * (0.5 + Math.random() * 4)) * 10) / 10 : 0,
          locked: isMoon
        };
      })
    );
    setHoldStates(initialHold);
  };

  const executeRespin = () => {
    if (respinsRemaining <= 0 || isSpinning) return;
    setIsSpinning(true);

    let cycles = 10;
    const interval = setInterval(() => {
      // shuffle only non-locked locations
      setHoldStates(prev => 
        prev.map(col => 
          col.map(spot => {
            if (spot.locked) return spot;
            // random flickering moon symbol
            return {
              value: Math.random() < 0.22 ? Math.floor((bet * (1 + Math.random() * 8)) * 10) / 10 : 0,
              locked: false
            };
          })
        )
      );
      synthOscillator(600 + Math.random() * 200, 'triangle', 0.05, 0.02);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);

      // Lock any random moons that landed
      let newMoonsLanded = 0;
      const finalHold = holdStates.map(col => 
        col.map(spot => {
          if (spot.locked) return spot;
          const landed = Math.random() < 0.15; // chance of landing a locked symbol
          if (landed) {
            newMoonsLanded++;
            // Generate a virtual currency value or potential Mini / Major Jackpot label!
            const jackpotRand = Math.random();
            let value = Math.floor((bet * (2 + Math.random() * 10)) * 10) / 10;
            if (jackpotRand < 0.05) {
              value = jackpots.mini; // Mini jackpot value!
              setWinMessage('🌕 MINI JACKPOT SCATTERED!');
              synthOscillator(1046.50, 'sine', 0.5, 0.2); // C6 chime
            } else if (jackpotRand < 0.01) {
              value = jackpots.major; // Major jackpot value!
              setWinMessage('🌕 MAJOR JACKPOT SCATTERED!!');
              synthOscillator(1318.51, 'sine', 0.6, 0.22); // E6 chime
            }
            return { value, locked: true };
          }
          return { value: 0, locked: false };
        })
      );

      setHoldStates(finalHold);

      if (newMoonsLanded > 0) {
        setRespinsRemaining(3); // reset spins
        synthOscillator(880, 'sine', 0.15, 0.1);
        setTimeout(() => synthOscillator(1100, 'sine', 0.2, 0.1), 100);
      } else {
        setRespinsRemaining(r => r - 1);
      }

      // Check if grid is entirely filled (Mega Jackpot!)
      let totalLocked = 0;
      finalHold.forEach(c => c.forEach(s => { if (s.locked) totalLocked++; }));

      if (totalLocked === 15) {
        // MEGA JACKPOT HIT!
        const grandTotal = jackpots.mega;
        setBalance(b => +(b + grandTotal).toFixed(2));
        setGamemode('Normal');
        setWinMessage(`🏆 MEGA JACKPOT HIT! WIN: +${grandTotal.toFixed(2)} AUD!`);
        synthOscillator(523.25, 'sine', 0.5, 0.2);
        setTimeout(() => synthOscillator(783.99, 'sine', 0.8, 0.2), 200);
        return;
      }

      // If no respins left, calculate sum of all moons
      if (respinsRemaining === 1 && newMoonsLanded === 0) {
        // Hold Win ends!
        let winSum = 0;
        finalHold.forEach(col => col.forEach(spot => {
          if (spot.locked) winSum += spot.value;
        }));

        setTimeout(() => {
          const finalWinSum = +winSum.toFixed(2);
          setBalance(b => +(b + finalWinSum).toFixed(2));
          setHoldTotalWin(finalWinSum);
          setGamemode('Normal');
          setWinMessage(`🌕 HOLD & WIN COMPLETE! Total Moon Payout: +${finalWinSum.toFixed(2)} AUD`);
          synthOscillator(1200, 'sine', 0.6, 0.15);
        }, 1200);
      }

    }, 1000);
  };

  // FREE SPINS CORES
  const triggerFreeSpinsBonus = () => {
    synthOscillator(523.25, 'triangle', 0.2, 0.15);
    setTimeout(() => synthOscillator(659.25, 'triangle', 0.2, 0.15), 150);
    setTimeout(() => synthOscillator(783.99, 'triangle', 0.5, 0.2), 300);

    setGamemode('FreeSpins');
    setFreeSpinsLeft(8);
    setFreeSpinsTotalWins(0);
    setWinMessage('⛰️ FREE SPINS UNLOCKED! REELS 2,3,4 MERGED!');
  };

  const resetCredits = () => {
    synthOscillator(440, 'triangle', 0.12, 0.08);
    setBalance(5000);
    setLastWinAmount(0);
    setWinMessage('Virtual Credits reset to 5,000.00 AUD!');
  };

  return (
    <div id="slot-emulator-main" className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border-2 border-amber-500/40 bg-zinc-950/90 shadow-[0_0_40px_rgba(234,179,8,0.15)] flex flex-col p-4 md:p-6 select-none font-sans">
      
      {/* Decorative Gold Header Rail */}
      <div className="flex flex-wrap justify-between items-center bg-black/65 border border-amber-500/30 p-3 rounded-2xl mb-4 gap-4">
        <div className="flex gap-2 items-center">
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
          <div className="flex flex-col">
            <span className="text-xs text-amber-500 font-semibold tracking-wider uppercase">Simulator Mode:</span>
            <span className="text-sm font-serif font-bold text-white tracking-widest flex items-center gap-1.5">
              {gamemode === 'HoldWin' && <span className="text-cyan-400 animate-pulse">🌕 HOLD & WIN Respins</span>}
              {gamemode === 'FreeSpins' && <span className="text-yellow-400 animate-bounce">⛰️ Giant Reel Free Spins</span>}
              {gamemode === 'Normal' && <span className="text-emerald-400">🔥 Play demo spins</span>}
            </span>
          </div>
        </div>

        {/* JACKPOT DISPLAYS */}
        <div className="grid grid-cols-3 gap-2 flex-grow max-w-xl text-center">
          <div className="jackpot-card px-2 py-1.5 rounded-lg flex flex-col items-center justify-center border-emerald-500/50">
            <span className="text-[10px] text-green-400 uppercase tracking-widest font-bold">Mini Jackpot</span>
            <span className="font-mono text-sm font-black text-white text-green-glow">${jackpots.mini.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div className="jackpot-card px-2 py-1.5 rounded-lg flex flex-col items-center justify-center animate-gold-pulse">
            <span className="text-[10px] text-[#ffd700] uppercase tracking-widest font-bold">Major Jackpot</span>
            <span className="font-mono text-sm font-black jackpot-value">${jackpots.major.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div className="jackpot-card px-2 py-1.5 rounded-lg flex flex-col items-center justify-center border-purple-500/50">
            <span className="text-[10px] text-purple-400 uppercase tracking-widest font-bold">Mega Jackpot</span>
            <span className="font-mono text-sm font-black text-purple-300">${jackpots.mega.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
        </div>
      </div>

      {/* REELS GRID BOX */}
      <div className="relative w-full border-4 border-amber-600/60 bg-black p-2.5 rounded-2xl shadow-inner min-h-[260px] md:min-h-[300px] flex flex-col justify-center">
        
        {/* Absolute Win messages overlay */}
        <AnimatePresence>
          {winMessage && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 10 }}
              animate={{ scale: 1.0, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: -10 }}
              className="absolute inset-x-0 mx-auto top-6 max-w-lg bg-black/95 border-2 border-emerald-500 p-3.5 rounded-xl text-center z-20 shadow-[0_0_25px_rgba(16,185,129,0.35)]"
            >
              <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                <Flame className="w-5 h-5 text-amber-500 animate-bounce" />
                {winMessage}
              </h3>
            </motion.div>
          )}
        </AnimatePresence>

        {gamemode !== 'HoldWin' ? (
          /* REGULAR SLOT REELS LAYOUT (5 REELS x 3 ROWS) */
          <div className="grid grid-cols-5 gap-2 md:gap-3 relative overflow-hidden h-full">
            {spinReels.map((reel, rIdx) => {
              // Free Spins special: Reels 2, 3, 4 represent a collaborative single block column
              const isCenterGiantGroup = gamemode === 'FreeSpins' && (rIdx >= 1 && rIdx <= 3);

              return (
                <div 
                  key={rIdx} 
                  className={`flex flex-col gap-2 relative bg-zinc-950/75 border border-zinc-800/40 p-1.5 rounded-xl ${
                    isCenterGiantGroup ? 'border-amber-500/40 bg-amber-950/5' : ''
                  }`}
                >
                  {reel.map((sym, sIdx) => {
                    const isWinningSpot = winningPaylines.some(path => path[rIdx] === sIdx);

                    // Giant middle layout conditional
                    // We only display the visual card for Reel 2 Row 1 and style it differently, while reels 2,3,4 elements melt under.
                    if (gamemode === 'FreeSpins' && (rIdx >= 1 && rIdx <= 3)) {
                      if (rIdx === 2 && sIdx === 1) {
                        return (
                          <div 
                            key={`${rIdx}-${sIdx}`}
                            className="absolute inset-0 m-1 bg-gradient-to-br from-amber-600/20 via-purple-900/30 to-zinc-950 border-2 border-yellow-400 rounded-xl flex flex-col items-center justify-center z-10 animate-pulse"
                            id="giant-reel-display"
                          >
                            <span className="text-5xl md:text-7xl mb-1 filter drop-shadow-lg">{sym.imageText}</span>
                            <span className="text-[10px] md:text-xs font-serif font-extrabold uppercase text-gold-glow tracking-wider">Giant Symbol</span>
                          </div>
                        );
                      }
                      if (rIdx >= 1 && rIdx <= 3) {
                        // Other indices hide behind the absolute giant card
                        return <div key={`${rIdx}-${sIdx}`} className="h-20 w-full opacity-0"></div>;
                      }
                    }

                    return (
                      <motion.div
                        key={`${rIdx}-${sIdx}`}
                        id={`slot-cell-${rIdx}-${sIdx}`}
                        animate={isWinningSpot ? { scale: [1, 1.05, 1], filter: ['brightness(1)', 'brightness(1.4)', 'brightness(1)'] } : {}}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className={`h-22 md:h-24 w-full rounded-xl border flex flex-col items-center justify-center relative cursor-help transition-all duration-300 hover:brightness-110 ${sym.symbolColor} ${
                          isWinningSpot ? 'border-emerald-400 border-2 ring-2 ring-emerald-500/40 z-10' : ''
                        }`}
                        title={`${sym.name}: Max win multiplier ${sym.value5}x`}
                      >
                        <span className="text-3xl md:text-4xl filter drop-shadow">{sym.imageText}</span>
                        <span className="text-[9px] mt-1 text-gray-400 uppercase font-mono font-bold tracking-tight text-center truncate w-full px-1">
                          {sym.name === 'Ace' || sym.name === 'King' || sym.name === 'Queen' || sym.name === 'Jack' ? '' : sym.name}
                        </span>

                        {isWinningSpot && (
                          <span className="absolute bottom-0.5 right-1 text-[8px] font-bold text-emerald-300 font-mono">WIN!</span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ) : (
          /* HOLD & WIN MOCK BONUS LAYOUT (15 INDIVIDUAL LOCKABLE SPOTS) */
          <div className="flex flex-col gap-3">
            <div className="text-center p-1 bg-cyan-950/30 border border-cyan-800/40 rounded-xl max-w-xs mx-auto mb-1">
              <span className="text-xs uppercase tracking-wider font-extrabold text-cyan-400">Respins Remaining: {respinsRemaining}</span>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {holdStates.map((col, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-2">
                  {col.map((spot, spotIdx) => (
                    <motion.div
                      key={spotIdx}
                      initial={spot.locked ? { scale: 0.9, rotate: -3 } : {}}
                      animate={spot.locked ? { scale: [1, 1.04, 1] } : {}}
                      transition={{ repeat: spot.locked ? Infinity : 0, duration: 2 }}
                      className={`h-22 md:h-24 w-full rounded-xl border-2 flex flex-col items-center justify-center relative transition-all duration-300 ${
                        spot.locked 
                          ? 'border-cyan-400 bg-gradient-to-br from-cyan-950 to-blue-950 text-cyan-200' 
                          : 'border-zinc-800 bg-zinc-950/90 text-zinc-600'
                      }`}
                    >
                      {spot.locked ? (
                        <>
                          <span className="text-2.5xl md:text-3.5xl">🌕</span>
                          <span className="text-xs font-mono font-bold text-cyan-300 mt-1">
                            {spot.value >= 250 ? '🏆 JACKPOT' : `$${spot.value.toFixed(2)}`}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl opacity-15">🌕</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GAME STATUS AND CONTROLS BOTTOM STATION */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-black/80 border border-zinc-800/60 p-4 rounded-2xl mt-4 gap-4">
        
        {/* Virtual Bank & Last payout display */}
        <div className="flex justify-between w-full md:w-auto gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center shadow-inner">
              <Coins className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-zinc-400 font-mono font-bold tracking-wider">Demo Credits</span>
              <span className="text-lg font-bold font-mono text-emerald-400">${balance.toLocaleString(undefined, {minimumFractionDigits: 2})} AUD</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 border-l border-zinc-800/80 pl-6">
            <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center shadow-inner">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-zinc-400 font-mono font-bold tracking-wider">Last Spin Win</span>
              <span className="text-lg font-bold font-mono text-amber-400">${lastWinAmount.toLocaleString(undefined, {minimumFractionDigits: 2})} AUD</span>
            </div>
          </div>
        </div>

        {/* Bets Selection and triggers */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center md:justify-end">
          
          {/* Bet adjusting tier */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
            <button
              onClick={() => changeBet('down')}
              disabled={isSpinning || gamemode !== 'Normal'}
              className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded-lg text-white font-bold cursor-pointer font-mono"
            >
              -
            </button>
            <div className="px-3 text-center min-w-[70px]">
              <span className="block text-[8px] uppercase tracking-widest text-zinc-500 font-bold">Spin Bet</span>
              <span className="font-mono text-sm font-bold text-zinc-200">${bet.toFixed(2)}</span>
            </div>
            <button
              onClick={() => changeBet('up')}
              disabled={isSpinning || gamemode !== 'Normal'}
              className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded-lg text-white font-bold cursor-pointer font-mono"
            >
              +
            </button>
          </div>

          {/* SPIN ACTION TRIGGER */}
          {gamemode !== 'HoldWin' ? (
            <button
              onClick={executeNormalSpin}
              disabled={isSpinning || (gamemode === 'FreeSpins' && freeSpinsLeft <= 0)}
              className="px-6 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:opacity-50 text-black font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] cursor-pointer flex items-center gap-2"
            >
              {gamemode === 'FreeSpins' ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin-slow" />
                  Spin ({freeSpinsLeft} FS Left)
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-black fill-black" />
                  {isSpinning ? 'SPINNING...' : 'SPIN PLAY'}
                </>
              )}
            </button>
          ) : (
            <button
              onClick={executeRespin}
              disabled={isSpinning || respinsRemaining <= 0}
              className="px-6 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:opacity-50 text-black font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 animate-spin-slow" />
              {isSpinning ? 'SHUFFLING...' : `MOON SPIN (${respinsRemaining} left)`}
            </button>
          )}

          {/* Reset credits helper */}
          <button
            onClick={resetCredits}
            disabled={isSpinning}
            className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white cursor-pointer"
            title="Reset Virtual Balance"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      <div className="mt-3.5 text-center">
        <p className="text-[10px] text-zinc-500 font-mono tracking-tight flex items-center justify-center gap-1.5 uppercase">
          <span>🔞 18+ RESPONSIBLE VIRTUAL GAMING</span>
          <span className="text-zinc-600">|</span>
          <span>NO REAL FINANCIAL RISK IN DEMO MODE</span>
          <span className="text-zinc-600">|</span>
          <span>RNG SYSTEM DEPLOYED</span>
        </p>
      </div>

    </div>
  );
}
