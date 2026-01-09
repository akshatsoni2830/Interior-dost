# Personal Prompt Enhancement Guide

## Overview

Interior-Dost v2.1+ now supports **Personal Prompt Enhancement** - you can write your own custom prompts and the system will intelligently enhance them while preserving room geometry!

---

## 🎯 What's New

### 1. Pollinations API Key Support

You can now use your Pollinations API key for enhanced features:

**Benefits with API key:**
- Access to all Pollinations models (including SDXL Turbo)
- Better rate limits
- Priority processing
- Enhanced features

**Setup:**
```env
# In your .env file
POLLINATIONS_API_KEY=your_api_key_here
```

**Still works without API key!** The app will use the free tier if no key is provided.

---

### 2. Personal Prompt Enhancement

Write your own prompts and the system will enhance them intelligently!

**How it works:**
1. You write a custom prompt describing what you want
2. The system automatically adds room preservation constraints
3. Your prompt is enhanced with quality and technical parameters
4. Room geometry, dimensions, and angles are preserved

**Example:**

**Your Input:**
```
"cozy scandinavian style with lots of plants and natural wood"
```

**System Enhancement:**
```
EXACT SAME ROOM LAYOUT, preserve exact room geometry and dimensions,
maintain identical camera angle and perspective, keep all walls in exact
same positions, preserve all windows and doors in original locations,
no structural changes whatsoever, same room proportions and scale,
interior redesign with: cozy scandinavian style with lots of plants and
natural wood, enhance the described style while preserving room structure,
apply the requested aesthetic to furniture and decor only, maintain
architectural features unchanged, Indian home aesthetic, rental friendly,
photorealistic interior photography, professional real estate photo quality,
natural lighting, 4k resolution, high detail, sharp focus
```

---

## 3. Enhanced Geometry Preservation

**Stronger room structure preservation:**
- ✅ EXACT room layout maintained
- ✅ Identical camera angle and perspective
- ✅ All walls in exact same positions
- ✅ Windows and doors in original locations
- ✅ No structural changes whatsoever
- ✅ Same room proportions and scale

**What changes:**
- ✅ Furniture and decor
- ✅ Color schemes and styling
- ✅ Lighting and ambiance
- ✅ Accessories and details

**What NEVER changes:**
- ❌ Room dimensions
- ❌ Wall positions
- ❌ Window locations
- ❌ Door placements
- ❌ Camera angle
- ❌ Room proportions

---

## 📝 How to Use Personal Prompts

### Method 1: Simple Text Input

Just type what you want in the text box:

```
"modern minimalist with white walls and black accents"
```

```
"traditional indian with carved wooden furniture and brass decor"
```

```
"bohemian style with colorful textiles and eclectic art"
```

### Method 2: Detailed Descriptions

Be as specific as you want:

```
"elegant french country style with distressed white furniture,
soft pastel colors, vintage chandeliers, and floral patterns"
```

```
"industrial loft aesthetic with exposed brick walls (keep existing walls),
metal fixtures, edison bulbs, and leather furniture"
```

```
"zen japanese minimalism with low furniture, natural materials,
bamboo elements, and neutral earth tones"
```

### Method 3: Combine with Presets

You can still use presets, and they'll be enhanced with your personal touch:

1. Select a preset (Modern, Traditional, Minimalist, Bohemian)
2. Add your personal prompt in the text box
3. Both will be combined intelligently

---

## 💡 Tips for Best Results

### ✅ DO:

- **Be specific about style:** "scandinavian minimalist" is better than "nice"
- **Mention materials:** "natural wood, linen fabrics, ceramic" helps a lot
- **Describe colors:** "warm earth tones" or "cool blues and grays"
- **Include mood:** "cozy and inviting" or "bright and airy"
- **Reference specific elements:** "rattan furniture, macrame wall hangings"

### ❌ DON'T:

- **Don't mention structural changes:** System will ignore "knock down walls"
- **Don't specify room dimensions:** "make room bigger" won't work
- **Don't ask to move windows/doors:** These are preserved automatically
- **Don't request different angles:** Camera angle is locked

### 🎨 Example Prompts

