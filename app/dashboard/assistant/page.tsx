"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase"
import { useCompany } from "@/lib/company-context"
import type { Filing } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import {
  Sparkles,
  Send,
  RotateCcw,
  User,
  Shield,
  ChevronRight,
} from "lucide-react"

// ─── types ─────────────────────────────────────────────────────────────────

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  streaming?: boolean
}

type CompanyContext = {
  name: string
  entityType: string
  state: string
  plan: string
  ein?: string
  formedAt?: string
  totalFilings: number
  overdueFilings: number
  pendingFilings: number
  completedFilings: number
  overdueTypes: string[]
  upcomingTypes: string[]
}

// ─── suggested questions ───────────────────────────────────────────────────

const SUGGESTED: { label: string; prompt: string }[] = [
  {
    label: "What filings are due this quarter?",
    prompt: "Based on my company's profile, what compliance filings are typically due this quarter? What should I prioritize?",
  },
  {
    label: "What is a BOI report?",
    prompt: "Can you explain what a Beneficial Ownership Information (BOI) report is and whether my company needs to file one?",
  },
  {
    label: "Annual report requirements",
    prompt: "What are the annual report requirements for my state? When is it due and what happens if I miss it?",
  },
  {
    label: "Do I need a registered agent?",
    prompt: "Does my company need a registered agent? What do they do and what are the consequences of not having one?",
  },
  {
    label: "What is foreign qualification?",
    prompt: "If I'm operating my business in states other than where I'm incorporated, what is foreign qualification and do I need it?",
  },
  {
    label: "How do quarterly taxes work?",
    prompt: "Can you explain how quarterly estimated tax payments work for my entity type? When are they due?",
  },
]

// ─── helpers ───────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function parseSSEChunk(chunk: string): string {
  const lines = chunk.split("\n")
  let text = ""
  for (const line of lines) {
    if (!line.startsWith("data:")) continue
    const data = line.slice(5).trim()
    if (data === "[DONE]") continue
    try {
      const parsed = JSON.parse(data)
      if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
        text += parsed.delta.text ?? ""
      }
    } catch {
      // skip malformed lines
    }
  }
  return text
}

