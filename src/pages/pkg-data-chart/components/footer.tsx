/** @format */

import React from 'react'
import {View} from '@tarojs/components'
import classNames from 'classnames'
import styles from './footer.module.scss'

export type ChartType = 'bar' | 'line'
interface Props {
    onChange?: (type: ChartType) => void
}

function Footer(props: Props) {
    return (
        <View className={styles.foot}>
            <View className={classNames(styles.btn, styles.bar)} onClick={() => props?.onChange?.('bar')}>
                柱状图
            </View>
            <View className={classNames(styles.btn, styles.line)} onClick={() => props?.onChange?.('line')}>
                折线图
            </View>
        </View>
    )
}

export default React.memo(Footer)
