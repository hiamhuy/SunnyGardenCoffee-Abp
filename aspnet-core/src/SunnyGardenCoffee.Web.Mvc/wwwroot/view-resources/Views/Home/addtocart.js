var addtocart = {
    init: function () {
        addtocart.addtocartEvent();
    },
    addtocartEvent: function () {
        $('.buy__item').off('click').on('click', function (e) {
            e.preventDefault();
            var btn = $(this);
            var soDienThoai = $('#soDienThoai').val();
            var diaChiNhanHang = $('#diaChiNhan').val();
            var id = btn.data('data');
            if (checkEmpty() == true) {
                $.ajax({
                    type: "GET",
                    method: "GET",
                    url: '/Home/AddThucDon',
                    dataType: "json",
                    data: { Id: id, soDienThoai: soDienThoai, diaChiNhanHang: diaChiNhanHang },
                    success: function (result) {

                        console.log(result);

                        tinhTong(result.result);
                    },
                    error: function (req, status, error) {
                        console.log(status);
                    }

                });
            }
            else {
                console.log("Lỗi");
            }

        });

        function tinhTong(data) {
            var soLuong = $('.count__item');
            var tongTien = $('.total__price');
            if (data) {
                soLuong.text(data.soLuong);
                tongTien.text(data.tongTien + ' đ');
            }
            else {
                soLuong.text('0');
                tongTien.text('0' + ' đ');
            }
        }

        $('.cart_container').off('click').on('click', function (e) {
            e.preventDefault();
            var btn = $(this);
            $.ajax({
                type: "GET",
                url: '/Home/ShowCart',
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function (result) {
                    console.log(result, "cart");
                    getList(result.result);
                },
                error: function (req, status, error) {
                    console.log(status);
                }

            });
        });

        function getList(data) {
            $('#listCart').empty();
            if (data && data.length > 0) {
                data.forEach(x => {
                    let itemDiv = document.createElement('div');
                    itemDiv.className = "item";
                    itemDiv.innerHTML = `
                            <img src='https://localhost:44311/Photos/${x.hinhAnh}' />
                                <div class="info__item">
                                    <div class="name__item">
                                        ${x.thucDonName}
                                    </div>
                                    <div class="box__item">
                                        <div class="price__item">${x.gia}</div>
                                        <div class="buy__item">
                                            <span>x ${x.soLuong}</span>
                                            <span class="remove_item" data-id="${x.id}"><i class="fa-solid fa-trash-can"></i></span>
                                        </div>
                                          
                                    </div>
                            </div>
                        `
                    itemDiv.id = "item" + x.id;
                    $('#listCart').append(itemDiv);
                });
            }
        }

        $('.remove_item').off('click').on('click', function (e) {
            e.preventDefault();
            var btn = $(this);
            var id = btn.data("id");
            $.ajax({
                type: "GET",
                url: '/Home/RemoveProduct',
                dataType: 'json',
                data: { id: id },
                success: function (result) {
                    console.log(result, "remove item")
                    getList(result.result);
                    tinhTong(result.result);
                },
                error: function (req, status, error) {
                    console.log(status);
                }

            });
        });

        $('.delete').off('click').on('click', function (e) {
            e.preventDefault();
            var btn = $(this);
            $.ajax({
                type: "GET",
                url: '/Home/RemoveAllProduct',
                dataType: 'json',
                success: function (result) {
                    $('#listCart').empty();
                    tinhTong(null);
                },
                error: function (req, status, error) {
                    console.log(status);
                }

            });
        });

        $('.button_close').off('click').on('click', function (e) {
            e.preventDefault();
            var btn = $(this);
            $.ajax({
                type: "GET",
                url: '/Home/RemoveAllProduct',
                dataType: 'json',
                success: function (result) {
                    $('#soDienThoai').val("");
                    $('#diaChiNhan').val("");
                    $('#listCart').empty();
                    tinhTong(null);
                },
                error: function (req, status, error) {
                    console.log(status);
                }

            });
        });

        $('.giaoHang').off('click').on('click', function (e) {
            e.preventDefault();
            var btn = $(this);
            var soDienThoai = $('#soDienThoai').val();
            var diaChiNhanHang = $('#diaChiNhan').val();
            if (checkEmpty() == true) {
                $.ajax({
                    type: "GET",
                    url: '/Home/ThanhToan',
                    dataType: 'json',
                    success: function (result) {
                        console.log(result, "giao hang")
                        $('#soDienThoai').val("");
                        $('#diaChiNhan').val("");
                        $('#listCart').empty();
                        tinhTong(null);
                        notificationSuccess();
                    },
                    error: function (req, status, error) {
                        console.log(status);
                    }

                });
            }
            else {

            }
           
        });

        function notificationSuccess() {
            let noti = document.querySelector('.notification');
            noti.classList.toggle('isActive');
        }

    }
}

addtocart.init();

function notificationSuccessHidden() {
    let noti = document.querySelector('.notification');
    noti.classList.remove('isActive');
    var orderContainer = document.querySelector(".order__food");
    orderContainer.classList.remove("order__open");
}

function checkEmpty() {
    var soDienThoai = $('#soDienThoai').val();
    var diaChiNhanHang = $('#diaChiNhan').val();
    if (soDienThoai.length == 0 && diaChiNhanHang.length == 0) {
        return false;
    } else {
        return true;
    }
}