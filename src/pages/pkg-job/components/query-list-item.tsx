/** @format */

import React, {useMemo, useState} from 'react'
import {View, Text, Image} from '@tarojs/components'
import classNames from 'classnames'
import {Icon, Table} from '@nutui/nutui-react-taro'
import {API} from '@/src/types/index'
import Taro from '@tarojs/taro'

import styles from './query-list-item.module.scss'
import {getDesc} from '../api'
import {useDesc} from '../stores/desc'

interface TableColumnProps {
    key: string
    title?: string
    align?: string
    sorter?: ((a: any, b: any) => number) | boolean | string
    render?: (rowData?: any, rowIndex?: number) => string | React.ReactNode
}

const columns: TableColumnProps[] = [
    {
        title: 'No',
        key: 'no',
        align: 'center',
    },
    {
        title: '色码',
        key: 'sema',
        align: 'center',
    },
    {
        title: '扎号',
        align: 'center',
        key: 'zhahao',
    },
    {
        title: '数量',
        align: 'center',
        key: 'quintity',
    },
    {
        title: '单价',
        align: 'center',
        key: 'process_price',
    },
    {
        title: '工资',
        align: 'center',
        key: 'total_price',
        render: (record: any) => {
            return <Text style={{color: 'blue'}}>{record.total_price}</Text>
        },
    },
    {
        title: '领菲时间',
        align: 'center',
        key: 'create_time',
    },
]

interface Props {
    item: API.Job.Query.Item
}

function QueryListItem(props: Props) {
    const [showAll, setShowAll] = useState(false)
    const [cache, addCache] = useDesc(state => [state.cache, state.addCache])
    const {item} = props
    const key = `${item.order_id}_${item.process_id}`
    const tableList = cache[key]

    const datas = useMemo(() => {
        return tableList?.map((cur, index) => ({...cur, no: index + 1})) || []
    }, [tableList])

    const onShowAll = async () => {
        if (!showAll && !cache[key]) {
            Taro.showLoading({title: 'loading'})
            const res = await getDesc({orderId: item.order_id, processId: item.process_id})
            Taro.hideLoading()
            if (res.code === 0) {
                addCache(key, res.data)
            } else {
                Taro.showToast({icon: 'none', title: res.message})
            }
        }
        setShowAll(!showAll)
    }

    return (
        <View className={styles.container}>
            <View className={styles.item}>
                <Icon
                    fontClassName="iconfont-v2"
                    classPrefix="icon"
                    name="shengchanjindu"
                    size="22px"
                    className={styles.descMore}
                    onClick={onShowAll}
                />
                <View className={styles.left}>
                    <Image
                        src={item?.pic}
                        mode="aspectFit"
                        className={styles.icon}
                        onClick={() => Taro.previewImage({current: item?.pic, urls: [item?.pic]})}
                    />
                </View>
                <View className={styles.right}>
                    <View className={styles.row}>
                        <Text className={classNames(styles.col, styles.title)}>工序：{item?.process_name}</Text>
                        <Text className={styles.col}>{item?.user_name}</Text>
                    </View>
                    <View className={styles.row}>
                        <Text className={styles.col}>订单号：{item?.client_ordernum}</Text>
                        <Text className={styles.col}>
                            数量：<Text className={styles.count}>{item?.totalCount}件</Text>｜
                            <Text className={styles.count}>{item?.totalZhashu}扎</Text>
                        </Text>
                    </View>
                    <View className={styles.row}>
                        <Text className={styles.col}>扫描：{item?.create_time}</Text>
                        <Text className={styles.col}>
                            金额：<Text className={styles.money}>{item?.totalPrice}元</Text>
                        </Text>
                    </View>
                </View>
            </View>
            {showAll && (
                <View className={styles.box}>
                    <Table columns={columns} data={datas} bordered={false} />
                </View>
            )}
        </View>
    )
}

export default React.memo(QueryListItem)
