/** @format */
import {View} from '@tarojs/components'
import {useState, useEffect} from 'react'
import Taro, {useRouter} from '@tarojs/taro'
import {API} from '@/src/types/index'

import styles from './detail.module.scss'
import {getMsgDesc} from './api/index'

function Index() {
    const query = useRouter().params
    const [data, setData] = useState<API.Message.Desc.Data | null>(null)

    useEffect(() => {
        if (!query.id) {
            Taro.showToast({icon: 'none', title: ' ID 不能为空'})
            return
        }
        getMsgDesc({id: Number(query.id)}).then(res => {
            if (res.code === 0) {
                setData(res.data)
            } else {
                Taro.showToast({icon: 'none', title: res.message})
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <View className={styles.page}>
            <View className={styles.box}>
                <View className={styles.title}>{data?.title}</View>
                <View className={styles.content}>{data?.content}</View>
                <View className={styles.time}>{data?.create_time}</View>
            </View>
        </View>
    )
}

export default Index
