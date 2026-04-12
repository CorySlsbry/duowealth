'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTellerConnect } from 'teller-connect-react';
import { Building2, Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react';

interface BankConnection {
  id: string;
  enrollment_id: string;
  institution_name: string;
  created_at: string;
}

export default function BankConnect() {
  const [connections, setConnections] = useState<BankConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchConnections = useCallback(async () => {
    try {
      const res = await fetch('/api/teller/connect');
      if (res.ok) {
        const data = await res.json();
        setConnections(data.connections || []);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const handleSuccess = useCallback(async (authorization: any) => {
    setSaving(true);
    try {
      await fetch('/api/teller/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: authorization.accessToken,
          enrollmentId: authorization.enrollment.id,
          institutionName: authorization.enrollment.institution.name,
        }),
      });
      await fetchConnections();
    } catch {
      // Handle error silently
    } finally {
      setSaving(false);
    }
  }, [fetchConnections]);

  const { open, ready } = useTellerConnect({
    applicationId: process.env.NEXT_PUBLIC_TELLER_APP_ID || '',
    environment: (process.env.NEXT_PUBLIC_TELLER_ENV as any) || 'sandbox',
    products: ['balance', 'transactions'],
    onSuccess: handleSuccess,
  });

  const handleDisconnect = async (enrollmentId: string) => {
    setDeleting(enrollmentId);
    try {
      await fetch('/api/teller/connect', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId }),
      });
      await fetchConnections();
    } catch {
      // Handle error silently
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-[#8888a0]">
        <Loader2 size={20} className="animate-spin mr-2" />
        Loading connections...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {connections.map((conn) => (
        <div
          key={conn.id}
          className="flex items-center justify-between p-4 bg-[#1a1a26] rounded-lg border border-[#2a2a3d]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0D9488]/15 flex items-center justify-center">
              <Building2 size={20} className="text-[#0D9488]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#e8e8f0]">
                {conn.institution_name}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-green-400">
                <CheckCircle2 size={12} />
                Connected
              </div>
            </div>
          </div>
          <button
            onClick={() => handleDisconnect(conn.enrollment_id)}
            disabled={deleting === conn.enrollment_id}
            className="p-2 text-[#8888a0] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
          >
            {deleting === conn.enrollment_id ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      ))}

      <button
        onClick={() => open()}
        disabled={!ready || saving}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-[#2a2a3d] text-[#8888a0] hover:border-[#0D9488] hover:text-[#0D9488] transition disabled:opacity-50"
      >
        {saving ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Plus size={18} />
            Connect a bank account
          </>
        )}
      </button>
    </div>
  );
}
