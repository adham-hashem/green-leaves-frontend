# Cambridge Green Leaves - Site Map

## Public Website Structure

### Main Pages

#### 1. Homepage `/`
A clean, focused landing page showcasing the core business.

**Sections (Top to Bottom)**
- Header with Navigation
  - Logo
  - Navigation Links: Home, Services, Book a Service, **Before & After**, Contact
  - Call Button: 07961228431
  
- Hero Section
  - Large headline: "Professional Gardening Services in Cambridge"
  - Subheadline: "Transforming Gardens, Creating Beautiful Spaces"
  - Call-to-Action Buttons: "Book a Service" & "Call Now"
  - Beautiful garden background image

- Services Section
  - Grid of 6 service offerings:
    - Garden Design & Consultation
    - Landscape Installation
    - Maintenance & Care
    - Hard Landscaping
    - Planting & Flowers
    - Tree & Hedge Services
  - Icon + description for each

- Booking Form Section
  - Full name, email, phone, address inputs
  - Service type selection
  - Budget selection
  - Image upload capability
  - Notes field
  - Submit button

- Contact Section
  - Phone number with direct link
  - Address information
  - Business hours (if applicable)
  - Quick contact form

- Footer
  - Company info
  - Quick links
  - Contact information
  - Social media (if applicable)

---

#### 2. Before & After Gallery `/before-after`
A **completely independent, standalone portfolio page** showcasing all project transformations.

**Page Structure**
- Header with Navigation (same as homepage)
  - Allows seamless navigation between pages

- Hero Section (Custom for Gallery)
  - Large title: "Our Project Gallery"
  - Subtitle: "Explore the transformation of gardens..."
  - Back to Home link

- Gallery Grid
  - Responsive layout:
    - Mobile: 1 column
    - Tablet: 1-2 columns
    - Desktop: 2 columns
  
  - Each Project Card Contains:
    - **Image Comparison**:
      - Before image
      - After image (overlaid)
      - Draggable/touch slider to compare
      - Before/After labels
    
    - **OR Video Comparison** (for video projects):
      - Side-by-side video playback
      - Play/pause controls
      - Before/After labels
      - Blue "Video" badge
    
    - Project Details:
      - Title (e.g., "Garden Renovation")
      - Description
      - Hover effects showing transformation

- Footer (Inherited from layout)

**Key Features**
- Fully independent from homepage
- No homepage sections included
- Can be bookmarked/shared directly
- Full page experience with navigation

---

#### 3. Admin Portal (Private)

##### Login Page `/admin/login`
- Company logo
- Email input
- Password input
- Login button
- Garden-themed background
- Error messages
- No public access

##### Dashboard `/admin`
**Protected Route** (Requires authentication)

**Navigation Sidebar**
- Dashboard
- Bookings
- Before & After
- Services
- Messages (coming soon)
- Settings (coming soon)
- Logout button

**Dashboard Overview**
- 4 Statistics Cards:
  - Total Bookings
  - Pending Jobs
  - Completed Jobs
  - Contacted Customers
- Quick Stats (completion rate, response rate)
- Recent Activity Feed

**Bookings Management**
- Status filter buttons (All, Pending, Contacted, Completed)
- Data table with columns:
  - Customer Name
  - Phone
  - Service
  - Budget
  - Status (with dropdown)
  - Actions (view, edit, delete)
- Booking details modal for editing

**Before & After Management**
- Add Project button
- Project creation form:
  - Title input
  - Description textarea
  - Media type selector (Images/Videos/Both)
  - File upload inputs (direct device upload)
  - Image preview
  - Video preview
- Project grid with:
  - Hover preview
  - Delete button
  - Media type badge (for videos)

**Services Management**
- Display of all offered services
- Service management info
- Edit services (admin-only)

---

## Navigation Paths

### From Homepage
```
Homepage
├── Header: Click "Before & After" → /before-after
├── Hero: Click "Book a Service" → Smooth scroll to booking form
├── Services: Click on service → May open details (if implemented)
├── Booking: Submit form → Saves to database
├── Contact: Click phone → Call action
└── Footer: Various links
```

### From Before & After Gallery
```
Gallery Page
├── Header: Click logo → /
├── Header: Click home nav items → / (smooth scroll)
├── Back Button → /
└── Any navbar item → respective section on homepage
```

### From Admin Panel
```
Admin Portal (Private)
├── Login → /admin/login
├── Dashboard → /admin (after auth)
├── Sidebar: 
│   ├── Dashboard → Overview
│   ├── Bookings → Management table
│   ├── Before & After → Gallery upload
│   ├── Services → Service display
│   └── Logout → /admin/login
└── Protected routes (auto-redirect if not authenticated)
```

---

## Complete URL Reference

| Page | URL | Purpose | Access |
|------|-----|---------|--------|
| Homepage | `/` | Main landing page | Public |
| Before & After Gallery | `/before-after` | Project portfolio | Public |
| Admin Login | `/admin/login` | Authentication | Semi-public (intentionally unlisted) |
| Admin Dashboard | `/admin` | Management portal | Private (auth required) |
| Fallback | `*` | Any invalid URL | Redirects to `/` |

---

## SEO & Meta Structure

### Homepage
- Title: "Cambridge Green Leaves | Professional Gardening Services"
- Description: "Expert landscaping, garden design, and maintenance in Cambridge"
- Keywords: landscaping, garden design, Cambridge, services

### Gallery Page
- Title: "Before & After Gallery | Cambridge Green Leaves"
- Description: "See our latest garden transformation projects and before/after results"
- Keywords: before after, projects, gallery, landscaping, transformation

### Admin
- No SEO (private portal)
- Robots.txt excludes `/admin/*`

---

## Responsive Breakpoints

**Mobile** (< 640px)
- Single column layout
- Hamburger menu
- Full-width cards
- Touch-optimized sliders

**Tablet** (640px - 1024px)
- Two columns where applicable
- Optimized spacing
- Touch-friendly interactions

**Desktop** (> 1024px)
- Multi-column layouts
- Full desktop experience
- Hover effects active
- Drag/mouse-enabled interactions

---

## Key Design Elements

### Colors
- **Primary Green**: #16a34a (CTA buttons, highlights)
- **Secondary Yellow**: #eab308 (Call button, accents)
- **Neutral Grays**: For text and backgrounds
- **Success Green**: For completed status
- **Warning Yellow**: For pending status
- **Info Blue**: For contacted status

### Typography
- Headlines: Bold, large (24px-48px)
- Body: Regular, readable (14px-16px)
- Line height: 1.5-1.6 for body text

### Components
- Rounded cards (rounded-2xl, rounded-3xl)
- Soft shadows (shadow-lg, shadow-xl)
- Smooth transitions (300ms)
- Hover effects with transforms
- Modern form elements

---

## Performance Metrics

- Build size: ~30kb CSS (gzipped), ~376kb JS (gzipped)
- All pages load independently
- Images lazy-loaded by default
- Videos stream from cloud storage
- Database queries optimized with indexes
- Responsive images for different screen sizes
