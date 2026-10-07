'use client';

import React, { useState } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft } from 'lucide-react';
import { CopyButton } from './CopyButton';

interface CommandOutput {
  command: string;
  output: string | React.ReactNode;
}

export const InteractiveTerminal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'console' | 'env' | 'curl'>('console');
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: 'npx alex-morgan-dev --status',
      output: (
        <div className="space-y-1 text-xs text-white">
          <p className="text-[#0F9A73] font-semibold">✔ Status: Available for Staff/Senior Full-Stack &amp; Lead Roles</p>
          <p className="text-slate-300">Core Stack: Next.js 15, TypeScript, Node.js, PostgreSQL, Docker, AWS</p>
          <p className="text-[#0F9A73] font-mono">Location: San Francisco, CA (Open to Worldwide Remote &amp; Hybrid)</p>
        </div>
      ),
    },
  ]);

  const quickCommands = [
    { label: 'alex.skills()', cmd: 'alex.skills()' },
    { label: 'alex.experience()', cmd: 'alex.experience()' },
    { label: 'alex.contact()', cmd: 'alex.contact()' },
    { label: 'clear', cmd: 'clear' },
  ];

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim();
    if (!cleanCmd) return;

    if (cleanCmd.toLowerCase() === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    let result: React.ReactNode = '';

    switch (cleanCmd.toLowerCase()) {
      case 'alex.skills()':
      case 'skills':
        result = (
          <div className="text-xs space-y-1 text-slate-200">
            <span className="text-[#0F9A73] font-mono font-semibold">Frontend:</span> React 19, Next.js 15, TypeScript, Tailwind CSS, TanStack Query<br />
            <span className="text-[#0F9A73] font-mono font-semibold">Backend:</span> Node.js, Express, Go, NestJS, REST APIs, GraphQL<br />
            <span className="text-[#0F9A73] font-mono font-semibold">Data &amp; Cloud:</span> PostgreSQL, Redis, Prisma, Docker, Kubernetes, AWS
          </div>
        );
        break;
      case 'alex.experience()':
      case 'experience':
        result = (
          <div className="text-xs space-y-1 text-slate-200">
            <p className="font-semibold text-white">Staff Software Engineer @ HyperScale Cloud (2023 - Present)</p>
            <p className="text-slate-300">Leading multi-tenant microservices supporting 10M+ daily events.</p>
            <p className="font-semibold text-white mt-2">Senior Full-Stack Engineer @ FinTech Dynamics (2021 - 2023)</p>
            <p className="text-slate-300">Architected Next.js trading desk with sub-50ms latency.</p>
          </div>
        );
        break;
      case 'alex.contact()':
      case 'contact':
        result = (
          <div className="text-xs space-y-1 text-slate-200">
            <p>Email: <a href="mailto:alex@alexmorgan.dev" className="text-[#0F9A73] underline">alex@alexmorgan.dev</a></p>
            <p>GitHub: <a href="https://github.com/alexmorgan" target="_blank" rel="noreferrer" className="text-[#0F9A73] underline">github.com/alexmorgan</a></p>
            <p>LinkedIn: <a href="https://linkedin.com/in/alexmorgan-dev" target="_blank" rel="noreferrer" className="text-[#0F9A73] underline">linkedin.com/in/alexmorgan-dev</a></p>
          </div>
        );
        break;
      case 'help':
        result = (
          <p className="text-xs text-slate-300">
            Available commands: <code className="text-[#0F9A73]">alex.skills()</code>, <code className="text-[#0F9A73]">alex.experience()</code>, <code className="text-[#0F9A73]">alex.contact()</code>, <code className="text-[#0F9A73]">clear</code>
          </p>
        );
        break;
      default:
        result = (
          <p className="text-xs text-rose-400">
            Command not recognized: &quot;{cleanCmd}&quot;. Type <span className="text-[#0F9A73] underline cursor-pointer" onClick={() => handleCommand('help')}>help</span> for list of commands.
          </p>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: cleanCmd, output: result }]);
    setInputVal('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(inputVal);
  };

  return (
    <div className="w-full rounded-2xl border border-white/15 bg-[#000033]/95 backdrop-blur-xl shadow-2xl overflow-hidden font-mono text-left">
      {/* Top Console Bar in #00007B */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#00007B] border-b border-white/15">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block border border-rose-600/40" />
            <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block border border-amber-600/40" />
            <span className="w-3 h-3 rounded-full bg-[#0F9A73] inline-block border border-[#0F9A73]/40" />
          </div>
          <span className="text-xs text-white/90 font-medium ml-2 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-[#0F9A73]" />
            developer@alex-macbook-pro ~ zsh
          </span>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 text-[11px]">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'console'
                ? 'bg-[#0F9A73]/25 text-white font-bold border border-[#0F9A73]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            interactive.sh
          </button>
          <button
            onClick={() => setActiveTab('curl')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'curl'
                ? 'bg-[#0F9A73]/25 text-white font-bold border border-[#0F9A73]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            curl-api
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'env'
                ? 'bg-[#0F9A73]/25 text-white font-bold border border-[#0F9A73]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            stack.json
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 sm:p-5 text-sm min-h-[220px] max-h-[300px] overflow-y-auto">
        {activeTab === 'console' && (
          <div className="space-y-3">
            {history.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#0F9A73] font-bold">➜</span>
                  <span className="text-[#0F9A73] font-medium">~</span>
                  <span className="text-white font-medium">{item.command}</span>
                </div>
                <div className="pl-4 py-1 border-l border-[#0F9A73]/30">{item.output}</div>
              </div>
            ))}

            {/* Prompt input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
              <span className="text-[#0F9A73] font-bold text-xs">➜</span>
              <span className="text-[#0F9A73] font-medium text-xs">~</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="type 'alex.skills()' or click below..."
                className="flex-1 bg-transparent text-xs text-white placeholder-white/40 focus:outline-none font-mono"
              />
              <button
                type="submit"
                className="text-white/60 hover:text-[#0F9A73] transition-colors"
                title="Execute command"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Command Chips */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-white/50">Quick run:</span>
              {quickCommands.map((qc) => (
                <button
                  key={qc.label}
                  type="button"
                  onClick={() => handleCommand(qc.cmd)}
                  className="px-2 py-0.5 text-[11px] rounded bg-white/5 hover:bg-[#0F9A73]/20 hover:text-white border border-white/10 hover:border-[#0F9A73] text-white/80 transition-colors"
                >
                  {qc.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'curl' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/70">// Fetch live portfolio schema via curl:</span>
              <CopyButton text="curl -s https://alexmorgan.dev/api/profile | jq ." label="Copy" />
            </div>
            <pre className="p-3 bg-[#000022] rounded-lg text-xs text-[#0F9A73] border border-white/10 overflow-x-auto">
              <code>{`$ curl -X GET https://alexmorgan.dev/api/profile \\
    -H "Accept: application/json"

{
  "status": "success",
  "data": {
    "engineer": "Debkanta Dey",
    "role": "Senior Full-Stack & Systems Architect",
    "experience": 8,
    "openFor": ["Full-Time", "Contract Staff Augmentation", "Advisory"],
    "verifiedStack": ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"]
  }
}`}</code>
            </pre>
          </div>
        )}

        {activeTab === 'env' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/70">// runtime_environment.json</span>
              <CopyButton text='{"runtime": "Node 24 / Next.js 15", "db": "PostgreSQL 16", "orm": "Prisma"}' label="Copy" />
            </div>
            <pre className="p-3 bg-[#000022] rounded-lg text-xs text-white border border-white/10 overflow-x-auto">
              <code>{`{
  "node_version": "v24.2.0",
  "framework": "Next.js 15.5 (App Router)",
  "language": "TypeScript 5.7 (Strict)",
  "database": "PostgreSQL 16 with Prisma ORM",
  "styling": "Tailwind CSS + Custom Palette (#00007B, #fff, #0F9A73)",
  "deployment": "Docker Multi-stage + Kubernetes ready",
  "observability": "OpenTelemetry + Structured Logging"
}`}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
