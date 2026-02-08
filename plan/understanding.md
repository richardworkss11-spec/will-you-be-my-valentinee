# Deep Understanding of the Plan

## What's Being Built

The app is evolving from a **single-use valentine page** into a **multi-user valentine platform** where anyone can sign up, get their own shareable valentine link, and collect valentines on a public wall.

---

## The Two Types of Users

### 1. The Profile Owner (the person who signs up)
- Signs up with Google (instant, zero friction)
- Sets up a mini profile: display name + profile picture
- Gets a unique shareable link (like `yoursite.com/manish`)
- Shares that link with friends, crush, anyone
- Has a **public wall** where received valentines are displayed
- Can see ALL valentines — including ones with private photos that the public can't see

### 2. The Valentine Sender (the visitor, does NOT need an account)
- Receives a shared link from someone
- Lands on that person's personalized "Will you be my Valentine?" page
- Goes through the existing flow: Landing → Yes! → Congrats → Form
- Fills in: name, email, date, reason, photo, love note
- **NEW choice on the form**: "Show my photo on their public wall?" — yes or no
- Submits → Thank you screen
- Their valentine now shows up on that person's wall

---

## The Complete User Journeys

### Journey A: Signing Up & Setting Up Profile

```
Visit site (yoursite.com)
    │
    ▼
Sign in with Google (one click)
    │
    ▼
Profile Setup Page
  - Enter your display name
  - Upload your profile picture
  - (maybe pick a username/slug for your link)
    │
    ▼
Done! You get your shareable link
  - "Share this link with people and collect valentines!"
  - Link: yoursite.com/manish
    │
    ▼
Dashboard / Your Wall
  - See all valentines you've received
  - Private photos are visible only to you here
```

### Journey B: Sending a Valentine (the visitor experience)

```
Someone shares their link with you
    │
    ▼
You open: yoursite.com/manish
    │
    ▼
Landing Screen: "Will you be Manish's Valentine?"
  - Personalized with their name/photo
  - [Yes!] button + [No] dodge button (same fun mechanic)
    │
    ▼
Congrats Screen: "You said Yes!" (heart explosion)
  - [Tell me more about you]
    │
    ▼
Form Screen: Fill in your details
  - Your name
  - Your email
  - A special date
  - Why them? (reason)
  - Upload a cute photo
  - **NEW: Toggle — "Show my photo on their public wall?"**
    - ON  = photo visible to everyone on the wall
    - OFF = photo visible ONLY to the profile owner
  - Love note / message
  - [Submit]
    │
    ▼
Thank You Screen
```

### Journey C: Viewing Someone's Public Wall

```
Visit yoursite.com/manish/wall (or a wall section on their profile)
    │
    ▼
See all valentines Manish has received:
  - Each card shows: sender name, message, date, reason
  - Photos: ONLY shown if the sender chose "public"
  - Private photos: hidden on public wall (maybe a placeholder like a heart icon)
  - Profile owner (Manish, when logged in): can see ALL photos including private ones
```

---

## The Photo Privacy Logic (this is the key detail)

This is the most important new concept. Here's exactly how it works:

- When a visitor fills out the form, there's a toggle/checkbox: **"Show my photo on the public wall"**
- If **YES (public)**: the photo appears on the wall for everyone to see
- If **NO (private)**: the photo is stored but hidden from the public wall. Only the profile owner can see it when they're logged in

**Who decides?** The SENDER decides. Not the profile owner. The sender chooses their own photo's visibility at submission time.

**What's visible where?**

| Where | Public photos | Private photos |
|-------|--------------|----------------|
| Public wall (anyone visiting) | Visible | Hidden (show a placeholder) |
| Owner's dashboard (logged in) | Visible | Visible |

---

## What Changes from Current App

| Aspect | Current | New |
|--------|---------|-----|
| Auth | None | Google OAuth via Supabase |
| Users | No concept of users | Users with profiles |
| Profile | Doesn't exist | Name + avatar + unique slug |
| Routing | Single page, state-based | Multi-page: `/`, `/setup`, `/[username]`, `/[username]/wall` |
| Valentine target | Generic (not tied to anyone) | Tied to a specific profile owner |
| Photo privacy | All photos stored the same | Sender chooses public vs private |
| Public wall | Doesn't exist | Each user gets one, shows received valentines |
| Landing page text | Generic "Will you be my Valentine?" | Personalized "Will you be [Name]'s Valentine?" |
| Form | Same for everyone | Submits TO a specific user + has privacy toggle |

---

## What Stays the Same

These parts of the current app are KEPT — they're already great:

- The DodgeButton ("No" button that runs away) — stays exactly as is
- The HeartExplosion animation on congrats — stays
- The FloatingHearts background — stays
- The form fields (name, email, date, reason, photo, message) — stays, just add the privacy toggle
- The color scheme and fonts — stays
- The overall flow (Landing → Congrats → Form → Thank You) — stays, just personalized
- PhotoUpload component — stays as is
- Screen transition animations — stays

---

## Database Design Thinking

### New: `profiles` table
- Linked to Supabase auth users
- Stores: display name, avatar URL, unique username/slug
- Created after first Google sign-in + profile setup

### Modified: `valentines` table
- Add `profile_id` — which profile owner this valentine is FOR
- Add `photo_public` (boolean) — did the sender choose to show their photo publicly?
- Rest of the fields stay the same (name, email, date, reason, photo_url, message)

### Storage
- Keep `valentine-photos` bucket for submitted photos
- Add `profile-avatars` bucket for profile pictures

### RLS (Row Level Security) thinking
- `profiles`: anyone can read (public profiles), only the owner can update their own
- `valentines`: anyone (anon) can insert (with a valid profile_id), public reads need to respect photo_public flag, owner can read everything for their own profile

---

## Key Design Decisions to Make

1. **Username/slug format**: How does the shareable link look? `/manish` or `/profile/abc123`? A custom username is friendlier but needs uniqueness validation
2. **Wall location**: Is it a separate page (`/manish/wall`) or a tab/section on the profile page?
3. **What the profile owner sees when they visit their own link**: Do they see their dashboard? Or do they see the same valentine page others see?
4. **Do senders need to be logged in?** Based on the plan — NO. Senders are anonymous visitors, they just fill the form. Only profile owners need Google auth.

---

## Summary

The core idea is: **"Create your profile, share your link, collect valentines, show them off on your wall."**

It turns a one-off valentine page into a social, shareable valentine collection experience. The photo privacy toggle is the thoughtful detail — senders control whether their photo is public or kept just between them and the recipient.
