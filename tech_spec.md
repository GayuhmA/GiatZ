# Technical Specification: GiatZ

## 1. Overview

GiatZ adalah platform produktivitas gamifikasi bergaya *Flat 2.0* yang ditujukan untuk mahasiswa. Aplikasi ini menggabungkan manajemen tugas, pengatur waktu fokus, dan sistem pencatatan cerdas ke dalam satu ekosistem interaktif yang terasa seperti permainan.

## 2. Proposed Tech Stack

Mengingat arsitektur berbasis komponen dan kebutuhan interaksi UI yang kompleks, *stack* berikut direkomendasikan:

* **Framework:** Next.js **v16** (App Router) dengan React. Sangat cocok untuk menangani *routing* kompleks antar modul (Catatan, Matrix, Orbit) dan optimal untuk performa *frontend*. Menggunakan *file-system based routing* dengan konvensi `page.tsx` untuk halaman dan `layout.tsx` untuk *shared UI wrapper* yang membungkus `children` prop. Root layout **wajib** menyertakan tag `<html>` dan `<body>`.
* **Styling:** Tailwind CSS **v4**. Konfigurasi kini ***CSS-first*** (bukan lagi `tailwind.config.js`). Warna menggunakan format **OKLCH** dan *CSS custom properties* (contoh: `var(--color-green-500)`). Utilitas `border-radius` kini tersedia dari `rounded-xs` (2px) hingga `rounded-4xl` (32px). *Box-shadow* dan kustomisasi lainnya dilakukan via *CSS custom properties* dan `@theme` di file CSS.
* **Animation & Interactions:** Motion / Framer Motion **v11+** (untuk animasi transisi/orbit) dan `@dnd-kit/react` **v0.1+** (untuk interaksi *drag-and-drop* yang ringan dan *accessible*).
  * **Catatan penting `@dnd-kit`:** Versi terbaru menggunakan API baru dengan `DragDropProvider` (menggantikan `DndContext`), dan *hooks* `useDraggable` / `useDroppable` yang mengembalikan objek `{ ref }` untuk di-*attach* ke elemen DOM.
* **Icons:** Heroicons (paket `@heroicons/react`).
* **Graph Visualization:** React Flow — kini diinstal via paket `@xyflow/react`. Import dilakukan dari `'@xyflow/react'` dan stylesheet dari `'@xyflow/react/dist/style.css'`.
* **Charting:** Recharts **v3.3+** — untuk `RadarChart` dan visualisasi data lainnya.

## 3. Visual Style Guide (Berdasarkan Design Mockup)

Style guide ini diekstrak langsung dari mockup design visual aplikasi (Dashboard, Task Matrix, Mind-Glance, Focus Orbit) sebagai *single source of truth* untuk implementasi UI.

---

### 3.1 Color System

#### Primary Palette

| Token | Hex | Penggunaan |
|---|---|---|
| `--color-primary` | `#FF9600` | Tombol utama, CTA, aksen, ikon aktif, progress bar |
| `--color-primary-dark` | `#E68600` | Hover state tombol utama, border-bottom 3D |
| `--color-secondary` | `#1CB0F6` | Banner info, badge jadwal, link, tombol sekunder (View Leaderboard) |
| `--color-secondary-dark` | `#1899D6` | Hover state tombol sekunder |
| `--color-success` | `#58CC02` | Status selesai, progress penuh, growth indicators, streak |
| `--color-success-dark` | `#4CAD02` | Hover state success |
| `--color-danger` | `#FF4B4B` | Badge urgent, deadline, ikon peringatan |
| `--color-warning` | `#FFC800` | Kuadran Eliminate, daily goal accent |

#### Neutral Palette

| Token | Hex | Penggunaan |
|---|---|---|
| `--color-bg-page` | `#F7F7F7` | Background halaman utama (off-white) |
| `--color-bg-card` | `#FFFFFF` | Background semua kartu/panel |
| `--color-bg-sidebar` | `#FFFFFF` | Background sidebar |
| `--color-border` | `#E5E5E5` | Border kartu, divider halus |
| `--color-text-primary` | `#3C3C3C` | Teks heading, judul kartu |
| `--color-text-secondary` | `#AFAFAF` | Subteks, placeholder, caption |
| `--color-text-label` | `#777777` | Label all-caps (URGENCY, IMPORTANCE) |

