/** @format */

import React, {useState} from 'react'
import {View} from '@tarojs/components'
import F2Canvas from '@/src/components/f2-canvas'
import {Chart} from '@antv/f2'
import {SearchBar} from '@nutui/nutui-react-taro'
import {debounce} from '@/src/utils/index'
import styles from './order.module.scss'
import Footer, {ChartType} from '../components/footer'
import {useOrder} from '../stores/order'

function Produce() {
    const [type, setType] = useState<ChartType>('bar')
    const [list, getOrder] = useOrder(state => [state.data, state.getData])

    // useEffect(() => {
    //     getOrder({orderNum: '10261692'})
    // }, [])

    const onInit = React.useCallback(
        async config => {
            const arr = list.map(item => ({...item, num: Number(item.num)}))
            const chart = new Chart({...config})

            if (type === 'bar') {
                chart.source(arr, {
                    num: {
                        tickCount: 5,
                    },
                })
                chart.interval().position('process_name*num')
                chart.render()

                const offset = -5
                const canvas = chart.get('canvas')
                const group = canvas.addGroup()
                const shapes = {}
                arr.forEach(function (obj) {
                    const point = chart.getPosition(obj)
                    const text = group.addShape('text', {
                        attrs: {
                            x: point.x,
                            y: point.y + offset,
                            text: obj.num,
                            textAlign: 'center',
                            textBaseline: 'bottom',
                            fill: '#808080',
                        },
                    })
                    shapes[obj.num] = text
                })
            } else {
                chart.source(arr, {
                    num: {
                        tickCount: 5,
                    },
                })
                chart.point().position('process_name*num').style('showControl', {
                    fill: '#fff',
                    lineWidth: 1,
                })
                chart.line().position('process_name*num')
                chart.render()
            }
            return chart
        },
        [type, list],
    )

    const onLoad = debounce(val => {
        getOrder({orderNum: val})
    }, 100) as (value: string, event: Event) => void

    return (
        <View className={styles.item}>
            <View className={styles.filter}>
                <SearchBar placeholder="输入已开始 订单号" onChange={onLoad} />
            </View>
            {list.length > 0 && (
                <>
                    <F2Canvas id="mimo_chart_produce" onInit={onInit} style="width: 100%; height: 60vh;" />
                    <Footer onChange={t => setType(t)} />
                </>
            )}
        </View>
    )
}

export default React.memo(Produce)
