/** @format */

import React, {useEffect, useMemo, useState} from 'react'
import {View, Picker, Text, CommonEventFunction, PickerSelectorProps} from '@tarojs/components'
import SegmentedControl from '@/src/components/segmented-control/index'
import F2Canvas from '@/src/components/f2-canvas'
import {Chart} from '@antv/f2'
import {useFactoryList} from '@/src/stores/factory-list'

import styles from './produce.module.scss'
import Footer, {ChartType} from '../components/footer'
import {useProduce} from '../stores/produce'

interface Items {
    name: '未开始' | '生产中'
    value: number
    label: string
}

function Produce() {
    const factoryList = useFactoryList(state => state.data)
    const [current, setCurrent] = useState({id: '0', name: '全部工厂'})
    const [type, setType] = useState<ChartType>('bar')
    const [tab, setTab] = useState(0)
    const [data, getData, setParams] = useProduce(state => [state.data, state.getData, state.setParams])

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const list = useMemo(() => {
        const arr = data.reduce((pre, cur) => {
            const item = {name: '', value: cur.produce_val, label: cur.x}
            if (tab === 1) {
                pre.push({...item, name: '未开始'})
            } else if (tab === 2) {
                pre.push({...item, name: '生产中'})
            } else {
                pre = pre.concat([
                    {...item, name: '未开始'},
                    {...item, name: '生产中'},
                ])
            }
            return pre
        }, [] as Items[])
        return arr
    }, [tab, data])

    const onInit = React.useCallback(
        async config => {
            const chart = new Chart({...config})
            if (type === 'bar') {
                chart.source(list)
                chart.coord({
                    transposed: true,
                })
                chart.interval().position('label*value').color('name').adjust({
                    type: 'dodge',
                    marginRatio: 0.05, // 设置分组间柱子的间距
                })
                chart.render()
            } else {
                chart.source(list)
                chart.scale('value', {
                    tickCount: 5,
                })
                chart.axis('label', {
                    label: {
                        rotate: Math.PI / 3,
                        textAlign: 'start',
                        textBaseline: 'middle',
                    },
                })
                chart.line().position('label*value').color('name')
                chart.render()
            }
            return chart
        },
        [type, list],
    )

    const facList = [{name: '全部工厂', id: 0}, ...factoryList]

    const onSelect: CommonEventFunction<PickerSelectorProps.ChangeEventDetail> = e => {
        const cur = facList[e.detail.value]
        if (cur) {
            setCurrent(cur)
            setParams({factory_id: cur.id})
            getData()
        }
    }

    const onChangeSegment = (index: number) => {
        setTab(index)
    }

    return (
        <View className={styles.item}>
            <View className={styles.filter}>
                <Picker mode="selector" range={facList} rangeKey="name" onChange={onSelect} className={styles.select}>
                    <Text className={styles.selectText}>{current.name}</Text>
                </Picker>
                <SegmentedControl list={['全部', '未开始', '生产中']} onChange={onChangeSegment} />
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
