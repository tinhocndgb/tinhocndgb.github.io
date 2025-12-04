// ===============================
// 🌟 KHỞI TẠO BIẾN TOÀN CỤC
// ===============================
const contentArea = document.getElementById('content-area');
const mainH1 = document.querySelector('.main h1');
const homeButtons = document.getElementById('home-buttons');

// Các phần nội dung đã được định nghĩa trong HTML
const studyContent = document.getElementById('study-content');
const exerciseContent = document.getElementById('exercise-content');
const testContent = document.getElementById('test-content');
const comingSoonContent = document.getElementById('coming-soon-content');

// ===============================
// ⚙️ HÀM DÙNG CHUNG
// ===============================

// Hiệu ứng chuyển trang mượt
async function switchContent(tabId, label) {
    // Ẩn tất cả nội dung
    contentArea.style.animation = 'fadeOut 0.2s ease-out forwards';
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Cập nhật tiêu đề
    mainH1.textContent = label;
    document.title = `${label} - Học Tin Học NDGB`;
    
    // Ẩn tất cả nội dung
    [studyContent, exerciseContent, testContent, comingSoonContent].forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    
    // Hiển thị nút trang chủ chỉ khi ở tab home
    if (tabId === 'home') {
        homeButtons.classList.remove('hidden');
        homeButtons.style.opacity = '1';
        contentArea.style.display = 'block';
        contentArea.style.animation = 'pageIn 0.5s ease-out';
    } else {
        homeButtons.classList.add('hidden');
        homeButtons.style.opacity = '0';
        contentArea.style.display = 'none';
    }
    
    // Hiển thị nội dung tương ứng
    let targetContent;
    switch(tabId) {
        case 'study':
            targetContent = studyContent;
            break;
        case 'exercise':
            targetContent = exerciseContent;
            break;
        case 'test':
            targetContent = testContent;
            break;
        default:
            if (tabId !== 'home') {
                targetContent = comingSoonContent;
                const lead = comingSoonContent.querySelector('.lead');
                if (lead) lead.textContent = `Nội dung cho "${label}" sẽ được cập nhật sau.`;
            }
    }
    
    if (targetContent) {
        targetContent.style.display = 'block';
        setTimeout(() => {
            targetContent.classList.add('active');
        }, 10);
        
        // Gán hiệu ứng delay cho các item
        applyItemDelay(targetContent);
    }
}

// Gán hiệu ứng delay từng item
function applyItemDelay(content) {
    if (!content) return;
    content.querySelectorAll('.lessons ul li').forEach((li, index) => {
        li.style.setProperty('--i', index);
    });
}

// Gán sự kiện click cho danh sách bài học / khối
function setupLessonButtons() {
    // Xử lý cho các nút lớp học
    document.querySelectorAll('.lesson-btn').forEach(btn => {
        // Xóa sự kiện cũ trước khi thêm mới
        btn.removeEventListener('click', handleLessonClick);
        btn.addEventListener('click', handleLessonClick);
    });
}

// Hàm xử lý click cho nút lớp học
function handleLessonClick(e) {
    e.preventDefault();
    const href = this.getAttribute('data-href');
    if (href) {
        window.location.href = href;
    }
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
        const label = item.querySelector('.label').textContent.trim();
        
        await switchContent(id, label);
        
        // Thiết lập lại sự kiện cho các nút
        setupLessonButtons();
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
        '#lesson': { id: 'study', label: 'Học bài mới' },
        '#study': { id: 'study', label: 'Học bài mới' },
        '#exercise': { id: 'exercise', label: 'Làm bài tập' },
        '#test': { id: 'test', label: 'Kiểm tra' }
    };

    const selected = map[hash];
    if (selected) {
        document.querySelector(`.nav-item[data-id="${selected.id}"]`).classList.add('active');
        switchContent(selected.id, selected.label);
    } else {
        document.querySelector('.nav-item[data-id="home"]').classList.add('active');
        switchContent('home', 'Trang chủ');
    }
    
    // Thiết lập sự kiện cho tất cả các nút
    setupLessonButtons();

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