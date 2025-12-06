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

// CHATBOT AI - FIX CHẶN + DÙNG PUTER.JS FREE API (KHÔNG CẦN KEY, CHẠY NGAY 2025)
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("aiBtn");
  const box = document.getElementById("aiBox");
  const close = document.getElementById("closeAI");
  const input = document.getElementById("aiInput");
  const send = document.getElementById("aiSend");
  const body = document.getElementById("aiBody");

  btn.onclick = () => box.classList.toggle("open");
  close.onclick = () => box.classList.remove("open");

  const addMsg = (text, type) => {
    const div = document.createElement("div");
    div.className = "msg " + type;
    div.innerHTML = text.replace(/\n/g, "<br>");  // Fix line break
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  };

  const sendMsg = async () => {
    const q = input.value.trim();
    if (!q) return;
    addMsg(q, "user");
    input.value = "";

    const typing = addMsg("Đang suy nghĩ...", "bot");
    typing.style.fontStyle = "italic";
    typing.style.color = "#888";

    try {
      // DÙNG PUTER.JS - FREE, NO KEY, OPENAI COMPATIBLE (GPT-4o, Grok, Gemini)
      // Chạy client-side, không bị chặn CORS, ổn định trên GitHub Pages
      const response = await puter.ai.chat({
        model: "gpt-4o",  // Hoặc "grok-beta", "gemini-2.5-pro" - free hết
        messages: [{ role: "user", content: q }],
        temperature: 0.7,
        max_tokens: 500,
        stream: false  // Không stream để đơn giản
      });

      typing.remove();
      let answer = response.choices[0]?.message?.content || "Mình chưa hiểu lắm, bạn hỏi lại nhé! 😊";
      
      // Format answer đẹp: bold, italic, code
      answer = answer
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/```([\s\S]*?)```/g, '<code style="background:#f0f0f0;padding:10px;border-radius:5px;display:block;">$1</code>');
      
      addMsg(answer, "bot");

    } catch (e) {
      // Fallback nếu Puter lag (hiếm lắm): Dùng Hugging Face free inference (cũng no key)
      try {
        const res2 = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inputs: q })
        });
        const data2 = await res2.json();
        let fallbackAnswer = data2[0]?.generated_text || "Oops, kết nối hơi yếu. Thử lại sau 5s nhé! Hoặc hỏi mình về Tin học 10 trực tiếp.";
        typing.remove();
        addMsg(fallbackAnswer, "bot");
      } catch {
        typing.remove();
        addMsg("Mình đang 'suy nghĩ sâu' quá, refresh trang thử lại nha bro! 🚀", "bot");
      }
    }
  };

  send.onclick = sendMsg;
  input.onkeypress = e => { if (e.key === "Enter") sendMsg(); };

  // Bonus: Auto-focus input khi mở chat
  box.addEventListener('transitionend', () => {
    if (box.classList.contains('open')) input.focus();
  });
});