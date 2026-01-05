
        function nextQuestion() 
        {
            const c = currentState.currentTrack;
            const p = currentState.currentBook;
            const quiz = DataTree.Tracks[c].TextBooks[p].content.quizzes[0];
            initializeQuiz(quiz);
        }

        function showHint() {
            const c = currentState.currentTrack;
            const p = currentState.currentBook;
            const quiz = DataTree.Tracks[c].TextBooks[p].content.quizzes[0];
            const currentQuestionIndex = currentState.quizAnswers.currentQuestion || 0;
            const question = quiz.questions[currentQuestionIndex];
            
            alert(`💡 راهنمایی: ${question.hint}`);
        }

        function showQuizResults() {
            const results = currentState.quizAnswers.results || [];
            const correctCount = results.filter(r => r.isCorrect).length;
            const totalCount = results.length;
            const percentage = Math.round((correctCount / totalCount) * 100);
            
            let message = '';
            let icon = '🎉';
            
            if (percentage >= 80) {
                message = 'عالی! شما تسلط خوبی بر مفاهیم دارید.';
                icon = '🏆';
            } else if (percentage >= 60) {
                message = 'خوب است! اما نیاز به مطالعه بیشتری دارید.';
                icon = '👍';
            } else {
                message = 'نیاز به مرور و مطالعه بیشتر دارید.';
                icon = '📚';
            }
            
            document.getElementById('quizQuestions').innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">${icon}</div>
                    <h3 style="color: var(--text-dark); margin-bottom: 15px;">نتیجه آزمون</h3>
                    <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary); margin-bottom: 20px;">
                        ${percentage}%
                    </div>
                    <p style="color: var(--text-light); margin-bottom: 25px;">${correctCount} از ${totalCount} سوال صحیح پاسخ داده‌اید.</p>
                    <p style="color: var(--text-dark); font-weight: 500;">${message}</p>
                    <button class="quiz-btn submit-btn" onclick="restartQuiz()" style="margin-top: 30px;">
                        <i class="fas fa-redo"></i>
                        آزمون مجدد
                    </button>
                </div>
            `;
            
            document.getElementById('quizActions').style.display = 'none';
        }

        function restartQuiz() {
            currentState.quizAnswers = {
                currentQuestion: 0,
                results: [],
                selectedAnswer: null
            };

            const c = currentState.currentTrack;
            const p = currentState.currentBook;
            const quiz = DataTree.Tracks[c].TextBooks[p].content.quizzes[0];
            initializeQuiz(quiz);
            
            // Reset button
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ارسال پاسخ';
            submitBtn.className = 'quiz-btn submit-btn';
            submitBtn.onclick = submitAnswer;
            
            // Enable hint button
            document.getElementById('hintBtn').disabled = false;
            
            document.getElementById('quizActions').style.display = 'flex';
        }

        function updateQuizProgress() 
        {
            const c = currentState.currentTrack;
            const p = currentState.currentBook;
            const quiz = DataTree.Tracks[c].TextBooks[p].content.quizzes[0];
            
            const currentQuestionIndex = currentState.quizAnswers.currentQuestion || 0;
            const progress = (currentQuestionIndex / quiz.questions.length) * 100;
            
            document.getElementById('quizProgressFill').style.width = `${progress}%`;
            document.getElementById('quizProgressText').textContent = 
                `${currentQuestionIndex}/${quiz.questions.length}`;
        }

        
        function renderQuiz(quiz) 
        { 
            return `
                <div class="quiz-section" id="quizSection">
                    <div class="quiz-header">
                        <h3 class="quiz-title">${quiz.title}</h3>
                        <h4 style="color: var(--danger);">نسخه آزمایشی: بخش آزمون در حال توسعه است</h4>
                        <div class="quiz-progress">
                            <span>پیشرفت آزمون:</span>
                            <div class="progress-bar">
                                <div class="progress-fill" id="quizProgressFill"></div>
                            </div>
                            <span id="quizProgressText">0/2</span>
                        </div>
                    </div>
                    <div id="quizQuestions">
                        <!-- Quiz questions will be loaded here -->
                    </div>
                    <div class="quiz-actions" id="quizActions">
                        <button class="quiz-btn hint-btn" id="hintBtn" onclick="showHint()">
                            <i class="fas fa-lightbulb"></i>
                            راهنمایی
                        </button>
                        <button class="quiz-btn submit-btn" id="submitBtn" onclick="submitAnswer()">
                            <i class="fas fa-paper-plane"></i>
                            ارسال پاسخ
                        </button>
                    </div>
                </div>
            `;
        }
       
        function initializeQuiz(quiz) 
        {
            const quizQuestions = document.getElementById('quizQuestions');
            const currentQuestionIndex = currentState.quizAnswers.currentQuestion || 0;
            
            if (currentQuestionIndex < quiz.questions.length) {
                const question = quiz.questions[currentQuestionIndex];
                
                let optionsHTML = '';
                question.options.forEach((option, index) => {
                    optionsHTML += `
                        <div class="quiz-option" onclick="selectAnswer(${index})" id="option-${index}">
                            <div class="option-label">${String.fromCharCode(65 + index)}</div>
                            <span>${option}</span>
                        </div>
                    `;
                });
                
                quizQuestions.innerHTML = `
                    <div class="quiz-question">
                        ${currentQuestionIndex + 1}. ${question.question}
                    </div>
                    <div class="quiz-options">
                        ${optionsHTML}
                    </div>
                `;
                
                // Update progress
                updateQuizProgress();
                
                // Reset selected answer
                currentState.quizAnswers.selectedAnswer = null;
                
                // Tell MathJax to render the new math content
                if (window.MathJax) {
                    MathJax.typesetPromise([quizQuestions]).catch(err => console.error('MathJax typeset error:', err));
                }
            } else {
                // Quiz completed
                showQuizResults();
            }
        }

        function selectAnswer(answerIndex) 
        {
            // Remove selection from all options
            document.querySelectorAll('.quiz-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            // Add selection to chosen option
            document.getElementById(`option-${answerIndex}`).classList.add('selected');
            
            // Store selected answer
            currentState.quizAnswers.selectedAnswer = answerIndex;
        }

        function submitAnswer() 
        {
            const c = currentState.currentTrack;
            const p = currentState.currentBook;
            const quiz = DataTree.Tracks[c].TextBooks[p].content.quizzes[0];
            const currentQuestionIndex = currentState.quizAnswers.currentQuestion || 0;
            const question = quiz.questions[currentQuestionIndex];
            const selectedAnswer = currentState.quizAnswers.selectedAnswer;
            
            if (selectedAnswer === null) {
                alert('لطفاً یک گزینه را انتخاب کنید');
                return;
            }
            
            // Show correct/incorrect feedback
            const options = document.querySelectorAll('.quiz-option');
            options.forEach((option, index) => {
                if (index === question.correctAnswer) {
                    option.classList.add('correct');
                } else if (index === selectedAnswer && index !== question.correctAnswer) {
                    option.classList.add('incorrect');
                }
                option.style.pointerEvents = 'none';
            });
            
            // Store result
            if (!currentState.quizAnswers.results) {
                currentState.quizAnswers.results = [];
            }
            currentState.quizAnswers.results.push({
                questionIndex: currentQuestionIndex,
                selectedAnswer: selectedAnswer,
                isCorrect: selectedAnswer === question.correctAnswer
            });
            
            // Update progress
            currentState.quizAnswers.currentQuestion = currentQuestionIndex + 1;
            
            // Change button to "Next"
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.innerHTML = '<i class="fas fa-arrow-left"></i> سوال بعدی';
            submitBtn.className = 'quiz-btn next-btn';
            submitBtn.onclick = nextQuestion;
            
            // Disable hint button
            document.getElementById('hintBtn').disabled = true;
            
            //saveProgress();
        }

 