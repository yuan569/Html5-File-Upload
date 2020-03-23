# File-Upload

## Preview
![File-Upload](https://github.com/yuan569/Html5_File_Upload/fileupload/img/preview.jpg)



## Getting Started

Ready to set File-Upload up on your page? Start by including the File-Upload CSS and Javascript. You can grab both these files from the /dist folder. 

1. Download a zip of the latest release (or any previous one) from the Github Releases page.

2. Include the CSS at the top of your page in your "head" tag:
```bash
<link href="path/to/fileupload.css" rel="stylesheet" />
```

3. Include the Html at the middle of your page in your "body" tag:
```bash
<div class="upload-container">
    <div class="upload-title">请点击“+”按钮上传图片</div>
    <div class="upload-image-picker">
        <div class="upload-image-picker-list">
            <div class="upload-flexbox">
                <div class="upload-flexbox-item">
                    <div class="upload-image-picker-item upload-image-picker-upload-btn"><input type="file" accept="image/jpeg,image/jpg,image/png" multiple class="upload__input"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="upload-tip">提示：只能上传jpeg、jpg、png文件，每张图片不超过15M</div>
</div>
<div class="mask">
    <div class="loading"><div class="info"><div class="circle"></div>上传中...</div></div>
</div>
```

4. Include the Javascript at the bottom of your page before the closing "body" tag: 
```bash
<script src="path/to/fileupload.js"></script> 
```


## Initialize with script
```bash
<script>
window.addEventListener("load", function() {
    (function() {
        var fileupload = new FileUpload({
            compressPercent: 0.3, //压缩比例，最大为1
            addItemApi: "http://127.0.0.1:8080/my-project/upload/file", //新增图片的接口
            deleteItemApi: "http://127.0.0.1:8080/my-project/delete/file/" //删除图片的接口
        });
    })()
})
</script>
```
