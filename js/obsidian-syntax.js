// Obsidian 语法处理器
console.log('Obsidian 语法处理器已加载');

document.addEventListener('DOMContentLoaded', function() {
    console.log('开始处理 Obsidian 语法');
    
    // 处理 callout 语法 - 转换 blockquote 为 callout 样式
    function processCallouts() {
        console.log('处理 callout 语法');
        const blockquotes = document.querySelectorAll('blockquote');
        
        blockquotes.forEach(blockquote => {
            const firstP = blockquote.querySelector('p');
            if (firstP) {
                const text = firstP.textContent.trim();
                console.log('检查 blockquote 内容:', text);
                
                const calloutMatch = text.match(/^\[!(NOTE|TIP|WARNING|DANGER|ERROR|SUCCESS|QUESTION|BUG|EXAMPLE|QUOTE)\]/i);
                if (calloutMatch) {
                    console.log('找到 callout:', calloutMatch[1]);
                    
                    const type = calloutMatch[1].toLowerCase();
                    const content = text.replace(/^\[![^\]]+\]\s*/, '');
                    
                    // 类型映射
                    const typeMap = {
                        'note': 'note',
                        'tip': 'tip',
                        'warning': 'warning',
                        'danger': 'danger',
                        'error': 'error',
                        'success': 'success',
                        'question': 'question',
                        'bug': 'bug',
                        'example': 'example',
                        'quote': 'quote'
                    };
                    const mappedType = typeMap[type] || 'note';
                    
                    // 图标映射
                    const iconMap = {
                        'note': '📝',
                        'tip': '💡',
                        'warning': '⚠️',
                        'danger': '🚨',
                        'error': '❌',
                        'success': '✅',
                        'question': '❓',
                        'bug': '🐛',
                        'example': '📋',
                        'quote': '💬'
                    };
                    const icon = iconMap[mappedType] || '📝';
                    
                    // 显示名称映射
                    const displayMap = {
                        'note': 'Note',
                        'tip': 'Tip',
                        'warning': 'Warning',
                        'danger': 'Danger',
                        'error': 'Error',
                        'success': 'Success',
                        'question': 'Question',
                        'bug': 'Bug',
                        'example': 'Example',
                        'quote': 'Quote'
                    };
                    const displayType = displayMap[mappedType] || 'Note';
                    
                    // 创建新的 callout HTML
                    const calloutDiv = document.createElement('div');
                    calloutDiv.className = `obsidian-callout obsidian-callout-${mappedType}`;
                    calloutDiv.innerHTML = `
                        <div class="obsidian-callout-title">
                            <span class="obsidian-callout-icon">${icon}</span>
                            <span class="obsidian-callout-title-text">${displayType}</span>
                        </div>
                        <div class="obsidian-callout-content">
                            <p>${content}</p>
                        </div>
                    `;
                    
                    // 替换原始的 blockquote
                    blockquote.parentNode.replaceChild(calloutDiv, blockquote);
                    console.log('替换了 callout:', type, content);
                }
            }
        });
    }
    
    // 处理高亮语法 ==text==
    function processHighlights() {
        console.log('处理高亮语法');
        const walker = document.createTreeWalker(
            document.querySelector('.article-content') || document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.parentNode.tagName !== 'SCRIPT' && node.parentNode.tagName !== 'STYLE') {
                textNodes.push(node);
            }
        }

        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            if (text.includes('==') && text.includes('==')) {
                const regex = /==(.*?)==/g;
                const newHTML = text.replace(regex, '<mark>$1</mark>');
                if (newHTML !== text) {
                    const span = document.createElement('span');
                    span.innerHTML = newHTML;
                    textNode.parentNode.replaceChild(span, textNode);
                    console.log('替换了高亮文本:', text, '->', newHTML);
                }
            }
        });
    }

    // 先处理 callouts，再处理高亮
    processCallouts();
    processHighlights();
    
    console.log('Obsidian 语法处理完成');
});
