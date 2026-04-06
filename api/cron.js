const { execSync } = require('child_process');

module.exports = (req, res) => {
  try {
    execSync('node scripts/fetch.js', { stdio: 'ignore' });
    res.status(200).send('✅ 每日热榜更新成功');
  } catch (e) {
    res.status(500).send('❌ 更新失败');
  }
};
