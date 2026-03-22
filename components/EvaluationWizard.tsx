'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from './ProgressBar';
import ServerSearch from './ServerSearch';
import { EvaluationInput, ServerInfo, WeaponData, Evaluation } from '@/lib/types';
import { calculateValuation } from '@/lib/valuation';
import { saveEvaluation, getLatestEvaluation } from '@/lib/storage';

const STEP_LABELS = ['Server', 'Big Three', 'Combat', 'Collection', 'Resources'];

const DRONE_COMPONENT_OPTIONS = [
  'Mostly Rare',
  'Mostly Epic',
  'Mix of Legendary & Epic',
  'Max Legendary',
];

const OIL_TECH_OPTIONS = ['Not Unlocked', 'Early', 'Mid', 'Advanced', 'Maxed'];

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
  const [mainSquadPower, setMainSquadPower] = useState('');
  const [weapons, setWeapons] = useState<WeaponData[]>(
    Array.from({ length: 5 }, () => ({ unlocked: false, level: 1 }))
  );
  const [droneLevel, setDroneLevel] = useState('');
  const [droneComponents, setDroneComponents] = useState('Mostly Rare');
  const [skinsCount, setSkinsCount] = useState('');
  const [overlordLevel, setOverlordLevel] = useState('');
  const [hqLevel, setHqLevel] = useState('15');
  const [oilTechTree, setOilTechTree] = useState('Not Unlocked');
  const [vipLevel, setVipLevel] = useState('7');
  const [rssReserves, setRssReserves] = useState('Under 100M');
  const [diamonds, setDiamonds] = useState('');
  const [totalMoneySpent, setTotalMoneySpent] = useState('F2P ($0)');

  // Pre-fill from last evaluation
  useEffect(() => {
    const last = getLatestEvaluation();
    if (last) {
      const inp = last.input;
      setServerId(inp.serverId);
      setDecorationPower(formatNum(inp.decorationPower));
      setTotalHeroPower(formatNum(inp.totalHeroPower));
      setHeroPowerRank(inp.heroPowerRank.toString());
      setMainSquadPower(formatNum(inp.mainSquadPower));
      setWeapons(inp.exclusiveWeapons);
      setDroneLevel(inp.droneLevel.toString());
      setDroneComponents(inp.droneComponents);
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

  function handleServerSelect(info: ServerInfo) {
    setServerInfo(info);
    setServerId(info.id);
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

    const input: EvaluationInput = {
      serverId: serverInfo.id,
      serverDay: serverInfo.day,
      serverSeason: serverInfo.season,
      decorationPower: parseNum(decorationPower),
      totalHeroPower: parseNum(totalHeroPower),
      heroPowerRank: parseNum(heroPowerRank),
      mainSquadPower: parseNum(mainSquadPower),
      exclusiveWeapons: weapons,
      droneLevel: parseInt(droneLevel, 10) || 0,
      droneComponents,
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

  const inputClass =
    'w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500';
  const selectClass =
    'w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500';
  const labelClass = 'block text-sm font-medium text-gray-300 mb-1';

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar currentStep={step} totalSteps={5} labels={STEP_LABELS} />

      {/* Step 1: Server Info */}
      {step === 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            Step 1 of 5: Server Info
          </h2>
          <ServerSearch
            selectedServerId={serverId}
            onSelect={handleServerSelect}
          />
        </div>
      )}

      {/* Step 2: The Big Three */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            Step 2 of 5: The Big Three
          </h2>
          <div>
            <label className={labelClass}>Decoration Power</label>
            <input
              type="text"
              value={decorationPower}
              onChange={(e) =>
                handleNumericInput(e.target.value, setDecorationPower)
              }
              placeholder="e.g. 650,000"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Total Hero Power</label>
            <input
              type="text"
              value={totalHeroPower}
              onChange={(e) =>
                handleNumericInput(e.target.value, setTotalHeroPower)
              }
              placeholder="e.g. 12,000,000"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Hero Power Server Rank</label>
            <input
              type="text"
              value={heroPowerRank}
              onChange={(e) =>
                handleNumericInput(e.target.value, setHeroPowerRank, false)
              }
              placeholder="e.g. 15"
              className={inputClass}
            />
          </div>
        </div>
      )}

      {/* Step 3: Combat & Weapons */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            Step 3 of 5: Combat & Weapons
          </h2>
          <div>
            <label className={labelClass}>Main Squad Power</label>
            <input
              type="text"
              value={mainSquadPower}
              onChange={(e) =>
                handleNumericInput(e.target.value, setMainSquadPower)
              }
              placeholder="e.g. 35,000,000"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Exclusive Weapons</label>
            <div className="space-y-2 mt-2">
              {weapons.map((w, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 bg-gray-800/50 rounded-lg"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={w.unlocked}
                      onChange={(e) =>
                        updateWeapon(i, 'unlocked', e.target.checked)
                      }
                      className="w-4 h-4 accent-orange-500"
                    />
                    <span className="text-sm text-gray-300">
                      Weapon {i + 1}
                    </span>
                  </label>
                  {w.unlocked && (
                    <select
                      value={w.level}
                      onChange={(e) =>
                        updateWeapon(i, 'level', parseInt(e.target.value, 10))
                      }
                      className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    >
                      {Array.from({ length: 10 }, (_, j) => j + 1).map((l) => (
                        <option key={l} value={l}>
                          Level {l}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Drone Level</label>
            <input
              type="text"
              value={droneLevel}
              onChange={(e) =>
                handleNumericInput(e.target.value, setDroneLevel, false)
              }
              placeholder="1-50"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Drone Components</label>
            <select
              value={droneComponents}
              onChange={(e) => setDroneComponents(e.target.value)}
              className={selectClass}
            >
              {DRONE_COMPONENT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Step 4: Collection & Progression */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            Step 4 of 5: Collection & Progression
          </h2>
          <div>
            <label className={labelClass}>Base/Drone Skins Count</label>
            <input
              type="text"
              value={skinsCount}
              onChange={(e) =>
                handleNumericInput(e.target.value, setSkinsCount, false)
              }
              placeholder="e.g. 8"
              className={inputClass}
            />
          </div>

          {season >= 2 && (
            <>
              <div>
                <label className={labelClass}>Overlord Level</label>
                <input
                  type="text"
                  value={overlordLevel}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, setOverlordLevel, false)
                  }
                  placeholder="e.g. 25"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>HQ Level</label>
                <select
                  value={hqLevel}
                  onChange={(e) => setHqLevel(e.target.value)}
                  className={selectClass}
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Oil Tech Tree</label>
                <select
                  value={oilTechTree}
                  onChange={(e) => setOilTechTree(e.target.value)}
                  className={selectClass}
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
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            Step 5 of 5: Resources
          </h2>
          <div>
            <label className={labelClass}>VIP Level</label>
            <select
              value={vipLevel}
              onChange={(e) => setVipLevel(e.target.value)}
              className={selectClass}
            >
              {Array.from({ length: 18 }, (_, i) => i + 1).map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>RSS Reserves</label>
            <select
              value={rssReserves}
              onChange={(e) => setRssReserves(e.target.value)}
              className={selectClass}
            >
              {RSS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Diamonds</label>
            <input
              type="text"
              value={diamonds}
              onChange={(e) => handleNumericInput(e.target.value, setDiamonds)}
              placeholder="e.g. 85,000"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Total Money Spent{' '}
              <span className="text-gray-500 font-normal">
                (Optional — helps calibrate your valuation but is never shared)
              </span>
            </label>
            <select
              value={totalMoneySpent}
              onChange={(e) => setTotalMoneySpent(e.target.value)}
              className={selectClass}
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
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
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
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-lg transition-colors shadow-lg shadow-orange-500/25"
          >
            Get My Value →
          </button>
        )}
      </div>
    </div>
  );
}
