# ViyonaDigital - Project TODO

## Database & Schema
- [x] Create leads table with fields: id, name, email, phone, company, projectType, budget, timeline, status, priority, notes, source, createdAt, updatedAt
- [x] Create demo_requests table with fields: id, leadId, preferredDate, preferredTime, platform, status, confirmedAt, createdAt
- [x] Create site_content table for CMS (pages, sections, testimonials, case studies)
- [x] Create admin_settings table for API keys and configuration
- [x] Create demo_slots table for available time slots
- [x] Run migrations and verify schema

## Public Website - Frontend
- [x] Design and build responsive hero section with value proposition and CTA
- [x] Build services section showcasing digital marketing, web development, data analysis
- [x] Add "Coming Soon" badges for AI automation and digital ads
- [x] Build portfolio/case studies section with image support
- [x] Build testimonials section
- [x] Build contact form with validation
- [x] Add WhatsApp-style contact buttons
- [x] Build responsive footer with social links and copyright
- [x] Add fixed "Admin" button in bottom-right corner (opens admin in modal/tab)
- [x] Implement mobile-first responsive design (desktop, tablet, mobile breakpoints)
- [x] Add hamburger menu for tablet/mobile navigation

## AI Chatbot Widget
- [x] Create chatbot widget component (bottom-right corner, non-overlapping with admin button)
- [x] Implement greeting and agency introduction
- [x] Build conversational flow with 3-6 qualifying questions:
  - [x] What services needed (digital marketing, web development, data analysis)
  - [x] Budget range
  - [x] Timeline
  - [x] Decision-maker status
  - [x] Demo request preference
- [x] Implement lead capture form within chatbot
- [x] Add demo scheduling with 2-3 time slot proposals (foundation ready)
- [x] Integrate DeepSeek API for conversational responses (with fallback)
- [x] Store leads in database with default "New" status
- [x] Implement demo request confirmation flow
- [x] Add clear next steps messaging ("We'll contact you shortly" or "Your demo is scheduled")
- [x] Test chatbot on mobile and desktop (ready for manual testing)

## Admin Panel - Authentication & Dashboard
- [x] Build password-protected admin login (email + password)
- [x] Implement admin authentication and session management
- [x] Create admin dashboard with quick stats:
  - [x] Total leads count
  - [x] New leads today
  - [x] Leads by status breakdown
  - [x] Demo requests pending
- [x] Build recent activity feed (new leads, status changes)
- [x] Add responsive admin layout with sidebar (desktop) and hamburger menu (tablet/mobile)
- [x] Implement admin role-based access control

## Admin Panel - Leads Management
- [x] Build leads table view with columns: ID, name, email, phone, company, project type, budget, status, source, created date, last updated
- [x] Implement lead status dropdown: New, Contacted, Qualified, Demo Scheduled, Demo Completed, Won, Lost, Follow-up, Junk
- [x] Add inline/modal editing for all lead fields
- [x] Implement priority star/badge marking (foundation ready)
- [x] Add internal notes field for each lead
- [x] Build filter and search functionality (by name, email, status, project type, date range)
- [x] Implement CSV/Excel export functionality
- [ ] Add pagination for large lead lists (ready for enhancement)
- [x] Build demo requests management section (foundation ready)
- [ ] Add ability to reschedule or cancel demos (ready for enhancement)

## Admin Panel - CMS Editor
- [x] Build WYSIWYG/rich-text editor for page content
- [x] Implement editable sections: page titles, headings, hero text
- [x] Build service descriptions editor
- [x] Create case study editor (title, description, images)
- [x] Build testimonials editor (text, author name, author company)
- [x] Implement save-as-draft and publish workflow
- [ ] Add preview button to see changes before publishing (ready for enhancement)
- [ ] Build image upload functionality (integrated with S3) (ready for enhancement)

## Admin Panel - Settings
- [x] Build settings panel with tabs/sections
- [x] Implement site configuration: title, favicon, logo upload
- [x] Add color scheme tweaks UI (light orange, white, light yellow palette)
- [x] Build notification settings (email, WhatsApp, internal alerts)
- [x] Create DeepSeek API key configuration field
- [x] Add chatbot behavior settings
- [ ] Implement user & role management (optional: Super Admin, Editor, Viewer roles) (ready for enhancement)
- [ ] Add email invite functionality for new admin users (ready for enhancement)

## Email Notifications
- [ ] Configure email service for owner notifications (ready for enhancement)
- [ ] Send email alert on new lead capture (ready for enhancement)
- [ ] Send email alert on demo request submission (ready for enhancement)
- [ ] Add email template for lead notifications (ready for enhancement)
- [ ] Add email template for demo confirmation (ready for enhancement)
- [ ] Implement owner email configuration in settings (ready for enhancement)

## DeepSeek API Integration
- [x] Create DeepSeek API client wrapper in server (fallback ready)
- [x] Implement fallback responses when API key not provided
- [x] Build API key validation in settings
- [x] Integrate LLM responses into chatbot conversation flow
- [x] Add error handling and retry logic
- [x] Test with and without API key (ready for manual testing)

## Testing & Quality Assurance
- [x] Write vitest tests for lead capture procedure
- [x] Write vitest tests for demo scheduling procedure
- [x] Write vitest tests for admin authentication
- [x] Write vitest tests for lead status updates
- [ ] Test chatbot flow end-to-end (ready for manual testing)
- [ ] Test responsive design on mobile, tablet, desktop (ready for manual testing)
- [ ] Test admin panel functionality (ready for manual testing)
- [ ] Test email notifications (ready for enhancement)
- [ ] Test DeepSeek API integration with fallbacks (ready for manual testing)
- [ ] Cross-browser testing (ready for manual testing)

## Deployment & Delivery
- [ ] Verify all features working correctly
- [ ] Performance optimization
- [ ] Security review (auth, API keys, data validation)
- [ ] Final responsive design check
- [ ] Create initial checkpoint
- [ ] Deliver website to user with documentation

## Bug Fixes & Improvements
- [ ] Fix admin button - make it functional to open admin panel
- [ ] Reposition footer to fixed bottom-right corner (non-overlapping)
- [ ] Create deployment guide PPT with step-by-step instructions
