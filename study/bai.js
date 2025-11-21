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
// 🧭 ĐIỀU HƯỚNG THANH TAB
// ===============================
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const id = item.getAttribute('data-id');
    if (id === 'home') location.href = '/index.html';
    else if (id === 'study') location.href = '/index.html#study';
    else if (id === 'exercise') location.href = '/index.html#exercise';
    else if (id === 'test') location.href = '/index.html#test';
  });
});

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
    // Đặt tab "Học bài mới" active nếu đang ở trong /study/
    const studyTab = document.querySelector('.nav-item[data-id="study"]');
    if (studyTab) studyTab.classList.add('active');

    // Căn chỉnh thanh tab (giống trang chủ)
    setTimeout(adjustNavAlignment, 300);
    if ('ResizeObserver' in window)
        new ResizeObserver(adjustNavAlignment).observe(document.querySelector('nav'));
    window.addEventListener('resize', adjustNavAlignment);

    // Khởi tạo các sự kiện
    handleNavigation();
    handleLessonButtons();
});