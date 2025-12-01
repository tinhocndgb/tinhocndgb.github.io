// ===============================
// 🌟 KHỞI TẠO BIẾN TOÀN CỤC
// ===============================
const contentArea = document.getElementById('content-area');
const mainH1 = document.querySelector('.main h1');

// ===============================
// ⚙️ HÀM DÙNG CHUNG
// ===============================

// Hiệu ứng chuyển trang mượt
async function switchContent(renderFn) {
  contentArea.style.animation = 'fadeOut 0.2s ease-out forwards';
  await new Promise(resolve => setTimeout(resolve, 200));
  renderFn();
  contentArea.style.animation = 'pageIn 0.5s ease-out forwards';
}

// Tạo slug từ tên bài
function slugify(str) {
  return String(str)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Gán hiệu ứng delay từng item
function applyItemDelay() {
  contentArea.querySelectorAll('.lessons ul li').forEach((li, index) => {
    li.style.setProperty('--i', index);
  });
}

// Gán sự kiện click cho danh sách bài học / khối
function applyLessonClicks() {
  contentArea.querySelectorAll('.lesson-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      location.pathname = btn.getAttribute('data-href');
    });
  });
}

// ===============================
// 📄 CÁC TRANG NỘI DUNG
// ===============================

// Trang chủ
function renderHome() {
  document.title = 'Trang chủ - Học Tin Học NDGB';
  contentArea.innerHTML = `<p class="lead">Trang web nhằm cung cấp nền tảng học môn <a>Tin Học</a> mọi lúc mọi nơi với mọi công cụ bạn có bên mình. Nội dung học tập, kiểm tra sẽ cập nhật thường xuyên để bạn tiếp thu kiến thức mới một cách hiệu quả hơn. Bạn có thể liên lạc với chúng tôi qua email: <a href="mailto:tinhoc.ndgb@gmail.com">tinhoc.ndgb@gmail.com</a></p>`;
}

// Học bài mới → chọn lớp
function renderStudy() {
  mainH1.textContent = 'Học bài mới';
  document.title = 'Học bài mới - Học Tin Học NDGB';
  contentArea.innerHTML = `
    <div class="lessons">
      <h2>Chọn lớp học</h2>
      <ul>
        <li><button class="lesson-btn" data-href="/study/lop-10">Lớp 10</button></li>
        <li><button class="lesson-btn" data-href="/study/lop-11">Lớp 11</button></li>
        <li><button class="lesson-btn" data-href="/study/lop-12">Lớp 12</button></li>
      </ul>
    </div>`;
  applyItemDelay();
  applyLessonClicks();
}

// Làm bài tập → chọn khối
function renderExercise() {
  mainH1.textContent = 'Làm bài tập';
  document.title = 'Làm bài tập - Học Tin Học NDGB';
  contentArea.innerHTML = `
    <div class="lessons">
      <h2>Chọn khối làm bài tập</h2>
      <ul>
        <li><button class="lesson-btn" data-href="/exercise/lop-10">Lớp 10</button></li>
        <li><button class="lesson-btn" data-href="/exercise/lop-11">Lớp 11</button></li>
        <li><button class="lesson-btn" data-href="/exercise/lop-12">Lớp 12</button></li>
      </ul>
    </div>`;
  applyItemDelay();
  applyLessonClicks();
}

// Kiểm tra → chọn khối
function renderTest() {
  mainH1.textContent = 'Kiểm tra';
  document.title = 'Kiểm tra - Học Tin Học NDGB';
  contentArea.innerHTML = `
    <div class="lessons">
      <h2>Chọn khối kiểm tra</h2>
      <ul>
        <li><button class="lesson-btn" data-href="/test/lop-10">Lớp 10</button></li>
        <li><button class="lesson-btn" data-href="/test/lop-11">Lớp 11</button></li>
        <li><button class="lesson-btn" data-href="/test/lop-12">Lớp 12</button></li>
      </ul>
    </div>`;
  applyItemDelay();
  applyLessonClicks();
}

// Trang tạm / chưa cập nhật
function renderComingSoon(label) {
  mainH1.textContent = label;
  document.title = `${label} - Học Tin Học NDGB`;
  contentArea.innerHTML = `<p class="lead">Nội dung cho "${label}" sẽ được cập nhật sau.</p>`;
}

// ===============================
// 🧭 CHUYỂN TAB MENU
// ===============================
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', async () => {
    // Xóa & đặt active
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    setTimeout(() => item.classList.add('active'), 50);

    const id = item.getAttribute('data-id');

    if (id === 'home') await switchContent(renderHome);
    else if (id === 'study') await switchContent(renderStudy);
    else if (id === 'exercise') await switchContent(renderExercise);
    else if (id === 'test') await switchContent(renderTest);
    else await switchContent(() => renderComingSoon(item.querySelector('.label').textContent.trim()));
  });
});

// ===============================
// 🧩 TỰ MỞ TAB ĐÚNG KHI LOAD
// ===============================
window.addEventListener('load', () => {
  const hash = window.location.hash;
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(i => i.classList.remove('active'));

  const map = {
    '#lesson': { id: 'lesson', render: renderStudy },
    '#study': { id: 'study', render: renderStudy },
    '#exercise': { id: 'exercise', render: renderExercise },
    '#test': { id: 'test', render: renderTest }
  };

  const selected = map[hash];
  if (selected) {
    document.querySelector(`.nav-item[data-id="${selected.id}"]`).classList.add('active');
    selected.render();
  } else {
    document.querySelector('.nav-item[data-id="home"]').classList.add('active');
    renderHome();
  }

  // ===============================
  // 🔧 CĂN CHỈNH THANH TAB
  // ===============================
  function adjustNavAlignment() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const items = nav.querySelectorAll('.nav-item');
    if (!items.length) return;

    const totalWidth = Array.from(items).reduce((sum, item) => {
      const style = getComputedStyle(item);
      return sum + item.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }, 0);

    nav.style.justifyContent = totalWidth > nav.clientWidth + 1 ? 'flex-start' : 'center';
  }

  // Gọi sau khi render ổn định
  setTimeout(adjustNavAlignment, 300);

  const nav = document.querySelector('nav');
  if (nav && 'ResizeObserver' in window) {
    new ResizeObserver(adjustNavAlignment).observe(nav);
  }

  window.addEventListener('resize', adjustNavAlignment);
  document.querySelectorAll('.nav-item').forEach(item =>
    item.addEventListener('click', adjustNavAlignment)
  );
});
