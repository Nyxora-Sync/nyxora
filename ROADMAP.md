# Nyxora Sync Roadmap

This document outlines the planned and future tracks for Nyxora Sync. These tracks are either planned for the future, marked as advanced/experimental, or waiting for contributors. **They are not ready for learners yet.**

## Planned Tracks

### 🟡 Embedded Systems & IoT
**Status**: Planned | **Estimated**: ~40 lessons, ~120 hours
- Arduino Fundamentals — GPIO, PWM, I2C/SPI, interrupts, and libraries
- ESP32 WiFi & Bluetooth — Web servers, BLE, MQTT, OTA updates
- Sensors & Actuators — Temperature, distance, motors, displays
- RTOS & FreeRTOS — Tasks, queues, semaphores, timing
- IoT Cloud Integration — AWS IoT, Azure, MQTT brokers
- PCB Design Basics — KiCad, schematics, layout, manufacturing

> **Note**: Requires hardware (Arduino/ESP32) or simulator (Wokwi). Content not yet written.

---

### 🟣 Mobile Development (Cross-Platform)
**Status**: Planned | **Estimated**: ~30 lessons, ~90 hours
- Expo & React Native Basics — Setup, navigation, core components
- Native Modules & Device APIs — Camera, location, push notifications
- Offline-First & Sync — Local storage, background sync, conflict resolution
- Store Deployment — App Store, Play Store, EAS Build

> **Note**: React Native specialization track exists but is incomplete.

---

### 🌸 Data Science & AI
**Status**: Planned | **Estimated**: ~35 lessons, ~100 hours
- Python for Data — NumPy, Pandas, visualization
- Machine Learning Fundamentals — scikit-learn, model evaluation, pipelines
- Deep Learning Intro — PyTorch, neural networks, CNNs, RNNs
- LLMs & RAG — Embeddings, vector databases, retrieval-augmented generation
- MLOps Basics — Model serving, monitoring, drift detection

> **Note**: Python track exists; this extends it toward ML engineering.

---

### 🟠 Game Development
**Status**: Planned | **Estimated**: ~25 lessons, ~80 hours
- Game Dev Fundamentals — Loops, input, rendering, physics basics
- 2D with Phaser/Godot — Sprites, tilemaps, collisions, scenes
- 3D with Three.js/Godot — Meshes, lighting, cameras, animation
- Multiplayer & Networking — WebRTC, WebSockets, authoritative servers

> **Note**: No content yet. Seeking contributors with game dev experience.

---

### ⚫ Desktop Applications
**Status**: Planned | **Estimated**: ~20 lessons, ~60 hours
- Tauri & Rust Basics — Rust fundamentals for web devs
- Tauri App Architecture — Commands, events, window management
- System Integration — Tray, notifications, auto-updates, file associations
- Distribution & Signing — MSIX, DMG, AppImage, code signing

> **Note**: Requires Rust knowledge. Could follow C/C++ tracks.

---

## Advanced / Experimental Modules

These modules exist in the private development repository but are hidden from main navigation. They target specialists, not job-seeking learners.

### C Advanced Modules (Modules 4-8)
- Linux kernel internals, custom allocators, VFS, eBPF, kernel modules, device drivers
- Target: OS developers and kernel engineers

### C++ Advanced Modules
- Template metaprogramming, SIMD, coroutines, custom allocators, lock-free programming
- Target: Expert-level C++ engineers

### C# Advanced Modules
- Orleans/Actors, Source Generators, Native AOT, advanced ASP.NET Core internals
- Target: Senior .NET engineers

### Python Advanced Modules
- CPython internals, C extensions, async internals, performance optimization
- Target: Deep internals specialists

---

## Current Tracks (Available on Live Site)

### Web Development
| Track | Modules | Status |
|-------|---------|--------|
| Beginner Track | 5 modules | ✅ Complete |
| Developer Track | 7 modules | ✅ Complete |
| Specializations | 4 modules | ✅ Complete |

### Programming Languages
| Language | Modules | Status |
|----------|---------|--------|
| C | 8 modules | ✅ Complete |
| C++ | 8 modules | ✅ Complete |
| C# | 8 modules | ✅ Complete |
| Python | 8 modules | ✅ Complete |

---

## How to Contribute

Every track on Nyxora Sync started as a plan. If you have expertise in any of these areas, your contributions make them real:

1. **Write lessons** — Content is written in MDX format
2. **Review PRs** — Help maintain quality and accuracy
3. **Add resources** — Curate free, high-quality external resources
4. **Translate** — Help make content accessible in more languages
5. **Report issues** — Flag broken examples, outdated content, or gaps

Read the [Contribution Guide](CONTRIBUTING.md) to get started.

---

## Disclaimer

Time estimates and lesson counts are rough projections. Actual scope may change.
**No dates are committed.** Tracks ship when they meet our quality bar:
- Written lessons with runnable examples
- Working projects with verified code
- Curated free resources
- Peer review

---

*Last updated: 2026-11-03*