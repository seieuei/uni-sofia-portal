import type { GuideBlock, GuidePage } from "@/content/admissions/guide";
import type { Lang } from "@/lib/types";

function Block({ block, lang }: { block: GuideBlock; lang: Lang }) {
  if (block.type === "h2") {
    return <h2 className="font-display mt-8 text-xl font-semibold">{lang === "bg" ? block.bg : block.en}</h2>;
  }
  if (block.type === "p") {
    return <p className="mt-3 text-sm leading-relaxed text-ink/75">{lang === "bg" ? block.bg : block.en}</p>;
  }
  if (block.type === "formula") {
    return (
      <p className="mt-4 rounded-xl border border-plum/20 bg-plum/[0.06] px-4 py-3 font-mono text-sm dark:border-gold/20">
        {lang === "bg" ? block.bg : block.en}
      </p>
    );
  }
  if (block.type === "callout") {
    return <p className="callout mt-4 px-4 py-3 text-sm">{lang === "bg" ? block.bg : block.en}</p>;
  }
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink/75">
      {block.items.map((it) => (
        <li key={it.bg}>{lang === "bg" ? it.bg : it.en}</li>
      ))}
    </ul>
  );
}

export function GuideArticle({ page, lang }: { page: GuidePage; lang: Lang }) {
  return (
    <article>
      <h1 className="font-display text-3xl font-bold">{lang === "bg" ? page.titleBg : page.titleEn}</h1>
      <p className="mt-3 max-w-2xl text-ink/70">{lang === "bg" ? page.leadBg : page.leadEn}</p>
      {page.blocks.map((b, i) => (
        <Block key={i} block={b} lang={lang} />
      ))}
    </article>
  );
}
