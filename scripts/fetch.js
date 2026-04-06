const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function run() {
  const result = {
    douyin: [],
    xiaohongshu: [],
    weibo: [],
    bilibili: [],
    updateTime: new Date().toLocaleString('zh-CN')
  };

  try {
    const wb = await fetchJson('https://api-hot.efei.me/weibo/miniprogram');
    result.weibo = wb.data?.slice(0, 30)?.map(i => ({
      title: i.word,
      hot: i.hotnum + ' 热度'
    })) || [];
  } catch (e) {}

  try {
    const b = await fetchJson('https://api-hot.efei.me/bilibili/ranking');
    result.bilibili = b.data?.list?.slice(0, 30)?.map(i => ({
      title: i.title,
      hot: i.play + ' 播放'
    })) || [];
  } catch (e) {}

  result.douyin = [
    { title: "抖音热门演示1", hot: "100w+" },
    { title: "抖音热门演示2", hot: "90w+" }
  ];
  result.xiaohongshu = [
    { title: "小红书爆款演示1", hot: "热门" },
    { title: "小红书爆款演示2", hot: "热门" }
  ];

  const dir = path.join(__dirname, '../data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'hot.json'), JSON.stringify(result, null, 2));

  console.log('✅ 热榜更新完成:', result.updateTime);
}

run();
