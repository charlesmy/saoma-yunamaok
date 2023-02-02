/** @format */

import React from 'react'
import {View, Image, Text} from '@tarojs/components'
import classNames from 'classnames'
import {Pages, goRoute} from '@/src/utils/routes'
import {useUser} from '@/src/stores/user'
import styles from './navbar.module.scss'

function Navbar() {
    const user = useUser(state => state.user)
    return (
        <View className={styles.nav}>
            <View className={styles.left}>
                <Image src={user.headimgurl} className={styles.avatar} mode="aspectFit" />
            </View>
            <View className={styles.middle}>
                <View className={styles.info}>
                    <Text className={styles.name}>{user.name}</Text>
                    <Text className={styles.position}>
                        [{user.role}/{user.jp_number}]
                    </Text>
                </View>
                <View className={styles.line}>绑定工序: {user.bind_process_str || '无'}</View>
            </View>
            <View className={styles.right}>
                <Text
                    className={classNames('iconfont-v2', styles.setting)}
                    onClick={() => goRoute(Pages.pages_pkg_setting_index)}>
                    &#xe70f;
                </Text>
            </View>
        </View>
    )
}

export default React.memo(Navbar)
