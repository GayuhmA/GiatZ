# Technical Specification: GiatZ

## 1. Overview

GiatZ adalah platform produktivitas gamifikasi bergaya *Flat 2.0* yang ditujukan untuk mahasiswa. Aplikasi ini menggabungkan manajemen tugas, pengatur waktu fokus, dan sistem pencatatan cerdas ke dalam satu ekosistem interaktif yang terasa seperti permainan.

## 2. Proposed Tech Stack

Mengingat arsitektur berbasis komponen dan kebutuhan interaksi UI yang kompleks, *stack* berikut direkomendasikan:

* **Framework:** Next.js (App Router) dengan React. Sangat cocok untuk menangani *routing* kompleks antar modul (Catatan, Matrix, Orbit) dan optimal untuk performa *frontend*.
* **Styling:** Tailwind CSS. Untuk mengimplementasikan *Design Language* dengan cepat (khususnya utilitas *border-radius* tinggi dan kustomisasi *box-shadow* untuk efek 3D *chunky*).
* **Animation & Interactions:** Framer Motion (untuk animasi transisi/orbit) dan `@dnd-kit/core` (untuk interaksi *drag-and-drop* yang ringan dan *accessible*).
* **Icons:** Hero Icons.
* **Graph Visualization:** React Flow.

## 3. UI/UX & Design Guidelines (Global)

* **Color Palette:**
* Primary Action: Vibrant Orange (`#FF9600` atau setaranya)
* Success/Growth: Growth Green (`#58CC02`)
* Background/Canvas: Soft Sky Blue (`#DDF4FF`) & Off-white.


* **Typography:** Font *sans-serif* tebal dan membulat (misal: Quicksand, Nunito, atau Fredoka).
* **Components:** Menggunakan *card-based layout* dengan `rounded-2xl` atau `rounded-3xl`, tombol dengan efek `border-b-4` (bottom shadow) untuk ilusi 3D yang *tappable*.

---

## 4. Core Features Implementation

### Feature 1: Focus Flow (Orbit & Ambient Mixer)

* **Deskripsi:** Pomodoro timer visual dengan planet yang mengorbit dan *mixer* suara latar *drag-and-drop*.
* **Komponen Visual:** SVG Planet statis di tengah, elemen roket/satelit yang mengorbit.
* **Technical Logic:**
* Gunakan `framer-motion` dengan atribut `animate={{ rotate: 360 }}` dan `transition={{ duration: timerLength, ease: "linear" }}` pada kontainer roket.
* Gunakan `@dnd-kit` untuk ikon "Hujan/Kafe". Saat di-*drop* ke *dropzone* (area orbit), mainkan file `.mp3` menggunakan HTML5 Audio API (`new Audio()`).
* *State* mengatur volume masing-masing suara sehingga bisa dicampur (*mixed*).



### Feature 2: Visual Priority Matrix (Eisenhower 2.0)

* **Deskripsi:** Kanvas interaktif 4 kuadran (*Urgent* vs *Important*).
* **Technical Logic:**
* Buat 4 *Droppable areas* menggunakan `@dnd-kit`.
* Setiap kartu tugas adalah *Draggable item*. Saat state *onDragEnd* dipicu, perbarui state array penyimpan lokasi kartu tersebut.
* **Frontend Magic (Pulsing Effect):** Pada kartu yang *state* lokasinya berada di kuadran "Urgent"





### Feature 3: Centralized Notebook & Mind-Glance

* **Deskripsi:** Editor teks terpusat dengan *Overview Graph* (Mind-Glance) yang menunjukkan koneksi antar materi.
* **Technical Logic:**
* **Graphview:** Implementasi `React Flow`.
* Ubah data catatan menjadi *Nodes* (judul catatan) dan *Edges* (relasi antar catatan).
* Modifikasi `CustomNode` di React Flow agar bentuknya membulat (*pill-shaped*) dan warnanya sesuai palet desain (menggantikan *node* kotak *default* bawaan *library*).



### Feature 4: Smart Study Engine (AI-Flashcard & Quiz)

* **Deskripsi:** Modul ekstraksi catatan menjadi kartu *flashcard* dan kuis.
* **Technical Logic:**
* *Catatan:* Untuk keperluan kompetisi *frontend statis*, gunakan data JSON statis (preset) yang menyimulasikan hasil *generate* AI. Tampilkan animasi "Scanning" (div dengan garis hijau yang dianimasikan naik turun) menggunakan Framer Motion, lalu beri jeda (`setTimeout`) sebelum memunculkan *flashcard*.
* **Flashcard Flip:** Gunakan CSS *transform* 3D (`rotateY(180deg)`) dan `backface-visibility: hidden` dikendalikan oleh *state* `isFlipped`.
* **Radar Chart Kuis:** Gunakan *library* seperti Recharts (`<RadarChart>`) untuk memvisualisasikan skor di akhir sesi kuis.



### Feature 5: Course Mastery Heatmap

* **Deskripsi:** Pelacak progres harian bergaya GitHub *contribution graph*.
* **Technical Logic:**
* Buat komponen Grid menggunakan CSS Grid atau flexbox kalender.
* Buat logika *mapping* tanggal ke array tugas yang selesai.
* Tentukan tingkat kegelapan warna berdasarkan jumlah tugas. Contoh skala kelas Tailwind: `bg-green-100` (1 tugas), `bg-green-300` (2-3 tugas), `bg-green-500` (4+ tugas).



---

## 5. Data Flow & State Management (Mockup)

Untuk purwarupa (*prototype*), gunakan React Context API atau Zustand untuk membagikan data antar komponen tanpa perlu *backend* sungguhan.

* **`TaskStore`:** Menyimpan daftar tugas, kuadran mereka di Matrix, dan status penyelesaian (terhubung ke Heatmap).
* **`NoteStore`:** Menyimpan teks catatan dan daftar relasi (*links*) yang akan dirender oleh komponen React Flow.