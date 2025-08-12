// Obsidian 语法处理器 - 调试版本
console.log('=== Obsidian 语法处理器已加载 ===');

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOMContentLoaded 事件触发 ===');
    console.log('开始处理 Obsidian 语法');
    
    // 检查页面内容
    const allBlockquotes = document.querySelectorAll('blockquote');
    console.log('找到的 blockquote 数量:', allBlockquotes.length);
    
    allBlockquotes.forEach((bq, index) => {
        console.log(`Blockquote ${index}:`, bq.textContent.trim());
    });
    
    // 处理 callout 语法
    function processCallouts() {
        console.log('=== 开始处理 callout 语法 ===');
        const blockquotes = document.querySelectorAll('blockquote');
        
        blockquotes.forEach((blockquote, index) => {
            console.log(`处理第 ${index} 个 blockquote`);
            const firstP = blockquote.querySelector('p');
            if (firstP) {
                const text = firstP.textContent.trim();
                console.log('blockquote 内容:', text);
                
                // 支持折叠语法和自定义标题的匹配：[!TYPE+/-] Title
                const calloutMatch = text.match(/^\[!([a-zA-Z]+)([+-]?)\]\s*(.*)/i);
                console.log('正则匹配结果:', calloutMatch);
                
                if (calloutMatch) {
                    const originalType = calloutMatch[1].toLowerCase();
                    const foldState = calloutMatch[2]; // '+', '-', 或空字符串
                    const title = calloutMatch[3].trim();
                    console.log('找到 callout - 类型:', originalType, '折叠状态:', foldState, '标题:', title);
                    
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
                    
                    console.log('映射后的类型:', mappedType);
                    
                    // 图标映射
                    const icons = {
                        'note': '📝', 'abstract': '📄', 'info': 'ℹ️', 'todo': '📋',
                        'tip': '💡', 'success': '✅', 'question': '❓', 'warning': '⚠️',
                        'failure': '❌', 'danger': '🚨', 'bug': '🐛', 'example': '📋', 'quote': '💬'
                    };
                    
                    const icon = icons[mappedType] || '📝';
                    console.log('使用的图标:', icon);
                    
                    // 默认标题
                    const titles = {
                        'note': 'Note', 'abstract': 'Abstract', 'info': 'Info', 'todo': 'Todo',
                        'tip': 'Tip', 'success': 'Success', 'question': 'Question', 'warning': 'Warning',
                        'failure': 'Failure', 'danger': 'Danger', 'bug': 'Bug', 'example': 'Example', 'quote': 'Quote'
                    };
                    
                    const finalTitle = title || titles[mappedType] || 'Note';
                    console.log('最终标题:', finalTitle);
                    
                    // 创建 callout
                    const calloutDiv = document.createElement('div');
                    calloutDiv.className = 'obsidian-callout obsidian-callout-' + mappedType;
                    
                    console.log('创建的类名:', calloutDiv.className);
                    
                    calloutDiv.innerHTML = '<div class="obsidian-callout-title">' +
                        '<span class="obsidian-callout-icon">' + icon + '</span>' +
                        '<span class="obsidian-callout-title-text">' + finalTitle + '</span>' +
                        '</div>' +
                        '<div class="obsidian-callout-content"><p>测试内容</p></div>';
                    
                    // 替换
                    blockquote.parentNode.replaceChild(calloutDiv, blockquote);
                    console.log('✅ 成功替换 callout:', mappedType, finalTitle);
                } else {
                    console.log('❌ 未匹配到 callout 模式');
                }
            } else {
                console.log('❌ 未找到 p 标签');
            }
        });
    }
    
    // 执行处理
    processCallouts();
    
    console.log('=== Obsidian 语法处理完成 ===');
});
