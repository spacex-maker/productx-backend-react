import React from 'react';
import PrivateRoute from 'src/components/PrivateRoute';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Colors = React.lazy(() => import('./views/theme/colors/Colors'));
const Typography = React.lazy(() => import('./views/theme/typography/Typography'));

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'));
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/base/cards/Cards'));
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'));
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'));
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'));
const Navs = React.lazy(() => import('./views/base/navs/Navs'));
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'));
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'));
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'));
const Progress = React.lazy(() => import('./views/base/progress/Progress'));
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'));
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'));
const Tables = React.lazy(() => import('./views/base/tables/Tables'));
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'));

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'));
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'));
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'));

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'));
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'));
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'));
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'));
const Layout = React.lazy(() => import('./views/forms/layout/Layout'));
const Range = React.lazy(() => import('./views/forms/range/Range'));
const Select = React.lazy(() => import('./views/forms/select/Select'));
const Validation = React.lazy(() => import('./views/forms/validation/Validation'));

const Charts = React.lazy(() => import('./views/charts/Charts'));

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/icons/flags/Flags'));
const Brands = React.lazy(() => import('./views/icons/brands/Brands'));

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'));
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'));
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'));
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'));

const Widgets = React.lazy(() => import('./views/widgets/Widgets'));

const ThreeScene = React.lazy(() => import('./views/base/threeJs/ThreeScene'));

const ImageManage = React.lazy(() => import('./views/base/record/record'));
const ResourceManage = React.lazy(() => import('./views/base/resource/resource'));
const UserManage = React.lazy(() => import('./views/base/userList/ListUsers'));
const CommentsManage = React.lazy(() => import('./views/base/comment/comment'));
const IpAddress = React.lazy(() => import('./views/base/ipAddress/IpAddress'));
const PathStatisticLog = React.lazy(() => import('./views/base/pathStatisticLog/PathStatisticLog'));
const Chatroom = React.lazy(() => import('./views/base/chatroom/Chatroom'));

const LoginPage = React.lazy(() => import('./views/pages/login/LoginPage'));
const ListCurrency = React.lazy(() => import('./views/base/sysCurrencies/SysCurrencies'));
const ListCountry = React.lazy(() => import('./views/base/countries/Country'));

const ListExpress = React.lazy(() => import('./views/base/express/Express'));

const ListGlobalBank = React.lazy(() => import('./views/base/globalBank/GlobalBank'));

const ListWorkOrder = React.lazy(() => import('./views/base/workOrder/WorkOrder'));

const ListDepartment = React.lazy(() => import('./views/base/adminDepartment/AdminDepartment'));

const ListManager = React.lazy(() => import('./views/base/manager/Manager'));

const ListRole = React.lazy(() => import('./views/base/adminRole/AdminRole'));

const ListPermission = React.lazy(() => import('./views/base/adminPermission/AdminPermission'));

const ListUserOrder = React.lazy(() => import('./views/base/userOrder/UserOrder'));

const ListSysWallets = React.lazy(() => import('./views/base/sysWallets/SysWallets'));

const SysCos = React.lazy(() => import('./views/base/cos/Cos'));

const ListSysCryptoCurrencies = React.lazy(
  () => import('./views/base/sysCryptoCurrencies/SysCryptoCurrencies'),
);

const XAI = React.lazy(() => import('./views/base/ai/xai'));

const SysIssueTracker = React.lazy(() => import('./views/base/sysIssueTracker/SysIssueTracker'));

const UserProductRouter = React.lazy(() => import('./views/base/userProduct/UserProduct'));

const UserProductCategoryRouter = React.lazy(
  () => import('./views/base/userProductCategory/UserProductCategory'),
);

const UserAddressRouter = React.lazy(() => import('./views/base/userAddress/ListUserAddress'));

const UserAccountBankRouter = React.lazy(
  () => import('./views/base/userAccountBank/ListUserAccountBank'),
);

const UserProfileRouter = React.lazy(() => import('./views/base/userProfile/ListUserProfile'));

const SysMenu = React.lazy(() => import('./views/base/sysMenu/Menu'));

const PartnersRouter = React.lazy(() => import('./views/base/partners/Partners'));

const RepairServiceMerchantsRouter = React.lazy(
  () => import('./views/base/repairServiceMerchants/RepairServiceMerchants'),
);

const ObjectStorageListRouter = React.lazy(
  () => import('./views/base/objectStorage/ObjectStorageList'),
);

