// Client-side Wikipedia diagram/image auto-fetch (CORS enabled via origin=*)

export interface WikiDiagram {
  title: string;
  imageUrl: string;
  pageUrl: string;
  extract: string;
}

const API = "https://en.wikipedia.org/w/api.php";
const cache = new Map<string, WikiDiagram | null>();

function isDiagramLike(url: string) {
  const lower = url.toLowerCase();
  if (/(icon|logo|flag|commons-logo|question_book|edit-|ambox|wiki)/.test(lower)) return false;
  return /\.(svg|png|jpg|jpeg|gif|webp)/.test(lower);
}

/**
 * Finds the most relevant Wikipedia article for a topic and returns a
 * diagram / illustrative image for it (prefers SVG diagrams).
 */
export async function fetchWikiDiagram(topic: string): Promise<WikiDiagram | null> {
  const key = topic.trim().toLowerCase();
  if (!key) return null;
  if (cache.has(key)) return cache.get(key)!;

  try {
    // 1. Search for the best matching page + its lead image + extract
    const searchParams = new URLSearchParams({
      action: "query",
      format: "json",
      origin: "*",
      generator: "search",
      gsrsearch: topic,
      gsrlimit: "1",
      prop: "pageimages|extracts|images",
      piprop: "original|thumbnail",
      pithumbsize: "600",
      exintro: "1",
      explaintext: "1",
      imlimit: "20",
    });

    const res = await fetch(`${API}?${searchParams}`);
    if (!res.ok) throw new Error(`Wikipedia ${res.status}`);
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) {
      cache.set(key, null);
      return null;
    }
    const page: any = Object.values(pages)[0];

    let imageUrl: string | undefined =
      page?.original?.source || page?.thumbnail?.source;

    // 2. Prefer an actual diagram (SVG) from the page's image list
    const svg = (page?.images || [])
      .map((im: any) => im.title as string)
      .find((t: string) => /\.svg$/i.test(t) && isDiagramLike(t));

    if (svg) {
      const imgParams = new URLSearchParams({
        action: "query",
        format: "json",
        origin: "*",
        titles: svg,
        prop: "imageinfo",
        iiprop: "url",
        iiurlwidth: "600",
      });
      const imgRes = await fetch(`${API}?${imgParams}`);
      if (imgRes.ok) {
        const imgData = await imgRes.json();
        const info: any = Object.values(imgData?.query?.pages || {})[0];
        const url = info?.imageinfo?.[0]?.thumburl || info?.imageinfo?.[0]?.url;
        if (url) imageUrl = url;
      }
    }

    if (!imageUrl || !isDiagramLike(imageUrl)) {
      cache.set(key, null);
      return null;
    }

    const result: WikiDiagram = {
      title: page.title,
      imageUrl,
      pageUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(
        String(page.title).replace(/\s/g, "_")
      )}`,
      extract: (page.extract || "").split(". ").slice(0, 2).join(". "),
    };
    cache.set(key, result);
    return result;
  } catch (err) {
    console.error("Wikipedia diagram fetch failed:", err);
    cache.set(key, null);
    return null;
  }
}

/** Tries several topics in order and returns the first diagram found. */
export async function fetchFirstWikiDiagram(topics: string[]): Promise<WikiDiagram | null> {
  for (const t of topics.filter(Boolean).slice(0, 4)) {
    const found = await fetchWikiDiagram(t);
    if (found) return found;
  }
  return null;
}
