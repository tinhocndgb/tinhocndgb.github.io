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
  // ❌ Xóa class active ở tất cả tab trước
  document.querySelectorAll('.nav-item.active').forEach(el =>
    el.classList.remove('active')
  );

  // ✅ Gán class active cho tab "Exercise"
  const exerciseTab = document.querySelector('.nav-item[data-id="exercise"]');
  if (exerciseTab) exerciseTab.classList.add('active');

  // ⚙️ Căn chỉnh thanh tab
  setTimeout(adjustNavAlignment, 300);
  if ('ResizeObserver' in window)
    new ResizeObserver(adjustNavAlignment).observe(document.querySelector('nav'));
  window.addEventListener('resize', adjustNavAlignment);

  // Khởi tạo sự kiện điều hướng + nút học
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

  // 🔀 Xáo trộn thứ tự câu hỏi
  function shuffleQuestions() {
    const parent = document.getElementById('quiz-questions');
    if (!parent) return;
    const arr = Array.from(quizQuestions);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      parent.insertBefore(arr[j], arr[i]);
    }
  }

  // 🧮 Chấm điểm
  function gradeQuiz() {
    if (submitted) return;
    submitted = true;

    let total = 0;
    let correct = 0;

    quizQuestions.forEach(q => {
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
  }

  // ⚙️ Khởi tạo quiz
  function handleQuizInit() {
    if (!quizContainer) return;
    shuffleQuestions();

    // Reset trạng thái
    const options = document.querySelectorAll(
      '.quiz-option input[type="radio"]'
    );
    options.forEach(opt => (opt.checked = false));

    resultBox.style.display = 'none';
    submitted = false;

    submitBtn.addEventListener('click', () => {
      const unanswered = Array.from(quizQuestions).some(
        q => !q.querySelector('input[type="radio"]:checked')
      );
      if (unanswered && !submitted) {
        if (!confirm('Bạn chưa chọn hết các câu trả lời. Vẫn muốn nộp bài?'))
          return;
      }
      gradeQuiz();
    });
  }

  window.handleQuizInit = handleQuizInit;
})();
