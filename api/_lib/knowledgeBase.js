## `api/_lib/knowledgeBase.js`

```js
const P = require('./profile');

/*
|--------------------------------------------------------------------------
| Safe helpers
|--------------------------------------------------------------------------
*/

const projects = Array.isArray(P.projects) ? P.projects : [];
const skills = Array.isArray(P.skills) ? P.skills : [];
const experience = Array.isArray(P.experience) ? P.experience : [];
const education = Array.isArray(P.education) ? P.education : [];
const awards = Array.isArray(P.awards) ? P.awards : [];
const positions = Array.isArray(P.positions) ? P.positions : [];
const certifications = Array.isArray(P.certifications)
  ? P.certifications
  : [];

/*
|--------------------------------------------------------------------------
| Formatted data
|--------------------------------------------------------------------------
*/

const projectList = projects
  .map((pr) => {
    const tech = Array.isArray(pr.tech)
      ? pr.tech.join(', ')
      : 'Technology not specified';

    return `• ${pr.name} (${tech})${pr.link ? ` — ${pr.link}` : ''}`;
  })
  .join('\n');

const skillList = skills.join(', ');

const experienceList = experience
  .map((e) => {
    return `• ${e.role || 'Role not specified'} — ${
      e.company || 'Company not specified'
    }`;
  })
  .join('\n');

const educationList = education
  .map((e) => {
    return `• ${e.degree || 'Degree not specified'}, ${
      e.school || 'Institution not specified'
    }${e.detail ? ` (${e.detail})` : ''}`;
  })
  .join('\n');

const awardsList = awards
  .map((a) => `🏆 ${a}`)
  .join('\n');

const positionsList = positions
  .map((p) => `• ${p}`)
  .join('\n');

const certList = certifications
  .map((c) => `• ${c}`)
  .join('\n');

/*
|--------------------------------------------------------------------------
| Project details
|--------------------------------------------------------------------------
*/

function projectAnswer(project, emoji = '🚀') {
  if (!project) {
    return `I don't have detailed information about that project yet. 😊`;
  }

  const tech = Array.isArray(project.tech)
    ? project.tech.join(', ')
    : 'Not specified';

  return `${emoji} ${project.name}:

${project.desc || 'No detailed description is available yet.'}

🛠️ Technologies:
${tech}
${
  project.link
    ? `\n🔗 Live Project: ${project.link}`
    : ''
}`;
}

/*
|--------------------------------------------------------------------------
| Knowledge Base
|--------------------------------------------------------------------------
*/

