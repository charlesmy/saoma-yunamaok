/** @format */
import {runComponent, CloseFunc, Result} from '@/src/utils/run-component'
import {View, ScrollView, Image, Text} from '@tarojs/components'
import {useEffect, useState} from 'react'
import {API} from '@/src/types/index'
import Taro from '@tarojs/taro'

import styles from './show-desc.module.scss'
import {getScanMingxi} from '../api'

interface Props {
    _onClose?: CloseFunc
    orderId: string //订单编号
    zhahao: string //扎号
}

function Desc(props: Props) {
    const onDestroy = (res: Result<string>) => {
        if (typeof props._onClose === 'function') {
            props._onClose(res)
        }
    }

    const onClose = () => {
        onDestroy({code: -1, message: '关闭弹窗'})
    }

    const [data, setData] = useState<API.TypeIn.Mingxi.Data[]>([])

    useEffect(() => {
        const load = async () => {
            const res = await getScanMingxi({orderId: props.orderId, zhahao: props.zhahao})
            if (res.code === 0) {
                setData(res.data || [])
            } else {
                Taro.showToast({icon: 'none', title: res.message})
            }
        }
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <View className="ba__dialog__mask">
            <View className={styles.container}>
                <View className={styles.head}>领菲明细</View>
                <ScrollView scrollY className={styles.list}>
                    {data.map((item, index) => (
                        <View className={styles.line} key={item.process_name}>
                            <View className={styles.flag}>批量领菲</View>
                            <Text className={styles.name}>
                                {index + 1}.{item.process_name}
                            </Text>
                            <View className={styles.middle}>{item.title}</View>
                            <View className={styles.count}>
                                【{item.leave}/{item.totalCount}】
                            </View>
                        </View>
                    ))}
                </ScrollView>
                <Image
                    src={require('@/src/images/icon_close.png')}
                    mode="aspectFit"
                    className={styles.close}
                    onClick={onClose}
                />
            </View>
        </View>
    )
}

export default Desc

export const showDesc = (props: Props) => {
    return runComponent(Desc, props)
}
