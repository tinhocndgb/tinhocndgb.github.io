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
                case 'home':
                    location.href = '/index.html';
                    break;
                case 'study':
                    location.href = '/index.html#study';
                    break;
                case 'exercise':
                    location.href = '/index.html#exercise';
                    break;
                case 'test':
                    location.href = '/index.html#test';
                    break;
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
        return (
            sum +
            item.offsetWidth +
            parseFloat(style.marginLeft) +
            parseFloat(style.marginRight)
        );
    }, 0);

    nav.style.justifyContent =
        totalWidth > nav.clientWidth + 1 ? 'flex-start' : 'center';
}

// ===============================
// 📚 GÁN SỰ KIỆN CHO NÚT BÀI HỌC
// ===============================
function handleLessonButtons() {
    document.querySelectorAll('.lesson-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            location.href = btn.getAttribute('data-href');
        });
    });
}

// ===============================
// 🚀 KHỞI CHẠY SAU KHI TẢI TRANG
// ===============================
window.addEventListener('load', () => {
    // ✅ Đặt tab "Exercise" là active
    const exerciseTab = document.querySelector('.nav-item[data-id="exercise"]');
    if (exerciseTab) exerciseTab.classList.add('active');

    // Căn chỉnh thanh tab
    setTimeout(adjustNavAlignment, 300);
    if ('ResizeObserver' in window)
        new ResizeObserver(adjustNavAlignment).observe(document.querySelector('nav'));
    window.addEventListener('resize', adjustNavAlignment);

    // Gán sự kiện nav + nút bài học
    handleNavigation();
    handleLessonButtons();

    // Khởi tạo quiz nếu có
    if (typeof handleQuizInit === 'function') handleQuizInit();
});

/* ===================================
   🧠 MODULE QUIZ (CÂU HỎI HTML-BASED)
=================================== */
(function () {
    const quizContainer = document.getElementById('quiz-container');
    const quizQuestions = document.querySelectorAll('.quiz-q');
    const submitBtn = document.getElementById('submit-quiz');
    const resultBox = document.getElementById('quiz-result');
    let submitted = false;

    // 🔀 Hàm xáo mảng
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    // 🔀 Xáo trộn thứ tự câu hỏi + đáp án + tự đánh số
    function shuffleQuestions() {
        const parent = document.getElementById('quiz-questions');
        if (!parent) return;

        // Xáo trộn câu hỏi
        const arr = Array.from(quizQuestions);
        shuffleArray(arr);
        parent.innerHTML = "";
        arr.forEach((q, index) => {
            // 🧾 Gán lại số thứ tự câu hỏi
            const title = q.querySelector('.quiz-title');
            if (title) {
                const text = title.textContent.replace(/^\d+\.\s*/, "").trim();
                title.textContent = `${index + 1}. ${text}`;
            }

            // 🔄 Xáo trộn đáp án
            const optionsContainer = q.querySelector('.quiz-options');
            if (optionsContainer) {
                const opts = Array.from(optionsContainer.children);
                shuffleArray(opts);

                // Gán lại name cho input và nhãn A, B, C, D
                opts.forEach((opt, i) => {
                    const input = opt.querySelector('input[type=radio]');
                    if (input) input.name = `q${index + 1}`;
                    const label = opt.querySelector('label');
                    if (label) {
                        label.innerHTML = label.innerHTML.replace(/^[A-D]\.\s*/, '');
                        const optionLetter = String.fromCharCode(65 + i);
                        label.innerHTML = `<b>${optionLetter}. </b>` + label.innerHTML;
                    }
                });

                optionsContainer.innerHTML = "";
                opts.forEach(o => optionsContainer.appendChild(o));
            }

            parent.appendChild(q);
        });
    }

    // 🧮 Chấm điểm
    function gradeQuiz() {
        if (submitted) return;
        submitted = true;

        let total = 0;
        let correct = 0;

        const allQuestions = document.querySelectorAll('.quiz-q');

        allQuestions.forEach(q => {
            total++;
            const correctAns = q.getAttribute('data-answer');
            const selected = q.querySelector('input[type="radio"]:checked');
            const selectedVal = selected ? selected.value : null;
            const options = q.querySelectorAll('.quiz-option');

            options.forEach(opt => {
                const val = opt.querySelector('input').value;
                opt.classList.add('disabled');
                if (val === correctAns) opt.classList.add('option-correct');
                if (selectedVal === val && val !== correctAns)
                    opt.classList.add('option-wrong');
            });

            if (selectedVal === correctAns) correct++;
        });

        resultBox.style.display = 'block';
        resultBox.innerText = `Bạn đạt: ${correct} / ${total} câu đúng.`;
        quizContainer.classList.add('quiz-locked');
        submitBtn.disabled = true;

        // 🧠 Hiện giải thích sau khi nộp bài
        document.querySelectorAll('.explanation').forEach(e => {
            e.style.display = 'block';
        });
    }

    // ⚙️ Khởi tạo quiz
    function handleQuizInit() {
        if (!quizContainer) return;
        shuffleQuestions();

        // Reset trạng thái
        const options = document.querySelectorAll('.quiz-option input[type="radio"]');
        options.forEach(opt => (opt.checked = false));

        resultBox.style.display = 'none';
        submitted = false;

        submitBtn.addEventListener('click', () => {
            const unanswered = Array.from(document.querySelectorAll('.quiz-q')).some(
                q => !q.querySelector('input[type="radio"]:checked')
            );
            if (unanswered && !submitted) {
                if (!confirm('Bạn chưa chọn hết các câu trả lời. Vẫn muốn nộp bài?')) return;
            }
            gradeQuiz();
        });
    }

    window.handleQuizInit = handleQuizInit;
})();
