'use client';

import React, { useEffect, useState } from 'react';
import { Inbox, Mail, CheckCircle2, Trash2, Search, Eye, Archive, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { api } from '../../../lib/api';
import { ContactMessage } from '../../../types';
import { formatDateFull } from '../../../lib/utils';
import { toast } from 'sonner';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [loading, setLoading] = useState(true);

  // Modals
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadMessages = async () => {
    try {
      const data = await api.getContactMessages();
      setMessages(data);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleOpenMessage = async (msg: ContactMessage) => {
    setActiveMessage(msg);
    if (!msg.isRead) {
      try {
        await api.updateContactMessage(msg.id, { isRead: true });
        msg.isRead = true;
        setMessages([...messages]);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      const updated = await api.updateContactMessage(msg.id, { isRead: !msg.isRead });
      toast.success(updated.isRead ? 'Marked as read' : 'Marked as unread');
      loadMessages();
      if (activeMessage?.id === msg.id) {
        setActiveMessage(updated);
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleToggleArchive = async (msg: ContactMessage) => {
    try {
      const updated = await api.updateContactMessage(msg.id, { isArchived: !msg.isArchived });
      toast.success(updated.isArchived ? 'Message archived' : 'Message unarchived');
      loadMessages();
      if (activeMessage?.id === msg.id) {
        setActiveMessage(updated);
      }
    } catch {
      toast.error('Failed to archive message');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.deleteContactMessage(deleteConfirmId);
      toast.success('Message deleted');
      setDeleteConfirmId(null);
      if (activeMessage?.id === deleteConfirmId) setActiveMessage(null);
      loadMessages();
    } catch {
      toast.error('Failed to delete message');
    }
  };

  const filtered = messages.filter((m) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'unread'
        ? !m.isRead
        : filter === 'read'
        ? m.isRead
        : m.isArchived;

    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Contact Inbox</h2>
          <p className="text-xs text-slate-400 mt-1">
            Read, filter, search, and manage incoming messages from the public portfolio.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-navy-900 border border-navy-800 p-4 rounded-2xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-950 border border-navy-800 text-white text-xs focus:outline-none focus:border-cyan"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'unread', 'read', 'archived'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === tab
                  ? 'bg-cyan text-navy-950 font-bold'
                  : 'bg-navy-950 border border-navy-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-navy-900 border border-navy-800 rounded-3xl overflow-hidden shadow-lg">
        {filtered.length > 0 ? (
          <div className="divide-y divide-navy-800">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-navy-800/40 cursor-pointer transition-colors ${
                  !msg.isRead ? 'bg-navy-950/60 border-l-4 border-l-cyan' : ''
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-white">{msg.name}</span>
                    <span className="text-xs font-mono text-cyan">{msg.email}</span>
                    {!msg.isRead && <Badge variant="cyan" size="sm">Unread</Badge>}
                    {msg.isArchived && <Badge variant="slate" size="sm">Archived</Badge>}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200">{msg.subject}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{msg.message}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-mono text-slate-400">
                    {formatDateFull(msg.createdAt)}
                  </span>
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleToggleRead(msg)}
                      className="p-1.5 rounded-lg bg-navy-800 border border-navy-700 text-slate-300 hover:text-cyan"
                      title={msg.isRead ? 'Mark unread' : 'Mark read'}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(msg.id)}
                      className="p-1.5 rounded-lg bg-navy-800 border border-navy-700 text-slate-300 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs">
            No messages found matching your criteria.
          </div>
        )}
      </div>

      {/* View Message Modal */}
      <Modal
        isOpen={!!activeMessage}
        onClose={() => setActiveMessage(null)}
        title="Contact Message Details"
        maxWidth="xl"
      >
        {activeMessage && (
          <div className="space-y-6">
            <div className="border-b border-navy-800 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{activeMessage.subject}</h3>
                <span className="text-xs font-mono text-slate-400">
                  {formatDateFull(activeMessage.createdAt)}
                </span>
              </div>
              <div className="text-xs text-slate-300">
                From: <span className="text-white font-semibold">{activeMessage.name}</span> (
                <a href={`mailto:${activeMessage.email}`} className="text-cyan underline">
                  {activeMessage.email}
                </a>
                ) {activeMessage.phone && `• Phone: ${activeMessage.phone}`}
              </div>
            </div>

            <div className="bg-navy-950 p-5 rounded-2xl border border-navy-800 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
              {activeMessage.message}
            </div>

            <div className="pt-4 border-t border-navy-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleToggleArchive(activeMessage)}
                >
                  <Archive className="w-3.5 h-3.5 mr-1.5" />
                  <span>{activeMessage.isArchived ? 'Unarchive' : 'Archive'}</span>
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteConfirmId(activeMessage.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  <span>Delete</span>
                </Button>
              </div>

              <a href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject)}`}>
                <Button variant="primary" size="sm">
                  <Mail className="w-3.5 h-3.5 mr-1.5" />
                  <span>Reply via Email</span>
                </Button>
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-rose-400">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete this contact message?
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
