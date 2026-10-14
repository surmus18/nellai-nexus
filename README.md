# Nellai Nexus (nellainexus.in)

> **Premier Event Management & Equipment Rental Platform in Tirunelveli, Tamil Nadu.**  
> **Office Address:** 196, SM Plaza, Tiruchendur Road, Samathanapuram, Palayamkottai - 627002  
> **Contact Numbers:** +91 96262 72817 / WhatsApp: +91 96262 72818

---

## 🚀 Website Structure (100% Static + Brevo Mail)

```
nellai-nexus/
│
├── index.html                 # Homepage with Hero Slider, Highlights, Quick Enquiry
├── services.html              # Full directory of all 12 Event Services
├── resorts.html               # Resorts & Cottage Booking across Tamil Nadu
├── rentals.html               # Catalog of all 11 Banquet Rental Items
├── about.html                 # Company Story & Palayamkottai Office Hub
├── contact.html               # Contact Form, Office Directions & Map Info
├── terms.html                 # Booking & Equipment Rental Terms
│
├── services/                  # 12 Dedicated SEO Service Pages
│   ├── welcome-girls.html
│   ├── bouncers.html
│   ├── chenthamelam.html
│   ├── catering.html
│   ├── catering-service.html
│   ├── stage-decoration.html
│   ├── sound-light-service.html
│   ├── birthday-party.html
│   ├── balloon-decoration.html
│   ├── mehendi-artist.html
│   ├── dj-music-services.html
│   └── popcorn-cotton-candy.html
│
├── assets/                    # Static Assets (Images, Logo, Slider JS)
│   ├── images/
│   │   ├── logo.jpg
│   │   ├── welcome_girls.jpg
│   │   ├── bouncers.jpg
│   │   ├── chenthamelam.jpg
│   │   └── ...
│   └── js/
│       └── slider.js
│
├── mail.php                   # Standalone Transactional Email Dispatcher (Brevo REST API)
├── mail_config.json           # Brevo API Key & Admin Email Settings
├── sitemap.xml                # Full SEO XML Sitemap for all 18 pages
├── robots.txt                 # Search Engine Directives
└── .htaccess                  # Apache / Cloudflare clean URL rewrite rules
```

---

## ⚡ Deployment on Cloudflare Pages / GitHub

1. **Initialize Git & Push:**
   ```bash
   git init
   git add .
   git commit -m "Nellai Nexus production static website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/nellai-nexus.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages:**
   - Go to Cloudflare Dashboard -> **Workers & Pages** -> **Create application** -> **Pages**.
   - Connect GitHub repo `nellai-nexus`.
   - Build settings:
     - Framework preset: **None**
     - Build command: *(leave empty)*
     - Build output directory: `.` *(root)*
   - Click **Save and Deploy**!

---

© 2026 Nellai Nexus. All rights reserved.
