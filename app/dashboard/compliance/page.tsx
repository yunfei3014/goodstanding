"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase"
import type { Company, Filing } from "@/lib/supabase"
import { useCompany } from "@/lib/company-context"
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Calendar,
  DollarSign,
  FileText,
  ArrowRight,
  X,
  Loader2,
  Plus,
  Trash2,
  Pencil,
} from "lucide-react"

const SUGGESTED_TYPES = [
  "BOI Report (FinCEN)",
  "Quarterly Estimated Tax",
  "State Sales Tax Return",
  "Payroll Tax Deposit",
  "1099-NEC Filing",
  "W-2 Filing",
  "Business License Renewal",
  "Registered Agent Renewal",
  "Foreign Qualification",
]

const US_STATES_AND_FEDERAL = [
  "Federal",
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
]

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") return <Badge variant="green">Filed ✓</Badge>
  if (status === "overdue") return <Badge variant="red">Overdue</Badge>
  if (status === "pending") return <Badge variant="yellow">Pending</Badge>
  return <Badge>N/A</Badge>
}

function StatusIcon({ status }: { status: string }) {
  if (status === "completed") return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
  if (status === "overdue") return <XCircle className="w-5 h-5 text-red-500" />
  return <AlertCircle className="w-5 h-5 text-amber-500" />
}

type FilingWithCompany = Filing & { company: Company | undefined }

