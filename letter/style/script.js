$(document).ready(function () {

    const envelope = $('#envelope');
    const openBtn = $("#openBtn");
    const resetBtn = $("#resetBtn");
    const prevBtn = $("#prevBtn");
    const nextBtn = $("#nextBtn");
    const navigationArea = $("#navigationArea");
    const progressContainer = $("#progressContainer");
    const progressFill = $("#progressFill");
    const progressText = $("#progressText");
    const audio = $("#sound")[0];
    
    let currentPage = 1;
    const totalPages = 25;
    let isOpen = false;
    let typingTimeout = null;
    let isTyping = false;
    let hasPlayed = false;

    /* ======================
       🎵 Play audio 1 lần
    ====================== */
    function playAudioOnce() {
        if (!hasPlayed && audio) {
            audio.play().catch(()=>{});
            hasPlayed = true;
        }
    }

    /* ======================
       💌 Mở thiệp
    ====================== */
    openBtn.on('click', function () {
        if (isOpen) return;

        envelope.removeClass("close").addClass("open");
        isOpen = true;

        openBtn.hide();
        resetBtn.show();

        playAudioOnce();

        setTimeout(() => {
            typeCurrentPage();
        }, 800);
        
        navigationArea.addClass('show');
        progressContainer.addClass('show');
        updateProgress();
    });

    /* ======================
       🔄 Đóng thiệp
    ====================== */
    resetBtn.on('click', function () {
        envelope.removeClass("open").addClass("close");
        isOpen = false;

        setTimeout(function () {
            currentPage = 1;
            updateActivePage();
            updateProgress();
            updateNavigationButtons();
            resetBtn.hide();
            openBtn.show();
            navigationArea.removeClass('show');
            progressContainer.removeClass('show');
        }, 600);
    });

    /* ======================
       🔘 Nút Trước
    ====================== */
    prevBtn.on('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updateActivePage();
            updateProgress();
            updateNavigationButtons();
        }
    });

    /* ======================
       🔘 Nút Tiếp - ĐÃ SỬA
    ====================== */
    nextBtn.on('click', function() {
        if (currentPage < totalPages) {
            nextPage();  // ✅ SỬA: nextLyric() → nextPage()
        }
    });

    /* ======================
       ⌨️ Phím mũi tên - ĐÃ SỬA
    ====================== */
    $(document).on('keydown', function(e) {
        if (!isOpen) return;
        
        if (e.key === 'ArrowLeft' && currentPage > 1) {
            currentPage--;
            updateActivePage();
            updateProgress();
            updateNavigationButtons();
        } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
            nextPage();  // ✅ SỬA: nextLyric() → nextPage()
        }
    });

    /* ======================
       👉 Click thiệp để qua trang
    ====================== */
    envelope.on('click', function () {
        if (!isOpen || isTyping) return;
        nextPage();
    });

    /* ======================
       📄 Chuyển trang tiếp theo
    ====================== */
    function nextPage() {
        currentPage = currentPage < totalPages ? currentPage + 1 : 1;
        updateActivePage();
        updateProgress();
        updateNavigationButtons();
    }

    /* ======================
       📄 Update trang hiện tại
    ====================== */
    function updateActivePage() {
        $(".lyric-page").removeClass("active");
        $("#page" + currentPage).addClass("active");

        stopTyping();
        typeCurrentPage();

        if (currentPage === totalPages) {
            setTimeout(bigLoveEffect, 1200);
        }
    }

    /* ======================
       ⌨ Typing effect mượt
    ====================== */
    function typeCurrentPage() {
        const activePage = document.querySelector(".lyric-page.active p");
        if (!activePage) return;

        const fullText = activePage.dataset.text || activePage.textContent;

        activePage.dataset.text = fullText;
        activePage.textContent = "";

        let i = 0;
        isTyping = true;

        function typing() {
            if (i < fullText.length) {
                activePage.textContent += fullText.charAt(i);
                i++;
                typingTimeout = setTimeout(typing, 40);
            } else {
                isTyping = false;
            }
        }

        typing();
    }

    function stopTyping() {
        clearTimeout(typingTimeout);
        isTyping = false;
    }

    /* ======================
       💖 Hiệu ứng cuối
    ====================== */
    function bigLoveEffect() {
        const bigHeart = $("<div class='big-heart'>💗</div>");
        $("body").append(bigHeart);

        for (let i = 0; i < 20; i++) {
            const smallHeart = $("<div class='mini-heart'>💖</div>");

            smallHeart.css({
                left: Math.random() * 100 + "vw",
                fontSize: (15 + Math.random() * 25) + "px",
                animationDuration: (3 + Math.random() * 2) + "s"
            });

            $("body").append(smallHeart);

            setTimeout(() => {
                smallHeart.remove();
            }, 5000);
        }

        const loveText = $("<div class='love-text'>anh yeuuu bống👀</div>");
        $("body").append(loveText);

        setTimeout(() => {
            bigHeart.remove();
            loveText.remove();
        }, 3000);
    }

    /* ======================
       📊 Cập nhật Progress Bar
    ====================== */
    function updateProgress() {
        const progress = (currentPage / totalPages) * 100;
        progressFill.css('width', progress + '%');
        progressText.text('Trang ' + currentPage + '/' + totalPages);
    }

    /* ======================
       🔘 Cập nhật trạng thái nút
    ====================== */
    function updateNavigationButtons() {
        prevBtn.prop('disabled', currentPage === 1);
        // Không disable nút "Tiếp" - cho phép luôn bấm
    }

});
