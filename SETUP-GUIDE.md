# 🚀 Quick Setup Guide - Interior-Dost

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

## Step 2: Get Your API Keys

You need 2 API keys to run the app:

### 🔑 API Key 1: Image Generation (Choose ONE)

#### Option A: Hugging Face (FREE - Recommended for Students!) ⭐

**What it does:** Generates the redesigned room images using AI

**Cost:** **100% FREE!** No credit card required!

**How to get it:**
1. Go to [huggingface.co](https://huggingface.co/)
2. Click "Sign up" (top right)
3. Sign up with GitHub or email
4. Go to [Settings → Access Tokens](https://huggingface.co/settings/tokens)
5. Click "New token"
6. Name it `interior-dost-app`, select role: **Read**
7. Click "Generate token"
8. Copy the token (starts with `hf_...`)

**Perfect for:** Students, testing, demos, hackathons!

📖 **Detailed guide:** See [HUGGINGFACE-SETUP.md](./HUGGINGFACE-SETUP.md)

---

#### Option B: Replicate (Paid - Better Quality)

**What it does:** Generates the redesigned room images using AI

**Cost:** ~$0.01-0.03 per image (pay as you go)

**How to get it:**
1. Go to [replicate.com](https://replicate.com/)
2. Click "Sign up" (top right)
3. Sign up with GitHub or email
4. Once logged in, go to [Account Settings](https://replicate.com/account/api-tokens)
5. Click "Create token" or copy your default token
6. Copy the token (starts with `r8_...`)

**⚠️ Important:** You need to add credit to your Replicate account:
1. After creating your account, go to [Billing](https://replicate.com/account/billing)
2. Click "Add credit" 
3. Add **$1-5** (even $1 works! See [STUDENT-BUDGET-GUIDE.md](./STUDENT-BUDGET-GUIDE.md))
   - $1 = 30-100 images (perfect for testing/demos)
   - $5 = 150-500 images (for extensive testing)
4. Wait 2-3 minutes for credit to be available

---

### 🔑 API Key 2: Vision AI (Choose ONE)

**What it does:** Analyzes room images to understand the space

#### Option A: Google Gemini (Recommended - Has Free Tier)

**How to get it:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Click "Create API key in new project"
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
   ```

2. Open the `.env` file in your editor

3. Paste your API keys:

   **If using Hugging Face (FREE) + Gemini (FREE):** ⭐ RECOMMENDED
   ```env
   # Image Generation (FREE!)
   IMAGE_PROVIDER=huggingface
   HUGGINGFACE_API_TOKEN=hf_your_huggingface_token_here
   
   # Vision AI (FREE!)
   GEMINI_API_KEY=AIza_your_gemini_key_here
   VISION_PROVIDER=gemini
   ```

   **If using Replicate (Paid) + Gemini (FREE):**
   ```env
   # Image Generation (Paid)
   IMAGE_PROVIDER=replicate
   REPLICATE_API_TOKEN=r8_your_replicate_token_here
   
   # Vision AI (FREE!)
   GEMINI_API_KEY=AIza_your_gemini_key_here
   VISION_PROVIDER=gemini
   ```

   **If using Replicate (Paid) + OpenAI (Paid):**
   ```env
   # Image Generation (Paid)
   IMAGE_PROVIDER=replicate
   REPLICATE_API_TOKEN=r8_your_replicate_token_here
   
   # Vision AI (Paid)
   OPENAI_API_KEY=sk_your_openai_key_here
   VISION_PROVIDER=openai
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

You should see the Interior-Dost interface! 🎉

---

## 🧪 Test the App

1. **Upload a room image** (jpg or png, max 10MB)
2. **Choose a style** (modern, traditional, minimalist, or bohemian)
3. **Click "Redesign"**
4. **Wait 30-60 seconds** for the AI to work its magic
5. **View results** - before/after images + furniture suggestions

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
