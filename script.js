        const contentArea = document.getElementById('content-area');
        const titleTop = document.querySelector('.title-top');
        const mainH1 = document.querySelector('.main h1');

        function renderHome(){
            mainH1.textContent = 'Trang chủ';
            titleTop.textContent = 'Trang chủ';
            document.title = 'Trang chủ - Học Tin Học NDGB'; // 🟢 thêm dòng này
            contentArea.innerHTML = `<p class="lead">Trang web nhằm cung cấp nền tảng học tin học mọi lúc mọi nơi với mọi công cụ bạn có bên mình. Nội dung học tập, kiểm tra sẽ cập nhật thường xuyên để bạn tiếp thu kiến thức mới một cách hiệu quả hơn.</p>`;
        }

        function slugify(str){
            return String(str)
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-');
        }

        function renderStudy(){
            titleTop.textContent = 'Học bài mới';
            mainH1.textContent = 'Học bài mới'; // 🟢 thêm dòng này để đồng bộ h1
            document.title = 'Học bài mới - Học Tin Học NDGB'; // 🟢 thêm dòng này

            contentArea.innerHTML = `
                <p class="lead fade-in">Trang web nhằm cung cấp nền tảng học tin học mọi lúc mọi nơi với mọi công cụ bạn có bên mình. Nội dung học tập, kiểm tra sẽ cập nhật thường xuyên để bạn tiếp thu kiến thức mới một cách hiệu quả hơn.</p>
            `;

            contentArea.innerHTML = `
                <div class="lessons">
                    <h2>Danh sách bài học</h2>
                    <ul>
                        <li><button class="lesson-btn" data-lesson="Bài 1" data-href="/lesson/bai-1">Bài 1</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 2" data-href="/lesson/bai-2">Bài 2</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 3" data-href="/lesson/bai-3">Bài 3</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 4" data-href="/lesson/bai-4">Bài 4</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 5" data-href="/lesson/bai-5">Bài 5</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 6" data-href="/lesson/bai-6">Bài 6</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 7" data-href="/lesson/bai-7">Bài 7</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 8" data-href="/lesson/bai-8">Bài 8</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 9" data-href="/lesson/bai-1">Bài 9</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 10" data-href="/lesson/bai-2">Bài 10</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 11" data-href="/lesson/bai-3">Bài 11</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 12" data-href="/lesson/bai-4">Bài 12</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 13" data-href="/lesson/bai-5">Bài 13</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 14" data-href="/lesson/bai-6">Bài 14</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 15" data-href="/lesson/bai-7">Bài 15</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 16" data-href="/lesson/bai-8">Bài 16</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 17" data-href="/lesson/bai-1">Bài 17</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 18" data-href="/lesson/bai-2">Bài 18</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 19" data-href="/lesson/bai-3">Bài 19</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 20" data-href="/lesson/bai-4">Bài 20</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 21" data-href="/lesson/bai-5">Bài 21</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 22" data-href="/lesson/bai-6">Bài 22</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 23" data-href="/lesson/bai-7">Bài 23</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 24" data-href="/lesson/bai-8">Bài 24</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 25" data-href="/lesson/bai-1">Bài 25</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 26" data-href="/lesson/bai-2">Bài 26</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 27" data-href="/lesson/bai-3">Bài 27</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 28" data-href="/lesson/bai-4">Bài 28</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 29" data-href="/lesson/bai-5">Bài 29</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 30" data-href="/lesson/bai-6">Bài 30</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 31" data-href="/lesson/bai-7">Bài 31</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài 32" data-href="/lesson/bai-8">Bài 32</button></li>
                    </ul>
                </div>
            `;

            contentArea.querySelectorAll('.lessons ul li').forEach((li, index) => {
                li.style.setProperty('--i', index);
            });

            contentArea.querySelectorAll('.lesson-btn').forEach(btn=>{
                btn.addEventListener('click', ()=>{
                    const lessonName = btn.getAttribute('data-lesson') || btn.textContent;
                    const href = btn.getAttribute('data-href');
                    if(href){
                        if(/^https?:\/\//.test(href)) location.href = href;
                        else if(href.startsWith('/')) location.pathname = href;
                        else location.pathname = href;
                        return;
                    }
                    const slug = slugify(lessonName);
                    location.pathname = '/lesson/' + slug;
                })
            });
        }

        document.querySelectorAll('.nav-item').forEach(item=>{
            item.addEventListener('click',()=>{
                document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
                item.classList.add('active');

                const id = item.getAttribute('data-id');
                if(id === 'study') renderStudy();
                else if(id === 'home') renderHome();
                else {
                    const label = item.querySelector('.label').textContent.trim();
                    mainH1.textContent = label;
                    titleTop.textContent = label;
                    document.title = label + ' - Học Tin Học NDGB'; // 🟢 thêm dòng này
                    contentArea.innerHTML = `<p class="lead">Nội dung cho "${label}" sẽ được cập nhật.</p>`;
                }
            })
        })

        // Thêm function để xử lý animation
        async function switchContent(renderFn) {
            // Fade out current content
            contentArea.style.animation = 'fadeOut 0.2s ease-out forwards';
            
            // Wait for fade out
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Render new content
            renderFn();
            
            // Fade in new content
            contentArea.style.animation = 'pageIn 0.5s ease-out forwards';
        }

        // Cập nhật event listener cho nav-items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', async () => {
                // Remove active class from all items
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                
                // Add active class with delay for smooth transition
                setTimeout(() => {
                    item.classList.add('active');
                }, 50);

                const id = item.getAttribute('data-id');
                
                // Switch content with animation
                if(id === 'study') {
                    await switchContent(renderStudy);
                } else if(id === 'home') {
                    await switchContent(renderHome);
                } else {
                    const label = item.querySelector('.label').textContent.trim();
                    await switchContent(() => {
                        mainH1.textContent = label;
                        titleTop.textContent = label;
                        document.title = label + ' - Học Tin Học NDGB';
                        contentArea.innerHTML = `<p class="lead">Nội dung cho "${label}" sẽ được cập nhật.</p>`;
                    });
                }
            });
        });

        // Thêm các function render mới
        function renderExercise(){
            mainH1.textContent = 'Làm bài tập';
            titleTop.textContent = 'Làm bài tập';
            document.title = 'Làm bài tập - Học Tin Học NDGB';
            
            contentArea.innerHTML = `
                <div class="lessons">
                    <h2>Danh sách bài tập</h2>
                    <ul>
                        <li><button class="lesson-btn" data-lesson="Bài tập 1" data-href="/exercise/bai-tap-1">Bài tập 1: Nhập môn tin học</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài tập 2" data-href="/exercise/bai-tap-2">Bài tập 2: Hệ điều hành</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài tập 3" data-href="/exercise/bai-tap-3">Bài tập 3: Microsoft Word</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài tập 4" data-href="/exercise/bai-tap-4">Bài tập 4: Microsoft Excel</button></li>
                        <li><button class="lesson-btn" data-lesson="Bài tập 5" data-href="/exercise/bai-tap-5">Bài tập 5: Microsoft PowerPoint</button></li>
                    </ul>
                </div>
            `;

            // Thêm animation delay
            contentArea.querySelectorAll('.lessons ul li').forEach((li, index) => {
                li.style.setProperty('--i', index);
            });

            // Thêm xử lý click để chuyển trang
            contentArea.querySelectorAll('.lesson-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const href = btn.getAttribute('data-href');
                    if(href) {
                        location.pathname = href;
                    }
                });
            });
        }

        function renderTest(){
            mainH1.textContent = 'Kiểm tra';
            titleTop.textContent = 'Kiểm tra';
            document.title = 'Kiểm tra - Học Tin Học NDGB';
            
            contentArea.innerHTML = `
                <div class="lessons">
                    <h2>Danh sách bài kiểm tra</h2>
                    <ul>
                        <li><button class="lesson-btn" data-href="/test/kiem-tra-1">Kiểm tra 15 phút: Nhập môn tin học</button></li>
                        <li><button class="lesson-btn" data-href="/test/kiem-tra-2">Kiểm tra 15 phút: Hệ điều hành</button></li>
                        <li><button class="lesson-btn" data-href="/test/kiem-tra-3">Kiểm tra 1 tiết: Microsoft Office</button></li>
                        <li><button class="lesson-btn" data-href="/test/kiem-tra-4">Kiểm tra học kỳ 1</button></li>
                        <li><button class="lesson-btn" data-href="/test/kiem-tra-5">Kiểm tra học kỳ 2</button></li>
                    </ul>
                </div>
            `;

            // Thêm animation delay
            contentArea.querySelectorAll('.lessons ul li').forEach((li, index) => {
                li.style.setProperty('--i', index);
            });

            // Thêm xử lý click để chuyển trang
            contentArea.querySelectorAll('.lesson-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const href = btn.getAttribute('data-href');
                    if(href) {
                        location.pathname = href;
                    }
                });
            });
        }

        // Cập nhật phần xử lý click event
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', async () => {
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                setTimeout(() => item.classList.add('active'), 50);

                const id = item.getAttribute('data-id');
                
                if(id === 'study') await switchContent(renderStudy);
                else if(id === 'home') await switchContent(renderHome);
                else if(id === 'exercise') await switchContent(renderExercise);
                else if(id === 'test') await switchContent(renderTest);
                else {
                    const label = item.querySelector('.label').textContent.trim();
                    await switchContent(() => {
                        mainH1.textContent = label;
                        titleTop.textContent = label;
                        document.title = label + ' - Học Tin Học NDGB';
                        contentArea.innerHTML = `<p class="lead">Nội dung cho "${label}" sẽ được cập nhật.</p>`;
                    });
                }
            });
        });
        window.addEventListener('load', () => {
            const hash = window.location.hash;

            // Bỏ active cũ
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));

            if (hash === '#lesson') {
                document.querySelector('.nav-item[data-id="study"]').classList.add('active');
                renderStudy();
            } 
            else if (hash === '#exercise') {
                document.querySelector('.nav-item[data-id="exercise"]').classList.add('active');
                renderExercise();
            } 
            else if (hash === '#test') {
                document.querySelector('.nav-item[data-id="test"]').classList.add('active');
                renderTest();
            } 
            else {
                document.querySelector('.nav-item[data-id="home"]').classList.add('active');
                renderHome();
            }
        });