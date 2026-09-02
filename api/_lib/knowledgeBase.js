const P = require('./profile');

const projectList = P.projects
  .map(pr => `• ${pr.name} (${pr.tech.join(', ')})${pr.link ? ` — ${pr.link}` : ''}`)
  .join('\n');

const skillList = P.skills.join(', ');

const experienceList = P.experience.map(e => `• ${e.role} — ${e.company}`).join('\n');

const educationList = P.education.map(e => `• ${e.degree}, ${e.school} (${e.detail})`).join('\n');

const awardsList = P.awards.map(a => `🏆 ${a}`).join('\n');

const positionsList = P.positions.map(p => `• ${p}`).join('\n');

const certList = P.certifications.map(c => `• ${c}`).join('\n');

const KNOWLEDGE_BASE = {

  about: {
    keywords: [
      'who are you', 'about you', 'about satyesh', 'who is satyesh', 'tell me about yourself',
      'introduce yourself', 'your background', 'what do you do', 'bio', 'about the developer'
    ],
    answer: `👋 Hi, I'm ${P.name}!\n\n💻 ${P.title}\n${P.tagline}\n\n📍 ${P.location}\n\nCurrently studying Computer Science Engineering and building full-stack projects with React, JavaScript, PHP and more. Ask me about my projects, skills, or how to get in touch!`
  },

  skills: {
    keywords: [
      'skills', 'tech stack', 'technologies', 'what can you build', 'programming languages',
      'what do you know', 'stack', 'tools', 'frameworks', 'languages'
    ],
    answer: `🛠️ Skills & Technologies:\n\n${skillList.split(', ').map(s => '✅ ' + s).join('\n')}\n\nAlways learning — currently deepening MERN stack and cloud/deployment workflows.`
  },

  projects: {
    keywords: [
      'projects', 'portfolio projects', 'work', 'what have you built', 'show me your work',
      'your projects', 'case studies', 'built anything', 'apps built'
    ],
    answer: `🚀 Projects:\n\n${projectList}\n\nAsk me about any one of them by name for more detail (e.g. "tell me about QRIFY")!`
  },

  project_portfolio: {
    keywords: ['portfolio website project', 'this portfolio', 'your portfolio site'],
    answer: `🌐 Portfolio Website:\n\n${P.projects[0].desc}\n\n🔗 Live: ${P.projects[0].link}`
  },

  project_acm: {
    keywords: ['acm', 'acm student chapter', 'acm website', 'acmtulas'],
    answer: `🎓 ACM Student Chapter Website — Tula's Institute:\n\n${P.projects[1].desc}\n\n🔗 Live: ${P.projects[1].link}`
  },

  project_qrify: {
    keywords: ['qrify', 'qr menu', 'restaurant qr', 'scan menu app'],
    answer: `🍽️ QRIFY:\n\n${P.projects[2].desc}${P.projects[2].link ? `\n\n🔗 Live: ${P.projects[2].link}` : ''}`
  },

  experience: {
    keywords: [
      'experience', 'internship', 'internships', 'work experience', 'where have you worked',
      'job history', 'career', 'professional experience'
    ],
    answer: `💼 Experience:\n\n${experienceList}\n\nHands-on internships covering front-end, full-stack, and general web development.`
  },

  education: {
    keywords: [
      'education', 'college', 'university', 'degree', 'studying', 'academic background',
      'school', 'qualification'
    ],
    answer: `🎓 Education:\n\n${educationList}`
  },

  awards: {
    keywords: [
      'awards', 'achievements', 'hackathon', 'won', 'recognition', 'competitions', 'prizes'
    ],
    answer: `🏆 Awards & Recognitions:\n\n${awardsList}`
  },

  positions: {
    keywords: [
      'position of responsibility', 'leadership', 'club', 'gdsc', 'optica', 'secretary',
      'core member', 'extracurricular'
    ],
    answer: `🎖️ Leadership & Positions of Responsibility:\n\n${positionsList}`
  },

  certifications: {
    keywords: [
      'certifications', 'certificates', 'courses', 'certified', 'training', 'oracle',
      'cisco', 'wordpress certification', 'mern certification'
    ],
    answer: `📜 Courses & Certifications:\n\n${certList}`
  },

  contact: {
    keywords: [
      'contact', 'email', 'phone', 'reach you', 'get in touch', 'connect', 'call you',
      'how to contact', 'number', 'hire you', 'available for hire', 'freelance', 'hire me'
    ],
    answer: `📞 Get in Touch:\n\n📧 Email: ${P.email}\n📱 Phone: ${P.phone}\n💻 GitHub: ${P.github}${P.linkedin ? `\n💼 LinkedIn: ${P.linkedin}` : ''}\n\nHappy to chat about internships, freelance work, or collaboration! Or leave your number below and I'll call you back. 😊`
  },

  social: {
    keywords: [
      'github', 'linkedin', 'social media', 'social links', 'follow you', 'your github',
      'your linkedin'
    ],
    answer: `🔗 Find me online:\n\n💻 GitHub: ${P.github}${P.linkedin ? `\n💼 LinkedIn: ${P.linkedin}` : ''}\n🌐 Portfolio: ${P.portfolioUrl}`
  },

  resume: {
    keywords: [
      'resume', 'cv', 'download resume', 'send resume', 'your cv', 'resume link'
    ],
    answer: P.resumeUrl
      ? `📄 Resume:\n\nYou can view/download it here: ${P.resumeUrl}`
      : `📄 I'd love to share my resume — email me at ${P.email} and I'll send it right over!`
  },

  thanks: {
    keywords: [
      'thank you', 'thanks', 'thnx', 'thankyou', 'ok', 'okay', 'okk', 'k',
      'great', 'good', 'nice', 'alright', 'perfect', 'got it', 'cool'
    ],
    answer: `😊 You're welcome!\n\nFeel free to ask about my projects, skills, or experience — or leave your contact and I'll get back to you.\n\n📧 ${P.email}`
  }
};

module.exports = KNOWLEDGE_BASE;
