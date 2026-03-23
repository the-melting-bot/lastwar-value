'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from './ProgressBar';
import ServerSearch from './ServerSearch';
import {
  EvaluationInput,
  ServerInfo,
  WeaponData,
  Evaluation,
  SquadType,
  SQUAD_HEROES,
} from '@/lib/types';
import { calculateValuation } from '@/lib/valuation';
import { saveEvaluation, getLatestEvaluation } from '@/lib/storage';

const STEP_LABELS = ['Server', 'Big Three', 'Combat', 'Collection', 'Resources'];

const OIL_TECH_OPTIONS = [
  'Not Unlocked',
  'Less than 20%',
  '20% - 50%',
  '50% - 80%',
  'Above 80%',
  'Maxed (100%)',
];

const RSS_OPTIONS = ['Under 100M', '100M-500M', '500M-1B', '1B-5B', '5B+'];

const MONEY_OPTIONS = [
  'F2P ($0)',
  'Under $50',
  '$50-$200',
  '$200-$500',
  '$500-$1,000',
  '$1,000-$5,000',
  '$5,000+',
];

function parseNum(val: string): number {
  return parseInt(val.replace(/,/g, ''), 10) || 0;
}

function formatNum(val: number): string {
  if (val === 0) return '';
  return val.toLocaleString('en-US');
}

