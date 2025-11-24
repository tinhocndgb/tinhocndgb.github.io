// Thay thế toàn bộ nội dung của file bai.js
// ===============================
// 🌟 KHỞI TẠO BIẾN TOÀN CỤC
// ===============================
const contentArea = document.getElementById('content-area');
const mainH1 = document.querySelector('.main h1');

// ===============================
// ⚙️ HÀM DÙNG CHUNG
// ===============================
async function switchContent(renderFn) {
    if (!contentArea) return;
    contentArea.style.animation = 'fadeOut 0.2s ease-out forwards';
    await new Promise(resolve => setTimeout(resolve, 200));
    renderFn();
    contentArea.style.animation = 'pageIn 0.5s ease-out forwards';
}

// ===============================
// 🧭 XỬ LÝ THANH ĐIỀU HƯỚNG (NAV)
// ===============================
function handleNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            switch (id) {
                case 'home': location.href = '/index.html'; break;
                case 'study': location.href = '/index.html#study'; break;
                case 'exercise': location.href = '/index.html#exercise'; break;
                case 'test': location.href = '/index.html#test'; break;
            }
        });
    });
}

// ===============================
// 🧩 CĂN CHỈNH THANH TAB
// ===============================
function adjustNavAlignment() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const items = nav.querySelectorAll('.nav-item');
    const totalWidth = Array.from(items).reduce((sum, item) => {
        const style = getComputedStyle(item);
        return sum + item.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }, 0);

    nav.style.justifyContent = totalWidth > nav.clientWidth + 1 ? 'flex-start' : 'center';
}

function handleLessonButtons() {
    document.querySelectorAll('.lesson-btn').forEach(btn => {
        btn.addEventListener('click', () => location.href = btn.getAttribute('data-href'));
    });
}

window.addEventListener('load', () => {
    const testTab = document.querySelector('.nav-item[data-id="test"]');
    if (testTab) testTab.classList.add('active');

    setTimeout(adjustNavAlignment, 300);
    if ('ResizeObserver' in window) new ResizeObserver(adjustNavAlignment).observe(document.querySelector('nav'));
    window.addEventListener('resize', adjustNavAlignment);

    handleNavigation();
    handleLessonButtons();
    if (typeof handleQuizInit === 'function') handleQuizInit();
});

