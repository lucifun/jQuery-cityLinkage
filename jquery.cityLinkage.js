;(function ($) {
    // 行参分别传入需要绑定省份，城市，地区的input输入框对应的元素:  parameter = {proIpt:'',cityIpt:'',areaIpt:''}
    $.cityLinkage = function (parameter) {
        var dataList = {};
        $.ajax({
            url: "http://passer-by.com/data_location/list.json",
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                var tempProvince = '', tempCity = ''
                for (var i in data) {
                    if ((i - 0) % 1e4 === 0) {
                        dataList[data[i]] = {};
                        tempProvince = data[i];
                        tempCity = '';
                    } else if ((i - 0) % 1e2 === 0) {
                        dataList[tempProvince][data[i]] = {};
                        tempCity = data[i];
                    } else {
                        if (tempCity) {
                            dataList[tempProvince][tempCity][i] = data[i];
                        } else {
                            dataList[tempProvince][i] = data[i];
                        }
                    }
                }


            }

        });

        var tmpEltPro = parameter.proIpt || {},
            tmpEltCity = parameter.cityIpt || {},
            tmpEltArea = parameter.areaIpt || {};

        // 创建&加入province元素
        tmpEltPro.attr('list', 'proName');
        var tmpProDatalist = document.createElement('datalist'),
            tempProvinceArray = [];

        tmpProDatalist.id = 'proName';
        tmpEltPro.after(tmpProDatalist);

        // 创建&加入city元素
        tmpEltCity.attr('list', 'cityName');
        var tmpCityDatalist = document.createElement('datalist');

        tmpCityDatalist.id = 'cityName';
        tmpEltCity.after(tmpCityDatalist);

        // 创建&加入area元素
        tmpEltArea.attr('list', 'areaName');
        var tmpAreaDatalist = document.createElement('datalist');

        tmpAreaDatalist.id = 'areaName';
        tmpEltArea.after(tmpAreaDatalist);

        // pro事件监听
        tmpEltPro.get(0).onkeyup = function () {
            // init
            tempProvinceArray = [];
            tmpProDatalist.innerHTML = '';
            tmpCityDatalist.innerHTML = '';
            tmpAreaDatalist.innerHTML = '';
            tmpEltCity.get(0).value = '';
            tmpEltArea.get(0).value = '';

            tmpEltArea.show();

            // 将匹配合适数据加入数组
            for (var i in dataList) {
                if ((i.indexOf(tmpEltPro.get(0).value) === 0) && tmpEltPro.get(0).value) {
                    tempProvinceArray.push(i);
                }
            }

            // 创建province下拉标签
            for (var i = 0, length = tempProvinceArray.length; i < length; i++) {
                tmpProDatalist.innerHTML += "<option value=" + tempProvinceArray[i] + ">" + tempProvinceArray[i] + "</option>";
            }
        }
        tmpEltPro.get(0).onchange = function () {
            creatCityOptions(tmpEltPro, tmpEltCity, tmpCityDatalist,tmpAreaDatalist);
        }

        // city事件监听
        tmpEltCity.get(0).onkeyup   = function () {
            creatCityOptions(tmpEltPro, tmpEltCity, tmpCityDatalist,tmpAreaDatalist);
        }
        tmpEltCity.get(0).onchange  = function () {
            creatAreaOptopns(tmpEltPro, tmpEltCity, tmpEltArea,tmpAreaDatalist);
        }

        //areas事件监听
        tmpEltArea.get(0).onkeyup = function () {
            creatAreaOptopns(tmpEltPro, tmpEltCity, tmpEltArea,tmpAreaDatalist);
        }

        var creatCityOptions = function (tmpEltPro, tmpEltCity, tmpCityDatalist,tmpAreaDatalist) {
            var tempCityArray = [];
            tmpCityDatalist.innerHTML = '';
            tmpAreaDatalist.innerHTML = '';
            tmpEltArea.get(0).value = '';

            if (dataList[tmpEltPro.get(0).value]) {
                for (var i in dataList[tmpEltPro.get(0).value]) {
                    if (i.indexOf(tmpEltCity.get(0).value) === 0) {
                        if (/[0-9]/.test(i)) {
                            tempCityArray.push(dataList[tmpEltPro.get(0).value][i]);
                            tmpEltArea.hide();
                        } else {
                            tempCityArray.push(i);
                        }

                    }
                }
            }

            // 创建city下拉标签
            for (var i = 0, length = tempCityArray.length; i < length; i++) {
                tmpCityDatalist.innerHTML += "<option value=" + tempCityArray[i] + ">" + tempCityArray[i] + "</option>";
            }
        }

        var creatAreaOptopns = function (tmpEltPro, tmpEltCity, tmpEltArea,tmpAreaDatalist) {
            var tempAreaArray = [];
            tmpAreaDatalist.innerHTML = '';

            if (dataList[tmpEltPro.get(0).value] && dataList[tmpEltPro.get(0).value][tmpEltCity.get(0).value]) {
                for (var i in dataList[tmpEltPro.get(0).value][tmpEltCity.get(0).value]) {
                    if(dataList[tmpEltPro.get(0).value][tmpEltCity.get(0).value][i].indexOf(tmpEltArea.get(0).value) === 0){
                        tempAreaArray.push(dataList[tmpEltPro.get(0).value][tmpEltCity.get(0).value][i]);
                    }
                }

                // 创建Area下拉标签
                for (var i = 0, length = tempAreaArray.length; i < length; i++) {
                    tmpAreaDatalist.innerHTML += "<option value=" + tempAreaArray[i] + ">" + tempAreaArray[i] + "</option>";
                }
            }
        }
    }

})($, jQuery);