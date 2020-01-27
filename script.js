$(document).ready(function() {
	console.log("works");

    let page = 0;
    let canLoadImages = true;

    const addImgages = (per_page) => {
        page += 1;
        let client_id;
        let query;
        $.get(`https://api.unsplash.com/search/photos?query=office&page=${page}&per_page=${per_page}&client_id=c951c92d1564486e8f5adc62ca1fe0f9b05da1800d121fdf1ec049363936cd4c`)
        .done(function(resp) {
            for (let i=0; i< resp.results.length; i++) {
                const image = resp.results[i];
                $("#gallery").append("<div class='image-container'> <img src='"+image.urls.small+"' alt='+image-"+image.id+"'/> </div>");
            }
        })
        .fail(function() {
            console.log("Wystąpił błąd w połączeniu");
        })
        .always(function() {
            // console.log('always')
        });
    }
    addImgages(50);

    const LoadMoreImages = () => {
        $(window).scroll(function() {
            if($(window).scrollTop() + $(window).height() >= $(document).height() - ($(document).height()*0.1)) {
                if (canLoadImages) {
                    addImgages(10);
                    canLoadImages = false;
                }
            } else {
                canLoadImages = true;
            }
        });
    }
	LoadMoreImages();
	
	
});