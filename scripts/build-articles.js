const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '..', 'content', 'articles');
const OUTPUT_FILE = path.join(__dirname, '..', 'content', 'articles.json');
const TEMPLATE_FILE = path.join(__dirname, '..', 'articles', 'index.html');
const ARTICLES_OUTPUT_DIR = path.join(__dirname, '..', 'articles');
const SITE_URL = 'https://noumenon.jp';

// フロントマターをパース
function parseFrontMatter(content) {
  // Windows (CRLF) と Unix (LF) の両方の改行コードに対応
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return {};
  }

  const frontMatter = match[1];
  const meta = {};

  frontMatter.split(/\r?\n/).forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      // 引用符を除去
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      meta[key] = value;
    }
  });

  return meta;
}

// 記事一覧を生成
function buildArticlesList() {
  // フォルダが存在しない場合は空の配列を出力
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, '[]');
    console.log('Created empty articles.json');
    return;
  }

  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
  const articles = [];

  for (const file of files) {
    const filePath = path.join(ARTICLES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const meta = parseFrontMatter(content);

    // スラッグはファイル名から.mdを除いたもの
    const slug = file.replace('.md', '');

    articles.push({
      slug,
      title: meta.title || 'Untitled',
      date: meta.date || new Date().toISOString(),
      thumbnail: meta.thumbnail || null,
      summary: meta.summary || ''
    });
  }

  // 日付順でソート（新しい順）
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
  console.log(`Generated articles.json with ${articles.length} articles`);

  // 各記事の個別HTMLを生成
  generateArticlePages(articles);
}

// サムネイルパスをフルURLに変換
function getThumbnailUrl(thumbnail) {
  if (!thumbnail) return `${SITE_URL}/OGP.png`;
  if (thumbnail.startsWith('http')) return thumbnail;
  if (thumbnail.startsWith('/')) return `${SITE_URL}${thumbnail}`;
  return `${SITE_URL}/${thumbnail}`;
}

// 各記事の個別HTMLページを生成
function generateArticlePages(articles) {
  if (!fs.existsSync(TEMPLATE_FILE)) {
    console.log('Template file not found, skipping article page generation');
    return;
  }

  const template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

  for (const article of articles) {
    const articleDir = path.join(ARTICLES_OUTPUT_DIR, article.slug);

    // ディレクトリを作成
    if (!fs.existsSync(articleDir)) {
      fs.mkdirSync(articleDir, { recursive: true });
    }

    const thumbnailUrl = getThumbnailUrl(article.thumbnail);
    const articleUrl = `${SITE_URL}/articles/${encodeURIComponent(article.slug)}/`;
    const title = article.title || 'Article';
    const description = article.summary || '';

    // OGPメタタグを置き換え
    let html = template
      .replace(/<title>.*?<\/title>/, `<title>${title} - Noumenon</title>`)
      .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${title} - Noumenon"`)
      .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${description}"`)
      .replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${thumbnailUrl}"`)
      .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${articleUrl}"`)
      .replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${title} - Noumenon"`)
      .replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${description}"`)
      .replace(/<meta name="twitter:image" content="[^"]*"/, `<meta name="twitter:image" content="${thumbnailUrl}"`)
      // 相対パスを調整（1階層深くなるため）
      .replace(/href="\.\.\/favicon\.png"/g, 'href="../../favicon.png"')
      .replace(/href="\.\.\/theme\.css"/g, 'href="../../theme.css"')
      .replace(/href="\.\.\/style2\.css"/g, 'href="../../style2.css"')
      .replace(/href="\.\.\/"/g, 'href="../../"')
      .replace(/href="\.\.\/mixing"/g, 'href="../../mixing"')
      .replace(/href="\.\.\/3danimation"/g, 'href="../../3danimation"')
      .replace(/href="\.\.\/music"/g, 'href="../../music"')
      .replace(/href="\.\.\/planning"/g, 'href="../../planning"')
      .replace(/href="\.\.\/price"/g, 'href="../../price"')
      .replace(/href="\.\.\/other"/g, 'href="../../other"')
      .replace(/href="\.\.\/contact"/g, 'href="../../contact"');

    fs.writeFileSync(path.join(articleDir, 'index.html'), html);
  }

  console.log(`Generated ${articles.length} article pages`);
}

buildArticlesList();