export default function EvaluationWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);

  // Form state
  const [serverId, setServerId] = useState<number | null>(null);
  const [decorationPower, setDecorationPower] = useState('');
  const [totalHeroPower, setTotalHeroPower] = useState('');
  const [heroPowerRank, setHeroPowerRank] = useState('');

  // CHANGE 1: Squad type + total squad power (simplified — no per-hero powers)
  const [squadType, setSquadType] = useState<SquadType | ''>('');
  const [mainSquadPower, setMainSquadPower] = useState('');

  const [weapons, setWeapons] = useState<WeaponData[]>(
    Array.from({ length: 5 }, () => ({ unlocked: false, level: 1 }))
  );
  const [droneLevel, setDroneLevel] = useState('');

  // CHANGE 3: Drone component level + power
  const [droneComponentLevel, setDroneComponentLevel] = useState('1');
  const [droneComponentPower, setDroneComponentPower] = useState('');

  const [skinsCount, setSkinsCount] = useState('');
  const [overlordLevel, setOverlordLevel] = useState('');
  const [hqLevel, setHqLevel] = useState('15');
  const [oilTechTree, setOilTechTree] = useState('Not Unlocked');
  const [vipLevel, setVipLevel] = useState('7');
  const [rssReserves, setRssReserves] = useState('Under 100M');
  const [diamonds, setDiamonds] = useState('');
  const [totalMoneySpent, setTotalMoneySpent] = useState('F2P ($0)');

  // Pre-fill from last evaluation (with backward compatibility)
  useEffect(() => {
    const last = getLatestEvaluation();
    if (last) {
      const inp = last.input;
      setServerId(inp.serverId);
      setDecorationPower(formatNum(inp.decorationPower));
      setTotalHeroPower(formatNum(inp.totalHeroPower));
      setHeroPowerRank(inp.heroPowerRank.toString());

      // Squad type
      if (inp.squadType) {
        setSquadType(inp.squadType);
      }

      // Backward compatible: compute total squad power from hero powers or use mainSquadPower
      if (inp.mainSquadPower && inp.mainSquadPower > 0) {
        setMainSquadPower(formatNum(inp.mainSquadPower));
      } else if (inp.squadHeroes && Object.keys(inp.squadHeroes).length > 0) {
        const total = Object.values(inp.squadHeroes).reduce((s, p) => s + p, 0);
        if (total > 0) setMainSquadPower(formatNum(total));
      }

      setWeapons(inp.exclusiveWeapons);
      setDroneLevel(inp.droneLevel.toString());

      // New drone component fields — gracefully handle old data
      if (inp.droneComponentLevel !== undefined && inp.droneComponentLevel > 0) {
        setDroneComponentLevel(inp.droneComponentLevel.toString());
      }
      if (inp.droneComponentPower !== undefined && inp.droneComponentPower > 0) {
        setDroneComponentPower(formatNum(inp.droneComponentPower));
      }

      setSkinsCount(inp.skinsCount.toString());
      setOverlordLevel(inp.overlordLevel.toString());
      setHqLevel(inp.hqLevel.toString());
      setOilTechTree(inp.oilTechTree);
      setVipLevel(inp.vipLevel.toString());
      setRssReserves(inp.rssReserves);
      setDiamonds(formatNum(inp.diamonds));
      setTotalMoneySpent(inp.totalMoneySpent);
    }
  }, []);

  const season = serverInfo?.season || 0;

  // CHANGE 2: Get hero names for current squad type (for weapon labels)
  const currentHeroes = squadType ? SQUAD_HEROES[squadType] : [];

  function handleServerSelect(info: ServerInfo) {
    setServerInfo(info);
    setServerId(info.id);
  }

  // CHANGE 2: Reset weapons when squad type changes
  function handleSquadTypeChange(newType: SquadType | '') {
    setSquadType(newType);
    // Reset weapons when squad type changes
    setWeapons(Array.from({ length: 5 }, () => ({ unlocked: false, level: 1 })));
  }

  function updateWeapon(index: number, field: keyof WeaponData, value: boolean | number) {
    setWeapons((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  function handleSubmit() {
    if (!serverInfo) return;

    // Build a legacy-compatible squadHeroes record (empty — we no longer collect per-hero powers)
    const squadHeroesRecord: Record<string, number> = {};
    if (squadType) {
      const heroes = SQUAD_HEROES[squadType];
      const perHero = Math.floor(parseNum(mainSquadPower) / heroes.length);
      heroes.forEach((name) => {
        squadHeroesRecord[name] = perHero;
      });
    }

    const input: EvaluationInput = {
      serverId: serverInfo.id,
      serverDay: serverInfo.day,
      serverSeason: serverInfo.season,
      decorationPower: parseNum(decorationPower),
      totalHeroPower: parseNum(totalHeroPower),
      heroPowerRank: parseNum(heroPowerRank),
      squadType,
      squadHeroes: squadHeroesRecord,
      mainSquadPower: parseNum(mainSquadPower),
      exclusiveWeapons: weapons,
      droneLevel: parseInt(droneLevel, 10) || 0,
      droneComponentLevel: parseInt(droneComponentLevel, 10) || 1,
      droneComponentPower: parseNum(droneComponentPower),
      skinsCount: parseInt(skinsCount, 10) || 0,
      overlordLevel: parseInt(overlordLevel, 10) || 0,
      hqLevel: parseInt(hqLevel, 10) || 15,
      oilTechTree,
      vipLevel: parseInt(vipLevel, 10) || 7,
      rssReserves,
      diamonds: parseNum(diamonds),
      totalMoneySpent,
    };

    const result = calculateValuation(input);

    const evaluation: Evaluation = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      input,
      result,
      serverInfo: {
        id: serverInfo.id,
        day: serverInfo.day,
        season: serverInfo.season,
      },
    };

    saveEvaluation(evaluation);
    router.push('/results');
  }

  function handleNumericInput(
    value: string,
    setter: (v: string) => void,
    format: boolean = true
  ) {
    const raw = value.replace(/,/g, '');
    if (raw === '' || /^\d+$/.test(raw)) {
      setter(format && raw ? parseInt(raw, 10).toLocaleString('en-US') : raw);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar currentStep={step} totalSteps={5} labels={STEP_LABELS} />

      {/* Step 1: Server Info */}
      {step === 0 && (
        <div className="card-static p-6 space-y-5 fade-in-up">
          <div>
            <h2 className="text-xl font-bold text-white">Server Info</h2>
            <p className="text-sm text-slate-400 mt-1">Find your server to calibrate baselines</p>
          </div>
          <ServerSearch
            selectedServerId={serverId}
            onSelect={handleServerSelect}
          />
        </div>
      )}

      {/* Step 2: The Big Three */}
      {step === 1 && (
        <div className="card-static p-6 space-y-5 fade-in-up">
          <div>
            <h2 className="text-xl font-bold text-white">The Big Three</h2>
            <p className="text-sm text-slate-400 mt-1">Core account metrics that drive your value</p>
          </div>
          <div>
            <label className="field-label">Decoration Power</label>
            <input
              type="text"
              value={decorationPower}
              onChange={(e) =>
                handleNumericInput(e.target.value, setDecorationPower)
              }
              placeholder="e.g. 650,000"
              className="input-field"
            />
          </div>
          <div>
            <label className="field-label">Total Hero Power</label>
            <input
              type="text"
              value={totalHeroPower}
              onChange={(e) =>
                handleNumericInput(e.target.value, setTotalHeroPower)
              }
              placeholder="e.g. 12,000,000"
              className="input-field"
            />
          </div>
          <div>
            <label className="field-label">Hero Power Server Rank</label>
            <input
              type="text"
              value={heroPowerRank}
              onChange={(e) =>
                handleNumericInput(e.target.value, setHeroPowerRank, false)
              }
              placeholder="e.g. 15"
              className="input-field"
            />
          </div>
        </div>
      )}

      {/* Step 3: Combat & Weapons */}
      {step === 2 && (
        <div className="card-static p-6 space-y-5 fade-in-up">
          <div>
            <h2 className="text-xl font-bold text-white">Combat &amp; Weapons</h2>
            <p className="text-sm text-slate-400 mt-1">Squad composition, weapons, and drones</p>
          </div>

          {/* CHANGE 1: Squad Type — button selector */}
          <div>
            <label className="field-label">Main Squad Type</label>
            <div className="grid grid-cols-3 gap-3">
              {(['Air', 'Tank', 'Missile'] as SquadType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleSquadTypeChange(t)}
                  className={`squad-btn ${squadType === t ? 'active' : ''}`}
                >
                  {t === 'Air' ? '✈️' : t === 'Tank' ? '🛡️' : '🚀'} {t}
                </button>
              ))}
            </div>
          </div>

          {/* CHANGE 1: Hero names displayed as chips, single total power input */}
          {squadType && (
            <div className="space-y-3">
              <div>
                <label className="field-label">Your Heroes</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {currentHeroes.map((name) => (
                    <span key={name} className="hero-chip">
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="field-label">Total Squad Power</label>
                <input
                  type="text"
                  value={mainSquadPower}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, setMainSquadPower)
                  }
                  placeholder="e.g. 12,000,000"
                  className="input-field"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Combined power of all 5 heroes in your main squad
                </p>
              </div>
            </div>
          )}

          {/* CHANGE 2: Exclusive Weapons — tied to hero names */}
          {squadType && (
            <div>
              <label className="field-label">Exclusive Weapons</label>
              <div className="space-y-2 mt-2">
                {weapons.map((w, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(15, 29, 50, 0.5)', border: '1px solid rgba(255, 107, 0, 0.08)' }}
                  >
                    <label className="flex items-center gap-2 cursor-pointer min-w-0">
                      <input
                        type="checkbox"
                        checked={w.unlocked}
                        onChange={(e) =>
                          updateWeapon(i, 'unlocked', e.target.checked)
                        }
                        className="w-4 h-4 shrink-0"
                      />
                      <span className="text-sm text-slate-300 font-medium">
                        {currentHeroes[i] || `Weapon ${i + 1}`}
                      </span>
                    </label>
                    {w.unlocked && (
                      <select
                        value={w.level}
                        onChange={(e) =>
                          updateWeapon(i, 'level', parseInt(e.target.value, 10))
                        }
                        className="select-field !w-auto !py-2 !px-3 text-sm"
                      >
                        {Array.from({ length: 30 }, (_, j) => j + 1).map((l) => (
                          <option key={l} value={l}>
                            Lv. {l}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!squadType && (
            <div className="p-4 rounded-xl text-center text-slate-500 text-sm" style={{ background: 'rgba(15, 29, 50, 0.3)', border: '1px dashed rgba(255, 107, 0, 0.15)' }}>
              Select a squad type above to configure weapons
            </div>
          )}

          <div>
            <label className="field-label">Drone Level</label>
            <input
              type="text"
              value={droneLevel}
              onChange={(e) =>
                handleNumericInput(e.target.value, setDroneLevel, false)
              }
              placeholder="1-50"
              className="input-field"
            />
          </div>

          {/* CHANGE 3: Renamed label */}
          <div>
            <label className="field-label">Overall Drone Components Level</label>
            <select
              value={droneComponentLevel}
              onChange={(e) => setDroneComponentLevel(e.target.value)}
              className="select-field"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label">Overall Drone Component Power</label>
            <input
              type="text"
              value={droneComponentPower}
              onChange={(e) =>
                handleNumericInput(e.target.value, setDroneComponentPower)
              }
              placeholder="e.g. 450,000"
              className="input-field"
            />
          </div>
        </div>
      )}

      {/* Step 4: Collection & Progression */}
      {step === 3 && (
        <div className="card-static p-6 space-y-5 fade-in-up">
          <div>
            <h2 className="text-xl font-bold text-white">Collection &amp; Progression</h2>
            <p className="text-sm text-slate-400 mt-1">Skins, overlord, HQ, and tech investments</p>
          </div>
          <div>
            <label className="field-label">Base/Drone Skins Count</label>
            <input
              type="text"
              value={skinsCount}
              onChange={(e) =>
                handleNumericInput(e.target.value, setSkinsCount, false)
              }
              placeholder="e.g. 8"
              className="input-field"
            />
          </div>

          {season >= 2 && (
            <>
              <div>
                <label className="field-label">Overlord Level</label>
                <input
                  type="text"
                  value={overlordLevel}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, setOverlordLevel, false)
                  }
                  placeholder="e.g. 25"
                  className="input-field"
                />
              </div>
              <div>
                <label className="field-label">HQ Level</label>
                <select
                  value={hqLevel}
                  onChange={(e) => setHqLevel(e.target.value)}
                  className="select-field"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Oil Tech Tree</label>
                <select
                  value={oilTechTree}
                  onChange={(e) => setOilTechTree(e.target.value)}
                  className="select-field"
                >
                  {OIL_TECH_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 5: Resources */}
      {step === 4 && (
        <div className="card-static p-6 space-y-5 fade-in-up">
          <div>
            <h2 className="text-xl font-bold text-white">Resources</h2>
            <p className="text-sm text-slate-400 mt-1">VIP status, reserves, and spending</p>
          </div>
          <div>
            <label className="field-label">VIP Level</label>
            <select
              value={vipLevel}
              onChange={(e) => setVipLevel(e.target.value)}
              className="select-field"
            >
              {Array.from({ length: 18 }, (_, i) => i + 1).map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">RSS Reserves</label>
            <select
              value={rssReserves}
              onChange={(e) => setRssReserves(e.target.value)}
              className="select-field"
            >
              {RSS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Diamonds</label>
            <input
              type="text"
              value={diamonds}
              onChange={(e) => handleNumericInput(e.target.value, setDiamonds)}
              placeholder="e.g. 85,000"
              className="input-field"
            />
          </div>
          <div>
            <label className="field-label">
              Total Money Spent{' '}
              <span className="text-slate-500 font-normal">
                (Optional — helps calibrate but is never shared)
              </span>
            </label>
            <select
              value={totalMoneySpent}
              onChange={(e) => setTotalMoneySpent(e.target.value)}
              className="select-field"
            >
              {MONEY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="btn-secondary px-6 py-3"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={step === 0 && !serverInfo}
            className="btn-primary px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-primary px-10 py-3 text-lg"
          >
            Get My Value →
          </button>
        )}
      </div>
    </div>
  );
}