#### Quadrant Tints (Task Matrix)

| Kuadran | Nama | Background Tint | Label Color |
|---|---|---|---|
| DO FIRST | Urgent + Important | `#FFE5E5` (pink/merah muda) | `#FF4B4B` (merah) |
| SCHEDULE | Not Urgent + Important | `#E5F9E5` (hijau muda) | `#58CC02` (hijau) |
| MINIMIZE | Urgent + Not Important | `#E5F0FF` (biru muda) | `#1CB0F6` (biru) |
| ELIMINATE | Not Urgent + Not Important | `#FFF8E0` (kuning muda) | `#FFC800` (kuning/oranye) |

#### Tailwind v4 `@theme` Configuration

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Primary */
  --color-primary: #FF9600;
  --color-primary-dark: #E68600;
  --color-primary-light: #FFF3E0;

  /* Secondary (Info/Blue) */
  --color-secondary: #1CB0F6;
  --color-secondary-dark: #1899D6;
  --color-secondary-light: #DDF4FF;

  /* Semantic */
  --color-success: #58CC02;
  --color-success-dark: #4CAD02;
  --color-success-light: #E5F9E5;
  --color-danger: #FF4B4B;
  --color-danger-light: #FFE5E5;
  --color-warning: #FFC800;
  --color-warning-light: #FFF8E0;

  /* Neutrals */
  --color-bg-page: #F7F7F7;
  --color-bg-card: #FFFFFF;
  --color-border: #E5E5E5;
  --color-text-primary: #3C3C3C;
  --color-text-secondary: #AFAFAF;
  --color-text-label: #777777;

  /* Quadrant Tints */
  --color-quadrant-do: #FFE5E5;
  --color-quadrant-schedule: #E5F9E5;
  --color-quadrant-minimize: #E5F0FF;
  --color-quadrant-eliminate: #FFF8E0;

  /* Shadows */
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-card-hover: 0 4px 16px rgba(0, 0, 0, 0.1);
  --shadow-button-3d: 0 4px 0 var(--color-primary-dark);

  /* Radius */
  --radius-card: 1rem;       /* 16px — rounded-2xl */
  --radius-card-lg: 1.5rem;  /* 24px — rounded-3xl */
  --radius-pill: 9999px;     /* rounded-full */
  --radius-button: 9999px;   /* rounded-full */

  /* Font Families */
  --font-heading: 'Nunito', 'Quicksand', 'Fredoka', sans-serif;
  --font-body: 'Nunito', 'Quicksand', sans-serif;
}
```

---

### 3.2 Typography

Berdasarkan mockup, tipografi menggunakan **rounded sans-serif** dengan variasi berat yang konsisten:

| Elemen | Font | Weight | Size (approx.) | Style |
|---|---|---|---|---|
| Page Title | Nunito/Quicksand | **800 (ExtraBold)** | `text-2xl` (24px) | Normal case, `--color-text-primary` |
| Section Subtitle | Nunito/Quicksand | **400 (Regular)** | `text-sm` (14px) | Normal case, `--color-text-secondary` |
| Card Title | Nunito/Quicksand | **700 (Bold)** | `text-base` (16px) | Normal case, `--color-text-primary` |
| Card Subtitle/Desc | Nunito/Quicksand | **400** | `text-sm` (14px) | Normal case, `--color-text-secondary` |
| Sidebar Nav Item | Nunito/Quicksand | **700 (Bold)** | `text-sm` (14px) | **ALL CAPS** `uppercase tracking-wide` |
| Quadrant Label | Nunito/Quicksand | **800** | `text-xs` (12px) | **ALL CAPS** `uppercase tracking-widest`, warna sesuai kuadran |
| Badge/Tag Text | Nunito/Quicksand | **700** | `text-xs` (12px) | **ALL CAPS** `uppercase tracking-wide` |
| Button Text | Nunito/Quicksand | **700** | `text-sm` (14px) | **ALL CAPS** `uppercase tracking-wide`, warna putih |
| Timer Display | Nunito/Quicksand | **800** | `text-5xl` (48px+) | Putih, di atas lingkaran oranye |
| XP/Stat Number | Nunito/Quicksand | **800** | `text-xl` – `text-3xl` | Warna primer atau hijau |

**Font Loading (Next.js):**
```tsx
import { Nunito } from 'next/font/google';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
});
```

---

### 3.3 Layout System

Aplikasi menggunakan **layout 3 kolom** yang konsisten di semua halaman:

```
┌──────────┬──────────────────────────┬───────────────┐
│          │                          │               │
│ SIDEBAR  │      MAIN CONTENT        │  RIGHT PANEL  │
│  (Fixed) │      (Scrollable)        │   (Sticky)    │
│  ~200px  │       ~flexible          │    ~280px     │
│          │                          │               │
└──────────┴──────────────────────────┴───────────────┘
```

* **Sidebar (Kolom 1):** Tetap di kiri, lebar ~200px, background putih, berisi logo + navigasi + tombol "GO PREMIUM" di bawah.
* **Main Content (Kolom 2):** Area utama fleksibel, background `--color-bg-page`, mengandung konten halaman utama.
* **Right Panel (Kolom 3):** Sidebar kanan sticky, lebar ~280px, berisi widget pelengkap (Achievements, Sound Mixer, Knowledge Base, Streak Stats). **Tidak semua halaman memiliki panel kanan** — tergantung konteks fitur.

**Implementasi CSS Grid:**
```css
.app-layout {
  display: grid;
  grid-template-columns: 200px 1fr 280px;
  min-height: 100vh;
}

