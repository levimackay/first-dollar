import { htmlFiles, textNodes, copyAttrs, finding } from '../context.mjs';

const WORDS = [
  'streamline', 'empower', 'seamless(?:ly)?', 'unleash', 'next-gen', 'next-generation', 'world-class',
  'revolutionize', 'cutting-edge', 'game-changer', 'game-changing', 'supercharge', 'elevate your',
  'unlock your', 'effortless(?:ly)?', 'robust', 'synergy', 'best-in-class', 'state-of-the-art', 'all-in-one',
  // leverage as a verb: followed by an object, not "leverage is" or "leverage of"
  'leverag(?:e|es|ed|ing)\\s+(?:(?:the|our|your|a|an|its|their|these|those)\\s+)?(?!(?:is|are|of|to|and|ratio|was|for|in)\\b)[a-z]+',
];
const RE = new RegExp(`(?<![\\w-])(?:${WORDS.join('|')})(?![\\w-])`, 'gi');
const PLACEHOLDER = /\[(?:NEED|PLACEHOLDER):[^\]]*\]/g;

export default {
  id: 'buzzwords',
  severity: 'fail',
  describe: 'marketing buzzwords that say nothing a visitor can check',
  run(ctx) {
    const out = [];
    const check = (file, line, text) => {
      for (const m of text.replace(PLACEHOLDER, ' ').matchAll(RE)) {
        out.push(finding('buzzwords', file, line, `buzzword "${m[0].trim()}"; say the concrete thing instead`, 'fail'));
      }
    };
    for (const file of htmlFiles(ctx)) {
      for (const t of textNodes(file)) check(file, t.line, t.text);
      for (const a of copyAttrs(file)) check(file, a.line, a.value);
    }
    return out;
  },
};
