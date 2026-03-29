# ViyonaDigital - Deployment Guide

## Slide 1: Title Slide
**Title:** ViyonaDigital Deployment Guide
**Subtitle:** Step-by-Step Instructions to Deploy Your Agency Website
**Content:** 
- Complete deployment walkthrough
- System requirements and prerequisites
- Installation and configuration steps
- Live deployment to production

---

## Slide 2: System Requirements & Prerequisites
**Title:** What You Need Before Starting
**Content:**
Your deployment requires the following tools and accounts:

**Essential Software:**
- Node.js 22.13.0 or higher (includes npm/pnpm)
- Git version control system
- A code editor (VS Code recommended)
- Terminal/Command Prompt access

**Required Accounts:**
- Manus platform account (for hosting and deployment)
- GitHub account (for code repository)
- MySQL/TiDB database (provided by Manus)
- Optional: DeepSeek API account (for AI chatbot)

**System Specifications:**
- Minimum 2GB RAM for development
- 500MB free disk space
- Stable internet connection
- Modern web browser (Chrome, Firefox, Safari, Edge)

---

## Slide 3: Download & Installation - Part 1
**Title:** Download Essential Tools
**Content:**
Follow these steps to download and install required software:

**Step 1: Install Node.js**
- Visit nodejs.org
- Download LTS version (22.13.0 or higher)
- Run installer and follow prompts
- Verify installation: Open terminal and type `node --version`

**Step 2: Install Git**
- Visit git-scm.com
- Download for your operating system (Windows/Mac/Linux)
- Run installer with default settings
- Verify installation: Type `git --version` in terminal

**Step 3: Create Manus Account**
- Go to manus.im
- Click "Sign Up"
- Complete registration with email
- Verify email address

---

## Slide 4: Download & Installation - Part 2
**Title:** Set Up Your Development Environment
**Content:**
Configure your local development workspace:

**Step 4: Install Code Editor**
- Download VS Code from code.visualstudio.com
- Install and open the application
- Install recommended extensions: ES7+ React/Redux, Tailwind CSS IntelliSense

**Step 5: Clone Project Repository**
- Open terminal/command prompt
- Navigate to desired folder: `cd ~/projects`
- Clone repository: `git clone <repository-url>`
- Navigate into project: `cd viyona-digital`

**Step 6: Install Project Dependencies**
- In terminal, run: `pnpm install`
- Wait for all packages to download (2-5 minutes)
- Verify success: No red error messages should appear

---

## Slide 5: Local Development Setup
**Title:** Configure Your Local Development Server
**Content:**
Set up and test the application locally before deployment:

**Step 7: Create Environment Configuration**
- Copy `.env.example` to `.env.local`
- Add your configuration values:
  - DATABASE_URL: Your MySQL connection string
  - JWT_SECRET: Random 32-character string
  - VITE_APP_ID: From Manus dashboard
  - OAUTH_SERVER_URL: Provided by Manus

**Step 8: Initialize Database**
- Run migration: `pnpm drizzle-kit generate`
- Apply migrations: `pnpm drizzle-kit migrate`
- Verify tables created in database

**Step 9: Start Development Server**
- Run: `pnpm dev`
- Wait for message "Server running on http://localhost:3000"
- Open browser and visit http://localhost:3000
- Test homepage loads correctly

---

## Slide 6: Testing Before Deployment
**Title:** Verify All Features Work Locally
**Content:**
Thoroughly test your application before going live:

**Functionality Tests:**
- Homepage loads with all sections visible
- Navigation menu works on desktop and mobile
- Chatbot widget opens and closes properly
- Admin button navigates to login page
- Contact form submits successfully
- Admin login works (email: admin@viyonadigital.com, password: admin123)

**Responsive Design Tests:**
- Test on desktop (1920x1080), tablet (768x1024), mobile (375x667)
- Use browser DevTools: Press F12, click device toggle
- Verify all elements are readable and clickable

**Run Automated Tests:**
- Execute: `pnpm test`
- Verify all tests pass (13 tests should pass)
- No red errors in test output

---

## Slide 7: Deployment to Manus Platform - Part 1
**Title:** Prepare for Production Deployment
**Content:**
Get your application ready for live deployment:

**Step 10: Build for Production**
- Run: `pnpm build`
- Wait for build to complete (1-2 minutes)
- Verify no errors in build output
- Check `dist/` folder is created

**Step 11: Configure Production Environment**
- Create `.env.production` file
- Set production database URL (different from development)
- Use strong JWT_SECRET (32+ random characters)
- Disable debug logging for security

**Step 12: Push Code to GitHub**
- Run: `git add .`
- Run: `git commit -m "Production ready deployment"`
- Run: `git push origin main`
- Verify code appears on GitHub repository

---

## Slide 8: Deployment to Manus Platform - Part 2
**Title:** Deploy Your Website Live
**Content:**
Complete the deployment process on Manus:

**Step 13: Access Manus Dashboard**
- Log in to manus.im
- Navigate to "Projects" section
- Click "New Project" or select existing project
- Choose "Deploy from GitHub"

**Step 14: Connect GitHub Repository**
- Select your GitHub account
- Choose viyona-digital repository
- Select "main" branch
- Authorize Manus to access repository

**Step 15: Configure Deployment Settings**
- Set build command: `pnpm build`
- Set start command: `pnpm start`
- Add environment variables (same as production)
- Enable automatic deployments on push

