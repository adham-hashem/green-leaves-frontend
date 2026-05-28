# Cambridge Green Leaves - Admin Dashboard Guide

## Access Information

### Admin Login Portal
- **URL**: `/admin/login` (or direct link to private admin panel)
- **Email**: `admin@cambridgegreenleaves.com`
- **Password**: `GreenLeaves@2025`

**Note**: The admin panel is completely hidden from the public website. No navbar links or public references exist.

## Dashboard Features

### 1. Dashboard Overview
Access key metrics at a glance:
- Total Bookings count
- Pending Jobs awaiting action
- Completed Jobs
- Contacted Customers
- Quick stats including completion rate and response rate
- Recent activity feed

### 2. Booking Management
Comprehensive booking management system:
- **View All Bookings**: Browse all customer bookings in a data table
- **Filter by Status**: Filter bookings as Pending, Contacted, or Completed
- **Edit Bookings**: Click the edit icon to view and update booking details
- **Delete Bookings**: Remove bookings with confirmation dialog
- **Change Status**: Update booking status via dropdown on each row

Booking details include:
- Customer name, email, phone number
- Service type and budget
- Property address
- Uploaded images
- Status tracking
- Date received

### 3. Before & After Gallery Management
Manage project showcase content:

#### Upload Options
- **Image-Only Projects**: Upload before/after images (JPG, PNG, etc.)
- **Video-Only Projects**: Upload before/after videos (MP4, WebM, etc.)
- **Mixed Projects**: Support both images and videos

#### Upload Process
1. Click "Add Project" button
2. Enter project title and description
3. Select media type (Images, Videos, or Both)
4. Upload files directly from your device
   - Files are securely stored in cloud storage
   - URLs are automatically generated
5. Create project

#### Project Management
- View all projects in gallery format
- Hover effect shows before/after comparison
- Video projects display with blue "Video" badge
- Delete projects as needed

### 4. Services Management
- View all offered gardening services
- Services are managed administratively
- Contact admin team to customize service offerings

### 5. Navigation Sidebar
Easy access to all admin features:
- Dashboard
- Bookings
- Before & After
- Services
- Messages (coming soon)
- Settings (coming soon)
- Logout button

## Public Features

### Homepage
The public website includes:
- **Hero Section**: Eye-catching introduction with booking CTA
- **Services**: Display of all gardening services
- **Booking Form**: Customer booking submission
- **Gallery Preview**: Teaser with "View Full Gallery" button
- **Contact Information**: Phone number and contact details

### Dedicated Before & After Page
Located at `/before-after`:
- Full gallery of all before/after projects
- **Interactive Image Slider**: Drag or touch to compare images
- **Video Comparison**: Side-by-side video playback
- **Hover Effects**: Smooth transitions between before/after
- **Modern Layout**: Premium gallery presentation
- Fully responsive design

## Security & Best Practices

### Admin Portal Security
- ✓ Private URL access only (`/admin/login`)
- ✓ No public navbar links to admin panel
- ✓ Secure authentication required
- ✓ Session-based access control
- ✓ Auto-logout on session expiry

### File Uploads
- All files uploaded to secure cloud storage
- Automatic URL generation for uploaded media
- Support for:
  - Image formats: JPG, PNG, WebP, GIF
  - Video formats: MP4, WebM, MOV

### Database Security
- Row Level Security (RLS) enabled on all tables
- Admin-only edit permissions for gallery content
- Public read access for gallery projects
- Secure booking data handling

## File Structure

```
src/
├── pages/
│   ├── BeforeAfterPage.tsx       # Public gallery page
│   ├── AdminLogin.tsx             # Admin login form
│   └── AdminDashboard.tsx         # Main admin dashboard
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx      # Navigation sidebar
│   │   ├── DashboardOverview.tsx # Stats & overview
│   │   ├── BookingManagement.tsx # Booking CRUD
│   │   ├── BookingModal.tsx      # Edit booking modal
│   │   ├── BeforeAfterManagement.tsx # Gallery upload
│   │   └── AdminServices.tsx     # Services display
│   ├── BeforeAfter.tsx            # Homepage preview
│   └── Header.tsx                 # Public navbar (no admin link)
├── context/
│   └── AdminAuthContext.tsx       # Auth state management
└── lib/
    └── supabase.ts               # Supabase client
```

## Troubleshooting

### Can't Login
- Verify email and password are correct
- Check caps lock and spacing
- Ensure account is created in Supabase Auth
- Try creating a new account if demo account has issues

### File Upload Fails
- Check file size (keep reasonable)
- Verify file format is supported
- Ensure internet connection is stable
- Check browser console for error details

### Gallery Not Loading
- Verify you've created at least one project
- Check uploaded file URLs are accessible
- Ensure database connection is active

## Advanced Features

### Responsive Design
- Desktop optimized dashboard
- Mobile-friendly sidebar (hamburger menu)
- Touch-compatible image slider
- Responsive booking table with horizontal scroll

### Data Persistence
- All bookings saved to database
- Gallery projects stored with media URLs
- Automatic timestamps on creation
- Status tracking with change history

## Need Help?
- Check browser console for error messages
- Verify Supabase connection and credentials
- Ensure all environment variables are set
- Contact development team for additional admin accounts
