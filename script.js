let currentUser = localStorage.getItem('siber_user') || null;
let forumPosts = JSON.parse(localStorage.getItem('siber_posts')) || [
    { id: 1, title: "Proje Başlatıldı", author: "Anonymous", content: "Siber Bilinç Duvarı canlıya alındı. Veri ihlalleri ve analizler buraya postalanabilir.", date: "03/07/2026 21:30:12" },
    { id: 2, title: "Render Deploy Hatası Çözümü", author: "RootDev", content: "Not Found hatası alanlar index.html ismini kontrol etsin, ana dizinde olmalı.", date: "03/07/2026 21:45:00" }
];

// Sayfa yüklenince sistemi hazırla
document.addEventListener("DOMContentLoaded", () => {
    updateAuthUI();
    renderForum();
});

function switchTab(tabId) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
    if (window.event && window.event.currentTarget) window.event.currentTarget.classList.add('active');
}

// Modal Aç / Kapat
function toggleAuthModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

// Kullanıcı Kayıt / Abone Olma Sistemi
function registerUser() {
    const user = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPass').value.trim();

    if(!user || !pass) {
        alert("Lütfen tüm alanları doldurun!");
        return;
    }

    currentUser = user;
    localStorage.setItem('siber_user', user);
    toggleAuthModal();
    updateAuthUI();
    alert(`Tebrikler ${user}, Siber Bilinç sistemine başarıyla abone oldunuz!`);
}

// Çıkış Yapma
function logoutUser() {
    currentUser = null;
    localStorage.removeItem('siber_user');
    updateAuthUI();
}

// Giriş Durumuna Göre Arayüzü Güncelleme
function updateAuthUI() {
    const authBox = document.getElementById('authBox');
    const closedMsg = document.getElementById('forumClosedMessage');
    const formInputs = document.getElementById('forumFormInputs');

    if (currentUser) {
        authBox.innerHTML = `<span style="color:#10b981; font-weight:bold; margin-right:10px;">👤 ${currentUser}</span><button class="subscribe-btn" style="background-color:#ef4444;" onclick="logoutUser()">Çıkış</button>`;
        if(closedMsg) closedMsg.style.display = 'none';
        if(formInputs) formInputs.style.display = 'block';
    } else {
        authBox.innerHTML = `<button class="subscribe-btn" onclick="toggleAuthModal()">Sisteme Abone Ol</button>`;
        if(closedMsg) closedMsg.style.display = 'block';
        if(formInputs) formInputs.style.display = 'none';
    }
}

// Forum Gönderilerini Ekrana Basma
function renderForum() {
    const feed = document.getElementById('forumFeed');
    if (!feed) return;
    
    feed.innerHTML = "";
    // En yeni gönderiyi en üstte göstermek için ters çeviriyoruz
    [...forumPosts].reverse().forEach(post => {
        feed.innerHTML += `
            <div class="card" style="border-left: 3px solid #3b82f6;">
                <div class="forum-meta">Anonymous No.${post.id} --------- ${post.date}</div>
                <h4 style="color: #f3f4f6; margin-bottom: 5px;">${post.title}</h4>
                <p style="color: #6b7280; font-size:0.85rem; margin-bottom:10px;">Gönderen: <strong>${post.author}</strong></p>
                <div class="data-row" style="background-color: #0f172a; white-space: pre-wrap;">${post.content}</div>
            </div>
        `;
    });
}

// Yeni Post Gönderme
function submitNewPost() {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const isAnon = document.getElementById('postAnonymous').checked;

    if (!title || !content) {
        alert("Başlık ve içerik boş bırakılamaz!");
        return;
    }

    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;

    const newPost = {
        id: forumPosts.length + 1,
        title: title,
        author: isAnon ? "Anonymous" : currentUser,
        content: content,
        date: dateStr
    };

    forumPosts.push(newPost);
    localStorage.setItem('siber_posts', JSON.stringify(forumPosts));
    
    // Formu temizle
    document.getElementById('postTitle').value = "";
    document.getElementById('postContent').value = "";
    
    renderForum();
}