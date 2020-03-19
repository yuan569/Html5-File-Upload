;
(function() {
    var FileUpload = function(options) {
        var self = this;

        // 设置默认参数
        this.options = {
            compressPercent: 0.3, //压缩比例，最大为1
            addItemApi: "", //新增图片的接口
            deleteItemApi: "" //删除图片的接口
        }

        // 扩展参数(浅拷贝)
        var shallowCopy = function(target, src) {
            for (var prop in src) {
                if (src.hasOwnProperty(prop)) {
                    target[prop] = src[prop];
                }
            }
            return target;
        }
        shallowCopy(this.options, options || {})

        //引用元素
        this.uploadFlexbox = document.querySelector(".upload-flexbox");
        this.uploadButton = document.querySelector(".upload-image-picker-upload-btn");
        this.btnBelongToFlexItem = this.uploadButton.parentNode;
        this.uploadInput = document.querySelector(".upload__input");
        this.fragmentWrap = document.createDocumentFragment(); //文档片段容器

        //添加input file元素的change事件处理程序
        this.uploadInput.addEventListener("change", function(event) {
            self.handleEvent(event)
        })

        //添加删除按钮的事件处理程序
        this.uploadFlexbox.addEventListener("click", function(event) {
            if (event.target.className.indexOf("upload-image-picker-item-remove") > -1) {
                self.deleteItem(event.target)
            }
        }, false)

    }

    FileUpload.prototype = {
        //input file元素change事件的回调函数
        handleEvent: function(event) {
            var self = this;
            var uploadData,
                xhr,
                files,
                i,
                len,
                counter;

            uploadData = new FormData();
            files = event.target.files;
            i = 0;
            len = files.length;
            counter = 0; //计数器，记录已加载的图片
            

            while (i < len) {

                //异步加载图片，使用闭包封装变量
                (function(j) {
                    var newSrc,
                        type,
                        img,
                        compressedDataURL,
                        domFrag,
                        keyName;

                    //判断图片大小，不允许超过15M
                    if (files[j].size / 1024 > 15 * 1024) {
                        alert("上传的图片过大，请重新选择图片！");
                        return;
                    }
                    //引用对象URL
                    newSrc = self.createObjectURL(files[j]);
                    type = files[j].type;
                    img = new Image();
                    img.src = newSrc;
                    keyName = "file" + j;
                    img.onload = function() {

                        // 生成DataURL
                        compressedDataURL = self.compress(img, type);
                    
                        //为FormData对象设置键值
                        uploadData.append(keyName, compressedDataURL);

                        //点击按钮新增图片项目（插入到文档片段容器中保存）
                        self.addFragItem(compressedDataURL);

                        //计数器加1
                        counter++

                        //图片全部加载完成时
                        if (counter == len) {
                            //把文档片段插入到DOM中
                            self.uploadFlexbox.insertBefore(self.fragmentWrap, self.btnBelongToFlexItem);

                            // 发送请求
                            self.sendRequest(self.options.addItemApi, uploadData)
                        }

                        //释放引用的对象URL，减少内存占用
                        self.revokeObjectURL(newSrc)
                    };
                    img.onerror = function(err) {
                        console.log(err, "图片加载失败")
                    }

                })(i)

                i++;
            }

        },
        //点击按钮新增图片项目
        addFragItem(url) {
            //创建DOM结构，并插入到文档片段容器中
            var domFrag = this.createDom(url);
            this.fragmentWrap.appendChild(domFrag);
        },
        //点击按钮删除图片项目
        deleteItem(target) {
            var self = this,
                fname; //id表示图片所属的项目在列表中的位置

            // 递归查找节点并删除
            var findParent = function(node) {
                var parent = node.parentNode;

                if (parent === self.uploadFlexbox) {

                    // 取得被删除项目在列表中的位置
                    fname = node.getAttribute("fname");
                    parent.removeChild(node)
                } else {
                    findParent(parent)
                }
            }
            findParent(target);

            //把文件名拼接到请求地址，删除服务器中对应的图片数据
            var toBeDeletedUrl = self.options.deleteItemApi + fname
            //发送请求
            self.sendRequest(toBeDeletedUrl)

        },
        //点击上传按钮后创建DOM片段（参数id用来标记图片所属的项目在列表中的位置）
        createDom(url) {
            var template = '';
            template += '<div class="upload-flexbox-item">' +
                '            <div class="upload-image-picker-item">' +
                '                <div class="upload-image-picker-item-remove"></div>' +
                '                <div class="upload-image-picker-item-content" style="background-image: url(\'' + url + '\');"></div>' +
                '            </div>' +
                '        </div>';
            var frag = document.createRange().createContextualFragment(template);
            return frag
        },
        //引用对象URL
        createObjectURL(blob) {
            if (window.URL) {
                return window.URL.createObjectURL(blob)
            } else if (window.webkitURL) {
                return window.webkitURL.createObjectURL(blob)
            } else {
                return null
            }
        },
        //释放对象URL的引用
        revokeObjectURL(url) {
            if (window.URL) {
                window.URL.revokeObjectURL(url)
            } else if (window.webkitURL) {
                window.webkitURL.revokeObjectURL(url)
            }
        },
        // 压缩图片，返回DataURL
        compress(img, type) {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            var initSize = img.src.length;
            var width = img.width;
            var height = img.height;
            canvas.width = width;
            canvas.height = height;
            // 铺底色
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, width, height);

            //进行压缩
            var compressed = canvas.toDataURL("image/jpeg", this.options.compressPercent);
            // console.log("*******压缩后的图片大小*******");
            return compressed;
        },
        //请求成功后，将服务器保存的图片对应的文件名记录在DOM节点上
        recordFileName: function(data) {

            //后台返回的文件数组
            var fileNames = data;
            var filesLen = fileNames.length;

            //查询项目节点的集合
            var items = document.querySelectorAll(".upload-flexbox-item");
            var itemsLen = items.length

            //只记录项目集合中本次上传成功的图片对应的节点项目
            var prevLen = itemsLen - filesLen

            //为节点项目标记文件名
            fileNames.forEach(function(item, index) {
                items.item(prevLen + index - 1).setAttribute("fname", item.fname)
            })
        },
        //封装POST请求(可实现增加、刪除图片功能)
        sendRequest: function(url, data = null) {
            if (!url) {
                alert("请先设置请求接口！")
                return
            }
            var self = this;
            var xhr = new XMLHttpRequest();
            xhr.open("post", url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    var result = JSON.parse(xhr.responseText);
                    alert(result.msg);

                    if (result.data) {
                        //将文件名记录在DOM节点上
                        self.recordFileName(result.data.fileNames)
                    }
                }
            }
            xhr.send(data)
        },


    }

    window.FileUpload = FileUpload;
})();