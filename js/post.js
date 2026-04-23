const posts = [
  {
    id: 1,
    title: "ROS2技术栈",
    category: "ROS2",
    date: "2026-04-23",
    summary: "ROS2学习路线、常见问题与实践建议。",
    content: `
      <p>ROS2 是机器人开发中非常重要的一套框架。对于初学者来说，建议先理解节点、话题、服务、参数、launch 文件这些基本概念。</p>

      <h2>1. 学习顺序</h2>
      <p>我更建议先学基本通信机制，再学功能包组织，最后进入仿真、导航和系统集成。</p>
      <ul>
        <li>先理解节点、话题、服务</li>
        <li>再熟悉 colcon build、package.xml、CMakeLists.txt</li>
        <li>最后再进入 Gazebo、RViz2、Nav2 等更大的系统</li>
      </ul>

      <h2>2. 系统结构示意</h2>
      <p>下面这张图可以帮助理解 ROS2 系统中多个节点之间的关系：</p>
      <img src="assets/images/ros/ros2-graph.png" alt="ROS2 系统结构图" />

      <h2>3. 常见问题</h2>
      <p>初学者常见的问题主要有：</p>
      <ul>
        <li>没有 source 环境，导致 ros2 命令或包找不到</li>
        <li>包没有正确 build，或者依赖没装全</li>
        <li>launch 文件路径、参数传递写错</li>
      </ul>

      <h2>4. 示例命令</h2>
      <p>下面是一个常见的工作区编译命令：</p>
      <pre><code class="language-bash">
cd ~/droncon_ws
colcon build --symlink-install
source install/setup.bash
      </code></pre>

      <h2>5. 我的建议</h2>
      <p>一边学一边做小项目，比单纯看文档更有效。比如先实现一个发布订阅，再逐步扩展到传感器、SLAM、导航。</p>
    `
  },
  {
    id: 2,
    title: "ESP32 CAN通信控制电机",
    category: "ESP32",
    date: "2026-04-24",
    summary: "基于 ESP-IDF 的 TWAI（CAN）通信控制无刷电机。",
    content: `
      <p>ESP32-S3 可以通过 TWAI（CAN）接口与多个电机控制器通信，实现多电机控制。这种方式适合轮腿机器人、移动底盘和多节点嵌入式系统。</p>

      <h2>1. TWAI 简介</h2>
      <p>TWAI 是 ESP32 对 CAN 协议的实现，可以用于工业通信和机器人控制。在 ESP-IDF 中，可以通过官方驱动进行配置和数据发送。</p>

      <h2>2. 通信结构图</h2>
      <p>下图展示了 ESP32 与多个电机控制器之间的总线连接关系：</p>
      <img src="assets/images/esp32/can-topology.png" alt="ESP32 CAN 通信结构图" />

      <h2>3. 初始化流程</h2>
      <p>通常需要完成以下步骤：</p>
      <ul>
        <li>配置 TX / RX GPIO</li>
        <li>配置 TWAI 一般参数、时序参数、过滤器参数</li>
        <li>安装驱动并启动控制器</li>
      </ul>

      <h2>4. 初始化示例代码</h2>
      <pre><code class="language-c">
twai_general_config_t g_config = TWAI_GENERAL_CONFIG_DEFAULT(tx_io, rx_io, TWAI_MODE_NORMAL);
twai_timing_config_t t_config = TWAI_TIMING_CONFIG_500KBITS();
twai_filter_config_t f_config = TWAI_FILTER_CONFIG_ACCEPT_ALL();

ESP_ERROR_CHECK(twai_driver_install(&g_config, &t_config, &f_config));
ESP_ERROR_CHECK(twai_start());
      </code></pre>

      <h2>5. 控制建议</h2>
      <p>建议先从单电机通信测试开始，确认收发正常后，再扩展到多电机控制。这样更容易定位硬件接线和报文格式问题。</p>
    `
  }
];