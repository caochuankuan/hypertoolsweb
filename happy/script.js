// 祝福语列表
const blessings = [
    "八方来财", "生财有道", "富贵有余",
    "一帆风顺", "顺遂无忧", "人际舒展",
    "松弛", "温柔坚定", "情安稳",
    "笑常伴", "富贵有余", "没有烦恼",
    "无忧无虑", "从容不迫", "突破局限",
    "情自治", "清醒自知", "开阔",
    "精进", "乐观", "踏实",
    "无虞", "身自在", "勇敢",
    "自愈力强", "通透", "财运旺",
    "蜕变", "有盼头", "安稳度日",
    "坚强", "沉稳清醒", "一帆风顺",
    "心无杂念", "松弛", "八方来财",
    "生活有序", "温柔坚定", "生财有道",
    "利相随", "内核稳定", "从容",
    "自足", "得胜", "健康",
    "理性", "自愈力强", "做自己",
    "自在", "幸福", "事顺遂",
    "有分寸", "明辨", "自律",
    "情绪稳定", "财气盛", "作息规律",
    "少遗憾", "坚韧", "自由",
    "内心丰盈", "睡眠安稳", "踏实",
    "明辨是非", "保持热爱", "担率",
    "乐无忧", "常欢喜", "富贵有余"
];

// 开启按钮点击事件
const startButton = document.getElementById('startButton');
const startPage = document.getElementById('startPage');
const blessingPage = document.getElementById('blessingPage');

startButton.addEventListener('click', () => {
    // 隐藏开启页面
    startPage.style.opacity = '0';
    
    setTimeout(() => {
        startPage.style.display = 'none';
        blessingPage.classList.add('active');
        
        // 延迟启动动画
        setTimeout(() => {
            initBlessingPage();
        }, 500);
    }, 500);
});

// 烟花粒子类
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 2 + 1;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.gravity = 0.1;
        this.opacity = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.opacity -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 初始化画布
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

// 创建烟花
function createFirework(x, y) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#6bcf7f', '#c792ea', '#ff8b94'];
    const particleCount = 80;
    
    for (let i = 0; i < particleCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, color));
    }
}

// 动画循环
function animate() {
    // 只有在有粒子时才清除画布
    if (particles.length > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    particles.forEach((particle, index) => {
        if (particle.opacity <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update();
            particle.draw(ctx);
        }
    });
    
    requestAnimationFrame(animate);
}

// 显示祝福语动画
let blessingIndex = 0;
const container = document.getElementById('blessingContainer');
const displayedPositions = [];

function getRandomPosition() {
    const maxAttempts = 100;
    const isMobile = window.innerWidth <= 768;
    const minDistance = isMobile ? 8 : 6; // 进一步缩小间距
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const x = Math.random() * 90 + 5;
        const y = Math.random() * 90 + 5;
        
        // 缩小中心避让区域，只避开文案本身
        const centerMarginX = isMobile ? 25 : 20;
        const centerMarginY = isMobile ? 15 : 12;
        const isInCenterX = x > (50 - centerMarginX) && x < (50 + centerMarginX);
        const isInCenterY = y > (50 - centerMarginY) && y < (50 + centerMarginY);
        
        if (isInCenterX && isInCenterY) {
            continue; // 跳过中心区域
        }
        
        let tooClose = false;
        for (const pos of displayedPositions) {
            const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
            if (distance < minDistance) {
                tooClose = true;
                break;
            }
        }
        
        if (!tooClose) {
            displayedPositions.push({ x, y });
            return { x, y };
        }
    }
    
    // 如果找不到位置，返回null，停止添加
    return null;
}

function showBlessing() {
    if (blessingIndex < blessings.length) {
        const pos = getRandomPosition();
        
        // 如果找不到合适位置，跳过这个祝福语
        if (!pos) {
            blessingIndex++;
            const delay = blessingIndex < 10 ? 500 : 
                         blessingIndex < 30 ? 300 : 150;
            setTimeout(showBlessing, delay);
            return;
        }
        
        const blessing = document.createElement('div');
        blessing.className = 'blessing';
        blessing.textContent = blessings[blessingIndex];
        
        blessing.style.left = pos.x + '%';
        blessing.style.top = pos.y + '%';
        
        container.appendChild(blessing);
        blessingIndex++;
        
        const delay = blessingIndex < 10 ? 500 : 
                     blessingIndex < 30 ? 300 : 150;
        
        setTimeout(showBlessing, delay);
    } else {
        // 祝福语显示完毕，开始烟花
        setTimeout(startFireworks, 500);
    }
}

// 开始烟花表演
function startFireworks() {
    // 启动canvas动画
    animate();
    
    setInterval(() => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height * 0.6) + canvas.height * 0.2;
        createFirework(x, y);
    }, 800);
}

// 初始化祝福页面
function initBlessingPage() {
    // 不立即启动canvas动画，等有烟花时再启动
    setTimeout(showBlessing, 500);
}

// 刷新按钮功能（刷新所有按钮）
const refreshButtons = document.querySelectorAll('.refresh-icon');
refreshButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        location.reload();
    });
});

// 窗口大小改变时重新设置画布大小
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
