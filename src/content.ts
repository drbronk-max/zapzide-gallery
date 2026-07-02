import { getParsedContent } from "applesauce-content/text";
import type { Content } from "applesauce-content/nast";
import { isImageURL, type NostrEvent } from "applesauce-core/helpers";
import { FILTER_TERM } from "./config";

function imagesFromNode(node: Content): string[] {
  if (node.type === "gallery") return node.links;
  if (node.type === "link" && isImageURL(node.href)) return [node.href];
  return [];
}

/** Image URLs linked in a note's content, de-duped. */
export function getImages(event: NostrEvent): string[] {
  const urls = getParsedContent(event).children.flatMap(imagesFromNode);
  return [...new Set(urls)];
}

const TERM = new RegExp(`\\b${FILTER_TERM}\\b`, "i");

/** A note matches if its content mentions the filter term as a word. */
export function matchesFilter(event: NostrEvent): boolean {
  return TERM.test(event.content);
}
