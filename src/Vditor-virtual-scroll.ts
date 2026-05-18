// ─────────────────────────────────────────────
// 块的状态定义
// ─────────────────────────────────────────────
interface Chunk {
  index: number;
  nodes: Element[];       // 解析好的 DOM 节点
  height: number;         // 渲染后记录真实高度，用于占位
  rendered: boolean;      // 当前是否已挂载真实 DOM
}

// ─────────────────────────────────────────────
// 虚拟滚动核心类
// ─────────────────────────────────────────────
export class VditorVirtualScroll {
  private container: HTMLElement;
  private chunks: Chunk[];
  private chunkEls: HTMLElement[];   // 每块对应的外壳 div
  private observer!: IntersectionObserver;

  // 上下缓冲区：视口外额外保留的块数，防止滚动白屏
  private readonly BUFFER = 3;

  constructor(container: HTMLElement, chunks: Chunk[]) {
    this.container = container;
    this.chunks = chunks;
    this.chunkEls = [];
  }

  init() {
    this._buildShells();      // 先构建所有空壳（占位 div）
    this._setupObserver();    // 监听哪些壳进入视口
  }

  // ─────────────────────────────────────────
  // 1. 构建所有空壳占位 div（不插入真实内容）
  // ─────────────────────────────────────────
  private _buildShells() {
    const fragment = document.createDocumentFragment();

    this.chunks.forEach((chunk, index) => {
      const shell = document.createElement('div');
      shell.dataset.index = String(index);
      shell.style.minHeight = chunk.height > 0 ? `${chunk.height}px` : '60px';
      shell.className = 'vditor-chunk-shell';

      this.chunkEls.push(shell);
      fragment.appendChild(shell);
    });

    this.container.appendChild(fragment);
  }

  // ─────────────────────────────────────────
  // 2. IntersectionObserver 监听壳的可见性
  // ─────────────────────────────────────────
  private _setupObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const index = parseInt(
            (entry.target as HTMLElement).dataset.index!, 10
          );

          if (entry.isIntersecting) {
            // 进入视口：挂载真实 DOM，同时预渲染缓冲区
            this._mountRange(index - this.BUFFER, index + this.BUFFER);
          } else {
            // 离开视口：卸载真实 DOM，替换为占位
            // 延迟卸载，防止快速滚动时频繁挂载/卸载
            setTimeout(() => {
              if (!this._isVisible(index)) {
                this._unmountRange(0, index - this.BUFFER - 1);
                this._unmountRange(index + this.BUFFER + 1, this.chunks.length - 1);
              }
            }, 500);
          }
        });
      },
      {
        root: this.container,
        rootMargin: '400px 0px',  // 提前 400px 触发，滚动无白屏
        threshold: 0,
      }
    );

    this.chunkEls.forEach(el => this.observer.observe(el));
  }

  // ─────────────────────────────────────────
  // 3. 挂载一个范围内的块（真实 DOM）
  // ─────────────────────────────────────────
  private _mountRange(from: number, to: number) {
    const start = Math.max(0, from);
    const end = Math.min(this.chunks.length - 1, to);

    for (let i = start; i <= end; i++) {
      this._mountChunk(i);
    }
  }

  private _mountChunk(index: number) {
    const chunk = this.chunks[index];
    const shell = this.chunkEls[index];

    if (chunk.rendered) return; // 已挂载，跳过
    chunk.rendered = true;

    // 清空占位，插入真实节点
    shell.innerHTML = '';
    const fragment = document.createDocumentFragment();
    chunk.nodes.forEach(node => fragment.appendChild(node.cloneNode(true)));
    shell.appendChild(fragment);

    // 记录真实高度，下次卸载时占位用
    // 用 requestAnimationFrame 确保浏览器完成布局后再测量
    requestAnimationFrame(() => {
      chunk.height = shell.offsetHeight;
    });
  }

  // ─────────────────────────────────────────
  // 4. 卸载一个范围内的块（替换为占位）
  // ─────────────────────────────────────────
  private _unmountRange(from: number, to: number) {
    const start = Math.max(0, from);
    const end = Math.min(this.chunks.length - 1, to);

    for (let i = start; i <= end; i++) {
      this._unmountChunk(i);
    }
  }

  private _unmountChunk(index: number) {
    const chunk = this.chunks[index];
    const shell = this.chunkEls[index];

    if (!chunk.rendered) return; // 已是占位，跳过
    chunk.rendered = false;

    // 用记录的真实高度撑起占位，保持滚动条位置不跳动
    shell.innerHTML = '';
    shell.style.height = `${chunk.height}px`;
  }

  // ─────────────────────────────────────────
  // 5. 判断某块当前是否在视口内
  // ─────────────────────────────────────────
  private _isVisible(index: number): boolean {
    const shell = this.chunkEls[index];
    const rect = shell.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();
    return rect.bottom > containerRect.top && rect.top < containerRect.bottom;
  }

  // ─────────────────────────────────────────
  // 6. 销毁（模态关闭时调用）
  // ─────────────────────────────────────────
  destroy() {
    this.observer.disconnect();
    this.container.innerHTML = '';
    this.chunks.forEach(c => { c.rendered = false; });
    this.chunkEls = [];
  }
}