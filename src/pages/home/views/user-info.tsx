/** @format */

import React from 'react'
import {View, Image, Text} from '@tarojs/components'
import classNames from 'classnames'
import {Pages, goRoute} from '@/src/utils/routes'
import {useUser} from '@/src/stores/user'
import styles from './user-info.module.scss'

function UserInfo() {
    const user = useUser(state => state.user)
    return (
        <View className={styles.nav}>
            <View className={styles.left}>
                <Image src={user.headimgurl} className={styles.avatar} mode="aspectFit" />
            </View>
            <View className={styles.middle}>
                <View className={styles.info}>
                    <Text className={styles.name}>{user.name}</Text>
                    <Text className={styles.position}>{user.role}</Text>
                </View>
                <View className={styles.line}>
                    编号: {user.jp_number || '-'} | 工厂: {user.factory_name || '-'} | 组别: {user.group_name || '-'}
                </View>
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

export default React.memo(UserInfo)
