/** @format */

import React from 'react'
import {View, Image, Text} from '@tarojs/components'
import {goRoute, Pages} from '@/src/utils/routes'
import {API} from '@/src/types/index'
import dayjs from 'dayjs'

import styles from './product-item.module.scss'

interface Props {
    item?: API.Product.List.Item
}

function ProductItem(props: Props) {
    const {item} = props
    if (!item) return null
    return (
        <View
            className={styles.item}
            onClick={() => {
                goRoute(Pages.pages_pkg_product_detail, {orderId: item.order_id})
            }}>
            <View className={styles.left}>
                <Image src={item.pic} mode="aspectFit" className={styles.icon} />
            </View>
            <View className={styles.right}>
                <View className={styles.top}>
                    <Text className={styles.no}>{item.client_ordernum}</Text>
                    <Text className={styles.procress}>
                        {item.status_title}
                        <Text className={styles.precent}>{item.percent}</Text>
                    </Text>
                </View>
                <View className={styles.cell}>
                    <Text className={styles.company}>{item.name}</Text>
                    <Text className={styles.productDate}>货期：{item.delivery_time}</Text>
                </View>
                <View className={styles.flexbox}>
                    <View className={styles.flexitem}>
                        <Text className={styles.itemText}>下单：{item.quantity} </Text>
                        <Text className={styles.itemDate}>{dayjs(item.create_time).format('MM.DD HH:mm:ss')}</Text>
                    </View>
                    <View className={styles.flexitem}>
                        <Text className={styles.itemText}>裁床：{item.caichuang_count} </Text>
                        <Text className={styles.itemDate}>
                            {dayjs(item.caichuang_over_time).format('MM.DD HH:mm:ss')}
                        </Text>
                    </View>
                    <View className={styles.flexitem}>
                        <Text className={styles.itemText}>完成：{item.scan_finish_count} </Text>
                        <Text className={styles.itemDate}>{dayjs(item.scan_finish_time).format('MM.DD HH:mm:ss')}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default React.memo(ProductItem)