---

## Slide 9: Post-Deployment Configuration
**Title:** Set Up Your Live Website
**Content:**
Configure your deployed application:

**Step 16: Add Custom Domain (Optional)**
- Go to Manus project settings
- Navigate to "Domains" section
- Add your custom domain (e.g., viyonadigital.com)
- Update DNS records at your domain registrar
- Wait 24-48 hours for DNS propagation

**Step 17: Configure DeepSeek API (Optional)**
- Get API key from deepseek.com
- Log in to admin panel on live site
- Navigate to Settings > DeepSeek API
- Paste API key and save
- Test chatbot responses

**Step 18: Set Up Email Notifications**
- In admin settings, enter your email
- Enable email notifications
- Test by submitting a lead through chatbot
- Verify notification email received

---

## Slide 10: Monitoring & Maintenance
**Title:** Keep Your Website Running Smoothly
**Content:**
Ongoing tasks after deployment:

**Daily Monitoring:**
- Check admin dashboard for new leads
- Review chatbot conversations
- Monitor website uptime via Manus dashboard
- Check error logs for any issues

**Weekly Tasks:**
- Update lead statuses in admin panel
- Review and respond to demo requests
- Check website performance metrics
- Backup database (Manus does this automatically)

**Monthly Maintenance:**
- Review analytics and conversion rates
- Update testimonials and case studies via CMS
- Test all forms and functionality
- Update content as needed

**Security Best Practices:**
- Never share admin credentials
- Use strong passwords (16+ characters)
- Enable two-factor authentication if available
- Keep software and dependencies updated

---

## Slide 11: Troubleshooting Common Issues
**Title:** Solutions to Common Deployment Problems
**Content:**
Quick fixes for typical issues:

**Issue: Build fails with dependency errors**
- Solution: Run `pnpm install` again, then `pnpm build`
- Clear cache: `pnpm store prune`

**Issue: Database connection fails**
- Solution: Verify DATABASE_URL is correct
- Check MySQL credentials and permissions
- Ensure database server is running

**Issue: Website shows blank page**
- Solution: Check browser console for errors (F12)
- Verify environment variables are set
- Check server logs in Manus dashboard

**Issue: Chatbot not responding**
- Solution: Verify DeepSeek API key is valid
- Check API key in admin settings
- Fallback responses should still work

**Issue: Admin login doesn't work**
- Solution: Verify email/password: admin@viyonadigital.com / admin123
- Clear browser cache and cookies
- Check localStorage in browser DevTools

---

## Slide 12: Performance Optimization Tips
**Title:** Make Your Website Faster
**Content:**
Improve user experience and SEO:

**Image Optimization:**
- Compress images before uploading
- Use modern formats (WebP instead of PNG)
- Lazy load images below the fold
- Use CDN for static assets

**Code Optimization:**
- Enable caching headers in production
- Minify CSS and JavaScript
- Remove unused dependencies
- Use production build mode

**Database Optimization:**
- Add indexes to frequently queried fields
- Archive old leads periodically
- Optimize database queries
- Monitor query performance

**Monitoring Tools:**
- Use Manus analytics dashboard
- Monitor Core Web Vitals
- Track conversion rates
- Set up performance alerts

---

## Slide 13: Scaling Your Application
**Title:** Growing Beyond Initial Deployment
**Content:**
Prepare for increased traffic:

**When to Scale:**
- Website receives 1000+ monthly visitors
- Database has 10,000+ leads
- Admin panel becomes slow
- Need advanced features

**Scaling Options:**
- Upgrade Manus hosting tier
- Implement caching layer (Redis)
- Optimize database queries
- Add CDN for static content

**Future Features to Add:**
- Email notification service integration
- Advanced lead scoring system
- Multi-user admin roles
- API for third-party integrations
- Mobile app for lead management

---

## Slide 14: Support & Resources
**Title:** Getting Help & Learning More
**Content:**
Where to find help and additional information:

**Documentation:**
- Manus official docs: docs.manus.im
- Node.js documentation: nodejs.org/docs
- React documentation: react.dev
- Tailwind CSS docs: tailwindcss.com

**Community Support:**
- Manus community forum: community.manus.im
- Stack Overflow for technical questions
- GitHub issues for bug reports
- Email support: support@manus.im

**Video Tutorials:**
- Deployment walkthrough on YouTube
- Admin panel tutorial
- Chatbot customization guide
- Database management tutorial

**Contact Information:**
- Technical Support: support@viyonadigital.com
- Sales Inquiry: sales@viyonadigital.com
- Emergency Issues: +1 (555) 123-4567

---

## Slide 15: Deployment Checklist
**Title:** Final Verification Before Going Live
**Content:**
Complete this checklist before launching:

**Pre-Deployment:**
- ✓ All dependencies installed
- ✓ Environment variables configured
- ✓ Database migrations applied
- ✓ Local testing completed
- ✓ All 13 tests passing

**Deployment:**
- ✓ Code pushed to GitHub
- ✓ Build succeeds without errors
- ✓ Environment variables set in Manus
- ✓ Database connected and working
- ✓ SSL certificate configured

**Post-Deployment:**
- ✓ Website loads on custom domain
- ✓ All pages accessible
- ✓ Admin panel working
- ✓ Chatbot functional
- ✓ Email notifications configured
- ✓ Monitoring and alerts set up

**Congratulations! Your ViyonaDigital website is live!**
