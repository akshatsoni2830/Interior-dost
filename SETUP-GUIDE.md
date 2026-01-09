# 🚀 Quick Setup Guide - Interior-Dost v2.1

Get your Interior-Dost app running in 5 minutes!

## Prerequisites

- Node.js 20+ installed ([Download here](https://nodejs.org/))
- A code editor (VS Code recommended)
- Internet connection

## Step 1: Install Dependencies

```bash
cd interior-dost
npm install
```

## Step 2: Get Your API Key

**Good news!** You only need ONE API key for v2.1:

### 🔑 Google Gemini Vision API (FREE!)

**What it does:** Analyzes room images to understand the space

**Cost:** **100% FREE!** 1500 requests per day on free tier

**How to get it:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Click "Create API key in new project"
5. Copy the API key (starts with `AIza...`)

**Perfect for:** Everyone! No credit card required.

---

### 🎨 Image Generation (No API Key Needed!)

**What it does:** Generates the redesigned room images using AI

**Service:** Pollinations.ai SDXL Turbo

**Cost:** **100% FREE!** No API key required!

**How it works:**
- Interior-Dost v2.1 uses Pollinations.ai automatically
- No setup needed - it just works!
- ~3.3k free images available
- Fast SDXL Turbo model

**Perfect for:** Students, testing, demos, hackathons!

---

### 🔑 Alternative: OpenAI GPT-4 Vision (Optional, Paid)
5. Copy the key (starts with `AIza...`)

**Cost:** FREE for first 60 requests/minute, then ~$0.001 per image

#### Option B: OpenAI GPT-4 Vision (Alternative)

**How to get it:**
1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Go to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key (starts with `sk-...`)

**Cost:** ~$0.01 per image (requires paid account)

---

## Step 3: Configure Environment Variables

1. In the `interior-dost` folder, copy the example file:
   ```bash
   cp .env.example .env
**If you want to use OpenAI instead of Gemini for vision:**

**Cost:** Paid (GPT-4 Vision API)

**How to get it:**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)

---

## Step 3: Configure Environment

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file in your editor

3. Paste your Gemini API key:

   **Recommended Setup (FREE!):** ⭐
   ```env
   # Vision AI (FREE!)
   GEMINI_API_KEY=AIza_your_gemini_key_here
   VISION_PROVIDER=gemini
   
   # Image Generation (FREE - No API key needed!)
   # Pollinations.ai SDXL Turbo is used automatically
   IMAGE_GENERATOR=pollinations
   
   # Optional: Demo Mode
   DEMO_MODE=false
   ```

   **Alternative Setup (OpenAI Vision):**
   ```env
   # Vision AI (Paid)
   OPENAI_API_KEY=sk_your_openai_key_here
   VISION_PROVIDER=openai
   
   # Image Generation (FREE - No API key needed!)
   IMAGE_GENERATOR=pollinations
   
   # Optional: Demo Mode
   DEMO_MODE=false
   ```

4. Save the file

## Step 4: Run the App

```bash
npm run dev
```

You should see:
```
▲ Next.js 16.1.1
- Local:        http://localhost:3000
```

## Step 5: Open in Browser

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the Interior-Dost landing page! 🎉

---

## 🧪 Test the App

1. **Click "Start Designing"** to go to the design tool
2. **Upload a room image** (jpg or png, max 10MB) or take a photo with your mobile camera
3. **Choose a style** (modern, traditional, minimalist, or bohemian)
4. **Click "Redesign My Room"**
5. **Wait 30-60 seconds** for the AI to work its magic
6. **View results** - before/after images with geometry-preserved redesign + furniture suggestions

---

## 💰 Cost Estimates

**Good news for students:** Even $1 is enough!

For testing/demo purposes:
- **$1:** ~30-100 images (perfect for hackathons/projects!)
- **$5:** ~150-500 images (extensive testing)
- **$10:** ~300-1000 images (production use)

**Student tip:** Check [STUDENT-BUDGET-GUIDE.md](./STUDENT-BUDGET-GUIDE.md) for budget-friendly strategies!

Both APIs offer free tiers/credits for new users!

---

## 🐛 Troubleshooting

### "Missing API key" error
- Check your `.env` file exists in the `interior-dost` folder
- Make sure you copied the keys correctly (no extra spaces)
- Restart the dev server after changing `.env`

### "API timeout" error
- Check your internet connection
- Verify your API keys are valid
- Try again (sometimes APIs are temporarily slow)

### "Insufficient credit" error (Replicate)
- Go to [Replicate Billing](https://replicate.com/account/billing)
- Add credit to your account (**$1 is enough for testing!**)
- Wait 2-3 minutes for credit to activate
- Restart your dev server and try again
- See [STUDENT-BUDGET-GUIDE.md](./STUDENT-BUDGET-GUIDE.md) for budget tips

### "Invalid file format" error
- Only jpg and png files are supported
- File must be under 10MB
- Try a different image

### Build fails with font error
- This is a network issue with Google Fonts
- The app still works in development mode
- Try again when you have stable internet

---

## 📚 Additional Resources

- **Replicate Docs:** [docs.replicate.com](https://replicate.com/docs)
- **Gemini API Docs:** [ai.google.dev](https://ai.google.dev/docs)
- **OpenAI API Docs:** [platform.openai.com/docs](https://platform.openai.com/docs)

---

## 🎯 Next Steps

Once your app is running:

1. **Test with different room types** (bedroom, living room, kitchen)
2. **Try all vibe presets** (modern, traditional, minimalist, bohemian)
3. **Test error handling** (try invalid files, large files)
4. **Check furniture suggestions** (click the shopping links)
5. **Monitor API costs** in your Replicate/Gemini dashboards

---

## 🚀 Deploy to Production (Optional)

Ready to share your app?

### Deploy to Vercel (Easiest)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com/)
3. Click "Import Project"
4. Select your GitHub repo
5. Add environment variables in Vercel dashboard
6. Click "Deploy"

Your app will be live at `your-app.vercel.app`!

---

## 📞 Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review [E2E-TEST-SUMMARY.md](./E2E-TEST-SUMMARY.md) for testing info
- Check API provider documentation for API-specific issues

---

**Happy Redesigning! 🏠✨**
