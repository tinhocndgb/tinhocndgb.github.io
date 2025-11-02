// Sidebar hoạt động & điều hướng ra trang chủ đúng tab
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const label = item.querySelector('.label').textContent.trim();
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // Tự động về trang chủ và mở tab tương ứng
    const base = window.location.origin + '/index.html';
    if (label === 'Trang chủ') {
      window.location.href = base;
    } 
    else if (label === 'Học bài mới') {
      window.location.href = base + '#lesson';
    } 
    else if (label === 'Làm bài tập') {
      window.location.href = base + '#exercise';
    } 
    else if (label === 'Kiểm tra') {
      window.location.href = base + '#test';
    }
  });
});
