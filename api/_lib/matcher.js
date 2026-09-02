const KNOWLEDGE_BASE = require('./knowledgeBase');

function findBestMatch(userMessage) {
  const msg = userMessage.toLowerCase().trim();

  let bestMatch = null;
  let highestScore = 0;

  for (const [topic, data] of Object.entries(KNOWLEDGE_BASE)) {
    let score = 0;

    for (const keyword of data.keywords) {
      const keywordLower = keyword.toLowerCase();
      const escaped = keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      if (msg === keywordLower) {
        score += 100;
      } else if (new RegExp(`\\b${escaped}\\b`, 'i').test(msg)) {
        score += 50;
      } else if (msg.includes(keywordLower)) {
        score += 10;
      }
    }

    if (score > highestScore && score > 0) {
      highestScore = score;
      bestMatch = { answer: data.answer, topic, score };
    }
  }

  if (bestMatch && bestMatch.score >= 10) return bestMatch;
  return null;
}

module.exports = { findBestMatch, KNOWLEDGE_BASE };