const UserShippingMethodRouter = React.lazy(
  () => import('./views/base/userShippingMethod/UserShippingMethod'),
);

const RegionAgentsRouter = React.lazy(() => import('./views/base/regionAgents/RegionAgents'));

const SysConfigListRouter = React.lazy(() => import('./views/base/sysConfig/SysConfig'));

const SysLanguageRouter = React.lazy(() => import('./views/base/sysLanguages/SysLanguage'));

const SysPaymentMethodsRouter = React.lazy(
  () => import('./views/base/sysPaymentMethods/SysPaymentMethods'),
);

const ClientCountryConfigRouter = React.lazy(
  () => import('./views/base/clientCountryConfig/ClientCountryConfig'),
);

const WebsiteListRouter = React.lazy(() => import('./views/base/websiteList/WebsiteList'));

const WebsiteApplicationRouter = React.lazy(
  () => import('./views/base/websiteApplications/WebsiteApplication'),
);

const QtsSymbolRouter = React.lazy(() => import('./views/base/qtsSymbol/QtsSymbol'));

const QtsApiKeyRouter = React.lazy(() => import('./views/base/qtsApiKey/QtsApiKey'));

const QtsStrategyRouter = React.lazy(() => import('./views/base/qtsStrategy/QtsStrategy'));

const SocialMonitoredAccountsRouter = React.lazy(
  () => import('./views/base/socialMonitoredAccounts/SocialMonitoredAccounts'),
);

const SocialPostsRouter = React.lazy(() => import('./views/base/socialPosts/SocialPosts'));

const QtsSupportedExchangesRouter = React.lazy(
  () => import('./views/base/qtsSupportedExchanges/QtsSupportedExchanges'),
);

const QtsMarketDataRouter = React.lazy(() => import('./views/base/qtsMarketData/QtsMarketData'));

const LogisticsRoutesRouter = React.lazy(
  () => import('./views/base/logisticsRoutes/LogisticsRoutes'),
);

const LogisticsProvidersRouter = React.lazy(
  () => import('./views/base/logisticsProviders/LogisticsProviders'),
);

const LogisticsProviderRoutesRouter = React.lazy(
  () => import('./views/base/logisticsProviderRoutes/LogisticsProviderRoutes'),
);

const QtsSystemLogRouter = React.lazy(() => import('./views/base/qtsSystemLog/QtsSystemLog'));

const TmsContainerRouter = React.lazy(() => import('./views/base/tmsContainer/TmsContainer'));

const UserShoppingCartRouter = React.lazy(
  () => import('./views/base/userShoppingCart/UserShoppingCart'),
);

const UserProductHotSearchRouter = React.lazy(
  () => import('./views/base/userProductHotSearch/UserProductHotSearch'),
);

const UserRequirementsRouter = React.lazy(() => import('./views/base/userRequirements/UserRequirements'));

const MsxCloudProvidersRouter = React.lazy(() => import('./views/base/msxCloudProviders/MsxCloudProviders'));

const MsxCloudProviderRegionsRouter = React.lazy(() => import('./views/base/msxCloudProviderRegions/MsxCloudProviderRegions'));

const MsxCloudCredentialsRouter = React.lazy(() => import('./views/base/msxCloudCredentials/MsxCloudCredentials'));

const MsxUserStorageRouter = React.lazy(() => import('./views/base/msxUserStorage/MsxUserStorage'));

const MsxStorageBucketRouter = React.lazy(() => import('./views/base/msxStorageBucket/MsxStorageBucket'));

const SaAiCompaniesRouter = React.lazy(() => import('./views/base/saAiCompanies/SaAiCompanies'));

const SaAiAgentRouter = React.lazy(() => import('./views/base/saAiAgent/SaAiAgent'));

const SaProjectRouter = React.lazy(() => import('./views/base/saProject/SaProject'));

const SaAiAgentRoleRouter = React.lazy(() => import('./views/base/saAiAgentRole/SaAiAgentRole'));

const SaAiModelsRouter = React.lazy(() => import('./views/base/saAiModels/SaAiModels'));

const SaIndustryRouter = React.lazy(() => import('./views/base/saIndustry/SaIndustry'));

