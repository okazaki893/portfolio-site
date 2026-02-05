// 3-Row Mosaic Layout - YouTube videos, no gaps
// スロットベースのレイアウト（位置固定、リンク・サムネのみ管理画面から変更可能）

const TOP_STORAGE_KEY = 'portfolio_top_videos';

// デフォルトのスロットデータ（admin.htmlと同じ構造）
const defaultTopSlots = [
  { slotName: 'スロット1: Deal with the devil（大）', link: 'https://www.youtube.com/watch?v=73K8Q4F-Uo0', customThumbnail: '' },
  { slotName: 'スロット2: ハオ（縦長）', link: 'https://www.youtube.com/watch?v=ArdkSMvRqxo', customThumbnail: '' },
  { slotName: 'スロット3: 百花繚乱（横長）', link: 'https://www.youtube.com/watch?v=d21zmSD-Oh4', customThumbnail: '' },
  { slotName: 'スロット4: のだ（横長）', link: 'https://www.youtube.com/watch?v=-W3QisNkoCQ', customThumbnail: '' },
  { slotName: 'スロット5: しわ（縦長）', link: 'https://www.youtube.com/watch?v=BAFzZ3hgccU', customThumbnail: '' },
  { slotName: 'スロット6: HALLOWEEN PARTY（横長）', link: 'https://www.youtube.com/watch?v=6hn1pNWSCNI', customThumbnail: '' },
  { slotName: 'スロット7: 泡沫（縦長）', link: 'https://www.youtube.com/watch?v=Et7CpkC1ilI', customThumbnail: '' },
  { slotName: 'スロット8: 脱法ロック（横長）', link: 'https://www.youtube.com/watch?v=Ag9Ay7XJC24', customThumbnail: '' },
  { slotName: 'スロット9: UNDEAD（縦長）', link: 'https://www.youtube.com/watch?v=PBd2yrrnZ-4', customThumbnail: '' },
  { slotName: 'スロット10: Hells Greatest Dad（横長）', link: 'https://www.youtube.com/watch?v=XP-nYV8GAOo', customThumbnail: '' },
  { slotName: 'スロット11: Love Forever（横長）', link: 'https://www.youtube.com/watch?v=khYh9nJxO9o', customThumbnail: '' },
  { slotName: 'スロット12: アンノウン（縦長）', link: 'https://www.youtube.com/watch?v=2X77fyZSIM4', customThumbnail: '' },
  { slotName: 'スロット13: Tonight（横長）', link: 'https://www.youtube.com/watch?v=wXdpFwtZk5A', customThumbnail: '' },
  { slotName: 'スロット14: キングスレイヤー（縦長）', link: 'https://www.youtube.com/watch?v=VVUW23SBnoE', customThumbnail: '' },
  { slotName: 'スロット15: ファタール（横長）', link: 'https://www.youtube.com/watch?v=KWbXAIrVWxk', customThumbnail: '' },
  { slotName: 'スロット16: 私は、私達は（横長）', link: 'https://www.youtube.com/watch?v=ZSEfPjaEjEs', customThumbnail: 'images/onaga-saisho.jpg' },
  { slotName: 'スロット17: 化けの花（最大）', link: 'https://www.youtube.com/watch?v=3qpLV6US96M', customThumbnail: '' }
];

// 古いサムネイルパスを新しいパスに修正
function migrateOldThumbnailPaths(slots) {
  let updated = false;
  slots.forEach(slot => {
    if (slot.customThumbnail && slot.customThumbnail === 'onaga-saisho.jpg') {
      slot.customThumbnail = 'images/onaga-saisho.jpg';
      updated = true;
    }
  });
  if (updated) {
    localStorage.setItem(TOP_STORAGE_KEY, JSON.stringify(slots));
  }
  return slots;
}

