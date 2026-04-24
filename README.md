# SmartFormat - 智能输入格式化插件

<div align="center">

![jQuery](https://img.shields.io/badge/jQuery-1.7+-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Version](https://img.shields.io/badge/version-1.1.0-orange.svg)

**全角转半角 · 文件名小写 · 句子格式化 · 特殊单词保留 · 输入法友好**

[![使用方法](https://img.shields.io/badge/使用-快速开始-brightgreen.svg)](#快速开始)
[![API参考](https://img.shields.io/badge/API-参考-blue.svg)](#api-方法参考)
[![配置选项](https://img.shields.io/badge/配置-选项-yellow.svg)](#%EF%B8%8F-%E9%85%8D%E7%BD%AE%E9%80%89%E9%A1%B9)

</div>

## [在线演示](https://alsonzhu123.github.io/SmartFormat/)


---

## 📖 简介

SmartFormat 是一个基于 jQuery 的智能输入格式化插件，专为需要规范化用户输入的场景设计。它能够在用户输入时自动进行格式化，同时完美支持中文、日文、韩文等 IME 输入法，不会在输入法激活期间干扰用户。

### 核心功能

| 功能 | 说明 | 示例 |
|------|------|------|
| 🔤 **全角转半角** | 自动将全角字母、数字、符号转换为半角 | `ｈｅｌｌｏ` → `hello` |
| 📄 **文件名小写** | 识别文件名格式并转为小写 | `Test.ipa` → `test.ipa` |
| 📝 **句子格式化** | 首字母大写 + 每个单词首字母大写 | `hello world` → `Hello World` |
| 🔠 **特殊单词保留** | 专有名词保持正确格式 | `iphone` → `iPhone` |
| 🌐 **输入法友好** | 中文/日文/韩文输入时不干扰 | `nihao` → 等待确认后 → `你好` |

---

## 🚀 快速开始

### 1. 引入依赖

```html
<!-- 引入 jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- 引入 SmartFormat 插件 -->
<script src="smart-format.js"></script>
```
### 2. 初始化插件
javascript
```html
// 基础用法
$('#myInput').smartFormat();

// 带配置项
$('#myInput').smartFormat({
    debug: true,
    specialWords: {
        'ios': 'iOS',
        'myapp': 'MyApp'
    }
});
```
### 3. 方法调用
javascript
```html
// 手动触发格式化
var formatted = $('#myInput').smartFormat('format');

// 获取格式化后的值（不修改输入框）
var currentValue = $('#myInput').smartFormat('getValue');

// 动态更新配置
$('#myInput').smartFormat('updateOptions', { debug: true });

// 销毁插件
$('#myInput').smartFormat('destroy');
```
📖 API 方法参考
|方法|语法|返回值|说明|
|-----|-------|-------|----|
|初始化|$element.smartFormat(options)|jQuery对象|初始化插件|
|手动格式化|$element.smartFormat('format')|String|手动触发格式化，返回格式化后的值|
|获取格式化值|$element.smartFormat('getValue')|String|获取格式化后的值（不修改输入框）|
|更新配置|$element.smartFormat('updateOptions', options)	|jQuery对象|动态更新配置|
销毁插件|$element.smartFormat('destroy')|jQuery对象|销毁插件，恢复原始状态|

### ⚙️ 配置选项
完整配置示例

javascript
```html
$('#myInput').smartFormat({
    // 功能开关
    fullWidthToHalf: true,
    fileNameLowercase: true,
    sentenceFormat: true,
    preserveSpecialWords: true,
    
    // 输入法相关
    formatOnCompositionEnd: true,
    
    // 事件控制
    autoFormat: true,
    formatOnBlur: true,
    
    // UI 相关
    showLivePreview: false,
    previewElement: null,
    
    // 数据配置
    specialWords: {
        'iphone': 'iPhone',
        'ipad': 'iPad'
    },
    fileExtensions: ['ipa', 'apk', 'txt', 'pdf'],
    
    // 调试与回调
    debug: false,
    onFormat: function(original, formatted) {},
    onError: function(error) {}
});
```
### 配置选项详解
#### 功能开关
|选项|	类型|	默认值|	说明|
|-----|-------|-------|----|
|fullWidthToHalf	|boolean	|true|	全角字符转半角|
|fileNameLowercase	|boolean	|true|	文件名部分转小写|
|sentenceFormat|	boolean|	true|	句子格式化（首字母大写）|
|preserveSpecialWords	|boolean|	true	|保留特殊单词格式|

#### 输入法相关
|选项|类型	|默认值	|说明|
|-----|-------|-------|----|
|formatOnCompositionEnd	|boolean	|true	|输入法确认后执行格式化|

#### 事件控制
|选项|	类型	|默认值	|说明|
|-----|-------|-------|----|
|autoFormat|	boolean|	true|	输入时自动格式化|
|formatOnBlur	|boolean	|true|	失去焦点时格式化|
#### UI 相关
|选项	|类型	|默认值|	说明|
|-----|-------|-------|----|
|showLivePreview	|boolean	|false|	显示实时预览|
|previewElement|	string/object|	null	|预览元素的选择器或jQuery对象|
#### 数据配置
|选项|	类型|	默认值|	说明|
|-----|-------|-------|----|
|specialWords|	object|	内置映射表|	特殊单词映射（小写→正确格式）|
|fileExtensions	|array	|内置扩展名列表	|文件扩展名列表|
#### 调试与回调
|选项	|类型|	默认值	|说明|
|-----|-------|-------|----|
|debug	|boolean|	false|	开启调试模式（控制台输出）|
|onFormat	|function	|null|	格式化完成回调|
|onError	|function	|null	|错误回调|

### 🔧 内置数据
#### 特殊单词映射表

javascript
```html
{
    'iphone': 'iPhone',
    'ipad': 'iPad',
    'ios': 'iOS',
    'macos': 'macOS',
    'javascript': 'JavaScript',
    'jquery': 'jQuery',
    'vue.js': 'Vue.js',
    'react.js': 'React.js',
    'angular.js': 'Angular.js',
    'typescript': 'TypeScript'
}
```
💡 可通过 specialWords 选项扩展或覆盖
#### 文件扩展名列表

text
```html
ipa, apk, exe, dmg, pkg, deb, rpm, txt, md, js, ts, json, xml, html, css,
py, java, cpp, c, go, rs, php, rb, pdf, doc, docx, xls, xlsx, ppt, pptx,
zip, rar, 7z, tar, gz, bz2, iso, png, jpg, jpeg, gif, svg, ico, mp3, mp4,
avi, mov, mkv, wav, sh, bat, ps1, sql, log, csv, ini, conf
```
💡 可通过 fileExtensions 选项扩展
### 📝 使用场景
#### 场景1：简单输入框

javascript
```html
$('#title').smartFormat();
```
#### 场景2：批量初始化
javascript
```html
// 为表单中所有需要格式化的输入框初始化
$('input.formatted, textarea.formatted').smartFormat({
    debug: false,
    onFormat: function(original, formatted) {
        validateField(this, formatted);
    }
});
```
### 场景3：动态添加元素

javascript
```html
function addNewInput() {
    var $newInput = $('<input type="text" class="dynamic-input">');
    $('#container').append($newInput);
    $newInput.smartFormat({ debug: true });
}
```
### 场景4：配合表单提交

javascript
```html
var $input = $('#myInput').smartFormat();

$('#myForm').on('submit', function(e) {
    e.preventDefault();
    var finalValue = $input.smartFormat('format');
    // 提交数据...
});
```
### 🎯 格式化效果示例
|输入|	输出|	说明|
|-----|-------|-------|
|hello world|	Hello World|	句子格式化|
|HELLO WORLD	|Hello World|	全大写转首字母大写|
|readme.txt|	readme.txt	|文件名保持小写|
|README.TXT	|readme.txt|	文件名转小写|
|iphone is great	|iPhone Is Great	|特殊单词 + 句子格式化|
|The file is Test.ipa	|The File Is test.ipa|	文件名小写 + 句子格式化|
|ｈｅｌｌｏ　ｗｏｒｌｄ	|Hello World	|全角转半角 + 格式化|
|你好世界	|你好世界	|中文不受影响|
|hello你好world|	Hello你好World|	中英文混合|

### ⚠️ 注意事项
|注意点	|说明|
|-----|-------|
|jQuery 版本	|需要 jQuery 1.7 或更高版本|
|输入法兼容	|完美支持中文、日文、韩文等 IME 输入法|
|光标位置	|格式化后自动保持光标位置|
|性能|	适合中等长度文本（建议 < 5000 字符）|
|特殊单词	|默认不区分大小写匹配|
|全局污染	|仅暴露 $.fn.smartFormat，无全局变量|
### 🐛 调试模式

开启 debug: true 后，控制台会输出详细的格式化日志：

text
```html
[SmartFormat] 初始化插件 jQuery.fn.init [input#myInput]

[SmartFormat] 输入法激活，暂停格式化

[SmartFormat] 输入法输入中，跳过格式化

[SmartFormat] 输入法结束，准备格式化

[SmartFormat] 格式化: {原始: "hello world", 格式化后: "Hello World"}
```
### 🔄 更新日志
#### v1.1.0 (2024-01-15)
✨ 新增输入法支持（compositionstart/compositionend）

✨ 新增 formatOnCompositionEnd 配置选项

🐛 修复输入法中频繁格式化的问题

📝 优化光标位置计算逻辑

#### v1.0.0 (2024-01-01)
🎉 首次发布

✨ 支持全角转半角

✨ 支持文件名小写

✨ 支持句子格式化

✨ 支持特殊单词保留

✨ 提供完整的 API 方法

