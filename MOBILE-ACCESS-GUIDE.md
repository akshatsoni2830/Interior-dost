# Mobile Access Guide - Interior-Dost

## 🎯 Quick Start

To access Interior-Dost on your mobile browser, you need to expose your local development server to the internet. Here are the best methods:

---

## Method 1: Using Your Local Network (Easiest - Same WiFi)

### Step 1: Find Your Computer's IP Address

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter (usually starts with `192.168.x.x`)

**On Mac/Linux:**
```bash
ifconfig
```
Look for `inet` address under your WiFi interface (usually starts with `192.168.x.x`)

### Step 2: Start the Development Server

```bash
cd interior-dost
npm run dev
```

The server will start on `http://localhost:3000`

### Step 3: Access from Mobile

On your mobile device (connected to the **SAME WiFi network**):

1. Open your mobile browser (Chrome, Safari, etc.)
2. Navigate to: `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`

### ✅ Pros:
- Free
- Fast
- No external services needed
- Works immediately

### ❌ Cons:
- Only works on same WiFi network
- IP address changes if you reconnect to WiFi

---

## Method 2: Using ngrok (Recommended - Works Anywhere)

ngrok creates a secure tunnel to your local server, giving you a public URL that works from anywhere.

### Step 1: Install ngrok

**Download from:** https://ngrok.com/download

**Or install via package manager:**

**Windows (Chocolatey):**
```bash
choco install ngrok
```

**Mac (Homebrew):**
```bash
brew install ngrok/ngrok/ngrok
```

**Linux:**
```bash
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok
```

### Step 2: Sign Up for Free Account

1. Go to https://dashboard.ngrok.com/signup
2. Sign up (free tier is enough)
3. Get your auth token from https://dashboard.ngrok.com/get-started/your-authtoken

### Step 3: Configure ngrok

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### Step 4: Start Your App

```bash
cd interior-dost
npm run dev
```

### Step 5: Start ngrok Tunnel

**Open a NEW terminal window** and run:

```bash
ngrok http 3000
```

You'll see output like:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
```

### Step 6: Access from Mobile

Copy the `https://` URL (e.g., `https://abc123.ngrok-free.app`) and open it on your mobile browser!

### ✅ Pros:
- Works from anywhere (not just same WiFi)
- HTTPS enabled (secure)
- Free tier available
- Easy to use

### ❌ Cons:
- URL changes each time you restart ngrok (unless you pay for static URL)
- Free tier has some limitations

---

## Method 3: Using Cloudflare Tunnel (Free Alternative to ngrok)

### Step 1: Install Cloudflare Tunnel

**Download from:** https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

**Or install via package manager:**

**Windows:**
Download the `.exe` from the link above

**Mac (Homebrew):**
```bash
brew install cloudflare/cloudflare/cloudflared
```

**Linux:**
```bash
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

### Step 2: Start Your App

```bash
cd interior-dost
npm run dev
```

### Step 3: Start Cloudflare Tunnel

**Open a NEW terminal window** and run:

```bash
cloudflared tunnel --url http://localhost:3000
```

You'll get a URL like: `https://abc-def-ghi.trycloudflare.com`

### Step 4: Access from Mobile

Copy the URL and open it on your mobile browser!

### ✅ Pros:
- Completely free
- No account needed
- HTTPS enabled
- Works from anywhere

### ❌ Cons:
- URL changes each time
- Slightly slower than ngrok

---

## Method 4: Deploy to Vercel (Production - Best for Long-term Use)

If you want a permanent URL that always works:

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy

```bash
cd interior-dost
vercel
```

Follow the prompts:
- Login/signup to Vercel
- Confirm project settings
- Deploy!

You'll get a permanent URL like: `https://interior-dost.vercel.app`

### Step 3: Set Environment Variables

In Vercel dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add:
   - `GEMINI_API_KEY`
   - `POLLINATIONS_API_KEY`
   - `VISION_PROVIDER`

### Step 4: Redeploy

```bash
vercel --prod
```

### ✅ Pros:
- Permanent URL
- Free tier available
- Automatic HTTPS
- Fast CDN
- Production-ready

### ❌ Cons:
- Requires deployment for each change
- Need to manage environment variables separately