// ローカルストレージからスロットデータを読み込み
function loadTopSlots() {
  const saved = localStorage.getItem(TOP_STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    // 新しいフォーマット（slotNameを持つ）かチェック
    if (parsed.length > 0 && parsed[0].slotName) {
      return migrateOldThumbnailPaths(parsed);
    }
    // 古いフォーマットの場合はデフォルトを使用
  }
  return defaultTopSlots;
}

// Initialize mosaic gallery with slot-based layout
function initMosaicGallery() {
  const gallery = document.getElementById('mosaicGallery');
  if (!gallery) return;

  gallery.innerHTML = '';

  const containerHeight = window.innerHeight;
  const unit = containerHeight / 3; // 1ユニット = 1行の高さ

  // スロットデータを読み込み
  const topSlots = loadTopSlots();

  // 固定レイアウト: スロットインデックス, x, y, w, h (単位はunit)
  // インデックスはtopSlotsの配列インデックスに対応
  const layout = [
    // ブロック1: 大きめ + 縦長 + 中横
    { slotIndex: 0, x: 0, y: 0, w: 2.5, h: 2 },      // Deal with the devil（大）
    { slotIndex: 1, x: 2.5, y: 0, w: 0.7, h: 1 },    // ハオ（縦長）
    { slotIndex: 2, x: 3.2, y: 0, w: 2, h: 1 },      // 百花繚乱（横長）
    { slotIndex: 3, x: 2.5, y: 1, w: 1.5, h: 1 },    // のだ（横長）
    { slotIndex: 4, x: 4, y: 1, w: 0.7, h: 1 },      // しわ（縦長）
    { slotIndex: 5, x: 0, y: 2, w: 2, h: 1 },        // HALLOWEEN PARTY（横長）
    { slotIndex: 6, x: 2, y: 2, w: 0.7, h: 1 },      // 泡沫（縦長）
    { slotIndex: 7, x: 2.7, y: 2, w: 2, h: 1 },      // 脱法ロック（横長）

    // ブロック2: 縦長 + 大横 + 中横
    { slotIndex: 8, x: 4.7, y: 1, w: 0.7, h: 1 },    // UNDEAD（縦長）
    { slotIndex: 9, x: 5.2, y: 0, w: 2.3, h: 1 },    // Hells Greatest Dad（横長）
    { slotIndex: 10, x: 5.4, y: 1, w: 2.1, h: 1 },   // Love Forever（横長）
    { slotIndex: 11, x: 4.7, y: 2, w: 0.7, h: 1 },   // アンノウン（縦長）
    { slotIndex: 12, x: 5.4, y: 2, w: 2.1, h: 1 },   // Tonight（横長）

    // ブロック3: 縦長 + 横長 + 化けの花（最大サイズ）
    { slotIndex: 13, x: 7.5, y: 0, w: 0.7, h: 1 },   // キングスレイヤー（縦長）
    { slotIndex: 14, x: 8.2, y: 0, w: 1.3, h: 1 },   // ファタール（横長）
    { slotIndex: 15, x: 7.5, y: 1, w: 2, h: 2 },     // 私は、私達は（横長）
    { slotIndex: 16, x: 9.5, y: 0, w: 16/9*3, h: 3 } // 化けの花（最大）
  ];

  const items = [];
  layout.forEach(item => {
    const slot = topSlots[item.slotIndex];
    if (!slot || !slot.link) {
      console.warn('Slot not found or no link:', item.slotIndex);
      return;
    }
    items.push({
      x: item.x * unit,
      y: item.y * unit,
      width: item.w * unit,
      height: item.h * unit,
      slot: slot
    });
  });

  // 最後のアイテムの右端を計算
  const lastItem = layout[layout.length - 1];
  const loopWidth = (lastItem.x + lastItem.w) * unit;

  // Create 3 copies for seamless loop
  const allItems = [];
  for (let copy = 0; copy < 3; copy++) {
    items.forEach(item => {
      allItems.push({
        ...item,
        x: item.x + (loopWidth * copy)
      });
    });
  }

  const totalWidth = loopWidth * 3;

  // Create track container
  const track = document.createElement('div');
  track.className = 'mosaic-track';
  track.style.position = 'relative';
  track.style.width = `${totalWidth}px`;
  track.style.height = `${containerHeight}px`;

  // Render items
  allItems.forEach((item) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'mosaic-item';
    itemElement.style.cssText = `
      position: absolute;
      left: ${item.x}px;
      top: ${item.y}px;
      width: ${item.width}px;
      height: ${item.height}px;
    `;

    const videoLink = item.slot.link;

    let thumbnailUrl, fallbackUrl;

    if (item.slot.customThumbnail) {
      thumbnailUrl = item.slot.customThumbnail;
      fallbackUrl = item.slot.customThumbnail;
    } else {
      // リンクからビデオIDを抽出
      let thumbnailId = '';
      if (item.slot.link) {
        const match = item.slot.link.match(/[?&]v=([^&]+)/);
        if (match) {
          thumbnailId = match[1];
        }
      }
      thumbnailUrl = `https://img.youtube.com/vi/${thumbnailId}/maxresdefault.jpg`;
      fallbackUrl = `https://img.youtube.com/vi/${thumbnailId}/hqdefault.jpg`;
    }

    itemElement.innerHTML = `
      <a href="${videoLink}" target="_blank" class="mosaic-thumbnail" title="${item.slot.slotName}">
        <img src="${thumbnailUrl}"
             alt="${item.slot.slotName}"
             onerror="this.src='${fallbackUrl}'"
             style="width: 100%; height: 100%; object-fit: cover;">
        <div class="video-overlay"></div>
      </a>
    `;

    track.appendChild(itemElement);
  });

  gallery.appendChild(track);

  console.log('Items placed:', items.length);
  console.log('Loop width:', loopWidth);

  setupWheelScroll(gallery, track, totalWidth, loopWidth);
}

