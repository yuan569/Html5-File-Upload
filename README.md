# Html5_File_Upload
Html5_File_Upload is a plugin which is used to upload images in mobile.
EXAMPLES
GETTING STARTED
Ready to set File_Upload up on your page? Start by including the File_Upload CSS and Javascript. You can grab both these files from the /dist folder.
1.Include the CSS at the top of your page in your <head> tag:
<link href="path/to/fileupload.css" rel="stylesheet" />
2.Include the Javascript at the bottom of your page before the closing </body> tag:
<script src="path/to/fileupload.js"></script>
3.Initialize with html:
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