/* Halaman tanpa right panel */
.app-layout--two-col {
  grid-template-columns: 200px 1fr;
}
```

---

### 3.4 Sidebar Navigation

Pola sidebar konsisten di semua halaman mockup:

* **Logo Area:** Ikon oranye bulat + teks "SCHOLAR" bold + subtitle halaman (contoh: *"Mind-Glance"*, *"FOCUS MODE"*) di bawahnya.
* **Active Item:** Background oranye solid `bg-primary` dengan teks putih, bentuk *pill* (`rounded-full`), padding horizontal penuh.
* **Inactive Item:** Tanpa background, teks `--color-text-primary` atau abu-abu, dengan ikon di sebelah kiri.
* **Bottom CTA:** Tombol "GO PREMIUM" oranye `rounded-full` dengan ikon mahkota/piala, *fixed* di bagian bawah sidebar.
* **Nav Items** menggunakan **ALL CAPS** (`uppercase`) dengan `tracking-wide`.

```jsx
// Contoh Sidebar Nav Item
<NavLink
  href="/dashboard"
  className={({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-colors
     ${isActive
       ? 'bg-primary text-white'
       : 'text-text-primary hover:bg-gray-100'
     }`
  }
>
  <HomeIcon className="w-5 h-5" />
  Dashboard
</NavLink>
```

---

### 3.5 Card Components

Semua konten dibungkus dalam kartu (*cards*) dengan pola konsisten:

#### Card Hierarchy

| Tipe Kartu | Border Radius | Shadow | Background | Contoh |
|---|---|---|---|---|
| **Container Card** | `rounded-3xl` (24px) | `shadow-card` | `bg-bg-card` | Panel Quest, Timer Area, Graph Canvas |
| **Content Card** | `rounded-2xl` (16px) | `shadow-card` atau none | `bg-bg-card` | Task card, Note card, Quest item |
| **Tinted Card** | `rounded-2xl` (16px) | none | Warna tint kuadran | Completed quest (hijau muda), Daily Goal (oranye muda) |
| **Feature Banner** | `rounded-3xl` (24px) | `shadow-card` | Gradient / `bg-secondary` | Welcome banner biru dengan ilustrasi |
| **Widget Card** | `rounded-2xl` (16px) | `shadow-card` | `bg-bg-card` | Achievements, Streak, Sound Mixer |

#### Pola Umum Kartu:
```css
.card {
  background: var(--color-bg-card);
  border-radius: var(--radius-card-lg); /* 24px */
  box-shadow: var(--shadow-card);
  padding: 1.25rem; /* 20px */
}

.card--content {
  border-radius: var(--radius-card); /* 16px */
  padding: 1rem; /* 16px */
}

.card--tinted-success {
  background: var(--color-success-light);
}

.card--tinted-warning {
  background: var(--color-warning-light);
}
```

#### Task Card (di Matrix)
* Background putih, `rounded-2xl`, shadow halus.
* Judul task: `font-bold text-base`.
* Badge status di bawah judul (contoh: "🔴 DUE IN 2H", "📅 TOMORROW, 09:00").
* Saat sedang di-drag: **Border oranye solid** `border-2 border-primary`, dengan shadow lebih besar.
* Drop zone kosong: **Border dashed oranye** `border-2 border-dashed border-primary`, teks "DROP HERE" berwarna oranye di tengah.

#### Note Card (di Knowledge Base)
* Layout horizontal: Thumbnail kecil (bulat) di kiri + info di kanan.
* Judul catatan: `font-bold text-base`.
* Deskripsi: `text-sm text-text-secondary`, dipotong 1-2 baris.
* Badge kategori: Pill kecil berwarna (contoh: "MATHEMATICS" oranye, "COMPUTER SCIENCE" hijau, "LANGUAGES" merah).
* Info koneksi: "✦ 12 Connections" di bawah, warna abu-abu.

---

### 3.6 Button Taxonomy

Berdasarkan mockup, terdapat 4 tipe tombol utama:

#### 1. Primary Button (CTA)
* **Contoh:** "ADD NEW QUEST", "RESUME LESSON", "CREATE NEW NOTE", "PAUSE SESSION"
* Background: `bg-primary` (`#FF9600`)
* Text: Putih, **ALL CAPS**, `font-bold tracking-wide`
* Shape: `rounded-full` (pill)
* 3D Effect: `border-b-4 border-primary-dark` untuk ilusi *chunky 3D*
* Hover: Translate-y sedikit ke bawah, shadow berkurang (efek "ditekan")

```css
.btn-primary {
  background: var(--color-primary);
  color: white;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.625rem 1.5rem;
  border-radius: var(--radius-pill);
  border-bottom: 4px solid var(--color-primary-dark);
  transition: all 0.15s ease;
}

.btn-primary:hover {
  transform: translateY(2px);
  border-bottom-width: 2px;
}

.btn-primary:active {
  transform: translateY(4px);
  border-bottom-width: 0;
}
```

#### 2. Secondary Button
* **Contoh:** "VIEW LEADERBOARD", "DAILY CHALLENGE", "EARN 20 MORE XP"
* Background: `bg-secondary` (`#1CB0F6`) atau `bg-primary`
* Text: Putih, ALL CAPS
* Shape: `rounded-full`
* Juga memiliki `border-b-4` 3D effect

#### 3. Ghost/Outline Button
* **Contoh:** "SKIP", "VIEW ALL"
* Background: Transparan atau `bg-gray-100`
* Text: `text-text-secondary` atau `text-primary`
* Border: `border-2 border-border` atau tanpa border
* Shape: `rounded-full`

#### 4. Text Link Button
* **Contoh:** "View All Notes", "VIEW ALL" (di Achievements)
* Tanpa background, tanpa border
* Text: `text-secondary` (`#1CB0F6`) atau `text-primary`, `font-bold uppercase`
* Hover: Underline atau opacity decrease

---

### 3.7 Badge & Tag System

Badges digunakan untuk status, kategori, dan reward:

| Tipe Badge | Shape | Contoh | Style |
|---|---|---|---|
| **Status Badge** | Pill kecil | "DUE IN 2H", "TOMORROW, 09:00" | `rounded-full px-2 py-0.5 text-xs font-bold uppercase` + ikon kecil di kiri |
| **Category Badge** | Pill kecil | "MATHEMATICS", "COMPUTER SCIENCE" | Warna background sesuai kategori, text putih atau warna gelap |
| **Reward Badge** | Pill | "50 XP", "25 XP" | `text-primary font-bold` dengan ikon mahkota/piala |
| **Completion Badge** | Pill | "DONE" | `text-success font-bold uppercase` |
| **Streak Badge** | Pill medium | "7 DAY STREAK" | `bg-success text-white rounded-full` dengan ikon api |
| **Counter Badge** | Rounded | "3 Left" | `bg-gray-100 text-text-primary rounded-full px-2 py-0.5 text-xs font-bold` |

**Ikon di dalam Badge:** Badge status sering memiliki ikon kecil (⏰, 📅, ✉️, 🏷️) di sebelah kiri teks.

---

### 3.8 Graph Node Styles (Mind-Glance)

Untuk komponen React Flow pada halaman Interactive Graph Canvas:

| Tipe Node | Shape | Style |
|---|---|---|
| **Active/Highlighted Node** | Pill (`rounded-full`) | `bg-primary text-white font-bold`, dengan ikon emoji/subject di kiri. Contoh: "🔢 Calculus Integrals" |
| **Default Node** | Rounded rect (`rounded-2xl`) | `bg-white border border-border text-text-primary`, shadow halus. Contoh: "▦ Linear Algebra Matrix" |
| **Inactive/Distant Node** | Pill (`rounded-full`) | `bg-white border border-border text-text-secondary`, ukuran lebih kecil |

**Edge Style:**
* Default: Garis **dashed** abu-abu (`stroke-dasharray: 5,5`), warna `#CCCCCC`.
* Active/connected: Garis **solid** oranye, warna `--color-primary`.

**Tooltip:** Bubble gelap (`bg-gray-800 text-white rounded-xl px-3 py-1.5 text-sm`) muncul di atas node saat hover. Contoh: "Click to open tasks!"

**Graph Canvas Container:**
* Background putih dengan subtle dot grid pattern (menggunakan `<Background />` dari `@xyflow/react`).
* Zoom controls: Tombol `+` / `-` di pojok kanan atas, `rounded-lg bg-white border shadow-sm`.

---

### 3.9 Orbit Timer Anatomy (Focus Mode)

Komponen timer pada halaman Focus Orbit memiliki struktur berlapis:

```
┌─────────────────────────────────────────┐
│            Orbit Area (relative)         │
│                                         │
│     ● small planet (absolute, top)      │
│                                         │
│  🚀 ─ ─ ─ ─ ╭─────────╮ ─ ─ ─ ─ ●    │
│  (orbiting)  │ 15:32   │ (orbiting)     │
│  ─ ─ ─ ─ ─  │REMAINING│  ─ ─ ─ ─      │
│              ╰─────────╯                │
│     ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ 🌲         │
│                          (orbiting)      │
│                                         │
└─────────────────────────────────────────┘
```

* **Center Circle:** Lingkaran besar `bg-primary`, ukuran ~200px, berisi teks timer (putih, `text-5xl font-extrabold`) dan label "REMAINING" (`text-xs uppercase`).
* **Orbit Path:** Lingkaran dashed oranye (`border-2 border-dashed border-primary opacity-40`), radius lebih besar dari center circle.
* **Orbiting Elements:** Ikon kecil (🚀, 🌲, ●) diposisikan absolute dan dianimasikan rotate 360° menggunakan `motion.div`.
* **Session Info:** Di bawah timer — judul sesi ("Deep Work Orbit") `text-2xl font-extrabold`, subtitle motivasi `text-sm text-text-secondary`.
* **Action Buttons:** "PAUSE SESSION" (primary oranye) dan "SKIP" (ghost abu-abu) berdampingan di bawah.

---

### 3.10 Progress Indicators

Berdasarkan mockup, terdapat beberapa varian indikator progres:

#### Linear Progress Bar
* **Contoh:** Course Progress (Calculus 72%, Spanish 94%)
* Height: ~8px, `rounded-full`
* Track: `bg-gray-100`
* Fill: `bg-primary` (oranye) atau `bg-success` (hijau) tergantung persentase
* Label persentase: `text-primary font-bold` di sebelah kanan bar

#### Sound Mixer Bar
* **Contoh:** Mix Status di Sound Mixer
* Segmented bar horizontal, height ~12px
* Setiap segmen berwarna sesuai sound source (biru = Rain, oranye = Cafe, hijau = Forest)
* `rounded-full` pada ujung-ujung

#### XP / Daily Goal Counter
* Teks angka besar (`text-xl font-extrabold`) berwarna hijau atau oranye
* Label kecil di bawah (`text-xs uppercase text-text-label`)
* Contoh: "120 EXP TODAY", "4.5h FOCUSED"

#### Streak Counter
* Ikon api/rocket + angka besar (`text-4xl font-extrabold`)
* Subtitle: "DAY STREAK!" `uppercase font-bold text-sm`
* Caption motivasi: `text-xs text-text-secondary`

---

### 3.11 Welcome Banner Component

Banner selamat datang di Dashboard:

* Background: Gradient biru (`bg-secondary` atau `bg-gradient-to-r from-[#1CB0F6] to-[#0D8ECF]`)
* Border Radius: `rounded-3xl`
* Content: Heading putih (`text-2xl font-extrabold`), subtitle putih (`text-sm opacity-80`)
* CTA: Tombol putih (`bg-white text-secondary font-bold rounded-full px-4 py-2`) — "RESUME LESSON"
* Ilustrasi: Ikon/gambar roket di sisi kanan banner
* Full-width di dalam Main Content area

---

### 3.12 Spacing & Sizing Tokens

| Token | Value | Penggunaan |
|---|---|---|
| `--spacing-page` | `24px` (`p-6`) | Padding halaman utama dari tepi area konten |
| `--spacing-section` | `24px` (`gap-6`) | Jarak antar section/widget |
| `--spacing-card-inner` | `20px` (`p-5`) | Padding dalam container card |
| `--spacing-card-content` | `16px` (`p-4`) | Padding dalam content card |
| `--spacing-items` | `12px` (`gap-3`) | Jarak antar item dalam list (quest, note) |
| `--spacing-inline` | `8px` (`gap-2`) | Jarak antar elemen inline (ikon + teks) |
| `--sidebar-width` | `200px` | Lebar sidebar |
| `--right-panel-width` | `280px` | Lebar panel kanan |
| `--icon-size-nav` | `20px` (`w-5 h-5`) | Ukuran ikon sidebar nav |
| `--icon-size-badge` | `16px` (`w-4 h-4`) | Ukuran ikon di badge |
| `--avatar-size` | `40px` (`w-10 h-10`) | Ukuran avatar di header |

---

### 3.13 Animation & Micro-Interaction Guidelines

| Interaksi | Animasi | Durasi | Easing |
|---|---|---|---|
| Kartu hover | `scale: 1.02`, `shadow: shadow-card-hover` | `200ms` | `ease-out` |
| Tombol ditekan | `translateY(2px)`, kurangi `border-bottom` | `100ms` | `ease-in` |
| Sidebar nav switch | Background fade in | `200ms` | `ease-in-out` |
| Orbit rotation | `rotate: 360°`, infinite | `= timerLength` | `linear` |
| Card drag | `scale: 1.05`, add `shadow-lg` | Real-time | - |
| Flashcard flip | `rotateY: 180°` | `600ms` | `spring(300, 30)` |
| Quest completion | Background tint hijau + `✓` fade in | `300ms` | `ease-out` |
| Pulsing (urgent) | `scale: [1, 1.03, 1]` | `1500ms` repeat | `ease-in-out` |
| Scanning line | `y: [0, 200, 0]` | `2000ms` repeat | `linear` |
| Page transition | `opacity: 0→1`, `y: 10→0` | `300ms` | `ease-out` |
| Badge appear | `scale: 0→1`, `opacity: 0→1` | `400ms` | `spring` |

---

### 3.14 Iconography

* **Source:** Heroicons (`@heroicons/react/24/outline` untuk nav, `@heroicons/react/24/solid` untuk state aktif).
* **Nav Icons:** Outline style, 20px, warna menyesuaikan state (putih saat aktif, `text-text-secondary` saat inaktif).
* **Emoji/Subject Icons:** Digunakan di dalam node graph dan kartu catatan sebagai penanda subjek (🔢, 文, ▦).
* **Sound Mixer Icons:** Ikon custom berbentuk lingkaran dengan background warna (💧 biru, ☕ oranye, 🌲 hijau), ukuran ~48px.
* **Achievement Badges:** Ikon dalam lingkaran border, 3 state (earned/berwarna, locked/abu-abu).
* **Status Icons:** Ikon kecil 16px inline dengan badge — ⏰ (deadline), 📅 (jadwal), ✉️ (delegate), 🏷️ (tag).

---

### 3.15 Responsive Considerations

* **Desktop (≥1280px):** Layout 3 kolom penuh (sidebar + main + right panel).
* **Tablet (768px–1279px):** Right panel masuk ke bawah main content atau disembunyikan di *drawer*. Sidebar bisa di-*collapse* jadi ikon saja (~60px).
* **Mobile (<768px):** Sidebar menjadi *bottom navigation bar* (fixed bottom, 5 ikon). Right panel menjadi *swipeable sheet* atau page terpisah.

---

## 4. Core Features Implementation

### Feature 1: Focus Flow (Orbit & Ambient Mixer)

* **Deskripsi:** Pomodoro timer visual dengan planet yang mengorbit dan *mixer* suara latar *drag-and-drop*.
* **Komponen Visual:** SVG Planet statis di tengah, elemen roket/satelit yang mengorbit.
* **Technical Logic:**
  * Gunakan komponen `motion.div` dari `"framer-motion"` (atau `"motion"`) dengan atribut:
    ```jsx
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: timerLength, ease: "linear", repeat: Infinity }}
    />
    ```
    Prop `repeat: Infinity` pada `transition` memastikan animasi orbit berulang terus-menerus selama timer aktif. Dapat juga memanfaatkan `MotionConfig` untuk mengatur *default transition* di seluruh komponen anak.
  * Gunakan `@dnd-kit/react` untuk ikon "Hujan/Kafe". Setup menggunakan API terbaru:
    ```jsx
    import { DragDropProvider } from '@dnd-kit/react';
    import { useDraggable } from '@dnd-kit/react';
    import { useDroppable } from '@dnd-kit/react';

    // Draggable component
    function SoundIcon({ id }) {
      const { ref } = useDraggable({ id });
      return <div ref={ref}>🌧️</div>;
    }

    // Droppable zone
    function OrbitZone({ id, children }) {
      const { ref } = useDroppable({ id });
      return <div ref={ref}>{children}</div>;
    }

    // Parent wrapper
    <DragDropProvider onDragEnd={(event) => {
      if (event.canceled) return;
      const { target } = event.operation;
      if (target?.id === 'orbit-zone') {
        // Play audio via HTML5 Audio API
      }
    }}>
      ...
    </DragDropProvider>
    ```
  * *State* mengatur volume masing-masing suara sehingga bisa dicampur (*mixed*) menggunakan HTML5 Audio API (`new Audio()`).



### Feature 2: Visual Priority Matrix (Eisenhower 2.0)

* **Deskripsi:** Kanvas interaktif 4 kuadran (*Urgent* vs *Important*).
* **Technical Logic:**
  * Buat 4 *Droppable areas* menggunakan `useDroppable` dari `@dnd-kit/react`. Setiap kuadran memiliki `id` unik (misal: `'urgent-important'`, `'urgent-not-important'`, dst.).
  * Setiap kartu tugas adalah komponen `useDraggable`. Saat `onDragEnd` dipicu di `DragDropProvider`, akses `event.operation.target?.id` untuk menentukan kuadran tujuan, lalu perbarui state array penyimpan lokasi kartu.
    ```jsx
    <DragDropProvider onDragEnd={(event) => {
      if (event.canceled) return;
      const { source, target } = event.operation;
      if (target) {
        moveTaskToQuadrant(source.id, target.id);
      }
    }}>
      {/* 4 Droppable quadrants + Draggable task cards */}
    </DragDropProvider>
    ```
  * **Frontend Magic (Pulsing Effect):** Pada kartu yang *state* lokasinya berada di kuadran "Urgent", tambahkan animasi `motion.div` pulsing:
    ```jsx
    <motion.div
      animate={{ scale: [1, 1.03, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
    ```



### Feature 3: Centralized Notebook & Mind-Glance

* **Deskripsi:** Editor teks terpusat dengan *Overview Graph* (Mind-Glance) yang menunjukkan koneksi antar materi.
* **Technical Logic:**
  * **Graphview:** Implementasi menggunakan `@xyflow/react` (React Flow versi terbaru).
    ```jsx
    import {
      ReactFlow,
      useNodesState,
      useEdgesState,
      addEdge,
      Controls,
      Background,
      MiniMap,
    } from '@xyflow/react';
    import '@xyflow/react/dist/style.css';
    ```
  * Ubah data catatan menjadi *Nodes* (judul catatan) dan *Edges* (relasi antar catatan).
  * Definisikan `CustomNode` melalui `nodeTypes` object. Tipe kustom harus didefinisikan **di luar komponen** (agar referensinya stabil) lalu diberikan ke prop `nodeTypes` pada `<ReactFlow>`:
    ```jsx
    const nodeTypes = { noteNode: CustomNoteNode };

    function MindGlance() {
      const [nodes, , onNodesChange] = useNodesState(initialNodes);
      const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
      const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)), []
      );

      return (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
      );
    }
    ```
  * Modifikasi `CustomNoteNode` agar bentuknya membulat (*pill-shaped*) dan warnanya sesuai palet desain (menggantikan *node* kotak *default* bawaan *library*).



### Feature 4: Smart Study Engine (AI-Flashcard & Quiz)

* **Deskripsi:** Modul ekstraksi catatan menjadi kartu *flashcard* dan kuis.
* **Technical Logic:**
  * *Catatan:* Untuk keperluan kompetisi *frontend statis*, gunakan data JSON statis (preset) yang menyimulasikan hasil *generate* AI. Tampilkan animasi "Scanning" menggunakan `motion.div`:
    ```jsx
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, 200, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      style={{ height: 2, background: '#58CC02' }}
    />
    ```
    Beri jeda (`setTimeout`) sebelum memunculkan *flashcard*.
  * **Flashcard Flip:** Gunakan CSS *transform* 3D (`rotateY(180deg)`) dan `backface-visibility: hidden` dikendalikan oleh *state* `isFlipped`. Bisa juga menggunakan `motion.div` untuk animasi flip yang lebih halus:
    ```jsx
    <motion.div
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformStyle: 'preserve-3d' }}
    />
    ```
  * **Radar Chart Kuis:** Gunakan Recharts **v3.3+** dengan komponen `RadarChart`. Pastikan membungkus dalam `ResponsiveContainer`:
    ```jsx
    import {
      RadarChart, PolarGrid, PolarAngleAxis,
      PolarRadiusAxis, Radar, Legend, ResponsiveContainer
    } from 'recharts';

    const quizData = [
      { subject: 'Matematika', score: 85, fullMark: 100 },
      { subject: 'Fisika', score: 70, fullMark: 100 },
      // ...
    ];

    <ResponsiveContainer width="100%" height={400}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={quizData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={90} domain={[0, 100]} />
        <Radar
          name="Skor"
          dataKey="score"
          stroke="#FF9600"
          fill="#FF9600"
          fillOpacity={0.6}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
    ```



### Feature 5: Course Mastery Heatmap

* **Deskripsi:** Pelacak progres harian bergaya GitHub *contribution graph*.
* **Technical Logic:**
  * Buat komponen Grid menggunakan CSS Grid atau flexbox kalender.
  * Buat logika *mapping* tanggal ke array tugas yang selesai.
  * Tentukan tingkat kegelapan warna berdasarkan jumlah tugas. Skala warna Tailwind CSS v4:
    * `bg-green-100` (1 tugas) — `oklch(96.2% 0.044 156.743)`
    * `bg-green-300` (2-3 tugas) — `oklch(87.1% 0.15 154.449)`
    * `bg-green-500` (4+ tugas) — `oklch(72.3% 0.219 149.579)`
  * Atau gunakan warna kustom dari palet desain via *CSS custom properties* di `@theme`.



---

## 5. Data Flow & State Management (Mockup)

Untuk purwarupa (*prototype*), gunakan **Zustand v5** untuk *state management* global. Zustand menawarkan API hook-based yang ringan tanpa boilerplate.

```typescript
import { create } from 'zustand'

// Contoh TaskStore
interface TaskState {
  tasks: Task[]
  moveTask: (taskId: string, quadrant: string) => void
  completeTask: (taskId: string) => void
}

const useTaskStore = create<TaskState>()((set) => ({
  tasks: [],
  moveTask: (taskId, quadrant) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, quadrant } : t
      ),
    })),
  completeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: true } : t
      ),
    })),
}))
```

* **`useTaskStore`:** Menyimpan daftar tugas, kuadran mereka di Matrix, dan status penyelesaian (terhubung ke Heatmap). Akses via selector: `const tasks = useTaskStore((s) => s.tasks)`.
* **`useNoteStore`:** Menyimpan teks catatan dan daftar relasi (*links*) yang akan dirender oleh komponen React Flow. Dibuat dengan pola yang sama menggunakan `create` dari `'zustand'`.

---

## 6. Version Reference

| Library / Framework | Versi Direkomendasikan | Paket NPM |
|---|---|---|
| Next.js | v16.x | `next` |
| React | v19.x | `react`, `react-dom` |
| Tailwind CSS | v4.x | `tailwindcss`, `@tailwindcss/postcss` |
| Framer Motion / Motion | v11+ | `framer-motion` atau `motion` |
| @dnd-kit (React) | v0.1+ | `@dnd-kit/react` |
| React Flow (xyflow) | latest | `@xyflow/react` |
| Recharts | v3.3+ | `recharts` |
| Zustand | v5.x | `zustand` |
| Heroicons | v2.x | `@heroicons/react` |