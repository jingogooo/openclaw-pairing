# OpenClaw Pairing Plugin / OpenClaw 设备配对插件

<p align="center">
  <b>Cross-platform device pairing plugin for OpenClaw</b><br>
  <b>OpenClaw 跨平台设备配对插件</b>
</p>

<p align="center">
  Supports Android, HarmonyOS, and iOS feiclaw apps<br>
  支持 Android、鸿蒙、iOS 三端飞虾应用
</p>

---

## Features / 功能特性

| English | 中文 |
|---------|------|
| 🚀 **One-command pairing** - No QR codes or manual setup codes | 🚀 **一键配对** - 无需二维码或手动输入 setup code |
| 📱 **Multi-platform** - Android, HarmonyOS, iOS support | 📱 **多平台支持** - Android、鸿蒙、iOS 三端通用 |
| 🔒 **Secure** - Public key cryptography, time-limited claims | 🔒 **安全可靠** - 公钥加密、限时令牌 |
| ⚡ **Fast** - Complete pairing in 10-30 seconds | ⚡ **极速配对** - 10-30 秒完成配对 |

---

## Visual Guide / 图解教程

### Pairing Flow / 配对流程图

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   飞虾 App       │         │   配对插件       │         │   OpenClaw      │
│  (手机端)        │         │  (电脑端)        │         │  (网关)         │
└────────┬────────┘         └────────┬────────┘         └────────┬────────┘
         │                           │                           │
         │  1. 点击"一键配对"         │                           │
         │     生成 Claim            │                           │
         │───────────────────────────>│                           │
         │                           │                           │
         │  2. 显示配对指令           │                           │
         │<───────────────────────────│                           │
         │                           │                           │
         │                           │  3. 复制到电脑执行          │
         │                           │  openclaw pair-android     │
         │                           │───────────────────────────>│
         │                           │                           │
         │                           │  4. 生成 Setup Code        │
         │                           │<───────────────────────────│
         │                           │                           │
         │  5. App 自动获取 Setup Code                           │
         │───────────────────────────>│                           │
         │                           │                           │
         │  6. 完成配对，连接成功！    │                           │
         │<───────────────────────────│                           │
```

### App Screenshots / App 界面示意图

> Currently only Android client is available. HarmonyOS and iOS clients are in development.<br>
> 目前仅支持 Android 客户端。鸿蒙和 iOS 客户端正在开发中。

<details>
<summary>📱 Android 安卓端（点击展开）</summary>

#### Step 1: Start Pairing / 开始配对
```
┌─────────────────────────────┐
│  ≡  飞虾 FeiClaw      ⚙️   │
├─────────────────────────────┤
│                             │
│   ┌─────────────────────┐   │
│   │    📱  设备连接      │   │
│   │                     │   │
│   │  [ 🔍 开始配对 ]    │   │
│   └─────────────────────┘   │
└─────────────────────────────┘
```

#### Step 2: Copy Command / 复制指令
```
┌─────────────────────────────┐
│  ←  一键配对                │
├─────────────────────────────┤
│                             │
│  ✅ 配对指令已生成！         │
│                             │
│  ┌─────────────────────┐    │
│  │ openclaw pair-andro │    │
│  │ id --claim "eyJ...  │    │
│  └─────────────────────┘    │
│                             │
│  [ 📋 复制指令 ]            │
│                             │
│  状态: ⏳ 等待执行...        │
└─────────────────────────────┘
```

#### Step 3: Success / 配对成功
```
┌─────────────────────────────┐
│      配对成功！              │
│           ✅                │
│   设备已连接到 OpenClaw      │
│   [ 🏠 返回首页 ]           │
└─────────────────────────────┘
```

</details>

### Computer Terminal / 电脑终端

```
┌─────────────────────────────────────────────────────────┐
│  💻 电脑端 - 终端                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  $ openclaw pair-android --claim "eyJ2IjoxLCJjbGFpbVRv │
│  a2VuIjo..."                                             │
│                                                          │
│  ✓ OpenClaw Pairing Plugin 已加载                        │
│  ✓ 验证 claim... 成功                                    │
│  ✓ 生成 setup code... 完成                               │
│  ✓ 注册设备声明... 成功                                   │
│                                                          │
│  ✅ Pairing successful!                                  │
│     Device: feiclaw-android-abc123                       │
│     Gateway: http://localhost:8080                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

More diagrams: [docs/pairing-flow.md](./docs/pairing-flow.md)

---

## Quick Start / 快速开始

### For End Users / 终端用户

#### 1. Install Plugin on Computer / 在电脑安装插件

