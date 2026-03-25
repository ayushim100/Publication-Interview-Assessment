'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { api } from '@/lib/api';

interface AutosaveEditorProps {
  pageId: string;
  initialContent: Record<string, any>;
  sectionId: string;
  onSaved?: () => void;
}

const AUTOSAVE_DELAY = 2000; // ms

export function AutosaveEditor({ pageId, initialContent, sectionId, onSaved }: AutosaveEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [dirty, setDirty] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef(content);

  // Keep ref in sync with state
  contentRef.current = content;

  const save = useCallback(async () => {
    if (!dirty) return;

    setSaving(true);
    try {
      await api.updateSection(pageId, sectionId, {
        content: contentRef.current,
      });
      setLastSaved(new Date());
      setDirty(false);
      onSaved?.();
    } catch (err) {
      console.error('Autosave failed:', err);
    } finally {
      setSaving(false);
    }
  }, [pageId, sectionId, dirty, onSaved]);

  // Autosave on content change
  useEffect(() => {
    if (!dirty) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      save();
    }, AUTOSAVE_DELAY);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [content, dirty, save]);

  function handleFieldChange(field: string, value: any) {
    setContent((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.85rem', color: '#666' }}>
          {saving ? 'Saving...' : dirty ? 'Unsaved changes' : lastSaved ? `Last saved ${lastSaved.toLocaleTimeString()}` : ''}
        </span>
        {dirty && (
          <button
            onClick={save}
            style={{ padding: '4px 12px', fontSize: '0.85rem', border: '1px solid #ddd', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}
          >
            Save now
          </button>
        )}
      </div>

      {Object.entries(content).map(([key, value]) => (
        <div key={key} style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px', fontSize: '0.85rem' }}>
            {key}
          </label>
          {typeof value === 'string' && value.length > 100 ? (
            <textarea
              value={value as string}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              rows={4}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          ) : typeof value === 'string' ? (
            <input
              value={value as string}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          ) : (
            <textarea
              value={JSON.stringify(value, null, 2)}
              onChange={(e) => {
                try {
                  handleFieldChange(key, JSON.parse(e.target.value));
                } catch {
                  // Keep raw text until valid JSON
                }
              }}
              rows={3}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.85rem', boxSizing: 'border-box' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
