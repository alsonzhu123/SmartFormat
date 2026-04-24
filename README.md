# SmartFormat - 智能输入格式化插件

<div align="center">

![jQuery](https://img.shields.io/badge/jQuery-1.7+-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Version](https://img.shields.io/badge/version-1.1.0-orange.svg)

**全角转半角 · 文件名小写 · 句子格式化 · 特殊单词保留 · 输入法友好**

[![使用方法](https://img.shields.io/badge/使用-快速开始-brightgreen.svg)](#快速开始)
[![API参考](https://img.shields.io/badge/API-参考-blue.svg)](#api-方法参考)
[![配置选项](https://img.shields.io/badge/配置-选项-yellow.svg)](#配置选项)

</div>

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