```bash
# One-line install / 一键安装
curl -fsSL https://github.com/feiclaw/openclaw-pairing/releases/latest/install.sh | sh
```

#### 2. Open Feiclaw App on Phone / 在手机上打开飞虾 App

**Android:** 打开 App → 点击"开始配对" → 选择"一键配对"

> **Note:** HarmonyOS and iOS clients are in development.
> **注意：** 鸿蒙和 iOS 客户端正在开发中。

#### 3. Copy Command from App / 从 App 复制指令

App 会生成类似这样的指令：
```bash
openclaw pair-android --claim "eyJ2IjoxLCJjbGFpbVRva2VuIjoi..."
```

#### 4. Paste & Execute on Computer / 在电脑粘贴并执行

```bash
# Paste the command from your phone / 粘贴从手机复制的指令
openclaw pair-android --claim "<paste-your-claim-here>"
```

#### 5. Done! / 完成！

App 会自动完成配对并显示成功信息。

---

## Installation / 安装方法

### One-line Install (Recommended) / 一键安装（推荐）

```bash
curl -fsSL https://github.com/feiclaw/openclaw-pairing/releases/latest/install.sh | sh
```

### Via OpenClaw Plugins / 通过 OpenClaw 插件安装

```bash
openclaw plugins install github:feiclaw/openclaw-pairing
```

### Manual Install / 手动安装

```bash
git clone https://github.com/feiclaw/openclaw-pairing.git
cd openclaw-pairing
npm install
npm run build
npm link
```

---

## Usage / 使用方法

### Platform-Specific Commands / 各平台命令

| Platform | Status | Command |
|----------|--------|---------|
| Android | ✅ Available | `openclaw pair-android --claim "<payload>"` |
| HarmonyOS | 🚧 In Development | `openclaw pair-harmony --claim "<payload>"` |
| iOS | 🚧 In Development | `openclaw pair-ios --claim "<payload>"` |
| Auto-detect | ✅ Available | `openclaw pair-auto --claim "<payload>"` |

### Auto-detect Platform / 自动检测平台

```bash
openclaw pair-auto --claim "<base64-claim-payload>"
```

---

## How It Works / 工作原理

| Step | English | 中文 |
|------|---------|------|
| 1 | **App generates claim** - Device creates a claim with deviceId, publicKey, and claimToken | **App 生成 claim** - 设备创建包含 deviceId、publicKey 和 claimToken 的声明 |
| 2 | **Send to OpenClaw** - Claim is sent to OpenClaw via this plugin | **发送到 OpenClaw** - 通过此插件将 claim 发送到 OpenClaw |
| 3 | **Generate setup code** - Plugin creates a secure setup code with bootstrap tokens | **生成 setup code** - 插件生成包含 bootstrap token 的安全设置码 |
| 4 | **Auto-complete** - App polls for setup code and completes pairing automatically | **自动完成** - App 轮询获取 setup code 并自动完成配对 |

---

## Security / 安全性

| Feature | English | 中文 |
|---------|---------|------|
| Expiration | Claims expire after 5 minutes | Claim 5 分钟后过期 |
| One-time | One-time use claim tokens | 一次性 claim token |
| Verification | Public key verification | 公钥验证 |
| Minimal Scope | Bootstrap tokens with minimal required scopes | 最小权限的 bootstrap token |

---

## Troubleshooting / 故障排除

### Plugin not installed / 插件未安装

如果提示 `pair-android` 命令不存在：

```bash
# 安装插件
openclaw plugins install github:feiclaw/openclaw-pairing

# 或使用一键安装脚本
curl -fsSL https://github.com/feiclaw/openclaw-pairing/releases/latest/install.sh | sh
```

### Pairing timeout / 配对超时

- 确保电脑和手机在同一网络
- 检查 OpenClaw 是否正常运行
- 重新生成配对指令

---

## Roadmap / 路线图

- [x] Android client support
- [ ] HarmonyOS client (In Development)
- [ ] iOS client (In Development)
- [ ] NPM package publish
- [ ] Web-based pairing (no plugin installation required)

---

## Development / 开发

```bash
# Install dependencies / 安装依赖
npm install

# Build / 构建
npm run build

# Watch mode / 监听模式
npm run watch

# Test / 测试
npm test
```

---

## Contributing / 贡献

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

详情请参阅 [CONTRIBUTING.md](./CONTRIBUTING.md)。

---

## Quick Start Guide / 快速开始指南

See [QUICKSTART.md](./QUICKSTART.md) for a step-by-step guide.

步骤指南请参阅 [QUICKSTART.md](./QUICKSTART.md)。

---

## License / 许可证

MIT License / MIT 许可证

Copyright (c) 2026 feiclaw
