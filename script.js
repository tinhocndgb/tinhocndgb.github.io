const contentArea = document.getElementById('content-area');
const mainH1 = document.querySelector('.main h1');

// hiệu ứng chuyển trang
async function switchContent(renderFn) {
  contentArea.style.animation = 'fadeOut 0.2s ease-out forwards';
  await new Promise(resolve => setTimeout(resolve, 200));
  renderFn();
  contentArea.style.animation = 'pageIn 0.5s ease-out forwards';
}

// tạo slug từ tên bài
function slugify(str) {
  return String(str)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// ======= CÁC TRANG =======

// Trang chủ
function renderHome() {
  mainH1.textContent = 'Trang chủ';
  document.title = 'Trang chủ - Học Tin Học NDGB';
  contentArea.innerHTML = `
    <p class="lead">Trang web nhằm cung cấp nền tảng học tin học mọi lúc mọi nơi với mọi công cụ bạn có bên mình. 
    Nội dung học tập, kiểm tra sẽ cập nhật thường xuyên để bạn tiếp thu kiến thức mới một cách hiệu quả hơn.</p>`;
}

// Học bài mới → chọn khối
function renderStudy() {
  mainH1.textContent = 'Học bài mới';
  document.title = 'Học bài mới - Học Tin Học NDGB';
  contentArea.innerHTML = `
    <div class="lessons">
      <h2>Chọn lớp học</h2>
      <ul>
        <li><button class="lesson-btn" data-href="/lesson/lop-10">Lớp 10</button></li>
        <li><button class="lesson-btn" data-href="/lesson/lop-11">Lớp 11</button></li>
        <li><button class="lesson-btn" data-href="/lesson/lop-12">Lớp 12</button></li>
      </ul>
    </div>
  `;

  contentArea.querySelectorAll('.lessons ul li').forEach((li, index) => {
    li.style.setProperty('--i', index);
  });

  contentArea.querySelectorAll('.lesson-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      location.pathname = btn.getAttribute('data-href');
    });
  });
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
    </div>
  `;

  contentArea.querySelectorAll('.lessons ul li').forEach((li, index) => {
    li.style.setProperty('--i', index);
  });

  contentArea.querySelectorAll('.lesson-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      location.pathname = btn.getAttribute('data-href');
    });
  });
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
    </div>
  `;

  contentArea.querySelectorAll('.lessons ul li').forEach((li, index) => {
    li.style.setProperty('--i', index);
  });

  contentArea.querySelectorAll('.lesson-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      location.pathname = btn.getAttribute('data-href');
    });
  });
}

// ======= CHUYỂN TAB =======
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', async () => {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    setTimeout(() => item.classList.add('active'), 50);

    const id = item.getAttribute('data-id');

    if (id === 'study') await switchContent(renderStudy);
    else if (id === 'home') await switchContent(renderHome);
    else if (id === 'exercise') await switchContent(renderExercise);
    else if (id === 'test') await switchContent(renderTest);
    else {
      const label = item.querySelector('.label').textContent.trim();
      await switchContent(() => {
        mainH1.textContent = label;
        document.title = label + ' - Học Tin Học NDGB';
        contentArea.innerHTML = `<p class="lead">Nội dung cho "${label}" sẽ được cập nhật.</p>`;
      });
    }
  });
});

// ======= TỰ MỞ TAB ĐÚNG KHI LOAD =======
window.addEventListener('load', () => {
  const hash = window.location.hash;
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));

  if (hash === '#lesson') {
    document.querySelector('.nav-item[data-id="lesson"]').classList.add('active');
    renderStudy();
  } else if (hash === '#exercise') {
    document.querySelector('.nav-item[data-id="exercise"]').classList.add('active');
    renderExercise();
  } else if (hash === '#test') {
    document.querySelector('.nav-item[data-id="test"]').classList.add('active');
    renderTest();
  } else {
    document.querySelector('.nav-item[data-id="home"]').classList.add('active');
    renderHome();
  }

  // ======= TỰ CĂN GIỮA / CĂN TRÁI THANH TAB CHUẨN MỌI THIẾT BỊ =======
  function adjustNavAlignment() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const items = nav.querySelectorAll('.nav-item');
    if (!items.length) return;

    // Tổng chiều rộng thực tế của các tab (bao gồm margin)
    const totalWidth = Array.from(items).reduce((sum, item) => {
      const style = getComputedStyle(item);
      return sum + item.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }, 0);

    // Nếu tổng lớn hơn chiều rộng nav => cần cuộn => căn trái, ngược lại căn giữa
    if (totalWidth > nav.clientWidth + 1) {
      nav.style.justifyContent = 'flex-start';
    } else {
      nav.style.justifyContent = 'center';
    }
  }

  // Đợi layout ổn định hẳn rồi kiểm tra
  window.addEventListener('load', () => {
    // Chạy lần đầu sau khi render xong (delay nhỏ để đảm bảo media query đã áp dụng)
    setTimeout(adjustNavAlignment, 300);

    // Theo dõi thay đổi kích thước nav (khi đổi màn hình hoặc tab)
    const nav = document.querySelector('nav');
    if (nav && 'ResizeObserver' in window) {
      const observer = new ResizeObserver(adjustNavAlignment);
      observer.observe(nav);
    }

    // Gọi lại khi user resize thủ công
    window.addEventListener('resize', adjustNavAlignment);
  });

  // Khi đổi tab, kiểm tra lại
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', adjustNavAlignment);
  });

});
