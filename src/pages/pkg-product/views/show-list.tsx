/** @format */
import {runComponent, CloseFunc, Result} from '@/src/utils/run-component'
import {View, ScrollView, Text} from '@tarojs/components'
import {useEffect, useState} from 'react'
import {API} from '@/src/types/index'
import Taro from '@tarojs/taro'

import styles from './show-list.module.scss'
import {getFinishDetail} from '../api/index'

interface Props {
    _onClose?: CloseFunc
    item: API.Product.Desc.ProcessItem
}

function Grind(props: Props) {
    const onDestroy = (res: Result<string>) => {
        if (typeof props._onClose === 'function') {
            props._onClose(res)
        }
    }

    const onClose = () => {
        onDestroy({code: -1, message: '关闭弹窗'})
    }

    const [data, setData] = useState<API.Product.Popup.Data[]>([])

    const load = async () => {
        const res = await getFinishDetail({processId: props.item.process_id})
        if (res.code === 0) {
            setData(res.data)
        } else {
            Taro.showToast({icon: 'none', title: res.message})
        }
    }

    useEffect(() => {
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <View className="ba__dialog__mask">
            <View className={styles.container}>
                <View className={styles.head}>
                    <View className={styles.left}>完成数</View>
                    <View className={styles.middle}>
                        [{props?.item?.process_name}] 总计：{props?.item?.finish_count}件
                    </View>
                    <View className={styles.right} onClick={onClose}>
                        关闭
                    </View>
                </View>
                <ScrollView className={styles.list} scrollY>
                    {data.map(item => (
                        <View className={styles.listRow} key={item.id}>
                            <Text className={styles.listCol}>{item.zhahao}. 扎</Text>
                            <Text className={styles.listCol}>{item.size_name}</Text>
                            <Text className={styles.listCol30}>{item.dress_color}</Text>
                            <Text className={styles.listCol}>{item.user_name}</Text>
                            <Text className={styles.listCol}>领菲：{item.quintity}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    )
}

export default Grind

export const showList = (props: Props) => {
    return runComponent(Grind, props)
}
