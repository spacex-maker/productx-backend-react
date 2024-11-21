# ProductX React

一个专注于城市服务的应用程序，提供便捷的服务管理和操作。

---

## 接口文档

### C端文档
- 地址：[http://34.92.218.25:8080/doc.html](http://34.92.218.25:8080/doc.html)

### 后台管理系统文档
- 地址：[https://protx.cn/doc.html](https://protx.cn/doc.html)

---

## 技术栈

| 技术栈                   | 版本     | 作用                                                                                     |
|------------------------|--------|----------------------------------------------------------------------------------------|
| **Spring Boot**         | 3.3.4  | 快速构建独立的 Spring 应用程序，提供自动配置和生产就绪的特性。                                    |
| **MySQL**               | 9      | 开源关系型数据库管理系统，用于存储和管理应用程序数据。                                          |
| **MyBatis Plus**        | 3.5.5  | MyBatis 的增强工具，简化数据库操作，支持 CRUD 及动态 SQL。                                |
| **springdoc**           | 2.6.0  | 生成 OpenAPI 文档，自动化 API 文档的创建和维护。                                          |
| **knife4j**             | 4.5.0  | 增强 OpenAPI 文档的可视化和交互性，提供丰富的 UI 界面。                                    |
| **web3j**               | 5.0.0  | Java 客户端库，用于与以太坊区块链进行交互，包括智能合约的调用。                                |
| **elasticsearch**       | 8.15.2 | 分布式搜索和分析引擎，用于实时数据检索和数据分析。                                        |
| **sensitive-word**      | 0.21.0 | 用于敏感词过滤，检测和屏蔽不当内容。                                                      |
| **therapi**             | 0.15.0 | 用于运行时生成 Javadoc 文档，增强代码的可读性和可维护性。                                    |
| **fastjson2**           | 2.0.53 | 高性能 JSON 处理库，用于对象的序列化和反序列化。                                          |
| **mybatis-plus-generator** | 3.5.5  | 用于自动生成 MyBatis 的 Mapper 和实体类代码，提升开发效率。                               |

---

## 环境安装

### 先决条件

确保你的开发环境中已安装以下软件：

- [JDK 17](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html)
- [Maven](https://maven.apache.org/download.cgi)
- [MySQL](https://www.mysql.com/downloads/)

---

## 模块说明

### 1. 后台管理系统

#### 1.1 管理员管理

- 管理员信息管理，包含新增、删除、修改和查看功能。

#### 1.2 角色管理

- 管理角色权限，定义系统权限等级和访问控制。

#### 1.3 权限管理

- 管理系统的操作权限，为不同角色分配权限。

#### 1.4 工单管理

- 跟踪和处理用户工单，确保用户问题及时解决。

#### 1.5 C端用户管理

- 管理 C 端用户信息，查看用户行为和订单等信息。

#### 1.6 C端用户管理

- 对用户信息进行审核、编辑和操作记录等管理。

#### 1.7 订单管理
- **订单列表：**

    <img src="https://github.com/user-attachments/assets/a59ab971-df3f-4803-86ff-b217c94450ea" alt="Editor" width="400">

- **订单详情模态框：**

  <img src="https://github.com/user-attachments/assets/c929cac8-af83-47b0-b141-9c4d0daad712" alt="Editor" width="400">

#### 1.8 系统配置

##### 1.8.1 系统支持货币

- 支持不同国家和地区的货币设置。

##### 1.8.2 系统支持国家

- 支持系统中定义的国家信息。

##### 1.8.3 系统支持银行

- 配置支持的银行信息，便于与支付系统对接。

#### 1.9 快递平台

- 集成并管理多个快递平台接口，支持订单的自动快递信息更新。

---

## 国际化支持

后台管理系统当前支持的语言包括：

- **English**
- **中文**
- **Français**
- **Español**
- **Deutsch**
- **Italiano**
- **日本語**
- **한국어**
- **Русский**
- **عربي**

### 国际化示例界面

<img src="https://github.com/user-attachments/assets/b676c77f-899d-428d-a64b-7134b43431a9" alt="Editor" width="100">
