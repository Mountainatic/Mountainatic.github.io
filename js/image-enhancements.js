// 图片增强功能
document.addEventListener('DOMContentLoaded', function() {
    console.log('图片增强功能已加载');
    
    // 处理 Obsidian 风格的图片尺寸语法
    function processImageSizes() {
        const images = document.querySelectorAll('.responsive-image');
        
        images.forEach(img => {
            const figcaption = img.parentNode.querySelector('figcaption');
            if (figcaption) {
                const text = figcaption.textContent;
                
                // 检查是否有尺寸信息，格式：alt|width 或 alt|widthxheight
                if (text.includes('|')) {
                    const parts = text.split('|');
                    if (parts.length >= 2) {
                        const altText = parts[0].trim();
                        const sizeInfo = parts[1].trim();
                        
                        // 更新 alt 文本
                        img.alt = altText;
                        figcaption.textContent = altText;
                        
                        // 解析尺寸信息
                        if (sizeInfo.includes('x')) {
                            // widthxheight 格式
                            const dimensions = sizeInfo.split('x');
                            const width = dimensions[0].trim();
                            const height = dimensions[1] ? dimensions[1].trim() : '';
                            
                            const widthValue = width.endsWith('px') ? width : width + 'px';
                            const heightValue = height ? (height.endsWith('px') ? height : height + 'px') : '';
                            
                            // 使用 setProperty 来设置样式，确保优先级
                            img.style.setProperty('max-width', widthValue, 'important');
                            img.style.setProperty('width', widthValue, 'important');
                            if (heightValue) {
                                img.style.setProperty('max-height', heightValue, 'important');
                                img.style.setProperty('height', heightValue, 'important');
                                img.style.setProperty('object-fit', 'cover', 'important');
                                img.style.setProperty('display', 'block', 'important');
                            }
                            // 添加标记以便CSS识别
                            img.setAttribute('data-fixed-size', 'true');
                            
                            // 添加调试信息
                            console.log('设置固定尺寸:', altText, `${width}x${height}`, 'img.style.width:', img.style.width, 'img.style.height:', img.style.height);
                        } else {
                            // 只有 width 格式
                            const widthValue = sizeInfo.endsWith('px') ? sizeInfo : sizeInfo + 'px';
                            img.style.setProperty('max-width', widthValue, 'important');
                            img.style.setProperty('width', widthValue, 'important');
                            
                            console.log('设置固定宽度:', altText, sizeInfo, 'img.style.width:', img.style.width);
                        }
                        
                        console.log('处理图片尺寸:', altText, sizeInfo);
                    }
                }
            }
        });
    }
    
    // 创建全屏查看器
    function createImageViewer() {
        const overlay = document.createElement('div');
        overlay.className = 'image-fullscreen-overlay';
        overlay.innerHTML = `
            <button class="image-fullscreen-close" aria-label="关闭">&times;</button>
            <img src="" alt="" />
        `;
        document.body.appendChild(overlay);
        return overlay;
    }
    
    // 获取或创建全屏查看器
    let imageViewer = document.querySelector('.image-fullscreen-overlay');
    if (!imageViewer) {
        imageViewer = createImageViewer();
    }
    
    const viewerImg = imageViewer.querySelector('img');
    const closeBtn = imageViewer.querySelector('.image-fullscreen-close');
    
    // 打开全屏查看
    function openImageViewer(imgSrc, imgAlt) {
        viewerImg.src = imgSrc;
        viewerImg.alt = imgAlt || '';
        imageViewer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭全屏查看
    function closeImageViewer() {
        imageViewer.classList.remove('active');
        document.body.style.overflow = '';
        // 延迟清除 src 以避免闪烁
        setTimeout(() => {
            if (!imageViewer.classList.contains('active')) {
                viewerImg.src = '';
            }
        }, 300);
    }
    
    // 为所有响应式图片添加点击事件
    function initImageClickHandlers() {
        const images = document.querySelectorAll('.responsive-image');
        
        images.forEach(img => {
            // 避免重复绑定
            if (img.dataset.clickHandlerAdded) return;
            
            img.addEventListener('click', function(e) {
                e.preventDefault();
                const imgSrc = this.src;
                const imgAlt = this.alt;
                openImageViewer(imgSrc, imgAlt);
            });
            
            img.dataset.clickHandlerAdded = 'true';
        });
    }
    
    // 关闭按钮事件
    closeBtn.addEventListener('click', closeImageViewer);
    
    // 点击背景关闭
    imageViewer.addEventListener('click', function(e) {
        if (e.target === this) {
            closeImageViewer();
        }
    });
    
    // ESC 键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageViewer.classList.contains('active')) {
            closeImageViewer();
        }
    });
    
    // 初始化
    processImageSizes();
    initImageClickHandlers();
    
    // 监听动态添加的图片（如果有的话）
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && node.classList.contains('responsive-image')) {
                            initImageClickHandlers();
                        } else if (node.querySelectorAll) {
                            const newImages = node.querySelectorAll('.responsive-image');
                            if (newImages.length > 0) {
                                initImageClickHandlers();
                            }
                        }
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('图片增强功能初始化完成');
});