**Cozy & Warm:**
```
"warm and cozy with soft lighting, plush textiles, warm wood tones,
and comfortable seating areas"
```

**Bright & Airy:**
```
"bright and airy with white walls, natural light, light wood furniture,
and minimal clutter"
```

**Luxurious:**
```
"luxurious and elegant with velvet upholstery, gold accents,
marble surfaces, and crystal lighting"
```

**Eco-Friendly:**
```
"sustainable and eco-friendly with reclaimed wood, natural fibers,
indoor plants, and organic materials"
```

**Artistic:**
```
"artistic and creative with gallery walls, colorful artwork,
unique furniture pieces, and bold patterns"
```

---

## 🔧 Technical Details

### Prompt Processing Flow

1. **User Input** → Your personal prompt
2. **Geometry Lock** → System adds room preservation constraints
3. **Enhancement** → Quality and technical parameters added
4. **Negative Prompt** → Unwanted elements filtered out
5. **Generation** → Pollinations SDXL Turbo creates the image

### Automatic Enhancements

The system automatically adds:
- Room geometry preservation
- Camera angle locking
- Indian home aesthetic
- Rental-friendly constraints
- Photorealistic quality parameters
- Professional lighting
- High resolution (4k)
- Sharp focus

### What You Control

You have full control over:
- Style and aesthetic
- Color schemes
- Furniture types
- Materials and textures
- Mood and ambiance
- Decorative elements

---

## 🚀 Getting Started

1. **Add your Pollinations API key** (optional but recommended):
   ```env
   POLLINATIONS_API_KEY=your_key_here
   ```

2. **Upload your room image**

3. **Write your personal prompt** in the text box:
   ```
   "scandinavian minimalist with natural wood and white tones"
   ```

4. **Click "Redesign My Room"**

5. **Wait 30-60 seconds** for the magic to happen!

6. **View your results** - room geometry preserved, style transformed!

---

## 📊 Comparison

### Before (v2.1):
- ❌ Room geometry sometimes drifted
- ❌ Limited to preset styles
- ❌ No personal prompt support
- ❌ Basic geometry preservation

### After (v2.1+):
- ✅ EXACT room geometry preserved
- ✅ Personal prompts supported
- ✅ Intelligent prompt enhancement
- ✅ Stronger geometry lock
- ✅ API key support for better features

---

## 🎓 Examples

### Example 1: Scandinavian Style

**Your Prompt:**
```
"scandinavian style with light wood, white walls, and cozy textiles"
```

**Result:**
- Room dimensions: PRESERVED
- Camera angle: PRESERVED
- Style: Transformed to Scandinavian
- Furniture: Light wood pieces
- Colors: White and natural tones
- Textiles: Cozy and minimal

### Example 2: Industrial Loft

**Your Prompt:**
```
"industrial loft with metal fixtures, exposed elements, and leather furniture"
```

**Result:**
- Room dimensions: PRESERVED
- Camera angle: PRESERVED
- Style: Transformed to Industrial
- Fixtures: Metal and industrial
- Furniture: Leather and wood
- Aesthetic: Urban loft vibe

### Example 3: Traditional Indian

**Your Prompt:**
```
"traditional indian with carved wood, brass decor, and rich textiles"
```

**Result:**
- Room dimensions: PRESERVED
- Camera angle: PRESERVED
- Style: Traditional Indian
- Furniture: Carved wooden pieces
- Decor: Brass accents
- Textiles: Rich and colorful

---

## 🆘 Troubleshooting

**Q: My prompt isn't working**
- A: Make sure you're describing style, not structure
- A: Focus on furniture, colors, and decor
- A: Avoid mentioning walls, windows, or room size

**Q: Room looks different**
- A: Check if you mentioned structural changes
- A: System should preserve geometry - report if not

**Q: Image quality is low**
- A: Add your Pollinations API key for better results
- A: Try again - generation can vary slightly

**Q: Generation failed**
- A: Check your internet connection
- A: Verify your API key is correct
- A: Try a simpler prompt

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review the main README.md
3. Check TROUBLESHOOTING.md
4. Open an issue on GitHub

---

**Happy Redesigning with Personal Prompts! 🎨✨**
