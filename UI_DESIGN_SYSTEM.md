# 🎨 Babua LMS - UI Design System

## Design Philosophy

**Developer-First, Practical, Clean**
- Minimal, functional design
- Clear visual hierarchy
- Easy to scan and navigate
- No unnecessary animations or distractions
- Clear separation between free and paid content

## Color System

### Primary Colors
- **Primary Blue**: `#0284c7` (primary-600) - Main actions, links
- **Accent Orange**: `#f59e0b` (accent-400) - Highlights, streaks

### Status Colors
- **Free Content**: Green (`#10b981`) - Badges, borders for free content
- **Paid Features**: Amber (`#f59e0b`) - Badges, borders for optional paid
- **Success**: Green - Completed lessons, success states
- **Warning**: Yellow - Medium priority revisions
- **Error**: Red - High priority, errors

### Neutral Colors
- **Gray Scale**: Clean grays for text, borders, backgrounds
- **Code Blocks**: Dark theme (`#1e293b`) for code examples

## Typography

### Fonts
- **Body**: Inter (clean, readable sans-serif)
- **Code**: JetBrains Mono / Fira Code (monospace)

### Hierarchy
- **H1**: 3xl-4xl, bold, gray-900
- **H2**: 2xl-3xl, semibold, gray-900
- **H3**: xl-lg, semibold, gray-900
- **Body**: base, regular, gray-600/700
- **Small**: sm-xs, regular, gray-500/600

## Component Library

### Cards
```tsx
// Free content card
<div className="card-free"> // Green left border
  // Content
</div>

// Paid feature card
<div className="card-paid"> // Amber left border
  // Content
</div>

// Regular card
<div className="card"> // White, border, shadow
  // Content
</div>
```

### Buttons
```tsx
// Primary action
<button className="btn-primary">Action</button>

// Secondary action
<button className="btn-secondary">Action</button>

// Ghost/Text button
<button className="btn-ghost">Action</button>
```

### Badges
```tsx
// Free content badge
<span className="badge-free">FREE</span>

// Paid feature badge
<span className="badge-paid">Optional Paid</span>

// Category badge
<span className="badge-category">DSA</span>
```

### Progress
```tsx
<div className="progress-bar">
  <div className="progress-fill" style={{ width: '60%' }}></div>
</div>
```

## Layout Patterns

### Container
```tsx
<div className="container-main">
  // Max-width: 7xl, centered, responsive padding
</div>
```

### Section Spacing
```tsx
<section className="section-padding">
  // py-12 md:py-16 lg:py-20
</section>
```

## Page Designs

### 1. Landing Page
- **Hero**: Clean, centered, clear CTA
- **Features**: 3-column grid, icon + text
- **Courses**: Grid with category badges
- **Paid Features**: Clearly separated with amber badges

### 2. Auth Pages (Login/Signup)
- **Centered card** design
- **Minimal form** fields
- **Clear CTAs**
- **Free badge** on signup

### 3. Dashboard
- **Streak card**: Prominent but not overwhelming
- **Two-column layout**: Courses + Revision
- **Quick actions**: 3-column grid
- **Progress indicators**: Clean progress bars

### 4. Courses List
- **Category filters**: Horizontal pills
- **Course cards**: Grid layout, free badge prominent
- **Clean metadata**: Category, enrolled count

### 5. Course Detail
- **Header**: Course info, progress, enroll button
- **Modules**: Accordion-style, numbered
- **Lessons**: List with completion status
- **Clear hierarchy**: Module → Lesson

### 6. Lesson View
- **Breadcrumb**: Back to course
- **Content area**: Clean, readable
- **Practice problems**: Code-style blocks
- **Actions**: Mark complete, add to revision

### 7. Community Q&A
- **Thread cards**: Clean, scannable
- **Metadata**: Author, date, replies, upvotes
- **Form**: Simple, focused

### 8. Mentor Page
- **Clear separation**: Free content vs paid services
- **Booking form**: Clean, functional
- **Mentor cards**: Simple, informative

## Visual Separation

### Free Content
- ✅ Green left border on cards
- ✅ Green "FREE" badges
- ✅ No payment mentions
- ✅ Prominent placement

### Paid Features
- ⚠️ Amber left border on cards
- ⚠️ Amber "Optional Paid" badges
- ⚠️ Clear labeling
- ⚠️ Secondary placement

## Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md)
- **Desktop**: > 1024px (lg)

## Spacing System

- **xs**: 0.5rem (2px)
- **sm**: 0.75rem (3px)
- **base**: 1rem (4px)
- **lg**: 1.5rem (6px)
- **xl**: 2rem (8px)

## Best Practices

1. **Consistency**: Use design system components
2. **Clarity**: Clear labels, no ambiguity
3. **Hierarchy**: Important info stands out
4. **Accessibility**: Good contrast, readable fonts
5. **Performance**: Minimal animations, fast loading

## Implementation Notes

- All components use Tailwind CSS
- Custom classes in `index.css` for reusability
- TypeScript for type safety
- Responsive by default
- Mobile-first approach

---

**Status**: ✅ Design system implemented and ready to use!

