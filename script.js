const SUPABASE_URL = "https://jsvclgixjhmwzszbshrr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzdmNsZ2l4amhtd3N6YnNocnIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc4MDkzOTIwMCwiZXhwIjoyMDk2NTE5MjAwfQ.xV5K9mS_eX9u5G_UqW_Xy0v-8W8T9e1_K7M3N1O2_R4";

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = localStorage.getItem('siber_user') || null;

// Sayfa yüklenince sistemi hazırla ve buluttan verileri çek
document.addEventListener("DOMContentLoaded", () => {
    updateAuthUI();
    fetchForumPosts(); // Sayfa açılınca küresel verileri getirir
});

function switchTab(tabId) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
    if (window.event && window.event.currentTarget) window.event.currentTarget.classList.add('active');
}

function toggleAuthModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

// Kullanıcı Kayıt / Abone Olma
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

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('siber_user');
    updateAuthUI();
}

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

// 2. KÜRESEL BULUTTAN POSTLARI ÇEKME FONKSİYONU
async function fetchForumPosts() {
    const feed = document.getElementById('forumFeed');
    if (!feed) return;

    feed.innerHTML = "<div style='color: #06b6d4;'>Küresel siber istihbarat akışı yükleniyor...</div>";

    // Buluttaki 'posts' tablosundan tüm verileri kimlik sırasına göre çekiyoruz
    const { data: posts, error } = await _supabase
        .from('posts')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        feed.innerHTML = "<div style='color: #ef4444;'>Veri tabanına bağlanırken hata oluştu!</div>";
        console.error(error);
        return;
    }

    feed.innerHTML = "";
    posts.forEach(post => {
        feed.innerHTML += `
            <div class="card" style="border-left: 3px solid #3b82f6;">
                <div class="forum-meta">Anonymous No.${post.id} --------- ${post.created_at}</div>
                <h4 style="color: #f3f4f6; margin-bottom: 5px;">${post.title}</h4>
                <p style="color: #6b7280; font-size:0.85rem; margin-bottom:10px;">Gönderen: <strong>${post.author}</strong></p>
                <div class="data-row" style="background-color: #0f172a; white-space: pre-wrap;">${post.content}</div>
            </div>
        `;
    });
}

// 3. BULUTA YENİ POST GÖNDERME FONKSİYONU (Gerçek Zamanlı Yazma)
async function submitNewPost() {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const isAnon = document.getElementById('postAnonymous').checked;

    if (!title || !content) {
        alert("Başlık ve içerik boş bırakılamaz!");
        return;
    }

    const authorName = isAnon ? "Anonymous" : currentUser;
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;

    // Bulut veri tabanına satır olarak ekle
    const { error } = await _supabase
        .from('posts')
        .insert([
            { title: title, author: authorName, content: content, created_at: dateStr }
        ]);

    if (error) {
        alert("Gönderi buluta iletilemedi!");
        console.error(error);
        return;
    }

    // Formu temizle ve akışı yenile
    document.getElementById('postTitle').value = "";
    document.getElementById('postContent').value = "";
    
    // Yeni postu çekmek için feed'i güncelle
    await fetchForumPosts();
}