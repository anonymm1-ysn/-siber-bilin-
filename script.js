function switchTab(tabId) {
    // 1. Tüm içerik alanlarını gizle
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // 2. Tüm butonların aktiflik durumunu kaldır
    const buttons = document.querySelectorAll('.menu-btn');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // 3. İlgili hedef sayfayı aktif et
    const targetSection = document.getElementById(tabId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // 4. Tıklanan butonu mavi (aktif) yap
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }
}

// Basit Abonelik Sistemi Pop-up Mekanizması
function openSubscribeModal() {
    let email = prompt("Siber Bilinç bültenine abone olmak ve en yeni siber güvenlik analizlerinden haberdar olmak için e-posta adresinizi yazın:");
    
    if (email) {
        if (email.includes("@") && email.includes(".")) {
            alert("Harika! Aboneliğiniz başarıyla aktif edildi. Güvenli günler dileriz.");
        } else {
            alert("Hata: Lütfen geçerli bir e-posta adresi giriniz.");
        }
    }
}