/* ===================================
   🧠 MODULE QUIZ (LOGIC CHIA PHẦN, XÁO TRỘN & CHẤM ĐIỂM)
=================================== */
(function () {
    const quizContainer = document.getElementById('quiz-container');
    const submitBtn = document.getElementById('submit-quiz');
    const resultBox = document.getElementById('quiz-result');
    let submitted = false;

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    // 💡 HÀM XỬ LÝ INPUT TRẢ LỜI NGẮN (Phần 3)
    function handleShortAnswerInput() {
        // Chỉ cho phép: -, , 0-9
        const allowedCharsRegex = /[^-,.0-9]/g; 
        
        document.querySelectorAll('.short-answer-q input[type="text"]').forEach(input => {
            input.maxLength = 4;
            
            input.addEventListener('input', function() {
                let value = this.value;
                value = value.replace(allowedCharsRegex, '');
                this.value = value;
            });
            
            input.addEventListener('focus', function() {
                if (!submitted) this.classList.add('focused');
            });
            input.addEventListener('blur', function() {
                this.classList.remove('focused');
            });
        });
    }

    // HÀM XỬ LÝ CLICK CHO NÚT ĐÚNG/SAI (Phần 2)
    function handleTrueFalseClick() {
        document.querySelectorAll('.true-false-q .tf-controls button').forEach(button => {
            button.addEventListener('click', function() {
                if (submitted) return;
                const item = this.closest('.true-false-item');
                
                item.removeAttribute('data-selected-tf');
                item.setAttribute('data-selected-tf', this.getAttribute('data-value'));

                item.querySelectorAll('.tf-controls button').forEach(btn => {
                    btn.classList.remove('selected-true', 'selected-false');
                });

                if (this.getAttribute('data-value') === 'T') {
                    this.classList.add('selected-true');
                } else {
                    this.classList.add('selected-false');
                }
            });
        });
    }

    // HÀM XỬ LÝ HIỆU ỨNG CHỌN TRẮC NGHIỆM (Phần 1)
    function handleSelectionEffect() {
        document.querySelectorAll('.quiz-option input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const quizOptions = this.closest('.quiz-options');
                if (quizOptions) {
                    quizOptions.querySelectorAll('.quiz-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    this.closest('.quiz-option').classList.add('selected');
                }
            });
        });
    }

    // 💡 HÀM XÁO TRỘN & CHIA PHẦN
    function shuffleQuestions() {
        const parent = document.getElementById('quiz-questions');
        if (!parent) return;

        const listPart1 = Array.from(document.querySelectorAll('.quiz-q:not(.essay-q)')); // Trắc nghiệm (ABCD) - Loại bỏ essay-q nếu lỡ trùng class
        const listPart2 = Array.from(document.querySelectorAll('.true-false-q')); // Đúng Sai
        const listPart3 = Array.from(document.querySelectorAll('.short-answer-q')); // Trả lời ngắn
        const listPart4 = Array.from(document.querySelectorAll('.essay-q')); // Tự luận

        shuffleArray(listPart1);
        shuffleArray(listPart2);
        shuffleArray(listPart3);
        shuffleArray(listPart4);

        parent.innerHTML = "";
        let globalIndex = 1;

        // --- RENDER PHẦN 1: TRẮC NGHIỆM ---
        if (listPart1.length > 0) {
            const header1 = document.createElement('h3');
            header1.className = 'part-header';
            header1.innerText = "PHẦN 1. TRẮC NGHIỆM NHIỀU LỰA CHỌN";
            parent.appendChild(header1);

            listPart1.forEach(q => {
                const title = q.querySelector('.quiz-title');
                if (title) title.textContent = `${globalIndex}. ${title.textContent.replace(/^\d+\.\s*/, "").trim()}`;

                const optionsContainer = q.querySelector('.quiz-options');
                if (optionsContainer) {
                    const opts = Array.from(optionsContainer.children);
                    shuffleArray(opts);
                    opts.forEach((opt, i) => {
                        const input = opt.querySelector('input[type=radio]');
                        if (input) input.name = `q${globalIndex}`;
                        
                        const label = opt.querySelector('label');
                        if (label) {
                            label.innerHTML = label.innerHTML.replace(/^[A-D]\.\s*/, '');
                            label.innerHTML = `<b>${String.fromCharCode(65 + i)}. </b>` + label.innerHTML;
                        }
                    });
                    optionsContainer.innerHTML = "";
                    opts.forEach(o => optionsContainer.appendChild(o));
                }
                parent.appendChild(q);
                globalIndex++;
            });
        }

        // --- RENDER PHẦN 2: ĐÚNG SAI ---
        if (listPart2.length > 0) {
            const header2 = document.createElement('h3');
            header2.className = 'part-header';
            header2.innerText = "PHẦN 2. TRẮC NGHIỆM ĐÚNG SAI";
            parent.appendChild(header2);

            listPart2.forEach(q => {
                const title = q.querySelector('h4');
                if (title) title.textContent = `${globalIndex}. ${title.textContent.replace(/^\d+\.\s*/, "").trim()}`;

                const listContainer = q.querySelector('.true-false-list');
                if (listContainer) {
                    const items = Array.from(listContainer.querySelectorAll('.true-false-item'));
                    shuffleArray(items);

                    items.forEach((item, i) => {
                        const textSpan = item.querySelector('.true-false-item-text');
                        if (textSpan) {
                            const content = textSpan.textContent.replace(/^[a-z]\.\s*/, '').trim();
                            textSpan.textContent = `${String.fromCharCode(97 + i)}. ${content}`;
                        }
                        listContainer.appendChild(item);
                    });
                }

                parent.appendChild(q);
                globalIndex++;
            });
        }
        
        // --- RENDER PHẦN 3: TRẢ LỜI NGẮN ---
        if (listPart3.length > 0) {
            const header3 = document.createElement('h3');
            header3.className = 'part-header';
            header3.innerText = "PHẦN 3. TRẢ LỜI NGẮN";
            parent.appendChild(header3);

            listPart3.forEach(q => {
                const title = q.querySelector('.quiz-title');
                if (title) title.textContent = `${globalIndex}. ${title.textContent.replace(/^\d+\.\s*/, "").trim()}`;
                
                const input = q.querySelector('input[type="text"]');
                if (input) input.name = `q${globalIndex}-short`;
                
                parent.appendChild(q);
                globalIndex++;
            });
        }

        // --- RENDER PHẦN 4: TỰ LUẬN ---
        if (listPart4.length > 0) {
            const header4 = document.createElement('h3');
            header4.className = 'part-header';
            header4.innerText = "PHẦN 4. TỰ LUẬN";
            parent.appendChild(header4);

            listPart4.forEach(q => {
                const title = q.querySelector('.quiz-title');
                if (title) title.textContent = `${globalIndex}. ${title.textContent.replace(/^\d+\.\s*/, "").trim()}`;
                
                const textarea = q.querySelector('textarea');
                if (textarea) textarea.name = `q${globalIndex}-essay`;
                
                parent.appendChild(q);
                globalIndex++;
            });
        }
    }


    // 🧮 HÀM CHẤM ĐIỂM
    function gradeQuiz() {
        if (submitted) return;
        submitted = true;

        let currentScore = 0;
        let maxScore = 0; // Điểm tối đa của các phần TỰ ĐỘNG CHẤM

        const allQuestions = document.querySelectorAll('#quiz-questions > div');

        allQuestions.forEach(q => {
            // --- 1. XỬ LÝ TRẮC NGHIỆM (ABCD) ---
            if (q.classList.contains('quiz-q') && !q.classList.contains('essay-q')) {
                const points = parseFloat(q.getAttribute('data-point')) || 0.25;
                maxScore += points;

                const correctAns = q.getAttribute('data-answer');
                const selected = q.querySelector('input[type="radio"]:checked');
                const selectedVal = selected ? selected.value : null;
                
                q.querySelectorAll('.quiz-option').forEach(opt => {
                    const val = opt.querySelector('input').value;
                    opt.classList.add('disabled');
                    if (val === correctAns) opt.classList.add('option-correct');
                    if (selectedVal === val && val !== correctAns) opt.classList.add('option-wrong');
                });

                if (selectedVal === correctAns) currentScore += points;
            }

            // --- 2. XỬ LÝ ĐÚNG / SAI ---
            else if (q.classList.contains('true-false-q')) {
                maxScore += 1.0; // Điểm tối đa cho cả câu lớn
                let correctItemsCount = 0;
                const items = q.querySelectorAll('.true-false-item');

                items.forEach(item => {
                    const correctTF = item.getAttribute('data-correct-tf');
                    const selectedTF = item.getAttribute('data-selected-tf');
                    const buttons = item.querySelectorAll('.tf-controls button');
                    
                    buttons.forEach(btn => {
                        const val = btn.getAttribute('data-value');
                        btn.disabled = true;
                        if (val === correctTF) btn.classList.add('option-correct');
                        if (selectedTF === val && selectedTF !== correctTF) btn.classList.add('option-wrong');
                    });

                    if (selectedTF === correctTF) correctItemsCount++;
                });

                if (correctItemsCount === 1) currentScore += 0.1;
                else if (correctItemsCount === 2) currentScore += 0.25;
                else if (correctItemsCount === 3) currentScore += 0.5;
                else if (correctItemsCount === 4) currentScore += 1.0;
            }
            
            // --- 3. XỬ LÝ TRẢ LỜI NGẮN ---
            else if (q.classList.contains('short-answer-q')) {
                const points = parseFloat(q.getAttribute('data-point')) || 0.5;
                maxScore += points;

                const correctAnsRaw = q.getAttribute('data-answer');
                const input = q.querySelector('input[type="text"]');
                const userAnsRaw = input ? input.value.trim() : "";
                
                const normalizedUserAns = userAnsRaw.replace(/\./g, ',');
                const normalizedCorrectAns = correctAnsRaw.replace(/\./g, ',');
                
                const isCorrect = normalizedUserAns === normalizedCorrectAns; 

                input.disabled = true;
                const resultDisplay = document.createElement('span');
                resultDisplay.style.fontWeight = 'bold';
                resultDisplay.style.marginLeft = '10px';
                
                if (isCorrect) {
                    currentScore += points;
                    input.classList.add('input-correct');
                    resultDisplay.style.color = '#00a956';
                    resultDisplay.textContent = `✅ Đúng (Đáp án: ${correctAnsRaw})`;
                } else {
                    input.classList.add('input-wrong');
                    resultDisplay.style.color = '#e04b4b';
                    resultDisplay.textContent = `❌ Sai (Đáp án đúng: ${correctAnsRaw})`;
                }

                const controls = q.querySelector('.short-answer-controls');
                if (controls) controls.appendChild(resultDisplay);
                
                const explanation = q.querySelector('.explanation');
                if(explanation) explanation.style.display = 'block';
            }

            // --- 4. XỬ LÝ TỰ LUẬN ---
            else if (q.classList.contains('essay-q')) {
                // 🔥 SỬA LỖI TẠI ĐÂY: KHÔNG CỘNG ĐIỂM TỰ LUẬN VÀO maxScore
                // const points = parseFloat(q.getAttribute('data-point')) || 1.0; 
                // maxScore += points; // <-- Đã bỏ dòng này

                const textarea = q.querySelector('textarea');
                
                if (textarea) {
                    textarea.disabled = true;
                    textarea.classList.add('input-locked');
                }
                
                const explanation = q.querySelector('.explanation');
                if (explanation) {
                    explanation.style.display = 'block';
                    const hlTitle = explanation.querySelector('hl');
                    if (!hlTitle) {
                         explanation.innerHTML = '<hl>Đáp án Tham khảo:</hl> ' + explanation.innerHTML;
                    }
                }
            }
        });

        resultBox.style.display = 'block';
        // Làm tròn số điểm để hiển thị đẹp hơn
        currentScore = Math.round(currentScore * 100) / 100;
        maxScore = Math.round(maxScore * 100) / 100;
        
        resultBox.innerText = `Bạn đạt: ${currentScore} / ${maxScore} điểm. (Phần tự luận không được chấm, đáp án đưa ra là để tự đối chiếu và tham khảo.)`;
        
        quizContainer.classList.add('quiz-locked');
        submitBtn.disabled = true;
        submitBtn.style.display = 'none';
        
        document.querySelectorAll('.explanation').forEach(e => e.style.display = 'block');
        
        const nextLessonBtn = document.getElementById('next-lesson');
        const redoQuizBtn = document.getElementById('redo-quiz');
        
        if (nextLessonBtn) nextLessonBtn.style.display = 'inline-block';
        if (redoQuizBtn) redoQuizBtn.style.display = 'inline-block';
    }

    function handleQuizInit() {
        if (!quizContainer) return;

        // Reset Trắc nghiệm
        document.querySelectorAll('.quiz-option input[type="radio"]').forEach(opt => {
            opt.checked = false;
            opt.closest('.quiz-option').classList.remove('selected', 'option-correct', 'option-wrong', 'disabled');
        });
        
        // Reset Đúng/Sai
        document.querySelectorAll('.true-false-q .tf-controls button').forEach(btn => {
            btn.classList.remove('selected-true', 'selected-false', 'option-correct', 'option-wrong');
            btn.disabled = false;
        });
        document.querySelectorAll('.true-false-item').forEach(item => item.removeAttribute('data-selected-tf'));
        
        // Reset Trả lời ngắn (Phần 3)
        document.querySelectorAll('.short-answer-q input[type="text"]').forEach(input => {
            input.value = '';
            input.disabled = false;
            input.classList.remove('input-correct', 'input-wrong', 'focused');
            const controls = input.closest('.short-answer-controls');
            if (controls) {
                 controls.querySelectorAll('span').forEach(span => span.remove());
            }
        });

        // Reset Tự luận (Phần 4)
        document.querySelectorAll('.essay-q textarea').forEach(textarea => {
            textarea.value = '';
            textarea.disabled = false;
            textarea.classList.remove('input-locked');
        });


        document.querySelectorAll('.explanation').forEach(e => e.style.display = 'none');
        document.querySelectorAll('.part-header').forEach(h => h.remove());

        shuffleQuestions();
        handleTrueFalseClick();
        handleSelectionEffect();
        handleShortAnswerInput(); 

        resultBox.style.display = 'none';
        submitted = false;

        // Đặt lại trạng thái hiển thị của các nút
        submitBtn.style.display = 'inline-block';
        submitBtn.disabled = false;
        
        const nextLessonBtn = document.getElementById('next-lesson');
        const redoQuizBtn = document.getElementById('redo-quiz');
        
        if (nextLessonBtn) nextLessonBtn.style.display = 'none';
        if (redoQuizBtn) redoQuizBtn.style.display = 'none';

        submitBtn.onclick = function() {
            const unansweredQuizQ = Array.from(document.querySelectorAll('.quiz-q:not(.essay-q)')).some(
                q => !q.querySelector('input[type="radio"]:checked')
            );
            
            const unansweredTFQ = Array.from(document.querySelectorAll('.true-false-item')).some(
                item => !item.hasAttribute('data-selected-tf')
            );
            
            const unansweredShortQ = Array.from(document.querySelectorAll('.short-answer-q input[type="text"]')).some(
                input => input.value.trim() === ''
            );

            const unansweredEssayQ = Array.from(document.querySelectorAll('.essay-q textarea')).some(
                textarea => textarea.value.trim() === ''
            );
            
            if ((unansweredQuizQ || unansweredTFQ || unansweredShortQ || unansweredEssayQ) && !submitted) { 
                if (!confirm('Bạn chưa làm hết bài. Bạn vẫn muốn nộp?')) return;
            }
            gradeQuiz();
        };
    }

    window.handleQuizInit = handleQuizInit;
})();