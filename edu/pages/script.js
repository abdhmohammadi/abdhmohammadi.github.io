
/**
 * تابع کامل برای دریافت آیکون بر اساس پسوند فایل
 * @param {string} type - نوع فایل
 * @returns {string} کد HTML آیکون
 */
function getFileIcon(type) 
{ 
    const iconMap = 
    {
        // PDF
        'pdf': 'fas fa-file-pdf',
        // Word
        'doc': 'fas fa-file-word text-primary',
        'docx':'fas fa-file-word text-primary',
        
        // Excel
        'xls': 'fas fa-file-excel text-success',
        'xlsx':'fas fa-file-excel text-success',
        'csv': 'fas fa-file-csv text-success',
        
        // PowerPoint
        'ppt':  'fas fa-file-powerpoint text-danger',
        'pptx': 'fas fa-file-powerpoint text-danger',
        
        // تصاویر
        'jpg':  'fas fa-file-image text-warning', 
        'jpeg': 'fas fa-file-image text-warning',
        'png': 'fas fa-file-image text-info',
        'gif': 'fas fa-file-image text-success',
        'svg': 'fas fa-file-image text-danger',
        'bmp': 'fas fa-file-image text-secondary',
        
        // ویدئو
        'mp4':  'fas fa-file-video text-purple',
        'avi':  'fas fa-file-video text-purple',
        'mov': 'fas fa-film text-secondary',
        'wmv': 'fas fa-file-video text-purple',
        'flv': 'fas fa-file-video text-purple',
        'mkv': 'fas fa-film text-secondary',
        
        // صدا
        'mp3': 'fas fa-file-audio text-success', 
        'wav': 'fas fa-file-audio text-success', 
        'flac':'fas fa-music text-info',
        'ogg': 'fas fa-file-audio text-success',
        'm4a': 'fas fa-file-audio text-success',
        
        // آرشیو
        'zip':  'fas fa-file-archive text-warning',
        'rar': 'fas fa-file-archive text-warning', 
        '7z': 'fas fa-file-archive text-warning', 
        'tar': 'fas fa-file-archive text-warning',
        'gz': 'fas fa-file-archive text-warning',
        
        // کد
        'js': 'fab fa-js-square text-warning',
        'jsx':'fab fa-react text-info',
        'ts': 'fas fa-file-code text-primary',
        'tsx': 'fas fa-file-code text-primary',
        'py': 'fab fa-python text-primary',
        'java': 'fab fa-java text-danger',
        'php': 'fab fa-php text-info',
        'html':'fab fa-html5',
        'css': 'fab fa-css3-alt text-info',
        'scss':'fab fa-sass text-pink',
        'sass':'fab fa-sass text-pink',
        'json': 'fas fa-file-code text-warning',
        'xml': 'fas fa-file-code text-success',
        'sql': 'fas fa-database text-info',
        
        // طراحی
        'psd': 'fab fa-adobe text-primary',
        'ai': 'fab fa-adobe text-warning',
        'fig':'fab fa-figma text-danger',
        'xd': 'fab fa-adobe text-pink',
        
        // متنی
        'txt':  'fas fa-file-alt text-secondary',
        'rtf': 'fas fa-file-alt text-secondary',
        'md': 'fab fa-markdown text-dark',
        
        // اجرایی
        'exe': 'fas fa-cogs text-dark',
        'msi': 'fas fa-cogs text-dark',
        'dmg': 'fab fa-apple text-dark',
        'pkg': 'fab fa-apple text-dark',
        'apk': 'fab fa-android text-success',
        'ipa': 'fab fa-app-store-ios text-dark',
        'deb': 'fab fa-linux text-dark',
        'rpm': 'fab fa-linux text-dark',
        
        // سیستم
        'iso': 'fas fa-compact-disc text-secondary',
        'dll': 'fas fa-puzzle-piece text-info',
        'sys': 'fas fa-cog text-dark',
        
        // کتاب الکترونیک
        'epub': 'fas fa-book text-info',
        'mobi': 'fas fa-book text-warning',
        'azw': 'fas fa-book text-warning',
        
        // پیش‌فرض
        'default': 'fas fa-file text-muted',
    };
    
    const icon = iconMap[type] || iconMap['default'];
    
    return `<i class="${icon}"></i>`;
    
    }
        // =============================================
        // APPLICATION STATE
        // =============================================
        let currentState = 
        {
            currentTrack: 0, // Feild study
            currentBook: 0,    // Textbook
            userProgress: {},
            quizAnswers: {}
        };

        // =============================================
        // DOM ELEMENTS
        // =============================================
        const tocOverlay = document.getElementById('tocOverlay');
        const tocList = document.getElementById('tocList');
        const bookContent = document.getElementById('bookContent');
        const mainHeader = document.getElementById('mainHeader');
        const currentTrackEl = document.getElementById('currentTrack');
        const currentBookEl = document.getElementById('currentBook');
        const totalPagesEl = document.getElementById('totalPages');
        const progressDots = document.getElementById('progressDots');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const subSpan = document.getElementById('subSpan');
        const modalOverlay = document.getElementById('modalOverlay');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        // global scope data
        window.json_data = JSON.parse("{}");
        window.Tracks = [];  // root items of json data
        
        const config=JSON.parse(`
            {
                "resources":
                {
                    "header":"📚 مجموعه منابع آموزشی و جزوات ریاضیات دبیرستان",
                    "mainsubtitle":"عبدالله محمدی - دبیر ریاضی متوسطه 2 بجنورد",
                    "pagesubtitle":"مجموعه در دسترس است",
                    "emptytitle":"در حال حاضر هیچ مجموعه ای در دسترس نیز",
                    "emptysubtitle": "به زودی مجموعه های آموزشی جدید اضافه خواهند شد"

                },
                "assessments":
                {
                    "header":"📚 مجموعه نمونه سوالات امتحانی ریاضی دبیرستان",
                    "mainsubtitle":"عبدالله محمدی - دبیر ریاضی متوسطه 2، بجنورد",
                    "pagesubtitle":"نمونه سوال در دسترس است",
                    "emptytitle":"هنوز نمونه سوالی اضافه نشده است",
                    "emptysubtitle": "به زودی نمونه سوالات جدید اضافه خواهند شد"
                }
            }`);
        // =============================================
        // INITIALIZATION
        // =============================================
        document.addEventListener('DOMContentLoaded', () => 
        {         
            // detecting input param
            const urlParams = new URLSearchParams(window.location.search);
            window.page = urlParams.get('page');
            
            mainHeader.innerHTML = 
                `
                    <h1>${config[window.page].header}</h1>
                    <div class="subtitle">${config[window.page].mainsubtitle}</div>
                `;
            
            const jsonUrl = `https://raw.githubusercontent.com/abdhmohammadi/website-data/refs/heads/master/edu-${window.page}-data.json`;

            // feching data from website-data repo            
            fetch(jsonUrl).then(response => 
            {
                if (!response.ok) 
                {
                  throw new Error(`Error ${response.status}: can not receive data`);
                }
                return response.json();
            })
            .then(data => 
            {

                window.json_data = data;

                if (data !== null)// && !Array.isArray(data)) 
                {
                    // root items as array
                    window.Tracks = Object.keys(json_data);
                }
                
                subSpan.textContent = window.page === "resources"? "نمونه سوالها":"منابع آموزشی";

                initializeBook();
                
                renderTOC();
                
                // This will cause one of the tracks to be selected each time the browser loads the page,
                // avoiding opening a fixed page.
                loadPage(randomInt(0,window.Tracks.length), currentState.currentBook);

                updateNavigation();

                updateProgressDots();
            });
        });
        
        // Generate a random integer within the range of the number of tracks on this page: 
        function randomInt(min, max) 
        {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        // =============================================
        // CORE FUNCTIONS
        // =============================================
        function initializeBook() 
        {
            // Load saved progress from localStorage
            const savedProgress = localStorage.getItem('mathExamProgress');
            
            if (savedProgress) 
            {
                currentState.userProgress = JSON.parse(savedProgress);
            }
        }
        
        function switch_page()
        {
            window.page = window.page === "resources"? "assessments":"resources";
            
            window.open(`resource-view.html?page=${window.page}`, '_self');
            const currentTheme = localStorage.getItem('theme');
            
            if (currentTheme != 'light')
            {    
                setTheme(window.page === 'resources'? 'dark-green': 'dark');
            }

        }
        function renderTOC() 
        {
            tocList.innerHTML = '';
           
            Object.keys(json_data).forEach((trk, trackIndex) => 
            {
                track = get_track(trackIndex);
                // Create track item
                const trackItem = document.createElement('li');
                trackItem.className = 'toc-item';
                
                const trackLink = document.createElement('a');
                trackLink.href = '#';
                trackLink.className = 'toc-link';
                trackLink.innerHTML = `${track.icon} ${track.title}`;
                trackLink.onclick = (e) => {
                    e.preventDefault();
                    navigateToPage(trackIndex, 0);
                    toggleTOC();
                };
                
                trackItem.appendChild(trackLink);
                
                // Create sub-TextBooks if exist
                if (track.TextBooks && track.TextBooks.length > 0) 
                {
                    const subList = document.createElement('ul');
                    subList.className = 'toc-sub-list';
                    
                    track.TextBooks.forEach((page, bookIndex) => 
                    {
                        const subItem = document.createElement('li');
                        subItem.className = 'toc-sub-item';
                        
                        const subLink = document.createElement('a');
                        subLink.href = '#';
                        subLink.className = 'toc-sub-link';
                        subLink.textContent = page.title;
                        subLink.onclick = (e) => {
                            e.preventDefault();
                            navigateToPage(trackIndex, bookIndex);
                            toggleTOC();
                        };
                        
                        subItem.appendChild(subLink);
                        subList.appendChild(subItem);
                    });
                    
                    trackItem.appendChild(subList);
                }
                
                tocList.appendChild(trackItem);
            });
        }

        function get_track(index)
        {
            return window.json_data[window.Tracks[index]];
        }

        function get_book(trackIndex, bookIndex)
        {
            const track = get_track(trackIndex);

            return track.TextBooks[bookIndex];

        }
        
        function loadPage(trackIndex, bookIndex) 
        {
            
            const track = get_track(trackIndex);
           
            const book = track.TextBooks[bookIndex];

            // Update current state
            currentState.currentTrack = trackIndex;
            currentState.currentBook = bookIndex;
            
            // Update UI
            currentTrackEl.textContent = track.title;
            currentBookEl.textContent = bookIndex + 1;
            totalPagesEl.textContent = track.TextBooks.length;
            // Render book content based on type
            switch(book.type) 
            {
                case 'exam-gallery':
                    renderExamGallery(book);
                    break;
            }
            
            // Update navigation buttons
            updateNavigation();
            
            // Update active TOC links
            updateActiveTOC();
            
            // Save progress
            //saveProgress();
        }

        function renderExamGallery(book) 
        {
            let contentHTML = '';
            let quiz = false;
            
            const cnt = book.assessments.length;
            
            // Page header<!--  -->
            contentHTML += `
                <div class="page-header">
                    <h2>${book.title}</h2>
                    <div>
                        <div class="badge">${get_track_icon(currentState.currentTrack)}</div>
                        <div style="color: var(--text-light);">${cnt} ${config[window.page].pagesubtitle}</div>
                    </div>
                </div>
            `;
            
            // Exam cards
            if (book.assessments && book.assessments.length > 0) 
            {
                contentHTML += '<div class="exam-gallery">';
                
                book.assessments.forEach(exam => 
                {
                    const url = exam.url;

                    const download_state = !url || url.trim() === "" || url === "#" || url.startsWith("javascript:") ? "downloadlink-disabled" : "download-btn";
                    
                    title_disabled_help = download_state === "downloadlink-disabled" ? "به زودی لینک دانلود قرار داده می شود":"دانلود نمونه سوال";
                       
                    img = '';
                    if(exam.image==="" || exam.image ==="#")
                    {
                        img +=`
                            <div style="text-align: center; padding: 50px 20px;">
                                <i class="fas fa-image" style="font-size: 10rem; color: var(--border); margin-bottom: 20px;"></i>
                                <p style="color: var(--text-light);">پیش نمایش در دسترس نیست</p>
                            </div>
                        `;
                    }
                    else
                    {
                         img += `<img src="${exam.image}" alt="${exam.title}" class="exam-card-image"/>`;
                    }   
                       contentHTML += `
                        <div class="exam-card" id="${exam.id}">
                            ${img}
                            <div class="exam-card-content">
                               <div style="display:flex; gap:10px">
                                    ${getFileIcon(exam.type)}
                                    <h3 class="exam-card-title">${exam.title}</h3>
                                </div>

                                <p style="color: var(--text-light);">${exam.description}</p>
                                <div class="exam-card-meta">
                                    <span class="exam-card-date">${exam.date}</span>
                                    <div class="exam-card-actions">

                                        <button class="exam-btn preview-btn" onclick="previewExam('${exam.image}', '${exam.title} - ${exam.description}')">
                                            <i class="fas fa-eye"></i>
                                        </button>

                                        <button type="button"
                                            title="${title_disabled_help}"
                                            class="exam-btn ${download_state}"
                                            onclick="handleDownload('${exam.id}', '${exam.url}')">
                                            <i class="fas fa-download"></i>
                                            دانلود
                                        </button>

                                    </div>

                                </div>
                                
                            </div>
                        </div>
                    `;
                        
                });
                contentHTML += '</div>';
            } 
            else 
            {
                contentHTML += `
                    <div style="text-align: center; padding: 50px 20px;">
                        <i class="fas fa-chalkboard-teacher" style="font-size: 3rem; color: var(--border); margin-bottom: 20px;"></i>
                        <h3 style="color: var(--text-light); margin-bottom: 10px;">${config[window.page].emptytitle}</h3>
                        <p style="color: var(--text-light);">${config[window.page].emptysubtitle}</p>
                    </div>
                `;
            }
            
            /*if(book.content.quizzes && book.content.quizzes.length > 0) 
            {
                quiz = true;
                contentHTML += renderQuiz(book.content.quizzes[0]);
            } else 
            {
                contentHTML += `
                    <div style="text-align: center; padding: 50px 20px;">
                        <i class="fas fa-folder-open" style="font-size: 3rem; color: var(--border); margin-bottom: 20px;"></i>
                        <h3 style="color: var(--text-light); margin-bottom: 10px;">آزمون آنلاین وجود ندارد</h3>
                        <p style="color: var(--text-light);">به زودی آزمونهای جدید اضافه خواهند شد.</p>
                    </div>
                `;
            }*/
            
            bookContent.innerHTML = contentHTML;
            
            // Initialize quiz if exists
            //if (quiz) 
            //{
            //    initializeQuiz(book.content.quizzes[0]);
            //}
        }
               
        function get_track_icon(trackIndex) 
        {
            const track = get_track(trackIndex);
            return track.icon;
        }

        function previewExam(imageUrl, title) 
        {
            modalImage.src = imageUrl;
            modalTitle.textContent = title;
            modalOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeModal() 
        {
            modalOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        function handleDownload(examId, url) 
        {
            // Check if button is disabled
            if (url === '#' || url === '') 
            {
                return; // Do nothing if disabled
            }
            
            // Track the download
            trackDownload(examId);
            
            // Open in new tab
            window.open(url, '_blank');
        }
        
        async function trackDownload(examId)
        {
            try {
                // Initialize downloads array if needed
                if (!currentState.userProgress.downloads) {
                    currentState.userProgress.downloads = [];
                }
                
                // Track that download was initiated
                const downloadRecord = {
                    id: examId,
                    timestamp: new Date().toISOString(),
                    status: 'initiated'
                };
                
                // Add to tracking (allow multiple download attempts)
                currentState.userProgress.downloads.push(downloadRecord);
                
                // Save progress
                //saveProgress();
                
                // Show notification
                showNotification('در حال آماده‌سازی دانلود...');
                
                // Optional: Send analytics to server
                if (typeof sendAnalytics === 'function') {
                    sendAnalytics('download_initiated', { examId });
                }
                
                // Optional: Track actual download success (if you have a way to know)
                return downloadRecord;
                
            } catch (error) {
                console.error('Error tracking download:', error);
                showNotification('خطا در ثبت اطلاعات دانلود', 'error');
            }
        }

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--success);
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 4000;
                font-family: Vazirmatn;
                animation: slideDown 0.3s ease;
            `;
            
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        function updateNavigation() 
        {
            const track = get_track(currentState.currentTrack);
            
            // Update prev button
            prevBtn.disabled = currentState.currentTrack === 0 && currentState.currentBook === 0;
            
            // Update next button
            const isLastPage = currentState.currentBook === track.TextBooks.length - 1;
            const isLastChapter = currentState.currentTrack === window.Tracks.length - 1;
            nextBtn.disabled = isLastPage && isLastChapter;
        }


        function updateActiveTOC() 
        {
            // Update chapter links
            document.querySelectorAll('.toc-link').forEach((link, index) => 
            {
                if (index === currentState.currentChapter) 
                {
                    link.classList.add('active');
                } 
                else 
                {
                    link.classList.remove('active');
                }
            });
            
            // Find the active chapter's sub-list
            const activeChapter = document.querySelectorAll('.toc-item')[currentState.currentChapter];
            if (activeChapter) 
            {
                // Remove active from ALL sub-links first
                document.querySelectorAll('.toc-sub-link').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active to current page's sub-link in active chapter
                const subLinks = activeChapter.querySelectorAll('.toc-sub-link');
                if (subLinks.length > 0 && currentState.currentPage < subLinks.length) {
                    subLinks[currentState.currentPage].classList.add('active');
                }
            }
        }


        function updateProgressDots() 
        {
                    progressDots.innerHTML = '';
                    
                    const track = get_track(currentState.currentTrack);
                    
                    for (let i = 0; i < track.TextBooks.length; i++) {
                        const dot = document.createElement('div');
                        dot.className = 'progress-dot';
                        if (i === currentState.currentBook) {
                            dot.classList.add('active');
                        }
                        dot.onclick = () => navigateToPage(currentState.currentTrack, i);
                        progressDots.appendChild(dot);
                    }
        }

        function navigateToPage(trackIndex, bookIndex) 
        {
            track = get_track(trackIndex);
            
            loadPage(trackIndex, bookIndex);
            updateProgressDots();
        }

        function navigatePage(direction) 
        {
            const track = get_track(currentState.currentTrack);
            let newChapter = currentState.currentTrack;
            let newPage = currentState.currentBook + direction;
            
            if (newPage < 0 && newChapter > 0) 
            {
                // Go to last book of previous track
                newChapter--;
                const prevChapter = get_track(newChapter);
                newPage = prevChapter.TextBooks.length - 1;
            } 
            else if (newPage >= track.TextBooks.length && newChapter < window.Tracks.length - 1)
            {
                // Go to first book of next track
                newChapter++;
                newPage = 0;
            } 
            else if (newPage < 0 || newPage >= track.TextBooks.length) 
            {
                // Invalid navigation
                return;
            }
            
            navigateToPage(newChapter, newPage);
        }

        function toggleTOC() 
        {
            tocOverlay.style.display = tocOverlay.style.display === 'block' ? 'none' : 'block';
            document.body.style.overflow = tocOverlay.style.display === 'block' ? 'hidden' : 'auto';
        }

        function saveProgress() 
        {
            localStorage.setItem('mathExamProgress', JSON.stringify(currentState.userProgress));
        }

        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
                if (tocOverlay.style.display === 'block') {
                    toggleTOC();
                }
            }
        });

        // Close modal when clicking outside
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Close TOC when clicking outside
        tocOverlay.addEventListener('click', (e) => {
            if (e.target === tocOverlay) {
                toggleTOC();
            }
        });

        // Add CSS animation for notifications
        const style = document.createElement('style');

        style.textContent = `
            @keyframes slideDown {
                from { transform: translate(-50%, -100%); opacity: 0; }
                to { transform: translate(-50%, 0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);


               // =============================================
        // THEME FUNCTIONALITY
        // =============================================
        const themeToggle = document.getElementById('themeToggle');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: light)');
        
        // Get saved theme from localStorage or use system preference
        function getSavedTheme() 
        {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'dark-green') 
            {
                return savedTheme;
            }
            return prefersDarkScheme.matches ? 'dark' : 'light';
        }
        
        // Set theme
        function setTheme(theme) 
        {
            document.documentElement.setAttribute('data-theme', theme);
            // Save current theme
            localStorage.setItem('theme', theme);
            
            // Update theme toggle icon
            if (themeToggle) 
            {
                const lightIcon = themeToggle.querySelector('.light-icon');
                const darkIcon = themeToggle.querySelector('.dark-icon');
                if (lightIcon && darkIcon) 
                {
                    lightIcon.style.display = theme === 'dark' || theme ==='dark-green' ? 'block' : 'none';
                    darkIcon.style.display = theme === 'dark' || theme === 'dark-green' ? 'none' : 'block';
                }
            }
        }
        
        // Initialize theme
        const currentTheme = getSavedTheme();
        setTheme(currentTheme);
        
        // Toggle theme when button is clicked
        if (themeToggle) 
        {
            themeToggle.addEventListener('click', () => 
            {
                const currentTheme = document.documentElement.getAttribute('data-theme');

                if (window.page==='resources')
                {    
                    const newTheme = currentTheme === 'light' ? 'dark-green' : 'light';
                    setTheme(newTheme);
                }
                else
                {
                    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                    setTheme(newTheme);
                }
            });
        }
        
        // Listen for system theme changes
        prefersDarkScheme.addEventListener('change', (e) => 
        {
            if (!localStorage.getItem('theme')) 
            {
                if(window.page=== 'assessments')
                    setTheme(e.matches ? 'dark' : 'light');
                else 
                    setTheme(e.matches? 'dark-green': 'light')
            }
        });
