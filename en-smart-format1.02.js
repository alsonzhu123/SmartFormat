/**
 * SmartFormat - 智能输入格式化插件 version 1.02
 * 功能：全角转半角、文件名小写、句子首字母大写、特殊单词保留、不干扰其他语言输入法
 * @Alson zhu
 * E-Mail: alsonzhu@hotmail.com
 
 **/

;(function($, window, document, undefined) {
    'use strict';

    const defaults = {
        fullWidthToHalf: true,
        fileNameLowercase: true,
        sentenceFormat: true,
        preserveSpecialWords: true,
        
        specialWords: {
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
        },
        
        // 文件扩展名列表
        fileExtensions: [
            'ipa', 'apk', 'exe', 'dmg', 'pkg', 'deb', 'rpm',
            'txt', 'md', 'js', 'ts', 'json', 'xml', 'html', 'css',
            'py', 'java', 'cpp', 'c', 'go', 'rs', 'php', 'rb',
            'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
            'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'iso',
            'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico',
            'mp3', 'mp4', 'avi', 'mov', 'mkv', 'wav',
            'sh', 'bat', 'ps1', 'sql', 'log', 'csv', 'ini', 'conf'
        ],
        
        debug: false,
        autoFormat: true,
        formatOnBlur: true,
        formatOnCompositionEnd: true,  // 新增：输入法确认后格式化
        showLivePreview: false,
        previewElement: null,
        
        onFormat: null,
        onError: null
    };

    class SmartFormat {
        constructor(element, options) {
            this.$element = $(element);
            this.options = $.extend(true, {}, defaults, options);
            this.lastValue = '';
            this.isFormatting = false;
            this.isComposing = false;      // 是否正在使用输入法
            this.compositionTimer = null;   // 输入法确认后的延迟定时器
            
            this._compileRegex();
            this._init();
        }
        
        _compileRegex() {
            // 文件扩展名正则（用于匹配文件名）
            const extPattern = this.options.fileExtensions.join('|');
            // 匹配文件名模式：单词.扩展名（不区分大小写）
            this.fileNameRegex = new RegExp('\\b([A-Za-z0-9_.-]+)\\.(' + extPattern + ')\\b', 'gi');
            
            // 特殊单词正则
            const specialKeys = Object.keys(this.options.specialWords);
            if (specialKeys.length > 0) {
                const specialPattern = specialKeys.map(k => k.replace(/\./g, '\\.')).join('|');
                this.specialWordsRegex = new RegExp('\\b(' + specialPattern + ')\\b', 'gi');
            }
        }
        
        _init() {
            if (this.options.debug) {
                console.log('[SmartFormat] 初始化插件', this.$element);
            }
            
            // 监听输入法事件
            this.$element.on('compositionstart.smartFormat', this._handleCompositionStart.bind(this));
            this.$element.on('compositionend.smartFormat', this._handleCompositionEnd.bind(this));
            
            if (this.options.autoFormat) {
                this.$element.on('input.smartFormat', this._handleInput.bind(this));
            }
            
            if (this.options.formatOnBlur) {
                this.$element.on('blur.smartFormat', this._handleBlur.bind(this));
            }
            
            this.lastValue = this.$element.val();
            
            if (this.$element.val()) {
                this._formatAndUpdate(this.$element.val(), true);
            }
        }
        
        /**
         * 输入法开始输入（如中文拼音开始）
         */
        _handleCompositionStart() {
            this.isComposing = true;
            if (this.options.debug) {
                console.log('[SmartFormat] 输入法激活，暂停格式化');
            }
        }
        
        /**
         * 输入法结束输入（如中文选中确认）
         */
        _handleCompositionEnd(e) {
            this.isComposing = false;
            
            if (this.options.debug) {
                console.log('[SmartFormat] 输入法结束，准备格式化');
            }
            
            // 清除之前的定时器
            if (this.compositionTimer) {
                clearTimeout(this.compositionTimer);
            }
            
            // 延迟执行格式化，确保输入法的最终值已完全写入
            if (this.options.formatOnCompositionEnd) {
                this.compositionTimer = setTimeout(() => {
                    const currentValue = this.$element.val();
                    if (currentValue !== this.lastValue) {
                        if (this.options.debug) {
                            console.log('[SmartFormat] 输入法确认后格式化');
                        }
                        this._formatAndUpdate(currentValue, false, this.$element[0].selectionStart);
                    }
                    this.compositionTimer = null;
                }, 10);
            }
        }
        
        _handleInput(e) {
            // 如果正在使用输入法，不进行格式化
            if (this.isComposing) {
                if (this.options.debug) {
                    console.log('[SmartFormat] 输入法输入中，跳过格式化');
                }
                this.lastValue = this.$element.val();
                return;
            }
            
            if (this.isFormatting) return;
            
            const currentValue = this.$element.val();
            const cursorPos = this.$element[0].selectionStart;
            
            if (currentValue === this.lastValue) return;
            
            this._formatAndUpdate(currentValue, false, cursorPos);
        }
        
        _handleBlur() {
            // 失去焦点时也要确保输入法状态结束
            this.isComposing = false;
            
            const currentValue = this.$element.val();
            const formatted = this.format(currentValue);
            
            if (formatted !== currentValue) {
                this._updateValue(formatted);
            }
            
            if (this.options.onFormat) {
                this.options.onFormat(currentValue, formatted);
            }
        }
        
        _formatAndUpdate(value, isInit = false, cursorPos = null) {
            this.isFormatting = true;
            
            const originalValue = value;
            let formattedValue = this.format(originalValue);
            
            if (this.options.debug) {
                console.log('[SmartFormat] 格式化:', {
                    原始: originalValue,
                    格式化后: formattedValue
                });
            }
            
            this._updatePreview(formattedValue);
            
            if (formattedValue !== originalValue) {
                this._updateValue(formattedValue, cursorPos, originalValue.length);
            }
            
            this.lastValue = formattedValue;
            this.isFormatting = false;
            
            if (this.options.onFormat && !isInit) {
                this.options.onFormat(originalValue, formattedValue);
            }
        }
        
        _updateValue(newValue, cursorPos = null, oldLength = null) {
            const oldValue = this.$element.val();
            const inputElement = this.$element[0];
            
            if (newValue === oldValue) return;
            
            let newCursorPos = cursorPos;
            if (cursorPos !== null && oldLength !== null) {
                const diff = oldLength - newValue.length;
                newCursorPos = cursorPos - diff;
                newCursorPos = Math.max(0, Math.min(newCursorPos, newValue.length));
            }
            
            this.$element.val(newValue);
            
            if (newCursorPos !== null && newCursorPos >= 0) {
                inputElement.setSelectionRange(newCursorPos, newCursorPos);
            }
        }
        
        _updatePreview(value) {
            if (!this.options.showLivePreview) return;
            
            let $preview = this.options.previewElement;
            if (typeof $preview === 'string') {
                $preview = $($preview);
            }
            
            if ($preview && $preview.length) {
                $preview.text(value || '(空)');
            }
        }
        
        /**
         * 全角转半角
         */
        _fullWidthToHalfWidth(str) {
            if (!str || !this.options.fullWidthToHalf) return str;
            
            let result = '';
            for (let i = 0; i < str.length; i++) {
                let code = str.charCodeAt(i);
                
                if (code === 0x3000) {
                    result += ' ';
                    continue;
                }
                
                if (code >= 0xFF01 && code <= 0xFF5E) {
                    result += String.fromCharCode(code - 0xFEE0);
                } else {
                    result += str[i];
                }
            }
            return result;
        }
        
        /**
         * 将句子中的文件名转为小写
         * 例如："Test.ipa" → "test.ipa"
         * 只转换文件名部分，不影响其他单词
         */
        _lowercaseFileNames(str) {
            if (!str || !this.options.fileNameLowercase) return str;
            
            return str.replace(this.fileNameRegex, function(match) {
                return match.toLowerCase();
            });
        }
        
        /**
         * 格式化句子（首字母大写 + 特殊单词保留）
         * 注意：文件名已经在小写状态，这里需要保护它们不被重新格式化
         */
        _formatSentence(str) {
            if (!str || !this.options.sentenceFormat) return str;
            
            // 步骤1：先保护文件名（用占位符替换）
            const fileNames = [];
            let protectedText = str.replace(this.fileNameRegex, function(match) {
                const placeholder = `__FILE_${fileNames.length}__`;
                fileNames.push(match);
                return placeholder;
            });
            
            // 步骤2：处理连续空格
            protectedText = protectedText.replace(/\s+/g, ' ');
            
            // 步骤3：格式化普通单词（首字母大写，其余小写）
            protectedText = protectedText.replace(/\b\w+\b/g, function(word) {
                if (word.startsWith('__FILE_')) return word; // 跳过占位符
                if (word.length === 0) return word;
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            });
            
            // 步骤4：确保整个字符串首字母大写
            if (protectedText.length > 0 && protectedText[0] !== ' ') {
                protectedText = protectedText.charAt(0).toUpperCase() + protectedText.slice(1);
            }
            
            // 步骤5：替换特殊单词（只替换非占位符部分）
            if (this.options.preserveSpecialWords && this.specialWordsRegex) {
                protectedText = protectedText.replace(this.specialWordsRegex, (match) => {
                    if (match.startsWith('__FILE_')) return match;
                    const lowerMatch = match.toLowerCase();
                    return this.options.specialWords[lowerMatch] || match;
                });
            }
            
            // 步骤6：恢复文件名（保持小写状态）
            fileNames.forEach((fileName, index) => {
                protectedText = protectedText.replace(`__FILE_${index}__`, fileName);
            });
            
            return protectedText;
        }
        
        /**
         * 公共格式化方法
         */
        format(value) {
            if (typeof value !== 'string') return '';
            
            try {
                // 步骤1：全角转半角
                let result = this._fullWidthToHalfWidth(value);
                
                // 步骤2：将句子中的文件名转为小写
                if (this.options.fileNameLowercase) {
                    result = this._lowercaseFileNames(result);
                }
                
                // 步骤3：格式化句子
                result = this._formatSentence(result);
                
                return result;
            } catch (error) {
                if (this.options.debug) {
                    console.error('[SmartFormat] 格式化错误:', error);
                }
                if (this.options.onError) {
                    this.options.onError(error);
                }
                return value;
            }
        }
        
        formatCurrent() {
            const currentValue = this.$element.val();
            const formatted = this.format(currentValue);
            
            if (formatted !== currentValue) {
                this._updateValue(formatted);
            }
            
            return formatted;
        }
        
        getFormattedValue() {
            return this.format(this.$element.val());
        }
        
        updateOptions(options) {
            this.options = $.extend(true, {}, this.options, options);
            this._compileRegex();
            
            if (this.options.debug) {
                console.log('[SmartFormat] 配置已更新', this.options);
            }
            
            this.formatCurrent();
        }
        
        destroy() {
            if (this.options.debug) {
                console.log('[SmartFormat] 销毁插件', this.$element);
            }
            
            this.$element.off('.smartFormat');
            this.$element.removeData('smartFormat');
            
            if (this.compositionTimer) {
                clearTimeout(this.compositionTimer);
            }
        }
    }
    
    $.fn.smartFormat = function(options) {
        if (typeof options === 'string') {
            const instance = this.data('smartFormat');
            if (!instance) {
                $.error('SmartFormat 未初始化，请先调用 .smartFormat()');
                return this;
            }
            
            if (options === 'destroy') {
                instance.destroy();
                return this;
            }
            if (options === 'format') {
                return instance.formatCurrent();
            }
            if (options === 'getValue') {
                return instance.getFormattedValue();
            }
            if (options === 'updateOptions') {
                instance.updateOptions(arguments[1]);
                return this;
            }
        }
        
        return this.each(function() {
            const $this = $(this);
            if (!$this.data('smartFormat')) {
                const instance = new SmartFormat(this, options);
                $this.data('smartFormat', instance);
            }
        });
    };
    
})(jQuery, window, document);
