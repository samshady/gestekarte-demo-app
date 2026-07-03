'use client'

import { useState } from 'react'
import { approveApplication } from './actions'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/lib/language'

export function ApprovalForm({ id }: { id: string }) {
  const { t } = useLanguage()
  const [checked, setChecked] = useState(false)
  const [signature, setSignature] = useState('')
  const [approved, setApproved] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!checked || !signature.trim()) return
    setPending(true)
    await approveApplication(id, signature.trim())
    setApproved(true)
    setPending(false)
  }

  if (approved) {
    return (
      <Alert style={{ backgroundColor: '#E8EAE5', borderColor: '#9FBF47' }}>
        <CheckCircle2 className="h-4 w-4" style={{ color: '#9FBF47' }} />
        <AlertDescription style={{ color: '#252C27' }}>
          {t(
            'Antrag genehmigt. Die Ausstellung der Gastekarte wurde eingeleitet.',
            'Application approved. Guest card issuance has been initiated.'
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start gap-2">
        <Checkbox
          id="liability"
          checked={checked}
          onCheckedChange={(v) => setChecked(v === true)}
        />
        <Label htmlFor="liability" className="text-sm leading-tight" style={{ color: '#1a1a1a' }}>
          {t(
            'Ich ubernehme hiermit rechtlich die finanzielle Haftung fur den Gast.',
            'I hereby legally assume financial liability for the guest.'
          )}
        </Label>
      </div>
      <div className="space-y-1">
        <Label htmlFor="hostSignature" className="text-sm" style={{ color: '#1a1a1a' }}>
          {t('Digitale Unterschrift (vollständiger Name)', 'Digital Signature (full name)')}
        </Label>
        <Input
          id="hostSignature"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          placeholder={t('Vor- und Nachname', 'First and Last Name')}
          required
        />
      </div>
      <Button
        type="submit"
        disabled={!checked || !signature.trim() || pending}
        style={checked && signature.trim() && !pending ? { backgroundColor: '#9FBF47', color: '#252C27' } : {}}
      >
        {pending
          ? t('Wird verarbeitet...', 'Processing...')
          : t('Unterschreiben und genehmigen', 'Sign and Approve')}
      </Button>
    </form>
  )
}