function AddFilingModal({
  companies,
  onClose,
  onSuccess,
}: {
  companies: Company[]
  onClose: () => void
  onSuccess: () => void
}) {
  const [companyId, setCompanyId] = useState(companies[0]?.id ?? "")
  const [filingType, setFilingType] = useState("")
  const [customType, setCustomType] = useState("")
  const [jurisdiction, setJurisdiction] = useState("Federal")
  const [dueDate, setDueDate] = useState("")
  const [amount, setAmount] = useState("")
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState<"pending" | "completed" | "not_required">("pending")
  const [filedAt, setFiledAt] = useState(new Date().toISOString().split("T")[0])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const resolvedType = filingType === "Custom" ? customType : filingType
  const canSubmit = companyId && resolvedType && dueDate

  async function handleSave() {
    if (!canSubmit) return
    setSaving(true)
    setError("")
    const supabase = createClient()
    const { error: err } = await supabase.from("filings").insert({
      company_id: companyId,
      type: resolvedType,
      state: jurisdiction,
      due_date: dueDate,
      status,
      ...(amount ? { amount: parseFloat(amount) } : {}),
      ...(notes ? { notes } : {}),
      ...(status === "completed" ? { filed_at: filedAt } : {}),
    })
    setSaving(false)
    if (err) {
      setError(err.message)
    } else {
      onSuccess()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1B2B4B]">Add filing</h2>
            <p className="text-slate-500 text-sm mt-0.5">Track any compliance obligation or deadline</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Company (only if multiple) */}
          {companies.length > 1 && (
            <div>
              <Label className="mb-2 block">Company</Label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Filing type */}
          <div>
            <Label className="mb-2 block">Filing type</Label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {SUGGESTED_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilingType(t)}
                  className={`px-3 py-2 rounded-lg border-2 text-xs text-left transition-all ${
                    filingType === t
                      ? "border-[#1B2B4B] bg-[#1B2B4B]/5 font-semibold text-[#1B2B4B]"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {t}
                </button>
              ))}
              <button
                onClick={() => setFilingType("Custom")}
                className={`px-3 py-2 rounded-lg border-2 text-xs text-left transition-all ${
                  filingType === "Custom"
                    ? "border-[#1B2B4B] bg-[#1B2B4B]/5 font-semibold text-[#1B2B4B]"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                Custom...
              </button>
            </div>
            {filingType === "Custom" && (
              <Input
                placeholder="e.g. California Franchise Tax Extension"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          {/* Jurisdiction + Due date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jurisdiction">Jurisdiction</Label>
              <select
                id="jurisdiction"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="mt-1.5 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {US_STATES_AND_FEDERAL.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="dueDate">Due date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount">Amount (optional)</Label>
            <div className="relative mt-1.5">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <textarea
              id="notes"
              className="mt-1.5 w-full h-20 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Confirmation number, reference, instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Status */}
          <div>
            <Label className="mb-2 block">Status</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["pending", "completed", "not_required"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                    status === s
                      ? "border-[#1B2B4B] bg-[#1B2B4B]/5 font-semibold text-[#1B2B4B]"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {s === "not_required" ? "N/A" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Filed date (if completed) */}
          {status === "completed" && (
            <div>
              <Label htmlFor="filedAt">Date filed</Label>
              <Input
                id="filedAt"
                type="date"
                value={filedAt}
                onChange={(e) => setFiledAt(e.target.value)}
                className="mt-1.5"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1 border-slate-200" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#1B2B4B] hover:bg-[#243461] text-white"
            disabled={!canSubmit || saving}
            onClick={handleSave}
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
            ) : (
              <><Plus className="w-4 h-4 mr-2" />Add filing</>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function MarkFiledModal({
  filing,
  onClose,
  onSuccess,
}: {
  filing: FilingWithCompany
  onClose: () => void
  onSuccess: () => void
}) {
  const today = new Date().toISOString().split("T")[0]
  const [filedAt, setFiledAt] = useState(today)
  const [amount, setAmount] = useState(filing.amount ? String(filing.amount) : "")
  const [notes, setNotes] = useState(filing.notes ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit() {
    setSaving(true)
    setError("")
    const supabase = createClient()
    const { error: err } = await supabase
      .from("filings")
      .update({
        status: "completed",
        filed_at: filedAt,
        ...(amount ? { amount: parseFloat(amount) } : {}),
        ...(notes ? { notes } : {}),
      })
      .eq("id", filing.id)
    setSaving(false)
    if (err) {
      setError(err.message)
    } else {
      onSuccess()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1B2B4B]">Mark as filed</h2>
            <p className="text-slate-500 text-sm mt-0.5">{filing.type}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filing summary */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-400 text-xs mb-0.5">Entity</p>
              <p className="font-semibold text-slate-800">{filing.company?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-0.5">Jurisdiction</p>
              <p className="font-semibold text-slate-800">{filing.state}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-0.5">Due date</p>
              <p className="font-semibold text-slate-800">
                {filing.due_date
                  ? new Date(filing.due_date).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-0.5">Status</p>
              <StatusBadge status={filing.status} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="filedAt">Date filed</Label>
            <Input
              id="filedAt"
              type="date"
              value={filedAt}
              onChange={(e) => setFiledAt(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount paid (optional)</Label>
            <div className="relative mt-1.5">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <textarea
              id="notes"
              className="mt-1.5 w-full h-20 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 resize-none"
              placeholder="Confirmation number, reference, or any notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1 border-slate-200" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={saving || !filedAt}
            onClick={handleSubmit}
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
            ) : (
              <><CheckCircle2 className="w-4 h-4 mr-2" />Confirm filed</>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function EditFilingModal({
  filing,
  onClose,
  onSuccess,
}: {
  filing: FilingWithCompany
  onClose: () => void
  onSuccess: () => void
}) {
  const [filingType, setFilingType] = useState(filing.type)
  const [jurisdiction, setJurisdiction] = useState(filing.state)
  const [dueDate, setDueDate] = useState(filing.due_date ?? "")
  const [status, setStatus] = useState<Filing["status"]>(filing.status)
  const [filedAt, setFiledAt] = useState(filing.filed_at ?? "")
  const [amount, setAmount] = useState(filing.amount != null ? String(filing.amount) : "")
  const [notes, setNotes] = useState(filing.notes ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const isCustomType = !SUGGESTED_TYPES.includes(filingType)

  async function handleSave() {
    if (!filingType.trim() || !dueDate) return
    setSaving(true)
    setError("")
    const supabase = createClient()
    const updates: Partial<Filing> = {
      type: filingType.trim(),
      state: jurisdiction,
      due_date: dueDate,
      status,
      amount: amount ? parseFloat(amount) : undefined,
      notes: notes || undefined,
      filed_at: status === "completed" && filedAt ? filedAt : undefined,
    }
    const { error: err } = await supabase
      .from("filings")
      .update(updates)
      .eq("id", filing.id)
    setSaving(false)
    if (err) setError(err.message)
    else onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1B2B4B]">Edit filing</h2>
            <p className="text-slate-500 text-sm mt-0.5">Update any details for this compliance item</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Filing type */}
          <div>
            <Label className="mb-2 block">Filing type</Label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {SUGGESTED_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilingType(t)}
                  className={`px-3 py-2 rounded-lg border-2 text-xs text-left transition-all ${
                    filingType === t
                      ? "border-[#1B2B4B] bg-[#1B2B4B]/5 font-semibold text-[#1B2B4B]"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {t}
                </button>
              ))}
              <button
                onClick={() => { if (!isCustomType) setFilingType("") }}
                className={`px-3 py-2 rounded-lg border-2 text-xs text-left transition-all ${
                  isCustomType
                    ? "border-[#1B2B4B] bg-[#1B2B4B]/5 font-semibold text-[#1B2B4B]"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                Custom...
              </button>
            </div>
            {isCustomType && (
              <Input
                placeholder="e.g. California Franchise Tax Extension"
                value={filingType}
                onChange={(e) => setFilingType(e.target.value)}
                className="mt-2"
                autoFocus
              />
            )}
          </div>

          {/* Jurisdiction + Due date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-jurisdiction">Jurisdiction</Label>
              <select
                id="edit-jurisdiction"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="mt-1.5 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {US_STATES_AND_FEDERAL.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="edit-dueDate">Due date</Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <Label className="mb-2 block">Status</Label>
            <div className="grid grid-cols-4 gap-2">
              {(["pending", "overdue", "completed", "not_required"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-2 py-2 rounded-lg border-2 text-xs font-medium transition-all ${
                    status === s
                      ? "border-[#1B2B4B] bg-[#1B2B4B]/5 text-[#1B2B4B]"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {s === "not_required" ? "N/A" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Filed date (when completed) */}
          {status === "completed" && (
            <div>
              <Label htmlFor="edit-filedAt">Date filed</Label>
              <Input
                id="edit-filedAt"
                type="date"
                value={filedAt}
                onChange={(e) => setFiledAt(e.target.value)}
                className="mt-1.5"
              />
            </div>
          )}

          {/* Amount */}
          <div>
            <Label htmlFor="edit-amount">Amount (optional)</Label>
            <div className="relative mt-1.5">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="edit-notes">Notes (optional)</Label>
            <textarea
              id="edit-notes"
              className="mt-1.5 w-full h-20 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Confirmation number, reference, or any notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <Button
            className="flex-1 bg-[#1B2B4B] hover:bg-[#243461] text-white"
            disabled={saving || !filingType.trim() || !dueDate}
            onClick={handleSave}
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
            ) : (
              <><CheckCircle2 className="w-4 h-4 mr-2" />Save changes</>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CompliancePage() {
  const { companies, selectedCompany } = useCompany()
  const [filings, setFilings] = useState<FilingWithCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [markingFiling, setMarkingFiling] = useState<FilingWithCompany | null>(null)
  const [editingFiling, setEditingFiling] = useState<FilingWithCompany | null>(null)
  const [addingFiling, setAddingFiling] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (selectedCompany) loadData(selectedCompany.id)
  }, [selectedCompany])

  async function handleDeleteFiling(id: string) {
    const supabase = createClient()
    await supabase.from("filings").delete().eq("id", id)
    setDeletingId(null)
    if (selectedCompany) loadData(selectedCompany.id)
  }

  async function loadData(companyId: string) {
    setLoading(true)
    const supabase = createClient()
    const { data: filingsData } = await supabase
      .from("filings")
      .select("*")
      .eq("company_id", companyId)
      .order("due_date", { ascending: true })
    const combined = (filingsData ?? []).map((f) => ({
      ...f,
      company: companies.find((c: Company) => c.id === f.company_id),
    }))
    setFilings(combined)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const overdue = filings.filter((f) => f.status === "overdue")
  const pending = filings.filter((f) => f.status === "pending")
  const completed = filings.filter((f) => f.status === "completed")

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      {markingFiling && (
        <MarkFiledModal
          filing={markingFiling}
          onClose={() => setMarkingFiling(null)}
          onSuccess={() => {
            setMarkingFiling(null)
            if (selectedCompany) loadData(selectedCompany.id)
          }}
        />
      )}

      {addingFiling && (
        <AddFilingModal
          companies={companies}
          onClose={() => setAddingFiling(false)}
          onSuccess={() => {
            setAddingFiling(false)
            if (selectedCompany) loadData(selectedCompany.id)
          }}
        />
      )}

      {editingFiling && (
        <EditFilingModal
          filing={editingFiling}
          onClose={() => setEditingFiling(null)}
          onSuccess={() => {
            setEditingFiling(null)
            if (selectedCompany) loadData(selectedCompany.id)
          }}
        />
      )}

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Compliance</h1>
          <p className="text-slate-500">All filings, deadlines, and obligations across your entities.</p>
        </div>
        <Button
          className="bg-[#1B2B4B] hover:bg-[#243461] text-white flex items-center gap-2"
          onClick={() => setAddingFiling(true)}
        >
          <Plus className="w-4 h-4" />
          Add filing
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Overdue", count: overdue.length, color: "red", icon: XCircle },
          { label: "Pending", count: pending.length, color: "amber", icon: AlertCircle },
          { label: "Filed this year", count: completed.length, color: "emerald", icon: CheckCircle2 },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-3">
              <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.count}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filings.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-1">No filings yet</h3>
          <p className="text-slate-400 text-sm mb-4">Add your first filing to start tracking deadlines.</p>
          <Button
            className="bg-[#1B2B4B] hover:bg-[#243461] text-white"
            onClick={() => setAddingFiling(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add filing
          </Button>
        </div>
      ) : (
        <>
          {/* Overdue — action needed */}
          {overdue.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold text-red-700">Needs immediate action</h2>
              </div>
              <div className="space-y-3">
                {overdue.map((filing) => (
                  <div
                    key={filing.id}
                    className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-center gap-5"
                  >
                    <StatusIcon status={filing.status} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900">{filing.type}</h3>
                        <StatusBadge status={filing.status} />
                      </div>
                      <p className="text-slate-500 text-sm">
                        {filing.company?.name} · {filing.state}
                      </p>
                      {filing.notes && (
                        <p className="text-sm text-slate-600 mt-1 bg-white/60 rounded-lg p-2 border border-red-100">
                          {filing.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      {filing.amount && (
                        <p className="text-sm font-semibold text-red-700 flex items-center gap-1 justify-end">
                          <DollarSign className="w-3.5 h-3.5" />{filing.amount}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setEditingFiling(filing)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white/60 rounded-lg transition-colors"
                          title="Edit filing"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <Button
                          size="sm"
                          className="bg-[#1B2B4B] text-white hover:bg-[#243461]"
                          onClick={() => setMarkingFiling(filing)}
                        >
                          Resolve <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                      <div className="mt-2 flex justify-end">
                        {deletingId === filing.id ? (
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => handleDeleteFiling(filing.id)} className="text-xs text-red-600 font-semibold hover:underline">Delete?</button>
                            <span className="text-red-200">·</span>
                            <button onClick={() => setDeletingId(null)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeletingId(filing.id)} className="text-red-200 hover:text-red-400 transition-colors" title="Remove filing">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending */}
          {pending.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-900">Upcoming filings</h2>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Filing</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Company</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Due date</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Amount</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                      <th className="px-5 py-3" />
                      <th className="px-2 py-3 w-8" />
                      <th className="px-3 py-3 w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {pending.map((filing) => (
                      <tr key={filing.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{filing.type}</p>
                              <p className="text-xs text-slate-400">{filing.state}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-700">{filing.company?.name}</p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                            <p className="text-sm font-semibold text-amber-700">
                              {filing.due_date
                                ? new Date(filing.due_date).toLocaleDateString("en-US", {
                                    month: "short", day: "numeric", year: "numeric",
                                  })
                                : "—"}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-700">
                            {filing.amount ? `$${filing.amount}` : "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={filing.status} />
                        </td>
                        <td className="px-5 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-slate-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50"
                            onClick={() => setMarkingFiling(filing)}
                          >
                            Approve & file
                          </Button>
                        </td>
                        <td className="px-2 py-4">
                          <button
                            onClick={() => setEditingFiling(filing)}
                            className="text-slate-300 hover:text-slate-500 transition-colors"
                            title="Edit filing"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </td>
                        <td className="px-3 py-4">
                          {deletingId === filing.id ? (
                            <div className="flex flex-col items-center gap-1">
                              <button onClick={() => handleDeleteFiling(filing.id)} className="text-xs text-red-600 font-semibold hover:underline whitespace-nowrap">Delete?</button>
                              <button onClick={() => setDeletingId(null)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeletingId(filing.id)} className="text-slate-300 hover:text-red-400 transition-colors" title="Remove filing">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-bold text-slate-900">Completed this year</h2>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Filing</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Company</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Filed date</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Amount</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Notes</th>
                      <th className="px-2 py-3 w-8" />
                      <th className="px-3 py-3 w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {completed.map((filing) => (
                      <tr key={filing.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{filing.type}</p>
                              <p className="text-xs text-slate-400">{filing.state}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-700">{filing.company?.name}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-500">
                            {filing.filed_at
                              ? new Date(filing.filed_at).toLocaleDateString("en-US", {
                                  month: "short", day: "numeric", year: "numeric",
                                })
                              : "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-700">
                            {filing.amount ? `$${filing.amount}` : "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={filing.status} />
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs text-slate-400 max-w-48 truncate">
                            {filing.notes ?? "—"}
                          </p>
                        </td>
                        <td className="px-2 py-4">
                          <button
                            onClick={() => setEditingFiling(filing)}
                            className="text-slate-300 hover:text-slate-500 transition-colors"
                            title="Edit filing"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </td>
                        <td className="px-3 py-4">
                          {deletingId === filing.id ? (
                            <div className="flex flex-col items-center gap-1">
                              <button onClick={() => handleDeleteFiling(filing.id)} className="text-xs text-red-600 font-semibold hover:underline whitespace-nowrap">Delete?</button>
                              <button onClick={() => setDeletingId(null)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeletingId(filing.id)} className="text-slate-300 hover:text-red-400 transition-colors" title="Remove filing">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