const KNOWLEDGE_BASE = {

  /*
  |--------------------------------------------------------------------------
  | ABOUT
  |--------------------------------------------------------------------------
  */

  about: {
    keywords: [
      'who are you',
      'about you',
      'about satyesh',
      'who is satyesh',
      'tell me about yourself',
      'introduce yourself',
      'your background',
      'what do you do',
      'bio',
      'about the developer',
      'about the person',
      'developer profile'
    ],

    answer: `👋 Hi! I'm ${P.name}'s AI portfolio assistant.

💻 ${P.title}
${P.tagline || ''}

📍 ${P.location}

I can help you explore ${P.name}'s skills, projects, experience, education, resume and career opportunities.

You can ask things like:

• "What technologies does Satyesh know?"
• "Tell me about his projects"
• "Show me his resume"
• "Why should I hire Satyesh?"
• "How can I contact him?"`
  },

  /*
  |--------------------------------------------------------------------------
  | SKILLS
  |--------------------------------------------------------------------------
  */

  skills: {
    keywords: [
      'skills',
      'tech stack',
      'technologies',
      'what can you build',
      'programming languages',
      'what do you know',
      'stack',
      'tools',
      'frameworks',
      'languages',
      'technical skills',
      'developer skills',
      'coding skills',
      'technology stack'
    ],

    answer: `🛠️ ${P.name}'s Technical Skills:

${skills.map((skill) => `✅ ${skill}`).join('\n')}

Satyesh is continuously expanding his full-stack development and modern web development skills.`
  },

  /*
  |--------------------------------------------------------------------------
  | PROJECTS
  |--------------------------------------------------------------------------
  */

  projects: {
    keywords: [
      'projects',
      'portfolio projects',
      'work',
      'what have you built',
      'show me your work',
      'your projects',
      'case studies',
      'built anything',
      'apps built',
      'applications',
      'websites built',
      'projects built',
      'developer projects'
    ],

    answer: `🚀 ${P.name}'s Projects:

${projectList}

Ask me about any project by name and I can tell you more about it.`
  },

  /*
  |--------------------------------------------------------------------------
  | PORTFOLIO WEBSITE
  |--------------------------------------------------------------------------
  */

  project_portfolio: {
    keywords: [
      'portfolio website project',
      'this portfolio',
      'your portfolio site',
      'portfolio project',
      'satyeshsingh.site',
      'personal portfolio'
    ],

    answer: projects[0]
      ? projectAnswer(projects[0], '🌐')
      : `🌐 ${P.portfolioUrl}`
  },

  /*
  |--------------------------------------------------------------------------
  | ACM
  |--------------------------------------------------------------------------
  */

  project_acm: {
    keywords: [
      'acm',
      'acm student chapter',
      'acm website',
      'acmtulas',
      'tulas acm'
    ],

    answer: projects[1]
      ? projectAnswer(projects[1], '🎓')
      : `I don't have detailed information about the ACM project yet.`
  },

  /*
  |--------------------------------------------------------------------------
  | QRIFY
  |--------------------------------------------------------------------------
  */

  project_qrify: {
    keywords: [
      'qrify',
      'qr menu',
      'restaurant qr',
      'scan menu app',
      'restaurant menu',
      'qr restaurant'
    ],

    answer: projects[2]
      ? projectAnswer(projects[2], '🍽️')
      : `I don't have detailed information about QRIFY yet.`
  },

  /*
  |--------------------------------------------------------------------------
  | EXPERIENCE
  |--------------------------------------------------------------------------
  */

  experience: {
    keywords: [
      'experience',
      'internship',
      'internships',
      'work experience',
      'where have you worked',
      'job history',
      'career',
      'professional experience',
      'previous work',
      'work history',
      'internship experience'
    ],

    answer: `💼 ${P.name}'s Experience:

${experienceList}

This experience includes hands-on exposure to web development and software development workflows.`
  },

  /*
  |--------------------------------------------------------------------------
  | EDUCATION
  |--------------------------------------------------------------------------
  */

  education: {
    keywords: [
      'education',
      'college',
      'university',
      'degree',
      'studying',
      'academic background',
      'school',
      'qualification',
      'educational qualification',
      'academic qualification'
    ],

    answer: `🎓 Education:

${educationList}`
  },

  /*
  |--------------------------------------------------------------------------
  | AWARDS
  |--------------------------------------------------------------------------
  */

  awards: {
    keywords: [
      'awards',
      'achievements',
      'hackathon',
      'won',
      'recognition',
      'competitions',
      'prizes',
      'accomplishments'
    ],

    answer: awards.length
      ? `🏆 Awards & Recognitions:

${awardsList}`
      : `🏆 I don't currently have detailed award information available in ${P.name}'s portfolio.`
  },

  /*
  |--------------------------------------------------------------------------
  | POSITIONS / LEADERSHIP
  |--------------------------------------------------------------------------
  */

  positions: {
    keywords: [
      'position of responsibility',
      'leadership',
      'club',
      'gdsc',
      'optica',
      'secretary',
      'core member',
      'extracurricular',
      'leadership experience',
      'student leadership'
    ],

    answer: positions.length
      ? `🎖️ Leadership & Positions of Responsibility:

${positionsList}`
      : `🎖️ I don't currently have detailed leadership information available.`
  },

  /*
  |--------------------------------------------------------------------------
  | CERTIFICATIONS
  |--------------------------------------------------------------------------
  */

  certifications: {
    keywords: [
      'certifications',
      'certificates',
      'courses',
      'certified',
      'training',
      'oracle',
      'cisco',
      'wordpress certification',
      'mern certification'
    ],

    answer: certifications.length
      ? `📜 Courses & Certifications:

${certList}`
      : `📜 I don't currently have detailed certification information available.`
  },

  /*
  |--------------------------------------------------------------------------
  | CONTACT
  |--------------------------------------------------------------------------
  */

  contact: {
    keywords: [
      'contact',
      'email',
      'phone',
      'reach you',
      'get in touch',
      'connect',
      'call you',
      'how to contact',
      'number',
      'contact satyesh',
      'reach satyesh'
    ],

    answer: `📞 Get in Touch with ${P.name}:

📧 Email: ${P.email}
📱 Phone: ${P.phone}
💻 GitHub: ${P.github}${
      P.linkedin ? `\n💼 LinkedIn: ${P.linkedin}` : ''
    }

You can also use the contact/callback option on the portfolio.`
  },

  /*
  |--------------------------------------------------------------------------
  | HIRING / RECRUITER
  |--------------------------------------------------------------------------
  */

  recruiter: {
    keywords: [
      'hire',
      'hire satyesh',
      'hire me',
      'hiring',
      'recruiter',
      'recruitment',
      'job opportunity',
      'job',
      'candidate',
      'looking for developer',
      'developer position',
      'employment',
      'work with satyesh',
      'work with you'
    ],

    answer: `🎯 Looking to work with ${P.name}?

I can help you explore:

💻 Technical Skills
🚀 Projects
💼 Experience
🎓 Education
📄 Resume
📬 Contact

You can ask me:

• "Why should I hire Satyesh?"
• "Show me his full-stack projects"
• "What technologies does he know?"
• "Show me his resume"
• "How can I contact him?"`
  },

  /*
  |--------------------------------------------------------------------------
  | AVAILABILITY
  |--------------------------------------------------------------------------
  */

  availability: {
    keywords: [
      'available',
      'availability',
      'looking for internship',
      'looking for internships',
      'looking for job',
      'open to work',
      'open for work',
      'available for work',
      'internship opportunity',
      'job opportunity',
      'career opportunity'
    ],

    answer: `📌 For current availability or opportunities, please contact ${P.name} directly through the contact information provided on the portfolio.

📧 ${P.email}

I don't want to assume his availability unless it is explicitly stated in his current profile.`
  },

  /*
  |--------------------------------------------------------------------------
  | SOCIAL LINKS
  |--------------------------------------------------------------------------
  */

  social: {
    keywords: [
      'github',
      'linkedin',
      'social media',
      'social links',
      'follow you',
      'your github',
      'your linkedin',
      'github profile',
      'linkedin profile'
    ],

    answer: `🔗 Find ${P.name} online:

💻 GitHub: ${P.github}${
      P.linkedin ? `\n💼 LinkedIn: ${P.linkedin}` : ''
    }

🌐 Portfolio: ${P.portfolioUrl}`
  },

  /*
  |--------------------------------------------------------------------------
  | RESUME
  |--------------------------------------------------------------------------
  */

  resume: {
    keywords: [
      'resume',
      'cv',
      'download resume',
      'send resume',
      'your cv',
      'resume link',
      'download cv',
      'view resume',
      'see resume'
    ],

    answer: P.resumeUrl
      ? `📄 ${P.name}'s Resume:

You can view or download the resume here:

🔗 ${P.resumeUrl}`
      : `📄 ${P.name}'s resume is available on request.

📧 Contact: ${P.email}`
  },

  /*
  |--------------------------------------------------------------------------
  | PROJECT TECHNOLOGY
  |--------------------------------------------------------------------------
  */

  project_technology: {
    keywords: [
      'which project uses',
      'project uses',
      'technology used in',
      'technologies used',
      'what stack does',
      'tech used in project',
      'which project has react',
      'which project has node',
      'which project has javascript',
      'which project has php',
      'which project has mongodb',
      'which project has mysql'
    ],

    answer: `🛠️ I can help identify the technologies used in ${P.name}'s projects.

Try asking something specific, for example:

• "What technologies does QRIFY use?"
• "Which project uses React?"
• "What stack was used for the ACM website?"
• "What technologies were used in the portfolio?"`
  },

  /*
  |--------------------------------------------------------------------------
  | WHY HIRE
  |--------------------------------------------------------------------------
  */

  why_hire: {
    keywords: [
      'why hire satyesh',
      'why should i hire satyesh',
      'why hire him',
      'why should i hire him',
      'why hire you',
      'why should i hire you',
      'good candidate',
      'suitable candidate',
      'why is satyesh good',
      'what makes satyesh suitable'
    ],

    answer: `🎯 Why consider ${P.name}?

${P.name} combines practical web development experience with hands-on project work.

Key areas include:

💻 Full-stack web development
🛠️ Modern frontend and backend technologies
🚀 Real-world portfolio projects
📚 Continuous learning
🤝 Experience working on development projects

For a detailed evaluation, I recommend reviewing his projects, experience and resume.`
  },

  /*
  |--------------------------------------------------------------------------
  | SERVICES
  |--------------------------------------------------------------------------
  */

  services: {
    keywords: [
      'services',
      'what services do you offer',
      'what can you do for me',
      'freelance services',
      'development services',
      'web development services',
      'website development',
      'app development',
      'can you build a website'
    ],

    answer: `💻 ${P.name}'s Development Capabilities:

Based on the portfolio, his work focuses on web development, full-stack applications and modern web technologies.

You can ask me about:

• Frontend development
• Backend development
• Full-stack projects
• AI-powered applications
• Website development
• Portfolio development

For a specific project or collaboration, use the contact option.`
  },

  /*
  |--------------------------------------------------------------------------
  | THANKS / CASUAL
  |--------------------------------------------------------------------------
  */

  thanks: {
    keywords: [
      'thank you',
      'thanks',
      'thnx',
      'thankyou',
      'ok',
      'okay',
      'okk',
      'k',
      'great',
      'good',
      'nice',
      'alright',
      'perfect',
      'got it',
      'cool'
    ],

    answer: `😊 You're welcome!

Feel free to ask about ${P.name}'s:

💻 Skills
🚀 Projects
💼 Experience
📄 Resume
🎯 Career opportunities
📬 Contact information`
  }
};

module.exports = KNOWLEDGE_BASE;
```
