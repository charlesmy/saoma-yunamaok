/** @format */

import React from 'react'
import {View, Radio, Text, Input} from '@tarojs/components'
import classNames from 'classnames'
import {API} from '@/src/types/index'
import dayjs from 'dayjs'

import styles from './edit-item.module.scss'
import {useInput} from '../stores/edit'

interface Props {
    item: API.TypeIn.ProcessDetail.UserProcessList
}

function EditItem(props: Props) {
    const setInput = useInput(state => state.setMap)
    const {item} = props
    return (
        <View className={styles.item}>
            <Radio className={styles.radio} value={item.id} />
            <View className={styles.content}>
                <Text className={styles.name}>{item.bar_num}.扎</Text>
                <Text className={classNames(styles.size)}>{item.size_name || '-'}</Text>
                <Text className={classNames(styles.date)}>
                    {dayjs(item.create_time * 1000).format('MM.DD HH:mm:ss')}
                </Text>
                <View className={styles.right}>
                    <View className={styles.count}>数量：</View>
                    <Input
                        value={String(item.quintity || '')}
                        onInput={e => setInput(item.id, e.detail.value)}
                        className={styles.input}
                        type="number"
                    />
                </View>
            </View>
        </View>
    )
}

export default React.memo(EditItem)