---

## 📱 Mobile Browser Recommendations

### Best Browsers for Interior-Dost:

1. **Chrome (Android)** - Best compatibility
2. **Safari (iOS)** - Native iOS support
3. **Firefox Mobile** - Good alternative
4. **Edge Mobile** - Works well

### Features That Work on Mobile:

✅ Image upload from camera or gallery
✅ Room analysis
✅ Style selection
✅ Personal prompt input
✅ Image generation
✅ Results display
✅ Furniture recommendations

---

## 🎨 Mobile-Optimized UI

Interior-Dost is already mobile-responsive with:

- Touch-friendly buttons
- Responsive layout
- Mobile-optimized image upload
- Easy-to-read text
- Smooth scrolling
- Camera access for direct photo capture

---

## 🔧 Troubleshooting Mobile Access

### Issue: Can't connect via local IP

**Solution:**
1. Make sure both devices are on the same WiFi
2. Check if your firewall is blocking port 3000
3. Try disabling firewall temporarily to test

**Windows Firewall:**
```bash
netsh advfirewall firewall add rule name="Next.js Dev" dir=in action=allow protocol=TCP localport=3000
```

### Issue: ngrok URL not working

**Solution:**
1. Make sure you added your auth token
2. Check if the dev server is running on port 3000
3. Try restarting ngrok

### Issue: Camera not working on mobile

**Solution:**
1. Make sure you're using HTTPS (ngrok/Cloudflare provide this)
2. Grant camera permissions when prompted
3. Try using "Choose File" instead of camera

### Issue: Slow image generation on mobile

**Solution:**
- This is normal - generation takes 30-60 seconds
- Make sure you have good internet connection
- Try using WiFi instead of mobile data

---

## 🚀 Recommended Setup for Mobile Testing

### For Quick Testing (Same WiFi):
```bash
# Terminal 1
cd interior-dost
npm run dev

# Access from mobile: http://YOUR_IP:3000
```

### For Remote Testing (Anywhere):
```bash
# Terminal 1
cd interior-dost
npm run dev

# Terminal 2
ngrok http 3000

# Access from mobile: Use the ngrok HTTPS URL
```

### For Production Use:
```bash
cd interior-dost
vercel --prod

# Access from mobile: Use your Vercel URL
```

---

## 📊 Comparison Table

| Method | Free? | Works Anywhere? | HTTPS? | Permanent URL? | Setup Time |
|--------|-------|-----------------|--------|----------------|------------|
| Local IP | ✅ Yes | ❌ Same WiFi only | ❌ No | ❌ No | 1 min |
| ngrok | ✅ Yes (limited) | ✅ Yes | ✅ Yes | ❌ No* | 5 min |
| Cloudflare | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No | 5 min |
| Vercel | ✅ Yes (limited) | ✅ Yes | ✅ Yes | ✅ Yes | 10 min |

*ngrok offers permanent URLs on paid plans

---

## 💡 Pro Tips

1. **Use ngrok for quick mobile testing** - It's the easiest way to test on your phone while developing

2. **Use Vercel for demos** - If you want to show your project to others, deploy to Vercel

3. **Keep dev server running** - When using ngrok/Cloudflare, keep your dev server running in one terminal and the tunnel in another

4. **Save your ngrok URL** - The URL changes each time, so save it if you need to access it multiple times in one session

5. **Test camera upload** - Mobile browsers handle camera access differently, so test the camera upload feature

6. **Check console logs** - Use mobile browser dev tools (Chrome Remote Debugging) to see console logs

---

## 🎯 Quick Command Reference

### Start Dev Server:
```bash
cd interior-dost
npm run dev
```

### Start ngrok:
```bash
ngrok http 3000
```

### Start Cloudflare Tunnel:
```bash
cloudflared tunnel --url http://localhost:3000
```

### Deploy to Vercel:
```bash
vercel --prod
```

---

## 📞 Need Help?

If you're having trouble accessing on mobile:

1. Check the main README.md
2. Review TROUBLESHOOTING.md
3. Make sure your dev server is running
4. Verify your firewall settings
5. Try a different tunneling method

---

**Happy Mobile Testing! 📱✨**
