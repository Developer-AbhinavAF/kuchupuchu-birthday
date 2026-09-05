# 🎂 Birthday Website Configuration Guide

## 📁 Where to Change Paths and Settings

### Main Configuration File
**File:** `/e:/bday/src/data/birthdayConfig.ts`

This is the main file where you can customize everything:

---

## 🖼️ Image Paths Configuration

### 1. Letter Section Photo Cards
```typescript
letterPhotoCards: [
  {
    path: "/assets/images/your-image.jpg",  // ← Change this path
    caption: "Your caption 💕",              // ← Change this caption
    position: "left",                        // ← "left" or "right"
  },
  // Add more cards as needed
]
```

### 2. Gallery Pictures (100 Pictures)
```typescript
galleryPictures: Array.from({ length: 100 }, (_, i) => {
  const existingImages = [
    "/assets/images/your-image-1.jpg",  // ← Change these paths
    "/assets/images/your-image-2.jpg",
    // Add your 100 images here
  ];
  return {
    path: existingImages[i % existingImages.length],
    caption: "Your caption",
    date: "", // Optional: "2024-01-01"
  };
})
```

### 3. Cat Video
```typescript
catAssetPaths: {
  cute: "/assets/images/your-cat-video.mp4",  // ← Change this path
  confused: "/assets/images/your-cat-video.mp4",
  // Use same video for all states or different videos
}
```

---

## 📝 Text Content Configuration

### Recipient & Sender Names
```typescript
recipientName: "Kuchupuchuu",  // ← Change recipient name
senderName: "Bhonduu",         // ← Change sender name
```

### Passcode
```typescript
passcode: "6910",  // ← Change the passcode
```

### Letter Content
```typescript
letterHeading: "For My Universe ",  // ← Change letter heading
letterParagraphs: [
  "Your first paragraph text here...",  // ← Change paragraphs
  "Your second paragraph text here...",
  // Add more paragraphs as needed
],
letterClosing: "Apka pyara",  // ← Change closing text
```

### Future Section Text
```typescript
futureText: [
  "Some dreams we've to complete together remember??",
  // Change these lines
]
```

### Distance Section Text
```typescript
distanceTexts: [
  "Same place",
  "different body",
  "one connection",
  "one heart",
]
```

### Finale Messages
```typescript
finaleMessage: "Happy Birthday, Myy Kuchupuchuuuu. Smile Foreverrrrr. 🌸",
finaleSubMessage: "I'm here for you — forever my life.",
```

### Birthday Age
```typescript
age: 16,  // ← Change the age number
```

---

## 🎵 Music Configuration

```typescript
musicUrl: "",  // ← Add your music file path: "/assets/music/your-song.mp3"
```

---

## 📸 How to Add Your Images

### Step 1: Organize Your Images
Place all your images in the public folder:
```
/public/assets/images/
  ├── your-image-1.jpg
  ├── your-image-2.jpg
  ├── your-cat-video.mp4
  └── your-music.mp3
```

### Step 2: Update Paths in birthdayConfig.ts
Change the paths to match your actual filenames:
```typescript
letterPhotoCards: [
  {
    path: "/assets/images/your-actual-filename.jpg",
    caption: "Beautiful memory 💕",
    position: "left",
  },
]
```

### Step 3: Use Root-Relative Paths
Always use paths starting with `/` for Vercel deployment:
- ✅ Correct: `/assets/images/photo.jpg`
- ❌ Wrong: `assets/images/photo.jpg`
- ❌ Wrong: `./assets/images/photo.jpg`

---

## 🎨 Other Customizations

### Colors
You can change colors in the CSS file: `/e:/bday/src/styles/tailwind.css`

Look for these color variables and change them:
```css
--primary: #8B2252;     /* Main pink color */
--secondary: #C4B5D4;   /* Lavender color */
--accent: #F2D4D4;      /* Light pink */
--dark: #2A1F3D;        /* Dark background */
```

### Animation Speed
To make animations faster/slower, modify durations in CSS:
```css
/* Example: Make heart animation faster */
@keyframes heart-beat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
```

---

## 🚀 Deployment to Vercel

### Steps:
1. Push your code to GitHub
2. Go to Vercel.com
3. Import your repository
4. Vercel will automatically detect Next.js
5. Click "Deploy"

### Important Notes:
- Make sure all image paths use `/` format
- Images must be in the `/public` folder
- No need to change any deployment settings

---

## 📱 Mobile Responsiveness

The site is already responsive with these breakpoints:
- Desktop: > 768px
- Tablet: 481px - 768px  
- Mobile: ≤ 480px

Mobile-specific styles are in `/e:/bday/src/styles/tailwind.css` under:
```css
@media (max-width: 768px) { ... }
@media (max-width: 480px) { ... }
```

---

## 🐛 Troubleshooting

### Images Not Loading:
- Check that paths start with `/`
- Verify images are in `/public/assets/images/`
- Check file extensions (.jpg, .png, .mp4)

### Videos Not Playing:
- Ensure video format is .mp4
- Check video path in `catAssetPaths`
- Verify video file is accessible

### Animations Too Slow:
- Reduce particle counts in component files
- Increase animation durations in CSS
- Disable some animations on mobile

### Scrolling Issues:
- The gallery section has custom scrolling
- Letter section has independent scrolling
- Navigate using arrow keys or scroll dots

---

## 📞 Quick Reference

| What to Change | File Location |
|---------------|---------------|
| Image paths | `src/data/birthdayConfig.ts` |
| Text content | `src/data/birthdayConfig.ts` |
| Colors | `src/styles/tailwind.css` |
| Animations | `src/styles/tailwind.css` |
| Components | `src/components/` |

---

## ✅ Checklist Before Deployment

- [ ] All image paths use `/` format
- [ ] Images are in `/public/assets/images/`
- [ ] Video file is correct format (.mp4)
- [ ] Music file path is correct (if used)
- [ ] All text content is updated
- [ ] Passcode is set correctly
- [ ] Age is correct
- [ ] Build runs successfully (`npm run build`)

---

## 🎉 Final Notes

This birthday website is designed to be:
- 🌸 Beautiful and romantic
- 📱 Mobile responsive
- ⚡ Performance optimized
- 🚀 Vercel deployment ready
- 💕 Customizable and easy to edit

Have a wonderful birthday celebration! 🎂✨