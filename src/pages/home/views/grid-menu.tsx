/** @format */

import React, {useMemo} from 'react'
import {Grid, GridItem, Icon} from '@nutui/nutui-react-taro'
import {showManual, showGrind, showEdit} from '@/src/features/type-in/index'
import {goRoute, Pages} from '@/src/utils/routes'
import {useUser} from '@/src/stores/user'
import styles from './grid-menu.module.scss'

interface GridOption {
    text: string
    icon: string
    onClick?: Function
    show?: boolean
}

function MenuGrid() {
    const user = useUser(state => state.user)

    const list: GridOption[] = useMemo(() => {
        const isAdmin = user.manage === 1
        const arr: GridOption[] = [
            {text: '工作查询', icon: 'chaxunyewu', onClick: () => goRoute(Pages.pages_pkg_job_query), show: true},
            {text: '手工录菲', icon: 'line-fileeditwendangbianji', onClick: () => showManual(), show: true},
            {
                text: '生产进度',
                icon: 'shengchanjindu',
                onClick: () => goRoute(Pages.pages_pkg_product_progress),
                show: isAdmin,
            },
            {text: '工菲修改', icon: 'xiugaimima', onClick: () => showEdit(), show: true},
            {
                text: '数据图表',
                icon: 'tubiao',
                onClick: () => goRoute(Pages.pages_pkg_data_chart_product),
                show: isAdmin,
            },
            // {text: '员工管理', icon: 'yuangong'},
            {text: '代人录菲', icon: 'tihuan', onClick: () => showGrind(), show: true},
            // {text: '品质管理', icon: 'pinzhiguanli'},
            {text: '消息发布', icon: 'icon_fabu', onClick: () => goRoute(Pages.pages_pkg_message_index), show: isAdmin},
            {
                text: '辅助设置',
                icon: 'shezhi',
                onClick: () => goRoute(Pages.pages_pkg_setting_index),
                show: user.salary_bool === 1,
            },
        ]
        return arr.filter(item => item.show)
    }, [user])

    return (
        <Grid className={styles.menu}>
            {list.map(item => (
                <GridItem
                    icon={<Icon fontClassName="iconfont-v2" classPrefix="icon" name={item.icon} size="22px" />}
                    text={item.text}
                    key={item.text + item.icon}
                    onClick={() => item?.onClick?.()}
                />
            ))}
        </Grid>
    )
}

export default React.memo(MenuGrid)
