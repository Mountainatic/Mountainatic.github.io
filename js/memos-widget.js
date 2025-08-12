// Memos Widget JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const memosContainers = document.querySelectorAll('.memos-container');
    
    memosContainers.forEach(container => {
        const memosUrl = container.dataset.memosUrl;
        const limit = parseInt(container.dataset.limit) || 5;
        const loadingEl = container.querySelector('.memos-loading');
        const listEl = container.querySelector('.memos-list');
        const errorEl = container.querySelector('.memos-error');
        
        // 构建 API URL
        const apiUrl = `${memosUrl}/api/v1/memos?limit=${limit}`;
        
        // 加载 Memos 数据
        loadMemos(apiUrl, loadingEl, listEl, errorEl);
    });
});

async function loadMemos(apiUrl, loadingEl, listEl, errorEl) {
    try {
        console.log('Loading memos from:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            // 允许跨域请求
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Memos data:', data);
        
        // 显示 Memos
        displayMemos(data.memos || data, listEl);
        
        // 隐藏加载状态，显示列表
        loadingEl.style.display = 'none';
        listEl.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading memos:', error);
        
        // 显示错误状态
        loadingEl.style.display = 'none';
        
        // 检查是否是生产环境且启用了 fallbackMode
        const container = loadingEl.closest('.memos-container');
        const isFallbackMode = container.closest('.widget').dataset.fallbackMode === 'true';
        
        if (isFallbackMode || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // 生产环境显示友好提示，开发环境显示模拟数据
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                displayMockMemos(listEl);
                listEl.style.display = 'block';
            } else {
                displayFallbackMessage(listEl);
                listEl.style.display = 'block';
            }
        } else {
            errorEl.style.display = 'block';
        }
    }
}

function displayMemos(memos, container) {
    if (!memos || memos.length === 0) {
        container.innerHTML = '<div class="memo-item"><div class="memo-content">暂无内容</div></div>';
        return;
    }
    
    const memosHtml = memos.map(memo => {
        const content = processMemosContent(memo.content || memo.text || '');
        const createdTime = formatTime(memo.createdTs || memo.created_ts || memo.createdAt);
        const tags = extractTags(memo.content || memo.text || '');
        
        return `
            <div class="memo-item">
                <div class="memo-content">${content}</div>
                <div class="memo-meta">
                    <span class="memo-time">${createdTime}</span>
                    ${tags.length > 0 ? `<div class="memo-tags">${tags.map(tag => `<span class="memo-tag">${tag}</span>`).join('')}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = memosHtml;
}

function displayFallbackMessage(container) {
    const fallbackHtml = `
        <div class="memo-item memo-fallback">
            <div class="memo-content">
                <p>✨ Memos 功能正在准备中...</p>
                <p>这里将显示最新的想法和随记。</p>
            </div>
            <div class="memo-meta">
                <span class="memo-time">敬请期待</span>
            </div>
        </div>
    `;
    container.innerHTML = fallbackHtml;
}

function displayMockMemos(container) {
    const mockMemos = [
        {
            content: "今天学习了 Hugo 的 widget 系统，发现可以很方便地扩展功能！ #Hugo #学习",
            createdTs: Date.now() - 3600000 // 1小时前
        },
        {
            content: "正在尝试将 Memos 集成到博客中，这样可以记录一些零碎的想法。",
            createdTs: Date.now() - 7200000 // 2小时前
        },
        {
            content: "Obsidian 的语法在 Hugo 中也能很好地支持，迁移内容变得简单多了！ #Obsidian #迁移",
            createdTs: Date.now() - 86400000 // 1天前
        }
    ];
    
    displayMemos(mockMemos, container);
}

function processMemosContent(content) {
    if (!content) return '';
    
    // 处理 Markdown 基础语法
    let processed = content
        // 处理链接
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        // 处理粗体
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        // 处理斜体
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        // 处理行内代码
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // 移除标签（在下面单独处理）
        .replace(/#\w+/g, '')
        // 处理换行
        .replace(/\n/g, '<br>');
    
    return `<p>${processed.trim()}</p>`;
}

function extractTags(content) {
    if (!content) return [];
    
    const tagRegex = /#(\w+)/g;
    const tags = [];
    let match;
    
    while ((match = tagRegex.exec(content)) !== null) {
        tags.push(match[1]);
    }
    
    return tags;
}

function formatTime(timestamp) {
    if (!timestamp) return '';
    
    const date = new Date(typeof timestamp === 'number' ? timestamp : timestamp * 1000);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
        return `${minutes}分钟前`;
    } else if (hours < 24) {
        return `${hours}小时前`;
    } else if (days < 7) {
        return `${days}天前`;
    } else {
        return date.toLocaleDateString('zh-CN', {
            month: 'short',
            day: 'numeric'
        });
    }
}
