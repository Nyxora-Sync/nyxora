'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Code2, Play, RotateCcw, ExternalLink, Server, Atom, Database, Layers,
  Copy, Check, Wand2, Zap,
} from 'lucide-react'
import { cn, getAccent } from '@/lib/utils'

const WEB_TEMPLATES: Record<string, { name: string; html: string; css: string; js: string }> = {
  blank: {
    name: 'Blank',
    html: `<div class="container">\n  <h1>Hello, MERN!</h1>\n  <p>Edit the code and see changes live.</p>\n  <button id="btn">Click me</button>\n  <p id="output"></p>\n</div>`,
    css: `body {\n  font-family: system-ui, sans-serif;\n  display: grid;\n  place-items: center;\n  min-height: 100vh;\n  margin: 0;\n  background: #0f172a;\n  color: #e2e8f0;\n}\n\n.container {\n  text-align: center;\n  padding: 2rem;\n}\n\nh1 {\n  background: linear-gradient(90deg, #10b981, #8b5cf6);\n  -webkit-background-clip: text;\n  background-clip: text;\n  color: transparent;\n  font-size: 2.5rem;\n}\n\nbutton {\n  background: #10b981;\n  color: white;\n  border: none;\n  padding: 0.6rem 1.5rem;\n  border-radius: 0.5rem;\n  font-size: 1rem;\n  cursor: pointer;\n  transition: transform 0.15s;\n}\n\nbutton:hover { transform: scale(1.05); }`,
    js: `let count = 0;\nconst btn = document.getElementById('btn');\nconst output = document.getElementById('output');\n\nbtn.addEventListener('click', () => {\n  count++;\n  output.textContent = \`Clicked \${count} time\${count === 1 ? '' : 's'}!\`;\n});`,
  },
  fetch: {
    name: 'Fetch API',
    html: `<div class="container">\n  <h1>Fetch API Demo</h1>\n  <p>Fetching a user from JSONPlaceholder...</p>\n  <pre id="result">Loading...</pre>\n  <button id="refetch">Refetch</button>\n</div>`,
    css: `body {\n  font-family: system-ui, sans-serif;\n  background: #0f172a;\n  color: #e2e8f0;\n  padding: 2rem;\n  margin: 0;\n}\n\nh1 { color: #10b981; }\n\npre {\n  background: #1e293b;\n  padding: 1rem;\n  border-radius: 0.5rem;\n  overflow-x: auto;\n  border: 1px solid #334155;\n}\n\nbutton {\n  background: #8b5cf6;\n  color: white;\n  border: none;\n  padding: 0.5rem 1.2rem;\n  border-radius: 0.375rem;\n  cursor: pointer;\n}`,
    js: `async function fetchUser() {\n  const result = document.getElementById('result');\n  result.textContent = 'Loading...';\n  try {\n    const res = await fetch('https://jsonplaceholder.typicode.com/users/1');\n    if (!res.ok) throw new Error('HTTP ' + res.status);\n    const user = await res.json();\n    result.textContent = JSON.stringify(\n      { name: user.name, email: user.email, city: user.address.city },\n      null, 2\n    );\n  } catch (err) {\n    result.textContent = 'Error: ' + err.message;\n  }\n}\n\ndocument.getElementById('refetch').addEventListener('click', fetchUser);\nfetchUser();`,
  },
  array: {
    name: 'Array Methods',
    html: `<div class="container">\n  <h1>Array Methods Playground</h1>\n  <p>Open the console or see results below.</p>\n  <pre id="output"></pre>\n</div>`,
    css: `body {\n  font-family: 'SF Mono', Menlo, monospace;\n  background: #0f172a;\n  color: #e2e8f0;\n  padding: 2rem;\n  margin: 0;\n}\n\nh1 { color: #f59e0b; font-family: system-ui; }\n\npre {\n  background: #1e293b;\n  padding: 1rem;\n  border-radius: 0.5rem;\n  border: 1px solid #334155;\n  white-space: pre-wrap;\n}`,
    js: `const products = [\n  { name: 'Laptop', price: 999, inStock: true },\n  { name: 'Mouse', price: 25, inStock: true },\n  { name: 'Monitor', price: 299, inStock: false },\n  { name: 'Keyboard', price: 79, inStock: true },\n];\n\n// Try: map, filter, reduce, find, some, every\nconst inStockNames = products.filter(p => p.inStock).map(p => p.name);\nconst totalValue = products.reduce((sum, p) => sum + p.price, 0);\nconst anyExpensive = products.some(p => p.price > 500);\n\nconst output = [\n  'In stock:      ' + inStockNames.join(', '),\n  'Total value:   $' + totalValue,\n  'Has expensive: ' + anyExpensive,\n  'Names sorted:  ' + products.map(p => p.name).sort().join(', '),\n].join('\\n');\n\ndocument.getElementById('output').textContent = output;`,
  },
}

