/** @format */

import {View, Text} from '@tarojs/components'
import {useEffect, useMemo, useState} from 'react'
import Taro, {useRouter} from '@tarojs/taro'
import {Table} from '@nutui/nutui-react-taro'
import {API} from '@/src/types/index'

import ProductItem from './components/product-item'
import styles from './detail.module.scss'
import {useDetail} from './stores/detail'
import {showList} from './views/show-list'

interface TableColumnProps {
    key: string
    title?: string
    align?: string
    sorter?: ((a: any, b: any) => number) | boolean | string
    render?: (rowData?: any, rowIndex?: number) => string | React.ReactNode
}

function Detail() {
    const detailStore = useDetail()
    const id = useRouter().params.orderId

    useEffect(() => {
        if (!id) {
            Taro.showToast({icon: 'none', title: '必要参数不能为空'})
            return
        }
        detailStore.setParams({orderId: Number(id) || 129071})
        detailStore.onLoad().then(res => {
            if (res.code !== 0) {
                Taro.showToast({icon: 'none', title: res.message})
            }
        })

        return () => {
            detailStore.clear()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [columnsNames] = useState<Array<TableColumnProps>>([
        {
            title: 'NO',
            key: 'no',
            align: 'center',
        },
        {
            title: '工序',
            key: 'process_name',
            align: 'center',
        },
        {
            title: '完成数',
            align: 'center',
            key: 'finish_count',
            render: (record: any) => {
                return (
                    <Text
                        style={{color: 'blue'}}
                        onClick={() => {
                            showList({item: record})
                        }}>
                        {record.finish_count}
                    </Text>
                )
            },
        },
        {
            title: '欠数',
            align: 'center',
            key: 'qianshu',
        },
        {
            title: '领菲人数',
            align: 'center',
            key: 'userNum',
        },
        {
            title: '最后领菲时间',
            align: 'center',
            key: 'create_time',
        },
    ])

    const datas = useMemo(() => {
        let list = detailStore.data?.processList || []
        if (list.length > 500) {
            list = list.slice(0, 100)
        }
        return list.map((item, index) => ({...item, no: index + 1}))
    }, [detailStore.data?.processList])

    return (
        <View className={styles.page}>
            {/* <View className={styles.fixed}>
                <SearchBar placeholder="搜索 订单号/工序" background="rgb(30, 130, 210)" />
            </View> */}
            <ProductItem item={detailStore.data?.order as unknown as API.Product.List.Item} />
            <View className={styles.box}>
                <Table columns={columnsNames} data={datas} bordered={false} />
            </View>
        </View>
    )
}

export default Detail