const ServerInstancesRouter = React.lazy(() => import('./views/base/serverInstances/ServerInstances'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/login', name: '登录', element: LoginPage },
  {
    path: '/dashboard',
    name: '主页',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
  { path: '/threeJs', name: 'threeJs', element: ThreeScene },

  {
    path: '/data/userList',
    name: '用户管理',
    element: (
      <PrivateRoute>
        <UserManage />
      </PrivateRoute>
    ),
  },
  {
    path: '/data/comments',
    name: '留言管理',
    element: (
      <PrivateRoute>
        <CommentsManage />
      </PrivateRoute>
    ),
  },
  {
    path: '/data/ipAddress',
    name: 'ip访问日志',
    element: (
      <PrivateRoute>
        <IpAddress />
      </PrivateRoute>
    ),
  },
  {
    path: '/chat/chatroom',
    name: '聊天室',
    element: (
      <PrivateRoute>
        <Chatroom />
      </PrivateRoute>
    ),
  },
  {
    path: '/data/sysCurrency',
    name: '系统支持货币',
    element: (
      <PrivateRoute>
        <ListCurrency />
      </PrivateRoute>
    ),
  },
  {
    path: '/data/country',
    name: '系统支持国家',
    element: (
      <PrivateRoute>
        <ListCountry />
      </PrivateRoute>
    ),
  },
  {
    path: '/data/express',
    name: '系统支持快递',
    element: (
      <PrivateRoute>
        <ListExpress />
      </PrivateRoute>
    ),
  },
  {
    path: '/data/globalBank',
    name: '系统支持银行',
    element: (
      <PrivateRoute>
        <ListGlobalBank />
      </PrivateRoute>
    ),
  },
  {
    path: '/data/workOrder',
    name: '工单系统',
    element: (
      <PrivateRoute>
        <ListWorkOrder />
      </PrivateRoute>
    ),
  },
  {
    path: '/data/department',
    name: '部门管理',
    element: (
      <PrivateRoute>
        <ListDepartment />
      </PrivateRoute>
    ),
  },
  {
    path: '/data/manager',
    name: '员工管理',
    element: (
      <PrivateRoute>
        <ListManager />
      </PrivateRoute>
    ),
  },
  {
    path: '/data/role',
    name: '角色管理',
    element: (
      <PrivateRoute>
        <ListRole />
      </PrivateRoute>
    ),
  },
  {
    path: '/data/permission',
    name: '权限管理',
    element: (
      <PrivateRoute>
        <ListPermission />
      </PrivateRoute>
    ),
  },
  {
    path: '/data/userOrder',
    name: '订单管理',
    element: (
      <PrivateRoute>
        <ListUserOrder />
      </PrivateRoute>
    ),
  },
  {
    path: '/data/sysWallets',
    name: '[系统]钱包管理',
    element: (
      <PrivateRoute>
        <ListSysWallets />
      </PrivateRoute>
    ),
  },
  {
    path: '/data/sysCryptoCurrencies',
    name: '[系统]加密货币管理',
    element: (
      <PrivateRoute>
        <ListSysCryptoCurrencies />
      </PrivateRoute>
    ),
  },
  {
    path: '/data/ai',
    name: 'XAI',
    element: (
      <PrivateRoute>
        <XAI />
      </PrivateRoute>
    ),
  },
  {
    path: '/data/cos',
    name: '[系统]对象存储管理',
    element: (
      <PrivateRoute>
        <SysCos />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/menu',
    name: '菜单管理',
    element: (
      <PrivateRoute>
        <SysMenu />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/issueTracker',
    name: '问题跟踪',
    element: (
      <PrivateRoute>
        <SysIssueTracker />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/userProduct',
    name: '产品管理',
    element: (
      <PrivateRoute>
        <UserProductRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/userProductCategory',
    name: '商品分类管理',
    element: (
      <PrivateRoute>
        <UserProductCategoryRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/userAddress',
    name: '用户地址管理',
    element: (
      <PrivateRoute>
        <UserAddressRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/userAccountBank',
    name: '银行账户管理',
    element: (
      <PrivateRoute>
        <UserAccountBankRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/userProfile',
    name: '用户画像管理',
    element: (
      <PrivateRoute>
        <UserProfileRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/partners',
    name: '合作伙伴管理',
    element: (
      <PrivateRoute>
        <PartnersRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/repairServiceMerchants',
    name: '维修商户管理',
    element: (
      <PrivateRoute>
        <RepairServiceMerchantsRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/objectStorageConfigList',
    name: '对象存储配置管理',
    element: (
      <PrivateRoute>
        <ObjectStorageListRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/userShippingMethod',
    name: '用户交易方式管理',
    element: (
      <PrivateRoute>
        <UserShippingMethodRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/regionAgents',
    name: '区域代理管理',
    element: (
      <PrivateRoute>
        <RegionAgentsRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/sysConfig',
    name: '系统基础配置',
    element: (
      <PrivateRoute>
        <SysConfigListRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/sysLanguage',
    name: '系统语言管理',
    element: (
      <PrivateRoute>
        <SysLanguageRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/sysPaymentMethods',
    name: '系统支付方式管理',
    element: (
      <PrivateRoute>
        <SysPaymentMethodsRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/clientCountryConfig',
    name: '客户端配置',
    element: (
      <PrivateRoute>
        <ClientCountryConfigRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/websiteList',
    name: '综合导航管理',
    element: (
      <PrivateRoute>
        <WebsiteListRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/websiteApplications',
    name: '网站应用管理',
    element: (
      <PrivateRoute>
        <WebsiteApplicationRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/qtsSymbol',
    name: '交易对管理',
    element: (
      <PrivateRoute>
        <QtsSymbolRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/qtsApiKey',
    name: 'API密钥管理',
    element: (
      <PrivateRoute>
        <QtsApiKeyRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/qtsStrategy',
    name: '策略管理',
    element: (
      <PrivateRoute>
        <QtsStrategyRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/socialMonitoredAccounts',
    name: '社交账号监控管理',
    element: (
      <PrivateRoute>
        <SocialMonitoredAccountsRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/socialPosts',
    name: '社交帖子管理',
    element: (
      <PrivateRoute>
        <SocialPostsRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/qtsSupportedExchanges',
    name: '交易所管理',
    element: (
      <PrivateRoute>
        <QtsSupportedExchangesRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/qtsMarketData',
    name: '行情数据',
    element: (
      <PrivateRoute>
        <QtsMarketDataRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/logisticsRoutes',
    name: '物流路线管理',
    element: (
      <PrivateRoute>
        <LogisticsRoutesRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/logisticsProviders',
    name: '物流提供商管理',
    element: (
      <PrivateRoute>
        <LogisticsProvidersRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/logisticsProviderRoutes',
    name: '物流提供商路线管理',
    element: (
      <PrivateRoute>
        <LogisticsProviderRoutesRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/qtsSystemLog',
    name: 'QTS系统日志',
    element: (
      <PrivateRoute>
        <QtsSystemLogRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/tmsContainer',
    name: '集装箱管理',
    element: (
      <PrivateRoute>
        <TmsContainerRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/userShoppingCart',
    name: '用户购物车管理',
    element: (
      <PrivateRoute>
        <UserShoppingCartRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/userProductHotSearch',
    name: '用户产品热搜管理',
    element: (
      <PrivateRoute>
        <UserProductHotSearchRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/userRequirements',
    name: '用户需求管理',
    element: (
      <PrivateRoute>
        <UserRequirementsRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/msxCloudProviders',
    name: 'MSX云提供商管理',
    element: (
      <PrivateRoute>
        <MsxCloudProvidersRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/msxCloudProviderRegions',
    name: 'MSX云提供商区域管理',
    element: (
      <PrivateRoute>
        <MsxCloudProviderRegionsRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/msxCloudCredentials',
    name: 'MSX云凭证管理',
    element: (
      <PrivateRoute>
        <MsxCloudCredentialsRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/msxUserStorage',
    name: 'MSX用户存储管理',
    element: (
      <PrivateRoute>
        <MsxUserStorageRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/msxStorageBucket',
    name: 'MSX存储桶管理',
    element: (
      <PrivateRoute>
        <MsxStorageBucketRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/saAiCompanies',
    name: 'AI公司管理',
    element: (
      <PrivateRoute>
        <SaAiCompaniesRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/saAiAgent',
    name: 'AI代理管理',
    element: (
      <PrivateRoute>
        <SaAiAgentRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/saProject',
    name: 'AI项目管理',
    element: (
      <PrivateRoute>
        <SaProjectRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/saAiAgentRole',
    name: 'AI角色管理',
    element: (
      <PrivateRoute>
        <SaAiAgentRoleRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/saAiModels',
    name: 'AI模型管理',
    element: (
      <PrivateRoute>
        <SaAiModelsRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/sys/saIndustry',
    name: '行业管理',
    element: (
      <PrivateRoute>
        <SaIndustryRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '/base/serverInstances',
    name: '服务器实例管理',
    element: (
      <PrivateRoute>
        <ServerInstancesRouter />
      </PrivateRoute>
    ),
  },
];

export default routes;
