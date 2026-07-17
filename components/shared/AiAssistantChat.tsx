"use client"

import * as React from "react"
import { useAtomValue } from "jotai"
import { Bot, Loader2, Send, Trash2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { authSessionAtom } from "@/lib/store/auth"

const CHAT_API_URL = "https://trustnet-legal-assistant.azurewebsites.net/api/chat"
const CLEAR_CHAT_API_URL = "https://trustnet-legal-assistant.azurewebsites.net/api/clear"

interface ChatMessage {
  id: string
  role: "assistant" | "user"
  content: string
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content: "Hello, how can I be of help?",
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-primary"
          >
            {children}
          </a>
        ),
        ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>,
        ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>,
        li: ({ children }) => <li className="leading-snug">{children}</li>,
        h1: ({ children }) => <h1 className="mb-1.5 mt-2 text-base font-semibold first:mt-0">{children}</h1>,
        h2: ({ children }) => <h2 className="mb-1.5 mt-2 text-sm font-semibold first:mt-0">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-1 mt-2 text-sm font-semibold first:mt-0">{children}</h3>,
        code: ({ children }) => (
          <code className="rounded bg-black/10 px-1 py-0.5 font-mono text-[0.85em] dark:bg-white/10">
            {children}
          </code>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mb-2 border-l-2 pl-2 italic text-muted-foreground last:mb-0">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export function AiAssistantChat() {
  const authSession = useAtomValue(authSessionAtom)
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [input, setInput] = React.useState("")
  const [isSending, setIsSending] = React.useState(false)
  const [isClearing, setIsClearing] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const sessionIdRef = React.useRef<string | null>(null)

  if (!sessionIdRef.current) {
    sessionIdRef.current =
      authSession?.user?.id ||
      authSession?.user?.email ||
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `session-${Date.now()}`)
  }

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, isSending])

  async function sendMessage() {
    const trimmed = input.trim()
    if (!trimmed || isSending) return
    setError(null)
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", content: trimmed }])
    setInput("")
    setIsSending(true)
    try {
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, session_id: sessionIdRef.current }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const data: { response: string; session_id: string } = await res.json()
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", content: data.response }])
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  async function clearChat() {
    if (isClearing || isSending) return
    setError(null)
    setIsClearing(true)
    try {
      const res = await fetch(CLEAR_CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionIdRef.current }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      setMessages([INITIAL_MESSAGE])
    } catch {
      setError("Could not clear the chat. Please try again.")
    } finally {
      setIsClearing(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-20 right-5 h-12 w-12 rounded-full shadow-lg sm:bottom-24 sm:right-6 sm:h-14 sm:w-14"
          size="icon"
          aria-label="Open AI assistant"
        >
          <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-[min(24rem,100vw)] max-w-sm flex-col gap-0 p-0">
        <SheetHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between gap-2 pr-6">
            <SheetTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Assistant
            </SheetTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={clearChat}
              disabled={isClearing || isSending || messages.length <= 1}
            >
              {isClearing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              Clear chat
            </Button>
          </div>
          <SheetDescription>Ask about compliance & legal requirements</SheetDescription>
        </SheetHeader>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                  m.role === "user"
                    ? "whitespace-pre-wrap bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                {m.role === "assistant" ? <MarkdownContent content={m.content} /> : m.content}
              </div>
            </div>
          ))}
          {isSending ? (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-muted px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking...
              </div>
            </div>
          ) : null}
        </div>

        {error ? <div className="px-4 pb-2 text-xs text-destructive">{error}</div> : null}

        <div className="border-t p-3">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              rows={1}
              className="min-h-9 resize-none"
              disabled={isSending}
            />
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={isSending || !input.trim()}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
