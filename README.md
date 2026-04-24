# SmartFormat - 智能输入格式化插件

[![jQuery](https://img.shields.io/badge/jQuery-1.7+-blue.svg)](https://jquery.com/)
[![Version](https://img.shields.io/badge/version-1.1.0-green.svg)]()
[![License](https://img.shields.io/badge/license-MIT-orange.svg)](LICENSE)

SmartFormat 是一个轻量级的 jQuery 插件，用于智能格式化输入框内容。它能在用户输入时自动进行多种格式化操作，支持中文、日文、韩文等输入法。

## ✨ 核心功能

| 功能 | 说明 | 示例 |
|------|------|------|
| 🔤 **全角转半角** | 全角字母、数字、空格自动转换 | `ｈｅｌｌｏ` → `hello` |
| 📄 **文件名小写** | 识别文件名格式并转为小写 | `Test.ipa` → `test.ipa` |
| 📝 **句子格式化** | 首字母大写 + 每个单词首字母大写 | `hello world` → `Hello World` |
| 🔠 **特殊单词保留** | 专有名词保持正确格式 | `iphone` → `iPhone` |
| 🌐 **输入法友好** | 支持中文/日文/韩文 IME 输入法 | 输入拼音时不格式化 |
| 🎯 **光标保持** | 格式化后自动恢复光标位置 | - |

## 🚀 快速开始

### 1. 引入依赖

```html
<!-- 引入 jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- 引入 SmartFormat 插件 -->
<script src="smart-format.js"></script>