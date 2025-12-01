// ===============================
// 🌟 KHỞI TẠO BIẾN TOÀN CỤC
// ===============================
const contentArea = document.getElementById('content-area');
const mainH1 = document.querySelector('.main h1');

// Gemini API elements
const apiKey = ""; // API Key is empty as Canvas will provide it
const summarizeBtn = document.getElementById('ai-summarize-btn');
const ttsBtn = document.getElementById('ai-tts-btn');
const aiInputText = document.getElementById('ai-input-text');
const aiOutputArea = document.getElementById('ai-output-area');
const loadingSpinner = document.getElementById('loading-spinner');

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

/**
 * Utility to make API call to Gemini with exponential backoff.
 * @param {string} url - The API endpoint URL.
 * @param {object} options - Fetch options (method, headers, body).
 * @param {number} retries - Number of retry attempts.
 * @returns {Promise<Response>}
 */
async function callGeminiApiWithRetry(url, options, retries = 5) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                return response;
            }
            // Throw error for non-successful responses (will be caught below)
            throw new Error(`API failed with status: ${response.status}`);
        } catch (error) {
            if (i === retries - 1) {
                console.error("Gemini API call failed after multiple retries:", error);
                throw new Error("Không thể kết nối đến dịch vụ AI. Vui lòng thử lại sau.");
            }
            // Exponential backoff
            const delay = Math.pow(2, i) * 1000;
            console.warn(`Retry attempt ${i + 1} failed. Retrying in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// ===============================
// 🧠 TÍNH NĂNG 1: TÓM TẮT KHÁI NIỆM (TEXT GENERATION + GROUNDING)
// ===============================

/**
 * Gọi Gemini để tóm tắt một khái niệm sử dụng Google Search Grounding.
 * @param {string} query - Khái niệm cần tóm tắt.
 */
async function generateSummary(query) {
    if (!query) return;

    // Hiển thị loading và vô hiệu hóa nút
    loadingSpinner.classList.remove('hidden');
    aiOutputArea.classList.add('hidden');
    aiOutputArea.innerHTML = '';
    summarizeBtn.disabled = true;
    ttsBtn.disabled = true;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const userQuery = `Dựa trên thông tin hiện có, hãy tóm tắt khái niệm "Tin học 10" về: "${query}". Trả lời bằng tiếng Việt, cung cấp một bản tóm tắt súc tích, dễ hiểu (khoảng 3-4 gạch đầu dòng).`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        tools: [{ "google_search": {} }], // Sử dụng Google Search Grounding
        systemInstruction: {
            parts: [{ text: "Act as a helpful and accurate informatics tutor for 10th-grade students in Vietnam. Provide concise, factual, and easy-to-understand explanations in Vietnamese." }]
        },
    };

    try {
        const response = await callGeminiApiWithRetry(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            const text = candidate.content.parts[0].text;
            let sources = [];
            const groundingMetadata = candidate.groundingMetadata;

            if (groundingMetadata && groundingMetadata.groundingAttributions) {
                sources = groundingMetadata.groundingAttributions
                    .map(attribution => ({
                        uri: attribution.web?.uri,
                        title: attribution.web?.title,
                    }))
                    .filter(source => source.uri && source.title)
                    .slice(0, 3); // Chỉ lấy tối đa 3 nguồn

                let sourcesHtml = sources.map((s, index) =>
                    `<li><a href="${s.uri}" target="_blank" rel="noopener noreferrer">${s.title}</a></li>`
                ).join('');

                aiOutputArea.innerHTML = `
                    <h4>✨ Tóm Tắt Khái Niệm: ${query}</h4>
                    <p>${text.replace(/\n/g, '<br>')}</p>
                    <div style="margin-top: 15px; font-size: 12px; color: var(--muted); border-top: 1px solid #eee; padding-top: 10px;">
                        <strong>Nguồn Tham Khảo:</strong>
                        <ul style="margin-top: 5px; padding-left: 20px;">${sourcesHtml}</ul>
                    </div>
                `;
            } else {
                aiOutputArea.innerHTML = `
                    <h4>✨ Tóm Tắt Khái Niệm: ${query}</h4>
                    <p>${text.replace(/\n/g, '<br>')}</p>
                    <p style="font-size: 12px; color: var(--muted); margin-top: 10px;">(Không có nguồn tham khảo trên web được tìm thấy)</p>
                `;
            }
            aiOutputArea.classList.remove('hidden');

        } else {
            throw new Error("Phản hồi từ AI không hợp lệ.");
        }
    } catch (error) {
        aiOutputArea.innerHTML = `
            <h4>Lỗi!</h4>
            <p style="color: red;">Đã xảy ra lỗi trong quá trình xử lý: ${error.message}</p>
        `;
        aiOutputArea.classList.remove('hidden');
        console.error("Error generating summary:", error);
    } finally {
        loadingSpinner.classList.add('hidden');
        summarizeBtn.disabled = false;
        ttsBtn.disabled = false;
    }
}


// ===============================
// 🔊 TÍNH NĂNG 2: LUYỆN PHÁT ÂM (TEXT TO SPEECH)
// ===============================

// Utilities for PCM to WAV conversion (required for TTS output)

/**
 * Converts a base64 string to an ArrayBuffer.
 * @param {string} base64 - Base64 encoded data string.
 * @returns {ArrayBuffer}
 */
function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Converts PCM (Signed 16-bit) audio data to a standard WAV Blob.
 * @param {Int16Array} pcmData - The raw PCM data array.
 * @param {number} sampleRate - The sample rate.
 * @returns {Blob} The WAV audio blob.
 */
function pcmToWav(pcmData, sampleRate) {
    const numChannels = 1;
    const bytesPerSample = 2; // S16_LE
    const dataLength = pcmData.length * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);
    let offset = 0;

    // RIFF header
    writeString(view, offset, 'RIFF'); offset += 4;
    view.setUint32(offset, 36 + dataLength, true); offset += 4;
    writeString(view, offset, 'WAVE'); offset += 4;

    // FMT sub-chunk
    writeString(view, offset, 'fmt '); offset += 4;
    view.setUint32(offset, 16, true); offset += 4; // Sub-chunk size: 16
    view.setUint16(offset, 1, true); offset += 2;  // Audio format: 1 (PCM)
    view.setUint16(offset, numChannels, true); offset += 2;
    view.setUint32(offset, sampleRate, true); offset += 4;
    view.setUint32(offset, sampleRate * numChannels * bytesPerSample, true); offset += 4; // Byte rate
    view.setUint16(offset, numChannels * bytesPerSample, true); offset += 2; // Block align
    view.setUint16(offset, 16, true); offset += 2; // Bits per sample: 16

    // DATA sub-chunk
    writeString(view, offset, 'data'); offset += 4;
    view.setUint32(offset, dataLength, true); offset += 4;

    // Write the PCM data
    const pcmByteView = new Int16Array(buffer, offset);
    pcmByteView.set(pcmData);

    return new Blob([view], { type: 'audio/wav' });

    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }
}

/**
 * Gọi Gemini để tạo âm thanh TTS và phát.
 * @param {string} text - Văn bản cần chuyển thành giọng nói.
 */
async function generateAudio(text) {
    if (!text) return;

    // Hiển thị loading và vô hiệu hóa nút
    loadingSpinner.classList.remove('hidden');
    aiOutputArea.classList.add('hidden');
    aiOutputArea.innerHTML = '';
    summarizeBtn.disabled = true;
    ttsBtn.disabled = true;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{
            parts: [{ text: text }]
        }],
        generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: "Achird" } // Giọng nói thân thiện
                }
            }
        },
    };

    try {
        const response = await callGeminiApiWithRetry(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        const part = result?.candidates?.[0]?.content?.parts?.[0];
        const audioData = part?.inlineData?.data;
        const mimeType = part?.inlineData?.mimeType;
        
        if (audioData && mimeType && mimeType.startsWith("audio/L16")) {
            // Lấy sample rate từ mime type (ví dụ: audio/L16;rate=24000)
            const match = mimeType.match(/rate=(\d+)/);
            const sampleRate = match ? parseInt(match[1], 10) : 24000; // Default to 24000
            
            const pcmDataBuffer = base64ToArrayBuffer(audioData);
            // API trả về PCM Signed 16-bit
            const pcm16 = new Int16Array(pcmDataBuffer);
            const wavBlob = pcmToWav(pcm16, sampleRate);
            const audioUrl = URL.createObjectURL(wavBlob);

            aiOutputArea.innerHTML = `
                <h4>✨ Phát Âm: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"</h4>
                <audio controls autoplay style="width: 100%;">
                    <source src="${audioUrl}" type="audio/wav">
                    Trình duyệt của bạn không hỗ trợ phần tử audio.
                </audio>
                <p style="font-size: 12px; color: var(--muted); margin-top: 10px;">(Sử dụng giọng AI "Achird".)</p>
            `;
            aiOutputArea.classList.remove('hidden');
            
        } else {
            throw new Error("Không nhận được dữ liệu âm thanh hợp lệ.");
        }
    } catch (error) {
        aiOutputArea.innerHTML = `
            <h4>Lỗi Phát Âm!</h4>
            <p style="color: red;">Đã xảy ra lỗi trong quá trình tạo âm thanh: ${error.message}</p>
        `;
        aiOutputArea.classList.remove('hidden');
        console.error("Error generating audio:", error);
    } finally {
        loadingSpinner.classList.add('hidden');
        summarizeBtn.disabled = false;
        ttsBtn.disabled = false;
    }
}


// ===============================
// 🧭 ĐIỀU HƯỚNG THANH TAB
// ===============================
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const id = item.getAttribute('data-id');
    // Thay đổi hành vi điều hướng (giả định)
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
    const nav = document.querySelector('.main-nav .nav-wrapper');
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

    // Căn giữa nếu tổng chiều rộng các mục nhỏ hơn hoặc bằng chiều rộng thanh điều hướng
    nav.style.justifyContent =
        totalWidth > nav.clientWidth + 1 ? 'flex-start' : 'center';
}

// ===============================
// 🌙 QUẢN LÝ CHẾ ĐỘ SÁNG/TỐI (Dark/Light Mode)
// ===============================

/**
 * Đặt chế độ hiển thị (light hoặc dark) và lưu vào localStorage.
 * @param {string} mode - 'light' hoặc 'dark'. Nếu null, sẽ toggle chế độ hiện tại.
 */
function setMode(mode = null) {
    const body = document.body;
    let currentMode = mode;

    if (!mode) {
        // Toggle mode nếu không có mode nào được truyền vào
        const isDarkMode = body.classList.contains('dark-mode');
        currentMode = isDarkMode ? 'light' : 'dark';
    }

    if (currentMode === 'dark') {
        body.classList.add('dark-mode');
        // Lưu lại lựa chọn của người dùng
        localStorage.setItem('theme-mode', 'dark');
        console.log("Chuyển sang chế độ Tối (Dark Mode)");
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme-mode', 'light');
        console.log("Chuyển sang chế độ Sáng (Light Mode)");
    }
}

/**
 * Khởi tạo chế độ hiển thị khi tải trang.
 */
function initializeMode() {
    const savedMode = localStorage.getItem('theme-mode');

    // Ưu tiên chế độ đã lưu
    if (savedMode) {
        setMode(savedMode);
    } 
    // Nếu chưa lưu, kiểm tra chế độ hệ thống (prefer dark/light)
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setMode('dark');
    } 
    // Mặc định là light mode
    else {
        setMode('light');
    }

    // Lắng nghe thay đổi chế độ hệ thống (chỉ khi chưa có chế độ lưu cục bộ)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (!localStorage.getItem('theme-mode')) {
            setMode(event.matches ? 'dark' : 'light');
        }
    });
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

    // Khởi tạo chế độ sáng/tối
    initializeMode();
    
    // Căn chỉnh thanh tab (giống trang chủ)
    setTimeout(adjustNavAlignment, 300);
    if ('ResizeObserver' in window) {
        new ResizeObserver(adjustNavAlignment).observe(document.querySelector('.main-nav .nav-wrapper'));
    } else {
        window.addEventListener('resize', adjustNavAlignment);
    }
    
    // Gán sự kiện cho các nút bài học
    handleLessonButtons();

    // Gán sự kiện cho các nút AI
    if (summarizeBtn) {
        summarizeBtn.addEventListener('click', () => {
            const query = aiInputText.value.trim();
            if (query) {
                generateSummary(query);
            } else {
                aiOutputArea.classList.remove('hidden');
                aiOutputArea.innerHTML = '<h4>Lưu ý</h4><p>Vui lòng nhập khái niệm hoặc chủ đề bạn muốn tóm tắt.</p>';
            }
        });
    }

    if (ttsBtn) {
        ttsBtn.addEventListener('click', () => {
            const text = aiInputText.value.trim();
            if (text) {
                generateAudio(text);
            } else {
                aiOutputArea.classList.remove('hidden');
                aiOutputArea.innerHTML = '<h4>Lưu ý</h4><p>Vui lòng nhập văn bản bạn muốn nghe phát âm.</p>';
            }
        });
    }
});