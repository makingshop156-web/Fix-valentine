$(document).ready(function () {

    const envelope = $('#envelope');
    const openBtn = $("#openBtn");
    const resetBtn = $("#resetBtn");
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

        if (isOpen) return; // chống bấm nhanh

        envelope.removeClass("close").addClass("open");
        isOpen = true;

        openBtn.hide();
        resetBtn.show();

        playAudioOnce();

        setTimeout(() => {
            typeCurrentPage();
        }, 800);
    });

    /* ======================
       🔄 Đóng thiệp
    ====================== */
    resetBtn.on('click', function () {

        envelope.removeClass("open").addClass("close");
        isOpen = false;

        currentPage = 1;
        stopTyping();
        updateActivePage();

        resetBtn.hide();
        openBtn.show();
    });

    /* ======================
       👉 Click thiệp để qua trang
    ====================== */
    envelope.on('click', function () {
        if (!isOpen || isTyping) return;
        nextPage();
    });

    function nextPage() {
        currentPage = currentPage < totalPages ? currentPage + 1 : 1;
        updateActivePage();
    }

    /* ======================
       📄 Update trang
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

});
