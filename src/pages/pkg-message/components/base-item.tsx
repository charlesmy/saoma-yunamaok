/** @format */

import React from 'react'
import {View, Text} from '@tarojs/components'
import classNames from 'classnames'
import styles from './base-item.module.scss'

interface Props {
    label: string
    className?: string
    labelStyle?: string
    required?: boolean
    leftWidth?: number
    leftReactNode?: React.ReactNode
    rightReactNode?: React.ReactNode
}

function BaseItem(props: Props) {
    return (
        <View className={classNames(styles.item, props.className)}>
            <View className={styles.left}>
                <Text
                    className={classNames(styles.label, props.required ? styles.labelRequired : '', props.labelStyle)}>
                    {props.label}
                </Text>
            </View>
            <View className={styles.right}>{props.rightReactNode}</View>
        </View>
    )
}

export default React.memo(BaseItem)