const LAUNCH_ENVIRONMENTS = [
  {
    id: 'react',
    name: 'React + Vite',
    description: 'Full React app with hot reload, JSX, and npm packages.',
    icon: Atom,
    color: 'violet',
    url: 'https://stackblitz.com/fork/vite-react-ts',
    tags: ['JSX', 'Hooks', 'HMR'],
  },
  {
    id: 'node',
    name: 'Node.js',
    description: 'Node environment with npm support and a terminal.',
    icon: Server,
    color: 'emerald',
    url: 'https://stackblitz.com/fork/node',
    tags: ['npm', 'Terminal', 'Modules'],
  },
  {
    id: 'express',
    name: 'Express API',
    description: 'Express server with routes, and a free port to test endpoints.',
    icon: Layers,
    color: 'amber',
    url: 'https://stackblitz.com/fork/express',
    tags: ['REST', 'Middleware', 'Routes'],
  },
  {
    id: 'mongodb',
    name: 'MongoDB + Mongoose',
    description: 'Use an in-memory MongoDB via mongodb-memory-server to practice queries.',
    icon: Database,
    color: 'blue',
    url: 'https://stackblitz.com/fork/node',
    tags: ['Mongoose', 'Queries', 'Schemas'],
  },
]

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function PlaygroundClient() {
  const [template, setTemplate] = useState('blank')
  const [html, setHtml] = useState(WEB_TEMPLATES.blank.html)
  const [css, setCss] = useState(WEB_TEMPLATES.blank.css)
  const [js, setJs] = useState(WEB_TEMPLATES.blank.js)
  const [activeTab, setActiveTab] = useState('html')
  const [copied, setCopied] = useState(false)

  // Persist to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mern-learn-playground')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Hydrate editor from localStorage (external store) on mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHtml(parsed.html ?? WEB_TEMPLATES.blank.html)
        setCss(parsed.css ?? WEB_TEMPLATES.blank.css)
        setJs(parsed.js ?? WEB_TEMPLATES.blank.js)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('mern-learn-playground', JSON.stringify({ html, css, js }))
    } catch {}
  }, [html, css, js])

  const debouncedHtml = useDebouncedValue(html, 500)
  const debouncedCss = useDebouncedValue(css, 500)
  const debouncedJs = useDebouncedValue(js, 500)

  const srcDoc = useMemo(() => {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>${debouncedCss}</style>
</head>
<body>
${debouncedHtml}
<script>
try {
${debouncedJs}
} catch (err) {
  document.body.innerHTML += '<pre style="color:#f87171;background:#450a0a;padding:1rem;border-radius:0.5rem;font-size:0.85rem;">Error: ' + err.message + '</pre>';
  console.error(err);
}
</script>
</body>
</html>`
  }, [debouncedHtml, debouncedCss, debouncedJs])

  const [previewKey, setPreviewKey] = useState(0)

  const applyTemplate = (key: string) => {
    const t = WEB_TEMPLATES[key]
    if (!t) return
    setTemplate(key)
    setHtml(t.html)
    setCss(t.css)
    setJs(t.js)
    setPreviewKey((k) => k + 1)
  }

  const resetAll = () => {
    const t = WEB_TEMPLATES[template] || WEB_TEMPLATES.blank
    setHtml(t.html)
    setCss(t.css)
    setJs(t.js)
    setPreviewKey((k) => k + 1)
  }

  const handleCopy = async () => {
    const code = activeTab === 'html' ? html : activeTab === 'css' ? css : js
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const currentCode = activeTab === 'html' ? html : activeTab === 'css' ? css : js
  const setCurrentCode = activeTab === 'html' ? setHtml : activeTab === 'css' ? setCss : setJs

  return (
    <div className="space-y-16">
      {/* Web Playground */}
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Zap className="h-6 w-6 text-amber-500" aria-hidden="true" />
              Web Playground
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              HTML, CSS & JavaScript — runs locally, saved automatically.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(WEB_TEMPLATES).map(([key, t]) => (
              <Button
                key={key}
                variant={template === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => applyTemplate(key)}
              >
                {key === 'blank' && <Wand2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />}
                {t.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Editor side */}
          <div className="rounded-xl border border-border/50 overflow-hidden bg-card">
            <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="h-8">
                  <TabsTrigger value="html" className="text-xs h-7 px-3">HTML</TabsTrigger>
                  <TabsTrigger value="css" className="text-xs h-7 px-3">CSS</TabsTrigger>
                  <TabsTrigger value="js" className="text-xs h-7 px-3">JS</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy} aria-label="Copy code">
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetAll} aria-label="Reset code">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <textarea
              value={currentCode}
              onChange={(e) => setCurrentCode(e.target.value)}
              spellCheck={false}
              className="w-full h-[400px] resize-none bg-[#0f172a] text-slate-200 p-4 font-mono text-sm leading-relaxed focus:outline-none"
              aria-label={`${activeTab} code editor`}
            />
          </div>

          {/* Preview side */}
          <div className="rounded-xl border border-border/50 overflow-hidden bg-card flex flex-col">
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">Preview</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={() => setPreviewKey((k) => k + 1)}
              >
                <Play className="h-3 w-3" aria-hidden="true" />
                Re-run
              </Button>
            </div>
            <iframe
              key={previewKey}
              srcDoc={srcDoc}
              sandbox="allow-scripts"
              title="Code preview"
              className="w-full h-[400px] bg-white"
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Tip: The preview re-runs automatically as you type (with a short delay).
          Use <kbd className="rounded border border-border px-1 text-xs sm:text-[10px]">Re-run</kbd> to force a refresh.
        </p>
      </div>

      {/* Full environments */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Code2 className="h-6 w-6 text-violet-500" aria-hidden="true" />
            Full Development Environments
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Node.js, Express, React and MongoDB need a real runtime. These launch instantly in
            StackBlitz — a free, browser-based dev environment. No installation, no account required.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {LAUNCH_ENVIRONMENTS.map((env) => (
            <Card key={env.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div
                    className={cn('flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl', getAccent(env.color).icon)}
                  >
                    <env.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{env.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{env.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {env.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs sm:text-[10px]">{tag}</Badge>
                      ))}
                    </div>
                    <Button size="sm" className="mt-4 gap-2" asChild>
                      <a href={env.url} target="_blank" rel="noopener noreferrer">
                        <Play className="h-3.5 w-3.5" aria-hidden="true" />
                        Launch {env.name}
                        <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">💡 How it works</p>
          StackBlitz runs a full Node.js environment in your browser using WebContainers technology.
          Everything is free and your code never leaves your machine.
        </div>
      </div>
    </div>
  )
}