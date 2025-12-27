// Assam Local Guide - Simple Local Response System
class AssamGuide {
    constructor() {
        this.searchHistory = [];
        this.isHistoryVisible = false;
        this.initializeEventListeners();
        this.loadHistory();
        this.updateHistoryDisplay();
    }

    initializeEventListeners() {
        const askButton = document.getElementById('askButton');
        const questionInput = document.getElementById('questionInput');
        const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        
        if (askButton) {
            askButton.addEventListener('click', () => this.handleQuestion());
        }
        
        if (questionInput) {
            questionInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleQuestion();
                }
            });
        }
        
        if (toggleHistoryBtn) {
            toggleHistoryBtn.addEventListener('click', () => this.toggleHistory());
        }
        
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        }
    }

    loadHistory() {
        try {
            const stored = localStorage.getItem('assamGuideHistory');
            this.searchHistory = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading history:', error);
            this.searchHistory = [];
        }
    }

    saveHistory() {
        try {
            localStorage.setItem('assamGuideHistory', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }

    addToHistory(question, response) {
        const historyItem = {
            id: Date.now(),
            question: question,
            response: response,
            timestamp: new Date().toLocaleString()
        };
        
        this.searchHistory.unshift(historyItem);
        
        // Keep only last 20 searches
        if (this.searchHistory.length > 20) {
            this.searchHistory = this.searchHistory.slice(0, 20);
        }
        
        this.saveHistory();
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyCount = document.getElementById('historyCount');
        const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
        const historyContainer = document.getElementById('historyContainer');
        
        if (historyCount) {
            historyCount.textContent = this.searchHistory.length;
        }
        
        if (toggleHistoryBtn) {
            if (this.searchHistory.length > 0) {
                toggleHistoryBtn.classList.remove('hidden');
            } else {
                toggleHistoryBtn.classList.add('hidden');
            }
        }
        
        if (historyContainer) {
            historyContainer.innerHTML = '';
            
            if (this.searchHistory.length === 0) {
                historyContainer.innerHTML = `
                    <div class="history-item">
                        <div class="history-question">No search history yet</div>
                        <div class="history-response">Start asking questions about Assam to build your search history!</div>
                    </div>
                `;
            } else {
                this.searchHistory.forEach(item => {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    historyItem.innerHTML = `
                        <div class="history-question">Q: ${item.question}</div>
                        <div class="history-response">${item.response}</div>
                        <div class="history-timestamp">${item.timestamp}</div>
                    `;
                    historyContainer.appendChild(historyItem);
                });
            }
        }
    }

    toggleHistory() {
        const historySection = document.getElementById('historySection');
        const historyBtnText = document.getElementById('historyBtnText');
        
        this.isHistoryVisible = !this.isHistoryVisible;
        
        if (historySection && historyBtnText) {
            if (this.isHistoryVisible) {
                historySection.classList.remove('hidden');
                historyBtnText.textContent = 'Hide History';
                historySection.scrollIntoView({ behavior: 'smooth' });
            } else {
                historySection.classList.add('hidden');
                historyBtnText.textContent = 'Show History';
            }
        }
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all search history?')) {
            this.searchHistory = [];
            this.saveHistory();
            this.updateHistoryDisplay();
            
            if (this.isHistoryVisible) {
                this.toggleHistory();
            }
        }
    }

    analyzeQuestion(question) {
        const lowerQuestion = question.toLowerCase();
        
        // Comprehensive Festival keywords
        const festivalKeywords = [
            'festival', 'bihu', 'ambubachi', 'jonbeel', 'majuli', 'bwisagu', 'kherai', 'doul', 'chavang', 'kut', 'mela', 'celebration',
            'bohag', 'magh', 'kati', 'rongali', 'bhogali', 'kongali', 'meji', 'kamakhya', 'bhelaghar', 'goru bihu', 'manuh bihu',
            'akash banti', 'ali-aye-ligang', 'donyi-polo', 'gumrag', 'sattriya', 'bagurumba', 'doudini', 'bathou', 'ondla', 'narzi'
        ];
        
        // Comprehensive Food keywords
        const foodKeywords = [
            'food', 'dish', 'masor', 'tenga', 'khar', 'aloo', 'pitika', 'pitha', 'laru', 'rice', 'fish', 'tea', 'cuisine', 'cooking', 'eat',
            'breakfast', 'lunch', 'dinner', 'til pitha', 'ghila pitha', 'sunga pitha', 'tekeli pitha', 'til laru', 'narikol laru',
            'chira', 'muri', 'akhoi', 'payesh', 'kheer', 'bhaji', 'xaak', 'paleng', 'dhekia', 'matikaduri', 'bhap', 'jolokia',
            'ghost pepper', 'bamboo shoots', 'dal', 'masoor', 'moong', 'apong', 'purang apin', 'jolpan'
        ];
        
        // Comprehensive Culture keywords
        const cultureKeywords = [
            'culture', 'dance', 'music', 'art', 'craft', 'silk', 'mekhela', 'chador', 'gamosa', 'dhol', 'pepa', 'tradition', 'heritage',
            'weaving', 'muga silk', 'eri silk', 'pat silk', 'bamboo craft', 'cane work', 'pottery', 'mask making', 'bell metal',
            'wood carving', 'taal', 'gogona', 'xutuli', 'bihu geet', 'tokari geet', 'kamrupi lokgeet', 'riha', 'kopou phool',
            'ahom', 'sankardev', 'vaishnavite', 'satra', 'borgeet', 'ankiya nat', 'eka sarana dharma'
        ];
        
        // Comprehensive Language keywords
        const languageKeywords = [
            'language', 'assamese', 'speak', 'bhal lagise', 'kene ase', 'ki kori asa', 'apunar name', 'mur name', 'hello', 'greetings',
            'namaskar', 'adaab', 'dhanyabad', 'khyama koribi', 'bhaal thakibi', 'ek', 'dui', 'tini', 'sari', 'pas', 'soy', 'xaat',
            'aat', 'noy', 'doh', 'maa', 'deuta', 'bhai', 'bhoini', 'aita', 'koka', 'script', 'brahmi', 'dialect'
        ];
        
        // Geography and Places keywords
        const geographyKeywords = [
            'assam', 'northeast', 'india', 'guwahati', 'dibrugarh', 'jorhat', 'silchar', 'tezpur', 'nagaon', 'brahmaputra',
            'majuli island', 'kaziranga', 'manas', 'pobitora', 'kamakhya temple', 'umananda', 'kalakshetra', 'sivasagar',
            'rang ghar', 'talatal ghar', 'kareng ghar', 'digboi', 'morigaon', 'barpeta', 'nilachal hill', 'peacock island',
            // All 35 Districts
            'baksa', 'barpeta', 'biswanath', 'bongaigaon', 'cachar', 'charaideo', 'chirang', 'darrang', 'dhemaji', 'dhubri',
            'dibrugarh', 'dima hasao', 'goalpara', 'golaghat', 'hailakandi', 'hojai', 'jorhat', 'kamrup', 'kamrup metropolitan',
            'karbi anglong', 'karimganj', 'kokrajhar', 'lakhimpur', 'majuli', 'morigaon', 'nagaon', 'nalbari', 'sivasagar',
            'sonitpur', 'south salmara-mankachar', 'tinsukia', 'udalguri', 'west karbi anglong', 'bajali', 'tamulpur',
            // District features
            'tea city', 'cultural capital', 'hill station', 'haflong', 'barak valley', 'moidams', 'royal burial mounds',
            'bhutan border', 'bangladesh border', 'river island', 'satras', 'vaishnav culture', 'bodo territorial region',
            'dibru-saikhowa', 'biodiversity hotspot', 'eco-tourism', 'tribal culture', 'handloom', 'oil industry', 'districts',
            'place', 'places', 'location', 'where', 'district', 'city', 'town', 'area', 'region', 'all districts', '35 districts',
            'list of districts', 'name of districts', 'how many districts'
        ];
        
        // Check which category has most matches
        let festivalMatches = 0;
        let foodMatches = 0;
        let cultureMatches = 0;
        let languageMatches = 0;
        let geographyMatches = 0;
        
        festivalKeywords.forEach(keyword => {
            if (lowerQuestion.includes(keyword)) festivalMatches++;
        });
        
        foodKeywords.forEach(keyword => {
            if (lowerQuestion.includes(keyword)) foodMatches++;
        });
        
        cultureKeywords.forEach(keyword => {
            if (lowerQuestion.includes(keyword)) cultureMatches++;
        });
        
        languageKeywords.forEach(keyword => {
            if (lowerQuestion.includes(keyword)) languageMatches++;
        });
        
        geographyKeywords.forEach(keyword => {
            if (lowerQuestion.includes(keyword)) geographyMatches++;
        });
        
        // Return category with highest matches
        const maxMatches = Math.max(festivalMatches, foodMatches, cultureMatches, languageMatches, geographyMatches);
        
        if (maxMatches === 0) return 'general';
        if (festivalMatches === maxMatches) return 'festivals';
        if (foodMatches === maxMatches) return 'food';
        if (cultureMatches === maxMatches) return 'culture';
        if (languageMatches === maxMatches) return 'language';
        if (geographyMatches === maxMatches) return 'geography';
        
        return 'general';
    }

    generateResponse(question) {
        const category = this.analyzeQuestion(question);
        const lowerQuestion = question.toLowerCase();
        
        // Check for specific festival queries first
        const festivalInfo = this.getFestivalSpecificResponse(lowerQuestion);
        if (festivalInfo) {
            return `📚 Local Guide: ${festivalInfo}`;
        }
        
        // Check for specific food queries
        const foodInfo = this.getFoodSpecificResponse(lowerQuestion);
        if (foodInfo) {
            return `📚 Local Guide: ${foodInfo}`;
        }
        
        // Check for specific district queries
        const districtInfo = this.getDistrictSpecificResponse(lowerQuestion);
        if (districtInfo) {
            return `📚 Local Guide: ${districtInfo}`;
        }
        
        const responses = {
            festivals: [
                "🎉 **Bihu Festival** - Most important festival with 3 types: **Rongali Bihu** (April 14-15, Assamese New Year, 7 days celebration with Bihu dance, Goru Bihu cattle worship, Manuh Bihu human celebration, traditional games like buffalo fighting), **Bhogali Bihu** (January 14-15, food festival with Meji burning at dawn, Bhelaghar community houses, traditional foods), **Kongali Bihu** (October, spiritual festival with Akash Banti earthen lamps in paddy fields, prayers for crops).",
                "🕉️ **Ambubachi Mela** - 4 days in June at Kamakhya Temple, Nilachal Hill, Guwahati. Celebrates annual menstruation period of Goddess Kamakhya. Over 1 million devotees, sadhus, tantrics visit. Temple closed for 3 days, reopens on 4th day. Celebrates feminine power and fertility, major boost to local tourism.",
                "🤝 **Jonbeel Mela** - 3 days in January at Dayang Belguri, Morigaon district. Famous for ancient barter system (no money exchange). Tiwa, Karbi, Khasi tribes and plain dwellers trade agricultural products, handmade crafts. Promotes inter-community harmony, continues 500-year-old tradition.",
                "🌍 **Majuli Festival** - 3 days in November on world's largest river island. Highlights: Sattriya dance, mask-making, pottery. Neo-Vaishnavite traditions focus. Attractions: Satra visits, traditional boat races, handloom weaving showcase, traditional masks.",
                "🎭 **Community Festivals**: **Ali-Aye-Ligang** (Mising tribe, February, 5 days, marks sowing season, Donyi-Polo Sun-Moon worship, Gumrag dance, Apong rice beer, Purang Apin rice cake), **Bwisagu** (Bodo New Year, April, 7 days, Bagurumba dance, Dokhona dress for women, Ondla rice cake, Narzi local brew).",
                "🙏 **Religious Festivals**: **Kherai Puja** (Bodo people, Bathou deity worship by Doudini female priest, flowers/rice offerings), **Doul Utsav** (Assamese Holi, Barpeta famous, 2 days, devotional songs, traditional dances, Lord Krishna celebration, Vaishnavite traditions), **Chavang Kut** (Kuki tribe, November post-harvest, thanksgiving festival, Kuki folk dances, feast sharing)."
            ],
            food: [
                "🍚 **Staple Foods of Assam**: Rice (primary food eaten 3 times daily), Fish (freshwater from rivers and ponds), Vegetables (seasonal local vegetables, bamboo shoots), Dal (various lentils, especially masoor and moong), Tea (Assam tea consumed multiple times daily). Rice dominates every meal from breakfast to dinner.",
                "🍽️ **Traditional Cooking Methods**: **Bhap** (steaming - healthiest method), **Jolokia** (using ghost pepper for spice), **Khar** (alkaline cooking using banana ash), **Tenga** (sour preparations using tomatoes, lemon). These methods preserve nutrition and create unique flavors.",
                "🎉 **Festival Foods During Bihu**: **Pitha varieties** (Til Pitha, Ghila Pitha, Sunga Pitha, Tekeli Pitha), **Laru types** (Til Laru with sesame, Narikol Laru with coconut), **Jolpan items** (Chira-flattened rice, Muri-puffed rice, Akhoi), **Special preparations** (Payesh rice pudding, Kheer). These are prepared during celebrations and shared with community.",
                "🐟 **Daily Traditional Dishes**: **Masor Tenga** (sour fish curry with tomatoes or lemon - signature dish), **Khar** (alkaline dish with raw papaya, bottle gourd), **Aloo Pitika** (mashed potato with mustard oil, onions, green chilies), **Bhaji** (various vegetable preparations), **Xaak** (leafy green vegetables like paleng, dhekia, matikaduri).",
                "☕ **Assam Tea Culture**: **Varieties** (Black tea, Green tea, White tea), **Famous gardens** (Jorhat, Dibrugarh, Tezpur regions), **Preparation** (strong tea with milk and sugar), **Social importance** (offered to guests, consumed during discussions), **Economic significance** (major export product, employment generator). Tea is integral to daily life and social customs."
            ],
            culture: [
                "🧵 **Traditional Textiles**: **Muga Silk** (golden silk unique to Assam, UNESCO recognized), **Eri Silk** (peace silk, eco-friendly production), **Pat Silk** (white silk for religious occasions), **Cotton weaving** (traditional handloom fabrics), **Mekhela Chador** (traditional Assamese women's two-piece attire), **Gamosa** (sacred cloth with cultural and religious significance).",
                "🎨 **Traditional Crafts**: **Bamboo crafts** (baskets, furniture, decorative items), **Cane work** (traditional furniture and household items), **Pottery** (Kumhar community traditional pottery), **Mask making** (Majuli island specialty for cultural performances), **Bell metal work** (traditional utensils and decorative items), **Wood carving** (decorative items and furniture).",
                "🎭 **Music and Dance**: **Bihu dance** (performed during Bihu festivals), **Sattriya dance** (classical dance form from Sattras), **Bagurumba** (traditional Bodo dance), **Instruments** (Dhol, Pepa, Taal, Gogona, Xutuli), **Folk songs** (Bihu geet, Tokari geet, Kamrupi lokgeet). These art forms preserve cultural identity.",
                "👗 **Traditional Attire**: **Women** (Mekhela Chador two-piece, Riha top wear), **Men** (Dhoti, Kurta, Gamosa), **Accessories** (traditional jewelry, Kopou phool foxtail orchid), **Ceremonial wear** (special designs for festivals and weddings). Each garment has cultural significance and regional variations.",
                "🏛️ **Historical Significance**: **Ahom Dynasty** (1228-1826, 600 years rule, administrative system, Rang Ghar/Talatal Ghar/Kareng Ghar architecture), **Srimanta Sankardev** (1449-1568, Neo-Vaishnavite movement founder, Sattriya dance, Borgeet songs, Ankiya Nat drama, Eka Sarana Dharma philosophy, Sattras monasteries across Assam)."
            ],
            language: [
                "🗣️ **Assamese Language Basics**: **Script** (Assamese script derived from Brahmi), **Speakers** (over 15 million people), **Dialects** (Eastern, Central, Western Assamese). The language reflects the warm and welcoming nature of Assamese people.",
                "🙏 **Common Expressions & Greetings**: **Namaskar** (Hello/Goodbye formal), **Adaab** (Respectful greeting), **Bhal lagise** (Feels good/I like it), **Kene ase?** (How are you?), **Ki kori asa?** (What are you doing?), **Apunar name ki?** (What is your name?), **Mur name hol...** (My name is...), **Dhanyabad** (Thank you), **Khyama koribi** (Please forgive/Excuse me), **Bhaal thakibi** (Stay well/Take care).",
                "🔢 **Numbers in Assamese**: **Ek** (One), **Dui** (Two), **Tini** (Three), **Sari** (Four), **Pas** (Five), **Soy** (Six), **Xaat** (Seven), **Aat** (Eight), **Noy** (Nine), **Doh** (Ten). Learning numbers helps in basic communication and market interactions.",
                "👨‍👩‍👧‍👦 **Family Relations**: **Maa** (Mother), **Deuta** (Father), **Bhai** (Brother), **Bhoini** (Sister), **Aita** (Grandmother), **Koka** (Grandfather). Family terms are essential for understanding Assamese social structure and relationships."
            ],
            geography: [
                "🗺️ **All 35 Districts of Assam:** 1.Baksa 2.Barpeta 3.Biswanath 4.Bongaigaon 5.Cachar 6.Charaideo 7.Chirang 8.Darrang 9.Dhemaji 10.Dhubri 11.Dibrugarh 12.Dima Hasao 13.Goalpara 14.Golaghat 15.Hailakandi 16.Hojai 17.Jorhat 18.Kamrup 19.Kamrup Metropolitan 20.Karbi Anglong 21.Karimganj 22.Kokrajhar 23.Lakhimpur 24.Majuli 25.Morigaon 26.Nagaon 27.Nalbari 28.Sivasagar 29.Sonitpur 30.South Salmara-Mankachar 31.Tinsukia 32.Udalguri 33.West Karbi Anglong 34.Bajali 35.Tamulpur",
                "☕ **Tea Districts:** Dibrugarh (Tea City of India with oil & gas), Golaghat (Kaziranga National Park), Jorhat (cultural capital), Tinsukia (tea + oil with Dibru-Saikhowa Park), Biswanath (Brahmaputra riverside tea gardens). These districts produce world-famous Assam tea.",
                "🏛️ **Historic Districts:** Sivasagar (Ahom dynasty capital with Rang Ghar, Talatal Ghar), Charaideo (Ahom royalty center with Moidams royal burial mounds), Kamrup (ancient temples), Kamrup Metropolitan (Guwahati with Kamakhya Temple). Rich in Ahom heritage and ancient culture.",
                "🌿 **Wildlife Districts:** Golaghat (Kaziranga - one-horned rhinos), Morigaon (Pobitora Wildlife Sanctuary), Tinsukia (Dibru-Saikhowa biodiversity hotspot), Bongaigaon (near Manas National Park), Dima Hasao (Haflong hill station). Perfect for wildlife tourism and nature lovers.",
                "🎭 **Cultural Districts:** Majuli (world's largest river island with Satras), Barpeta (Vaishnav culture hub), Nalbari (handloom tradition), Jorhat (education & literature hub), Kokrajhar (Bodo Territorial Region HQ). Centers of Assamese art, culture, and traditions.",
                "🏞️ **Border Districts:** Bhutan Border - Baksa, Chirang, Udalguri, Tamulpur (newest district). Bangladesh Border - Karimganj, South Salmara-Mankachar. These districts offer eco-tourism, tribal culture, and cross-border trade opportunities.",
                "🌊 **River & Valley Districts:** Dhubri (Brahmaputra river trade), Cachar (Barak Valley heart with Silchar), Hailakandi (multicultural Barak Valley), Goalpara (riverine eco-tourism), Sonitpur (Tezpur with temples), Lakhimpur (Upper Assam agriculture). Rich in river culture and agriculture."
            ],
            general: [
                "🌍 **Assam Overview**: Beautiful state in Northeast India, home to mighty Brahmaputra River, Kaziranga National Park (one-horned rhinoceros), Majuli (world's largest river island). Diverse ethnic communities: Assamese, Bodo, Mising, Karbi, Tiwa, Kuki, Rabha tribes create rich cultural tapestry while maintaining harmony.",
                "🏛️ **Tribal Communities**: **Bodo** (largest tribal community with autonomous council), **Mising** (river island dwellers skilled in fishing and farming), **Karbi** (hill tribe known for traditional crafts), **Tiwa** (ancient community with traditional village councils), **Rabha** (known for traditional medicine and crafts). Each contributes unique cultural elements.",
                "💼 **Economy & Development**: **Tea industry** (major contributor to state economy), **Oil & Gas** (Digboi has Asia's first oil refinery), **Agriculture** (rice, jute, sugarcane production), **Handloom** (traditional textile industry), **Tourism** (growing sector with cultural and eco-tourism opportunities).",
                "🏞️ **Natural Landmarks**: **Brahmaputra River** (major river, lifeline of Assam), **Majuli Island** (world's largest river island), **Kaziranga National Park** (one-horned rhinoceros habitat), **Manas National Park** (UNESCO World Heritage Site), **Pobitora Wildlife Sanctuary** (highest rhino density).",
                "🕉️ **Religious & Cultural Sites**: **Kamakhya Temple** (Shakti Peeth with tantric traditions), **Umananda Temple** (Peacock Island Shiva temple), **Srimanta Sankardev Kalakshetra** (cultural complex), **Majuli Sattras** (Vaishnavite monasteries), **Sivasagar** (Ahom kingdom capital with historical monuments).",
                "📚 **Education & Literature**: **Assamese literature** (rich tradition of poetry and prose), **Universities** (Gauhati University, Dibrugarh University), **Cultural institutions** (Sangeet Natak Akademi, Sahitya Sabha). Modern challenges include flood management, infrastructure development, cultural preservation, while opportunities exist in unexplored tourism potential."
            ]
        };
        
        const categoryResponses = responses[category] || responses.general;
        const randomIndex = Math.floor(Math.random() * categoryResponses.length);
        const response = categoryResponses[randomIndex];
        
        return `📚 Local Guide: ${response}`;
    }

    getDistrictSpecificResponse(question) {
        // Check for "all districts" or "35 districts" query first
        if (question.includes('all') && (question.includes('district') || question.includes('35'))) {
            return `🗺️ All 35 Districts of Assam:

**Border Districts:**
🇧🇹 Bhutan Border: Baksa, Chirang, Udalguri, Tamulpur
🇧🇩 Bangladesh Border: Karimganj, South Salmara-Mankachar

**Major Cities & Cultural Centers:**
🏙️ Kamrup Metropolitan (Guwahati), Cachar (Silchar), Jorhat (Cultural Capital), Dibrugarh (Tea City)

**Complete List (1-35):**
1. Baksa 2. Barpeta 3. Biswanath 4. Bongaigaon 5. Cachar 6. Charaideo 7. Chirang 8. Darrang 9. Dhemaji 10. Dhubri 11. Dibrugarh 12. Dima Hasao 13. Goalpara 14. Golaghat 15. Hailakandi 16. Hojai 17. Jorhat 18. Kamrup 19. Kamrup Metropolitan 20. Karbi Anglong 21. Karimganj 22. Kokrajhar 23. Lakhimpur 24. Majuli 25. Morigaon 26. Nagaon 27. Nalbari 28. Sivasagar 29. Sonitpur 30. South Salmara-Mankachar 31. Tinsukia 32. Udalguri 33. West Karbi Anglong 34. Bajali 35. Tamulpur

**Special Features:**
☕ Tea Districts: Dibrugarh, Golaghat, Jorhat, Tinsukia, Biswanath
🦏 Wildlife: Golaghat (Kaziranga), Morigaon (Pobitora), Tinsukia (Dibru-Saikhowa)
🏛️ Historic: Sivasagar (Ahom Capital), Charaideo (Royal Moidams)
🌍 Unique: Majuli (World's Largest River Island)`;
        }

        const districts = {
            'baksa': '🌲 Baksa district is located near Bhutan border with forests, rivers, and eco-tourism opportunities. It has rich tribal culture, especially Bodo community traditions.',
            'barpeta': '🕉️ Barpeta is the Vaishnav culture hub of Assam with the famous Barpeta Satra. It is an agriculture-based district with deep religious and cultural significance.',
            'biswanath': '🌊 Biswanath district is located along Brahmaputra river side with beautiful tea gardens & temples. Known for its natural beauty and scenic landscapes.',
            'bongaigaon': '🏭 Bongaigaon offers industrial + cultural mix, located near Manas National Park. It serves as an important trade & transport hub in western Assam.',
            'cachar': '🏙️ Cachar is the heart of Barak Valley with Silchar city as its center. It has rich Bengali & Manipuri culture and is the second largest city of Assam.',
            'charaideo': '👑 Charaideo was the Ahom royalty center with famous Moidams (Royal burial mounds). It holds immense historic importance as the first capital of Ahom kingdom.',
            'chirang': '🦌 Chirang district is on Indo-Bhutan border with rich forest & wildlife. It is a Bodo-dominated district with significant tribal culture.',
            'darrang': '🧵 Darrang is a rural & agricultural area famous for handloom & crafts. It showcases beautiful cultural diversity and traditional Assamese lifestyle.',
            'dhemaji': '🌾 Dhemaji is a flood-prone area with agriculture-based economy. It has rich Mising tribal culture and is known for traditional farming practices.',
            'dhubri': '🚢 Dhubri in western Assam is famous for Brahmaputra river trade. It has significant Muslim cultural influence and historical importance.',
            'dibrugarh': '☕ Dibrugarh is the Tea City of India with major oil & gas industry. It serves as an important education hub in upper Assam.',
            'dima hasao': '⛰️ Dima Hasao is Assam\'s hill district with Haflong hill station. It offers tribal & scenic region with beautiful landscapes and cool climate.',
            'goalpara': '🏞️ Goalpara is a riverine district famous for eco-tourism and historical temples. It offers beautiful natural landscapes along river systems.',
            'golaghat': '🦏 Golaghat houses the famous Kaziranga National Park with extensive tea estates. It is a major center for wildlife tourism in Assam.',
            'hailakandi': '🐟 Hailakandi in Barak Valley is known for agriculture & fisheries. It has a multicultural population with diverse communities.',
            'hojai': '🤝 Hojai district is known for religious harmony with paper & trade activities. It holds a strategic central Assam location.',
            'jorhat': '📚 Jorhat is the cultural capital of Assam and Majuli access point. It is a major education & literature hub with rich cultural heritage.',
            'kamrup': '🏛️ Kamrup is rural area with ancient temples and agriculture-based economy. It has historical significance with many old temples and cultural sites.',
            'kamrup metropolitan': '🏙️ Kamrup Metropolitan includes Guwahati city, the commercial & IT hub of Assam. It houses the famous Kamakhya Temple.',
            'karbi anglong': '🏔️ Karbi Anglong is the largest district with hills, forests, and wildlife. It has rich Karbi tribal culture and natural beauty.',
            'karimganj': '🌏 Karimganj on Bangladesh border is important for Barak Valley trade. It has multilingual culture with diverse communities.',
            'kokrajhar': '🏛️ Kokrajhar is the Bodo Territorial Region headquarters with political & cultural importance. It has significant forest reserves.',
            'lakhimpur': '🌊 Lakhimpur in Upper Assam focuses on agriculture & rivers. It is a flood-affected region with traditional farming communities.',
            'majuli': '🌍 Majuli is the world\'s largest river island with Satras & Vaishnav culture. It is a major center for cultural tourism and traditional arts.',
            'morigaon': '🦏 Morigaon houses Pobitora Wildlife Sanctuary famous for one-horned rhinos. It has beautiful wetlands and wildlife diversity.',
            'nagaon': '🏛️ Nagaon in central Assam has important historical sites. It is known for education & farming with cultural significance.',
            'nalbari': '🎭 Nalbari is a cultural & spiritual district with famous Nalbari Satra. It has strong handloom tradition and cultural heritage.',
            'sivasagar': '🏰 Sivasagar was the Ahom dynasty capital with Rang Ghar and Talatal Ghar monuments. It has incredibly rich history and architecture.',
            'sonitpur': '🏛️ Sonitpur includes Tezpur town, famous for tourism & temples. It is a beautiful river & forest region with cultural sites.',
            'south salmara-mankachar': '🌊 South Salmara-Mankachar on Bangladesh border has riverine lifestyle. It is agriculture-based with traditional communities.',
            'tinsukia': '🛢️ Tinsukia combines tea + oil industry with Dibru-Saikhowa National Park. It is a major biodiversity hotspot in upper Assam.',
            'udalguri': '🏔️ Udalguri in Bhutan foothills is perfect for eco-tourism. It has rich Bodo culture and natural beauty.',
            'west karbi anglong': '🌲 West Karbi Anglong is a hill & forest region with tribal lifestyle. It is less urbanized with traditional communities.',
            'bajali': '🌾 Bajali is a newly formed district with agriculture-based economy. It has deep cultural roots and traditional farming.',
            'tamulpur': '🆕 Tamulpur is the newest district on Bhutan border. It has great eco & rural tourism potential with natural beauty.'
        };

        for (const [district, info] of Object.entries(districts)) {
            if (question.includes(district)) {
                return info;
            }
        }
        
        return null;
    }

    getFestivalSpecificResponse(question) {
        const festivals = {
            'bihu': `🎉 **BIHU - The Most Important Festival of Assam**

Bihu represents Assamese culture, agriculture, and community life. It is closely connected to the farming cycle and seasons.

**🌸 RONGALI BIHU (Bohag Bihu)**
• **When**: April (mid-April, around 14th-15th)
• **Significance**: Marks the Assamese New Year (1st day of Bohag month)
• **Duration**: 7 days of celebration
• **Activities**: Bihu dance, traditional songs, community gatherings
• **Traditional Clothes**: Mekhela Chador (women), Dhoti-Kurta with Gamosa (men)
• **Special Rituals**: Goru Bihu (cattle worship), Manuh Bihu (human celebration)
• **Traditional Games**: Buffalo fighting, egg fighting, pot breaking

**🍽️ BHOGALI BIHU (Magh Bihu)**
• **When**: January (mid-January, around 14th-15th)
• **Significance**: Festival of food and harvest celebration
• **Duration**: 2-3 days
• **Activities**: Community feasts, traditional cooking competitions
• **Special Structures**: Meji (temporary bamboo and straw huts), Bhelaghar (community houses)
• **Traditional Foods**: Pitha, Laru, Til (sesame) preparations
• **Morning Ritual**: Meji burning at dawn with prayers

**🕯️ KONGALI BIHU (Kati Bihu)**
• **When**: October (mid-October)
• **Significance**: Spiritual and quiet festival, time of scarcity (Kongali means poor/scarce)
• **Activities**: Lighting earthen lamps (Akash Banti) in paddy fields and homes
• **Purpose**: Prayers for good crops and prosperity
• **Foods**: Simple vegetarian meals
• **Cultural Significance**: Remembering ancestors, spiritual reflection`,

            'rongali bihu': `🌸 **RONGALI BIHU (Bohag Bihu) - Assamese New Year**

• **Celebrated**: April (mid-April, around 14th-15th)
• **Significance**: Marks the Assamese New Year (1st day of Bohag month)
• **Duration**: 7 days of continuous celebration
• **Season**: Celebrates the beginning of the agricultural season

**🎭 ACTIVITIES & CELEBRATIONS:**
• Bihu dance performances with traditional music
• Traditional songs and community gatherings
• Young people wear festive traditional clothes
• Community participation across all age groups

**👗 TRADITIONAL ATTIRE:**
• **Women**: Mekhela Chador (traditional two-piece)
• **Men**: Dhoti-Kurta with Gamosa (sacred cloth)

**🐄 SPECIAL RITUALS:**
• **Goru Bihu**: Cattle worship ceremony
• **Manuh Bihu**: Human celebration and social bonding

**🎮 TRADITIONAL GAMES:**
• Buffalo fighting competitions
• Egg fighting contests
• Pot breaking games
• Various folk games and competitions`,

            'bhogali bihu': `🍽️ **BHOGALI BIHU (Magh Bihu) - Festival of Food**

• **Celebrated**: January (mid-January, around 14th-15th)
• **Significance**: Festival of food and harvest celebration
• **Duration**: 2-3 days of feasting and celebration
• **Season**: Marks the end of the harvest season

**🏠 SPECIAL STRUCTURES:**
• **Meji**: Temporary bamboo and straw huts built for the occasion
• **Bhelaghar**: Community houses for gathering and celebration

**🍽️ TRADITIONAL FOODS:**
• **Pitha**: Various types of rice cakes
• **Laru**: Sweet balls made with sesame and coconut
• **Til Preparations**: Sesame-based traditional sweets
• Community preparation and sharing of special dishes

**🌅 MORNING RITUALS:**
• **Meji Burning**: Sacred burning of bamboo structures at dawn
• **Community Prayers**: Collective prayers for prosperity
• **Feast Sharing**: Community feasts and food distribution

**🎉 ACTIVITIES:**
• Traditional cooking competitions
• Community feasts with neighbors and family
• Cultural programs and folk performances`,

            'kongali bihu': `🕯️ **KONGALI BIHU (Kati Bihu) - Spiritual Festival**

• **Celebrated**: October (mid-October)
• **Significance**: Spiritual and quiet festival during scarcity period
• **Meaning**: Kongali means "poor" or "scarce" - time of limited resources
• **Nature**: More contemplative and spiritual compared to other Bihus

**🪔 LIGHTING RITUALS:**
• **Akash Banti**: Lighting earthen lamps in paddy fields
• **Home Lighting**: Earthen lamps lit in homes and courtyards
• **Field Illumination**: Entire agricultural fields lit with traditional lamps

**🙏 SPIRITUAL ACTIVITIES:**
• Prayers offered for good crops and prosperity
• Remembering and honoring ancestors
• Spiritual reflection and meditation
• Community prayers for agricultural success

**🍽️ TRADITIONAL FOODS:**
• Simple vegetarian meals
• Minimal food preparation due to scarcity period
• Focus on spiritual nourishment over elaborate feasting

**🌾 AGRICULTURAL CONNECTION:**
• Prayers for upcoming harvest season
• Protection rituals for crops
• Community solidarity during difficult times`,

            'bohag bihu': `🌸 **BOHAG BIHU (Same as Rongali Bihu)**
This is another name for Rongali Bihu - the Assamese New Year celebration in April. See "Rongali Bihu" for complete details about this 7-day spring festival with Bihu dance, traditional games, and cultural celebrations.`,

            'magh bihu': `🍽️ **MAGH BIHU (Same as Bhogali Bihu)**
This is another name for Bhogali Bihu - the harvest festival in January. See "Bhogali Bihu" for complete details about this food festival with Meji burning, community feasts, and traditional preparations.`,

            'kati bihu': `🕯️ **KATI BIHU (Same as Kongali Bihu)**
This is another name for Kongali Bihu - the spiritual festival in October. See "Kongali Bihu" for complete details about this quiet festival with Akash Banti lamps and prayers for crops.`,
            'ambubachi': '🕉️ **Ambubachi Mela** - Location: Kamakhya Temple, Nilachal Hill, Guwahati. Duration: 4 days in June (during monsoon). Significance: Annual menstruation period of Goddess Kamakhya. Attendees: Over 1 million devotees, sadhus, tantrics. Rituals: Temple remains closed for 3 days, reopens on 4th day. Cultural importance: Celebrates feminine power and fertility. Economic impact: Major boost to local tourism and economy.',
            'jonbeel': '🤝 **Jonbeel Mela** - Location: Dayang Belguri, Morigaon district. Duration: 3 days in January. Unique feature: Ancient barter system (no money exchange). Communities: Tiwa, Karbi, Khasi tribes and plain dwellers. Items traded: Agricultural products, handmade crafts, traditional items. Cultural significance: Promotes inter-community harmony. Historical importance: Continues 500-year-old tradition.',
            'majuli festival': '🌍 **Majuli Festival** - Location: Majuli Island (world\'s largest river island). Duration: 3 days in November. Highlights: Sattriya dance, mask-making, pottery. Cultural focus: Neo-Vaishnavite traditions. Attractions: Satra visits, traditional boat races. Crafts showcase: Handloom weaving, traditional masks.',
            'ali-aye-ligang': '🌱 **Ali-Aye-Ligang** - Community: Mising tribe. Time: February (beginning of spring). Significance: Marks start of sowing season. Duration: 5 days. Rituals: Worship of Donyi-Polo (Sun-Moon), traditional dances. Traditional foods: Apong (rice beer), Purang Apin (special rice cake). Cultural activities: Gumrag dance, traditional songs.',
            'bwisagu': '🎊 **Bwisagu (Bodo New Year)** - Community: Bodo people. Time: April (same time as Rongali Bihu). Duration: 7 days. Traditional dance: Bagurumba dance. Traditional dress: Dokhona (women), Gamsa (men). Special foods: Ondla (rice cake), Narzi (local brew).',
            'kherai puja': '🙏 **Kherai Puja** - Community: Bodo people. Significance: Worship of Bathou deity (supreme god). Rituals: Performed by Doudini (female priest). Offerings: Flowers, rice, local fruits. Cultural importance: Preserves ancient Bodo religious traditions.',
            'doul utsav': '🎨 **Doul Utsav (Assamese Holi)** - Main location: Barpeta (famous for celebrations). Duration: 2 days. Activities: Devotional songs, traditional dances. Religious significance: Celebrates Lord Krishna. Cultural fusion: Combines Vaishnavite traditions with local customs.',
            'chavang kut': '🌾 **Chavang Kut** - Community: Kuki tribe. Time: November (post-harvest). Significance: Thanksgiving for successful harvest. Traditional dance: Kuki folk dances. Community activities: Feast sharing, cultural programs.'
        };

        for (const [festival, info] of Object.entries(festivals)) {
            if (question.includes(festival)) {
                return info;
            }
        }
        
        return null;
    }

    getFoodSpecificResponse(question) {
        const foods = {
            'masor tenga': '🐟 **Masor Tenga** - Assam\'s signature sour fish curry made with fresh fish, tomatoes, and lemon. It\'s light, tangy, and served with rice as a staple dish in every Assamese household. The sourness comes from tomatoes or lemon, making it refreshing and healthy.',
            'khar': '🥬 **Khar** - Traditional alkaline dish made with raw papaya, bottle gourd, and alkaline extract from banana ash. It\'s considered very healthy and is an essential part of Assamese meals. The alkaline nature aids digestion.',
            'aloo pitika': '🥔 **Aloo Pitika** - Mashed potato preparation with mustard oil, onions, green chilies, and sometimes boiled eggs. It\'s a comfort food served with rice and is loved by all age groups in Assam.',
            'pitha': '🍰 **Pitha** - Traditional rice cakes prepared during festivals, especially Bihu. Varieties include Til Pitha (sesame), Ghila Pitha (fried), Sunga Pitha (bamboo cooked), Tekeli Pitha (steamed). Each has unique preparation method and taste.',
            'laru': '🍯 **Laru** - Sweet balls made during festivals. **Til Laru** (sesame balls) and **Narikol Laru** (coconut balls) are most popular. They\'re prepared with jaggery and are considered auspicious during celebrations.',
            'jolpan': '🌾 **Jolpan** - Traditional breakfast items including Chira (flattened rice), Muri (puffed rice), Akhoi, served with curd, jaggery, or milk. It\'s light, nutritious, and perfect for morning meals.',
            'assam tea': '☕ **Assam Tea** - World-famous black tea grown in Jorhat, Dibrugarh, Tezpur regions. Known for its strong, malty flavor and bright color. Prepared with milk and sugar, it\'s offered to guests and consumed multiple times daily.',
            'bhap': '🥄 **Bhap** - Traditional steaming method considered the healthiest way of cooking. Vegetables, fish, and rice are steamed in banana leaves or special containers, preserving nutrients and natural flavors.',
            'jolokia': '🌶️ **Jolokia (Ghost Pepper)** - World\'s hottest chili pepper native to Assam. Used sparingly in cooking for its intense heat and unique flavor. It\'s also used for medicinal purposes and pest control.',
            'tenga': '🍋 **Tenga** - Sour preparation method using tomatoes, lemon, or other souring agents. Creates refreshing dishes perfect for Assam\'s climate. Masor Tenga is the most famous tenga preparation.'
        };

        for (const [food, info] of Object.entries(foods)) {
            if (question.includes(food)) {
                return info;
            }
        }
        
        return null;
    }

    handleQuestion() {
        const questionInput = document.getElementById('questionInput');
        const responseArea = document.getElementById('responseArea');
        const responseText = document.getElementById('responseText');
        const displayedQuestion = document.getElementById('displayedQuestion');
        
        if (!questionInput || !responseArea || !responseText || !displayedQuestion) {
            console.error('Required elements not found');
            return;
        }
        
        const question = questionInput.value.trim();
        
        if (!question) {
            alert('Please enter a question about Assam!');
            return;
        }

        // Display the question
        displayedQuestion.textContent = question;

        // Show loading state
        responseText.innerHTML = '📚 Processing your question...';
        responseArea.classList.remove('hidden');

        // Generate response after short delay for better UX
        setTimeout(() => {
            try {
                const response = this.generateResponse(question);
                this.typeResponse(responseText, response);
                this.addToHistory(question, response);
            } catch (error) {
                console.error('Error generating response:', error);
                responseText.innerHTML = '❌ Sorry, something went wrong. Please try again.';
            }
        }, 500);

        // Clear input
        questionInput.value = '';
    }

    typeResponse(element, text) {
        element.innerHTML = '';
        let index = 0;
        
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
            }
        }, 30);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Assam Guide...');
    try {
        new AssamGuide();
        console.log('Assam Guide initialized successfully');
    } catch (error) {
        console.error('Error initializing Assam Guide:', error);
    }
});