// ─── message bubble ────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"
  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
        isUser ? "bg-[#1B2B4B]" : "bg-emerald-500/10"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Shield className="w-4 h-4 text-emerald-500" />
        )}
      </div>

      {/* Bubble */}
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
        isUser
          ? "bg-[#1B2B4B] text-white rounded-tr-sm"
          : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
      )}>
        {message.streaming && !message.content ? (
          <div className="flex items-center gap-1.5 py-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        ) : (
          <div className="whitespace-pre-wrap">
            {message.content}
            {message.streaming && (
              <span className="inline-block w-0.5 h-4 bg-emerald-500 animate-pulse ml-0.5 align-middle" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── main component ─────────────────────────────────────────────────────────

export default function AssistantPage() {
  const { selectedCompany } = useCompany()
  const [filings, setFilings] = useState<Filing[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Load filings for company context
  useEffect(() => {
    if (!selectedCompany) return
    const supabase = createClient()
    supabase
      .from("filings")
      .select("*")
      .eq("company_id", selectedCompany.id)
      .then(({ data }) => setFilings(data ?? []))
  }, [selectedCompany])

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-resize textarea
  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px"
  }

  const buildContext = useCallback((): CompanyContext | null => {
    if (!selectedCompany) return null
    const overdue = filings.filter((f) => f.status === "overdue")
    const pending = filings.filter((f) => f.status === "pending")
    const completed = filings.filter((f) => f.status === "completed")
    const today = new Date().toISOString().slice(0, 10)
    const in30 = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10)
    const upcoming = pending.filter((f) => f.due_date >= today && f.due_date <= in30)

    return {
      name: selectedCompany.name,
      entityType: selectedCompany.entity_type,
      state: selectedCompany.state_of_incorporation,
      plan: selectedCompany.plan,
      ein: selectedCompany.ein,
      formedAt: selectedCompany.formed_at,
      totalFilings: filings.length,
      overdueFilings: overdue.length,
      pendingFilings: pending.length,
      completedFilings: completed.length,
      overdueTypes: overdue.slice(0, 5).map((f) => f.type),
      upcomingTypes: upcoming.slice(0, 5).map((f) => f.type),
    }
  }, [selectedCompany, filings])

  async function sendMessage(userText: string) {
    if (!userText.trim() || loading) return

    const userMsg: ChatMessage = { id: uid(), role: "user", content: userText.trim() }
    const assistantMsg: ChatMessage = { id: uid(), role: "assistant", content: "", streaming: true }

    const nextMessages = [...messages, userMsg]
    setMessages([...nextMessages, assistantMsg])
    setInput("")
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
    }
    setLoading(true)
    setApiKeyMissing(false)

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          companyContext: buildContext(),
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }))
        if (err.error?.includes("ANTHROPIC_API_KEY")) {
          setApiKeyMissing(true)
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id
              ? { ...m, content: err.error ?? "Something went wrong. Please try again.", streaming: false }
              : m
          )
        )
        return
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error("No reader")

      const decoder = new TextDecoder()
      let buffer = ""
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        // Process complete SSE lines
        const lines = buffer.split("\n\n")
        buffer = lines.pop() ?? "" // keep incomplete last chunk

        for (const chunk of lines) {
          const delta = parseSSEChunk(chunk)
          if (delta) {
            fullText += delta
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsg.id ? { ...m, content: fullText } : m
              )
            )
          }
        }
      }

      // Process any remaining buffer
      if (buffer) {
        const delta = parseSSEChunk(buffer)
        if (delta) fullText += delta
      }

      // Finalize — remove streaming flag
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id ? { ...m, content: fullText, streaming: false } : m
        )
      )
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, content: "Connection error. Please check your internet and try again.", streaming: false }
            : m
        )
      )
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  function resetConversation() {
    setMessages([])
    setInput("")
    setApiKeyMissing(false)
    inputRef.current?.focus()
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-64px)]">

      {/* ── Header ── */}
      <div className="flex-shrink-0 px-4 sm:px-8 py-5 border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">AI Compliance Assistant</h1>
              <p className="text-xs text-slate-400">
                {selectedCompany
                  ? `Answering for ${selectedCompany.name}`
                  : "Ask anything about business compliance"}
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={resetConversation}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New chat
            </button>
          )}
        </div>
      </div>

      {/* ── API key warning ── */}
      {apiKeyMissing && (
        <div className="flex-shrink-0 bg-amber-50 border-b border-amber-200 px-4 sm:px-8 py-3">
          <div className="max-w-3xl mx-auto text-sm text-amber-800">
            <span className="font-semibold">Setup required:</span> Add{" "}
            <code className="bg-amber-100 px-1 rounded text-xs font-mono">ANTHROPIC_API_KEY</code>{" "}
            to your <code className="bg-amber-100 px-1 rounded text-xs font-mono">.env.local</code> file.
            Get a key at{" "}
            <span className="font-semibold">console.anthropic.com</span>.
          </div>
        </div>
      )}

      {/* ── Messages / Empty state ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6">

          {isEmpty ? (
            <div className="space-y-8">
              {/* Welcome */}
              <div className="text-center pt-4">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Your compliance expert, always on
                </h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  Ask about filing deadlines, entity requirements, tax obligations, registered agents,
                  and more — all with context about{" "}
                  {selectedCompany ? (
                    <span className="font-semibold text-slate-700">{selectedCompany.name}</span>
                  ) : (
                    "your company"
                  )}
                  .
                </p>
              </div>

              {/* Suggested questions */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Suggested questions
                </p>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {SUGGESTED.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => sendMessage(s.prompt)}
                      className="group flex items-center justify-between gap-3 text-left px-4 py-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all shadow-sm"
                    >
                      <span className="text-sm text-slate-700 font-medium leading-tight">{s.label}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 flex-shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-slate-400 text-center pb-4">
                Responses are for general informational purposes only and do not constitute legal or tax advice.
                Always consult a licensed attorney or CPA for your specific situation.
              </p>
            </div>
          ) : (
            <div className="space-y-5 pb-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* ── Input bar ── */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-white px-4 sm:px-8 py-4">
        <div className="max-w-3xl mx-auto">
          <div className={cn(
            "flex items-end gap-3 bg-white border rounded-2xl px-4 py-3 transition-shadow",
            loading
              ? "border-slate-200"
              : "border-slate-300 shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-emerald-400"
          )}>
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={loading ? "Thinking..." : "Ask a compliance question…"}
              disabled={loading}
              className="flex-1 resize-none bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none disabled:opacity-60 leading-relaxed max-h-40 overflow-y-auto"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                !loading && input.trim()
                  ? "bg-[#1B2B4B] hover:bg-[#243461] text-white"
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
              )}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-slate-300 text-center mt-2">
            Press <kbd className="font-mono text-[10px] bg-slate-100 border border-slate-200 px-1 rounded">Enter</kbd> to send
            · <kbd className="font-mono text-[10px] bg-slate-100 border border-slate-200 px-1 rounded">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>

    </div>
  )
}
