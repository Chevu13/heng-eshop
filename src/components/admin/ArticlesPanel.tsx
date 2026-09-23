'use client';

import { useState } from 'react';
import { deleteArticle, saveArticle } from '@/lib/admin/actions';
import { resolveMediaUrl } from '@/lib/admin/media';
import { ARTICLE_CATEGORIES, categoryLabel, formatArticleDate, type Article } from '@/lib/data/articles';
import { ActionButton, FormShell } from './FormShell';

function Thumb({ url }: { url: string }) {
  return url ? (
    // Obična <img>: URL može biti bilo koja adresa, a next/image traži unapred dozvoljen host.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={resolveMediaUrl(url)} alt="" className="h-full w-full object-cover" />
  ) : null;
}

function ArticleForm({ article, onDone }: { article?: Article; onDone?: () => void }) {
  const [media, setMedia] = useState(article?.mediaUrl ?? '');
  const today = new Date().toISOString().slice(0, 10);

  return (
    <FormShell
      action={async (fd) => {
        const res = await saveArticle(article?.slug ?? null, fd);
        if (res.ok) onDone?.();
        return res;
      }}
      submitLabel={article ? 'Sačuvaj izmene' : 'Objavi članak'}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="field-label">Naslov *</label>
          <input name="title" required className="field" defaultValue={article?.title} />
        </div>
        <div>
          <label className="field-label">Kategorija *</label>
          <select name="category" className="field cursor-pointer" defaultValue={article?.category ?? 'inspiracija'}>
            {ARTICLE_CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Datum objave *</label>
          <input name="date" type="date" required className="field" defaultValue={article?.date ?? today} />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label">Kratak opis</label>
          <textarea name="excerpt" rows={2} className="field resize-y" defaultValue={article?.excerpt} />
          <p className="mt-1.5 font-body text-[12px] text-ink/45">Prikazuje se na kartici i u Google rezultatima.</p>
        </div>
        <div className="grid gap-5 sm:col-span-2 sm:grid-cols-[1fr_120px]">
          <div className="space-y-5">
            <div>
              <label className="field-label">Fotografija (URL ili putanja) *</label>
              <input
                name="mediaUrl" required className="field" value={media}
                onChange={(e) => setMedia(e.target.value)}
                placeholder="katalog/moja-fotografija.jpg"
              />
              <p className="mt-1.5 font-body text-[12px] text-ink/45">
                Otpremite je u <a href="/admin/mediji" target="_blank" className="link-gold">Medije</a> i
                nalepite kopiranu putanju.
              </p>
            </div>
            <div>
              <label className="field-label">Opis fotografije (alt)</label>
              <input name="mediaAlt" className="field" defaultValue={article?.mediaAlt} />
            </div>
          </div>
          <div className="hidden aspect-square overflow-hidden rounded-sm bg-ink/5 sm:block">
            <Thumb url={media} />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="field-label">Tekst članka</label>
          <textarea
            name="body" rows={14} className="field resize-y leading-relaxed"
            defaultValue={article?.body.join('\n\n')}
          />
          <p className="mt-1.5 font-body text-[12px] text-ink/45">
            Pasuse odvojite praznim redom. Pasus koji počinje sa „## ” postaje podnaslov.
          </p>
        </div>
        <div className="sm:col-span-2">
          <label className="field-label">Slug (adresa)</label>
          <input name="slug" className="field" defaultValue={article?.slug} placeholder="pravi se automatski iz naslova" />
        </div>
      </div>
    </FormShell>
  );
}

export function ArticlesPanel({ articles }: { articles: Article[] }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <section className="rounded-sm border border-ink/12 bg-white/60 p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[18px]" style={{ fontWeight: 600 }}>Članci</h2>
          <p className="mt-1 font-body text-[13px] text-ink/55">Najnoviji po datumu prikazuju se prvi.</p>
        </div>
        <button onClick={() => setAdding((v) => !v)} className="btn btn-outline">
          {adding ? 'Otkaži' : 'Novi članak'}
        </button>
      </div>

      {adding && (
        <div className="mb-6 rounded-sm border border-dashed border-gold/50 p-5">
          <ArticleForm onDone={() => setAdding(false)} />
        </div>
      )}

      {articles.length === 0 ? (
        <p className="rounded-sm border border-dashed border-ink/18 px-6 py-10 text-center font-body text-[14px] text-ink/50">
          Još nema članaka.
        </p>
      ) : (
        <ul className="divide-y divide-ink/10 border-t border-ink/10">
          {articles.map((a) => (
            <li key={a.slug} className="py-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-sm bg-ink/5"><Thumb url={a.mediaUrl} /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-body text-[15px]">{a.title}</p>
                  <p className="font-body text-[12px] text-ink/45">
                    {categoryLabel(a.category)} · {formatArticleDate(a.date)}
                  </p>
                </div>
                <a href={`/u-prostoru/${a.slug}`} target="_blank" className="link-gold hidden font-body text-[11px] uppercase tracking-eyebrow text-ink/55 sm:inline-block">
                  Pogledaj
                </a>
                <button
                  onClick={() => setEditing((s) => (s === a.slug ? null : a.slug))}
                  className="link-gold font-body text-[11px] uppercase tracking-eyebrow text-ink/55"
                  aria-expanded={editing === a.slug}
                >
                  {editing === a.slug ? 'Zatvori' : 'Uredi'}
                </button>
                <ActionButton
                  action={() => deleteArticle(a.slug)}
                  label="Obriši" tone="link"
                  confirm={`Obrisati članak „${a.title}”?`}
                />
              </div>
              {editing === a.slug && (
                <div className="mt-5 rounded-sm border border-ink/10 p-5">
                  <ArticleForm article={a} onDone={() => setEditing(null)} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
