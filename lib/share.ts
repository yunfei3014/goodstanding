export type ShareData = {
  companyName: string
  entityType: string
  stateOfIncorporation: string
  status: "good_standing" | "attention_needed" | "action_required"
  totalFilings: number
  completedFilings: number
  overdueFilings: number
  pendingFilings: number
  generatedAt: string // ISO
}

export function encodeShareToken(data: ShareData): string {
  return btoa(JSON.stringify(data))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

export function decodeShareToken(token: string): ShareData | null {
  try {
    const base64 = token.replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(atob(base64)) as ShareData
  } catch {
    return null
  }
}
