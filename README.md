# My Personal Portfolio

A clean, minimal portfolio website built with Next.js, Tailwind CSS, and Shadcn UI. Features an AI chatbot, email contact form, and blog.

> Built this for fun and decided to open source it properly after getting lots of requests for permission to copy it!

## Live Demo

🌐 Check it out here: **[https://connorhyatt.com](https://connorhyatt.com)**

![Portfolio Screenshot](public/connorhyatt-com.png)

## Features

- Minimal design with Shadcn UI
- Light/dark mode toggle
- AI chatbot (Connor Support) trained on my portfolio content - please be nice to him! 😊
- Contact form with email integration
- Responsive mobile design
- Blog section

## Tech Stack

- Next.js
- Tailwind CSS
- Shadcn UI
- OpenAI API (chatbot)
- Vercel (hosting)
- Resend (email)

## Getting Started

```bash
git clone https://github.com/hyattc1/connorhyatt.com connor-portfolio
cd connor-portfolio
npm install
cp .env.example .env.local
# Add your own API keys to .env.local
npm run dev
```

## Environment Variables

```env
OPENAI_API_KEY=your_key
RESEND_API_KEY=your_key
CONTACT_TO_EMAIL=your_email (optional, defaults to connorhyatt1@gmail.com)
RESEND_FROM=your_from_email (optional)
```

## Customization

- Update personal info in `src/data/*.json`
- Replace projects in `src/data/projects.json`
- Replace blog posts in `content/` or remove it.
- Add your resume to `public/resume.pdf`
- Modify chatbot prompt in `src/app/api/chat/route.ts`

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy

## Costs

- OpenAI API: ~$5
- Domain: ~$20/year
- Hosting/DB: Free tiers

## License

MIT

---

Feel free to fork and make it your own! Would love to see what you guys build with it ✨
