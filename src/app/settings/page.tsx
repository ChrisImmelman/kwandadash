"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Copy, Check, Eye, EyeOff } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  createdAt: string;
}

interface NewKey extends ApiKey {
  key: string;
}

export default function SettingsPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<NewKey | null>(null);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/keys").then((r) => r.json()).then(setKeys);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName }),
    });
    const data = await res.json();
    setGeneratedKey(data);
    setKeys((prev) => [{ id: data.id, name: data.name, createdAt: data.createdAt }, ...prev]);
    setNewKeyName("");
    setCreating(false);
    setShowKey(true);
  }

  async function handleRevoke(id: string) {
    await fetch("/api/keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setKeys((prev) => prev.filter((k) => k.id !== id));
    if (generatedKey?.id === id) setGeneratedKey(null);
  }

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <span className="font-mono-brand text-xs uppercase tracking-widest text-clay font-bold">
          Configuration
        </span>
        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-moss mt-2">
          Settings
        </h1>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Generate new key */}
        <div className="bg-moss/[0.03] border border-moss/10 rounded-[2rem] p-6 md:p-8">
          <h2 className="font-heading font-bold text-lg text-moss mb-1">API Keys</h2>
          <p className="font-subheading text-sm text-moss/50 mb-6">
            Generate keys for your agents to write to this dashboard programmatically.
          </p>

          <form onSubmit={handleCreate} className="flex gap-3 mb-6">
            <input
              required
              placeholder="Key name (e.g. My Agent)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-cream border border-moss/15 text-moss font-subheading text-sm placeholder:text-moss/40 focus:outline-none focus:ring-2 focus:ring-clay/40 transition-shadow"
            />
            <button
              type="submit"
              disabled={creating}
              className="magnetic-btn bg-clay text-cream px-5 py-2.5 rounded-full font-heading font-medium text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <span className="btn-bg-slide bg-moss" />
              <span className="relative z-10 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Generate
              </span>
            </button>
          </form>

          {/* Newly generated key banner */}
          {generatedKey && (
            <div className="mb-6 bg-moss/5 border border-moss/20 rounded-2xl p-5">
              <p className="font-mono-brand text-[10px] uppercase tracking-widest text-clay font-bold mb-2">
                New key — copy it now, it won&apos;t be shown again
              </p>
              <div className="flex items-center gap-3">
                <code className="flex-1 font-mono-brand text-xs text-moss bg-cream rounded-xl px-4 py-3 border border-moss/10 overflow-x-auto">
                  {showKey ? generatedKey.key : "kwanda_" + "•".repeat(48)}
                </code>
                <button
                  onClick={() => setShowKey((v) => !v)}
                  className="text-moss/40 hover:text-moss transition-colors p-2"
                  title={showKey ? "Hide" : "Reveal"}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleCopy(generatedKey.key)}
                  className="text-moss/40 hover:text-clay transition-colors p-2"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Key list */}
          <div className="space-y-2">
            {keys.length === 0 && (
              <p className="text-moss/40 font-subheading text-sm">No API keys yet.</p>
            )}
            {keys.map((k) => (
              <div
                key={k.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-cream border border-moss/10"
              >
                <div>
                  <p className="font-subheading font-medium text-sm text-moss">{k.name}</p>
                  <p className="font-mono-brand text-[10px] text-moss/40 uppercase tracking-widest font-semibold mt-0.5">
                    Created {new Date(k.createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <button
                  onClick={() => handleRevoke(k.id)}
                  className="text-moss/30 hover:text-red-400 transition-colors p-2"
                  title="Revoke key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick reference */}
        <div className="bg-moss/[0.03] border border-moss/10 rounded-[2rem] p-6 md:p-8">
          <h2 className="font-heading font-bold text-lg text-moss mb-4">Quick Reference</h2>
          <div className="space-y-4 font-mono-brand text-xs text-moss/70">
            <div>
              <p className="font-bold text-moss/40 uppercase tracking-widest text-[10px] mb-1">Add a project</p>
              <pre className="bg-cream border border-moss/10 rounded-xl p-4 overflow-x-auto text-moss leading-relaxed">{`POST /api/external/projects
Authorization: Bearer <key>

{ "name": "...", "client": "...", "value": 5000 }`}</pre>
            </div>
            <div>
              <p className="font-bold text-moss/40 uppercase tracking-widest text-[10px] mb-1">Mark project as delivered</p>
              <pre className="bg-cream border border-moss/10 rounded-xl p-4 overflow-x-auto text-moss leading-relaxed">{`POST /api/external/projects/:id/complete
Authorization: Bearer <key>`}</pre>
            </div>
            <div>
              <p className="font-bold text-moss/40 uppercase tracking-widest text-[10px] mb-1">Add an agent</p>
              <pre className="bg-cream border border-moss/10 rounded-xl p-4 overflow-x-auto text-moss leading-relaxed">{`POST /api/external/agents
Authorization: Bearer <key>

{ "name": "...", "client": "...", "price": 500, "pricingModel": "monthly" }`}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
