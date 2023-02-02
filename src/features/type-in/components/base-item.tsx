/** @format */

import React from 'react'
import {View, Text, Input} from '@tarojs/components'
import classNames from 'classnames'
import styles from './base-item.module.scss'

interface Props {
    label: string
    labelStyle?: string
    required?: boolean
    leftWidth?: number
    leftReactNode?: React.ReactNode
    rightReactNode?: React.ReactNode
    onInput?: (value: string) => void
    placeholder?: string
    className?: string
    value?: string
    onConfirm?: (val: string) => void
    onBlur?: (val: string) => void
}

function BaseItem(props: Props) {
    const leftStyle = props?.leftWidth ? `width: ${props.leftWidth}%` : ''
    return (
        <View className={classNames(styles.item, props.className)}>
            <View className={styles.left} style={leftStyle}>
                {props?.leftReactNode ? (
                    props.leftReactNode
                ) : (
                    <Text
                        className={classNames(
                            styles.label,
                            props.required ? styles.labelRequired : '',
                            props.labelStyle,
                        )}>
                        {props.label}
                    </Text>
                )}
            </View>
            <View className={styles.right}>
                {props?.rightReactNode ? (
                    props.rightReactNode
                ) : (
                    <Input
                        className={styles.input}
                        onInput={e => props?.onInput?.(e.detail.value)}
                        placeholder={props.placeholder}
                        value={props.value}
                        onConfirm={e => props?.onConfirm?.(e.detail.value)}
                        onBlur={e => props?.onBlur?.(e.detail.value)}
                    />
                )}
            </View>
        </View>
    )
}

export default React.memo(BaseItem)
