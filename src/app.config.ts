/** @format */

export default defineAppConfig({
    pages: [
        'pages/home/index',
        'pages/task/task',
        'pages/project/project',
        'pages/person/person',
        'pages/person/edit/edit',
        'pages/project/edit/edit',
        'pages/task/notice/notice',
        'pages/project/detail/detail',
        'pages/bind/bind',
        'pages/task/edit/edit',
        'pages/task/detail/detail',
    ],
    subpackages: [
        // 设置
        {
            root: 'pages/pkg-setting',
            pages: ['index'],
        },
        // 工菲录入
        {
            root: 'pages/pkg-type-in',
            pages: ['manual', 'edit', 'batch'],
        },
        // 工作查询
        {
            root: 'pages/pkg-job',
            pages: ['query'],
        },
        // 数据图表
        {
            root: 'pages/pkg-data-chart',
            pages: ['product'],
        },
        // 消息发布
        {
            root: 'pages/pkg-message',
            pages: ['index', 'new', 'notice', 'detail'],
        },
        // 生产进度
        {
            root: 'pages/pkg-product',
            pages: ['progress', 'detail'],
        },
    ],
    window: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#fff',
        navigationBarTitleText: '米莫移动端--任务系统',
        navigationBarTextStyle: 'black',
    },
    tabBar: {
        borderStyle: 'white',
        color: '#666666',
        selectedColor: '#034B57',
        list: [
            {
                pagePath: 'pages/home/index',
                text: '主页',
                iconPath: './images/tabbar/home.png',
                selectedIconPath: './images/tabbar/home_cur.png',
            },
            {
                pagePath: 'pages/task/task',
                text: '任务',
                iconPath: './images/tabbar/task.png',
                selectedIconPath: './images/tabbar/task_cur.png',
            },
            {
                pagePath: 'pages/project/project',
                text: '项目',
                iconPath: './images/tabbar/project.png',
                selectedIconPath: './images/tabbar/project_cur.png',
            },
            {
                pagePath: 'pages/person/person',
                text: '个人',
                iconPath: './images/tabbar/person.png',
                selectedIconPath: './images/tabbar/person_cur.png',
            },
        ],
    },
})
