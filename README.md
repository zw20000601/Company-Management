# TaskFlow - Company Task Management System

A full-featured company task management and progress tracking platform built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**. Designed for teams to assign tasks, track progress, manage projects, and visualize performance analytics.

## Features

### Landing Page
- Hero section with CTA buttons
- Feature showcase (Task Management, Team Collaboration, Analytics)
- Pricing plans (Free / Professional / Enterprise)
- FAQ accordion
- Trusted-by brand section

### Dashboard
- KPI stats cards (Active Projects, Utilization Rate, Avg Time, At Risk)
- Task status distribution with progress bars
- Task priority pie chart
- Monthly activity area chart (Created vs Completed)
- Team activity heatmap
- Team workload table with status indicators
- Quick action bar (New Task, New Project, Invite Member)
- Interactive card menus (View Details, Export, Refresh)

### Task Management
- **List View**: Sortable table with inline status change
- **Kanban Board**: Drag-style columns (To Do, In Progress, Overdue, Completed)
- Create/assign tasks with priority, due date, tags, and project
- Task detail modal with progress bar and quick status buttons
- Filter by status tabs and priority dropdown
- Full-text search across tasks, assignees, and projects

### Projects
- Project cards with progress bars, member avatars, and status badges
- Filter by status (Active, At Risk, On Hold, Completed)
- Project detail modal with task list and member breakdown

### Analytics
- KPI overview (Completion Rate, On-Time Delivery, Utilization, etc.)
- Monthly area chart & weekly line chart
- Tasks by status/priority donut charts
- Project progress bars
- Team performance bar chart

### Team Members
- Member cards with completion rate, active/overdue counts
- Department filter tabs
- Detailed table with workload indicators
- Member detail modal with assigned task list

### Calendar
- Interactive monthly calendar
- Task due-date dots on calendar cells
- Day-click detail panel
- Upcoming deadlines sidebar

### Other Pages
- **Reports**: Export-ready charts and full task report table
- **Messages**: Chat UI with conversation sidebar
- **Settings**: Profile form, notification toggles
- **Help & Support**: Categorized help articles, FAQ

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 16](https://nextjs.org/) | React framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Recharts](https://recharts.org/) | Charts and data visualization |
| [Lucide React](https://lucide.dev/) | Icon library |

## Getting Started

### Prerequisites

- **Node.js** >= 18.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0 (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/zw20000601/Company-Management.git
cd Company-Management

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open **http://localhost:3000** in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── dashboard/page.tsx    # Main dashboard
│   ├── tasks/page.tsx        # Task management (List + Kanban)
│   ├── projects/page.tsx     # Project overview
│   ├── analytics/page.tsx    # Analytics & charts
│   ├── calendar/page.tsx     # Calendar view
│   ├── team/page.tsx         # Team members
│   ├── reports/page.tsx      # Reports & exports
│   ├── messages/page.tsx     # Team messaging
│   ├── settings/page.tsx     # User settings
│   └── help/page.tsx         # Help & support
├── components/
│   ├── DashboardLayout.tsx   # Shared dashboard layout
│   ├── Sidebar.tsx           # Navigation sidebar
│   └── TopBar.tsx            # Top bar with search & notifications
└── lib/
    └── data.ts               # Mock data & type definitions
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

See [.env.example](.env.example) for available variables.

## Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Deploy automatically

### Docker

```bash
docker build -t taskflow .
docker run -p 3000:3000 taskflow
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational and demonstration purposes.
