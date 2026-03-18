# Aviad Lavian Dashboard - Medical Education Platform

A professional, high-performance medical education dashboard built with Next.js 16 and React 19. This platform provides advanced tools for managing medical knowledge, including a dynamic library, interactive flashcards with difficulty tracking, and a robust question bank system.

---

## 🚀 1. Project Overview

This project is a comprehensive administrative and educational dashboard designed to manage medical articles, topics, and study materials. It enables educators and students to organize medical knowledge through:

- **Article Management**: Full CRUD operations for medical articles with rich text editing.
- **Knowledge Library**: A dynamic repository for browsing medical topics with multi-layered filtering.
- **Flashcard System**: An interactive learning tool with difficulty-based categorization and dynamic discovery of body regions and specialities.
- **Question Bank**: A centralized database of medical questions linked to specific topics and articles.
- **Analytical Repository**: A sophisticated filtering system that automatically analyzes datasets to provide intelligent search categories.

---

## 🛠 2. Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) & [Zod](https://zod.dev/) (Validation)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Editor**: [Tiptap](https://tiptap.dev/)

---

## 📂 3. Project Structure

The project follows a **Feature-Based Modular Architecture**, which ensures scalability and high maintainability.

```text
/src
├── app/                  # Next.js App Router (Pages, Layouts, Routing)
├── components/           # UI Components
│   ├── ui/               # Primitive shadcn/ui components
│   └── shared/           # Reusable business-level components (Header, Sidebar)
├── features/             # Business Logic & Feature-specific Modules
│   ├── articales/        # Article management logic (CRUD, Table view)
│   ├── flashcards/       # Interactive learning tools and progress tracking
│   ├── library/          # Topic repository and deep-filtering system
│   ├── auth/             # Authentication flows
│   └── questions/        # Question bank and examination logic
├── hooks/                # Global custom React hooks
├── lib/                  # Shared utilities (API Axios instance, helper functions)
├── store/                # Zustand global state stores
├── types/                # Global TypeScript declarations
└── globals.css           # Global styles and design system variables
```

---

## 📄 4. Page-by-Page Explanation

### **Dashboard Overview**

- **Purpose**: High-level metrics and statistics.
- **Data**: Connects to multiple analytical endpoints to show recent activity and progress.

### **Article Inventory**

- **Purpose**: Manage the core library data.
- **Features**: Search, Table-based management, and Modals for Add/Edit/View.
- **UI Design**: Inspired by the Flashcard module, offering a clean, professional table view.

### **Knowledge Library**

- **Purpose**: Student-facing or research-facing topic explorer.
- **Connects to**: `/article/get-all` through the `useLibrary` hook.
- **Interactions**: Dynamic filtering by Body Area, Speciality, and Acuity.

### **Flashcards Manager**

- **Purpose**: Interactive study cards.
- **Features**: Difficulty filters (Easy, Medium, Hard), Category filters (Acuity, Age Group).
- **Data Flow**: Fetches flashcards with progress metadata; allows instant filtering of categories extracted from the current dataset.

---

## 🔄 5. Component & Function Flow

We use a **Hook-to-UI** pattern for data movement:

1.  **API Layer** (`src/features/[feature]/api`): Defines raw `axios` calls using a centralized `api` instance from `lib/api`.
2.  **Hook Layer** (`src/features/[feature]/hooks`): Wraps API calls in TanStack Query (`useQuery`, `useMutation`) for caching and lifecycle management.
3.  **UI Content** (`src/features/[feature]/component`):
    - Consume hooks to get `data`, `isLoading`, and `error`.
    - Handle local UI state (filtering selecting, search strings) using `useState`.
    - **Optimization**: Uses `useMemo` to perform expensive filtering tasks or data transformations without unnecessary re-renders.

**Example Flow: Filtering Articles**

- User types in Search → `setSearch` updates state → `useDebounce` waits 500ms → `useArticles` hook triggers a new API request with `params`.
- Server returns data → Component's `dynamicFilters` logic scans the `topicIds` → Dropdowns automatically populate with new unique options found in the results.

---

## ✨ 6. Feature Breakdown

### **Dynamic Discovery Filters**

Unlike traditional hardcoded filters, this project implements **Auto-Discovery Logic**. The system "scans" the incoming data to find all unique Specialities and Body Regions.

- **Multi-select support**: Filter by multiple regions simultaneously.
- **Normalization**: Automatically handles combined values like `"Shoulder/Arm"` or `"Knee, Ankle"` by splitting them into individual tags.

### **Flashcard Logic**

- Cards are categorized into 3 difficulty levels.
- System allows filtering by `Topic`, `Acuity`, and `Age Group`.
- Features a "Study Mode" where progress is tracked against the user profile.

---

## 🔌 7. API Integration

API logic is centralized in the `lib/api.ts` file, featuring:

- **Axios Instance**: Configured with baseURL and timeout.
- **Interceptors**: Handles auth tokens and global error responses.
- **Type Safety**: Every API call uses defined TypeScript interfaces for Request and Response objects.

---

## 💾 8. State Management

- **Server State**: Managed by **TanStack Query**. It handles all caching, loading states, and background synchronization.
- **Local State**: Managed by **React Hooks** (`useState`, `useReducer`) for things like modal toggles and filter selections.
- **Global Settings**: Handled via **Zustand** stores in `/src/store` for cross-feature needs like user preferences or sidebar collapse state.

---

## 🚀 9. How to Run the Project

### **Prerequisites**

- Node.js (v18 or higher recommended)
- npm or yarn

### **Installation**

1. Clone the repository.

```bash
npm install
```

### **Environment Setup**

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_BASE_URL=https://your-api-url.com
NEXTAUTH_SECRET=your_secret_here
```

### **Commands**

- **Development**: `npm run dev` (Runs on `http://localhost:3000`)
- **Build**: `npm run build`
- **Start Production**: `npm run start`
- **Linting**: `npm run lint`

---

## 🏆 10. Best Practices

- **Atomic Components**: Button, Input, and Modal primitives are decoupled from business logic.
- **Type-First Development**: Strong interfaces for all data objects to catch errors during development.
- **Performance**: Heavy use of `useMemo` and `useCallback` for stable reference and efficient filtering.
- **Aesthetic Excellence**: Unified design tokens for Teal/Slate themes, consistent border radii (`rounded-2xl`), and smooth glassmorphism effects.
