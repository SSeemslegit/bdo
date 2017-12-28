$(document).ready(function () {
    var productsInCome = {};
    var idCurrentAlert = 0;
    var STORAGE_NAME_PRODUCT = 'products';
    var STORAGE_NAME_CURRENT_ID = 'current_id';

    var productsList = JSON.parse(localStorage.getItem(STORAGE_NAME_PRODUCT));
    productsList = productsList ? productsList : {};
    if (productsList) {
        for (var idProduct in productsList) {
            displayProduct(productsList[idProduct]);
        }
    }
    var currentId = localStorage.getItem(STORAGE_NAME_CURRENT_ID);
    currentId = currentId ? currentId : 0;

    $('#add-product').submit(function (e) {
        e.preventDefault();

        if (!$('#add-product-input').val()) {
            return;
        }

        var product = {
            id: currentId,
            name: $('#add-product-input').val()
        };
        productsList[product.id] = product;
        localStorage.setItem(STORAGE_NAME_PRODUCT, JSON.stringify(productsList));
        displayProduct(product);
        currentId++;
        localStorage.setItem(STORAGE_NAME_CURRENT_ID, currentId);
    });

    $('[name="filter-products"]').keyup(function () {
        var filter = $(this).val().trim();
        $('#products > ul > li').show();
        if (filter) {
            $('#products > ul > li:not([data-product-name*="'+filter+'"])').hide();
        }
    });

    function displayProduct(product) {
        var containerProduct = $('<li>');
        containerProduct.attr('data-product-id', product.id)
        containerProduct.attr('data-product-name', product.name.toLowerCase())

        var productNewAlert = $('<button class="btn btn-success btn-sm" style="float: right;/* margin-right: 35px; */margin-left: 5px;">');
        productNewAlert.attr('title', 'Add alert');
        productNewAlert.text('Başlat');
        productNewAlert.click(function () {
            var timeToAlert = 1000 * 54 * 10;
            var containerProductToNewAlert = $(this).parents('li');

            var alertDelete = $('<button class="btn btn-danger btn-sm " style="margin-left: 5px;">');
            alertDelete.text('İptal');
            alertDelete.click(function () {
                var containerAlertToDelete = $(this).parent('li');
                clearTimeout(productsInCome[product.id][containerAlertToDelete.data('alert-id')]);
                containerAlertToDelete.remove();
            });

            var containerAlert = $('<li>');
            containerAlert.attr('data-alert-id', idCurrentAlert);
            var dateWindowOpen = new Date();
            var saat=dateWindowOpen.getHours();
            var dakika=dateWindowOpen.getMinutes();
            var saniye=dateWindowOpen.getSeconds();  
            dateWindowOpen.setSeconds(dateWindowOpen.getSeconds() + timeToAlert / 1000);
            containerAlert.html('<span> <button type="button" class="btn btn-dark btn-sm"> Alarm Saati <span class="badge badge-light">'+dateWindowOpen.toLocaleTimeString()+' </span></button> </span> <button type="button" class="btn btn-secondary btn-sm"> Eklenen Saat <span class="badge badge-light">'+saat+':'+dakika+':'+saniye+'</span></button>');
            containerAlert.append(alertDelete);
            containerProductToNewAlert.find('ul').append(containerAlert);
            if (!productsInCome[product.id]) {
                productsInCome[product.id] = {};
            }

            productsInCome[product.id][idCurrentAlert] = setTimeout(
                function () {
                    $(containerAlert).addClass('window-open');
                    var messageNotification = product.name + ' : ' + dateWindowOpen.toLocaleTimeString();
                    playSound();
                   
                },
                timeToAlert
            );

            idCurrentAlert++;
        });
        containerProduct.append(productNewAlert);

        var productTitle = $('<div style="width: 200px; float: left;">');
        productTitle.text(product.name);
        containerProduct.append(productTitle);

        var productAlerts = $('<ul style=" float: right;margin-right: 350px;list-style: none;">');
        containerProduct.append(productAlerts);

        var productDelete = $('<button class="btn btn-danger btn-sm" style=" float: right;  ">');
        productDelete.text('Sil');
        productDelete.click(function () {
            var containerProductToDelete = $(this).parents('li');
            containerProductToDelete.remove();
            var idProductToDelete = containerProductToDelete.data('product-id');
            for (var idAlert in productsInCome[idProductToDelete]) {
                clearTimeout(productsInCome[idProductToDelete][idAlert]);
            }
            delete productsList[idProductToDelete];
            localStorage.setItem(STORAGE_NAME_PRODUCT, JSON.stringify(productsList));
        });
        containerProduct.append(productDelete);

        $('body #products > ul').append(containerProduct);
    }

    $('#add-horse').click(function () {
        addHorse();
    });



    $('#add-worker').click(function () {
        addWorker();
    });


    function playSound() {
        myAudio = new Audio('beep.mp3');
        var currentRepeat = 0;
        myAudio.play();
        myAudio.addEventListener('ended', function() {
            currentRepeat++;
            if (currentRepeat >= 4) {
                return;
            }
            this.play();
        }, false);
    }
});
