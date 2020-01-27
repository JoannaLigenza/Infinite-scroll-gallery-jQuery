$(document).ready(function() {
	console.log("works");

    let page = 0;
    let canLoadImages = true;
    let lastScrollTop = 0;

    const addImages = (per_page) => {
        page += 1;
        const selectedValue = $("#select-view option:selected" ).text();
        $.get(`https://api.unsplash.com/search/photos?query=${selectedValue}&page=${page}&per_page=${per_page}&client_id=c951c92d1564486e8f5adc62ca1fe0f9b05da1800d121fdf1ec049363936cd4c`)
        .done(function(resp) {
            for (let i=0; i< resp.results.length; i++) {
                const image = resp.results[i];
                $("#gallery").append("<div class='image-container'> <img src='"+image.urls.small+"' alt='+image-"+image.id+"'/> </div>");
            }
        })
        .fail(function() {
            // console.log('connection error');
            $("#gallery").empty().append('<p>Too many connections. Please try again after 5 minutes</p>');
        })
        .always(function() {
            // console.log('always')
        });
    }
    addImages(30);      

    // load more images at start when resolution is equal or greater than 4k
    if ($(window).height() >= 2160) {
        addImages(30);
        addImages(30);
    } 

    // load new images when handle scroll down
    const handleScroll = () => {
        const scrollNow = $(document).scrollTop();
        if($(window).scrollTop() + $(window).height() >= $(document).height() - ($(document).height()*0.1)) {
            if (canLoadImages) {
                addImages(10);
                canLoadImages = false;
            }
        } else {
            canLoadImages = true;
        }
        if (scrollNow > lastScrollTop) {
            $("header").removeClass("sticky");
        } else {
            $("header").addClass("sticky");
        }
        lastScrollTop = scrollNow;
    }
    

    const addScrollListener = () => {
        $(window).on("scroll", handleScroll);
    }
	addScrollListener();

    const removeScrollListener = () => {
        $(window).off("scroll", handleScroll);
    }

    const addSelectListener = () => {
        $("#select-view").change(function() {
            $("#gallery").empty();
            addImages(30);
        })
    }
    addSelectListener();

    // automatically scroll to top of page
    const scrollUp = () => {
        $('.arrow-up').click(function () {
            $(window).scrollTop();
            $('html, body').animate({
                scrollTop: 0,
            }, 1000);
        });
    }
    scrollUp();

    // automatically scroll to bottom of gallery
    const scrollDown = () => {
        $('.arrow-down').click(() => {
            removeScrollListener();
            $(window).off("scroll")
            addImages(30);
            addImages(30);
            addImages(30);
            setTimeout(animateScrollDown, 500);
            function animateScrollDown() {
                $('html, body').animate({
                    scrollTop: $("#gallery").offset().top + $("#gallery").height() - $(window).height(),
                }, 10000);
                const scrollToBottom = () => {
                    const scrollNow = $(document).scrollTop();
                    if($(window).scrollTop() + $(window).height() === $(document).height()) {
                        $(window).off("scroll", scrollToBottom);
                        addScrollListener();
                        addImages(10);
                    }
                    if (scrollNow > lastScrollTop) {
                        $("header").removeClass("sticky");
                    } else {
                        $("header").addClass("sticky");
                    }
                    lastScrollTop = scrollNow;
                }
                $(window).on("scroll", scrollToBottom);
            }
        });
    }
    scrollDown();
	
	
});