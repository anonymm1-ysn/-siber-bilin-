function switchTab(tabId) {
    // 1. Tüm içerik bölümlerini gizle
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // 2. Tüm menü butonlarının aktiflik sınıfını kaldır
    const buttons = document.querySelectorAll('.menu-btn');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // 3. Tıklanan bölümü göster
    const activeSection = document.getElementById(tabId);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    // 4. Tıklanan butona aktiflik sınıfı ekle (Event target üzerinden)
    const clickedButton = event.currentTarget;
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
}