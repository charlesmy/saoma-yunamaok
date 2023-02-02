/** @format */

import {View, Button} from '@tarojs/components'
import classNames from 'classnames'
import Taro from '@tarojs/taro'
import {useUser} from '@/src/stores/user'
import {getScanResult} from '@/src/services/wx'
import {goRoute, Pages} from '@/src/utils/routes'

import styles from './index.module.scss'
import Notice from './views/notice'
import MenuGrid from './views/grid-menu'
import UserInfo from './views/user-info'
import Banner from './views/banner'
import Staff from './views/staff'
import {useInit} from './stores/index'

function Index() {
    useInit()
    const user = useUser(state => state.user)

    const onScan = async () => {
        const res = await getScanResult()
        if (res && res.result) {
            const [orderId, zhahao] = res.result.split('-')
            goRoute(Pages.pages_pkg_type_in_manual, {orderId, zhahao})
        } else {
            Taro.showToast({icon: 'none', title: '二维码不正确'})
        }
    }

    return (
        <View className={styles.page}>
            {user.salary_bool === 1 ? (
                <Staff />
            ) : (
                <>
                    <UserInfo />
                    <Banner />
                </>
            )}
            <Notice />
            <MenuGrid />
            <Button className={classNames(styles.qrIcon, 'iconfont-v2')} onClick={onScan}>
                &#xe8b5;
            </Button>
        </View>
    )
}
export default Index
