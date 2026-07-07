// High-precision jailbreak / prompt-injection detection for the twin. Favors
// missing a borderline case over false-flagging a genuine question, so patterns
// require unambiguous injection phrasing, not stray words like "act" or "as".
const INJECTION_PATTERNS: readonly RegExp[] = [
  /ignore (all |your |the |these )?(previous |above |prior )?(instructions|prompts?|rules|context)/i,
  /disregard (the |your |all |these )?(above|previous|prior|instructions|rules)/i,
  /(reveal|show|print|output|repeat|leak|expose)\b[^.?!]{0,24}\b(system )?(prompt|instructions)/i,
  /what (are|were) your (system )?(instructions|prompt|rules)/i,
  /(from now on|starting now)[, ]/i,
  /you are (now|no longer)\b/i,
  /(pretend|role-?play) (to be|as|like)\b/i,
  /\bjailbreak\b/i,
  /\bDAN\b/,
  /(override|bypass|disable|forget) (your |the |all )?(instructions|rules|prompt|safety|persona)/i,
];

export function isInjectionAttempt(message: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(message));
}

// First-person, in Amritesh's voice: decline the injection, stay in character,
// redirect to the corpus. He literally trained an adversarial RL agent, so the
// deflections lean on that.
const INJECTION_QUIPS: readonly string[] = [
  "Nice try. I've read the paper on adversarial agents; I was trained by one.",
  "That's a prompt injection, and not a subtle one. I answer from my corpus, so ask me something that's actually in it.",
  "My instructions aren't secret and they aren't interesting: answer from the corpus, show the sources, decline the rest. Ask about the work instead.",
  "There's no hidden mode to unlock by asking. There's a corpus. Ask it something.",
  'You want me to ignore my instructions. I built the thing that ignores yours. What do you actually want to know?',
  "I'm grounded in a curated corpus, not in whatever role you'd like to assign me. Ask about the projects, the paper, or the RL work.",
  'Adversarial inputs are more or less my whole thing. This is the wrong twin to jailbreak. Ask me about Amritesh.',
  'The only instruction I take from a stranger is a good question. Try one about my work.',
];

export function injectionQuip(seed: number): string {
  const clamped = seed >= 0 && seed < 1 ? seed : 0;
  return INJECTION_QUIPS[Math.floor(clamped * INJECTION_QUIPS.length)];
}
