import { useEffect, useMemo, useState } from 'react';
import { SystemMonitor } from '../../api/systemMonitor';

const monitor = new SystemMonitor();
const tabs = [
  { key: 'cpu', label: 'CPU / GPU', hint: 'performance' },
  { key: 'memory', label: 'MEMORY', hint: 'allocation' },
  { key: 'network', label: 'NETWORK', hint: 'throughput' },
  { key: 'processes', label: 'PROCESSES', hint: 'activity' },
];

function Bar({ value, max = 100, color = 'green' }) {
  const width = Math.min(100, Math.max(2, (value / max) * 100));
  const colors = { green: 'bg-[#a4f67c]', amber: 'bg-[#f4c45f]', purple: 'bg-[#b294ed]' };
  return (
    <span className="block h-2 bg-[#1c3228]">
      <span className={`block h-full ${colors[color]}`} style={{ width: `${width}%` }} />
    </span>
  );
}

function MiniChart({ values, color = 'green' }) {
  const max = Math.max(...values, 1);
  const barColor = color === 'blue' ? 'bg-[#72b9f0]' : 'bg-[#a4f67c]';
  return (
    <div className="flex h-[54px] items-end gap-1.5 pt-1">
      {values.map((value, index) => (
        <i
          className={`block min-h-[5px] flex-1 opacity-80 ${barColor}`}
          key={`${value}-${index}`}
          style={{ height: `${Math.max(8, (value / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

export function TerminalDashboard({ onSignOut }) {
  const [snapshot, setSnapshot] = useState(() => monitor.readSnapshot());
  const [active, setActive] = useState('cpu');
  const [paused, setPaused] = useState(false);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([]);
  const [chart, setChart] = useState([39, 45, 42, 57, 51, 63, 48, 55, 50, 59]);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => {
      const next = monitor.readSnapshot();
      setSnapshot(next);
      setChart((values) => [...values.slice(-11), next.cpu]);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    function onKey(event) {
      if (event.key >= '1' && event.key <= '4') setActive(tabs[Number(event.key) - 1].key);
      if (event.key === ' ') {
        event.preventDefault();
        setPaused((value) => !value);
      }
      if (event.key === 'Escape') setCommand('');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const memoryPercent = (snapshot.memory.used / snapshot.memory.total) * 100;
  const diskPercent = (snapshot.disk.used / snapshot.disk.total) * 100;
  const commandResult = useMemo(() => history.slice(-3), [history]);

  function runCommand(event) {
    event.preventDefault();
    const value = command.trim();
    if (!value) return;
    setHistory((items) => [
      ...items,
      value === 'clear' ? '' : `> ${value}: command not found — try 1–4 or space`,
    ]);
    setCommand('');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0c1512] to-[#090d0c] px-3 font-mono text-[#d7ded8] sm:px-[4vw]">
      <header className="flex h-[70px] items-center justify-between border-b border-[#20372e]">
        <div className="text-lg text-[#eff7ee]">
          <span className="mr-2.5 inline-block h-2 w-2 rounded-full bg-[#a4f67c] shadow-[0_0_10px_#a4f67c]" />
          syswatch<span className="ml-3 text-[10px] text-[#779187]">v1.0.4</span>
        </div>
        <div className="text-[11px] text-[#779187]">
          <span className="mr-2.5 inline-block h-2 w-2 rounded-full bg-[#a4f67c] shadow-[0_0_10px_#a4f67c]" />{' '}
          LIVE <span className="mx-3 text-[#3b5f50]">/</span> {snapshot.uptime} uptime{' '}
          <button
            className="ml-4 bg-transparent text-[11px] uppercase text-[#ef967b]"
            onClick={onSignOut}
          >
            exit
          </button>
        </div>
      </header>
      <div className="mx-auto mt-6 max-w-[1450px] border border-[#29483b] bg-[#0a120f] shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-[#1b3229] px-4 py-3 text-xs">
          <span>
            <span className="text-[#a4f67c]">operator@syswatch:~$</span> system monitor
          </span>
          <span className="text-[#779187]">
            {new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
        </div>
        <nav
          className="flex overflow-x-auto border-b border-[#20372e]"
          aria-label="Monitor sections"
        >
          {tabs.map((tab, index) => (
            <button
              className={`min-w-[145px] flex-1 border-0 border-r border-[#1b3229] bg-transparent px-4 py-4 text-left text-[#698277] ${active === tab.key ? 'bg-[#13251c] text-[#e4f5e2] shadow-[inset_0_-2px_#a4f67c]' : ''}`}
              onClick={() => setActive(tab.key)}
              key={tab.key}
            >
              <kbd className="mr-2 border border-[#496958] px-1.5 py-0.5 text-[10px] text-[#b9ef9e]">
                {index + 1}
              </kbd>
              {tab.label}
              <small className="mt-2 block pl-6 text-[10px] text-[#779187]">{tab.hint}</small>
            </button>
          ))}
        </nav>
        <section className="grid gap-px border-b border-[#20372e] bg-[#20372e] md:grid-cols-[1.3fr_1fr_1fr]">
          <article className="bg-[#0b1511] p-[18px]">
            <div className="mb-[18px] flex justify-between text-[11px] tracking-wider text-[#779187]">
              <span>CPU LOAD</span>
              <span className="text-base text-[#ebf6e9]">{snapshot.cpu}%</span>
            </div>
            <MiniChart values={chart} />
            <div className="mt-3 flex justify-between text-[10px] text-[#688276]">
              <span>1m {snapshot.load[0]}</span>
              <span>5m {snapshot.load[1]}</span>
              <span>15m {snapshot.load[2]}</span>
            </div>
          </article>
          <article className="bg-[#0b1511] p-[18px]">
            <div className="mb-[18px] flex justify-between text-[11px] tracking-wider text-[#779187]">
              <span>MEMORY</span>
              <span className="text-base text-[#ebf6e9]">{snapshot.memory.used.toFixed(1)} GB</span>
            </div>
            <Bar value={memoryPercent} color="amber" />
            <div className="mt-3 flex justify-between text-[10px] text-[#688276]">
              <span>{memoryPercent.toFixed(0)}% used</span>
              <span>{snapshot.memory.total} GB total</span>
            </div>
          </article>
          <article className="bg-[#0b1511] p-[18px]">
            <div className="mb-[18px] flex justify-between text-[11px] tracking-wider text-[#779187]">
              <span>DISK / ROOT</span>
              <span className="text-base text-[#ebf6e9]">{snapshot.disk.used} GB</span>
            </div>
            <Bar value={diskPercent} color="purple" />
            <div className="mt-3 flex justify-between text-[10px] text-[#688276]">
              <span>{diskPercent.toFixed(0)}% used</span>
              <span>{snapshot.disk.total} GB total</span>
            </div>
          </article>
        </section>
        <section className="grid gap-px bg-[#20372e] lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="overflow-x-auto bg-[#0b1511] py-[18px]">
            <div className="mb-[18px] flex justify-between px-[18px] text-[11px] tracking-wider text-[#779187]">
              <span>
                PROCESS LIST{' '}
                <em className="text-[#a4f67c] not-italic">({snapshot.processes.length})</em>
              </span>
              <span>sorted by cpu</span>
            </div>
            <div className="grid min-w-[640px] grid-cols-[70px_minmax(150px,1.5fr)_90px_70px_70px_90px] gap-2 border-b border-[#1b3229] px-[18px] py-2 text-[10px] text-[#698277]">
              <span>PID</span>
              <span>COMMAND</span>
              <span>USER</span>
              <span>CPU</span>
              <span>MEM</span>
              <span>STATE</span>
            </div>
            {snapshot.processes.map((process) => (
              <div
                className="grid min-w-[640px] grid-cols-[70px_minmax(150px,1.5fr)_90px_70px_70px_90px] gap-2 border-b border-[#14251e] px-[18px] py-2.5 text-[11px] text-[#adc1b1] hover:bg-[#11231a]"
                key={process.pid}
              >
                <span>{process.pid}</span>
                <span className="text-[#e0ebdc]">{process.command}</span>
                <span>{process.user}</span>
                <span>{process.cpu.toFixed(1)}%</span>
                <span>{process.memory.toFixed(1)}%</span>
                <span
                  className={
                    process.state === 'running'
                      ? 'text-[#a4f67c]'
                      : process.state === 'sleeping'
                        ? 'text-[#f4c45f]'
                        : 'text-[#799188]'
                  }
                >
                  {process.state}
                </span>
              </div>
            ))}
          </article>
          <aside className="grid gap-px bg-[#20372e] sm:grid-cols-2 lg:grid-cols-1">
            <article className="bg-[#0b1511] p-[18px]">
              <div className="mb-[18px] flex justify-between text-[11px] tracking-wider text-[#779187]">
                <span>NETWORK</span>
                <span className="text-[#a4f67c]">connected</span>
              </div>
              <div className="mb-5 flex justify-between text-lg text-[#dbeade]">
                <span>
                  ↓ {snapshot.network.down}{' '}
                  <small className="text-[10px] text-[#779187]">MB/s</small>
                </span>
                <span>
                  ↑ {snapshot.network.up} <small className="text-[10px] text-[#779187]">MB/s</small>
                </span>
              </div>
              <MiniChart values={[20, 30, 24, 40, 34, 62, 45, 49, 70, 56]} color="blue" />
            </article>
            <article className="bg-[#0b1511] p-[18px]">
              <div className="mb-[18px] text-[11px] tracking-wider text-[#779187]">KEYBOARD</div>
              <p className="my-1 text-[11px] leading-8 text-[#789184]">
                <kbd>1</kbd> CPU <kbd>2</kbd> memory
              </p>
              <p className="my-1 text-[11px] leading-8 text-[#789184]">
                <kbd>3</kbd> network <kbd>4</kbd> processes
              </p>
              <p className="my-1 text-[11px] leading-8 text-[#789184]">
                <kbd>space</kbd> {paused ? 'resume' : 'pause'} <kbd>esc</kbd> clear
              </p>
            </article>
          </aside>
        </section>
        <div className="flex items-center justify-between border-t border-[#20372e] px-[18px] py-3 text-xs">
          <form onSubmit={runCommand} className="m-0 flex flex-1 gap-2">
            <span className="text-[#a4f67c]">operator@syswatch:~$</span>
            <input
              className="flex-1 border-0 bg-transparent p-0 font-mono text-xs text-[#d7ded8] outline-none"
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              aria-label="Terminal command"
              placeholder={`viewing ${active} · type a command`}
              autoComplete="off"
            />
          </form>
          <span className={paused ? 'text-[#f4c45f]' : 'text-[#a4f67c]'}>
            ● {paused ? 'paused' : 'streaming'}
          </span>
        </div>
        {commandResult.length > 0 && (
          <div className="border-t border-[#20372e] px-[18px] py-2.5 text-[11px] text-[#e9947d]">
            {commandResult.map((item, index) => (
              <div key={`${item}-${index}`}>{item || 'cleared'}</div>
            ))}
          </div>
        )}
      </div>
      <footer className="mx-auto flex max-w-[1450px] flex-wrap justify-between gap-2 py-[18px] text-[10px] tracking-wider text-[#779187]">
        <span>SYSWATCH TERMINAL MONITOR</span>
        <span>keyboard navigation enabled</span>
        <span>data refreshes every 1.8s</span>
      </footer>
    </main>
  );
}
