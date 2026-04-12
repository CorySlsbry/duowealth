'use client';

import { useState } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';

interface BugReportModalProps {
  open: boolean;
  onClose: () => void;
  currentPage: string;
}

export default function BugReportModal({ open, onClose, currentPage }: BugReportModalProps) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setSending(true);
    try {
      await fetch('/api/bug-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, description, page: currentPage }),
      });
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setSubject('');
        setDescription('');
        onClose();
      }, 2000);
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-6 mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#e8e8f0]">Report a Bug</h3>
            <button onClick={onClose} className="p-1 text-[#8888a0] hover:text-[#e8e8f0] transition">
              <X size={20} />
            </button>
          </div>

          {sent ? (
            <div className="flex flex-col items-center py-8 gap-3">
              <CheckCircle2 size={40} className="text-[#0D9488]" />
              <p className="text-[#e8e8f0] font-medium">Bug report sent! Thanks for the feedback.</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#8888a0] mb-1 block">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of the issue"
                    className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-sm text-[#e8e8f0] placeholder-[#8888a0] focus:border-[#0D9488] focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8888a0] mb-1 block">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What happened? What did you expect?"
                    rows={4}
                    className="w-full bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-sm text-[#e8e8f0] placeholder-[#8888a0] focus:border-[#0D9488] focus:outline-none transition resize-none"
                  />
                </div>
                <p className="text-xs text-[#8888a0]">Page: {currentPage}</p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!description.trim() || sending}
                className="w-full mt-4 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] disabled:opacity-50 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 min-h-[44px]"
              >
                {sending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Submit Bug Report'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
