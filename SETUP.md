# Assam Local Guide - Setup Instructions

## Quick Start (No API Key Needed)

The project works perfectly **without any setup**! Just open `index.html` in your browser and start asking questions. The system will use local rules to provide responses about Assam culture.

##  Enable AI Enhancement (Optional)

To get enhanced responses from ChatGPT API:

### Step 1: Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-...`)

### Step 2: Configure the Project
1. Open `config.js` file
2. Replace `YOUR_OPENAI_API_KEY_HERE` with your actual API key:
   ```javascript
   OPENAI: {
       API_KEY: 'sk-your-actual-api-key-here',
       // ... other settings
   }
   ```

### Step 3: Test the System
1. Open `index.html` in your browser
2. Ask any question about Assam
3. You should see "🤖 AI Enhanced:" prefix in responses

## 🎛️ Configuration Options

Edit `config.js` to customize behavior:

```javascript
SYSTEM: {
    ENABLE_AI: true,        // Set false to disable AI completely
    AI_TIMEOUT: 10000,      // API timeout in milliseconds
    TYPING_SPEED: 30,       // Typing animation speed
    MAX_HISTORY: 20         // Maximum history items
},

DEMO: {
    SHOW_SYSTEM_STATUS: true,    // Show AI/Local status badges
    ENABLE_TYPING_EFFECT: true,  // Enable typing animation
    SHOW_SOURCE_LABELS: true     // Show response source labels
}
```

## 🔄 How the Hybrid System Works

1. **User asks question** → System tries AI first
2. **AI available** → Returns enhanced response with "🤖 AI Enhanced:" label
3. **AI unavailable** → Falls back to local rules with "📚 Local Guide:" label
4. **Always works** → Never fails, always provides an answer

## 🎪 For Hackathon Demo

### Without API Key (Recommended for Demo)
- Shows professional rule-based system
- Demonstrates context-aware logic
- No external dependencies
- Always works reliably

### With API Key (Advanced Demo)
- Shows hybrid AI + local system
- Demonstrates fallback mechanisms
- Impresses judges with AI integration
- Handles any question about Assam

## 🛡️ Security Notes

- **Never commit API keys** to version control
- **Use environment variables** in production
- **Consider backend proxy** for production apps
- **Monitor API usage** to avoid unexpected charges

## 🚨 Troubleshooting

### AI Not Working?
1. Check API key in `config.js`
2. Verify internet connection
3. Check browser console for errors
4. System will automatically use local rules as fallback

### CORS Errors?
- This is normal for direct API calls from browser
- Consider using a backend proxy for production
- Local rules will work as fallback

### No Responses?
- Check if JavaScript is enabled
- Open browser developer tools to see errors
- Ensure all files are in the same directory

## 📱 Browser Compatibility

- ✅ Chrome, Firefox, Safari, Edge (modern versions)
- ✅ Mobile browsers
- ✅ Works offline (local rules only)
- ✅ No installation required