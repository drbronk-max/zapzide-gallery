import { getParsedContent } from "applesauce-content/text";
import type { Content } from "applesauce-content/nast";
import { isImageURL, type NostrEvent } from "applesauce-core/helpers";
import { FILTER_TERM, IMAGE_EXT } from "./config";

function imagesFromNode(node: Content): string[] {
  if (node.type === "gallery") return node.links;
  if (node.type === "link" && isImageURL(node.href)) return [node.href];
  return [];
}

/** Whether a URL's path ends in the configured extension (ignoring query/hash). */
function hasExt(url: string): boolean {
  if (!IMAGE_EXT) return true;
  return url.split(/[?#]/)[0].toLowerCase().endsWith(`.${IMAGE_EXT}`);
}

/** Image URLs linked in a note's content, de-duped. */
export function getImages(event: NostrEvent): string[] {
  const urls = getParsedContent(event).children.flatMap(imagesFromNode).filter(hasExt);
  return [...new Set(urls)];
}

const TERM = FILTER_TERM ? new RegExp(`\\b${FILTER_TERM}\\b`, "i") : null;

/** A note matches if its content mentions the filter term as a word (or if there is no term). */
export function matchesFilter(event: NostrEvent): boolean {
  return TERM ? TERM.test(event.content) : true;
}
