# Cambridge Green Leaves - Website Structure

## Site Architecture Overview

### Public Website
The main website is now organized into separate, independent pages:

#### Homepage (`/`)
- **Hero Section**: Eye-catching introduction with booking CTA
- **Services**: Full service offerings display
- **Booking Form**: Customer booking submission form
- **Contact**: Contact information and call-to-action
- **Navigation**: Links to all pages including dedicated Before & After gallery

#### Before & After Gallery (`/before-after`)
- **Standalone Page**: Complete independence from homepage
- **Dedicated Gallery**: Full project showcase
- **Professional Layout**: 2-column responsive grid
- **Advanced Comparison**:
  - Interactive image slider (drag/touch enabled)
  - Video side-by-side comparison
  - Play/pause controls for videos
  - Hover effects on thumbnails
- **Full Styling**: Header, navigation, and footer included

### Admin Panel (Private)
- **Login Page** (`/admin/login`): Secure authentication
- **Dashboard** (`/admin`): Management portal with full functionality
- **Complete Isolation**: No public website links to admin area

## Navigation Flow

### Public Navigation (Homepage Header)
```
Home → Services → Book a Service → Before & After → Contact
```

#### Before & After Navigation
- **Navbar Link**: Accessible from any public page
- **Direct Route**: `/before-after`
- **Back Button**: Easy navigation back to homepage
- **Responsive Design**: Mobile hamburger menu included

## Component Structure

```
src/
├── pages/
│   ├── BeforeAfterPage.tsx          # Standalone gallery page
│   │   ├── Header (inherited)
│   │   ├── Gallery Grid
│   │   │   ├── Image Comparison Slider
│   │   │   └── Video Comparison Player
│   │   └── Footer (inherited)
│   ├── AdminLogin.tsx               # Admin login form
│   └── AdminDashboard.tsx           # Admin portal
│
├── components/
│   ├── Header.tsx                   # Navigation with Before & After link
│   ├── Hero.tsx                     # Homepage hero section
│   ├── Services.tsx                 # Services listing
│   ├── BookingForm.tsx              # Booking submission
│   ├── Contact.tsx                  # Contact section
│   ├── Footer.tsx                   # Site footer
│   │
│   └── admin/
│       ├── AdminSidebar.tsx         # Admin nav
│       ├── DashboardOverview.tsx    # Stats
│       ├── BookingManagement.tsx    # Bookings CRUD
│       ├── BookingModal.tsx         # Edit modal
│       ├── BeforeAfterManagement.tsx # Gallery upload
│       └── AdminServices.tsx        # Services mgmt
│
├── context/
│   └── AdminAuthContext.tsx         # Auth state management
│
└── lib/
    └── supabase.ts                  # Database client
```

## Key Features

### Before & After Page
✓ **Complete Independence**: No homepage components present
✓ **Professional Gallery**: Modern 2-column responsive layout
✓ **Interactive Controls**:
  - Draggable image comparison slider
  - Touch-enabled on mobile
  - Video side-by-side playback
  - Play/pause controls
✓ **User Experience**:
  - Loading states
  - Before/After labels on media
  - Video badges for mixed content
  - Smooth transitions and hover effects
  - Back navigation button
✓ **Responsive Design**:
  - Mobile: Full-width single column
  - Tablet: Optimized layout
  - Desktop: 2-column grid

### Admin Gallery Management
✓ **File Upload**: Direct device upload (not URLs)
✓ **Media Types**:
  - Images only (JPG, PNG, WebP, GIF)
  - Videos only (MP4, WebM, MOV)
  - Mixed (both images and videos)
✓ **Management**:
  - Create projects
  - Preview uploads
  - Delete projects
  - Video badge indicators

## Routes

```
/                    → Homepage (Hero + Services + Booking + Contact)
/before-after        → Standalone Before & After Gallery Page
/admin/login         → Admin Login Portal
/admin               → Admin Dashboard (requires auth)
```

## Database Integration

### Before & After Projects Table
```sql
before_after_projects {
  id: UUID (primary key)
  title: TEXT (required)
  description: TEXT (optional)
  before_image_url: TEXT (optional)
  after_image_url: TEXT (optional)
  before_video_url: TEXT (optional)
  after_video_url: TEXT (optional)
  media_type: TEXT ('image' | 'video' | 'both')
  created_at: TIMESTAMP
}
```

### Data Flow
1. **Public**: Gallery fetches projects from database
2. **Admin**: Upload files to Supabase Storage
3. **Admin**: Create project records with URLs
4. **Public**: Displays updated gallery automatically

## Security

✓ **Admin Panel**: Hidden from public, URL-only access
✓ **Database**: Row Level Security (RLS) enabled
✓ **Authentication**: Secure Supabase Auth
✓ **Gallery**: Public read-only access
✓ **Admin Content**: Admin-only edit/delete permissions

## Styling

### Theme
- **Colors**: Green (#16a34a) + Yellow (#eab308) with neutral grays
- **Layout**: Rounded cards, soft shadows, modern design
- **Typography**: Professional, readable at all sizes
- **Spacing**: Consistent 8px-based grid system
- **Responsiveness**: Mobile-first design approach

### Gallery Features
- Smooth transitions (150-300ms)
- Hover effects with scale transforms
- Loading spinners for async content
- Status badges and icons
- Professional card layouts

## Performance

✓ **Code Splitting**: Each page loads independently
✓ **Image Optimization**: Browser-native lazy loading
✓ **Video Streaming**: Progressive loading from Supabase Storage
✓ **State Management**: Minimal, component-level state
✓ **Build Size**: Optimized Vite build (30.06kb CSS, 376kb JS gzipped)

## User Flows

### Visitor Journey
1. Land on Homepage
2. View Services
3. Submit Booking OR
4. Navigate to Before & After Gallery
5. View project transformations
6. Return to homepage or contact

### Admin Journey
1. Access `/admin/login`
2. Authenticate
3. Upload project images/videos
4. Create project entry
5. Manage bookings
6. View analytics dashboard

## Navigation Updates

### Homepage Header
The header now includes a "Before & After" link that navigates to the dedicated page:
- Desktop: Navigation bar item with other links
- Mobile: Hamburger menu item

### Standalone Page Integration
The Before & After page includes:
- Full site header and footer
- Back button for easy navigation
- Independent routing (not dependent on homepage)
- Complete self-contained experience
