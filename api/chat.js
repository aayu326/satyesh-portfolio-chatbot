const { applyCors } = require('./_lib/cors');
const { findBestMatch } = require('./_lib/matcher');
const P = require('./_lib/profile');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

let genAI = null;
if (GEMINI_API_KEY) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

async function callGemini(prompt) {
  if (!genAI) throw new Error('Gemini not configured');
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  const systemContext = `You are a friendly assistant embedded on ${P.name}'s personal developer portfolio (${P.portfolioUrl}).

Facts about ${P.name}:
- Title: ${P.title}
- Location: ${P.location}
- Skills: ${P.skills.join(', ')}
- Projects: ${P.projects.map(pr => pr.name).join(', ')}
- Experience: ${P.experience.map(e => `${e.role} at ${e.company}`).join('; ')}
- Contact: ${P.email}, ${P.phone}
- GitHub: ${P.github}

Guidelines:
- Answer ONLY questions about ${P.name}, their skills, projects, or how to get in touch.
- Keep responses friendly, concise, and use emojis sparingly.
- For unrelated questions, politely redirect back to portfolio-related topics.
- If you don't know a specific detail, suggest the visitor contact ${P.name} directly.

Visitor question: ${prompt}`;

  const result = await model.generateContent(systemContext);
  const text = result.response.text();
  if (!text) throw new Error('Empty Gemini response');
  return text;
}

module.exports = async (req, res) => {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ success: false, error: 'Message is required' });

    if (/^(hi|hello|hey|good morning|good afternoon|good evening)/i.test(message.trim())) {
      const greetings = [
        `Hello! 👋 I'm ${P.name}'s portfolio assistant. Ask me about projects, skills, or how to get in touch!`,
        `Hi there! 💻 Curious about ${P.name}'s work? Ask away — projects, experience, skills, anything!`
      ];
      return res.json({ success: true, reply: greetings[Math.floor(Math.random() * greetings.length)], mode: 'greeting' });
    }

    const knowledgeMatch = findBestMatch(message);
    if (knowledgeMatch) {
      return res.json({ success: true, reply: knowledgeMatch.answer, mode: 'knowledge-base', currentTopic: knowledgeMatch.topic });
    }

    if (GEMINI_API_KEY) {
      try {
        const reply = await callGemini(message);
        return res.json({ success: true, reply: reply.trim(), mode: 'ai-powered' });
      } catch (err) {
        console.log('Gemini unavailable, falling back to callback flow:', err.message);
      }
    }

    return res.json({
      success: true,
      reply: `I don't have a specific answer for that yet. 😊\n\nWant ${P.name} to get back to you personally? Drop your number below and I'll pass it along!`,
      mode: 'callback-request',
      requiresCallback: true,
      userQuery: message
    });
  } catch (err) {
    console.error('chat error:', err.message);
    return res.json({
      success: true,
      reply: `Something went wrong on my end. 😊 You can reach ${P.name} directly at ${P.email} or ${P.phone}.`,
      mode: 'emergency-fallback'
    });
  }
};