// Setup scrolling with loop
function setupWheelScroll(gallery, track, totalWidth, loopWidth) {
  let scrollPosition = 0;
  let isAutoScrolling = true;
  let autoScrollSpeed = 0.5;

  function autoScroll() {
    if (isAutoScrolling) {
      scrollPosition += autoScrollSpeed;

      if (scrollPosition >= loopWidth) {
        scrollPosition = scrollPosition - loopWidth;
      }

      track.style.transform = `translateX(-${scrollPosition}px)`;
    }
    requestAnimationFrame(autoScroll);
  }

  autoScroll();

  gallery.addEventListener('mouseenter', () => {
    isAutoScrolling = false;
  });

  gallery.addEventListener('mouseleave', () => {
    isAutoScrolling = true;
  });

  gallery.addEventListener('wheel', (e) => {
    if (e.shiftKey) {
      e.preventDefault();

      scrollPosition += e.deltaY * 2;

      if (scrollPosition < 0) {
        scrollPosition = loopWidth + scrollPosition;
      } else if (scrollPosition >= loopWidth) {
        scrollPosition = scrollPosition - loopWidth;
      }

      track.style.transform = `translateX(-${scrollPosition}px)`;
    }
  }, { passive: false });

  let touchStartX = 0;
  gallery.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    isAutoScrolling = false;
  });

  gallery.addEventListener('touchmove', (e) => {
    const touchX = e.touches[0].clientX;
    const diff = touchStartX - touchX;
    scrollPosition += diff;
    touchStartX = touchX;

    if (scrollPosition < 0) {
      scrollPosition = loopWidth + scrollPosition;
    } else if (scrollPosition >= loopWidth) {
      scrollPosition = scrollPosition - loopWidth;
    }

    track.style.transform = `translateX(-${scrollPosition}px)`;
  });

  gallery.addEventListener('touchend', () => {
    isAutoScrolling = true;
  });
}

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initMosaicGallery();
  }, 250);
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMosaicGallery);
} else {
  initMosaicGallery();
}
