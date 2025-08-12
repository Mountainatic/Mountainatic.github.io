// Obsidian 语法处理器
console.log('Obsidian 语法处理器已加载');

document.addEventListener('DOMContentLoaded', function() {
    console.log('开始处理 Obsidian 语法');
    
    // 处理 callout 语法
    function processCallouts() {
        console.log('处理 callout 语法');
        const blockquotes = document.querySelectorAll('blockquote');
        
        blockquotes.forEach(blockquote => {
            const firstP = blockquote.querySelector('p');
            if (firstP) {
                const text = firstP.textContent.trim();
                console.log('检查 blockquote 内容:', text);
                
                // 支持折叠语法和自定义标题的匹配：[!TYPE+/-] Title
                const calloutMatch = text.match(/^\[!([a-zA-Z]+)([+-]?)\]\s*(.*)/i);
                if (calloutMatch) {
                    const originalType = calloutMatch[1].toLowerCase();
                    const foldState = calloutMatch[2]; // '+', '-', 或空字符串
                    const title = calloutMatch[3].trim();
                    console.log('找到 callout:', originalType, '折叠状态:', foldState, '标题:', title);
                    
                    // 映射类型到主类型
                    let mappedType = originalType;
                    if (['summary', 'tldr'].includes(originalType)) mappedType = 'abstract';
                    if (['hint', 'important'].includes(originalType)) mappedType = 'tip';
                    if (['check', 'done'].includes(originalType)) mappedType = 'success';
                    if (['help', 'faq'].includes(originalType)) mappedType = 'question';
                    if (['caution', 'attention'].includes(originalType)) mappedType = 'warning';
                    if (['fail', 'missing'].includes(originalType)) mappedType = 'failure';
                    if (originalType === 'error') mappedType = 'danger';
                    if (originalType === 'cite') mappedType = 'quote';
                    
                    // 图标映射
                    const icons = {
                        'note': '📝', 'abstract': '📄', 'info': 'ℹ️', 'todo': '📋',
                        'tip': '💡', 'success': '✅', 'question': '❓', 'warning': '⚠️',
                        'failure': '❌', 'danger': '🚨', 'bug': '🐛', 'example': '📋', 'quote': '💬'
                    };
                    
                    const icon = icons[mappedType] || '📝';
                    
                    // 默认标题
                    const titles = {
                        'note': 'Note', 'abstract': 'Abstract', 'info': 'Info', 'todo': 'Todo',
                        'tip': 'Tip', 'success': 'Success', 'question': 'Question', 'warning': 'Warning',
                        'failure': 'Failure', 'danger': 'Danger', 'bug': 'Bug', 'example': 'Example', 'quote': 'Quote'
                    };
                    
                    const finalTitle = title || titles[mappedType] || 'Note';
                    
                    // 获取内容
                    const allParagraphs = blockquote.querySelectorAll('p');
                    let content = '';
                    
                    if (allParagraphs.length > 1) {
                        for (let i = 1; i < allParagraphs.length; i++) {
                            content += allParagraphs[i].outerHTML;
                        }
                    } else {
                        const firstLineContent = firstP.innerHTML;
                        const calloutRegex = /^\[![^\]]+[+-]?\]\s*[^<]*/i;
                        const remainingContent = firstLineContent.replace(calloutRegex, '').trim();
                        if (remainingContent) {
                            content = '<p>' + remainingContent + '</p>';
                        }
                    }
                    
                    if (!content) content = '<p></p>';
                    
                    // 创建 callout
                    const calloutDiv = document.createElement('div');
                    calloutDiv.className = 'obsidian-callout obsidian-callout-' + mappedType;
                    
                    calloutDiv.innerHTML = '<div class="obsidian-callout-title">' +
                        '<span class="obsidian-callout-icon">' + icon + '</span>' +
                        '<span class="obsidian-callout-title-text">' + finalTitle + '</span>' +
                        '</div>' +
                        '<div class="obsidian-callout-content">' + content + '</div>';
                    
                    // 替换
                    blockquote.parentNode.replaceChild(calloutDiv, blockquote);
                    console.log('替换了 callout:', mappedType, finalTitle, '折叠状态:', foldState || '无');
                }
            }
        });
    }
    
    // 处理高亮
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
            if (text.includes('==')) {
                const regex = /==(.*?)==/g;
                const newHTML = text.replace(regex, '<mark>$1</mark>');
                if (newHTML !== text) {
                    const span = document.createElement('span');
                    span.innerHTML = newHTML;
                    textNode.parentNode.replaceChild(span, textNode);
                    console.log('替换了高亮文本');
                }
            }
        });
    }

    // 执行处理
    processCallouts();
    processHighlights();
    
    console.log('Obsidian 语法处理完成');
});
