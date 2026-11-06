# Saved by Grace Church — Modern Christian Organization Website

> *"Saved by Grace Church – Growing in Faith, Living in Grace, and Sharing God's Love."*  
> *"For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast."* — **Ephesians 2:8–9 (KJV)**

A modern, elegant, fully responsive Christian church organization website built with semantic **HTML5**, modern **CSS3**, and **Vanilla JavaScript**. Designed with a welcoming atmosphere, church-inspired serif typography, gold accents, dark navy blue elements, and warm cream surfaces.

---

## 📖 Table of Contents

- [Website Identity & Design Philosophy](#-website-identity--design-philosophy)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Technologies Used](#-technologies-used)
- [Detailed Sections Overview](#-detailed-sections-overview)
- [JavaScript Functionality](#-javascript-functionality)
- [Customization Guide](#-customization-guide)
  - [Replacing Church Logo](#1-replacing-the-church-logo)
  - [Modifying Church Details & Schedules](#2-modifying-church-details--schedules)
  - [Updating Sermons and Events](#3-updating-sermons-and-events)
  - [Adjusting Colors & Theme](#4-adjusting-colors--theme)
- [Browser Compatibility](#-browser-compatibility)
- [License & Attributions](#-license--attributions)

---

## 🕊️ Website Identity & Design Philosophy

- **Church Name:** Saved by Grace Church
- **Theme:** Christian, Faith, Grace, Worship, Fellowship, and Salvation
- **Design Concept:** Modern, minimalist, and deeply reverent with an inviting, peaceful Christian atmosphere.
- **Color Palette:**
  - **Navy Blue (`#0A192F`, `#0F203C`):** Represents strength, steadfastness, and reverent depth.
  - **Gold Accents (`#D4AF37`, `#FAE188`):** Symbolizes the divine glory of God and the precious gift of grace.
  - **Cream / Warm Ivory (`#FAF7F2`, `#FFFDF8`):** Provides a warm, peaceful, and hospitable foundation.
  - **Pure White (`#FFFFFF`):** High clarity and accessibility for reading scripture and content.
- **Typography:**
  - **Headings:** Google Font **Cinzel** (majestic, church-inspired Roman monumental serif).
  - **Scripture & Quotes:** Google Font **Playfair Display** (graceful, classic serif italics).
  - **Body Text & UI:** Google Font **Plus Jakarta Sans** (clean, crisp, and readable modern sans-serif).

---

## ✨ Key Features

1. **Prominent Hero Section with Ephesians 2:8–9:**
   - Cinematic background image with dark overlay and golden glow.
   - Elegant default Christian church logo featuring a golden Latin Cross, Dove of the Holy Spirit, and Open Bible.
   - Large heading **SAVED BY GRACE CHURCH** with load animations.
   - Central quotation of **Ephesians 2:8–9 (KJV)** in distinct typography.
   - Dual Call-to-Action buttons: *"Plan Your Visit"* and *"Join Our Worship"*.
   - Live service banner showing weekly service hours and online stream badge.

2. **Sticky Navigation Bar:**
   - Smooth glassmorphism backdrop blur on scroll.
   - Active section highlighting on scroll (Scrollspy).
   - Smooth scrolling with offset compensation for the fixed header.
   - Responsive mobile hamburger menu with smooth drawer animation.

3. **About Our Church:**
   - Welcoming message from Lead Pastors David & Sarah Anderson.
   - 28+ years of church history highlight badge.
   - Mission, Vision, and Core Pillars (Biblical Authority, Unconditional Love, Spirit-Led Worship, Joyful Fellowship).
   - Six-pillar **Statement of Faith** grid (The Scriptures, The Triune God, Salvation by Grace Alone, The Church & Baptism, The Great Commission, The Blessed Hope).

4. **Worship Services & First-Time Visitor Guide:**
   - Detailed schedule for Sunday Early Worship (9:00 AM), Celebration Worship (11:00 AM), and Midweek Prayer & Bible Study (Wednesday 7:00 PM).
   - "What to Expect" guide highlighting VIP parking, casual attire, safe children's check-in, and free welcome coffee.
   - Interactive *"Plan Your Visit"* booking modal.

5. **Ministries Section:**
   - Six dedicated ministry cards with rich imagery and icon badges:
     1. **Worship Ministry**
     2. **Youth Ministry (Grace Generation)**
     3. **Children's Ministry (Kingdom Kids)**
     4. **Prayer Ministry**
     5. **Outreach & Missions**
     6. **Bible Study & Discipleship**
   - *"Learn More"* button on every card triggering an informative modal with meeting times, leader contact, and a volunteer connection form.

6. **Upcoming Events & Real-Time Countdown:**
   - Featured Flagship Event hero banner with a live JavaScript countdown timer (Days, Hours, Minutes, Seconds).
   - Events grid (Thanksgiving Community Food Drive, Christmas Eve Candlelight Service, Men's Breakfast).
   - Interactive *"View Details"* modal with digital calendar export and RSVP.

7. **Sermons & Messages:**
   - Filterable sermon cards (All Messages, Grace & Salvation, Faith & Trust, Christian Living).
   - Scripture reference badges and audio/video duration tags.
   - Interactive theater modal with simulated video playback, audio controls, scripture passage, and study notes download.

8. **Photo Gallery & Lightbox:**
   - Responsive grid showcasing worship, fellowship meals, youth retreats, children's choirs, water baptisms, and celebrations.
   - Category filter tabs.
   - Full-screen lightbox modal with high-res viewing, image captions, photo counter ("3 of 9"), previous/next arrows, and keyboard support (`ArrowLeft`, `ArrowRight`, `Escape`).

9. **Contact Us & Location:**
   - Church address, contact telephone, pastoral emergency hotline, email addresses, and office hours.
   - Embedded interactive Google Map placeholder.
   - Confidential Prayer Request card.
   - Client-side validated contact form with real-time feedback and submit status.

10. **Professional Footer:**
    - Church logo, bio, and official motto:
      > *"Saved by Grace Church – Growing in Faith, Living in Grace, and Sharing God's Love."*
    - Quick links, service schedule summary, newsletter subscription with instant validation, social media links, and a dynamic JavaScript copyright year.

---

## 📁 Project Structure

```text
saved-by-grace-church/
│
├── index.html              # Main HTML5 webpage structure
├── css/
│   └── style.css           # Complete styling, variables, animations, and media queries
├── js/
│   └── script.js           # Vanilla JavaScript logic, modals, lightbox, validation
├── images/
│   ├── sgc logo.png        # Official church logo
│   ├── logo.png            # High-resolution transparent church logo
│   ├── logo.svg            # Scalable vector church emblem
│   ├── hero.jpg            # Cinematic cross and sunrise hero background
│   ├── about.jpg           # Warm sanctuary interior photo
│   ├── pastor.jpg          # Pastor portrait
│   ├── ministry-worship.jpg
│   ├── ministry-youth.jpg
│   ├── ministry-children.jpg
│   ├── ministry-prayer.jpg
│   ├── ministry-outreach.jpg
│   ├── ministry-bible.jpg
│   ├── sermon-1.jpg
│   ├── sermon-2.jpg
│   ├── sermon-3.jpg
│   ├── sermon-4.jpg
│   ├── event-1.jpg
│   ├── event-2.jpg
│   ├── event-3.jpg
│   └── gallery/
│       ├── gallery-1.jpg   # Worship service
│       ├── gallery-2.jpg   # Fellowship meal
│       ├── gallery-3.jpg   # Youth retreat
│       ├── gallery-4.jpg   # Children choir
│       ├── gallery-5.jpg   # Blessing food pantry
│       ├── gallery-6.jpg   # Water baptism
│       ├── gallery-7.jpg   # Easter sunrise service
│       ├── gallery-8.jpg   # Midweek prayer circle
│       └── gallery-9.jpg   # Christmas candlelight
└── README.md               # Documentation and customization guide
```

---

## 🛠️ Technologies Used

- **HTML5:** Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
- **CSS3:** Custom Properties (CSS variables), CSS Flexbox, CSS Grid, animations, and media queries.
- **Vanilla JavaScript:** ES6+, `IntersectionObserver`, DOM event listeners, modal controllers, keyboard handlers, and regex validation without external dependencies or heavy frameworks.
- **Google Fonts:** `Cinzel`, `Playfair Display`, and `Plus Jakarta Sans`.
- **Font Awesome 6.5.1:** Church and interface icons loaded via CDN.

---

## ⚙️ Customization Guide

### 1. Replacing the Church Logo
The default logo is located at `images/logo.png` and `images/logo.svg`.
- To use your church's actual logo, replace `images/logo.png` with a PNG file (recommended dimensions: `512x512` pixels with a transparent background).
- The navbar and hero logo references will automatically pick up your replacement.

### 2. Modifying Church Details & Schedules
Open `index.html` and search for:
- **Church Address:** Search for `777 Grace Way, Springfield, IL 62701` and update with your address.
- **Phone & Email:** Search for `(555) 234-5678` and `info@savedbygracechurch.org`.
- **Service Times:** In the `<section id="services">` block, edit service names, hours, or nursery details.

### 3. Updating Sermons and Events
- **Sermons:** In `<section id="sermons">`, each sermon is represented by a `<article class="sermon-card">`. Update the sermon title, scripture reference, speaker name, and duration badge.
- **Events:** In `<section id="events">`, update event dates, images, and descriptions. To change the target date for the countdown clock, open `js/script.js` and edit the `targetDate` in Section 9.

### 4. Adjusting Colors & Theme
In `css/style.css`, all design tokens are defined at the very top under `:root`:
```css
:root {
  --navy-950: #070e19;
  --navy-900: #0a192f;
  --gold-500: #d4af37; /* Primary Gold Accent */
  --cream-100: #faf7f2; /* Warm Cream Background */
}
```
Change these values to match your denomination or church branding guidelines.

---

## 📱 Browser Compatibility

- Google Chrome (latest)
- Mozilla Firefox (latest)
- Apple Safari (iOS & macOS)
- Microsoft Edge (latest)
- Android Chrome & Samsung Internet

---

## 📜 Attributions & Scripture

- **Scripture Verse:** Ephesians 2:8–9 from the King James Version (KJV) (Public Domain).
- **Motto:** *"Saved by Grace Church – Growing in Faith, Living in Grace, and Sharing God's Love."*
- **Soli Deo Gloria** — *To God alone be the glory.*
